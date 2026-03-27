/**
 * Shared analyze + rewrite LLM calls for API routes and the console.
 */
import { createChatCompletionsRequest, isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";

export type AnalyzeType =
  | "text"
  | "risk"
  | "intent"
  | "detect"
  | "readability"
  | "structure"
  | "inclusion"
  | "claims";

export type RewriteMode =
  | "professional"
  | "friendly"
  | "persuasive"
  | "safe"
  | "speaker"
  | "neutral"
  | "concise"
  | "executive"
  | "empathetic";

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

  readability: `You are an expert editor focused on clarity and readability for business writing. Return JSON:
{
  "readingEaseScore": number (0-100, higher = easier to read),
  "gradeLevelApprox": string (e.g. "9th grade", "college"),
  "avgSentenceLength": number (words),
  "longSentenceCount": number (sentences over 35 words),
  "wordCount": number,
  "issues": [
    {
      "text": "exact phrase or sentence from input",
      "issue": "why it hurts readability",
      "fix": "concise rewrite suggestion"
    }
  ],
  "summary": "2-3 sentence assessment",
  "recommendations": ["bullet improvements"]
}
Return valid JSON only.`,

  structure: `You are an expert in business and corporate communications structure. Assess outline, flow, and missing elements. Return JSON:
{
  "documentTypeGuess": "memo" | "email" | "press_release" | "report" | "speech" | "other",
  "hasClearAsk": boolean,
  "missingSections": ["what is missing for this document type"],
  "strengths": ["structural strengths"],
  "suggestedOutline": ["ordered section headings that would improve the doc"],
  "summary": "2-3 sentence structural assessment"
}
Return valid JSON only.`,

  inclusion: `You are an expert in inclusive language, accessibility of wording, and respectful tone in workplace communications. Return JSON:
{
  "inclusionScore": number (0-100, higher = more inclusive and respectful),
  "flags": [
    {
      "text": "exact phrase from input",
      "issue": "why it may exclude or harm",
      "suggestion": "more inclusive alternative"
    }
  ],
  "summary": "overall inclusion assessment",
  "goodPractices": ["inclusive phrasing already present"]
}
Return valid JSON only.`,

  claims: `You are an expert in corporate disclosure and responsible marketing. Flag overstated, unverifiable, or risky factual claims. Return JSON:
{
  "overclaimRisk": "low" | "medium" | "high",
  "flags": [
    {
      "text": "exact phrase or claim from input",
      "concern": "why it may be problematic",
      "suggestion": "safer, more supportable wording"
    }
  ],
  "summary": "overall assessment of claims and certainty",
  "recommendations": ["how to tighten language"]
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
  concise:
    "Rewrite to be tighter and shorter without losing meaning. Prefer strong verbs, remove filler, shorten sentences, and cut redundancy while staying professional.",
  executive:
    "Rewrite for executive and board audiences: crisp, strategic, confident. Lead with outcomes and implications; use minimal jargon; favor bullets and scannable structure where it helps.",
  empathetic:
    "Rewrite with genuine empathy and care while staying professional. Acknowledge the reader's perspective, use inclusive language, and keep a calm, human tone suitable for sensitive or customer-facing comms.",
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

const REWRITE_JSON_INSTRUCTION = `Return a JSON object:
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
Return valid JSON only. Do not use markdown fences.`;

export async function runRewriteLlm(text: string, mode: RewriteMode): Promise<unknown> {
  if (!isLlmConfigured()) {
    throw new Error(llmMissingConfigMessage());
  }
  const directive = REWRITE_MODE_INSTRUCTIONS[mode];
  return runRewriteLlmWithInstructions(text, directive);
}

/** Rewrite using arbitrary persona instructions (saved custom personas). */
export async function runRewriteLlmWithInstructions(text: string, personaInstructions: string): Promise<unknown> {
  if (!isLlmConfigured()) {
    throw new Error(llmMissingConfigMessage());
  }
  const directive = personaInstructions.trim();
  if (!directive) {
    throw new Error("Persona instructions are empty");
  }
  const { url, init } = createChatCompletionsRequest({
    temperature: 0.5,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an expert communication coach and rewriter. Apply the following voice and goals precisely:

${directive}

${REWRITE_JSON_INSTRUCTION}`,
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

const PERSONA_FROM_DESCRIPTION_SYSTEM = `The user describes a writing or speaking "persona" they want for transforming text (e.g. "our VP of legal", "warm onboarding emails for SaaS", "blunt technical RFC style").

Return a single JSON object (no markdown):
{
  "name": "short label for the persona, max 8 words, title case",
  "instructions": "2–6 sentences of clear rewriter instructions the model will follow. Be specific about tone, vocabulary, structure, audience, and what to avoid. This text will be injected into a rewrite system prompt."
}

Rules:
- "instructions" must be self-contained and actionable for rewriting any draft.
- Do not include JSON inside "instructions".
- If the description is vague, infer reasonable defaults and say so briefly in instructions.`;

export type GeneratedPersonaDraft = { name: string; instructions: string };

export async function runGeneratePersonaFromDescription(description: string): Promise<GeneratedPersonaDraft> {
  if (!isLlmConfigured()) {
    throw new Error(llmMissingConfigMessage());
  }
  const { url, init } = createChatCompletionsRequest({
    temperature: 0.45,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: PERSONA_FROM_DESCRIPTION_SYSTEM },
      { role: "user", content: description.trim() },
    ],
  });
  const response = await fetch(url, init);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Persona generation failed: ${errorText}`);
  }
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No persona draft returned");
  const parsed = JSON.parse(content) as { name?: string; instructions?: string };
  const name = typeof parsed.name === "string" ? parsed.name.trim().slice(0, 120) : "";
  const instructions = typeof parsed.instructions === "string" ? parsed.instructions.trim() : "";
  if (!name || !instructions) {
    throw new Error("Invalid persona draft from model");
  }
  return { name, instructions };
}
