import { NextResponse } from "next/server";
import { ensurePrismaConnected, prisma, withPrismaReconnect } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

async function ensureSafetyAuditTable() {
    await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "SafetyAudit" (
      id TEXT PRIMARY KEY,
      "userId" TEXT,
      "scenarioName" TEXT NOT NULL,
      "scenarioId" TEXT NOT NULL,
      goal TEXT NOT NULL,
      "promptA" TEXT NOT NULL,
      "promptB" TEXT,
      "outputA" TEXT,
      "outputB" TEXT,
      status TEXT NOT NULL,
      "score" INTEGER NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function POST(req: Request) {
    try {
        await ensurePrismaConnected();
        const body = await req.json();
        const { scenarioName, scenarioId, goal, promptA, promptB, outputA, outputB, status, score } = body;

        const userId = await getOrCreateCurrentUserId({
            userIdHeader: req.headers.get("x-user-id") ?? undefined,
        });

        await ensureSafetyAuditTable();

        const audit = await prisma.$executeRaw`
      INSERT INTO "SafetyAudit" (
        id, "userId", "scenarioName", "scenarioId", goal, "promptA", "promptB", "outputA", "outputB", status, "score", "createdAt"
      ) VALUES (
        ${crypto.randomUUID()}, ${userId}, ${scenarioName}, ${scenarioId}, ${goal}, ${promptA}, ${promptB}, ${outputA}, ${outputB}, ${status}, ${score}, NOW()
      )
    `;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Safety Audit save failed:", error);
        return NextResponse.json({ error: "Failed to save audit result" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await ensurePrismaConnected();
        await ensureSafetyAuditTable();

        const audits = await prisma.$queryRaw`
      SELECT * FROM "SafetyAudit" ORDER BY "createdAt" DESC LIMIT 50
    `;

        return NextResponse.json({ audits });
    } catch (error) {
        console.error("Safety Audit fetch failed:", error);
        return NextResponse.json({ error: "Failed to fetch audit history" }, { status: 500 });
    }
}
