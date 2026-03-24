import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import {
  ensurePrismaConnected,
  prisma,
  prismaDb,
  withPrismaReconnect,
} from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";
import { getActiveLlmProvider, getDefaultChatModelLabel } from "@/lib/llm-client";

export const runtime = "nodejs";

type DashboardProject = {
  id: string;
  title: string;
  source: "content" | "brief";
  status: "draft" | "in_review" | "approved" | "published";
  seoScore: number;
  geoScore: number;
  complianceScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  updatedAt: string;
  flagCount: number;
  wordCount: number;
  targetKeyword?: string;
};

type ModelUsage = {
  provider: string;
  model: string;
  count: number;
  lastUsedAt: string;
};

type AnalyticsEventData = {
  provider?: string;
  model?: string;
};

type GeoEngineCoverage = {
  engine: string;
  provider: string;
  observedRuns: number;
  lastObservedAt: string | null;
  status: "active" | "not_seen";
};

const KNOWN_GEO_ENGINES: Array<{ engine: string; provider: string; matchers: string[] }> = [
  { engine: "ChatGPT", provider: "openai", matchers: ["openai", "gpt", "azure"] },
  { engine: "Claude", provider: "anthropic", matchers: ["anthropic", "claude"] },
  { engine: "Gemini", provider: "google", matchers: ["google", "gemini"] },
  { engine: "Perplexity", provider: "perplexity", matchers: ["perplexity"] },
];

function mapStatus(status: string): DashboardProject["status"] {
  const normalized = status.toUpperCase();
  if (normalized === "IN_REVIEW") return "in_review";
  if (normalized === "APPROVED") return "approved";
  if (normalized === "PUBLISHED") return "published";
  return "draft";
}

function mapRiskLevel(riskLevel: string | null): DashboardProject["riskLevel"] {
  const normalized = riskLevel?.toUpperCase();
  if (normalized === "MEDIUM") return "medium";
  if (normalized === "HIGH") return "high";
  if (normalized === "CRITICAL") return "critical";
  return "low";
}

function estimateWordCount(body: unknown): number {
  if (!body) return 0;

  const texts: string[] = [];

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const maybeNode = node as { text?: unknown; content?: unknown };

    if (typeof maybeNode.text === "string") {
      texts.push(maybeNode.text);
    }

    if (Array.isArray(maybeNode.content)) {
      for (const child of maybeNode.content) {
        walk(child);
      }
    }
  };

  walk(body);

  return texts.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

