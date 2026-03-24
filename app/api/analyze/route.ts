import { NextResponse } from "next/server";
import { isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import { runAnalyzeLlm, type AnalyzeType } from "@/lib/communication-llm";

export const runtime = "nodejs";

type AnalyzePayload = {
  text: string;
  type: AnalyzeType;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnalyzePayload;

    if (!body.text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!body.type || !["text", "risk", "intent", "detect"].includes(body.type)) {
      return NextResponse.json({ error: "Valid type is required: text|risk|intent|detect" }, { status: 400 });
    }

    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    const result = await runAnalyzeLlm(body.text, body.type);
    return NextResponse.json({ type: body.type, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
