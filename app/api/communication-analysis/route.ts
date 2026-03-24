import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import {
  ensurePrismaConnected,
  prismaDb,
  withPrismaReconnect,
} from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

type Body = {
  title?: string;
  source?: "TEXT" | "VOICE";
  kind?: string;
  overallScore?: number | null;
  toneScore?: number | null;
  riskScore?: number | null;
  clarityScore?: number | null;
  aiProbability?: number | null;
  riskLevel?: string | null;
};

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
    const source = body.source === "VOICE" ? "VOICE" : "TEXT";
    const kind = (body.kind ?? "full").slice(0, 32) || "full";

    const row = await withPrismaReconnect(() =>
      prismaDb.communicationAnalysis.create({
        data: {
          userId,
          title,
          source,
          kind,
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
