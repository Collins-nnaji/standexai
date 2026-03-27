import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import { ensurePrismaConnected, prismaDb, withPrismaReconnect } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

const selectDetailNoContent = {
  id: true,
  title: true,
  source: true,
  kind: true,
  overallScore: true,
  toneScore: true,
  riskScore: true,
  clarityScore: true,
  aiProbability: true,
  riskLevel: true,
  createdAt: true,
} as const;

const selectDetailFull = {
  ...selectDetailNoContent,
  contentText: true,
} as const;

function isMissingContentTextColumn(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2022") return true;
  }
  const msg = error instanceof Error ? error.message : String(error);
  return /contentText|column.*does not exist/i.test(msg);
}

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

    let row: Awaited<
      ReturnType<typeof prismaDb.communicationAnalysis.findFirst<{ select: typeof selectDetailFull }>>
    > | null;

    try {
      row = await withPrismaReconnect(() =>
        prismaDb.communicationAnalysis.findFirst({
          where: { id, userId },
          select: selectDetailFull,
        }),
      );
    } catch (error) {
      if (!isMissingContentTextColumn(error)) throw error;
      const fallback = await withPrismaReconnect(() =>
        prismaDb.communicationAnalysis.findFirst({
          where: { id, userId },
          select: selectDetailNoContent,
        }),
      );
      row = fallback ? { ...fallback, contentText: null as string | null } : null;
    }

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      analysis: {
        ...row,
        createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load analysis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
