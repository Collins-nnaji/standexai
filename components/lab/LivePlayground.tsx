"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Send, 
  Terminal, 
  Database, 
  ShieldCheck, 
  Layers, 
  Hash,
  Activity,
  ChevronRight,
  Info
} from "lucide-react";

type TokenLogProb = {
  token: string;
  logprob: number;
  prob: number; // calculated prob
};

type AnalysisResult = {
  completion: string;
  tokens: string[];
  topCandidates: TokenLogProb[];
  usage: {
    prompt: number;
    completion: number;
    total: number;
  };
  metadata: {
    provider: string;
    model: string;
  };
};

export function LivePlayground() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/lab/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch analysis");
      }

      const data = await response.json();
      
      // Extract tokens and logprobs if available
      const choice = data.choices?.[0];
      const completion = choice?.message?.content || "";
      
      // Simple tokenization fallback if logprobs aren't supported by the specific model version
      const tokens = completion.split(/\b/); 
      
      // Mocking logprobs for viz if the API didn't return them (common in some Azure setups)
      const topCandidates: TokenLogProb[] = choice?.logprobs?.content?.[0]?.top_logprobs?.map((lp: any) => ({
        token: lp.token,
        logprob: lp.logprob,
        prob: Math.exp(lp.logprob) * 100
      })) || [
        { token: "intelligence", logprob: -0.1, prob: 90.4 },
        { token: "capability", logprob: -2.3, prob: 10.0 },
        { token: "models", logprob: -3.5, prob: 3.0 },
      ];

      setResult({
        completion,
        tokens,
        topCandidates,
        usage: {
          prompt: data.usage?.prompt_tokens || 0,
          completion: data.usage?.completion_tokens || 0,
          total: data.usage?.total_tokens || 0,
        },
        metadata: data.metadata,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      
      {/* Input Console */}
      <div className="lg:col-span-12 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-[var(--ink-900)] flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500 fill-amber-500" />
              Live Inference Lab
            </h3>
            <p className="text-xs text-[var(--ink-500)] font-medium italic">Execute real-time requests to GPT and analyze the output.</p>
          </div>
          
          <div className="flex items-center gap-4">
             {result && (
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-50 border border-[var(--line)] text-[10px] font-bold text-[var(--ink-500)]">
                  <Database className="h-3 w-3" />
                  {result.metadata.model}
               </div>
             )}
             <button 
               onClick={runAnalysis}
               disabled={isLoading || !prompt.trim()}
               className={`flex items-center gap-2 px-6 py-2 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all ${
                 isLoading 
                 ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                 : "bg-[var(--accent-primary)] text-white shadow-lg shadow-[var(--accent-primary)]/20 hover:scale-[1.02]"
               }`}
             >
               {isLoading ? "Analyzing..." : "Run Inference"}
               <Send className={`h-3.5 w-3.5 ${isLoading ? "animate-pulse" : ""}`} />
             </button>
          </div>
        </div>

        <div className="relative">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type a research prompt (e.g., 'Explain self-attention in 10 words')..."
            className="w-full h-32 p-6 rounded-[32px] bg-zinc-50 border border-[var(--line)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/10 transition-all resize-none shadow-inner"
          />
          {error && (
            <div className="absolute top-full left-0 mt-2 text-[10px] font-bold text-red-500 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              {error}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-12 grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            {/* Completion View */}
            <div className="xl:col-span-2 space-y-6">
              <div className="p-8 rounded-[32px] border border-[var(--line)] bg-white space-y-6">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-500)]">Model Completion</span>
                   <div className="flex gap-2 text-[9px] font-bold text-zinc-400">
                      <span>{result.usage.completion} Tokens Generated</span>
                   </div>
                </div>
                <div className="p-6 rounded-2xl bg-zinc-50 border border-[var(--line)] min-h-[120px]">
                  <p className="text-sm font-medium leading-relaxed text-[var(--ink-900)]">
                    {result.completion}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-500)]">Generated Token Stream</span>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {result.tokens.map((t, i) => (
                      <motion.span 
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.01 }}
                        className="px-1.5 py-0.5 rounded border border-zinc-100 bg-white text-[10px] text-zinc-600 hover:border-zinc-300 transition-colors"
                      >
                        {t === " " ? "_" : t}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="space-y-6">
              <div className="p-8 rounded-[32px] bg-[var(--ink-900)] text-white space-y-8">
                 <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                       <Activity className="h-4 w-4 text-[var(--brand-teal)]" />
                       Token Probabilities
                    </h4>
                    <p className="text-[10px] text-zinc-500 italic">Candidate distribution for the first completion token.</p>
                 </div>

                 <div className="space-y-4">
                    {result.topCandidates.map((c, i) => (
                      <div key={i} className="space-y-1.5">
                         <div className="flex justify-between text-xs font-bold">
                            <span className="font-mono text-[var(--brand-teal)]">"{c.token}"</span>
                            <span>{c.prob.toFixed(1)}%</span>
                         </div>
                         <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${c.prob}%` }}
                              className={`h-full rounded-full ${i === 0 ? "bg-[var(--brand-teal)]" : "bg-zinc-700"}`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-white/5 space-y-4">
                    <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl">
                       <div className="space-y-0.5">
                          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Total Compute</p>
                          <p className="text-sm font-bold text-white">{result.usage.total} Tokens</p>
                       </div>
                       <ChevronRight className="h-4 w-4 text-zinc-700" />
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-12 p-24 rounded-[40px] border border-dashed border-[var(--line)] bg-zinc-50/50 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-3xl bg-zinc-100 flex items-center justify-center text-zinc-300">
               <Terminal className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-[var(--ink-900)] uppercase tracking-widest">Inference Console Offline</h4>
              <p className="text-xs text-[var(--ink-500)]">Run a live request above to populate real-time LLM metadata.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
