"use client";

import { useState } from "react";
import {
  ScanSearch, Sparkles, Loader2, AlertTriangle, CheckCircle2,
  Bot, User, Wand2, Copy
} from "lucide-react";

type DetectionResult = {
  aiProbability: number;
  verdict: string;
  sections: Array<{ text: string; probability: number; reason: string }>;
  indicators: { aiSignals: string[]; humanSignals: string[] };
  suggestions: string[];
  summary: string;
};

export default function AIDetectionPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState("");
  const [humanizing, setHumanizing] = useState(false);

  const handleDetect = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type: "detect" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Detection failed");
      setResult(data.result as DetectionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Detection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleHumanize = async () => {
    if (!text.trim()) return;
    setHumanizing(true);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode: "friendly" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Humanize failed");
      setText(data.result?.rewritten || text);
      setResult(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Humanize failed");
    } finally {
      setHumanizing(false);
    }
  };

  const getProbColor = (prob: number) => {
    if (prob <= 30) return { text: "text-emerald-600", bg: "bg-emerald-500", ring: "#10B981" };
    if (prob <= 60) return { text: "text-amber-600", bg: "bg-amber-500", ring: "#F59E0B" };
    return { text: "text-red-600", bg: "bg-red-500", ring: "#EF4444" };
  };

  const verdictLabel: Record<string, string> = {
    likely_human: "Likely Human-Written",
    mixed: "Mixed Content",
    likely_ai: "Likely AI-Generated",
    definitely_ai: "Almost Certainly AI",
  };

  const circumference = 2 * Math.PI * 45;

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-8 lg:py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100">
              <ScanSearch className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">AI Detection & Authenticity</h1>
              <p className="text-xs text-zinc-400">Check if text was AI-generated and humanize it</p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setResult(null); }}
            placeholder="Paste text here to check if it was written by AI...&#10;&#10;The detector analyzes writing patterns, sentence structure, vocabulary diversity, and other signals to estimate the probability of AI authorship."
            className="w-full min-h-[180px] px-5 py-4 text-[15px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none resize-none"
          />
          <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3 bg-zinc-50/50">
            <span className="text-xs text-zinc-400">{text.trim() ? `${text.trim().split(/\s+/).length} words` : "No text entered"}</span>
            <div className="flex items-center gap-3">
              {result && (
                <button
                  onClick={handleHumanize}
                  disabled={humanizing}
                  className="flex items-center gap-2 rounded-lg bg-violet-50 border border-violet-100 px-4 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100 transition disabled:opacity-50"
                >
                  {humanizing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wand2 className="h-3.5 w-3.5" />}
                  Humanize This Text
                </button>
              )}
              <button
                onClick={handleDetect}
                disabled={!text.trim() || loading}
                className="flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-amber-700 transition shadow-lg shadow-amber-600/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ScanSearch className="h-3.5 w-3.5" />}
                {loading ? "Detecting..." : "Detect AI"}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 p-4">
            <p className="text-sm font-semibold text-red-600">{error}</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
            <p className="text-sm font-semibold text-zinc-600 animate-pulse">Scanning for AI patterns...</p>
          </div>
        )}

        {result && (
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Score Panel */}
            <div className="space-y-6">
              {/* Probability Ring */}
              <div className="rounded-2xl border border-zinc-100 bg-white p-6 text-center">
                <div className="relative inline-block mb-4">
                  <svg width="120" height="120" className="score-ring">
                    <circle className="score-ring-track" cx="60" cy="60" r="45" strokeWidth="8" />
                    <circle
                      className="score-ring-fill"
                      cx="60" cy="60" r="45" strokeWidth="8"
                      stroke={getProbColor(result.aiProbability).ring}
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (result.aiProbability / 100) * circumference}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${getProbColor(result.aiProbability).text}`}>{result.aiProbability}%</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-zinc-800">{verdictLabel[result.verdict] || result.verdict}</p>
                <p className="text-xs text-zinc-400 mt-1">AI Probability Score</p>
              </div>

              {/* Signals */}
              <div className="rounded-2xl border border-zinc-100 bg-white p-5 space-y-4">
                <div>
                  <h3 className="text-xs font-semibold text-red-500 flex items-center gap-1.5 mb-2">
                    <Bot className="h-3.5 w-3.5" />
                    AI Signals
                  </h3>
                  <div className="space-y-1.5">
                    {result.indicators?.aiSignals?.map((s, i) => (
                      <p key={i} className="text-[11px] text-zinc-600 flex items-start gap-1.5">
                        <AlertTriangle className="h-3 w-3 text-red-400 shrink-0 mt-0.5" />
                        {s}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="border-t border-zinc-50 pt-4">
                  <h3 className="text-xs font-semibold text-emerald-500 flex items-center gap-1.5 mb-2">
                    <User className="h-3.5 w-3.5" />
                    Human Signals
                  </h3>
                  <div className="space-y-1.5">
                    {result.indicators?.humanSignals?.map((s, i) => (
                      <p key={i} className="text-[11px] text-zinc-600 flex items-start gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                        {s}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-6">
              {/* Highlighted Sections */}
              {result.sections?.length > 0 && (
                <div className="rounded-2xl border border-zinc-100 bg-white p-6">
                  <h3 className="text-sm font-semibold text-zinc-700 mb-4">Section-by-Section Analysis</h3>
                  <div className="space-y-3">
                    {result.sections.map((s, i) => {
                      const c = getProbColor(s.probability);
                      return (
                        <div key={i} className="rounded-xl border border-zinc-100 overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 bg-zinc-50">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${c.bg}`} />
                              <span className={`text-xs font-semibold ${c.text}`}>{s.probability}% AI</span>
                            </div>
                            <span className="text-[10px] text-zinc-400">{s.reason}</span>
                          </div>
                          <div className="px-4 py-3">
                            <p className="text-sm text-zinc-700 leading-relaxed">{s.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions?.length > 0 && (
                <div className="rounded-2xl border border-zinc-100 bg-white p-6">
                  <h3 className="text-sm font-semibold text-zinc-700 mb-4 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-500" />
                    How to Make It More Human
                  </h3>
                  <div className="space-y-2">
                    {result.suggestions.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg bg-violet-50 border border-violet-100 p-3">
                        <Wand2 className="h-3.5 w-3.5 text-violet-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-violet-800 leading-relaxed">{s}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary */}
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                <p className="text-sm text-amber-800 leading-relaxed">{result.summary}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
