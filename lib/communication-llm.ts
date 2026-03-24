/**
 * Shared analyze + rewrite LLM calls for API routes and the communication agent.
 */
import { createChatCompletionsRequest, isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";

export type AnalyzeType = "text" | "risk" | "intent" | "detect";

export type RewriteMode = "professional" | "friendly" | "persuasive" | "safe" | "speaker" | "neutral";

export const ANALYZE_PROMPTS: Record<AnalyzeType, string> = {
  text: `You are an expert communication analyst. Analyze the given text and return a JSON object with:
{
  "toneScore": number (0-100, how appropriate and effective the tone is),
  "riskScore": number (0-100, 0=no risk, 100=very risky),
  "clarityScore": number (0-100, how clear and understandable),
  "overallScore": number (0-100, overall communication quality),
  "flags": [
    {
      "text": "the exact flagged phrase from the input",
      "severity": "critical" | "warning" | "info",
      "category": "toxic" | "unclear" | "risky" | "bias" | "aggressive" | "manipulative",
      "explanation": "why this is flagged",
      "suggestion": "a better alternative"
    }
  ],
  "summary": "2-3 sentence overall assessment",
  "strengths": ["list of what's done well"],
  "improvements": ["list of specific improvements"]
}
Be thorough but fair. Flag genuinely problematic phrases, not minor style preferences. Return valid JSON only.`,

  risk: `You are a compliance and risk analysis expert. Analyze the given text for legal, HR, and policy risks. Return JSON:
{
  "riskLevel": "low" | "medium" | "high" | "critical",
  "overallScore": number (0-100, 0=very risky, 100=safe),
  "issues": [
    {
      "category": "harassment" | "discrimination" | "threat" | "legal" | "policy" | "privacy",
      "text": "the exact problematic phrase",
      "severity": "critical" | "warning" | "info",
      "explanation": "detailed explanation of the risk",
      "saferVersion": "a compliant alternative"
    }
  ],
  "summary": "overall risk assessment",
  "recommendations": ["list of recommended actions"]
}
Return valid JSON only.`,

  intent: `You are a psychology and communication expert specializing in persuasion, manipulation, and bias detection. Analyze the text for hidden intent and psychological tactics. Return JSON:
{
  "overallAssessment": "neutral" | "mildly_persuasive" | "strongly_persuasive" | "manipulative",
  "confidenceScore": number (0-100, confidence in assessment),
  "tactics": [
    {
      "type": "social_pressure" | "emotional_manipulation" | "false_urgency" | "gaslighting" | "bandwagon" | "guilt_trip" | "fear_appeal" | "flattery" | "authority_bias" | "straw_man" | "appeal_to_emotion",
      "text": "the exact phrase using this tactic",
      "explanation": "how this tactic works and why it's used",
      "impact": "low" | "medium" | "high"
    }
  ],
  "biasDetected": ["list of cognitive biases present"],
  "summary": "overall psychological analysis",
  "neutralVersion": "a rewritten neutral version of the text"
}
Return valid JSON only.`,

  detect: `You are an AI content detection expert. Analyze the text to determine if it was likely written by AI or a human. Return JSON:
{
  "aiProbability": number (0-100, probability of being AI-generated),
  "verdict": "likely_human" | "mixed" | "likely_ai" | "definitely_ai",
  "sections": [
    {
      "text": "segment of text",
      "probability": number (0-100),
      "reason": "why this section seems AI or human"
    }
  ],
  "indicators": {
    "aiSignals": ["list of patterns suggesting AI"],
    "humanSignals": ["list of patterns suggesting human"]
  },
  "suggestions": ["how to make this more authentically human"],
  "summary": "overall detection assessment"
}
Return valid JSON only.`,
};

const REWRITE_MODE_INSTRUCTIONS: Record<RewriteMode, string> = {
  professional:
    "Rewrite in a polished, professional business tone. Use clear, authoritative language suitable for corporate communication.",
  friendly:
    "Rewrite in a warm, approachable, and conversational tone. Be personable while maintaining clarity and respect.",
  persuasive:
    "Rewrite to be compelling and persuasive. Use strong rhetoric, clear calls to action, and emotionally resonant language.",
  safe: "Rewrite to remove all risky, aggressive, or potentially harmful language. Make it safe for any audience and context. Prioritize inclusivity and neutrality.",
  speaker:
    "Rewrite as a powerful speech/presentation script. Optimize for verbal delivery with strong openings, clear transitions, emphasis points, and a memorable closing. Add pacing cues.",
  neutral:
    "Rewrite in a balanced, objective, neutral tone. Remove any bias, emotional language, or persuasion tactics.",
};

export async function runAnalyzeLlm(text: string, type: AnalyzeType): Promise<unknown> {
  if (!isLlmConfigured()) {
    throw new Error(llmMissingConfigMessage());
  }
  const { url, init } = createChatCompletionsRequest({
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ANALYZE_PROMPTS[type] },
      { role: "user", content: `Analyze this text:\n\n${text}` },
    ],
  });
  const response = await fetch(url, init);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI analysis failed: ${errorText}`);
  }
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No analysis returned");
  return JSON.parse(content);
}

export async function runRewriteLlm(text: string, mode: RewriteMode): Promise<unknown> {
  if (!isLlmConfigured()) {
    throw new Error(llmMissingConfigMessage());
  }
  const { url, init } = createChatCompletionsRequest({
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert communication coach and rewriter. ${REWRITE_MODE_INSTRUCTIONS[mode]}

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
      { role: "user", content: `Rewrite this text:\n\n${text}` },
    ],
  });
  const response = await fetch(url, init);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Rewrite failed: ${errorText}`);
  }
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No rewrite returned");
  return JSON.parse(content);
}
