import { NextResponse } from "next/server";
import { 
  createChatCompletionsRequest, 
  isLlmConfigured, 
  llmMissingConfigMessage,
  getActiveLlmProvider,
  getDefaultChatModelLabel
} from "@/lib/llm-client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    const { messages, temperature = 0.7, max_tokens = 500, stream = false } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    // Image & Video Console request: we want logprobs if possible for visualization
    const { url, init } = createChatCompletionsRequest({
      messages,
      temperature,
      max_tokens,
      logprobs: true, // Requesting logprobs for next-token probability visualization
      top_logprobs: 5, // Top 5 candidates for the lab
    });

    const response = await fetch(url, init);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `LLM request failed: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      ...data,
      metadata: {
        provider: getActiveLlmProvider(),
        model: getDefaultChatModelLabel(),
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
