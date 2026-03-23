"use client";

import { useState } from "react";
import {
  Brain, Sparkles, Loader2, AlertTriangle, Eye, Shield,
  ArrowRight, Zap
} from "lucide-react";

type IntentResult = {
  overallAssessment: string;
  confidenceScore: number;
  tactics: Array<{
    type: string;
    text: string;
    explanation: string;
    impact: string;
  }>;
  biasDetected: string[];
  summary: string;
  neutralVersion: string;
};

const ASSESSMENT_CONFIG: Record<string, { bg: string; border: string; text: string; label: string; desc: string }> = {
  neutral: {
    bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700",
    label: "Neutral", desc: "No persuasion or manipulation tactics detected."
  },
  mildly_persuasive: {
    bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700",
    label: "Mildly Persuasive", desc: "Uses standard persuasion techniques common in everyday communication."
  },
  strongly_persuasive: {
    bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700",
    label: "Strongly Persuasive", desc: "Contains significant persuasion tactics that could influence decision-making."
  },
  manipulative: {
    bg: "bg-red-50", border: "border-red-200", text: "text-red-700",
    label: "Manipulative", desc: "Contains manipulative language designed to exploit psychological vulnerabilities."
  },
};

const TACTIC_LABELS: Record<string, string> = {
  social_pressure: "Social Pressure",
  emotional_manipulation: "Emotional Manipulation",
  false_urgency: "False Urgency",
  gaslighting: "Gaslighting",
  bandwagon: "Bandwagon Effect",
  guilt_trip: "Guilt Trip",
  fear_appeal: "Fear Appeal",
  flattery: "Flattery",
  authority_bias: "Authority Bias",
  straw_man: "Straw Man",
  appeal_to_emotion: "Appeal to Emotion",
};

const IMPACT_COLORS: Record<string, string> = {
  low: "bg-blue-100 text-blue-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function IntentAnalyzerPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntentResult | null>(null);
  const [error, setError] = useState("");
  const [showNeutral, setShowNeutral] = useState(false);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: "intent" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data.result as IntentResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const assessment = result ? (ASSESSMENT_CONFIG[result.overallAssessment] || ASSESSMENT_CONFIG.neutral) : null;

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-8 lg:py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 border border-pink-100">
              <Brain className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Intent & Psychology Analyzer</h1>
              <p className="text-xs text-zinc-400">Detect manipulation, bias, and hidden persuasion tactics</p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); }}
            placeholder="Paste text to analyze for hidden intent and psychological tactics...&#10;&#10;Example: &quot;Everyone else agrees, so you should too. If you don't act now, you'll miss out forever. Trust me, I know what's best for you.&quot;"
            className="w-full min-h-[160px] px-5 py-4 text-[15px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none resize-none"
          />
          <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 bg-zinc-50/50">
            <span className="text-xs text-zinc-400">{text.trim() ? `${text.trim().split(/\s+/).length} words` : "No text entered"}</span>
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || loading}
              className="flex items-center gap-2 rounded-lg bg-pink-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-pink-700 transition shadow-lg shadow-pink-600/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
              {loading ? "Analyzing..." : "Analyze Intent"}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-4">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-pink-400" />
            <p className="text-sm font-semibold text-zinc-600 animate-pulse">Analyzing psychological patterns...</p>
          </div>
        )}

        {result && assessment && (
          <div className="space-y-6">
            {/* Assessment Banner */}
            <div className={`rounded-2xl ${assessment.bg} border ${assessment.border} p-6 flex items-center justify-between`}>
              <div className="flex items-center gap-4">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${assessment.bg}`}>
                  <Brain className={`h-7 w-7 ${assessment.text}`} />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${assessment.text}`}>{assessment.label}</h2>
                  <p className="text-sm text-zinc-600 mt-0.5">{assessment.desc}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${assessment.text}`}>{result.confidenceScore}%</div>
                <div className="text-[10px] font-semibold text-zinc-400 uppercase">Confidence</div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              {/* Tactics */}
              <div className="space-y-4">
                {result.tactics?.length > 0 ? (
                  <>
                    <h3 className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-pink-500" />
                      Tactics Detected ({result.tactics.length})
                    </h3>
                    {result.tactics.map((t, i) => (
                      <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full ${IMPACT_COLORS[t.impact] || IMPACT_COLORS.low}`}>
                            {t.impact} impact
                          </span>
                          <span className="text-xs font-semibold text-zinc-700">
                            {TACTIC_LABELS[t.type] || t.type}
                          </span>
                        </div>
                        <div className="rounded-xl bg-pink-50 border border-pink-100 px-4 py-3 mb-3">
                          <p className="text-sm text-pink-800 font-medium">&ldquo;{t.text}&rdquo;</p>
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed">{t.explanation}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-8 text-center">
                    <Shield className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                    <p className="text-lg font-bold text-emerald-700">No Tactics Detected</p>
                    <p className="text-sm text-emerald-600 mt-1">This text appears to be straightforward and genuine.</p>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Biases */}
                {result.biasDetected?.length > 0 && (
                  <div className="rounded-2xl border border-zinc-100 bg-white p-5">
                    <h3 className="text-xs font-semibold text-zinc-500 mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      Cognitive Biases Detected
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {result.biasDetected.map((b, i) => (
                        <span key={i} className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-700">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Neutral Version */}
                {result.neutralVersion && (
                  <div className="rounded-2xl border border-zinc-100 bg-white p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-semibold text-zinc-500 flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5 text-emerald-500" />
                        Neutral Version
                      </h3>
                      <button
                        onClick={() => setShowNeutral(!showNeutral)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        {showNeutral ? "Hide" : "Show"}
                      </button>
                    </div>
                    {showNeutral && (
                      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                        <p className="text-sm text-emerald-800 leading-relaxed">{result.neutralVersion}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Summary */}
                <div className="rounded-2xl bg-pink-50 border border-pink-100 p-5">
                  <h3 className="text-xs font-semibold text-pink-700 mb-2">Overall Assessment</h3>
                  <p className="text-sm text-pink-800 leading-relaxed">{result.summary}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
