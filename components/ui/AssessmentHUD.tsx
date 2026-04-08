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
  Search
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

interface AssessmentHUDProps {
  onComplete?: (score: number, total: number, history: AssessmentHistoryItem[]) => void;
}

export function AssessmentHUD({ onComplete }: AssessmentHUDProps) {
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
      setError("Failed to initialize assessment. Ensure LLM is configured.");
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
    const content = `# StandexAI Technical Assessment Result\n\nScore: ${score}/${TOTAL_QUESTIONS}\n\nAssessed Tier: **${tier}**\n\nBased on your assessment, your technical alignment recommends you prioritize the ${tier} track of the 6-Week StandexAI Academy program.\n\nWe look forward to building with you.`;
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StandexAI_Assessment_Score_${score}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative h-full w-full max-w-5xl mx-auto">
      {/* HUD Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C5CFC]/10 text-[#7C5CFC]">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">AI Assessment</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">v4.0.2 • Verified SOTA Models</p>
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
          className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-600 transition-all hover:bg-zinc-50 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} /> Restart
        </button>
      </div>

      {/* Main Terminal Stage */}
      <div className="relative min-h-[400px] rounded-[32px] border border-white/40 bg-white/40 p-1 backdrop-blur-3xl shadow-2xl overflow-hidden shadow-zinc-200/50">
        <div className="h-full w-full rounded-[30px] bg-zinc-900/5 border border-zinc-200/50 p-8 lg:p-12">
          <AnimatePresence mode="wait">
            {!hasStarted ? (
              <motion.div 
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex h-full flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#7C5CFC]/10">
                  <Sparkles className="h-10 w-10 text-[#7C5CFC]" />
                </div>
                <h2 className="mb-4 text-3xl font-black text-zinc-900 tracking-tight">Ready to begin?</h2>
                <p className="mb-10 max-w-sm text-sm font-medium text-zinc-500 leading-relaxed">
                  You will be assessed on 10 AI engineering domains. Your score and history will be saved to your profile.
                </p>
                <Button 
                  onPress={startAssessment}
                  className="h-14 rounded-2xl bg-[#7C5CFC] px-10 text-xs font-black uppercase tracking-[0.1em] text-white shadow-xl shadow-[#7C5CFC]/20 transition-transform hover:scale-105"
                >
                  Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
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
                <div className="relative mb-6 h-16 w-16">
                  <div className="absolute inset-0 animate-ping rounded-full bg-[#7C5CFC]/20" />
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-zinc-900 text-[#7C5CFC]">
                    <Search className="h-6 w-6 animate-pulse" />
                  </div>
                </div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[#7C5CFC] animate-pulse">Scanning Knowledge Base...</p>
              </motion.div>
            ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex h-full flex-col items-center justify-center py-20 text-center"
                >
                  <XCircle className="mb-4 h-12 w-12 text-red-500" />
                  <p className="text-sm font-bold text-zinc-600">{error}</p>
                </motion.div>
            ) : isFinished ? (
                <motion.div
                  key="finished"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex h-full flex-col items-center justify-center py-16 text-center"
                >
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[32px] bg-[#7C5CFC]/10 text-[#7C5CFC]">
                    <CheckCircle2 className="h-10 w-10" />
                  </div>
                  <h2 className="text-3xl font-black text-zinc-900 mb-2">Assessment Complete</h2>
                  <p className="text-sm font-medium text-zinc-500 mb-8 max-w-sm mx-auto">
                    You scored <strong className="text-zinc-900">{score} out of {TOTAL_QUESTIONS}</strong>. Based on your results, we have generated your technical outcome report.
                  </p>
                  
                  <button 
                    onClick={downloadResult}
                    className="flex h-12 items-center justify-center rounded-2xl bg-[#7C5CFC] px-8 text-[11px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#7C5CFC]/20 hover:bg-[#6042db] transition-all active:scale-95"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" /> Download PDF / Report
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
                   <div className="mb-4 inline-flex items-center gap-2 rounded-md bg-zinc-900/5 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                      <Cpu className="h-3 w-3" /> Question {questionNumber} of {TOTAL_QUESTIONS}
                   </div>
                   <h2 className="text-xl md:text-2xl font-black text-zinc-900 leading-tight">
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
                        "group relative flex items-center justify-between rounded-2xl border p-5 text-left transition-all duration-300",
                        isEvaluated && idx === question.correctIndex ? "border-emerald-500/50 bg-emerald-50/50" : 
                        isEvaluated && selectedIndex === idx ? "border-red-500/50 bg-red-50/50" :
                        selectedIndex === idx ? "border-[#7C5CFC] bg-[#7C5CFC]/5" : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                      )}
                    >
                      <span className={cn(
                        "text-xs font-bold leading-relaxed",
                        isEvaluated && (idx === question.correctIndex || selectedIndex === idx) ? "text-zinc-900" : "text-zinc-600 group-hover:text-zinc-900"
                      )}>
                        {option}
                      </span>
                      {isEvaluated && idx === question.correctIndex && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                      {isEvaluated && selectedIndex === idx && idx !== question.correctIndex && (
                        <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {isEvaluated && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="rounded-2xl bg-zinc-900 p-6 text-white shadow-2xl"
                    >
                      <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFC]">
                        <ShieldCheck className="h-3.5 w-3.5" /> AI Model Explanation
                      </div>
                      <p className="text-xs font-medium leading-relaxed opacity-90">
                        {question.explanation}
                      </p>
                      <div className="mt-6">
                        <Button 
                          onPress={handleNextChallenge}
                          className="h-10 rounded-xl bg-[#7C5CFC] px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-white hover:text-[#7C5CFC]"
                        >
                          {questionNumber >= TOTAL_QUESTIONS ? "View Results" : "Next Challenge"} <ArrowRight className="ml-2 h-3.5 w-3.5" />
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
      <div className="mt-6 flex items-center justify-center gap-6">
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Low Latency</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Context Verified</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Technical Tier</span>
         </div>
      </div>
    </div>
  );
}
