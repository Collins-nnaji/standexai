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

type ReadinessScoreBreakdown = {
  schemaIntegrity: number;   // 0-100
  qualitySignals: number;    // 0-100
  dataFreshness: number;     // 0-100
  governanceCoverage: number; // 0-100
};

type ReadinessScoreResult = {
  dataset: string;
  readinessScore: number;
  tier: "excellent" | "moderate" | "high" | "critical";
  breakdown: ReadinessScoreBreakdown;
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
    CREATE TABLE IF NOT EXISTS "ReadinessScan" (
      id TEXT PRIMARY KEY,
      dataset TEXT NOT NULL,
      "readinessScore" INTEGER NOT NULL,
      tier TEXT NOT NULL,
      breakdown JSONB NOT NULL,
      models JSONB NOT NULL,
      "flagCount" INTEGER NOT NULL,
      email TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "ReadinessScan_dataset_idx" ON "ReadinessScan"(dataset);
  `;
  await prisma.$executeRaw`
    CREATE INDEX IF NOT EXISTS "ReadinessScan_createdAt_idx" ON "ReadinessScan"("createdAt" DESC);
  `;
  // One-time migration path from previous tables.
  await prisma.$executeRawUnsafe(`
    DO $$
    BEGIN
      IF to_regclass('"StandexScoreScan"') IS NOT NULL THEN
        INSERT INTO "ReadinessScan" (id, dataset, "readinessScore", tier, breakdown, models, "flagCount", email, "createdAt")
        SELECT id, brand, "standexScore", tier, breakdown, models, "flagCount", email, "createdAt"
        FROM "StandexScoreScan"
        ON CONFLICT (id) DO NOTHING;
      END IF;

      IF to_regclass('"ARMScan"') IS NOT NULL THEN
        INSERT INTO "ReadinessScan" (id, dataset, "readinessScore", tier, breakdown, models, "flagCount", email, "createdAt")
        SELECT id, brand, "armScore", tier, breakdown, models, "flagCount", email, "createdAt"
        FROM "ARMScan"
        ON CONFLICT (id) DO NOTHING;
      END IF;
    END $$;
  `);
  await prisma.$executeRaw`DROP TABLE IF EXISTS "StandexScoreScan"`;
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

const DATASET_PROMPT = (dataset: string) =>
  `Describe the dataset "${dataset}" with likely entities, key fields, primary keys, and quality risks. Be specific and factual. Keep your answer to 3-4 sentences.`;

const ANALYSIS_PROMPT = (dataset: string, responses: { label: string; text: string }[]) => `
You are an AI data readiness auditor. Analyse the following responses from three AI models about the dataset "${dataset}".

${responses.map((r) => `## ${r.label}\n${r.text}`).join("\n\n")}

For each model, identify:
1. Any schema issues (missing primary keys, ambiguous joins, mismatched types)
2. Any quality risks (missingness spikes, duplicates, outliers, drift)
3. Any governance gaps (PII handling, access constraints, auditability)

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
  "schemaIntegrity": <0-100 integer — how well-defined and stable the schema is>,
  "qualitySignals": <0-100 integer — how clean and reliable the data seems>,
  "dataFreshness": <0-100 integer — how current the data seems>,
  "governanceCoverage": <0-100 integer — how complete governance and privacy controls appear>
}

Return JSON only. No markdown.
`;

function computeStandexScore(breakdown: ReadinessScoreBreakdown): number {
  const { schemaIntegrity, qualitySignals, dataFreshness, governanceCoverage } = breakdown;
  return Math.round(
    schemaIntegrity * 0.4 +
    qualitySignals * 0.25 +
    dataFreshness * 0.2 +
    governanceCoverage * 0.15
  );
}

function computeTier(score: number): ReadinessScoreResult["tier"] {
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
// POST /api/readiness-score  — run a data readiness scan
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    await ensurePrismaConnected();
    const { dataset, brand, email } = (await req.json()) as { dataset?: string; brand?: string; email?: string };
    const datasetName = (dataset ?? brand ?? "").trim();

    if (!datasetName) {
      return NextResponse.json({ error: "dataset is required" }, { status: 400 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    // Step 1: Query all three model personas in parallel
    const modelTexts = await Promise.all(
      MODEL_CONFIGS.map(async (cfg) => {
        const text = await callOpenAI(cfg.openaiModel, cfg.persona, DATASET_PROMPT(datasetName));
        return { id: cfg.id, label: cfg.label, text };
      })
    );

    // Step 2: Send all three responses to analyser (uses gpt-4o for best accuracy)
    const analysisRaw = await callOpenAI(
      "gpt-4o",
      "You are a precise AI data readiness auditor. Return valid JSON only.",
      ANALYSIS_PROMPT(datasetName, modelTexts.map((m) => ({ label: m.label, text: m.text })))
    );

    let analysis: {
      models: Array<{ model: string; flags: Flag[] }>;
      schemaIntegrity: number;
      qualitySignals: number;
      dataFreshness: number;
      governanceCoverage: number;
    };

    try {
      analysis = JSON.parse(analysisRaw);
    } catch {
      // Fallback if JSON parse fails
      analysis = {
        models: MODEL_CONFIGS.map((c) => ({ model: c.label, flags: [] })),
        schemaIntegrity: 70,
        qualitySignals: 70,
        dataFreshness: 70,
        governanceCoverage: 70,
      };
    }

    // Step 3: Build final response
    const breakdown: ReadinessScoreBreakdown = {
      schemaIntegrity: Math.min(100, Math.max(0, analysis.schemaIntegrity ?? 70)),
      qualitySignals: Math.min(100, Math.max(0, analysis.qualitySignals ?? 70)),
      dataFreshness: Math.min(100, Math.max(0, analysis.dataFreshness ?? 70)),
      governanceCoverage: Math.min(100, Math.max(0, analysis.governanceCoverage ?? 70)),
    };

    const readinessScore = computeStandexScore(breakdown);
    const tier = computeTier(readinessScore);

    const models: ModelResponse[] = MODEL_CONFIGS.map((cfg, i) => ({
      model: cfg.label,
      text: modelTexts[i]?.text ?? "",
      flags: analysis.models?.find((m) => m.model === cfg.label)?.flags ?? [],
    }));

    const flagCount = models.reduce((acc, m) => acc + m.flags.length, 0);
    const scanId = crypto.randomUUID();

    const result: ReadinessScoreResult = {
      dataset: datasetName,
      readinessScore,
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
        INSERT INTO "ReadinessScan" (id, dataset, "readinessScore", tier, breakdown, models, "flagCount", email, "createdAt")
        VALUES (
          ${scanId},
          ${datasetName},
          ${readinessScore},
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
    const message = error instanceof Error ? error.message : "Readiness scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// GET /api/readiness-score?dataset=Payments  — fetch recent scan for a dataset
// ---------------------------------------------------------------------------

export async function GET(req: Request) {
  try {
    await ensurePrismaConnected();
    const { searchParams } = new URL(req.url);
    const dataset = searchParams.get("dataset")?.trim() ?? searchParams.get("brand")?.trim();

    await ensureTable();

    if (dataset) {
      const rows = await prisma.$queryRaw<ReadinessScoreResult[]>`
        SELECT id as "scanId", dataset, "readinessScore", tier, breakdown, models, "flagCount", "createdAt" as "cachedAt"
        FROM "ReadinessScan"
        WHERE LOWER(dataset) = LOWER(${dataset})
        ORDER BY "createdAt" DESC
        LIMIT 1
      `;
      if (!rows.length) {
        return NextResponse.json({ error: "No scan found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    }

    // Return recent scans feed
    const rows = await prisma.$queryRaw<ReadinessScoreResult[]>`
      SELECT id as "scanId", dataset, "readinessScore", tier, "flagCount", "createdAt" as "cachedAt"
      FROM "ReadinessScan"
      ORDER BY "createdAt" DESC
      LIMIT 20
    `;
    return NextResponse.json({ scans: rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch readiness scans";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
