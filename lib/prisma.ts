import { Prisma, PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL && process.env.NEON_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.NEON_DATABASE_URL;
}

if (!process.env.NEON_DATABASE_URL && process.env.DATABASE_URL) {
  process.env.NEON_DATABASE_URL = process.env.DATABASE_URL;
}

function normalizePoolerUrl(rawUrl: string | undefined) {
  if (!rawUrl) return rawUrl;
  if (!rawUrl.startsWith("postgres://") && !rawUrl.startsWith("postgresql://")) return rawUrl;
  try {
    const parsed = new URL(rawUrl);
    const isNeon = parsed.hostname.includes("neon.tech");
    const isNeonPooler = isNeon && parsed.hostname.includes("-pooler.");
    if (isNeonPooler) {
      if (!parsed.searchParams.has("pgbouncer")) parsed.searchParams.set("pgbouncer", "true");
      if (!parsed.searchParams.has("connect_timeout")) parsed.searchParams.set("connect_timeout", "15");
      // Serverless: avoid holding many connections; reconnect when closed
      if (!parsed.searchParams.has("connection_limit")) parsed.searchParams.set("connection_limit", "1");
    } else if (isNeon) {
      // Direct Neon host (migrations / non-pooler): still tighten timeouts; use pooler URL in prod app if you see idle "Closed" noise
      if (!parsed.searchParams.has("sslmode")) parsed.searchParams.set("sslmode", "require");
      if (!parsed.searchParams.has("connect_timeout")) parsed.searchParams.set("connect_timeout", "15");
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
}

process.env.DATABASE_URL = normalizePoolerUrl(process.env.DATABASE_URL);
process.env.NEON_DATABASE_URL = normalizePoolerUrl(process.env.NEON_DATABASE_URL);

declare global {
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const isDev = process.env.NODE_ENV === "development";
  const client = new PrismaClient({
    log: isDev
      ? [
          { emit: "stdout", level: "warn" },
          // Route errors through $on so we can skip transient Neon "connection closed" noise (retries handle it).
          { emit: "event", level: "error" },
        ]
      : ["error"],
  });

  if (isDev) {
    client.$on("error", (e) => {
      if (isClosedConnectionLogMessage(e.message)) return;
      console.error("prisma:error", e.message);
    });
  }

  return client;
}

const basePrisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = basePrisma;
}

let connectInFlight: Promise<void> | null = null;

export async function ensurePrismaConnected() {
  if (connectInFlight) {
    await connectInFlight;
    return;
  }

  connectInFlight = basePrisma.$connect().finally(() => {
    connectInFlight = null;
  });

  await connectInFlight;
}

/** Prisma log line / driver debug output for idle-closed TCP (common on Neon). */
function isClosedConnectionLogMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("kind: closed") ||
    (m.includes("postgresql connection") && m.includes("closed")) ||
    m.includes("server has closed the connection") ||
    m.includes("p1017")
  );
}

/**
 * Match transient DB disconnects (Neon idle close, pooler, serverless, etc.).
 * Some drivers emit `Error { kind: Closed, cause: None }` with an empty `.message`,
 * so we inspect `kind`, `code`, and `cause` — not only `message`.
 */
function isClosedConnectionError(error: unknown): boolean {
  if (error == null) return false;

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // P1017: Server has closed the connection
    if (error.code === "P1017") return true;
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    if (isClosedConnectionLogMessage(error.message)) return true;
  }

  if (typeof error === "object" && error !== null) {
    const k = (error as { kind?: unknown }).kind;
    if (k === "Closed" || k === "closed") return true;
  }

  const parts: string[] = [];

  const walk = (e: unknown, depth: number) => {
    if (e == null || depth > 5) return;
    if (typeof e === "string") {
      parts.push(e);
      return;
    }
    if (e instanceof Error) {
      parts.push(e.name, e.message);
    }
    parts.push(String(e));
    if (typeof e === "object") {
      const o = e as Record<string, unknown>;
      if (typeof o.kind === "string") parts.push(o.kind);
      if (typeof o.code === "string") parts.push(o.code);
      if (o.cause) walk(o.cause, depth + 1);
    }
  };

  walk(error, 0);

  const str = parts.join(" ").toLowerCase();
  return (
    str.includes("kind: closed") ||
    str.includes("closed") ||
    str.includes("postgresql connection") ||
    str.includes("connection closed") ||
    str.includes("econnreset") ||
    str.includes("connection refused") ||
    str.includes("broken pipe") ||
    str.includes("server closed the connection")
  );
}

export async function withPrismaReconnect<T>(operation: () => Promise<T>) {
  try {
    return await operation();
  } catch (error) {
    if (!isClosedConnectionError(error)) throw error;
    await basePrisma.$disconnect().catch(() => undefined);
    await ensurePrismaConnected();
    return operation();
  }
}

export const prisma = basePrisma.$extends({
  query: {
    async $queryRaw({ args, query }) {
      try {
        return await query(args);
      } catch (error) {
        if (!isClosedConnectionError(error)) throw error;
        await basePrisma.$disconnect().catch(() => undefined);
        await ensurePrismaConnected();
        return query(args);
      }
    },
    async $executeRaw({ args, query }) {
      try {
        return await query(args);
      } catch (error) {
        if (!isClosedConnectionError(error)) throw error;
        await basePrisma.$disconnect().catch(() => undefined);
        await ensurePrismaConnected();
        return query(args);
      }
    },
    $allModels: {
      async $allOperations({ args, query }) {
        try {
          return await query(args);
        } catch (error) {
          if (!isClosedConnectionError(error)) throw error;
          await basePrisma.$disconnect().catch(() => undefined);
          await ensurePrismaConnected();
          return query(args);
        }
      },
    },
  },
});

/**
 * Same runtime client as `prisma`. Prisma's `$extends` can narrow TypeScript so model
 * delegates are missing; this cast restores `PrismaClient` typings for all models.
 */
export const prismaDb = prisma as unknown as PrismaClient;
