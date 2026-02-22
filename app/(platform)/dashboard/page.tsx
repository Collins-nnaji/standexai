"use client";

import { useRouter } from "next/navigation";
import {
  Search, FileBarChart, Shield, ArrowRight, Activity,
  TrendingUp, Eye, Clock, Zap
} from "lucide-react";

const LIVE_EVENTS = [
  { model: "GPT-4o", brand: "Monzo", issue: "misquoted AER savings rate", severity: "critical", ago: "2m" },
  { model: "Gemini", brand: "Revolut", issue: "deprecated Premium tier referenced", severity: "warning", ago: "11m" },
  { model: "Claude", brand: "HSBC", issue: "outdated mortgage rates cited", severity: "critical", ago: "28m" },
  { model: "GPT-4o", brand: "Stripe", issue: "wrong fee structure for EU cards", severity: "warning", ago: "41m" },
  { model: "Gemini", brand: "Wise", issue: "incorrect transfer limit", severity: "critical", ago: "1h 3m" },
];

const STANDEX_PIPELINE = [
  {
    name: "Brand Pulse",
    label: "Monitor",
    desc: "Run live cross-model brand scans. See exactly what GPT-4o, Claude, and Gemini say about any brand — side by side.",
    icon: Search,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    href: "/brand-pulse",
    status: "Live Scanning",
    statusColor: "text-indigo-600",
    dotColor: "bg-indigo-500",
  },
  {
    name: "Standex Score Ledger",
    label: "Score & Certify",
    desc: "Review the full Standex Score breakdown, historical accuracy trends, and export Standex Score Certificates for compliance filings.",
    icon: FileBarChart,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    href: "/standex-score-ledger",
    status: "Certified",
    statusColor: "text-emerald-600",
    dotColor: "bg-emerald-500",
  },
  {
    name: "Prompt Lab",
    label: "Correct & Build",
    desc: "Define brand truth and representation guardrails. Craft prompts that stay aligned with your brand; then run them through Brand Pulse for Standex Score.",
    icon: Shield,
    color: "text-violet-600",
    bg: "bg-violet-50",
    href: "/prompt-lab",
    status: "Active",
    statusColor: "text-violet-600",
    dotColor: "bg-violet-500",
  },
];

const STANDEX_SCORES = [
  { brand: "Monzo", score: 47, tier: "critical", delta: -3 },
  { brand: "Revolut", score: 87, tier: "moderate", delta: +2 },
  { brand: "Stripe", score: 94, tier: "excellent", delta: +1 },
  { brand: "HSBC", score: 61, tier: "high", delta: -5 },
];

const TIER_COLOR: Record<string, string> = {
  critical: "text-red-600",
  high: "text-orange-500",
  moderate: "text-amber-500",
  excellent: "text-emerald-600",
};

