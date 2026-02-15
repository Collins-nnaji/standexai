import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type GeneratePayload = {
  mainKeyword?: string;
  secondaryKeywords?: string;
  location?: string;
  targetAudience?: string;
  tone?: string;
};

type GeneratedOutput = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  articleMarkdown: string;
  internalLinkSuggestions: string[];
  faq: Array<{ question: string; answer: string }>;
  faqSchemaJsonLd: string;
  geoVariation: string;
};

async function ensureTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "GeneratedPage" (
      id TEXT PRIMARY KEY,
      "mainKeyword" TEXT NOT NULL,
      "secondaryKeywords" TEXT NOT NULL,
      location TEXT,
      "targetAudience" TEXT NOT NULL,
      tone TEXT NOT NULL,
      title TEXT NOT NULL,
      "metaTitle" TEXT NOT NULL,
      "metaDescription" TEXT NOT NULL,
      "articleMarkdown" TEXT NOT NULL,
      "internalLinkSuggestions" JSONB NOT NULL,
      faq JSONB NOT NULL,
      "faqSchemaJsonLd" TEXT NOT NULL,
      "geoVariation" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

function buildPrompt(input: Required<GeneratePayload>) {
  return `Generate one ready-to-publish SEO page in JSON.

Inputs:
- Main keyword: ${input.mainKeyword}
- Secondary keywords: ${input.secondaryKeywords}
- Location: ${input.location || "None"}
- Target audience: ${input.targetAudience}
- Tone: ${input.tone}

Output JSON schema:
{
  "title": string,
  "metaTitle": string,
  "metaDescription": string,
  "articleMarkdown": string,
  "internalLinkSuggestions": string[],
  "faq": [{ "question": string, "answer": string }],
  "faqSchemaJsonLd": string,
  "geoVariation": string
}

Rules:
- Write articleMarkdown with clear H1, H2 and H3 structure.
- Make content SEO-focused and natural, not stuffed.
- Include strong intro, body sections and conclusion.
- Include 5 internal link suggestions as specific anchor ideas.
- Include 5 FAQs.
- faqSchemaJsonLd must be valid FAQPage JSON-LD string matching the FAQ content.
- If location is provided, geoVariation must adapt the page for that location.
- If no location is provided, geoVariation can be a short generic variant.
- Return JSON only.`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GeneratePayload;

    const mainKeyword = body.mainKeyword?.trim();
    const secondaryKeywords = body.secondaryKeywords?.trim() ?? "";
    const location = body.location?.trim() ?? "";
    const targetAudience = body.targetAudience?.trim();
    const tone = body.tone?.trim();

    if (!mainKeyword || !targetAudience || !tone) {
      return NextResponse.json(
        { error: "mainKeyword, targetAudience, and tone are required" },
        { status: 400 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        temperature: 0.7,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a senior SEO content strategist. Output valid JSON only and follow input constraints exactly.",
          },
          {
            role: "user",
            content: buildPrompt({
              mainKeyword,
              secondaryKeywords,
              location,
              targetAudience,
              tone,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `OpenAI request failed: ${errorText}` }, { status: 500 });
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
      };
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      return NextResponse.json({ error: "No generation content returned" }, { status: 500 });
    }

    let output: GeneratedOutput;
    try {
      output = JSON.parse(content) as GeneratedOutput;
    } catch {
      return NextResponse.json({ error: "Failed to parse model JSON output" }, { status: 500 });
    }

    const id = crypto.randomUUID();
    let saved = false;
    let saveError: string | null = null;
    const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

    try {
      await ensureTable();
      await prisma.$executeRaw`
        INSERT INTO "GeneratedPage" (
          id,
          "mainKeyword",
          "secondaryKeywords",
          location,
          "targetAudience",
          tone,
          title,
          "metaTitle",
          "metaDescription",
          "articleMarkdown",
          "internalLinkSuggestions",
          faq,
          "faqSchemaJsonLd",
          "geoVariation"
        ) VALUES (
          ${id},
          ${mainKeyword},
          ${secondaryKeywords},
          ${location || null},
          ${targetAudience},
          ${tone},
          ${output.title ?? ""},
          ${output.metaTitle ?? ""},
          ${output.metaDescription ?? ""},
          ${output.articleMarkdown ?? ""},
          ${JSON.stringify(output.internalLinkSuggestions ?? [])}::jsonb,
          ${JSON.stringify(output.faq ?? [])}::jsonb,
          ${output.faqSchemaJsonLd ?? ""},
          ${output.geoVariation ?? ""}
        )
      `;
      saved = true;
    } catch (error) {
      saveError = error instanceof Error ? error.message : "Failed to save generated page";
    }

    try {
      await prisma.analyticsEvent.create({
        data: {
          eventType: "generation.completed",
          eventData: {
            provider: "openai",
            model,
            mainKeyword,
            generatedPageId: id,
            promptTokens: data.usage?.prompt_tokens ?? 0,
            completionTokens: data.usage?.completion_tokens ?? 0,
            totalTokens: data.usage?.total_tokens ?? 0,
          },
        },
      });
    } catch {
      // Best effort analytics tracking.
    }

    return NextResponse.json({
      id,
      saved,
      saveError,
      output,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
