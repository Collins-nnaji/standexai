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
} from "lucide-react";
import Link from "next/link";
import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { AssessmentLayoutClient } from "@/components/ui/AssessmentLayoutClient";

export default async function AssessmentPage() {
  const { data: session } = await neonAuth.getSession();
  
  let initialHistory: any[] = [];
  if (session?.user?.id) {
    initialHistory = await prisma.assessmentRun.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAFAF9] overflow-hidden selection:bg-[#7C5CFC]/20">
      <TopNav user={session?.user ?? null} />

      {/* Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[600px] w-full bg-[radial-gradient(ellipse_at_center,#7C5CFC07,transparent_70%)]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-500/4 blur-[100px]" />
        <div className="grain-overlay opacity-[0.04]" />
      </div>

      <main className="relative flex-1 flex flex-col z-10 w-full">
        {/* Page Header Area */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/15 bg-[#7C5CFC]/8 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.25em] text-[#7C5CFC]">
                <Zap className="h-3 w-3 fill-[#7C5CFC]" />
                Free AI Knowledge Assessment
              </div>
              <h1 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight leading-[1.05]">
                Know where you stand.
                <br />
                <span className="text-[#7C5CFC]">Get your technical result.</span>
              </h1>
              <p className="mt-2 max-w-lg text-sm font-medium text-zinc-500 leading-relaxed">
                Answer 10 AI engineering questions. We'll assess your level
                and generate a downloadable assessment result to guide your
                further learning and integration into the platform.
              </p>
            </div>

            {/* How it works — compact */}
            <div className="shrink-0 flex flex-col gap-2 sm:w-56">
              {[
                { icon: Sparkles, label: "Take the 10-question assessment" },
                { icon: BookOpen, label: "We analyze your technical level" },
                { icon: Rocket, label: "Save history & Review" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#7C5CFC]/10 text-[#7C5CFC]">
                    <s.icon className="h-3 w-3" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-600">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Client Shell with Sidebar */}
        <AssessmentLayoutClient initialHistory={initialHistory} />
      </main>

      <footer className="relative py-8 border-t border-zinc-100 z-10 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-400">
          <div>StandexAI Knowledge Assessment · AI Engineering Platform</div>
          <div>Free · Assesment History Persisted</div>
        </div>
      </footer>
    </div>
  );
}
