"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight, FileText, Mic, PenTool, ScanSearch, ShieldAlert, Brain,
  BarChart3, Sparkles, Shield, Zap, CheckCircle2, Globe,
  TrendingUp, Eye, Users, LayoutGrid
} from "lucide-react";
import { neonAuthClient } from "@/lib/neon/auth-client";

const FEATURES = [
  {
    name: "Text Analyzer",
    desc: "Instant tone, risk, and clarity analysis for any written communication. Get highlighted issues with actionable suggestions.",
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    name: "Speech Analyzer",
    desc: "Analyze speeches for confidence, filler words, pacing, and emotional impact. Your AI speech coach.",
    icon: Mic,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    name: "Smart Rewrite Studio",
    desc: "Transform text into professional, friendly, persuasive, or safe versions with side-by-side comparison.",
    icon: PenTool,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    name: "AI Detection",
    desc: "Check if content is AI-generated with section-level analysis. One-click humanization.",
    icon: ScanSearch,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    name: "Risk & Compliance",
    desc: "Detect harassment, threats, discrimination, and legal risks. Get compliant alternatives instantly.",
    icon: ShieldAlert,
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    name: "Intent & Psychology",
    desc: "Uncover hidden manipulation, emotional pressure, bias, and persuasion tactics in any text.",
    icon: Brain,
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
];

const USE_CASES = [
  { icon: Mic, label: "Speakers & Presenters", desc: "Nail every speech with confidence coaching" },
  { icon: Users, label: "Professionals", desc: "Communicate clearly in emails and messages" },
  { icon: TrendingUp, label: "Students", desc: "Improve writing and presentation skills" },
  { icon: ShieldAlert, label: "Businesses", desc: "Ensure compliant, safe communication at scale" },
];

export default function Home() {
  const router = useRouter();
  const session = neonAuthClient.useSession();
  const user = session.data?.user;

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!elements.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.15 },
    );
    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-indigo-500/20">

      {/* Navigation */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <Image
            src="/standexailogo.png"
            alt="StandexAI"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
          <span className="hidden sm:inline-block text-[10px] font-semibold text-zinc-400 border border-zinc-200 rounded-full px-3 py-1">
            AI Communication Coach
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Open Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push("/auth/sign-in")}
                className="rounded-full px-4 py-2.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
              >
                Get Started Free
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-5 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28">
        <div className="text-center max-w-4xl mx-auto">
          <div data-reveal data-reveal-dir="up" style={{ "--delay": "0ms" } as React.CSSProperties}>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm text-indigo-700 font-medium mb-6">
              <Sparkles className="h-3.5 w-3.5" />
              AI Communication Coach & Safety Layer
            </div>
          </div>

          <h1
            data-reveal data-reveal-dir="up"
            style={{ "--delay": "80ms" } as React.CSSProperties}
            className="text-[2.5rem] font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-[4.25rem] mb-6"
          >
            Say the right thing,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              the right way
            </span>
            {" "}— every time.
          </h1>

          <p
            data-reveal data-reveal-dir="up"
            style={{ "--delay": "160ms" } as React.CSSProperties}
            className="text-lg text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            StandexAI analyzes, improves, and safeguards your communication in real time.
            From emails to speeches, avoid risky language, improve clarity, and deliver stronger messages.
          </p>

          <div data-reveal data-reveal-dir="up" style={{ "--delay": "240ms" } as React.CSSProperties} className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="group flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-4 text-[15px] font-semibold text-white hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/20"
            >
              Start Analyzing Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => router.push("/speech-analyzer")}
              className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-8 py-4 text-[15px] font-semibold text-zinc-700 hover:bg-zinc-50 transition shadow-lg"
            >
              <Mic className="h-4 w-4 text-violet-500" />
              Try Speech Coach
            </button>
          </div>

          {/* Stats */}
          <div
            data-reveal data-reveal-dir="up"
            style={{ "--delay": "320ms" } as React.CSSProperties}
            className="mt-14 flex flex-wrap justify-center gap-10 border-t border-zinc-100 pt-10"
          >
            {[
              { val: "6", label: "Analysis Tools" },
              { val: "5+", label: "Rewrite Modes" },
              { val: "Real-time", label: "AI Coaching" },
              { val: "100%", label: "Secure & Private" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl font-bold text-zinc-900">{s.val}</span>
                <span className="text-xs text-zinc-500 font-medium">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      <section className="bg-zinc-50 py-20 sm:py-28 border-y border-zinc-100">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14" data-reveal data-reveal-dir="up">
            <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">How It Works</h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
              Paste. Analyze. Improve.
            </h3>
            <p className="text-lg text-zinc-500">
              Drop any text or speech transcript and get instant AI-powered insights with actionable suggestions.
            </p>
          </div>

          {/* Demo Card */}
          <div data-reveal data-reveal-dir="up" style={{ "--delay": "100ms" } as React.CSSProperties}>
            <div className="mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-zinc-100">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3 block">Input</span>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    &ldquo;I think you should probably do what I say because{" "}
                    <span className="bg-red-100 text-red-700 px-1 rounded">everyone else already agrees</span>
                    , and if you don&rsquo;t act{" "}
                    <span className="bg-amber-100 text-amber-700 px-1 rounded">right now</span>
                    , you&rsquo;ll{" "}
                    <span className="bg-red-100 text-red-700 px-1 rounded">miss out forever</span>.
                    Trust me, I{" "}
                    <span className="bg-amber-100 text-amber-700 px-1 rounded">know what&rsquo;s best</span>
                    {" "}for you.&rdquo;
                  </p>
                </div>
                <div className="p-6 md:p-8 space-y-4">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3 block">Analysis</span>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1.5 text-red-600 font-semibold">
                      <ShieldAlert className="h-4 w-4" /> Manipulative
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-600 font-semibold">
                      <Brain className="h-4 w-4" /> Social Pressure
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 text-xs text-red-700">
                      <strong>Bandwagon effect:</strong> &ldquo;everyone else agrees&rdquo; — pressures through conformity
                    </div>
                    <div className="rounded-lg bg-amber-50 border border-amber-100 px-3 py-2 text-xs text-amber-700">
                      <strong>False urgency:</strong> &ldquo;miss out forever&rdquo; — creates artificial time pressure
                    </div>
                    <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-700">
                      <strong>Safer version:</strong> &ldquo;I&rsquo;d recommend considering this approach. Here&rsquo;s why it could benefit you...&rdquo;
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14" data-reveal data-reveal-dir="up">
            <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Everything You Need</h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
              A Complete Communication Toolkit
            </h3>
            <p className="text-lg text-zinc-500">
              Six powerful tools that work together to help you communicate with confidence and safety.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, idx) => (
              <div
                key={f.name}
                data-reveal data-reveal-dir="up"
                style={{ "--delay": `${idx * 80}ms` } as React.CSSProperties}
                className="group rounded-2xl border border-zinc-100 bg-white p-6 transition-all hover:shadow-xl hover:border-zinc-200 hover:-translate-y-1"
              >
                <div className={`h-12 w-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h4 className="text-lg font-bold text-zinc-900 mb-2">{f.name}</h4>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Speaker Mode Highlight */}
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 py-20 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-50" />
        <div className="mx-auto max-w-5xl px-5 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-indigo-100 font-medium mb-6 backdrop-blur-sm">
                <Mic className="h-4 w-4" />
                Headline Feature
              </div>
              <h3 className="text-3xl font-extrabold text-white sm:text-4xl mb-4 leading-tight">
                Speaker Mode — Your AI Speech Coach
              </h3>
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                Analyze any speech or presentation for confidence, clarity, engagement, and emotional impact.
                Get real-time coaching on pacing, filler words, and audience-friendly delivery.
              </p>
              <button
                onClick={() => router.push("/speech-analyzer")}
                className="flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-indigo-600 hover:bg-indigo-50 transition shadow-xl"
              >
                <Zap className="h-4 w-4" />
                Try Speaker Mode
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Confidence Analysis", desc: "Detect nervousness, hedge words, and assertiveness" },
                { label: "Filler Word Detection", desc: "Count and highlight 'um', 'uh', 'like', 'you know'" },
                { label: "Pacing Suggestions", desc: "Get feedback on speech speed and rhythm" },
                { label: "Engagement Scoring", desc: "Rate how captivating your content is" },
                { label: "Audience-Friendly Rewrites", desc: "Get versions optimized for verbal delivery" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-indigo-200">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-14" data-reveal data-reveal-dir="up">
            <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">Built For Everyone</h2>
            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-4">
              Who Uses StandexAI?
            </h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((uc, i) => (
              <div
                key={uc.label}
                data-reveal data-reveal-dir="up"
                style={{ "--delay": `${i * 80}ms` } as React.CSSProperties}
                className="text-center rounded-2xl border border-zinc-100 bg-white p-6 hover:shadow-lg transition"
              >
                <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
                  <uc.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h4 className="text-sm font-bold text-zinc-900 mb-1">{uc.label}</h4>
                <p className="text-xs text-zinc-500">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-900 py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 text-center">
          <h3 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Start communicating with confidence
          </h3>
          <p className="text-lg text-zinc-400 mb-10">
            Join thousands of professionals using StandexAI to improve their communication every day.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="group inline-flex items-center gap-2 rounded-full bg-indigo-600 px-10 py-4 text-[15px] font-semibold text-white hover:bg-indigo-500 transition shadow-xl shadow-indigo-600/30"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/standexailogo.png"
                alt="StandexAI"
                width={100}
                height={30}
                className="h-6 w-auto object-contain opacity-40 grayscale"
              />
              <span className="text-[10px] font-semibold text-zinc-400">AI Communication Coach & Safety Layer</span>
            </div>
            <p className="text-xs text-zinc-400">
              &copy; 2026 StandexAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        [data-reveal] {
          --delay: 0ms;
          opacity: 0.01;
          transform: translateY(24px) scale(0.985);
          filter: blur(3px);
          transition:
            opacity 700ms cubic-bezier(0.16, 1, 0.3, 1),
            transform 700ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 700ms cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: var(--delay);
          will-change: transform, opacity, filter;
        }
        [data-reveal].is-visible {
          opacity: 1;
          transform: translateY(0) scale(1);
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
