import { NextResponse } from "next/server";
import { ensurePrismaConnected, prisma, withPrismaReconnect } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";
import {
  createChatCompletionsRequest,
  getActiveLlmProvider,
  getDefaultChatModelLabel,
  isLlmConfigured,
} from "@/lib/llm-client";

export const runtime = "nodejs";

type AuditPayload = {
  url?: string;
  keyword?: string;
  prompt?: string;
  simulation?: boolean;
};

type SemanticCheck = {
  normalizedUrl: string;
  title: string;
  metaDescription: string;
  wordCount: number;
  schemaScriptCount: number;
  hasFaqSchema: boolean;
  hasLlmsTxt: boolean;
  issues: string[];
  quickWins: string[];
  score: number;
};

type ModelResult = {
  engine: "GPT-4o" | "Claude 3.5" | "Gemini 1.5";
  mentioned: boolean;
  sentiment: "positive" | "neutral" | "negative";
  competitors: string[];
  descriptors: string[];
  reasoning: string;
  source: "live" | "simulated";
};

type CitationSource = {
  source: "Reddit" | "Wikipedia" | "Hacker News";
  found: boolean;
  signal: "red" | "yellow" | "green";
  detail: string;
};

type RankingSite = {
  domain: string;
  reason: string;
  source: "live" | "simulated";
};

type AiSimulationModel = {
  engine: ModelResult["engine"];
  mentioned: boolean;
  sentiment: ModelResult["sentiment"];
  competitors: string[];
  descriptors: string[];
  reasoning: string;
};

function normalizeSentiment(value: unknown): ModelResult["sentiment"] {
  if (value === "positive" || value === "neutral" || value === "negative") return value;
  return "neutral";
}

function fallbackSemanticCheck(normalizedUrl: string, reason: string): SemanticCheck {
  return {
    normalizedUrl,
    title: "",
    metaDescription: "",
    wordCount: 0,
    schemaScriptCount: 0,
    hasFaqSchema: false,
    hasLlmsTxt: false,
    issues: [`Could not fully fetch target page: ${reason}`],
    quickWins: [
      "Verify the URL is publicly reachable over HTTPS",
      "Allow bot access for technical scanners",
      "Publish llms.txt and Organization schema on a crawlable page",
    ],
    score: 35,
  };
}

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `https://${trimmed}`;
}

function extractHostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function brandFromHost(host: string) {
  return host.split(".")[0]?.replace(/[-_]/g, " ") || host;
}

function toLikelyDomain(value: string) {
  const compact = value.trim().toLowerCase();
  if (!compact) return "";
  if (compact.includes(".")) return compact.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0] ?? "";
  const slug = compact.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return slug ? `${slug}.com` : "";
}

function extractFirst(html: string, regex: RegExp) {
  const match = html.match(regex);
  return match?.[1]?.trim() ?? "";
}

