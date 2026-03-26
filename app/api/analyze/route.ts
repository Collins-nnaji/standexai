import { NextResponse } from "next/server";
import { isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import { runAnalyzeLlm, type AnalyzeType } from "@/lib/communication-llm";

const VALID_ANALYZE_TYPES: AnalyzeType[] = [
  "text",
  "risk",
  "intent",
  "detect",
  "readability",
  "structure",
  "inclusion",
  "claims",
];

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

    if (!body.type || !VALID_ANALYZE_TYPES.includes(body.type)) {
      return NextResponse.json(
        { error: `Valid type is required: ${VALID_ANALYZE_TYPES.join("|")}` },
        { status: 400 },
      );
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
