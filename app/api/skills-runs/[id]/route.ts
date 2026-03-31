import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import { ensurePrismaConnected, prismaDb, withPrismaReconnect } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

const selectFull = {
  id: true,
  title: true,
  mode: true,
  examFramework: true,
  taskPrompt: true,
  bodyText: true,
  simPrompt: true,
  overallBand: true,
  resultJson: true,
  createdAt: true,
} as const;

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
      prismaDb.skillsRun.findFirst({
        where: { id, userId },
        select: selectFull,
      }),
    );

    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
      run: {
        ...row,
        createdAt: row.createdAt.toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load run";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