function textContent(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWithTimeout(url: string, init?: RequestInit, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function runSemanticCheck(normalizedUrl: string): Promise<SemanticCheck> {
  // Option 1: Use Jina AI Reader API to bypass Cloudflare and render JS-heavy pages
  const jinaResponse = await fetchWithTimeout(`https://r.jina.ai/${normalizedUrl}`, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "X-Engine": "playwright", // ensures JS execution if needed
    },
  });

  if (!jinaResponse.ok) {
    throw new Error(`Failed to fetch website deeply (${jinaResponse.status})`);
  }

  const json = (await jinaResponse.json()) as {
    data?: { title?: string; description?: string; content?: string };
  };
  const pageData = json.data || {};

  const title = pageData.title || "";
  const metaDescription = pageData.description || "";
  const contentMarkdown = pageData.content || "";
  const wordCount = contentMarkdown.split(/\s+/).filter(Boolean).length;

  // We still try a lightweight original fetch just to look for schema tags directly, 
  // as Jina focuses on extracting readable markdown content.
  let schemaScriptCount = 0;
  let hasFaqSchema = false;
  try {
    const rawCheck = await fetchWithTimeout(normalizedUrl, {
      headers: { "User-Agent": "StandexAI-Discovery/1.0" }
    }, 6000);
    if (rawCheck.ok) {
      const html = await rawCheck.text();
      const schemaScripts = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? [];
      schemaScriptCount = schemaScripts.length;
      hasFaqSchema = schemaScripts.some((script) => /"@type"\s*:\s*"FAQPage"/i.test(script));
    }
  } catch {
    // Silently ignore if raw fetch fails (Cloudflare block), we still have the main Jina content
  }

  const llmsTxtUrl = `${normalizedUrl.replace(/\/$/, "")}/llms.txt`;
  let hasLlmsTxt = false;
  try {
    const llmsTxtResponse = await fetchWithTimeout(llmsTxtUrl, { method: "HEAD" }, 6000);
    hasLlmsTxt = llmsTxtResponse.ok;
  } catch {
    hasLlmsTxt = false;
  }

  const issues: string[] = [];
  const quickWins: string[] = [];

  if (!title) issues.push("Missing page title");
  if (!metaDescription) issues.push("Missing meta description");
  if (schemaScriptCount === 0) issues.push("No structured data schema found visible to raw fetch");
  if (!hasLlmsTxt) issues.push("No llms.txt found at root");
  if (wordCount < 300) issues.push("Extremely thin content depth");

  if (!hasLlmsTxt) quickWins.push("Publish a tailored llms.txt at /llms.txt for AI agents");
  if (schemaScriptCount === 0) quickWins.push("Ensure JSON-LD schema (Organization + FAQPage) is present");
  if (wordCount < 800) quickWins.push("Expand page text with factual Q&A and proof points for AI consumption");
  if (!metaDescription) quickWins.push("Write a concise, keyword-rich brand meta description");

  let score = 100;
  score -= issues.length * 11;
  if (hasFaqSchema) score += 4;
  if (hasLlmsTxt) score += 6;
  score = Math.max(0, Math.min(100, score));

  return {
    normalizedUrl,
    title,
    metaDescription,
    wordCount,
    schemaScriptCount,
    hasFaqSchema,
    hasLlmsTxt,
    issues,
    quickWins,
    score,
  };
}

async function runGptQuery(url: string, keyword: string, brand: string): Promise<ModelResult> {
  if (!isLlmConfigured()) {
    return {
      engine: "GPT-4o",
      mentioned: false,
      sentiment: "neutral",
      competitors: [],
      descriptors: [],
      reasoning: "LLM is not configured.",
      source: "simulated",
    };
  }

  const { url: chatUrl, init } = createChatCompletionsRequest({
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Return strict JSON only: {mentioned:boolean,sentiment:'positive|neutral|negative',competitors:string[],descriptors:string[],reasoning:string}.",
      },
      {
        role: "user",
        content: `Assess AI discoverability for brand "${brand}" at URL "${url}" for keyword "${keyword}". Include top 3 competitors likely shown in AI answers.`,
      },
    ],
  });
  const response = await fetchWithTimeout(chatUrl, init);

  if (!response.ok) {
    return {
      engine: "GPT-4o",
      mentioned: false,
      sentiment: "neutral",
      competitors: [],
      descriptors: [],
      reasoning: "Live model query failed.",
      source: "simulated",
    };
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return {
      engine: "GPT-4o",
      mentioned: false,
      sentiment: "neutral",
      competitors: [],
      descriptors: [],
      reasoning: "No model output returned.",
      source: "simulated",
    };
  }

  try {
    const parsed = JSON.parse(content) as {
      mentioned?: boolean;
      sentiment?: "positive" | "neutral" | "negative";
      competitors?: string[];
      descriptors?: string[];
      reasoning?: string;
    };
    return {
      engine: "GPT-4o",
      mentioned: Boolean(parsed.mentioned),
      sentiment: parsed.sentiment ?? "neutral",
      competitors: (parsed.competitors ?? []).slice(0, 3),
      descriptors: (parsed.descriptors ?? []).slice(0, 4),
      reasoning: parsed.reasoning ?? "No reasoning provided.",
      source: "live",
    };
  } catch {
    return {
      engine: "GPT-4o",
      mentioned: false,
      sentiment: "neutral",
      competitors: [],
      descriptors: [],
      reasoning: "Failed to parse model response.",
      source: "simulated",
    };
  }
}

