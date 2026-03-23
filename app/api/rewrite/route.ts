import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RewritePayload = {
  text: string;
  mode: "professional" | "friendly" | "persuasive" | "safe" | "speaker" | "neutral";
};

const MODE_INSTRUCTIONS: Record<string, string> = {
  professional: "Rewrite in a polished, professional business tone. Use clear, authoritative language suitable for corporate communication.",
  friendly: "Rewrite in a warm, approachable, and conversational tone. Be personable while maintaining clarity and respect.",
  persuasive: "Rewrite to be compelling and persuasive. Use strong rhetoric, clear calls to action, and emotionally resonant language.",
  safe: "Rewrite to remove all risky, aggressive, or potentially harmful language. Make it safe for any audience and context. Prioritize inclusivity and neutrality.",
  speaker: "Rewrite as a powerful speech/presentation script. Optimize for verbal delivery with strong openings, clear transitions, emphasis points, and a memorable closing. Add pacing cues.",
  neutral: "Rewrite in a balanced, objective, neutral tone. Remove any bias, emotional language, or persuasion tactics.",
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RewritePayload;

    if (!body.text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!body.mode || !MODE_INSTRUCTIONS[body.mode]) {
      return NextResponse.json({ error: "Valid mode required: professional|friendly|persuasive|safe|speaker|neutral" }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are an expert communication coach and rewriter. ${MODE_INSTRUCTIONS[body.mode]}

Return a JSON object:
{
  "rewritten": "the full rewritten text",
  "changes": [
    {
      "original": "original phrase",
      "rewritten": "new phrase",
      "reason": "why this change was made"
    }
  ],
  "summary": "brief description of key changes made",
  "toneShift": "description of how the tone changed",
  "wordCountOriginal": number,
  "wordCountRewritten": number
}
Return valid JSON only. Do not use markdown fences.`,
          },
          { role: "user", content: `Rewrite this text:\n\n${body.text}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Rewrite failed: ${errorText}` }, { status: 500 });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No rewrite returned" }, { status: 500 });
    }

    const result = JSON.parse(content);
    return NextResponse.json({ mode: body.mode, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Rewrite failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
