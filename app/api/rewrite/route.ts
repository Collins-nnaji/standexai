import { NextResponse } from "next/server";
import { isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import { runRewriteLlm, type RewriteMode } from "@/lib/communication-llm";

export const runtime = "nodejs";

type RewritePayload = {
  text: string;
  mode: RewriteMode;
};

const MODES: RewriteMode[] = ["professional", "friendly", "persuasive", "safe", "speaker", "neutral"];

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RewritePayload;

    if (!body.text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!body.mode || !MODES.includes(body.mode)) {
      return NextResponse.json(
        { error: "Valid mode required: professional|friendly|persuasive|safe|speaker|neutral" },
        { status: 400 },
      );
    }

    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    const result = await runRewriteLlm(body.text, body.mode);
    return NextResponse.json({ mode: body.mode, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rewrite failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
