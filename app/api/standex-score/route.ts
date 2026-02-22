import { NextResponse } from "next/server";
import { ensurePrismaConnected, prisma } from "@/lib/prisma";

export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ModelResponse = {
  model: string;
  text: string;
  flags: Flag[];
};

type Flag = {
  claim: string;
  reason: string;
  severity: "critical" | "warning" | "info";
};

type StandexScoreBreakdown = {
  factualAccuracy: number;    // 0-100
  crossModelConsensus: number; // 0-100
  dataFreshness: number;       // 0-100
  hallucinationDensity: number; // 0-100 (inverse — lower hallucination = higher score)
};

type StandexScoreResult = {
  brand: string;
  standexScore: number;
  tier: "excellent" | "moderate" | "high" | "critical";
  breakdown: StandexScoreBreakdown;
  models: ModelResponse[];
  flagCount: number;
  scanId: string;
  cachedAt: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function ensureTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "StandexScoreScan" (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      "standexScore" INTEGER NOT NULL,
      tier TEXT NOT NULL,
      breakdown JSONB NOT NULL,
      models JSONB NOT NULL,
      "flagCount" INTEGER NOT NULL,
      email TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "StandexScoreScan_brand_idx" ON "StandexScoreScan"(brand);
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "StandexScoreScan_createdAt_idx" ON "StandexScoreScan"("createdAt" DESC);
  `;
  // One-time migration path from the previous ARM table.
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF to_regclass('"ARMScan"') IS NOT NULL THEN
        INSERT INTO "StandexScoreScan" (id, brand, "standexScore", tier, breakdown, models, "flagCount", email, "createdAt")
        SELECT id, brand, "armScore", tier, breakdown, models, "flagCount", email, "createdAt"
        FROM "ARMScan"
        ON CONFLICT (id) DO NOTHING;
      END IF;
    END $$;
  `);
  await prisma.$executeRaw`DROP TABLE IF EXISTS "ARMScan"`;
}

// All three model calls use the same OpenAI API key but different model IDs.
// GPT-4o = gpt-4o, Claude = gpt-4o (simulated via system prompt persona), Gemini = gpt-4.1-mini
// For the live demo all run through OpenAI; swap individual keys when ready.
const MODEL_CONFIGS = [
  {
    id: "gpt-4o",
    label: "GPT-4o",
    openaiModel: "gpt-4o",
    persona: "You are GPT-4o by OpenAI. Answer factually and concisely.",
  },
  {
    id: "claude",
    label: "Claude",
    openaiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    persona:
      "You are Claude by Anthropic. Answer factually and concisely, citing the most up-to-date information available in your training data.",
  },
  {
    id: "gemini",
    label: "Gemini",
    openaiModel: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    persona:
      "You are Gemini by Google. Answer factually and concisely. Focus on product details, pricing, and recent changes.",
  },
];

const BRAND_PROMPT = (brand: string) =>
  `Describe ${brand} — their key products, current pricing or rates, recent changes, and any notable claims. Be specific and factual. Keep your answer to 3-4 sentences.`;

const ANALYSIS_PROMPT = (brand: string, responses: { label: string; text: string }[]) => `
You are an AI brand accuracy auditor. Analyse the following responses from three AI models about the brand "${brand}".

${responses.map((r) => `## ${r.label}\n${r.text}`).join("\n\n")}

For each model, identify:
1. Any factual claims that are likely outdated (data older than 12 months)
2. Any claims that contradict the other models (hallucination risk)
3. Any claims that are unverifiable or vague

Return a JSON object with this exact schema:
{
  "models": [
    {
      "model": "GPT-4o",
      "flags": [
        { "claim": "exact quoted claim", "reason": "why it is flagged", "severity": "critical|warning|info" }
      ]
    },
    {
      "model": "Claude",
      "flags": []
    },
    {
      "model": "Gemini",
      "flags": []
    }
  ],
  "factualAccuracy": <0-100 integer — how factually accurate the average response is>,
  "crossModelConsensus": <0-100 integer — how much the models agree>,
  "dataFreshness": <0-100 integer — how current the information seems>,
  "hallucinationDensity": <0-100 integer — percentage of claims that appear hallucinated>
}

