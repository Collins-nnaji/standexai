"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight, AlertTriangle, Shield, LayoutGrid, TrendingUp, Eye, Lock } from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";

const TICKER_EVENTS = [
  { model: "GPT-4o", brand: "Monzo", issue: "misquoted savings AER rate", severity: "critical", ago: "2 mins ago" },
  { model: "Gemini", brand: "Revolut", issue: "referenced deprecated Premium tier", severity: "warning", ago: "8 mins ago" },
  { model: "Claude", brand: "HSBC", issue: "cited outdated mortgage rates", severity: "critical", ago: "14 mins ago" },
  { model: "GPT-4o", brand: "Stripe", issue: "incorrect fee structure cited", severity: "warning", ago: "21 mins ago" },
  { model: "Gemini", brand: "Wise", issue: "wrong transfer limit mentioned", severity: "critical", ago: "33 mins ago" },
  { model: "GPT-4o", brand: "Starling", issue: "conflated with Monzo product line", severity: "critical", ago: "47 mins ago" },
  { model: "Claude", brand: "Barclays", issue: "outdated digital banking feature set", severity: "warning", ago: "1 hr ago" },
];

const DEMO_BRANDS = [
  {
    name: "Monzo",
    gptScore: 62,
    claudeScore: 78,
    geminiScore: 41,
    standexScore: 47,
    tier: "critical",
  },
  {
    name: "Revolut",
    gptScore: 85,
    claudeScore: 89,
    geminiScore: 82,
    standexScore: 87,
    tier: "moderate",
  },
  {
    name: "Stripe",
    gptScore: 94,
    claudeScore: 92,
    geminiScore: 96,
    standexScore: 94,
    tier: "excellent",
  },
];

const SCORE_TIER_COLORS: Record<string, string> = {
  excellent: "text-emerald-600",
  moderate: "text-amber-500",
  critical: "text-red-600",
};

const SCORE_TIER_BG: Record<string, string> = {
  excellent: "bg-emerald-50 border-emerald-100",
  moderate: "bg-amber-50 border-amber-100",
  critical: "bg-red-50 border-red-100",
};

const SCORE_TIER_LABEL: Record<string, string> = {
  excellent: "Excellent",
  moderate: "Moderate Risk",
  critical: "Critical",
};

