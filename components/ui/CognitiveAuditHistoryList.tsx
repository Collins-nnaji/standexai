"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Calendar, CheckCircle2, ChevronRight, PlusCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CognitiveAuditRunOverview {
  id: string;
  score: number;
  totalQuestions: number;
  tier: string;
  createdAt: Date;
}

interface CognitiveAuditHistoryListProps {
  runs: CognitiveAuditRunOverview[];
  activeRunId: string | null;
  onSelectRun: (id: string | null) => void;
}

export function CognitiveAuditHistoryList({ runs, activeRunId, onSelectRun }: CognitiveAuditHistoryListProps) {
  return (
    <div className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col shadow-[0_0_40px_rgba(124,92,252,0.05)]">
      <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-[#7C5CFC]" /> Benchmark History
        </h2>
        <button
          onClick={() => onSelectRun(null)}
          className="flex items-center gap-1.5 text-[10px] font-bold text-[#A892FF] hover:text-white transition-colors"
        >
          <PlusCircle className="h-3.5 w-3.5" /> New Benchmark
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {runs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-5 text-center bg-black">
            <Target className="h-6 w-6 text-zinc-700 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No Benchmarks</p>
            <p className="text-[11px] font-medium text-zinc-600 mt-1">Start your first benchmark.</p>
          </div>
        ) : (
          runs.map((run) => (
            <button
              key={run.id}
              onClick={() => onSelectRun(run.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
                activeRunId === run.id 
                  ? "border-[#7C5CFC] bg-[#7C5CFC]/10 shadow-[0_0_15px_rgba(124,92,252,0.15)]" 
                  : "border-zinc-800/80 bg-black hover:border-zinc-700 hover:bg-zinc-900"
              )}
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-[0.15em]",
                    activeRunId === run.id ? "text-[#A892FF]" : "text-white group-hover:text-[#A892FF]"
                  )}>
                    {run.tier} Profile
                  </span>
                  {run.score >= 8 && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,0.5)]" />}
                </div>
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                  {formatDistanceToNow(new Date(run.createdAt), { addSuffix: true })}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  "text-lg font-black font-sans",
                  activeRunId === run.id ? "text-white" : "text-zinc-300"
                )}>
                  {run.score}<span className="text-xs text-zinc-600">/10</span>
                </span>
                <ChevronRight className={cn(
                  "h-4 w-4 transition-colors", 
                  activeRunId === run.id ? "text-[#7C5CFC]" : "text-zinc-700 group-hover:text-[#7C5CFC]"
                )} />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
