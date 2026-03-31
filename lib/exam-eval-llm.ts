/**
 * Exam-style evaluation using the configured Azure text deployment
 * (AZURE_OPENAI_DEPLOYMENT_TEXT — e.g. gpt-4o).
 */
import { createChatCompletionsRequest, isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";

export type ExamFramework = "ielts_task2" | "ielts_speaking2" | "toefl_independent" | "pte_essay" | "det_writing";

const EXAM_CONTEXT: Record<ExamFramework, string> = {
  ielts_task2:
    "IELTS Academic or General Training Writing Task 2: discursive essay, minimum 250 words, formal register.",
  ielts_speaking2:
    "IELTS Speaking Part 2: long turn (~2 minutes). Assess as spoken English from the transcript (fluency, coherence, vocabulary, grammar). Pronunciation cannot be fully judged from text alone — infer from word choice, fillers, and clarity of expression.",
  toefl_independent: "TOEFL independent writing: clear position, development, and academic tone.",
  pte_essay: "PTE Academic essay: structure, development, and formal English.",
  det_writing: "Duolingo English Test writing sample: clarity, coherence, and range within typical length limits.",
};

const WRITING_SYSTEM = `You are an expert English exam assessor. You simulate THREE distinct rater perspectives using ONE model (clearly label them as analytical / conservative / balanced — do not claim they are separate API models).

Return a single JSON object (no markdown fences) with this exact shape:
{
  "examLabel": "string — human-readable exam name",
  "overallBand": number — overall predicted band/score on the exam's usual scale (IELTS-style 0-9 with half bands for writing; for non-IELTS use a 0-9 equivalent for consistency),
  "breakdown": {
    "taskResponse": { "band": number, "comment": "string" },
    "coherenceCohesion": { "band": number, "comment": "string" },
    "lexicalResource": { "band": number, "comment": "string" },
    "grammaticalRange": { "band": number, "comment": "string" }
  },
  "perspectives": [
    {
      "id": "analytical",
      "label": "string — e.g. Analytical rater",
      "band": number,
      "feedback": "string — 2-4 sentences",
      "focusNote": "string — what this rater weights heavily (e.g. argument structure)"
    },
    {
      "id": "conservative",
      "label": "string — e.g. Conservative rater",
      "band": number,
      "feedback": "string",
      "focusNote": "string — e.g. register, tone, safety"
    },
    {
      "id": "standex",
      "label": "Standex blend",
      "band": number,
      "feedback": "string",
      "focusNote": "string — balanced synthesis"
    }
  ],
  "whyScoresDiffer": "string — 2-5 sentences explaining why bands differ between perspectives",
  "problemSentences": [
    { "quote": "exact excerpt from submission", "issue": "string", "better": "string" }
  ],
  "fillerWordsIfAny": ["optional — spoken fillers detected in transcript, else empty array"],
  "improvedVersion": "string — full improved rewrite or spoken script",
  "rewriteBullets": ["string", "string"]
}

Rules:
- Bands 0-9, half-point increments for IELTS-style tasks.
- problemSentences: max 6 items, only real issues from the text.
- perspectives must have noticeably different bands or emphasis when justified; if submission is uniform quality, explain that.
- Be fair: acknowledge strengths, not only weaknesses.`;

const SPEAKING_EXTRA = `
For speaking (transcript-based), add to breakdown mentally: comment on fluency (pauses, repetition), lexical range, grammatical accuracy, and coherence. List fillerWordsIfAny from the transcript (e.g. um, uh, like, you know).`;

export type ExamEvaluateResult = Record<string, unknown>;

export async function runExamWritingEvaluation(args: {
  text: string;
  framework: ExamFramework;
  taskPrompt?: string;
  timedContext?: string;
}): Promise<ExamEvaluateResult> {
  if (!isLlmConfigured()) {
    throw new Error(llmMissingConfigMessage());
  }

  const { text, framework, taskPrompt, timedContext } = args;
  const examDesc = EXAM_CONTEXT[framework];
  const userParts = [
    `Exam framework: ${framework}`,
    `Rubric context: ${examDesc}`,
    taskPrompt ? `Task / question:\n${taskPrompt}` : null,
    timedContext ? `Timing context: ${timedContext}` : null,
    `Candidate submission:\n\n${text}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const system =
    framework === "ielts_speaking2"
      ? `${WRITING_SYSTEM}\n${SPEAKING_EXTRA}`
      : WRITING_SYSTEM;

  const { url, init } = createChatCompletionsRequest({
    temperature: 0.35,
    max_tokens: 4096,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: userParts },
    ],
  });

  const response = await fetch(url, init);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Exam evaluation failed: ${errorText}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No evaluation returned");
  return JSON.parse(content) as ExamEvaluateResult;
}
