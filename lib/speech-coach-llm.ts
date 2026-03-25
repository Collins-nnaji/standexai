/**
 * LLM-backed professional speaking coach (transcript-only; audio prosody not required).
 */
import { createChatCompletionsRequest, isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";

const SPEECH_COACH_SYSTEM = `You are an expert executive communication and vocal delivery coach. The user will paste a transcript of something they said (from a recording, practice pitch, meeting, or presentation). You do NOT judge the written document — you coach how they *sound* when speaking professionally.

Return a single JSON object with this exact shape (no markdown fences):
{
  "overallSummary": "2-4 sentences on delivery, clarity, and professional presence",
  "deliveryScore": number from 0-100 (holistic professional speaking quality from transcript cues: structure, filler, confidence signals in wording, repetition)",
  "strengths": ["2-5 specific strengths visible from the transcript"],
  "priorityImprovements": ["3-6 concrete, actionable improvements — ordered by impact"],
  "fillerAndHabits": [
    { "pattern": "word or habit (e.g. um, like, you know)", "note": "approximate frequency or context", "tip": "how to reduce or replace" }
  ],
  "professionalTone": {
    "assessment": "1-2 sentences on how professional/executive the word choice and structure read aloud",
    "tips": ["2-4 tips to sound more authoritative, clear, or warm as appropriate"]
  },
  "practicePrompt": "One short paragraph: what to try on the next take (e.g. open with X, pause after Y, cut Z)"
}

Rules:
- Infer from transcript only; note that pace/pitch were not measured.
- Be direct and constructive, not harsh.
- If the transcript is very short, say so and still give best-effort tips.
Return valid JSON only.`;

export type SpeechCoachResult = {
  overallSummary: string;
  deliveryScore: number;
  strengths: string[];
  priorityImprovements: string[];
  fillerAndHabits: Array<{ pattern: string; note: string; tip: string }>;
  professionalTone: { assessment: string; tips: string[] };
  practicePrompt: string;
};

export async function runSpeechCoachLlm(transcript: string): Promise<SpeechCoachResult> {
  if (!isLlmConfigured()) {
    throw new Error(llmMissingConfigMessage());
  }
  const { url, init } = createChatCompletionsRequest({
    temperature: 0.35,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SPEECH_COACH_SYSTEM },
      { role: "user", content: `Transcript of spoken content:\n\n${transcript}` },
    ],
  });
  const response = await fetch(url, init);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Speech coach failed: ${errorText}`);
  }
  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No coaching response returned");
  const parsed = JSON.parse(content) as SpeechCoachResult;
  if (typeof parsed.overallSummary !== "string") {
    throw new Error("Invalid coach response shape");
  }
  return parsed;
}
