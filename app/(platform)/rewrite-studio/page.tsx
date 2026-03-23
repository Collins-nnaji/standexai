"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  PenTool, Sparkles, Loader2, Copy, CheckCircle2, RefreshCw,
  ArrowRight, Briefcase, Smile, Zap, Shield, Mic, Minus
} from "lucide-react";

type RewriteResult = {
  rewritten: string;
  changes: Array<{ original: string; rewritten: string; reason: string }>;
  summary: string;
  toneShift: string;
  wordCountOriginal: number;
  wordCountRewritten: number;
};

type Mode = "professional" | "friendly" | "persuasive" | "safe" | "speaker" | "neutral";

const MODES: { id: Mode; label: string; icon: React.ComponentType<{ className?: string }>; desc: string; color: string }[] = [
  { id: "professional", label: "Professional", icon: Briefcase, desc: "Polished business tone", color: "indigo" },
  { id: "friendly", label: "Friendly", icon: Smile, desc: "Warm and approachable", color: "emerald" },
  { id: "persuasive", label: "Persuasive", icon: Zap, desc: "Compelling rhetoric", color: "amber" },
  { id: "safe", label: "Safe", icon: Shield, desc: "Risk-free language", color: "blue" },
  { id: "speaker", label: "High-Impact Speech", icon: Mic, desc: "Optimized for delivery", color: "violet" },
  { id: "neutral", label: "Neutral", icon: Minus, desc: "Balanced and objective", color: "zinc" },
];

const colorMap: Record<string, { bg: string; border: string; text: string; activeBg: string }> = {
  indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", activeBg: "bg-indigo-600" },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", activeBg: "bg-emerald-600" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", activeBg: "bg-amber-600" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", activeBg: "bg-blue-600" },
  violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-700", activeBg: "bg-violet-600" },
  zinc: { bg: "bg-zinc-100", border: "border-zinc-300", text: "text-zinc-700", activeBg: "bg-zinc-600" },
};

export default function RewriteStudioPage() {
  const searchParams = useSearchParams();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<Mode>("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [showChanges, setShowChanges] = useState(false);

  useEffect(() => {
    const prefilled = searchParams.get("text");
    const preMode = searchParams.get("mode") as Mode | null;
    if (prefilled) setText(decodeURIComponent(prefilled));
    if (preMode && MODES.some(m => m.id === preMode)) setMode(preMode);
  }, [searchParams]);

  const handleRewrite = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rewrite failed");
      setResult(data.result as RewriteResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rewrite failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result?.rewritten) {
      navigator.clipboard.writeText(result.rewritten);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const activeMode = MODES.find(m => m.id === mode)!;
  const colors = colorMap[activeMode.color];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-zinc-100 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
              <PenTool className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Rewrite Studio</h1>
              <p className="text-xs text-zinc-400">Transform your text with AI-powered rewriting</p>
            </div>
          </div>
          <button
            onClick={handleRewrite}
            disabled={!text.trim() || loading}
            className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition shadow-lg disabled:opacity-50 ${colors.activeBg} hover:opacity-90`}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Rewriting..." : "Rewrite"}
          </button>
        </div>
      </header>

      {/* Mode Selector */}
      <div className="border-b border-zinc-100 bg-white px-6 py-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MODES.map((m) => {
            const c = colorMap[m.color];
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => { setMode(m.id); setResult(null); }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition ${
                  active ? `${c.activeBg} text-white shadow-md` : `${c.bg} border ${c.border} ${c.text} hover:shadow-sm`
                }`}
              >
                <m.icon className="h-3.5 w-3.5" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="flex flex-1 overflow-hidden">
        {/* Original */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-zinc-100">
          <div className="px-6 py-3 border-b border-zinc-50 bg-zinc-50/50">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Original Text</span>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setResult(null); }}
              placeholder="Paste or type the text you want to rewrite...&#10;&#10;The studio will transform it into your chosen style while preserving the core message."
              className="w-full h-full min-h-[300px] bg-transparent text-[15px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none resize-none"
            />
          </div>
          <div className="border-t border-zinc-50 bg-zinc-50/50 px-6 py-3">
            <span className="text-xs text-zinc-400">{text.trim() ? `${text.trim().split(/\s+/).length} words` : "No text entered"}</span>
          </div>
        </div>

        {/* Rewritten */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-3 border-b border-zinc-50 bg-zinc-50/50 flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wide ${colors.text}`}>
              {activeMode.label} Version
            </span>
            {result && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowChanges(!showChanges)}
                  className="text-[11px] font-semibold text-zinc-500 hover:text-zinc-700"
                >
                  {showChanges ? "Hide Changes" : "Show Changes"}
                </button>
                <button onClick={copyToClipboard} className="flex items-center gap-1 text-[11px] font-semibold text-zinc-500 hover:text-zinc-700">
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto p-6">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                <p className="text-sm font-semibold text-zinc-500 animate-pulse">Rewriting in {activeMode.label.toLowerCase()} tone...</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                <p className="text-sm font-semibold text-red-600">{error}</p>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-zinc-50 flex items-center justify-center">
                  <PenTool className="h-8 w-8 text-zinc-300" />
                </div>
                <p className="text-sm font-semibold text-zinc-500">Rewritten version will appear here</p>
                <p className="text-xs text-zinc-400">Choose a mode and click Rewrite</p>
              </div>
            )}

            {result && !showChanges && (
              <div className="text-[15px] leading-relaxed text-zinc-800 whitespace-pre-wrap">
                {result.rewritten}
              </div>
            )}

            {result && showChanges && (
              <div className="space-y-4">
                {result.changes?.map((c, i) => (
                  <div key={i} className="rounded-xl border border-zinc-100 overflow-hidden">
                    <div className="bg-red-50 px-4 py-2.5 border-b border-red-100">
                      <p className="text-xs text-red-600 line-through">{c.original}</p>
                    </div>
                    <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100">
                      <p className="text-xs text-emerald-700 font-semibold">{c.rewritten}</p>
                    </div>
                    <div className="bg-white px-4 py-2">
                      <p className="text-[11px] text-zinc-500">{c.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {result && (
            <div className="border-t border-zinc-50 bg-zinc-50/50 px-6 py-3 flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {result.wordCountRewritten} words
                {result.wordCountOriginal && (
                  <span className="ml-2 text-zinc-300">
                    ({result.wordCountRewritten > result.wordCountOriginal ? "+" : ""}{result.wordCountRewritten - result.wordCountOriginal})
                  </span>
                )}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setText(result.rewritten); setResult(null); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  Apply Changes
                </button>
                <button
                  onClick={handleRewrite}
                  className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-700"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Bar */}
      {result?.summary && (
        <div className={`border-t border-zinc-100 ${colors.bg} px-6 py-3`}>
          <p className={`text-xs font-semibold ${colors.text}`}>
            <Sparkles className="h-3.5 w-3.5 inline mr-1.5" />
            {result.summary}
            {result.toneShift && <span className="text-zinc-500 font-normal ml-2">&middot; {result.toneShift}</span>}
          </p>
        </div>
      )}
    </div>
  );
}
