export type SentimentLabel = "positive" | "neutral" | "negative";

export type SignalResult = {
  sentiment: {
    score: number;
    label: SentimentLabel;
    confidence: number;
  };
  aiNoise: {
    score: number;
    level: "clean" | "watch" | "high";
    matchedPatterns: string[];
  };
  qualitySignals: {
    clarityScore: number;
    specificityScore: number;
    hypeScore: number;
  };
  rewriteGuidance: string[];
};

const POSITIVE_WORDS = [
  "improve",
  "reliable",
  "trusted",
  "efficient",
  "clear",
  "secure",
  "compliant",
  "accurate",
  "measurable",
  "confident",
];

const NEGATIVE_WORDS = [
  "risk",
  "fail",
  "error",
  "delay",
  "uncertain",
  "unsafe",
  "violate",
  "penalty",
  "loss",
  "problem",
];

const AI_NOISE_PATTERNS = [
  "revolutionary",
  "game-changing",
  "next-generation",
  "cutting-edge",
  "unprecedented",
  "seamless",
  "unlock potential",
  "transform your business",
  "in today's world",
  "leverage",
  "synergy",
  "powerful",
  "world-class",
  "state-of-the-art",
  "industry-leading",
  "best-in-class",
];

const HYPE_PATTERNS = ["guaranteed", "always", "never", "100%", "instantly", "no risk"];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function countMatches(text: string, patterns: string[]) {
  return patterns.reduce((acc, pattern) => {
    const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = text.match(regex);
    return acc + (matches ? matches.length : 0);
  }, 0);
}

export function analyzeSignals(rawText: string): SignalResult {
  const text = rawText.toLowerCase();
  const words = text.split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;

  const positive = countMatches(text, POSITIVE_WORDS);
  const negative = countMatches(text, NEGATIVE_WORDS);
  const rawSentiment = ((positive - negative) / wordCount) * 500;
  const sentimentScore = Math.round(clamp(rawSentiment, -100, 100));

  let sentimentLabel: SentimentLabel = "neutral";
  if (sentimentScore > 15) sentimentLabel = "positive";
  if (sentimentScore < -15) sentimentLabel = "negative";

  const sentimentConfidence = clamp(40 + Math.abs(sentimentScore) * 0.5 + (positive + negative) * 2, 40, 95);

  const matchedPatterns = AI_NOISE_PATTERNS.filter((pattern) => new RegExp(`\\b${pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(text));
  const noiseCount = countMatches(text, AI_NOISE_PATTERNS);
  const hypeCount = countMatches(text, HYPE_PATTERNS);

  const aiNoiseScore = Math.round(clamp((noiseCount / Math.max(wordCount / 35, 1)) * 22 + hypeCount * 14, 0, 100));
  const clarityScore = Math.round(clamp(90 - aiNoiseScore * 0.55 - hypeCount * 4, 10, 95));
  const specificityScore = Math.round(clamp(45 + Math.min(wordCount, 400) / 12 - noiseCount * 2.5, 10, 95));
  const hypeScore = Math.round(clamp(aiNoiseScore * 0.85 + hypeCount * 8, 0, 100));

  const level = aiNoiseScore < 30 ? "clean" : aiNoiseScore < 60 ? "watch" : "high";

  const rewriteGuidance: string[] = [];
  if (aiNoiseScore >= 45) {
    rewriteGuidance.push("Replace buzzwords with measurable claims (metrics, scope, timeframe).");
  }
  if (hypeCount >= 1) {
    rewriteGuidance.push("Remove absolute promises like 'guaranteed' or '100%' unless evidence is provided.");
  }
  if (specificityScore < 45) {
    rewriteGuidance.push("Add specific entities, constraints, and outcomes to reduce ambiguity.");
  }
  if (rewriteGuidance.length === 0) {
    rewriteGuidance.push("Language quality is strong. Keep claims factual and evidence-backed.");
  }

  return {
    sentiment: {
      score: sentimentScore,
      label: sentimentLabel,
      confidence: Math.round(sentimentConfidence),
    },
    aiNoise: {
      score: aiNoiseScore,
      level,
      matchedPatterns,
    },
    qualitySignals: {
      clarityScore,
      specificityScore,
      hypeScore,
    },
    rewriteGuidance,
  };
}
