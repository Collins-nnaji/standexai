import { NextResponse } from "next/server";
import { isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import { type ExamFramework, runExamWritingEvaluation } from "@/lib/exam-eval-llm";

export const runtime = "nodejs";

const FRAMEWORKS: ExamFramework[] = [
  "ielts_task2",
  "ielts_speaking2",
  "toefl_independent",
  "pte_essay",
  "det_writing",
];

const MAX_CHARS = 24_000;

type Body = {
  text?: string;
  framework?: ExamFramework;
  taskPrompt?: string;
  timedContext?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    if (text.length > MAX_CHARS) {
      return NextResponse.json({ error: `Text exceeds ${MAX_CHARS} characters` }, { status: 400 });
    }

    const framework = body.framework;
    if (!framework || !FRAMEWORKS.includes(framework)) {
      return NextResponse.json(
        { error: `framework must be one of: ${FRAMEWORKS.join(", ")}` },
        { status: 400 },
      );
    }

    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 503 });
    }

    const taskPrompt =
      typeof body.taskPrompt === "string" && body.taskPrompt.trim() ? body.taskPrompt.trim() : undefined;
    const timedContext =
      typeof body.timedContext === "string" && body.timedContext.trim() ? body.timedContext.trim() : undefined;

    const result = await runExamWritingEvaluation({
      text,
      framework,
      taskPrompt,
      timedContext,
    });

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Evaluation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
