import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type AnalyzePayload = {
  contentId: string;
  text: string;
  industry: string;
};

type ComplianceFlag = {
  text: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  explanation: string;
  suggestion: string;
};

// Mock compliance analysis - in production, this would use AI
function analyzeCompliance(text: string, industry: string): ComplianceFlag[] {
  const flags: ComplianceFlag[] = [];

  // Healthcare rules
  if (industry === "HEALTHCARE") {
    if (text.toLowerCase().includes("guaranteed") || text.toLowerCase().includes("guarantee")) {
      flags.push({
        text: "guaranteed",
        severity: "CRITICAL",
        explanation: "Absolute guarantees are prohibited in healthcare marketing under FTC guidelines.",
        suggestion: 'Use "may help achieve" or "designed to support" instead',
      });
    }

    if (text.toLowerCase().includes("cure")) {
      flags.push({
        text: "cure",
        severity: "CRITICAL",
        explanation: "Medical cure claims require FDA approval and clinical evidence.",
        suggestion: "Replace with approved therapeutic claims or remove",
      });
    }
  }

  // Finance rules
  if (industry === "FINTECH" || industry === "INVESTMENT") {
    if (text.toLowerCase().includes("guaranteed returns")) {
      flags.push({
        text: "guaranteed returns",
        severity: "CRITICAL",
        explanation: "Investment return guarantees violate SEC regulations.",
        suggestion: "Use historical performance with proper disclaimers",
      });
    }
  }

  // Generic comparative claims
  if (text.toLowerCase().includes("fastest") || text.toLowerCase().includes("best")) {
    flags.push({
      text: text.match(/\b(fastest|best)\b/i)?.[0] || "comparative claim",
      severity: "WARNING",
      explanation: "Comparative claims require substantiation and evidence.",
      suggestion: "Cite specific metrics with verifiable sources or remove",
    });
  }

  return flags;
}

function calculateScores(text: string, industry: string): { seo: number; geo: number; compliance: number } {
  const wordCount = text.split(/\s+/).length;
  const hasH1 = text.includes("# ") || text.includes("<h1");
  const hasH2 = text.includes("## ") || text.includes("<h2");

  // Simple scoring logic
  let seo = 50;
  if (wordCount > 500) seo += 20;
  if (wordCount > 1000) seo += 10;
  if (hasH1) seo += 10;
  if (hasH2) seo += 10;

  let geo = 40;
  if (wordCount > 300) geo += 20;
  if (hasH2) geo += 15;
  if (text.includes("?")) geo += 15; // Question-based content

  const flags = analyzeCompliance(text, industry);
  let compliance = 100;
  flags.forEach((flag) => {
    if (flag.severity === "CRITICAL") compliance -= 20;
    if (flag.severity === "WARNING") compliance -= 10;
  });

  return { seo: Math.min(100, seo), geo: Math.min(100, geo), compliance: Math.max(0, compliance) };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as AnalyzePayload;

    const { contentId, text, industry } = body;

    if (!text || !industry) {
      return NextResponse.json({ error: "text and industry are required" }, { status: 400 });
    }

    const flags = analyzeCompliance(text, industry);
    const scores = calculateScores(text, industry);

    // If contentId is provided, save analysis
    if (contentId) {
      try {
        await prisma.content.update({
          where: { id: contentId },
          data: {
            seoScore: scores.seo,
            complianceScore: scores.compliance,
          },
        });
      } catch {
        // Content might not exist yet, that's okay
      }
    }

    return NextResponse.json({
      flags,
      scores,
      wordCount: text.split(/\s+/).length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
