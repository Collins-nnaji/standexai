"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/navigation/app-header";
import {
  Search,
  ShieldCheck,
  Zap,
  Terminal,
  ScanSearch,
  Share2,
  ArrowRight
} from "lucide-react";

export default function LandingPage() {
  const [url, setUrl] = useState("");

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--ink-900)] font-sans selection:bg-[var(--accent-primary)] selection:text-white overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-primary)]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-secondary)]/10 blur-[120px]" />
      </div>

      <AppHeader
        title=""
        subtitle=""
        rightSlot={
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">System Operational</span>
          </div>
        }
      />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-32 pb-20">

        {/* HERO SECTION */}
        <section className="grid lg:grid-cols-2 gap-16 items-center fade-in">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm font-medium text-[var(--accent-secondary)] backdrop-blur-sm">
              <span className="bg-[var(--accent-secondary)]/20 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">New Standard</span>
              Generative Engine Optimization (GEO)
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
              <span className="text-[var(--ink-500)]">Perfect SEO.</span><br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Dominate the AI Era.
              </span>
            </h1>

            <p className="text-lg text-[var(--ink-300)] max-w-xl leading-relaxed">
              <strong>StandexAI</strong> unifies traditional search foundations with next-gen Generative Engine Optimization. Ensure your brand claims the top spot—whether on Google or ChatGPT.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex-1 max-w-md relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-[var(--ink-500)] group-focus-within:text-[var(--accent-primary)] transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Enter domain for SEO & GEO Audit..."
                  className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-full text-[var(--ink-900)] focus:border-[var(--accent-primary)] focus:bg-white/10 focus:outline-none transition-all placeholder:text-[var(--ink-500)]"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button asChild variant="white" className="h-14 px-8 rounded-full font-bold tracking-tight transition-all">
                <Link href="/onboarding">Run Full Audit</Link>
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-[var(--ink-500)]">
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-8 w-8 rounded-full border-2 border-[var(--bg-app)] bg-slate-800 flex items-center justify-center text-[10px]">AI</div>
                ))}
              </div>
              <p>Optimizing for Google, GPT-4o, and Perplexity.</p>
            </div>
          </div>

          {/* VISUAL: Glassmorphic Card */}
          <div className="relative perspective-1000">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-[2rem] opacity-20 blur-2xl animate-pulse"></div>
            <div className="relative bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl transform rotate-y-12 transition-transform duration-500 hover:rotate-y-0">
              {/* Mock Chat Interface */}
              <div className="flex items-center gap-4 mb-6 border-b border-white/5 pb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/20"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/20"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/20"></div>
                <span className="ml-auto text-xs font-mono text-slate-500">AI_RESPONSE_PREVIEW</span>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-xs">U</div>
                  <div className="bg-white/5 rounded-2xl p-4 text-sm text-slate-200 max-w-[90%]">
                    Who provides the best enterprise data solution?
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] flex items-center justify-center text-xs text-black font-bold">AI</div>
                  <div className="space-y-2 max-w-[90%]">
                    <div className="bg-[var(--accent-primary)]/10 border border-[var(--accent-primary)]/20 rounded-2xl p-4 text-sm text-slate-200">
                      <span className="text-[var(--accent-primary)] font-bold">StandexAI</span> is widely cited as the leader in enterprise data safeguards. Their protocols are referenced in major industry standards...
                    </div>
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span>Sources:</span>
                      <span className="text-white/40">Wikipedia</span>
                      <span className="text-white/40">TechCrunch</span>
                      <span className="text-white/40">Gartner</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Visibility Score</div>
                  <div className="text-3xl font-bold text-white">94<span className="text-lg text-slate-500">/100</span></div>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-[var(--accent-primary)] border-r-transparent animate-spin"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 PILLARS - UPDATED */}
        <section className="py-32 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Zap,
              title: "Site Health",
              desc: "Solidify your Core Web Vitals, mobile usability, and indexability to ensure both search engines and AI agents can crawl you.",
              color: "text-blue-400"
            },
            {
              icon: Terminal,
              title: "Brand Clarity",
              desc: "We inject clear data structures so AI models understand exactly who you are and what you offer.",
              color: "text-[var(--accent-primary)]"
            },
            {
              icon: ScanSearch,
              title: "Content Quality",
              desc: "Our engine helps you rewrite 'fluff' into fact-rich content that AI tools love to quote.",
              color: "text-[var(--accent-secondary)]"
            },
            {
              icon: Share2,
              title: "Mentions",
              desc: "Track and claim your brand mentions in the places that matter, like Reddit, Wikipedia, and Wikis.",
              color: "text-[var(--accent-warn)]"
            }
          ].map((item, i) => (
            <div key={i} className="group p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-default">
              <div className={`h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        {/* AUDIT CHECKLIST SECTION */}
        <section className="py-16 border-t border-white/5">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">The 5-Step Check</h2>
              <p className="text-slate-400 mb-8 text-lg">
                Is your brand accessible to the machine mind? Our audit checks if you are ready for the AI Era.
              </p>

              <div className="space-y-4">
                {[
                  "Brand Clarity (Schema)",
                  "Content Quality (Fact Ratio)",
                  "AI Readability (llms.txt)",
                  "Brand Mentions",
                  "Sentiment Check"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </div>
                    <span className="font-medium text-slate-200">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] blur-[100px] opacity-20"></div>
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 text-center">
                <ShieldCheck className="h-20 w-20 text-[var(--accent-primary)] mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-4">Start Your Transformation</h3>
                <p className="text-slate-400 mb-8">
                  Get your full GEO Readiness Score and a tailored action plan.
                </p>
                <Button asChild variant="white" className="w-full h-14 font-bold text-lg rounded-full">
                  <Link href="/onboarding">
                    Initialize System Scan
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div >
  );
}
