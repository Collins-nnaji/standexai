/**
 * Shared helpers for the Console — full analysis bundle + persistence.
 */

export function firstLineTitle(raw: string): string {
  const line = raw.split(/\r?\n/).find((l) => l.trim()) ?? raw;
  const t = line.trim().replace(/\s+/g, " ");
  if (t.length <= 120) return t || "Untitled";
  return `${t.slice(0, 117)}…`;
}

export async function persistCommunicationAnalysis(payload: {
  title: string;
  source: "TEXT" | "VOICE";
  kind: string;
  overallScore?: number;
  toneScore?: number;
  riskScore?: number;
  clarityScore?: number;
  aiProbability?: number;
  riskLevel?: string | null;
}): Promise<void> {
  try {
    await fetch("/api/communication-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    /* non-blocking */
  }
}

export type AnalysisResult = {
  toneScore: number;
  riskScore: number;
  clarityScore: number;
  overallScore: number;
  flags: Array<{
    text: string;
    severity: string;
    category: string;
    explanation: string;
    suggestion: string;
  }>;
  summary: string;
};

export type RiskResult = {
  riskLevel: string;
  overallScore: number;
  issues: Array<{
    category: string;
    text: string;
    severity: string;
    explanation: string;
    saferVersion: string;
  }>;
};

export type IntentResult = {
  overallAssessment: string;
  confidenceScore: number;
  summary: string;
};

export type DetectionResult = {
  aiProbability: number;
  verdict: string;
  summary: string;
};

export type FullAnalysisBundle = {
  text: AnalysisResult;
  risk: RiskResult;
  intent: IntentResult;
  detect: DetectionResult;
};

export async function runFullAnalysis(text: string): Promise<
  { ok: true; bundle: FullAnalysisBundle } | { ok: false; error: string }
> {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: "No text to analyze" };

  try {
    const types = ["text", "risk", "intent", "detect"] as const;
    const results = await Promise.all(
      types.map(async (type) => {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, type }),
        });
        const data = (await res.json()) as { result?: unknown; error?: string };
        if (!res.ok) throw new Error(data.error || `Analysis failed (${type})`);
        return { type, result: data.result };
      }),
    );

    const bundle: Partial<FullAnalysisBundle> = {};
    for (const { type, result } of results) {
      if (type === "text") bundle.text = result as AnalysisResult;
      if (type === "risk") bundle.risk = result as RiskResult;
      if (type === "intent") bundle.intent = result as IntentResult;
      if (type === "detect") bundle.detect = result as DetectionResult;
    }

    return { ok: true, bundle: bundle as FullAnalysisBundle };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Analysis failed" };
  }
}

export function riskLevelToClaimLabel(level: string): "High" | "Medium" | "Low" {
  const n = level.toLowerCase();
  if (n === "high" || n === "critical") return "High";
  if (n === "medium") return "Medium";
  return "Low";
}

export function scoreToLetter(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

export function toneFromScore(score: number): { label: string; sub: string } {
  if (score >= 75) return { label: "On-brand", sub: "Clear" };
  if (score >= 50) return { label: "Mixed", sub: "Review tone" };
  return { label: "Off-brand", sub: "Adjust voice" };
}
