import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import {
  ensurePrismaConnected,
  prismaDb,
  withPrismaReconnect,
} from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

/** Sidebar history — lightweight list (avoids heavy /api/console dashboard work). */
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
      prismaDb.communicationAnalysis.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
          id: true,
          title: true,
          source: true,
          riskLevel: true,
          overallScore: true,
          createdAt: true,
        },
      }),
    );

    const recent = rows.map((r) => ({
      id: r.id,
      title: r.title,
      source: r.source,
      riskLevel: r.riskLevel,
      overallScore: r.overallScore,
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
  source?: "TEXT" | "VOICE" | "DICTATE";
  kind?: string;
  /** Draft text at save time (optional for backwards compatibility). */
  contentText?: string | null;
  overallScore?: number | null;
  toneScore?: number | null;
  riskScore?: number | null;
  clarityScore?: number | null;
  aiProbability?: number | null;
  riskLevel?: string | null;
};

const MAX_CONTENT = 500_000;

function clampContent(raw: string | null | undefined): string | undefined {
  if (raw == null) return undefined;
  const t = raw.slice(0, MAX_CONTENT);
  return t.length === 0 ? undefined : t;
}

function clampTitle(raw: string): string {
  const t = raw.trim().replace(/\s+/g, " ");
  if (t.length <= 120) return t || "Untitled";
  return `${t.slice(0, 117)}…`;
}

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
    const title = clampTitle(body.title ?? "");
    const raw = body.source;
    const source =
      raw === "VOICE" || raw === "DICTATE" ? raw : "TEXT";
    const kind = (body.kind ?? "full").slice(0, 32) || "full";

    const row = await withPrismaReconnect(() =>
      prismaDb.communicationAnalysis.create({
        data: {
          userId,
          title,
          source,
          kind,
          contentText: clampContent(body.contentText ?? undefined),
          overallScore: body.overallScore ?? undefined,
          toneScore: body.toneScore ?? undefined,
          riskScore: body.riskScore ?? undefined,
          clarityScore: body.clarityScore ?? undefined,
          aiProbability: body.aiProbability ?? undefined,
          riskLevel: body.riskLevel?.toLowerCase() ?? undefined,
        },
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

    return NextResponse.json({ analysis: row });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save analysis";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
