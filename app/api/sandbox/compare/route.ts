import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ProviderResult = {
  provider: string;
  status: "ok" | "missing_key" | "error";
  latencyMs?: number;
  tokens?: number;
  output?: string;
  error?: string;
};

async function callOpenAI(prompt: string): Promise<ProviderResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return { provider: "OpenAI", status: "missing_key" };

  const started = Date.now();
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: "You are a helpful assistant. Answer concisely." },
        { role: "user", content: prompt },
      ],
    }),
  });

  const latencyMs = Date.now() - started;

  if (!response.ok) {
    const error = await response.text();
    return { provider: "OpenAI", status: "error", latencyMs, error };
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }>; usage?: { total_tokens?: number } };
  const output = data.choices?.[0]?.message?.content ?? "";

  return { provider: "OpenAI", status: "ok", latencyMs, tokens: data.usage?.total_tokens ?? 0, output };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { prompt?: string };
    const prompt = body.prompt?.trim();
    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const results: ProviderResult[] = [];
    results.push(await callOpenAI(prompt));

    return NextResponse.json({
      results,
      notes: "Add provider keys to compare more models. Missing keys return stub status.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sandbox compare failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
