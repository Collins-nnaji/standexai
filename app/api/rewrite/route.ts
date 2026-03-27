import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import { isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import {
  runRewriteLlm,
  runRewriteLlmWithInstructions,
  type RewriteMode,
} from "@/lib/communication-llm";
import { ensurePrismaConnected, prismaDb, withPrismaReconnect } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export const runtime = "nodejs";

type RewritePayload = {
  text: string;
  mode?: RewriteMode;
  personaId?: string;
};

const MODES: RewriteMode[] = [
  "professional",
  "friendly",
  "persuasive",
  "safe",
  "speaker",
  "neutral",
  "concise",
  "executive",
  "empathetic",
];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RewritePayload;

    if (!body.text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    const personaId = body.personaId?.trim();
    if (personaId) {
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
      const persona = await withPrismaReconnect(() =>
        prismaDb.transformPersona.findFirst({
          where: { id: personaId, userId },
          select: { id: true, name: true, instructions: true },
        }),
      );
      if (!persona) {
        return NextResponse.json({ error: "Persona not found" }, { status: 404 });
      }
      const result = await runRewriteLlmWithInstructions(body.text, persona.instructions);
      return NextResponse.json({ personaId: persona.id, personaName: persona.name, result });
    }

    if (!body.mode || !MODES.includes(body.mode)) {
      return NextResponse.json(
        { error: "Valid mode or personaId required" },
        { status: 400 },
      );
    }

    const result = await runRewriteLlm(body.text, body.mode);
    return NextResponse.json({ mode: body.mode, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rewrite failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
