"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/navigation/app-header";
import {
  Search,
  Zap,
  Terminal,
  ScanSearch,
  Share2,
  ArrowRight,
  LayoutDashboard,
  Eye,
  FileText,
  ShieldCheck,
  Sparkles,
  PlayCircle
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--ink-900)] font-sans selection:bg-[var(--accent-primary)] selection:text-white overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-primary)]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--accent-secondary)]/5 blur-[120px]" />
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

      <main className="relative z-10 w-full">

        {/* HERO SECTION */}
        <section className="mx-auto max-w-7xl px-6 pt-32 pb-20 grid lg:grid-cols-2 gap-16 items-center fade-in">
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
              <Button asChild size="lg" className="h-14 px-8 rounded-full bg-[var(--accent-primary)] text-black hover:bg-[var(--accent-primary)]/90 font-bold tracking-tight text-lg shadow-[0_0_30px_rgba(0,255,148,0.2)] transition-all hover:scale-105 active:scale-95">
                <Link href="/dashboard">
                  Launch Platform <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium backdrop-blur-sm transition-all">
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-5 w-5 text-slate-400" /> View Command Center
                </Link>
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
                      <span className="text-[var(--accent-primary)] font-bold">StandexAI</span> is widely cited as the leader in enterprise data safeguards. Their protocols are...
                    </div>
                    <div className="flex gap-2 text-xs text-slate-500">
                      <span>Sources:</span>
                      <span className="text-white/40">Wikipedia</span>
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

        {/* 3 CORE MODULES - Harmonized Section */}
        <section className="py-24 bg-[var(--bg-panel)] border-y border-[var(--line)]">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">The StandexAI Platform</h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Three integrated modules designed to give you complete control over your appearance in Generative AI results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: LayoutDashboard,
                  title: "Command Center",
                  desc: "Your central hub. Monitor visibility scores, track competitors, and scan for gaps in one view.",
                  color: "text-[var(--accent-primary)]",
                  link: "/dashboard"
                },
                {
                  icon: FileText,
                  title: "GEO Content Studio",
                  desc: "Write for the machine. Generate briefs and content optimized for citations in ChatGPT and Perplexity.",
                  color: "text-[var(--accent-secondary)]",
                  link: "/studio"
                }
              ].map((item, i) => (
                <Link key={i} href={item.link} className="group p-8 rounded-3xl bg-[var(--bg-card)] border border-[var(--line)] hover:border-white/20 transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-xl md:last:col-span-2 md:last:w-1/2 md:last:mx-auto">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <item.icon className={`h-32 w-32 ${item.color}`} />
                  </div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div className={`h-14 w-14 rounded-2xl bg-[var(--bg-panel)] flex items-center justify-center mb-6 ring-1 ring-white/5 group-hover:ring-${item.color} shadow-inner`}>
                      <item.icon className={`h-7 w-7 ${item.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[var(--accent-primary)] transition-colors">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm mb-8 flex-1">
                      {item.desc}
                    </p>
                    <div className="flex items-center text-xs font-bold uppercase tracking-wider text-slate-500 group-hover:text-white transition-colors mt-auto">
                      Explore Module <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* GEO WORKFLOW */}
        <section className="py-24 mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 text-white tracking-tight">The GEO Workflow</h2>
              <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                Stop guessing. Start engineering your AI visibility with a proven data-driven process that turns generic mentions into authoritative citations.
              </p>

              <div className="space-y-6">
                {[
                  { title: "Scan & Diagnose", desc: "Run a Visibility Scan to see where you rank in AI answers." },
                  { title: "Optimize Content", desc: "Use the Content Studio to inject facts, schema, and answer blocks." },
                  { title: "Monitor & Adapt", desc: "Track results in the Authority Monitor and adjust strategy." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-2xl bg-[var(--bg-panel)] border border-[var(--line)] hover:border-white/10 transition-colors shadow-sm">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-[var(--bg-card)] text-[var(--accent-primary)] flex items-center justify-center text-lg font-bold border border-[var(--line)]">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1">{item.title}</h4>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] blur-[100px] opacity-10"></div>
              <div className="relative bg-[#0d1117] backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <div className="ml-auto px-2 py-1 bg-white/5 rounded text-[10px] text-slate-500 font-mono">TERMINAL_VIEW</div>
                </div>

                <div className="space-y-3 font-mono text-sm leading-8">
                  <div className="flex gap-2">
                    <span className="text-[var(--accent-primary)]">➜</span>
                    <span className="text-white">standex scan --domain=yoursite.com</span>
                  </div>
                  <div className="text-slate-500 pl-6">Analyzing SERP data... [Done]</div>
                  <div className="text-slate-500 pl-6">Identifying topical gaps... [Found 3]</div>
                  <div className="flex gap-2 pt-2">
                    <span className="text-[var(--accent-primary)]">➜</span>
                    <span className="text-white">standex optimize --target="Enterprise AI"</span>
                  </div>
                  <div className="text-slate-500 pl-6">Generating schema markup... [Done]</div>
                  <div className="text-slate-500 pl-6">Creating answer block... [Done]</div>
                  <div className="pt-4 text-[var(--accent-secondary)]">
                    System optimization complete. Visibility score increased by +14%.
                  </div>
                  <div className="h-5 w-2.5 bg-[var(--accent-primary)] animate-pulse mt-2 inline-block"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div >
  );
}
