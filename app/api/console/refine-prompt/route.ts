import { NextResponse } from "next/server";
import { createChatCompletionsRequest, isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";

export const runtime = "nodejs";

type Body = { prompt?: string; goal?: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const raw = body.prompt?.trim();
    if (!raw) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }
    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    const goal = body.goal?.trim() || "Clear, specific instructions the model can follow";

    const { url, init } = createChatCompletionsRequest({
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You improve user prompts for LLM tasks. Return strict JSON only: {\"refined\": string, \"notes\": string}. No markdown fences.",
        },
        {
          role: "user",
          content: `Goal for the refined prompt: ${goal}

Original prompt:
${raw}

Rules:
- Preserve the user's intent and constraints.
- Add structure (role, task, format, edge cases) where helpful.
- Keep it concise but complete.`,
        },
      ],
    });

    const res = await fetch(url, init);
    if (!res.ok) {
      const t = await res.text();
      return NextResponse.json({ error: t.slice(0, 500) }, { status: 500 });
    }
    const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No AI content returned" }, { status: 500 });
    }
    let parsed: { refined?: string; notes?: string };
    try {
      parsed = JSON.parse(content) as { refined?: string; notes?: string };
    } catch {
      return NextResponse.json({ error: "Failed to parse AI output" }, { status: 500 });
    }
    const refined = parsed.refined?.trim();
    if (!refined) {
      return NextResponse.json({ error: "Refined prompt was empty" }, { status: 500 });
    }
    return NextResponse.json({
      refined,
      notes: parsed.notes?.trim() ?? "",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Refine failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
