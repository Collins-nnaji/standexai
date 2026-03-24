import { NextResponse } from "next/server";
import { isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";
import { runCommunicationAgent } from "@/lib/communication-agent/run";

export const runtime = "nodejs";

type Body = {
  goal?: string;
  text?: string;
  maxSteps?: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const goal = typeof body.goal === "string" ? body.goal.trim() : "";
    const text = typeof body.text === "string" ? body.text : "";

    if (!goal) {
      return NextResponse.json({ error: "goal is required (what you want the coach to achieve)" }, { status: 400 });
    }

    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    const maxSteps =
      typeof body.maxSteps === "number" && Number.isFinite(body.maxSteps)
        ? Math.min(16, Math.max(1, Math.floor(body.maxSteps)))
        : 10;

    const result = await runCommunicationAgent({ goal, initialText: text, maxSteps });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Agent run failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