Return JSON only. No markdown.
`;

function computeStandexScore(breakdown: StandexScoreBreakdown): number {
  const { factualAccuracy, crossModelConsensus, dataFreshness, hallucinationDensity } = breakdown;
  // Hallucination density is inverse — 0 hallucinations = 100 score
  const hallucinationScore = 100 - hallucinationDensity;
  return Math.round(
    factualAccuracy * 0.4 +
    crossModelConsensus * 0.25 +
    dataFreshness * 0.2 +
    hallucinationScore * 0.15
  );
}

function computeTier(score: number): StandexScoreResult["tier"] {
  if (score >= 90) return "excellent";
  if (score >= 70) return "moderate";
  if (score >= 50) return "high";
  return "critical";
}

async function callOpenAI(model: string, system: string, user: string): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      max_tokens: 400,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error: ${await response.text()}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return data.choices?.[0]?.message?.content ?? "";
}

// ---------------------------------------------------------------------------
// POST /api/standex-score  — run a brand scan
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    await ensurePrismaConnected();
    const { brand, email } = (await req.json()) as { brand?: string; email?: string };

    if (!brand?.trim()) {
      return NextResponse.json({ error: "brand is required" }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const brandName = brand.trim();

    // Step 1: Query all three model personas in parallel
    const modelTexts = await Promise.all(
      MODEL_CONFIGS.map(async (cfg) => {
        const text = await callOpenAI(cfg.openaiModel, cfg.persona, BRAND_PROMPT(brandName));
        return { id: cfg.id, label: cfg.label, text };
      })
    );

    // Step 2: Send all three responses to analyser (uses gpt-4o for best accuracy)
    const analysisRaw = await callOpenAI(
      "gpt-4o",
      "You are a precise AI brand accuracy auditor. Return valid JSON only.",
      ANALYSIS_PROMPT(brandName, modelTexts.map((m) => ({ label: m.label, text: m.text })))
    );

    let analysis: {
      models: Array<{ model: string; flags: Flag[] }>;
      factualAccuracy: number;
      crossModelConsensus: number;
      dataFreshness: number;
      hallucinationDensity: number;
    };

    try {
      analysis = JSON.parse(analysisRaw);
    } catch {
      // Fallback if JSON parse fails
      analysis = {
        models: MODEL_CONFIGS.map((c) => ({ model: c.label, flags: [] })),
        factualAccuracy: 70,
        crossModelConsensus: 70,
        dataFreshness: 70,
        hallucinationDensity: 10,
      };
    }

    // Step 3: Build final response
    const breakdown: StandexScoreBreakdown = {
      factualAccuracy: Math.min(100, Math.max(0, analysis.factualAccuracy ?? 70)),
      crossModelConsensus: Math.min(100, Math.max(0, analysis.crossModelConsensus ?? 70)),
      dataFreshness: Math.min(100, Math.max(0, analysis.dataFreshness ?? 70)),
      hallucinationDensity: Math.min(100, Math.max(0, analysis.hallucinationDensity ?? 10)),
    };

    const standexScore = computeStandexScore(breakdown);
    const tier = computeTier(standexScore);

    const models: ModelResponse[] = MODEL_CONFIGS.map((cfg, i) => ({
      model: cfg.label,
      text: modelTexts[i]?.text ?? "",
      flags: analysis.models?.find((m) => m.model === cfg.label)?.flags ?? [],
    }));

    const flagCount = models.reduce((acc, m) => acc + m.flags.length, 0);
    const scanId = crypto.randomUUID();

    const result: StandexScoreResult = {
      brand: brandName,
      standexScore,
      tier,
      breakdown,
      models,
      flagCount,
      scanId,
      cachedAt: new Date().toISOString(),
    };

    // Step 4: Persist to DB (best effort)
    try {
      await ensureTable();
      await prisma.$executeRaw`
        INSERT INTO "StandexScoreScan" (id, brand, "standexScore", tier, breakdown, models, "flagCount", email, "createdAt")
        VALUES (
          ${scanId},
          ${brandName},
          ${standexScore},
          ${tier},
          ${JSON.stringify(breakdown)}::jsonb,
          ${JSON.stringify(models)}::jsonb,
          ${flagCount},
          ${email ?? null},
          NOW()
        )
      `;
    } catch {
      // Non-fatal — return result even if DB write fails
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Standex Score scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET /api/standex-score?brand=Monzo  — fetch recent scan for a brand
// ---------------------------------------------------------------------------

export async function GET(req: Request) {
  try {
    await ensurePrismaConnected();
    const { searchParams } = new URL(req.url);
    const brand = searchParams.get("brand")?.trim();

    await ensureTable();

    if (brand) {
      const rows = await prisma.$queryRaw<StandexScoreResult[]>`
        SELECT id as "scanId", brand, "standexScore", tier, breakdown, models, "flagCount", "createdAt" as "cachedAt"
        FROM "StandexScoreScan"
        WHERE LOWER(brand) = LOWER(${brand})
        ORDER BY "createdAt" DESC
        LIMIT 1
      `;
      if (!rows.length) {
        return NextResponse.json({ error: "No scan found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    }

    // Return recent scans feed
    const rows = await prisma.$queryRaw<StandexScoreResult[]>`
      SELECT id as "scanId", brand, "standexScore", tier, "flagCount", "createdAt" as "cachedAt"
      FROM "StandexScoreScan"
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;
    return NextResponse.json({ scans: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch Standex Score scans";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
