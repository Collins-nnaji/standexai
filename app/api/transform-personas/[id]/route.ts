import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import { ensurePrismaConnected, prismaDb, withPrismaReconnect } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

const MAX_NAME = 120;
const MAX_INSTRUCTIONS = 12_000;

function clampName(raw: string): string {
  const t = raw.trim().replace(/\s+/g, " ");
  if (t.length <= MAX_NAME) return t || "Untitled persona";
  return `${t.slice(0, MAX_NAME - 1)}…`;
}

type PatchBody = { name?: string; instructions?: string };

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
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
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const body = (await req.json()) as PatchBody;
    const data: { name?: string; instructions?: string } = {};
    if (body.name !== undefined) data.name = clampName(body.name);
    if (body.instructions !== undefined) {
      const ins = body.instructions.trim();
      if (!ins) {
        return NextResponse.json({ error: "Instructions cannot be empty" }, { status: 400 });
      }
      if (ins.length > MAX_INSTRUCTIONS) {
        return NextResponse.json({ error: "Instructions are too long" }, { status: 400 });
      }
      data.instructions = ins;
    }
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    const row = await withPrismaReconnect(() =>
      prismaDb.transformPersona.updateMany({
        where: { id, userId },
        data,
      }),
    );

    if (row.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await withPrismaReconnect(() =>
      prismaDb.transformPersona.findFirst({
        where: { id, userId },
        select: { id: true, name: true, instructions: true, createdAt: true, updatedAt: true },
      }),
    );

    return NextResponse.json({ persona: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
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
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const result = await withPrismaReconnect(() =>
      prismaDb.transformPersona.deleteMany({
        where: { id, userId },
      }),
    );

    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
