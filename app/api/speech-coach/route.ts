import { NextResponse } from "next/server";
import { isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import { runSpeechCoachLlm } from "@/lib/speech-coach-llm";

export const runtime = "nodejs";

type Body = { transcript?: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const transcript = body.transcript?.trim() ?? "";
    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }
    if (transcript.length > 120_000) {
      return NextResponse.json({ error: "Transcript is too long" }, { status: 400 });
    }

    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    const result = await runSpeechCoachLlm(transcript);
    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Speech coach failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
