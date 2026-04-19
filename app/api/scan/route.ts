import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ScanPayload = {
  url?: string;
};

type ScanResult = {
  normalizedUrl: string;
  title: string;
  metaDescription: string;
  h1Count: number;
  h2Count: number;
  wordCount: number;
  canonical: string;
  schemaScriptCount: number;
  hasFaqSchema: boolean;
  robotsDirectives: string;
  issues: string[];
  quickWins: string[];
  score: number;
};

function normalizeUrl(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
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

function extractFirst(html: string, regex: RegExp) {
  const match = html.match(regex);
  return match?.[1]?.trim() ?? "";
}

function analyze(html: string, normalizedUrl: string): ScanResult {
  const title = extractFirst(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const metaDescription = extractFirst(
    html,
    /<meta[^>]*name=["']description["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i,
  );
  const canonical = extractFirst(
    html,
    /<link[^>]*rel=["']canonical["'][^>]*href=["']([\s\S]*?)["'][^>]*>/i,
  );
  const robotsDirectives = extractFirst(
    html,
    /<meta[^>]*name=["']robots["'][^>]*content=["']([\s\S]*?)["'][^>]*>/i,
  );

  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const h2Count = (html.match(/<h2\b/gi) ?? []).length;
  const schemaScripts = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi) ?? [];
  const hasFaqSchema = schemaScripts.some((script) => /"@type"\s*:\s*"FAQPage"/i.test(script));
  const wordCount = textContent(html).split(" ").filter(Boolean).length;

  const issues: string[] = [];
  const quickWins: string[] = [];

  if (!title) issues.push("Missing <title> tag.");
  if (title && (title.length < 35 || title.length > 65)) {
    issues.push("Title length is outside 35-65 recommended range.");
    quickWins.push("Rewrite title to 35-65 characters with primary keyword near the front.");
  }

  if (!metaDescription) issues.push("Missing meta description.");
  if (metaDescription && (metaDescription.length < 120 || metaDescription.length > 160)) {
    issues.push("Meta description length is outside 120-160 recommended range.");
    quickWins.push("Adjust meta description to 120-160 characters with clear benefit + CTA.");
  }

  if (h1Count === 0) {
    issues.push("No H1 found.");
    quickWins.push("Add one clear H1 with the primary keyword.");
  }
  if (h1Count > 1) {
    issues.push("Multiple H1 tags found.");
    quickWins.push("Keep a single H1 and move extras to H2/H3.");
  }

  if (h2Count < 2) {
    issues.push("Low heading depth (fewer than 2 H2 tags).");
    quickWins.push("Add descriptive H2s to improve structure and scanning.");
  }

  if (!canonical) {
    issues.push("Missing canonical URL.");
    quickWins.push("Add a canonical link tag to reduce duplicate-content risk.");
  }

  if (schemaScripts.length === 0) {
    issues.push("No JSON-LD schema detected.");
    quickWins.push("Add Organization and FAQPage schema where relevant.");
  }

  if (wordCount < 500) {
    issues.push("Low content depth (under 500 words).");
    quickWins.push("Expand with FAQs, examples, and location-specific sections.");
  }

  let score = 100;
  score -= issues.length * 8;
  if (hasFaqSchema) score += 4;
  score = Math.max(0, Math.min(100, score));

  return {
    normalizedUrl,
    title,
    metaDescription,
    h1Count,
    h2Count,
    wordCount,
    canonical,
    schemaScriptCount: schemaScripts.length,
    hasFaqSchema,
    robotsDirectives,
    issues,
    quickWins,
    score,
  };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ScanPayload;
    const normalizedUrl = normalizeUrl(body.url ?? "");

    if (!normalizedUrl) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    const response = await fetch(normalizedUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Standex Digital-Scanner/1.0",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch website (${response.status})` },
        { status: 400 },
      );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("text/html")) {
      return NextResponse.json({ error: "URL did not return an HTML page" }, { status: 400 });
    }

    const html = await response.text();
    const result = analyze(html, normalizedUrl);

    return NextResponse.json({ result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Website scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
