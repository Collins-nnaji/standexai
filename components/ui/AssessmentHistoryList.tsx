"use client";

import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Calendar, CheckCircle2, ChevronRight, PlusCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentRunOverview {
  id: string;
  score: number;
  totalQuestions: number;
  tier: string;
  createdAt: Date;
}

interface AssessmentHistoryListProps {
  runs: AssessmentRunOverview[];
  activeRunId: string | null;
  onSelectRun: (id: string | null) => void;
}

export function AssessmentHistoryList({ runs, activeRunId, onSelectRun }: AssessmentHistoryListProps) {
  return (
    <div className="w-full h-full border-r border-zinc-100 bg-white sm:bg-transparent sm:border-none p-4 sm:p-0 flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-[0.1em] text-zinc-900 flex items-center gap-2">
          <Calendar className="h-3.5 w-3.5 text-[#7C5CFC]" /> History
        </h2>
        <button
          onClick={() => onSelectRun(null)}
          className="flex items-center gap-1.5 text-[10px] font-bold text-[#7C5CFC] hover:text-[#6042db] transition-colors"
        >
          <PlusCircle className="h-3.5 w-3.5" /> New
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-2">
        {runs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-200 p-5 text-center bg-zinc-50/50">
            <Target className="h-6 w-6 text-zinc-300 mx-auto mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No History</p>
            <p className="text-[11px] font-medium text-zinc-500 mt-1">Take your first assessment.</p>
          </div>
        ) : (
          runs.map((run) => (
            <button
              key={run.id}
              onClick={() => onSelectRun(run.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                activeRunId === run.id 
                  ? "border-[#7C5CFC] bg-[#7C5CFC]/5 shadow-sm" 
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
              )}
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest",
                    activeRunId === run.id ? "text-[#7C5CFC]" : "text-zinc-900 group-hover:text-[#7C5CFC]"
                  )}>
                    {run.tier} Tier
                  </span>
                  {run.score >= 8 && <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                </div>
                <div className="text-[11px] font-medium text-zinc-500">
                  {formatDistanceToNow(new Date(run.createdAt), { addSuffix: true })}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-zinc-900">{run.score}<span className="text-xs text-zinc-400">/10</span></span>
                <ChevronRight className={cn(
                  "h-4 w-4 transition-colors", 
                  activeRunId === run.id ? "text-[#7C5CFC]" : "text-zinc-300 group-hover:text-[#7C5CFC]"
                )} />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
