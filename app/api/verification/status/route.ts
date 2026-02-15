import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type VerificationStatusRow = {
  domain: string;
  method: "llms" | "meta" | "dns";
  status: "pending" | "verified";
  verifiedAt: Date | null;
  createdAt: Date;
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const domain = normalizeDomain(url.searchParams.get("domain") ?? "");
    if (!domain) {
      return NextResponse.json({ error: "domain is required" }, { status: 400 });
    }

    await ensureVerificationTable();
    const rows = await prisma.$queryRaw<VerificationStatusRow[]>`
      SELECT domain, method, status, "verifiedAt", "createdAt"
      FROM "DomainVerification"
      WHERE domain = ${domain}
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;

    const latestVerified = rows.find((row) => row.status === "verified");
    return NextResponse.json({
      domain,
      verified: Boolean(latestVerified),
      verifiedMethod: latestVerified?.method ?? null,
      verifiedAt: latestVerified?.verifiedAt?.toISOString() ?? null,
      attempts: rows.map((row) => ({
        method: row.method,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        verifiedAt: row.verifiedAt?.toISOString() ?? null,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load verification status";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
