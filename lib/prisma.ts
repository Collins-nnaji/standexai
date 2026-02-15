import { PrismaClient } from "@prisma/client";

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
    const isNeonPooler = parsed.hostname.includes("neon.tech") && parsed.hostname.includes("-pooler.");
    if (isNeonPooler && !parsed.searchParams.has("pgbouncer")) {
      parsed.searchParams.set("pgbouncer", "true");
    }
    if (isNeonPooler && !parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", "15");
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

const basePrisma =
  global.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

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

function isClosedConnectionError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error ?? "");
  return message.includes("Error in PostgreSQL connection") || message.includes("kind: Closed");
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
