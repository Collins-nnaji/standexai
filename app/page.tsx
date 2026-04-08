import Link from "next/link";
import { neonAuth } from "@/lib/neon/auth-server";
import { TopNav } from "@/components/network/TopNav";
import { LandingHero } from "@/components/ui/LandingHero";
import { ThreeArmSection } from "@/components/ui/ThreeArmSection";
import { CohortSection } from "@/components/ui/CohortSection";
import { PractitionerMetrics } from "@/components/ui/PractitionerMetrics";
import { ArrowRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let session = null;
  try {
    const result = await neonAuth.getSession();
    session = result?.data;
  } catch {}

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden font-[family-name:var(--font-inter)] selection:bg-[#7C5CFC]/20 bg-white">
      <TopNav user={session?.user} />

      <main className="relative flex-1 flex flex-col items-center">

        {/* ── 1. HERO — white bg, animated lines, orbital ── */}
        <div className="w-full">
          <LandingHero />
        </div>

        {/* ── 2. THREE ARMS — DARK zinc-950 with floating orbs ── */}
        <div className="w-full">
          <ThreeArmSection />
        </div>

        {/* ── 3. 6-WEEK COHORT — white ── */}
        <div className="w-full">
          <CohortSection />
        </div>

        {/* ── 4. ASSESSMENT CTA — DARK with subtle glow ── */}
        <div className="w-full bg-zinc-950 border-b border-white/5 relative overflow-hidden">
          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:80px_80px]" />
          {/* Radial glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-[radial-gradient(circle,rgba(124,92,252,0.12),transparent_65%)] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto py-16 lg:py-20 px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/25 bg-[#7C5CFC]/10 px-3 py-1.5 mb-5">
                  <Sparkles className="h-3 w-3 text-[#7C5CFC]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#7C5CFC]">
                    Personalized Onboarding
                  </span>
                </div>
                <h3 className="font-syne text-4xl sm:text-5xl font-black text-white tracking-tight leading-[0.92] mb-4">
                  Not sure where<br />
                  <span className="text-[#7C5CFC]">you stand?</span>
                </h3>
                <p className="text-base font-medium text-zinc-400 max-w-md mb-8 leading-relaxed">
                  Take the free AI assessment. We'll identify your level and
                  build a personalized learning pack aligned to The Academy.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/assessment"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-7 py-3.5 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-[#7C5CFC]/25 hover:bg-[#6042db] transition-all active:scale-95"
                  >
                    Take Free Assessment <Sparkles className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/masterclass"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-7 py-3.5 text-[11px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all active:scale-95"
                  >
                    View The Academy <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Track cards — dark variants */}
              <div className="space-y-3">
                {[
                  { label: "Foundations Track", desc: "Weeks 1–6, build from complete scratch", color: "#3B82F6", sub: "Beginners & non-engineers" },
                  { label: "Applied Track", desc: "Jump in at Week 2 — skip the basics", color: "#7C5CFC", sub: "Used AI APIs before" },
                  { label: "Advanced Track", desc: "Fast-track from Week 3 onwards", color: "#10B981", sub: "Building with LLMs already" },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.04] px-5 py-4"
                  >
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                    <div className="flex-1">
                      <p className="text-sm font-black text-white">{t.label}</p>
                      <p className="text-xs font-medium text-zinc-500">{t.desc}</p>
                    </div>
                    <span className="shrink-0 rounded-full border border-white/8 bg-white/5 px-3 py-1 text-[9px] font-bold text-zinc-500">
                      {t.sub}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. PRACTITIONERS — white ── */}
        <div className="w-full bg-white">
          <PractitionerMetrics />
        </div>

      </main>

      {/* Footer — dark */}
      <footer className="w-full py-10 border-t border-white/5 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-zinc-600 font-bold text-[10px] uppercase tracking-widest">
            StandexAI Applied AI Engineering © {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
            <Link href="/masterclass" className="hover:text-[#7C5CFC] transition-colors">The Academy</Link>
            <Link href="/assessment" className="hover:text-[#7C5CFC] transition-colors">Assessment</Link>
            <Link href="/projects" className="hover:text-[#7C5CFC] transition-colors">Open Projects</Link>
            <Link href="/prime" className="hover:text-[#7C5CFC] transition-colors">Prime</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