function buildTopSitesPrompt(input: { url: string; keyword: string; brand: string; userPrompt: string }) {
  return `You are simulating keyword ranking visibility for GEO + SEO.

Context:
- Brand URL: ${input.url}
- Brand: ${input.brand}
- Keyword: ${input.keyword}
- Simulation instruction: ${input.userPrompt || "Use realistic market assumptions."}

Return strict JSON only:
{
  "sites": [
    { "domain": string, "reason": string }
  ]
}

Rules:
- Return exactly 5 sites ranked from strongest to weakest.
- Include real-looking domain names only (no prose in domain field).
- Reasons must be concise (max 14 words each).
- Include the brand domain only if it is realistically top-ranking.
- No markdown.`;
}

function fallbackTopRankingSites(input: { keyword: string; normalizedUrl: string; brand: string; modelResults: ModelResult[] }): RankingSite[] {
  const host = extractHostname(input.normalizedUrl);
  const competitorTerms = Array.from(new Set(input.modelResults.flatMap((m) => m.competitors))).slice(0, 4);
  const candidateDomains = [
    ...competitorTerms.map((item) => toLikelyDomain(item)),
    host,
    `${input.keyword.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 10) || "keyword"}hub.com`,
  ].filter(Boolean);

  const deduped = Array.from(new Set(candidateDomains)).slice(0, 5);
  return deduped.map((domain, idx) => ({
    domain,
    reason: idx === 0 ? "Strong authority and broad topical coverage." : "Relevant topical pages and consistent query intent match.",
    source: "simulated",
  }));
}

async function runTopRankingSitesQuery(input: {
  url: string;
  keyword: string;
  brand: string;
  userPrompt: string;
  modelResults: ModelResult[];
}): Promise<RankingSite[]> {
  if (!isLlmConfigured()) {
    return fallbackTopRankingSites({
      keyword: input.keyword,
      normalizedUrl: input.url,
      brand: input.brand,
      modelResults: input.modelResults,
    });
  }

  const { url: chatUrl, init } = createChatCompletionsRequest({
    temperature: 0.25,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: "Return strict JSON only. No markdown fences.",
      },
      {
        role: "user",
        content: buildTopSitesPrompt(input),
      },
    ],
  });
  const response = await fetchWithTimeout(chatUrl, init);

  if (!response.ok) {
    return fallbackTopRankingSites({
      keyword: input.keyword,
      normalizedUrl: input.url,
      brand: input.brand,
      modelResults: input.modelResults,
    });
  }

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return fallbackTopRankingSites({
      keyword: input.keyword,
      normalizedUrl: input.url,
      brand: input.brand,
      modelResults: input.modelResults,
    });
  }

  try {
    const parsed = JSON.parse(content) as { sites?: Array<{ domain?: string; reason?: string }> };
    const normalized = (parsed.sites ?? [])
      .map((item) => ({
        domain: toLikelyDomain(item.domain ?? ""),
        reason: (item.reason ?? "").trim(),
      }))
      .filter((item) => item.domain)
      .slice(0, 5)
      .map((item) => ({
        domain: item.domain,
        reason: item.reason || "High relevance and authority for this query space.",
        source: "live" as const,
      }));

    if (normalized.length === 0) {
      return fallbackTopRankingSites({
        keyword: input.keyword,
        normalizedUrl: input.url,
        brand: input.brand,
        modelResults: input.modelResults,
      });
    }
    return normalized;
  } catch {
    return fallbackTopRankingSites({
      keyword: input.keyword,
      normalizedUrl: input.url,
      brand: input.brand,
      modelResults: input.modelResults,
    });
  }
}

