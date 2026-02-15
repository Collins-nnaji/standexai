import { NextResponse } from "next/server";
import { ensurePrismaConnected, prisma, withPrismaReconnect } from "@/lib/prisma";

export const runtime = "nodejs";

type DiscoveryAuditHistoryRow = {
  id: string;
  url: string;
  keyword: string;
  title: string | null;
  geoScore: number;
  modelShare: number;
  sentiment: "positive" | "neutral" | "negative";
  createdAt: Date;
};

async function ensureDiscoveryAuditTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "DiscoveryAudit" (
      id TEXT PRIMARY KEY,
      "userId" TEXT,
      url TEXT NOT NULL,
      keyword TEXT NOT NULL,
      title TEXT,
      "geoScore" INTEGER NOT NULL,
      "modelShare" INTEGER NOT NULL,
      sentiment TEXT NOT NULL,
      "modelResults" JSONB NOT NULL,
      "citationAudit" JSONB NOT NULL,
      "semanticCheck" JSONB NOT NULL,
      "aiBlurb" TEXT NOT NULL,
      "llmsTxt" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function GET() {
  try {
    await ensurePrismaConnected();
    const rows = await withPrismaReconnect(async () => {
      await ensureDiscoveryAuditTable();
      return prisma.$queryRaw<DiscoveryAuditHistoryRow[]>`
        SELECT
          id,
          url,
          keyword,
          title,
          "geoScore",
          "modelShare",
          sentiment,
          "createdAt"
        FROM "DiscoveryAudit"
        ORDER BY "createdAt" DESC
        LIMIT 20
      `;
    });

    return NextResponse.json({
      audits: rows.map((row) => ({
        ...row,
        createdAt: row.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load discovery audit history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
