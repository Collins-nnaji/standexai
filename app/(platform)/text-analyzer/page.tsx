"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  FileText, Sparkles, Loader2, AlertTriangle, AlertCircle, Info,
  PenTool, Shield, Smile, Copy, CheckCircle2, TrendingUp, Eye, ChevronDown, ChevronUp
} from "lucide-react";

type Flag = {
  text: string;
  severity: "critical" | "warning" | "info";
  category: string;
  explanation: string;
  suggestion: string;
};

type AnalysisResult = {
  toneScore: number;
  riskScore: number;
  clarityScore: number;
  overallScore: number;
  flags: Flag[];
  summary: string;
  strengths: string[];
  improvements: string[];
};

function ScoreRing({ score, label, size = 72, color }: { score: number; label: string; size?: number; color: string }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="score-ring">
        <circle className="score-ring-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth="6" />
        <circle
          className="score-ring-fill"
          cx={size / 2} cy={size / 2} r={radius} strokeWidth="6"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="text-lg font-bold text-zinc-900" style={{ marginTop: -size / 2 - 10, position: "relative" }}>{score}</span>
      <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide mt-1">{label}</span>
    </div>
  );
}

export default function TextAnalyzerPage() {
  const searchParams = useSearchParams();
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [expandedFlag, setExpandedFlag] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const prefilled = searchParams.get("text");
    if (prefilled) {
      setText(decodeURIComponent(prefilled));
    }
  }, [searchParams]);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: "text" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data.result as AnalysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const severityConfig = {
    critical: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100", label: "Harmful / Toxic" },
    warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Unclear / Risky" },
    info: { icon: Info, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100", label: "Suggestion" },
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  const getRiskColor = (score: number) => {
    if (score <= 20) return "#10B981";
    if (score <= 50) return "#F59E0B";
    return "#EF4444";
  };

  const highlightText = (inputText: string, flags: Flag[]) => {
    if (!flags?.length) return inputText;
    let highlighted = inputText;
    const sortedFlags = [...flags].sort((a, b) => b.text.length - a.text.length);
    for (const flag of sortedFlags) {
      if (!flag.text) continue;
      const escaped = flag.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      const cls = flag.severity === "critical" ? "highlight-danger" : flag.severity === "warning" ? "highlight-warning" : "highlight-info";
      highlighted = highlighted.replace(regex, `<span class="${cls}" title="${flag.explanation}">$1</span>`);
    }
    return highlighted;
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-zinc-100 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100">
              <FileText className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Text Analyzer</h1>
              <p className="text-xs text-zinc-400">Paste text to get instant tone, risk, and clarity insights</p>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || analyzing}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {analyzing ? "Analyzing..." : "Analyze"}
          </button>
        </div>
      </header>

      {/* Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Input */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-zinc-100">
          <div className="flex-1 overflow-auto p-6">
            {result ? (
              <div className="min-h-full">
                <div className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Analyzed Text (flagged issues highlighted)</div>
                <div
                  className="text-[15px] leading-[1.8] text-zinc-700 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: highlightText(text, result.flags) }}
                />
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here...&#10;&#10;Try an email, speech, social media post, business proposal, or any written communication. The analyzer will check tone, detect risks, assess clarity, and suggest improvements."
                className="w-full h-full min-h-[400px] bg-transparent text-[15px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none resize-none"
              />
            )}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-zinc-50 bg-zinc-50/50 px-6 py-3 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {text.trim() ? `${text.trim().split(/\s+/).length} words` : "No text entered"}
            </span>
            {result && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setResult(null); }}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-700"
                >
                  Edit Text
                </button>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Re-analyze
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Analysis Panel */}
        <div className="w-[420px] shrink-0 overflow-auto bg-white p-6 space-y-6">
          {analyzing && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <div className="space-y-1 text-center">
                <p className="text-sm font-semibold text-zinc-700 animate-pulse">Analyzing tone...</p>
                <p className="text-xs text-zinc-400">Checking risk and clarity</p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-100 p-4">
              <p className="text-sm font-semibold text-red-600">{error}</p>
            </div>
          )}

          {!result && !analyzing && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center">
                <FileText className="h-8 w-8 text-zinc-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-500">Paste text and click Analyze</p>
                <p className="text-xs text-zinc-400 mt-1">Your analysis will appear here</p>
              </div>
            </div>
          )}

          {result && (
            <>
              {/* Scores */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Tone", score: result.toneScore, color: getScoreColor(result.toneScore) },
                  { label: "Risk", score: result.riskScore, color: getRiskColor(result.riskScore) },
                  { label: "Clarity", score: result.clarityScore, color: getScoreColor(result.clarityScore) },
                  { label: "Overall", score: result.overallScore, color: getScoreColor(result.overallScore) },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl font-bold" style={{ color: s.color }}>{s.score}</div>
                    <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-zinc-50 p-4">
                <p className="text-sm text-zinc-600 leading-relaxed">{result.summary}</p>
              </div>

              {/* Flagged Issues */}
              {result.flags?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Flagged Issues ({result.flags.length})
                  </h3>
                  <div className="space-y-2">
                    {result.flags.map((flag, i) => {
                      const config = severityConfig[flag.severity];
                      const Icon = config.icon;
                      const isExpanded = expandedFlag === i;
                      return (
                        <div key={i} className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}>
                          <button
                            onClick={() => setExpandedFlag(isExpanded ? null : i)}
                            className="w-full flex items-start gap-3 p-3 text-left"
                          >
                            <Icon className={`h-4 w-4 ${config.color} shrink-0 mt-0.5`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-zinc-800 truncate">&ldquo;{flag.text}&rdquo;</p>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{config.label} &middot; {flag.category}</p>
                            </div>
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
                          </button>
                          {isExpanded && (
                            <div className="px-3 pb-3 pt-0 border-t border-white/50">
                              <p className="text-xs text-zinc-600 mb-2 leading-relaxed">{flag.explanation}</p>
                              <div className="rounded-lg bg-white border border-zinc-200 p-2.5">
                                <p className="text-[10px] font-semibold text-zinc-400 uppercase mb-1">Suggestion</p>
                                <p className="text-xs text-zinc-700">{flag.suggestion}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {result.strengths?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    Strengths
                  </h3>
                  <div className="space-y-2">
                    {result.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {result.improvements?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-indigo-500" />
                    Improvements
                  </h3>
                  <div className="space-y-2">
                    {result.improvements.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-600 leading-relaxed">
                        <ArrowRight className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-100">
                <button
                  onClick={() => {
                    const encoded = encodeURIComponent(text);
                    window.location.href = `/rewrite-studio?text=${encoded}&mode=safe`;
                  }}
                  className="flex items-center gap-2 rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
                >
                  <PenTool className="h-3.5 w-3.5" />
                  Rewrite Safely
                </button>
                <button
                  onClick={() => {
                    const encoded = encodeURIComponent(text);
                    window.location.href = `/rewrite-studio?text=${encoded}&mode=professional`;
                  }}
                  className="flex items-center gap-2 rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Improve Clarity
                </button>
                <button
                  onClick={() => {
                    const encoded = encodeURIComponent(text);
                    window.location.href = `/rewrite-studio?text=${encoded}&mode=friendly`;
                  }}
                  className="flex items-center gap-2 rounded-lg bg-zinc-50 border border-zinc-200 px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 transition"
                >
                  <Smile className="h-3.5 w-3.5" />
                  Adjust Tone
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ArrowRight(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}