function buildAuditSimulationPrompt(input: {
  url: string;
  keyword: string;
  brand: string;
  semantic: SemanticCheck;
  citations: CitationSource[];
  userPrompt: string;
}) {
  return `Simulate a GEO audit report outcome as if evaluating discoverability across GPT-4o, Claude 3.5, and Gemini 1.5.

Context:
- URL: ${input.url}
- Brand: ${input.brand}
- Target keyword: ${input.keyword}
- Semantic score: ${input.semantic.score}
- Has llms.txt: ${input.semantic.hasLlmsTxt ? "yes" : "no"}
- Has FAQ schema: ${input.semantic.hasFaqSchema ? "yes" : "no"}
- Word count: ${input.semantic.wordCount}
- Current issues: ${input.semantic.issues.join("; ") || "none"}
- Citation signals: ${input.citations.map((c) => `${c.source}:${c.signal}`).join(", ")}

User simulation instruction:
${input.userPrompt}

Output strict JSON only:
{
  "modelResults": [
    {
      "engine": "GPT-4o" | "Claude 3.5" | "Gemini 1.5",
      "mentioned": boolean,
      "sentiment": "positive" | "neutral" | "negative",
      "competitors": string[],
      "descriptors": string[],
      "reasoning": string
    }
  ]
}

Rules:
- Include exactly 3 items: GPT-4o, Claude 3.5, Gemini 1.5.
- Keep reasoning concise and tactical.
- Competitors and descriptors should be short strings.
- Return JSON only with no markdown.`;
}

async function runAiModelSimulation(input: {
  url: string;
  keyword: string;
  brand: string;
  semantic: SemanticCheck;
  citations: CitationSource[];
  userPrompt: string;
}): Promise<ModelResult[] | null> {
  if (!isLlmConfigured()) return null;

  const { url: chatUrl, init } = createChatCompletionsRequest({
    temperature: 0.25,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a GEO simulation engine. Return strict JSON only. Do not include markdown fences.",
      },
      {
        role: "user",
        content: buildAuditSimulationPrompt(input),
      },
    ],
  });
  const response = await fetchWithTimeout(chatUrl, init, 25000);

  if (!response.ok) return null;

  const data = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as { modelResults?: AiSimulationModel[] };
    const engineOrder: ModelResult["engine"][] = ["GPT-4o", "Claude 3.5", "Gemini 1.5"];
    const byEngine = new Map((parsed.modelResults ?? []).map((entry) => [entry.engine, entry]));

    const normalized: ModelResult[] = engineOrder.map((engine): ModelResult => {
      const entry = byEngine.get(engine);
      if (!entry) {
        return {
          engine,
          mentioned: false,
          sentiment: "neutral",
          competitors: [],
          descriptors: [],
          reasoning: `${engine} simulation unavailable in AI output.`,
          source: "simulated",
        };
      }
      return {
        engine,
        mentioned: Boolean(entry.mentioned),
        sentiment: normalizeSentiment(entry.sentiment),
        competitors: (entry.competitors ?? []).slice(0, 3),
        descriptors: (entry.descriptors ?? []).slice(0, 4),
        reasoning: entry.reasoning ?? `${engine} simulated by AI model.`,
        source: "simulated",
      };
    });
    return normalized;
  } catch {
    return null;
  }
}

function simulateModel(engine: ModelResult["engine"], semantic: SemanticCheck, keyword: string): ModelResult {
  const mentioned = semantic.score >= 55;
  const sentiment: ModelResult["sentiment"] = semantic.score >= 75 ? "positive" : semantic.score >= 55 ? "neutral" : "negative";
  const baseCompetitors = [
    `Top ${keyword} alternatives`,
    `${keyword} comparison leaders`,
    `Category incumbents`,
  ];

  return {
    engine,
    mentioned,
    sentiment,
    competitors: baseCompetitors,
    descriptors:
      sentiment === "positive"
        ? ["credible", "specialized", "high-intent"]
        : sentiment === "neutral"
          ? ["emerging", "mixed visibility", "needs authority"]
          : ["low discoverability", "unclear positioning", "weak citations"],
    reasoning: `${engine} simulated from semantic and citation signals.`,
    source: "simulated",
  };
}

