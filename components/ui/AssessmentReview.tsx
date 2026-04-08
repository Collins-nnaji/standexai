"use client";

import React from "react";
import { CheckCircle2, XCircle, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssessmentReviewItem {
  question: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number;
  explanation: string;
}

interface AssessmentReviewProps {
  run: {
    score: number;
    totalQuestions: number;
    tier: string;
    createdAt: Date;
    history: any; // Prisma Json type comes back as any/unknown
  };
}

export function AssessmentReview({ run }: AssessmentReviewProps) {
  const history: AssessmentReviewItem[] = Array.isArray(run.history) ? run.history : [];

  return (
    <div className="w-full max-w-4xl mx-auto py-6">
      <div className="mb-8 border-b border-zinc-200 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 tracking-tight">Assessment Review</h2>
          <p className="text-sm font-medium text-zinc-500 mt-1">
            Taken on {new Date(run.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-[#7C5CFC]">{run.score}<span className="text-xl text-zinc-300">/{run.totalQuestions}</span></div>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-1">{run.tier} Tier</div>
        </div>
      </div>

      <div className="space-y-12">
        {history.map((item, qIdx) => (
          <div key={qIdx} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm relative overflow-hidden">
             <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-zinc-900/5 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-500">
               <Cpu className="h-3 w-3" /> Question {qIdx + 1}
             </div>
             
             <h3 className="text-lg md:text-xl font-black text-zinc-900 leading-tight mb-6">
               {item.question}
             </h3>

             <div className="grid gap-3 sm:grid-cols-2 mb-6">
               {item.options.map((option, optIdx) => {
                 const isCorrect = optIdx === item.correctIndex;
                 const isSelected = optIdx === item.selectedIndex;
                 
                 return (
                   <div
                     key={optIdx}
                     className={cn(
                       "relative flex items-center justify-between rounded-2xl border p-4 text-left transition-all",
                       isCorrect ? "border-emerald-500/50 bg-emerald-50/50" : 
                       (isSelected && !isCorrect) ? "border-red-500/50 bg-red-50/50" :
                       "border-zinc-200 bg-zinc-50/30 opacity-70"
                     )}
                   >
                     <span className={cn(
                       "text-xs font-bold leading-relaxed",
                       (isCorrect || isSelected) ? "text-zinc-900" : "text-zinc-500"
                     )}>
                       {option}
                     </span>
                     {isCorrect && (
                       <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                     )}
                     {isSelected && !isCorrect && (
                       <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                     )}
                   </div>
                 );
               })}
             </div>

             <div className="rounded-2xl bg-zinc-900 p-5 text-white">
               <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFC]">
                 <ShieldCheck className="h-3.5 w-3.5" /> AI Model Explanation
               </div>
               <p className="text-xs font-medium leading-relaxed opacity-90">
                 {item.explanation}
               </p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}
