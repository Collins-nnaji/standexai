import { NextResponse } from "next/server";
import { createChatCompletionsRequest, isLlmConfigured, llmMissingConfigMessage } from "@/lib/llm-client";

export const runtime = "nodejs";

type AssistMode = "generate" | "improve" | "rewrite" | "format";
type FormatStyle = "readability" | "seo" | "compliance" | "executive";

type AssistPayload = {
  mode?: AssistMode;
  prompt?: string;
  content?: string;
  selection?: string;
  keyword?: string;
  audience?: string;
  tone?: string;
  industry?: string;
  formatStyle?: FormatStyle;
};

type AssistOutput = {
  title: string;
  html: string;
  notes: string;
};

function buildPrompt(input: Required<Omit<AssistPayload, "mode">> & { mode: AssistMode }) {
  const context = [
    `Industry: ${input.industry || "GENERAL"}`,
    `Keyword: ${input.keyword || "Not provided"}`,
    `Audience: ${input.audience || "General audience"}`,
    `Tone: ${input.tone || "Professional"}`,
    `User prompt: ${input.prompt || "None"}`,
  ].join("\n");

  if (input.mode === "generate") {
    return `Create a strong first-draft article from scratch.

${context}

Output JSON only:
{
  "title": string,
  "html": string,
  "notes": string
}

Rules:
- Return clean semantic HTML only in "html" (h1,h2,h3,p,ul,ol,li,blockquote,strong,em,a,mark).
- Include H1 title section, clear intro, 3-5 H2 sections, and a conclusion.
- Keep wording practical and publication-ready.
- If keyword exists, integrate naturally.
- No markdown fences.`;
  }

  if (input.mode === "rewrite") {
    return `Rewrite the selected passage while preserving meaning and factual claims.

${context}

Selection to rewrite:
${input.selection || ""}

Output JSON only:
{
  "title": string,
  "html": string,
  "notes": string
}

Rules:
- Return only rewritten passage HTML in "html" (p,strong,em,ul,ol,li,blockquote,a,mark).
- Keep key facts.
- Improve clarity and structure for SEO + GEO readability.`;
  }

  if (input.mode === "format") {
    const styleLabel: Record<FormatStyle, string> = {
      readability: "Readability-first format",
      seo: "SEO + GEO scannable format",
      compliance: "Compliance-safe format",
      executive: "Executive brief format",
    };
    return `Reformat the full draft while preserving factual meaning.

${context}

Format style: ${styleLabel[input.formatStyle] ?? styleLabel.readability}

Current draft:
${input.content || ""}

Output JSON only:
{
  "title": string,
  "html": string,
  "notes": string
}

Rules:
- Keep the same core claims and facts.
- Return fully formatted HTML using semantic tags.
- Improve heading hierarchy and paragraph flow.
- Add concise lists where it improves scannability.
- No markdown fences.`;
  }

  return `Improve the full draft for clarity, structure, and answer-engine discoverability.

${context}

Current draft:
${input.content || ""}

Output JSON only:
{
  "title": string,
  "html": string,
  "notes": string
}

Rules:
- Return a full improved draft in HTML.
- Keep content truthful and avoid absolute guarantees.
- Improve heading structure and scannability.
- Preserve useful details from original draft.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AssistPayload;
    const mode = body.mode;

    if (!mode || !["generate", "improve", "rewrite", "format"].includes(mode)) {
      return NextResponse.json({ error: "Valid mode is required: generate|improve|rewrite|format" }, { status: 400 });
    }

    if (!isLlmConfigured()) {
      return NextResponse.json({ error: llmMissingConfigMessage() }, { status: 500 });
    }

    if (mode === "rewrite" && !body.selection?.trim()) {
      return NextResponse.json({ error: "Selection text is required for rewrite mode" }, { status: 400 });
    }

    const { url, init } = createChatCompletionsRequest({
      temperature: mode === "rewrite" || mode === "format" ? 0.4 : 0.6,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert content strategist and editor. Return strict JSON only. Never output markdown fences.",
        },
        {
          role: "user",
          content: buildPrompt({
            mode,
            prompt: body.prompt?.trim() ?? "",
            content: body.content?.trim() ?? "",
            selection: body.selection?.trim() ?? "",
            keyword: body.keyword?.trim() ?? "",
            audience: body.audience?.trim() ?? "",
            tone: body.tone?.trim() ?? "",
            industry: body.industry?.trim() ?? "",
            formatStyle: body.formatStyle ?? "readability",
          }),
        },
      ],
    });
    const response = await fetch(url, init);

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Azure OpenAI request failed: ${errorText}` }, { status: 500 });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No AI content returned" }, { status: 500 });
    }

    let output: AssistOutput;
    try {
      output = JSON.parse(content) as AssistOutput;
    } catch {
      return NextResponse.json({ error: "Failed to parse AI output" }, { status: 500 });
    }

    return NextResponse.json({
      mode,
      output: {
        title: output.title || "AI Draft",
        html: output.html || "<p>No output returned.</p>",
        notes: output.notes || "",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Studio AI assist failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