async function runCitationAudit(host: string, brand: string): Promise<CitationSource[]> {
  const reddit = (async (): Promise<CitationSource> => {
    try {
      const response = await fetchWithTimeout(
        `https://www.reddit.com/search.json?q=${encodeURIComponent(host)}&limit=3&sort=relevance&t=year`,
      );
      if (!response.ok) return { source: "Reddit", found: false, signal: "red", detail: "No reliable Reddit signal." };
      const data = (await response.json()) as { data?: { children?: unknown[] } };
      const count = data.data?.children?.length ?? 0;
      return {
        source: "Reddit",
        found: count > 0,
        signal: count > 1 ? "green" : count === 1 ? "yellow" : "red",
        detail: count > 0 ? `${count} relevant Reddit mentions detected.` : "No Reddit mentions detected.",
      };
    } catch {
      return { source: "Reddit", found: false, signal: "red", detail: "Reddit check unavailable." };
    }
  })();

  const wikipedia = (async (): Promise<CitationSource> => {
    try {
      const response = await fetchWithTimeout(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&utf8=1&srsearch=${encodeURIComponent(brand)}`,
      );
      if (!response.ok) return { source: "Wikipedia", found: false, signal: "red", detail: "No reliable Wikipedia signal." };
      const data = (await response.json()) as { query?: { search?: unknown[] } };
      const count = data.query?.search?.length ?? 0;
      return {
        source: "Wikipedia",
        found: count > 0,
        signal: count > 0 ? "yellow" : "red",
        detail: count > 0 ? "Brand-related entries detected in Wikipedia search." : "No direct Wikipedia discoverability signal.",
      };
    } catch {
      return { source: "Wikipedia", found: false, signal: "red", detail: "Wikipedia check unavailable." };
    }
  })();

  const hackerNews = (async (): Promise<CitationSource> => {
    try {
      const response = await fetchWithTimeout(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(host)}&tags=story&hitsPerPage=3`,
      );
      if (!response.ok) return { source: "Hacker News", found: false, signal: "red", detail: "No reliable HN signal." };
      const data = (await response.json()) as { hits?: unknown[] };
      const count = data.hits?.length ?? 0;
      return {
        source: "Hacker News",
        found: count > 0,
        signal: count > 1 ? "green" : count === 1 ? "yellow" : "red",
        detail: count > 0 ? `${count} Hacker News references detected.` : "No Hacker News references detected.",
      };
    } catch {
      return { source: "Hacker News", found: false, signal: "red", detail: "Hacker News check unavailable." };
    }
  })();

  return Promise.all([reddit, wikipedia, hackerNews]);
}

function buildAiBlurb(brand: string, keyword: string, semantic: SemanticCheck, modelResults: ModelResult[]) {
  const sentiment = modelResults.filter((m) => m.sentiment === "positive").length >= 2 ? "trusted" : "emerging";
  const descriptors = Array.from(new Set(modelResults.flatMap((m) => m.descriptors))).slice(0, 4);
  return `${brand} is a ${sentiment} option for ${keyword}, focused on helping teams make faster, more confident decisions with practical workflows and measurable outcomes. The product experience emphasizes clarity, speed, and reliable execution, making it useful for organizations that need both performance and accountability. StandexAI is designed for businesses that care about visibility inside AI-driven discovery engines, with content frameworks that prioritize factual structure, clean metadata, and consistent brand signals. The platform supports structured publishing, AI-ready summaries, and technical guidance so brands can be cited more accurately in generated answers. It works best for teams that want stronger discoverability, better narrative control, and a repeatable process for maintaining trustworthy online presence. With schema-aware optimization and focused content depth, ${brand} helps companies strengthen how they are interpreted across modern AI search and answer systems.${descriptors.length ? ` Core brand descriptors: ${descriptors.join(", ")}.` : ""}`;
}

