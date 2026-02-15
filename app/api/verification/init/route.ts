import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

type InitPayload = {
  domain?: string;
  method?: "llms" | "meta" | "dns";
};

function normalizeDomain(input: string) {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return "";
  const withProtocol = trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function generateToken() {
  return `standex-${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

async function ensureVerificationTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "DomainVerification" (
      id TEXT PRIMARY KEY,
      "userId" TEXT,
      domain TEXT NOT NULL,
      method TEXT NOT NULL,
      token TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      "verifiedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as InitPayload;
    const domain = normalizeDomain(body.domain ?? "");
    const method = body.method;

    if (!domain || !method || !["llms", "meta", "dns"].includes(method)) {
      return NextResponse.json({ error: "domain and valid method are required" }, { status: 400 });
    }

    const token = generateToken();
    const id = crypto.randomUUID();
    const userId = await getOrCreateCurrentUserId({
      userIdHeader: req.headers.get("x-user-id") ?? undefined,
      userEmailHeader: req.headers.get("x-user-email") ?? undefined,
      userNameHeader: req.headers.get("x-user-name") ?? undefined,
    });

    await ensureVerificationTable();
    await prisma.$executeRaw`
      INSERT INTO "DomainVerification" (id, "userId", domain, method, token, status)
      VALUES (${id}, ${userId}, ${domain}, ${method}, ${token}, ${"pending"})
    `;

    const instructions =
      method === "llms"
        ? {
            title: "Upload llms.txt to your root",
            location: `https://${domain}/llms.txt`,
            snippet: `verification: ${token}`,
          }
        : method === "meta"
          ? {
              title: "Add this meta tag to your <head>",
              location: `https://${domain}/`,
              snippet: `<meta name="standex-verification" content="${token}" />`,
            }
          : {
              title: "Add DNS TXT record",
              location: `_standex-verification.${domain}`,
              snippet: token,
            };

    return NextResponse.json({
      verificationId: id,
      domain,
      method,
      token,
      instructions,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to initialize verification";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
