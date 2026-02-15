import { resolveTxt } from "dns/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type CheckPayload = {
  verificationId?: string;
};

type VerificationRow = {
  id: string;
  domain: string;
  method: "llms" | "meta" | "dns";
  token: string;
  status: "pending" | "verified";
};

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

async function fetchHtml(domain: string) {
  const response = await fetch(`https://${domain}`, {
    method: "GET",
    headers: { "User-Agent": "StandexAI-Verification/1.0", Accept: "text/html,application/xhtml+xml" },
  });
  if (!response.ok) return "";
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("text/html")) return "";
  return response.text();
}

async function verify(row: VerificationRow) {
  if (row.method === "llms") {
    const response = await fetch(`https://${row.domain}/llms.txt`, {
      method: "GET",
      headers: { "User-Agent": "StandexAI-Verification/1.0", Accept: "text/plain,text/*" },
    });
    if (!response.ok) return { verified: false, evidence: "llms.txt not reachable" };
    const text = await response.text();
    const ok = text.includes(row.token);
    return { verified: ok, evidence: ok ? "Verification token found in llms.txt" : "Token not found in llms.txt" };
  }

  if (row.method === "meta") {
    const html = await fetchHtml(row.domain);
    const pattern = new RegExp(`<meta[^>]*name=["']standex-verification["'][^>]*content=["']${row.token}["'][^>]*>`, "i");
    const ok = pattern.test(html);
    return { verified: ok, evidence: ok ? "Meta verification tag found" : "Meta verification tag not found" };
  }

  const recordName = `_standex-verification.${row.domain}`;
  try {
    const txt = await resolveTxt(recordName);
    const flat = txt.flat().join(" ");
    const ok = flat.includes(row.token);
    return { verified: ok, evidence: ok ? "DNS TXT token found" : "DNS TXT token not found" };
  } catch {
    return { verified: false, evidence: "DNS TXT record not found" };
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckPayload;
    const verificationId = body.verificationId?.trim();
    if (!verificationId) {
      return NextResponse.json({ error: "verificationId is required" }, { status: 400 });
    }

    await ensureVerificationTable();

    const rows = await prisma.$queryRaw<VerificationRow[]>`
      SELECT id, domain, method, token, status
      FROM "DomainVerification"
      WHERE id = ${verificationId}
      LIMIT 1
    `;
    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: "Verification request not found" }, { status: 404 });
    }

    if (row.status === "verified") {
      return NextResponse.json({ verified: true, evidence: "Already verified" });
    }

    const result = await verify(row);
    if (result.verified) {
      await prisma.$executeRaw`
        UPDATE "DomainVerification"
        SET status = ${"verified"}, "verifiedAt" = NOW()
        WHERE id = ${row.id}
      `;
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to check verification";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