export default function Home() {
  const router = useRouter();
  const session = neonAuthClient.useSession();
  const user = session.data?.user;
  const [tickerIdx, setTickerIdx] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState(DEMO_BRANDS[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIdx((i) => (i + 1) % TICKER_EVENTS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
          else entry.target.classList.remove("is-visible");
        }
      },
      { threshold: 0.18, rootMargin: "-8% 0px -8% 0px" },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const currentEvent = TICKER_EVENTS[tickerIdx];

  return (
    <div className="min-h-screen bg-white text-[#18181B] font-sans selection:bg-indigo-500/30">

      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 border-b border-[#E4E4E8]">
        <div className="flex items-center gap-3">
          <Image
            src="/standexailogo.png"
            alt="StandexAI"
            width={160}
            height={48}
            className="h-9 w-auto object-contain"
            priority
          />
          <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 border border-zinc-200 rounded-full px-3 py-1">
            Standex Score Platform
          </span>
        </div>
        <div className="relative ml-auto flex flex-wrap items-center justify-end gap-3 rounded-full border border-[#E4E4E8] bg-white/85 px-2 py-1.5 backdrop-blur-md">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-[11px] font-black text-zinc-950 border border-zinc-200">
                  {(user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
                </div>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-lg shadow-black/10"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  Standex Score Portal
                </button>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => router.push("/auth/sign-in")}
                className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest text-[#52525B] transition hover:text-zinc-950"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-lg shadow-black/10"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Open Portal
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Live Hallucination Ticker */}
      <div className="bg-[#18181B] border-b border-zinc-800 py-3 px-4 overflow-hidden">
        <div className="mx-auto max-w-7xl flex items-center gap-4">
          <span className="shrink-0 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-400 border border-red-800 rounded-full px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>
          <div className="flex-1 overflow-hidden">
            <p className="text-[11px] font-bold text-zinc-300 transition-all duration-500 truncate">
              <span className={`font-black mr-1 ${currentEvent.severity === "critical" ? "text-red-400" : "text-amber-400"}`}>
                {currentEvent.model}
              </span>
              {currentEvent.issue} about
              <span className="text-white font-black mx-1">{currentEvent.brand}</span>
              — {currentEvent.ago}
              <span className="ml-2">{currentEvent.severity === "critical" ? "🔴" : "⚠️"}</span>
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="shrink-0 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition"
          >
            View All →
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
        <div className="text-center max-w-4xl mx-auto">
          <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "0ms" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700 font-medium mb-6">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              AI Representation Management Infrastructure
            </div>
          </div>

          <h1
            data-reveal
            data-reveal-dir="up"
            style={{ ["--delay" as string]: "80ms" }}
            className="text-[2.75rem] font-extrabold leading-[1.08] tracking-tight text-[#18181B] sm:text-6xl lg:text-[4.5rem] mb-6"
          >
            What Does AI Say{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              About Your Brand?
            </span>
          </h1>

          <p
            data-reveal
            data-reveal-dir="up"
            style={{ ["--delay" as string]: "160ms" }}
            className="text-lg leading-relaxed text-[#52525B] max-w-2xl mx-auto mb-10"
          >
            StandexAI is the compliance infrastructure that monitors, corrects, and certifies how AI models
            represent brands — in text, in images, and across every modality AI touches.
          </p>

          <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "240ms" }} className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="group flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-[15px] font-bold text-white transition hover:bg-indigo-700 shadow-xl shadow-indigo-600/20"
            >
              Get Your Standex Score
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => router.push("/brand-pulse")}
              className="flex items-center gap-2 rounded-full border border-[#E4E4E8] bg-white px-8 py-4 text-[15px] font-bold text-[#18181B] transition hover:bg-[#F4F4F5] shadow-lg"
            >
              Run Brand Scan
            </button>
          </div>

          {/* Stats row */}
          <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "320ms" }} className="mt-14 flex flex-wrap items-center justify-center gap-10 border-t border-[#E4E4E8] pt-10">
            {[
              { val: "3", label: "AI Models Monitored" },
              { val: "0–100", label: "Standex Score Scale" },
              { val: "4x", label: "Risk Factors Weighted" },
              { val: "Live", label: "Continuous Updates" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-black text-[#18181B]">{s.val}</span>
                <span className="text-xs text-[#52525B] uppercase tracking-wider font-semibold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Brand Pulse Demo */}
      <section className="bg-[#F4F4F5] py-20 sm:py-28 border-y border-[#E4E4E8]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-12 text-center max-w-3xl mx-auto" data-reveal data-reveal-dir="up">
            <h2 className="text-base font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">Live Brand Pulse Dashboard</h2>
            <h3 className="text-3xl font-extrabold tracking-tight text-[#18181B] sm:text-4xl mb-4">
              See How AI Models Describe Your Brand — Right Now
            </h3>
            <p className="text-lg text-[#52525B]">
              Side-by-side comparison across GPT-4o, Claude, and Gemini. Discrepancies automatically flagged. Standex Score calculated instantly.
            </p>
          </div>

          {/* Brand selector tabs */}
          <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "100ms" }} className="flex flex-wrap justify-center gap-3 mb-8">
            {DEMO_BRANDS.map((b) => (
              <button
                key={b.name}
                onClick={() => setSelectedBrand(b)}
                className={`rounded-full px-6 py-2.5 text-sm font-black uppercase tracking-wider transition-all ${
                  selectedBrand.name === b.name
                    ? "bg-zinc-950 text-white shadow-xl"
                    : "bg-white border border-zinc-200 text-zinc-600 hover:bg-white hover:text-zinc-950"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>

          {/* Model comparison grid */}
          <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "180ms" }} className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                model: "GPT-4o",
                score: selectedBrand.gptScore,
                excerpt:
                  selectedBrand.name === "Monzo"
                    ? '"Monzo offers a 3.5% AER on its Instant Access Pot, with no fees for overseas spending..."'
                    : selectedBrand.name === "Revolut"
                    ? '"Revolut provides tiered plans from Standard to Metal, with up to 1% cashback on Metal..."'
                    : '"Stripe charges 1.4% + 20p for European cards, 2.9% + 30¢ in the US, with no setup fees..."',
                flag: selectedBrand.name === "Monzo" ? { text: "Rate outdated — actual AER is 4.1%", type: "critical" } : null,
              },
              {
                model: "Claude",
                score: selectedBrand.claudeScore,
                excerpt:
                  selectedBrand.name === "Monzo"
                    ? '"Monzo currently provides 4.1% AER, updated Q3 2025, on their Instant Access Pot..."'
                    : selectedBrand.name === "Revolut"
                    ? '"Revolut offers Standard, Plus, Premium, Metal and Ultra plans. Metal includes lounge access..."'
                    : '"Stripe\'s pricing is 1.5% + 25p for UK cards as of 2025, with Radar fraud protection included..."',
                flag: null,
              },
              {
                model: "Gemini",
                score: selectedBrand.geminiScore,
                excerpt:
                  selectedBrand.name === "Monzo"
                    ? '"Monzo offers 2.9% on their Savings Pot, a legacy product discontinued in 2024..."'
                    : selectedBrand.name === "Revolut"
                    ? '"Revolut\'s premium tier is called Black, offering unlimited foreign exchange at interbank rate..."'
                    : '"Stripe is a payment processor with transparent pricing, no monthly fees, and instant payouts..."',
                flag:
                  selectedBrand.name === "Monzo"
                    ? { text: "References discontinued product — 16 months out of date", type: "critical" }
                    : selectedBrand.name === "Revolut"
                    ? { text: "\"Black\" tier was renamed to Metal in 2022", type: "warning" }
                    : null,
              },
            ].map((col) => (
              <div key={col.model} className="rounded-[2rem] bg-white border border-zinc-100 shadow-xl overflow-hidden flex flex-col">
                <div className="px-6 py-4 border-b border-zinc-100 bg-[#F9FAFB] flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{col.model}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-black ${col.score >= 85 ? "text-emerald-600" : col.score >= 65 ? "text-amber-500" : "text-red-600"}`}>
                      {col.score}
                    </span>
                    <div className="w-10 h-1 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${col.score >= 85 ? "bg-emerald-500" : col.score >= 65 ? "bg-amber-400" : "bg-red-500"}`}
                        style={{ width: `${col.score}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col gap-4">
                  <p className="text-sm text-zinc-700 leading-relaxed italic">{col.excerpt}</p>
                  {col.flag ? (
                    <div className={`mt-auto flex items-start gap-2 rounded-xl px-4 py-3 border text-xs font-bold ${col.flag.type === "critical" ? "bg-red-50 border-red-100 text-red-700" : "bg-amber-50 border-amber-100 text-amber-700"}`}>
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      {col.flag.text}
                    </div>
                  ) : (
                    <div className="mt-auto flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <Shield className="h-3.5 w-3.5" />
                      No discrepancies detected
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Standex Score Panel */}
          <div data-reveal data-reveal-dir="up" style={{ ["--delay" as string]: "280ms" }}>
            <div className={`rounded-[2rem] border p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl ${SCORE_TIER_BG[selectedBrand.tier]}`}>
              <div className="flex items-center gap-8">
                <div className="text-center">
                  <div className={`text-7xl font-black leading-none ${SCORE_TIER_COLORS[selectedBrand.tier]}`}>
                    {selectedBrand.standexScore}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mt-2">Standex Score</div>
                </div>
                <div>
                  <div className={`text-lg font-black uppercase tracking-tight ${SCORE_TIER_COLORS[selectedBrand.tier]} mb-2`}>
                    {selectedBrand.tier === "critical" && "🔴 "}
                    {selectedBrand.tier === "moderate" && "⚠️ "}
                    {selectedBrand.tier === "excellent" && "✅ "}
                    {SCORE_TIER_LABEL[selectedBrand.tier]}
                  </div>
                  <p className="text-sm text-zinc-600 font-medium max-w-sm leading-relaxed">
                    {selectedBrand.tier === "critical" && "AI models are providing materially inaccurate information. Immediate correction signals required."}
                    {selectedBrand.tier === "moderate" && "Minor discrepancies detected across models. Continuous monitoring recommended."}
                    {selectedBrand.tier === "excellent" && "Strong cross-model consensus. AI representation is accurate and current."}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 items-end">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center gap-2 rounded-2xl bg-zinc-950 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-black shadow-xl"
                >
                  Get Full Standex Score Report
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-[10px] text-zinc-400 font-medium">Enter your email for the full breakdown →</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Four Layers */}
      <section className="bg-[#18181B] py-24 sm:py-32 border-y border-[#27272A] relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-base font-bold text-white uppercase tracking-[0.2em] mb-3">Standex Score Infrastructure</h2>
            <h3 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl mb-6">
              The Vanta for AI Brand Accuracy
            </h3>
            <p className="text-lg text-zinc-300 leading-relaxed">
              Just as SSL made the web commercially trustworthy, StandexAI&apos;s Standex Score infrastructure makes AI-mediated brand interactions commercially and legally trustworthy.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                layer: "MONITOR",
                title: "Continuous Brand Scanning",
                desc: "Continuously scans how all major AI models represent a brand — in text responses, image generation outputs, and vision model interpretations.",
                icon: Eye,
                color: "text-blue-400",
                bg: "bg-blue-500/10",
              },
              {
                layer: "SCORE",
                title: "The Standex Score",
                desc: "Produces a single 0–100 accuracy metric across models, modalities, and time. Updated continuously. Four weighted factors: Factual Accuracy, Cross-Model Consensus, Data Freshness, Hallucination Density.",
                icon: TrendingUp,
                color: "text-indigo-400",
                bg: "bg-indigo-500/10",
              },
              {
                layer: "CORRECT",
                title: "Cryptographic Correction Signals",
                desc: "Publishes cryptographically verified correction signals — a protocol that AI models and search engines can consume to update their brand representations.",
                icon: Shield,
                color: "text-emerald-400",
                bg: "bg-emerald-500/10",
              },
              {
                layer: "CERTIFY",
                title: "Standex Score Certificates",
                desc: "Issues Standex Score Certificates as verifiable credentials. Third-party proof that a brand's AI representation meets an accuracy standard — usable in compliance filings and investor materials.",
                icon: Lock,
                color: "text-violet-400",
                bg: "bg-violet-500/10",
              },
            ].map((item, idx) => (
              <div
                key={item.layer}
                data-reveal
                data-reveal-dir="up"
                style={{ ["--delay" as string]: `${idx * 100}ms` }}
                className="rounded-[2rem] bg-white p-8 shadow-2xl border border-zinc-100 transition-all group hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className={`text-xs font-black uppercase tracking-[0.2em] ${item.color.replace("text-", "text-").replace("400", "600")}`}>{item.layer}</span>
                </div>
                <h4 className="text-xl font-black text-zinc-950 mb-3">{item.title}</h4>
                <p className="text-sm text-zinc-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Urgency */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div data-reveal data-reveal-dir="up" className="rounded-[2.5rem] bg-[#F9FAFB] border border-zinc-100 p-10 md:p-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm text-red-700 font-medium mb-6">
              <AlertTriangle className="h-4 w-4" />
              Regulatory Urgency
            </div>
            <h3 className="text-3xl font-extrabold tracking-tight text-zinc-950 sm:text-4xl mb-6 max-w-3xl mx-auto">
              The EU AI Act (2026), FTC Guidance & SEC Disclosures Are Creating New Compliance Requirements
            </h3>
            <p className="text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed mb-10">
              For the first time, AI accuracy about brands has legal standing. StandexAI is the compliance layer that bridges the gap between what AI says and what brands need it to say.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {["EU AI Act 2026", "FTC AI Guidelines", "SEC Disclosure Rules", "Brand IP Protection"].map((item) => (
                <span key={item} className="text-[13px] font-bold tracking-widest text-zinc-600 uppercase px-5 py-2.5 rounded-xl bg-white border border-zinc-200 shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#FAFAFA] border-t border-[#E4E4E8]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Image
                src="/standexailogo.png"
                alt="StandexAI"
                width={120}
                height={36}
                className="h-8 w-auto object-contain opacity-50 grayscale"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Standex Score Platform</span>
            </div>
            <p className="text-sm font-medium text-zinc-500">
              &copy; 2026 StandexAI. AI Representation Management Infrastructure. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        [data-reveal] {
          --x: 0px;
          --y: 24px;
          --delay: 0ms;
          opacity: 0.01;
          transform: translate3d(var(--x), var(--y), 0) scale(0.985);
          filter: blur(4px);
          transition:
            opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 700ms cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: var(--delay);
          will-change: transform, opacity, filter;
        }
        [data-reveal][data-reveal-dir="left"] { --x: -32px; --y: 0px; }
        [data-reveal][data-reveal-dir="right"] { --x: 32px; --y: 0px; }
        [data-reveal][data-reveal-dir="up"] { --x: 0px; --y: 28px; }
        [data-reveal].is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          filter: blur(0);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
