import { NextRequest, NextResponse } from "next/server";
import { createChatCompletionsRequest, isLlmConfigured } from "@/lib/llm-client";

export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are the StandexAI Assessment Hub. You evaluate AI engineering and research knowledge.
Your goal is to generate high-level technical questions and evaluate responses.

Modes:
1. GENERATE: Provide a complex multiple-choice question about SOTA AI (LLMs, Multi-modal, RAG, etc.). 
2. EVALUATE: Given a question and a user's selected answer, explain if it's correct and provide the technically accurate reasoning.

Return JSON only:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctIndex": number,
  "explanation": "string (Professional, dense technical explanation)"
}`;

export async function POST(req: NextRequest) {
  if (!isLlmConfigured()) {
    return NextResponse.json({ error: "LLM not configured" }, { status: 500 });
  }

  try {
    const { mode, context } = await req.json();

    const userPrompt = mode === "GENERATE" 
      ? "Generate a new, extremely challenging AI engineering question regarding recent SOTA patterns (JEPA, SAE, or Matryoshka embeddings)."
      : `Evaluate this answer. Question: ${context.question}. Selected: ${context.selectedAnswer}. Correct Index was: ${context.correctIndex}. Explain why this is correct/incorrect in a very professional engineering tone.`;

    const { url, init } = createChatCompletionsRequest({
      temperature: 0.7,
      max_tokens: 800,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ]
    });

    const resp = await fetch(url, init);
    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({}));
      console.error("Azure OpenAI API Error:", {
        status: resp.status,
        data: errorData
      });
      return NextResponse.json({ error: "Upstream AI provider error" }, { status: 503 });
    }

    const data = await resp.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error("Malformed AI Response (Missing content):", data);
      throw new Error("No content received from AI model");
    }

    try {
      return NextResponse.json(JSON.parse(content));
    } catch (parseErr) {
      console.error("Failed to parse AI JSON content:", content);
      return NextResponse.json({ error: "Invalid AI response format" }, { status: 500 });
    }
  } catch (err) {
    console.error("AI Assessment General Error:", err);
    return NextResponse.json({ error: "Failed to generate assessment" }, { status: 500 });
  }
}
