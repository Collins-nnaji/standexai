import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import { ensurePrismaConnected, prismaDb, withPrismaReconnect } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

const MAX_BODY = 500_000;

function clampBody(raw: string): string {
  return raw.slice(0, MAX_BODY);
}

function clampTitle(raw: string): string {
  const t = raw.trim().replace(/\s+/g, " ");
  if (t.length <= 120) return t || "Practice run";
  return `${t.slice(0, 117)}…`;
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
      prismaDb.skillsRun.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          title: true,
          mode: true,
          examFramework: true,
          overallBand: true,
          createdAt: true,
        },
      }),
    );

    const recent = rows.map((r) => ({
      id: r.id,
      title: r.title,
      mode: r.mode,
      examFramework: r.examFramework,
      overallBand: r.overallBand,
      createdAt: r.createdAt.toISOString(),
    }));

    return NextResponse.json({ recent });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type Body = {
  title?: string;
  mode?: string;
  examFramework?: string | null;
  taskPrompt?: string | null;
  bodyText?: string;
  simPrompt?: string | null;
  overallBand?: number | null;
  resultJson?: unknown;
};

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

    const body = (await req.json()) as Body;
    const text = typeof body.bodyText === "string" ? body.bodyText.trim() : "";
    if (!text) {
      return NextResponse.json({ error: "bodyText is required" }, { status: 400 });
    }

    const mode = (body.mode ?? "writing").slice(0, 32) || "writing";
    const title = clampTitle(body.title ?? "");
    const examFramework =
      body.examFramework == null || body.examFramework === ""
        ? null
        : String(body.examFramework).slice(0, 64);
    const taskPrompt =
      typeof body.taskPrompt === "string" && body.taskPrompt.trim() ? body.taskPrompt.trim().slice(0, MAX_BODY) : null;
    const simPrompt =
      typeof body.simPrompt === "string" && body.simPrompt.trim() ? body.simPrompt.trim().slice(0, MAX_BODY) : null;

    let overallBand: number | null = null;
    if (typeof body.overallBand === "number" && !Number.isNaN(body.overallBand)) {
      overallBand = body.overallBand;
    }

    const row = await withPrismaReconnect(() =>
      prismaDb.skillsRun.create({
        data: {
          userId,
          title,
          mode,
          examFramework,
          taskPrompt,
          bodyText: clampBody(text),
          simPrompt,
          overallBand,
          resultJson:
            body.resultJson === undefined || body.resultJson === null
              ? undefined
              : (body.resultJson as object),
        },
        select: {
          id: true,
          title: true,
          mode: true,
          createdAt: true,
        },
      }),
    );

    return NextResponse.json({ run: row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save run";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
