import { NextResponse } from "next/server";
import { isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import { runExamWritingEvaluation } from "@/lib/exam-eval-llm";

export const runtime = "nodejs";

const MAX_CHARS = 16_000;

/**
 * Analyse a speaking transcript (after client-side Whisper via /api/transcribe).
 * Uses the same text deployment as writing evaluation.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      transcript?: string;
      taskPrompt?: string;
    };
    const transcript = typeof body.transcript === "string" ? body.transcript.trim() : "";
    if (!transcript) {
      return NextResponse.json({ error: "transcript is required" }, { status: 400 });
    }
    if (transcript.length > MAX_CHARS) {
      return NextResponse.json({ error: `Transcript exceeds ${MAX_CHARS} characters` }, { status: 400 });
    }

    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 503 });
    }

    const taskPrompt =
      typeof body.taskPrompt === "string" && body.taskPrompt.trim() ? body.taskPrompt.trim() : undefined;

    const result = await runExamWritingEvaluation({
      text: transcript,
      framework: "ielts_speaking2",
      taskPrompt,
      timedContext: "Response produced under exam-style speaking conditions (transcript only).",
    });

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Speaking analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
