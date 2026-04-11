"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Terminal, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Search,
  Crosshair
} from "lucide-react";
import { Button } from "@heroui/react";
import { cn } from "@/lib/utils";

interface AIQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssessmentHistoryItem {
  question: string;
  options: string[];
  correctIndex: number;
  selectedIndex: number;
  explanation: string;
}

const TOTAL_QUESTIONS = 10;

interface CognitiveAuditHUDProps {
  onComplete?: (score: number, total: number, history: AssessmentHistoryItem[]) => void;
}

export function CognitiveAuditHUD({ onComplete }: CognitiveAuditHUDProps) {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<AIQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isEvaluated, setIsEvaluated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [history, setHistory] = useState<AssessmentHistoryItem[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    setSelectedIndex(null);
    setIsEvaluated(false);
    try {
      const resp = await fetch("/api/ai/assess", {
        method: "POST",
        body: JSON.stringify({ mode: "GENERATE" })
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setQuestion(data);
    } catch (err) {
      setError("Failed to initialize skills benchmark. Ensure LLM is configured.");
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = () => {
    setHasStarted(true);
    fetchQuestion();
  };

  const handleSelect = (idx: number) => {
    if (isEvaluated || !question) return;
    setSelectedIndex(idx);
    setIsEvaluated(true);
    
    let newScore = score;
    if (idx === question.correctIndex) {
      setScore(s => s + 1);
      newScore += 1;
    }

    setHistory(prev => [
      ...prev,
      {
        question: question.question,
        options: question.options,
        correctIndex: question.correctIndex,
        selectedIndex: idx,
        explanation: question.explanation,
      }
    ]);
  };

  const handleNextChallenge = () => {
    if (questionNumber >= TOTAL_QUESTIONS) {
      setIsFinished(true);
      if (onComplete) {
        onComplete(score, TOTAL_QUESTIONS, history);
      }
    } else {
      setQuestionNumber(n => n + 1);
      fetchQuestion();
    }
  };

  const downloadResult = () => {
    const tier = score >= 8 ? "Advanced" : score >= 5 ? "Intermediate" : "Foundations";
    const content = `# StandexAI Skills Benchmark Result\n\nScore: ${score}/${TOTAL_QUESTIONS}\n\nAssessed Tier: **${tier}**\n\nBased on your benchmark, your technical alignment recommends you prioritize the ${tier} track of the 6-Week StandexAI Academy program.\n\nWe look forward to building with you.`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StandexAI_Skills_Benchmark_${score}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative h-full w-full max-w-5xl mx-auto bg-zinc-950 p-6 sm:p-10 rounded-[32px] border border-zinc-800 shadow-[0_0_80px_rgba(124,92,252,0.1)]">
      {/* HUD Header */}
      <div className="mb-8 flex items-center justify-between border-b border-zinc-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C5CFC]/20 text-[#A892FF] border border-[#7C5CFC]/30 shadow-[0_0_15px_rgba(124,92,252,0.2)]">
            <Terminal className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.25em] text-white">Skills Benchmark</h3>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Technical Assessment • Secure Link</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setQuestionNumber(1);
            setScore(0);
            setIsFinished(false);
            setHistory([]);
            setHasStarted(false);
          }}
          disabled={loading || !hasStarted}
          className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white disabled:opacity-30 disabled:hover:bg-zinc-900 focus:outline-[#7C5CFC]"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin text-[#7C5CFC]")} /> System Reboot
        </button>
      </div>

      {/* Main Terminal Stage */}
      <div className="relative min-h-[440px] rounded-2xl border border-zinc-800/80 bg-black p-1 shadow-inner overflow-hidden">
        {/* Terminal Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#3f3f4611_1px,transparent_1px),linear-gradient(to_bottom,#3f3f4611_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <div className="relative h-full w-full rounded-xl bg-zinc-950/80 p-6 lg:p-12 z-10">
          <AnimatePresence mode="wait">
            {!hasStarted ? (
              <motion.div 
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex h-full flex-col items-center justify-center py-16 text-center"
              >
                <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#7C5CFC] opacity-20 blur-xl animate-pulse" />
                  <Crosshair className="h-10 w-10 text-[#A892FF] relative z-10" />
                </div>
                <h2 className="mb-4 text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">Initialize Benchmark?</h2>
                <p className="mb-10 max-w-md text-sm font-medium text-zinc-400 leading-relaxed">
                  Take a live technical benchmark across 10 engineering domains. This will identify your skill baseline and generate a technical profile.
                </p>
                <Button 
                  onPress={startAssessment}
                  className="h-14 rounded-xl bg-white px-10 text-[11px] font-black uppercase tracking-[0.1em] text-black shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:bg-zinc-200"
                >
                  Start Benchmark <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full flex-col items-center justify-center py-20"
              >
                <div className="relative mb-6 h-20 w-20">
                  <div className="absolute inset-0 animate-ping rounded-full bg-[#7C5CFC]/20" />
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 border border-[#7C5CFC]/30 text-[#7C5CFC] shadow-[0_0_30px_rgba(124,92,252,0.3)]">
                    <Search className="h-8 w-8 animate-pulse" />
                  </div>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7C5CFC] animate-pulse">Evaluating Knowledge Base...</p>
                <p className="text-[10px] mt-2 font-mono text-zinc-500 uppercase">Awaiting environment generation</p>
              </motion.div>
            ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full flex-col items-center justify-center py-20 text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                     <XCircle className="h-10 w-10 text-red-500" />
                  </div>
                  <h2 className="mb-2 text-2xl font-black text-white italic uppercase">Audit Failed</h2>
                  <p className="text-sm font-medium text-zinc-400 max-w-sm">{error}</p>
                </motion.div>
            ) : isFinished ? (
                <motion.div
                  key="finished"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center py-16 text-center"
                >
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 relative">
                     <div className="absolute inset-0 bg-emerald-500 opacity-20 blur-xl animate-pulse" />
                     <CheckCircle2 className="h-12 w-12 relative z-10" />
                  </div>
                  <h2 className="text-4xl font-black text-white mb-3 tracking-tighter uppercase italic">Benchmark Complete</h2>
                  <p className="text-sm font-medium text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed">
                    Evaluation finished. You scored <strong className="text-white bg-zinc-800 px-2 py-0.5 rounded ml-1">{score} / {TOTAL_QUESTIONS}</strong> across the active domains.
                  </p>
                  
                  <button 
                    onClick={downloadResult}
                    className="flex h-14 items-center justify-center rounded-xl bg-[#7C5CFC] px-10 text-[11px] font-black uppercase tracking-widest text-white shadow-[0_0_20px_rgba(124,92,252,0.4)] hover:bg-[#6042db] transition-all active:scale-95"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" /> Download Tech Profile
                  </button>
                </motion.div>
            ) : question && (
              <motion.div 
                key="question"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-10"
              >
                <div className="max-w-3xl">
                   <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-[#A892FF]">
                      <Cpu className="h-3 w-3" /> Question {questionNumber} of {TOTAL_QUESTIONS}
                   </div>
                   <h2 className="text-2xl md:text-3xl font-black text-white leading-tight font-sans tracking-tight">
                     {question.question}
                   </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {question.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={isEvaluated}
                      className={cn(
                        "group relative flex items-center justify-between rounded-xl border p-5 text-left transition-all duration-300",
                        isEvaluated && idx === question.correctIndex ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.15)]" : 
                        isEvaluated && selectedIndex === idx ? "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]" :
                        selectedIndex === idx ? "border-[#7C5CFC] bg-[#7C5CFC]/10" : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-800"
                      )}
                    >
                      <span className={cn(
                        "text-sm font-semibold leading-relaxed transition-colors",
                        isEvaluated && idx === question.correctIndex ? "text-emerald-400" :
                        isEvaluated && selectedIndex === idx ? "text-red-400" :
                        "text-zinc-300 group-hover:text-white"
                      )}>
                        {option}
                      </span>
                      {isEvaluated && idx === question.correctIndex && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full" />
                      )}
                      {isEvaluated && selectedIndex === idx && idx !== question.correctIndex && (
                        <XCircle className="h-5 w-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {isEvaluated && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#7C5CFC]" />
                      <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#A892FF]">
                        <ShieldCheck className="h-3.5 w-3.5" /> Explanation
                      </div>
                      <p className="text-sm font-medium leading-relaxed text-zinc-300">
                        {question.explanation}
                      </p>
                      <div className="mt-6 flex justify-end">
                        <Button 
                          onPress={handleNextChallenge}
                          className="h-10 rounded-lg bg-white px-6 text-[10px] font-black uppercase tracking-widest text-black shadow-lg hover:bg-zinc-200"
                        >
                          {questionNumber >= TOTAL_QUESTIONS ? "Compute Report" : "Next Question"} <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative Signals */}
      <div className="mt-8 flex items-center justify-between border-t border-zinc-800/80 pt-6">
         <div className="flex gap-6">
           <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-[pulse_1.5s_ease-in-out_infinite]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Node Syncing</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC] animate-[pulse_2s_ease-in-out_infinite]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live Context</span>
           </div>
         </div>
      </div>
    </div>
  );
}
