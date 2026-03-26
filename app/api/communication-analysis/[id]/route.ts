import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import { ensurePrismaConnected, prismaDb, withPrismaReconnect } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await ensurePrismaConnected();
    const { data: session } = await neonAuth.getSession();
    const email = session?.user?.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getOrCreateCurrentUserId({
      userEmailHeader: email,
      userNameHeader: session?.user?.name ?? undefined,
    });

    const { id } = await ctx.params;
    if (!id?.trim()) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const row = await withPrismaReconnect(() =>
      prismaDb.communicationAnalysis.findFirst({
        where: { id, userId },
        select: {
          id: true,
          title: true,
          source: true,
          kind: true,
          contentText: true,
          overallScore: true,
          toneScore: true,
          riskScore: true,
          clarityScore: true,
          aiProbability: true,
          riskLevel: true,
          createdAt: true,
        },
      }),
    );

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ analysis: row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load analysis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
