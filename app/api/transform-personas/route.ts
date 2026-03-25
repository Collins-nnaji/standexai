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

export async function GET() {
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

    const rows = await withPrismaReconnect(() =>
      prismaDb.transformPersona.findMany({
        where: { userId },
        orderBy: { updatedAt: "desc" },
        select: { id: true, name: true, instructions: true, createdAt: true, updatedAt: true },
      }),
    );

    return NextResponse.json({ personas: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load personas";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type PostBody = { name?: string; instructions?: string };

export async function POST(req: Request) {
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

    const body = (await req.json()) as PostBody;
    const name = clampName(body.name ?? "");
    const instructions = (body.instructions ?? "").trim();
    if (!instructions) {
      return NextResponse.json({ error: "Instructions are required" }, { status: 400 });
    }
    if (instructions.length > MAX_INSTRUCTIONS) {
      return NextResponse.json({ error: "Instructions are too long" }, { status: 400 });
    }

    const row = await withPrismaReconnect(() =>
      prismaDb.transformPersona.create({
        data: { userId, name, instructions },
        select: { id: true, name: true, instructions: true, createdAt: true, updatedAt: true },
      }),
    );

    return NextResponse.json({ persona: row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save persona";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
