import { NextResponse } from "next/server";

export const runtime = "nodejs";

type AnalyzePayload = {
  text: string;
  type: "text" | "risk" | "intent" | "detect" | "speech";
};

const SYSTEM_PROMPTS: Record<string, string> = {
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

  speech: `You are a professional speech coach and communication expert. Analyze this speech transcript for delivery quality. Return JSON:
{
  "confidenceScore": number (0-100),
  "clarityScore": number (0-100),
  "engagementScore": number (0-100),
  "overallScore": number (0-100),
  "fillerWords": [
    { "word": "um/uh/like/etc", "count": number, "positions": ["approximate location in text"] }
  ],
  "totalFillerCount": number,
  "toneAnalysis": {
    "primary": "confident" | "nervous" | "aggressive" | "persuasive" | "monotone" | "enthusiastic",
    "secondary": "string or null",
    "emotionalRange": "low" | "medium" | "high"
  },
  "pacing": {
    "assessment": "too_fast" | "good" | "too_slow" | "uneven",
    "suggestion": "pacing improvement tip"
  },
  "structure": {
    "hasStrongOpening": boolean,
    "hasStrongClosing": boolean,
    "suggestion": "structural improvement"
  },
  "suggestions": [
    {
      "category": "filler_words" | "tone" | "structure" | "pacing" | "word_choice" | "engagement",
      "issue": "what needs improvement",
      "suggestion": "how to improve it",
      "priority": "high" | "medium" | "low"
    }
  ],
  "highlights": [
    { "text": "strong phrase from the speech", "reason": "why it works well" }
  ],
  "summary": "overall speech assessment"
}
Return valid JSON only.`,
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnalyzePayload;

    if (!body.text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    if (!body.type || !SYSTEM_PROMPTS[body.type]) {
      return NextResponse.json({ error: "Valid type is required: text|risk|intent|detect|speech" }, { status: 400 });
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
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPTS[body.type] },
          { role: "user", content: `Analyze this text:\n\n${body.text}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `AI analysis failed: ${errorText}` }, { status: 500 });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No analysis returned" }, { status: 500 });
    }

    const result = JSON.parse(content);
    return NextResponse.json({ type: body.type, result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
