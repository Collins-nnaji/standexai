"use client";

import React from "react";
import { CheckCircle2, XCircle, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CognitiveAuditReviewItem {
  question: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number;
  explanation: string;
}

interface CognitiveAuditReviewProps {
  run: {
    score: number;
    totalQuestions: number;
    tier: string;
    createdAt: Date;
    history: any; // Prisma Json type comes back as any/unknown
  };
}

export function CognitiveAuditReview({ run }: CognitiveAuditReviewProps) {
  const history: CognitiveAuditReviewItem[] = Array.isArray(run.history) ? run.history : [];

  return (
    <div className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(124,92,252,0.1)]">
      <div className="mb-10 border-b border-zinc-800 pb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Skills Profile</h2>
          <p className="text-xs font-medium text-zinc-500 mt-2 uppercase tracking-widest">
            Benchmark Date: {new Date(run.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-left md:text-right flex items-center md:items-end flex-row md:flex-col gap-4 md:gap-1">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-[linear-gradient(to_right,#A892FF,#7C5CFC)]">
            {run.score}<span className="text-2xl text-zinc-700">/{run.totalQuestions}</span>
          </div>
          <div className="flex h-6 items-center px-3 rounded bg-[#7C5CFC]/20 text-[10px] font-black uppercase tracking-[0.2em] text-[#A892FF] border border-[#7C5CFC]/30">
            {run.tier} Model
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {history.map((item, qIdx) => (
          <div key={qIdx} className="rounded-2xl border border-zinc-800/80 bg-black p-6 md:p-8 shadow-inner relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-zinc-800" />
             <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 border border-zinc-800/50">
               <Cpu className="h-3 w-3 text-[#A892FF]" /> Question {qIdx + 1}
             </div>
             
             <h3 className="text-lg md:text-xl font-black text-white leading-tight mb-8 font-sans">
               {item.question}
             </h3>

             <div className="grid gap-4 sm:grid-cols-2 mb-8">
               {item.options.map((option, optIdx) => {
                 const isCorrect = optIdx === item.correctIndex;
                 const isSelected = optIdx === item.selectedIndex;
                 
                 return (
                   <div
                     key={optIdx}
                     className={cn(
                       "relative flex items-center justify-between rounded-xl border p-5 text-left transition-all",
                       isCorrect ? "border-emerald-500/50 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : 
                       (isSelected && !isCorrect) ? "border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]" :
                       "border-zinc-800 bg-zinc-900/50 opacity-60"
                     )}
                   >
                     <span className={cn(
                       "text-sm font-semibold leading-relaxed",
                       (isCorrect || isSelected) ? "text-zinc-200" : "text-zinc-500"
                     )}>
                       {option}
                     </span>
                     {isCorrect && (
                       <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full" />
                     )}
                     {isSelected && !isCorrect && (
                       <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                     )}
                   </div>
                 );
               })}
             </div>

             <div className="rounded-xl bg-zinc-950 p-6 border border-zinc-800/50">
               <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#A892FF]">
                 <ShieldCheck className="h-3.5 w-3.5" /> Explanation
               </div>
               <p className="text-sm font-medium leading-relaxed text-zinc-400">
                 {item.explanation}
               </p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
