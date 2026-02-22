"use client";

import { useState } from "react";
import {
  Search, AlertTriangle, Shield, CheckCircle2, Loader2,
  TrendingUp, RotateCw, Download, Mail, ChevronDown, ChevronUp, Activity
} from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Flag = {
  claim: string;
  reason: string;
  severity: "critical" | "warning" | "info";
};

type ModelResponse = {
  model: string;
  text: string;
  flags: Flag[];
};

type StandexScoreBreakdown = {
  factualAccuracy: number;
  crossModelConsensus: number;
  dataFreshness: number;
  hallucinationDensity: number;
};

type StandexScoreResult = {
  brand: string;
  standexScore: number;
  tier: "excellent" | "moderate" | "high" | "critical";
  breakdown: StandexScoreBreakdown;
  models: ModelResponse[];
  flagCount: number;
  scanId: string;
  cachedAt: string;
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PRESET_BRANDS = [
  "Monzo", "Revolut", "Stripe", "HSBC", "Wise", "Starling",
  "Barclays", "PayPal", "Square", "Plaid",
];

const TIER_CONFIG = {
  excellent: {
    label: "Excellent",
    icon: "✅",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    bar: "bg-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  moderate: {
    label: "Moderate Risk",
    icon: "⚠️",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    bar: "bg-amber-400",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  high: {
    label: "High Risk",
    icon: "🟠",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    bar: "bg-orange-400",
    badge: "bg-orange-100 text-orange-700 border-orange-200",
  },
  critical: {
    label: "Critical",
    icon: "🔴",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    bar: "bg-red-500",
    badge: "bg-red-100 text-red-700 border-red-200",
  },
};

const FLAG_SEVERITY_STYLE = {
  critical: "bg-red-50 border-red-100 text-red-700",
  warning: "bg-amber-50 border-amber-100 text-amber-700",
  info: "bg-zinc-50 border-zinc-100 text-zinc-500",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function BrandPulsePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StandexScoreResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [expandedModel, setExpandedModel] = useState<string | null>(null);

  const runScan = async (brand: string) => {
    if (!brand.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setEmailSubmitted(false);
    setEmail("");
    setExpandedModel(null);

    try {
      const res = await fetch("/api/standex-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brand: brand.trim() }),
      });
      const data = await res.json() as StandexScoreResult & { error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Scan failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitEmail = async () => {
    if (!email.trim() || !result) return;
    // Re-run scan with email for lead capture
    await fetch("/api/standex-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand: result.brand, email: email.trim() }),
    });
    setEmailSubmitted(true);
  };

  const tier = result ? TIER_CONFIG[result.tier] : null;

  return (
    <div className="flex flex-1 flex-col bg-white min-h-screen">

      {/* Header */}
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-zinc-100 bg-white px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-zinc-950 uppercase tracking-tighter">Brand Pulse</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Live AI Representation Scanner</p>
            </div>
          </div>
        </div>
        {result && (
          <button
            onClick={() => runScan(result.brand)}
            className="flex items-center gap-2 rounded-xl border border-zinc-100 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50 transition"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Rescan
          </button>
        )}
      </header>

      <main className="flex-1 p-8 lg:p-12 max-w-[1400px] mx-auto w-full">

        {/* Search bar */}
        <div className="mb-10">
          <div className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-300" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runScan(query)}
              placeholder="Search your brand... e.g. Monzo, Stripe, HSBC"
              className="w-full rounded-2xl border border-zinc-200 bg-[#F9FAFB] py-5 pl-14 pr-36 text-sm font-medium text-zinc-950 placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition shadow-sm"
            />
            <button
              onClick={() => runScan(query)}
              disabled={loading || !query.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-white transition hover:bg-indigo-700 disabled:opacity-40 shadow-lg"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              Scan
            </button>
          </div>

          {/* Preset brands */}
          <div className="mt-4 flex flex-wrap gap-2">
            {PRESET_BRANDS.map((b) => (
              <button
                key={b}
                onClick={() => { setQuery(b); runScan(b); }}
                className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 transition-all hover:border-indigo-300 hover:text-indigo-600"
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-28 gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-full border-4 border-zinc-100" />
              <div className="absolute inset-0 h-20 w-20 rounded-full border-4 border-t-indigo-600 animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-base font-black text-zinc-950 uppercase tracking-tight mb-2">Querying AI Models</p>
              <p className="text-sm text-zinc-400 font-medium">Running GPT-4o · Claude · Gemini in parallel…</p>
            </div>
            <div className="flex gap-3">
              {["GPT-4o", "Claude", "Gemini"].map((m, i) => (
                <span key={m} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
                  {m}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center gap-4 rounded-2xl bg-red-50 border border-red-100 px-7 py-5 max-w-2xl">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-black text-red-700">Scan failed</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !loading && tier && (
          <div className="space-y-8">

            {/* Standex Score banner */}
            <div className={`rounded-[2.5rem] border ${tier.border} ${tier.bg} p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8`}>
              <div className="flex items-center gap-8">
                <div className="text-center shrink-0">
                  <div className={`text-7xl font-black leading-none ${tier.color}`}>{result.standexScore}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-2">Standex Score</div>
                </div>
                <div>
                  <div className={`text-xl font-black uppercase tracking-tight ${tier.color} mb-2`}>
                    {tier.icon} {tier.label} — {result.brand}
                  </div>
                  <p className="text-sm text-zinc-600 font-medium leading-relaxed max-w-md">
                    {result.tier === "excellent" && "Strong cross-model consensus. AI representation is accurate and current."}
                    {result.tier === "moderate" && "Minor discrepancies detected across models. Continuous monitoring recommended."}
                    {result.tier === "high" && "Significant inaccuracies found. Brand correction signals needed."}
                    {result.tier === "critical" && "AI models are providing materially inaccurate information. Immediate correction signals required."}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${tier.badge}`}>
                      {result.flagCount} {result.flagCount === 1 ? "flag" : "flags"} detected
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-zinc-200 bg-white text-zinc-500">
                      Scan ID: {result.scanId.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Export / email gate */}
              <div className="flex flex-col gap-3 min-w-[240px]">
                {!emailSubmitted ? (
                  <>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      Get Full Standex Score Report — Free
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-300" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full rounded-xl border border-zinc-200 py-3 pl-9 pr-3 text-xs font-medium placeholder:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        onClick={submitEmail}
                        disabled={!email.trim()}
                        className="rounded-xl bg-indigo-600 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-700 disabled:opacity-40 transition"
                      >
                        Send
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-black text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Report sent — check your inbox
                  </div>
                )}
                <button className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:bg-zinc-50 transition">
                  <Download className="h-3.5 w-3.5" />
                  Download Standex Score Certificate
                </button>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: "Factual Accuracy", val: result.breakdown.factualAccuracy, weight: "40%", color: "bg-indigo-500" },
                { label: "Cross-Model Consensus", val: result.breakdown.crossModelConsensus, weight: "25%", color: "bg-violet-500" },
                { label: "Data Freshness", val: result.breakdown.dataFreshness, weight: "20%", color: "bg-blue-500" },
                { label: "Hallucination Score", val: 100 - result.breakdown.hallucinationDensity, weight: "15%", color: "bg-red-400" },
              ].map((f) => (
                <div key={f.label} className="rounded-[2rem] bg-[#F9FAFB] border border-zinc-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400">{f.label}</span>
                    <span className="text-[9px] font-black text-zinc-300">{f.weight}</span>
                  </div>
                  <div className={`text-3xl font-black mb-3 ${f.val >= 80 ? "text-emerald-600" : f.val >= 60 ? "text-amber-500" : "text-red-600"}`}>
                    {f.val}
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${f.color} transition-all duration-700`} style={{ width: `${f.val}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Model responses */}
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-5 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Model Responses — Side by Side
              </h2>
              <div className="grid md:grid-cols-3 gap-5">
                {result.models.map((m) => {
                  const isExpanded = expandedModel === m.model;
                  const hasCritical = m.flags.some((f) => f.severity === "critical");
                  const hasWarning = m.flags.some((f) => f.severity === "warning");
                  return (
                    <div
                      key={m.model}
                      className={`rounded-[2rem] border bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-shadow ${hasCritical ? "border-red-100" : hasWarning ? "border-amber-100" : "border-zinc-100"}`}
                    >
                      {/* Model header */}
                      <div className={`px-6 py-4 border-b flex items-center justify-between ${hasCritical ? "bg-red-50 border-red-100" : hasWarning ? "bg-amber-50 border-amber-100" : "bg-[#F9FAFB] border-zinc-100"}`}>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-700">{m.model}</span>
                        <div className="flex items-center gap-2">
                          {m.flags.length === 0 ? (
                            <Shield className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${hasCritical ? "bg-red-100 text-red-700 border-red-200" : "bg-amber-100 text-amber-700 border-amber-200"}`}>
                              {m.flags.length} flag{m.flags.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Response text */}
                      <div className="p-6 flex-1 flex flex-col gap-4">
                        <p className="text-sm text-zinc-700 leading-relaxed font-medium italic">&quot;{m.text}&quot;</p>

                        {m.flags.length === 0 && (
                          <div className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            No discrepancies detected
                          </div>
                        )}

                        {m.flags.length > 0 && (
                          <div className="mt-auto space-y-2">
                            {(isExpanded ? m.flags : m.flags.slice(0, 1)).map((flag, fi) => (
                              <div key={fi} className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold ${FLAG_SEVERITY_STYLE[flag.severity]}`}>
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-black">&quot;{flag.claim.slice(0, 60)}{flag.claim.length > 60 ? "…" : ""}&quot;</p>
                                  <p className="font-medium mt-0.5 opacity-80">{flag.reason}</p>
                                </div>
                              </div>
                            ))}
                            {m.flags.length > 1 && (
                              <button
                                onClick={() => setExpandedModel(isExpanded ? null : m.model)}
                                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-700 transition"
                              >
                                {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                {isExpanded ? "Show less" : `+${m.flags.length - 1} more flag${m.flags.length - 1 !== 1 ? "s" : ""}`}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Empty state */}
        {!result && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center max-w-xl mx-auto">
            <div className="h-24 w-24 rounded-[2.5rem] bg-[#F9FAFB] border border-zinc-100 flex items-center justify-center mb-8 shadow-sm">
              <Activity className="h-12 w-12 text-indigo-300" />
            </div>
            <h2 className="text-3xl font-black text-zinc-950 mb-4 tracking-tight">Brand Pulse Scanner</h2>
            <p className="text-base text-zinc-500 font-medium leading-relaxed mb-8">
              Search any brand to see exactly how GPT-4o, Claude, and Gemini represent it — side by side. Discrepancies automatically flagged. Standex Score calculated instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Hallucination Detection", "Cross-Model Comparison", "Standex Score", "Live Flags"].map((t) => (
                <span key={t} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-[#F9FAFB] text-zinc-400 border border-zinc-100">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: transparent; }
          ::-webkit-scrollbar-thumb { background: #E4E4E7; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #D4D4D8; }
        `
      }} />
    </div>
  );
}