const TIER_BAR: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-400",
  moderate: "bg-amber-400",
  excellent: "bg-emerald-500",
};

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col bg-white p-6 lg:p-10 overflow-auto">

      {/* Innovation strip */}
      <div className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 to-white px-6 py-4">
        <p className="text-sm font-semibold text-zinc-800 leading-relaxed">
          <span className="text-indigo-600 font-black">Innovation by design.</span> Proprietary methodology, compounding risk data, and workflow lock-in — not a thin wrapper. Monitor → Score → Correct → Certify in one defensible pipeline.
        </p>
      </div>

      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Standex Score Infrastructure — Live</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 lg:text-4xl">
            AI Representation Monitor
          </h1>
          <p className="mt-2 text-zinc-500 font-medium text-base">
            Real-time brand accuracy across GPT-4o, Claude &amp; Gemini. One score, full traceability.
          </p>
        </div>
        <button
          onClick={() => router.push("/brand-pulse")}
          className="flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white transition hover:bg-indigo-700 shadow-xl shadow-indigo-600/20"
        >
          <Search className="h-4 w-4" />
          Scan a Brand
        </button>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">

        {/* Left column */}
        <div className="space-y-8">

          {/* Standex Score pipeline cards */}
          <div className="grid gap-5 sm:grid-cols-3">
            {STANDEX_PIPELINE.map((step) => (
              <button
                key={step.name}
                onClick={() => router.push(step.href)}
                className="group relative flex flex-col items-start gap-5 rounded-[2rem] bg-[#F9FAFB] p-7 transition-all hover:bg-white hover:shadow-2xl hover:scale-[1.02] text-left border border-zinc-100"
              >
                <div className="flex w-full items-start justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${step.bg} ${step.color}`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-[0.25em] ${step.color} border ${step.bg.replace("bg-", "border-").replace("50", "200")} rounded-full px-2.5 py-1`}>
                    {step.label}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-zinc-950 mb-1.5">{step.name}</h3>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">{step.desc}</p>
                </div>
                <div className="mt-auto flex w-full items-center justify-between border-t border-zinc-100 pt-5">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${step.statusColor} flex items-center gap-1.5`}>
                    <div className={`h-1.5 w-1.5 rounded-full ${step.dotColor} animate-pulse`} />
                    {step.status}
                  </span>
                  <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-950 transition-colors group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>

          {/* Live Standex Scores table */}
          <div className="rounded-[2rem] bg-[#F9FAFB] border border-zinc-100 p-8">
            <div className="flex items-center justify-between mb-7">
              <div>
                <h3 className="text-sm font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Live Standex Scores
                </h3>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.25em] mt-1">Monitored brands — updated continuously</p>
              </div>
              <button
                onClick={() => router.push("/standex-score-ledger")}
                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline"
              >
                Full Ledger →
              </button>
            </div>

            <div className="space-y-4">
              {STANDEX_SCORES.map((b) => (
                <div key={b.brand} className="flex items-center gap-4 rounded-2xl bg-white border border-zinc-100 px-6 py-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-black text-zinc-950 uppercase tracking-tight">{b.brand}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${b.delta > 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {b.delta > 0 ? `+${b.delta}` : b.delta}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${TIER_BAR[b.tier]}`}
                        style={{ width: `${b.score}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-2xl font-black ${TIER_COLOR[b.tier]}`}>{b.score}</span>
                    <div className="text-[9px] font-black uppercase tracking-widest text-zinc-300 mt-0.5">/ 100</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Live hallucination ticker */}
          <div className="rounded-[2rem] bg-[#18181B] border border-zinc-800 p-7">
            <h3 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-3 mb-6">
              <Activity className="h-4 w-4 text-red-400" />
              Live Hallucination Feed
              <span className="ml-auto flex items-center gap-1.5 text-[9px] font-black text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                LIVE
              </span>
            </h3>

            <div className="space-y-3">
              {LIVE_EVENTS.map((ev, i) => (
                <div key={i} className={`rounded-2xl px-5 py-4 border ${ev.severity === "critical" ? "bg-red-950/30 border-red-900/40" : "bg-amber-950/20 border-amber-900/30"}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${ev.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>
                      {ev.model}
                    </span>
                    <div className="flex items-center gap-1 text-zinc-600">
                      <Clock className="h-2.5 w-2.5" />
                      <span className="text-[9px] font-bold">{ev.ago}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-medium leading-snug">
                    <span className="text-white font-black">{ev.brand}</span> — {ev.issue}
                    <span className="ml-1.5">{ev.severity === "critical" ? "🔴" : "⚠️"}</span>
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/brand-pulse")}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 py-3.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/10 transition"
            >
              View All Events
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Standex Score formula breakdown */}
          <div className="rounded-[2rem] bg-[#F9FAFB] border border-zinc-100 p-7">
            <h3 className="text-sm font-black text-zinc-950 uppercase tracking-tight flex items-center gap-2 mb-6">
              <Zap className="h-4 w-4 text-indigo-600" />
              Standex Score Formula
            </h3>
            <div className="space-y-4">
              {[
                { label: "Factual Accuracy", weight: "40%", color: "bg-indigo-500", w: "40%" },
                { label: "Cross-Model Consensus", weight: "25%", color: "bg-violet-500", w: "25%" },
                { label: "Data Freshness", weight: "20%", color: "bg-blue-500", w: "20%" },
                { label: "Hallucination Density", weight: "15%", color: "bg-red-400", w: "15%" },
              ].map((f) => (
                <div key={f.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{f.label}</span>
                    <span className="text-[10px] font-black text-zinc-950">{f.weight}</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${f.color}`} style={{ width: f.w }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-[2rem] bg-indigo-600 p-7 text-white relative overflow-hidden shadow-xl shadow-indigo-600/20">
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <Shield className="h-8 w-8 text-indigo-200 mb-4 relative z-10" />
            <h3 className="text-lg font-black mb-2 relative z-10">Prompt Lab</h3>
            <p className="text-sm text-indigo-100 font-medium mb-6 leading-relaxed relative z-10">
              Define brand truth and representation guardrails, then verify with Standex Score in Brand Pulse.
            </p>
            <button
              onClick={() => router.push("/prompt-lab")}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-4 text-xs font-black uppercase tracking-widest text-indigo-600 shadow-xl transition hover:scale-[1.02] relative z-10"
            >
              <ArrowRight className="h-4 w-4" />
              Open Prompt Lab
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