async function getGeneratedPageCount(): Promise<number> {
  try {
    const tableCheck = await prisma.$queryRaw<Array<{ exists: string | null }>>`
      SELECT to_regclass('public."GeneratedPage"')::text AS exists
    `;
    if (!tableCheck[0]?.exists) return 0;

    const rows = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*)::bigint AS count FROM "GeneratedPage"
    `;
    return Number(rows[0]?.count ?? 0);
  } catch {
    return 0;
  }
}

async function getContentRows(userId: string) {
  try {
    return await prisma.content.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 30,
      select: {
        id: true,
        title: true,
        status: true,
        seoScore: true,
        complianceScore: true,
        riskLevel: true,
        updatedAt: true,
        body: true,
        flags: { select: { id: true } },
      },
    });
  } catch {
    return [];
  }
}

async function getAnalyticsRows(userId: string) {
  try {
    return await prisma.analyticsEvent.findMany({
      where: { eventType: "generation.completed", userId },
      orderBy: { createdAt: "desc" },
      take: 500,
      select: { createdAt: true, eventData: true },
    });
  } catch {
    return [];
  }
}

async function getCommunicationAnalyses(userId: string) {
  try {
    return await prismaDb.communicationAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 40,
      select: {
        id: true,
        title: true,
        source: true,
        kind: true,
        overallScore: true,
        toneScore: true,
        riskScore: true,
        clarityScore: true,
        aiProbability: true,
        riskLevel: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

async function getBriefRows() {
  try {
    return await prisma.contentBrief.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        topic: true,
        targetKeyword: true,
        createdAt: true,
      },
    });
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    await ensurePrismaConnected();
    const { data: session } = await neonAuth.getSession();
    const email = session?.user?.email?.trim().toLowerCase();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getOrCreateCurrentUserId({
      userEmailHeader: email,
      userNameHeader: session?.user?.name ?? undefined,
    });

    const [contentRows, briefRows, analyticsRows, generatedCount, commRows] = await Promise.all([
      withPrismaReconnect(() => getContentRows(userId)),
      withPrismaReconnect(() => getBriefRows()),
      withPrismaReconnect(() => getAnalyticsRows(userId)),
      withPrismaReconnect(() => getGeneratedPageCount()),
      withPrismaReconnect(() => getCommunicationAnalyses(userId)),
    ]);

    const seoScores = contentRows.map((row) => row.seoScore ?? 0).filter((score) => score > 0);
    const complianceScores = contentRows.map((row) => row.complianceScore ?? 0).filter((score) => score > 0);
    const geoScores: number[] = [];

    const projects: DashboardProject[] = contentRows.map((row) => ({
      id: row.id,
      title: row.title,
      source: "content",
      status: mapStatus(row.status),
      seoScore: row.seoScore ?? 0,
      geoScore: 0,
      complianceScore: row.complianceScore ?? 0,
      riskLevel: mapRiskLevel(row.riskLevel),
      updatedAt: row.updatedAt.toISOString(),
      flagCount: row.flags.length,
      wordCount: estimateWordCount(row.body),
    }));

    const briefProjects: DashboardProject[] = briefRows.map((row) => ({
      id: row.id,
      title: row.topic,
      source: "brief",
      status: "draft",
      seoScore: 0,
      geoScore: 0,
      complianceScore: 0,
      riskLevel: "low",
      updatedAt: row.createdAt.toISOString(),
      flagCount: 0,
      wordCount: 0,
      targetKeyword: row.targetKeyword ?? undefined,
    }));

    const allProjects = [...projects, ...briefProjects].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    const modelUsageMap = new Map<string, ModelUsage>();

    for (const row of analyticsRows) {
      const eventData = row.eventData as AnalyticsEventData;
      const provider = eventData.provider ?? "openai";
      const model = eventData.model ?? getDefaultChatModelLabel();
      const key = `${provider}:${model}`;

      const existing = modelUsageMap.get(key);
      if (!existing) {
        modelUsageMap.set(key, {
          provider,
          model,
          count: 1,
          lastUsedAt: row.createdAt.toISOString(),
        });
      } else {
        existing.count += 1;
        if (row.createdAt.getTime() > new Date(existing.lastUsedAt).getTime()) {
          existing.lastUsedAt = row.createdAt.toISOString();
        }
      }
    }

    let modelUsage = Array.from(modelUsageMap.values()).sort((a, b) => b.count - a.count);
    if (modelUsage.length === 0) {
      modelUsage = [
        {
          provider: getActiveLlmProvider(),
          model: getDefaultChatModelLabel(),
          count: generatedCount,
          lastUsedAt: new Date().toISOString(),
        },
      ];
    }

    const commSample = commRows.slice(0, 30);
    const nums = (pick: (row: (typeof commRows)[0]) => number | null | undefined) =>
      commSample.map(pick).filter((n): n is number => typeof n === "number" && !Number.isNaN(n));

    const communication = {
      totalRuns: commRows.length,
      avgOverall: average(nums((r) => r.overallScore)),
      avgTone: average(nums((r) => r.toneScore)),
      avgRisk: average(nums((r) => r.riskScore)),
      avgClarity: average(nums((r) => r.clarityScore)),
      avgAiProbability: average(nums((r) => r.aiProbability)),
      lastRunAt: commRows[0]?.createdAt.toISOString() ?? null,
      recent: commRows.slice(0, 12).map((r) => ({
        id: r.id,
        title: r.title,
        source: r.source,
        kind: r.kind,
        overallScore: r.overallScore,
        toneScore: r.toneScore,
        riskScore: r.riskScore,
        clarityScore: r.clarityScore,
        aiProbability: r.aiProbability,
        riskLevel: r.riskLevel,
        createdAt: r.createdAt.toISOString(),
      })),
    };

    const geoCoverage: GeoEngineCoverage[] = KNOWN_GEO_ENGINES.map((engine) => {
      const matchingRows = modelUsage.filter((entry) => {
        const provider = entry.provider.toLowerCase();
        const model = entry.model.toLowerCase();
        return engine.matchers.some((matcher) => provider.includes(matcher) || model.includes(matcher));
      });

      if (matchingRows.length === 0) {
        return {
          engine: engine.engine,
          provider: engine.provider,
          observedRuns: 0,
          lastObservedAt: null,
          status: "not_seen" as const,
        };
      }

      return {
        engine: engine.engine,
        provider: engine.provider,
        observedRuns: matchingRows.reduce((sum, row) => sum + row.count, 0),
        lastObservedAt: matchingRows
          .map((row) => row.lastUsedAt)
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0],
        status: "active" as const,
      };
    });

    return NextResponse.json({
      summary: {
        totalProjects: allProjects.length,
        published: allProjects.filter((project) => project.status === "published").length,
        inReview: allProjects.filter((project) => project.status === "in_review").length,
        draft: allProjects.filter((project) => project.status === "draft").length,
        avgSeoScore: average(seoScores),
        avgComplianceScore: average(complianceScores),
        avgGeoScore: average(geoScores),
      },
      communication,
      llm: {
        totalGenerations: analyticsRows.length || generatedCount,
        providersUsed: new Set(modelUsage.map((entry) => entry.provider)).size,
        mostUsedModel: modelUsage[0]?.model ?? getDefaultChatModelLabel(),
        modelUsage,
        geoCoverage,
      },
      projects: allProjects,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load console metrics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