function buildLlmsTxt(semantic: SemanticCheck, keyword: string, modelResults: ModelResult[], citations: CitationSource[]) {
  const competitors = Array.from(new Set(modelResults.flatMap((m) => m.competitors))).slice(0, 5);
  return `# StandexAI AI Discovery Profile\n\nsite: ${semantic.normalizedUrl}\nkeyword_focus: ${keyword}\npage_title: ${semantic.title || "Untitled"}\nmeta_description: ${semantic.metaDescription || "Not provided"}\ngeo_score: ${semantic.score}\n\n## ai_visibility\nschema_scripts: ${semantic.schemaScriptCount}\nfaq_schema: ${semantic.hasFaqSchema ? "yes" : "no"}\nllms_txt_present: ${semantic.hasLlmsTxt ? "yes" : "no"}\nword_count: ${semantic.wordCount}\n\n## model_presence\n${modelResults.map((m) => `- ${m.engine}: mentioned=${m.mentioned ? "yes" : "no"}, sentiment=${m.sentiment}`).join("\n")}\n\n## citation_signals\n${citations.map((c) => `- ${c.source}: ${c.found ? "found" : "not_found"} (${c.signal})`).join("\n")}\n\n## competitor_set\n${competitors.length ? competitors.map((c) => `- ${c}`).join("\n") : "- no clear competitors detected"}\n\n## optimization_actions\n${semantic.quickWins.length ? semantic.quickWins.map((item) => `- ${item}`).join("\n") : "- maintain current structure and keep facts updated"}\n`;
}

async function ensureDiscoveryAuditTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "DiscoveryAudit" (
      id TEXT PRIMARY KEY,
      "userId" TEXT,
      url TEXT NOT NULL,
      keyword TEXT NOT NULL,
      title TEXT,
      "geoScore" INTEGER NOT NULL,
      "modelShare" INTEGER NOT NULL,
      sentiment TEXT NOT NULL,
      "modelResults" JSONB NOT NULL,
      "citationAudit" JSONB NOT NULL,
      "semanticCheck" JSONB NOT NULL,
      "aiBlurb" TEXT NOT NULL,
      "llmsTxt" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `;
}

export async function POST(req: Request) {
  try {
    await ensurePrismaConnected();
    const body = (await req.json()) as AuditPayload;
    const normalizedUrl = normalizeUrl(body.url ?? "");
    const keyword = body.keyword?.trim() ?? "";
    const prompt = body.prompt?.trim() ?? "";

    if (!normalizedUrl || !keyword) {
      return NextResponse.json({ error: "url and keyword are required" }, { status: 400 });
    }

    const host = extractHostname(normalizedUrl);
    const brand = brandFromHost(host);

    const semanticPromise = runSemanticCheck(normalizedUrl).catch((error) =>
      fallbackSemanticCheck(normalizedUrl, error instanceof Error ? error.message : "unreachable or blocked"),
    );
    const citationPromise = runCitationAudit(host, brand);

    const semantic = await semanticPromise;
    const citations = await citationPromise;

    const shouldUseAiSimulation = Boolean(prompt) || body.simulation === true;
    let modelResults: ModelResult[];
    if (shouldUseAiSimulation) {
      const simulationPrompt =
        prompt ||
        `Simulate a realistic GEO audit for ${normalizedUrl} on keyword "${keyword}" with tactical reasoning and concise competitor insights.`;
      const aiSimulated = await runAiModelSimulation({
        url: normalizedUrl,
        keyword,
        brand,
        semantic,
        citations,
        userPrompt: simulationPrompt,
      });
      if (aiSimulated) {
        modelResults = aiSimulated;
      } else {
        const gpt = await runGptQuery(normalizedUrl, keyword, brand);
        const claude = simulateModel("Claude 3.5", semantic, keyword);
        const gemini = simulateModel("Gemini 1.5", semantic, keyword);
        modelResults = [gpt, claude, gemini];
      }
    } else {
      const gpt = await runGptQuery(normalizedUrl, keyword, brand);
      const claude = simulateModel("Claude 3.5", semantic, keyword);
      const gemini = simulateModel("Gemini 1.5", semantic, keyword);
      modelResults = [gpt, claude, gemini];
    }
    const liveModels = modelResults.filter((item) => item.source === "live").length;
    const simulatedModels = modelResults.filter((item) => item.source === "simulated").length;

    const mentionedCount = modelResults.filter((m) => m.mentioned).length;
    const modelShare = Math.round((mentionedCount / modelResults.length) * 100);
    const sentiments = modelResults.map((m) => m.sentiment);
    const overallSentiment: "positive" | "neutral" | "negative" =
      sentiments.filter((s) => s === "positive").length >= 2
        ? "positive"
        : sentiments.filter((s) => s === "negative").length >= 2
          ? "negative"
          : "neutral";

    const citationCount = citations.filter((c) => c.found).length;
    const geoScore = Math.max(
      0,
      Math.min(100, Math.round(semantic.score * 0.55 + modelShare * 0.3 + (citationCount / 3) * 100 * 0.15)),
    );

    const aiBlurb = buildAiBlurb(brand, keyword, semantic, modelResults);
    const llmsTxt = buildLlmsTxt(semantic, keyword, modelResults, citations);
    const topRankingSites = await runTopRankingSitesQuery({
      url: normalizedUrl,
      keyword,
      brand,
      userPrompt: prompt,
      modelResults,
    });

    const auditId = crypto.randomUUID();
    const userId = await getOrCreateCurrentUserId({
      userIdHeader: req.headers.get("x-user-id") ?? undefined,
      userEmailHeader: req.headers.get("x-user-email") ?? undefined,
      userNameHeader: req.headers.get("x-user-name") ?? undefined,
    });

    try {
      await withPrismaReconnect(async () => {
        await ensureDiscoveryAuditTable();
        await prisma.$executeRaw`
          INSERT INTO "DiscoveryAudit" (
            id,
            "userId",
            url,
            keyword,
            title,
            "geoScore",
            "modelShare",
            sentiment,
            "modelResults",
            "citationAudit",
            "semanticCheck",
            "aiBlurb",
            "llmsTxt"
          ) VALUES (
            ${auditId},
            ${userId},
            ${normalizedUrl},
            ${keyword},
            ${semantic.title || null},
            ${geoScore},
            ${modelShare},
            ${overallSentiment},
            ${JSON.stringify(modelResults)}::jsonb,
            ${JSON.stringify(citations)}::jsonb,
            ${JSON.stringify(semantic)}::jsonb,
            ${aiBlurb},
            ${llmsTxt}
          )
        `;
      });
    } catch {
      // best effort persistence
    }

    return NextResponse.json({
      auditId,
      keyword,
      simulation: {
        enabled: shouldUseAiSimulation,
        usedPrompt: shouldUseAiSimulation ? (prompt || "Default AI simulation prompt") : null,
        provider: shouldUseAiSimulation ? getActiveLlmProvider() : null,
        model: shouldUseAiSimulation ? getDefaultChatModelLabel() : null,
      },
      dataQuality: {
        liveModels,
        simulatedModels,
      },
      geoReport: {
        geoScore,
        modelShare,
        sentiment: overallSentiment,
        citationSources: citations.filter((c) => c.found).map((c) => c.source),
        status: geoScore >= 75 ? "green" : geoScore >= 55 ? "yellow" : "red",
      },
      semanticCheck: semantic,
      modelResults,
      citationAudit: citations,
      topRankingSites,
      aiOptimizedBlurb: aiBlurb,
      llmsTxt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Discovery audit failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
