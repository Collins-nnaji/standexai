"use client";

import React, { useState } from "react";
import { CognitiveAuditHistoryList } from "@/components/ui/CognitiveAuditHistoryList";
import { CognitiveAuditHUD } from "@/components/ui/CognitiveAuditHUD";
import { CognitiveAuditReview } from "@/components/ui/CognitiveAuditReview";
import { motion, AnimatePresence } from "framer-motion";
import { saveAssessment } from "@/app/cognitive-audit/actions";
import { useRouter } from "next/navigation";

interface CognitiveAuditLayoutClientProps {
  initialHistory: any[];
}

export function CognitiveAuditLayoutClient({ initialHistory }: CognitiveAuditLayoutClientProps) {
  const [history, setHistory] = useState(initialHistory);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const router = useRouter();

  const handleComplete = async (score: number, totalQuestions: number, runHistory: any[]) => {
    const tier = score >= 8 ? "Advanced" : score >= 5 ? "Intermediate" : "Foundations";
    const res = await saveAssessment({ score, totalQuestions, tier, history: runHistory });
    if (res && res.success && res.runId) {
      // Add local optimistic update
      const newRun = {
        id: res.runId,
        score,
        totalQuestions,
        tier,
        history: runHistory,
        createdAt: new Date()
      };
      setHistory(prev => [newRun, ...prev]);
      setActiveRunId(res.runId);
      router.refresh();
    }
  };

  const activeRun = history.find(r => r.id === activeRunId);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 border-t border-zinc-100 min-h-[600px] mt-4 relative">
      <div className="w-full md:w-64 md:shrink-0 md:pr-6 mb-6 md:mb-0">
        <CognitiveAuditHistoryList
          runs={history}
          activeRunId={activeRunId}
          onSelectRun={(id) => setActiveRunId(id)}
        />
      </div>
      <div className="flex-1 md:pl-6 md:border-l md:border-zinc-100 relative min-w-0">
        <AnimatePresence mode="wait">
          {activeRunId === null ? (
            <motion.div
              key="hud"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <div className="rounded-[44px] border border-white/60 bg-white/40 p-2.5 backdrop-blur-3xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.03]">
                <div className="rounded-[38px] bg-white p-6 lg:p-10 shadow-inner">
                  <CognitiveAuditHUD onComplete={handleComplete} />
                </div>
              </div>
            </motion.div>
          ) : activeRun && (
            <motion.div
              key={`review-${activeRun.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <CognitiveAuditReview run={activeRun} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
