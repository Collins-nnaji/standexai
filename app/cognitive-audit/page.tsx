import React from "react";
import { TopNav } from "@/components/network/TopNav";
import {
  Zap,
  Sparkles,
  BookOpen,
  Rocket,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Terminal,
} from "lucide-react";
import Link from "next/link";
import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { CognitiveAuditLayoutClient } from "@/components/ui/CognitiveAuditLayoutClient";

export default async function CognitiveAuditPage() {
  const { data: session } = await neonAuth.getSession();
  
  let initialHistory: any[] = [];
  if (session?.user?.id) {
    initialHistory = await prisma.assessmentRun.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 selection:bg-[#7C5CFC]/20">
      <TopNav user={session?.user ?? null} />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[600px] w-full bg-[radial-gradient(ellipse_at_center,rgba(124,92,252,0.15),transparent_70%)]" />
        <div className="absolute w-[150%] h-[150%] top-0 left-0 bg-[linear-gradient(to_right,rgba(124,92,252,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,92,252,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="grain-overlay opacity-[0.04]" />
      </div>

      <main className="relative flex-1 flex flex-col z-10 w-full mb-12">
        {/* Page Header Area */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-[#A892FF] shadow-[0_0_15px_rgba(124,92,252,0.2)]">
                <Terminal className="h-4 w-4" />
                Engineering Skills Benchmark
              </div>
              <h1 className="font-syne text-4xl sm:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.95] uppercase italic">
                Test your <br />
                <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#A892FF,#7C5CFC)]">engineering skills.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base font-medium text-zinc-400 leading-relaxed">
                Run a live benchmark across 10 critical applied AI domains. 
                Identify knowledge gaps, evaluate your architectural decision-making, 
                and receive a technical report for the next pilot cohort.
              </p>
            </div>

            {/* How it works — compact */}
            <div className="shrink-0 flex flex-col gap-3 sm:w-64 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800/50 backdrop-blur-xl">
              {[
                { icon: Terminal, label: "Start your benchmark" },
                { icon: Zap, label: "Evaluate core AI concepts" },
                { icon: BookOpen, label: "Review your technical profile" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7C5CFC]/20 text-[#A892FF] border border-[#7C5CFC]/30">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold tracking-wide text-zinc-300">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Client Shell with Sidebar */}
        <CognitiveAuditLayoutClient initialHistory={initialHistory} />
      </main>

      <footer className="relative py-8 border-t border-zinc-900 z-10 bg-zinc-950 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-500 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[#7C5CFC] animate-pulse" />
            StandexAI Skills Benchmark
          </div>
          <div className="flex gap-4">
            <span>LLM Knowledge Evaluator</span>
            <span className="text-zinc-700">|</span>
            <span>History: Persisted</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
