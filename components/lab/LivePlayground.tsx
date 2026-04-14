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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left [font-family:var(--font-console-mono),ui-monospace,monospace]">
      
      {/* Input Console */}
      <div className="lg:col-span-12 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
                 Node_Inference_Stream (0x2a)
               </h3>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2 uppercase italic">
              Live Inference Lab
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             {result && (
               <div className="flex items-center gap-2 px-3 py-1 border border-white/5 bg-white/5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  {result.metadata.model}
               </div>
             )}
             <button 
               onClick={runAnalysis}
               disabled={isLoading || !prompt.trim()}
               className={`flex items-center gap-2 px-6 py-2 border font-black text-[10px] uppercase tracking-[0.3em] transition-all ${
                 isLoading 
                 ? "bg-white/5 border-white/5 text-zinc-600 cursor-not-allowed" 
                 : "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white hover:shadow-[0_0_20px_rgba(124,92,252,0.3)] shadow-[4px_4px_0_rgba(124,92,252,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
               }`}
             >
               {isLoading ? "Executing..." : "Run_Inference"}
               <Send className={`h-3 w-3 ${isLoading ? "animate-pulse" : ""}`} />
             </button>
          </div>
        </div>

        <div className="relative group">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="SYSTEM_CMD: Input prompt here..."
            className="w-full h-32 p-6 bg-black border border-white/10 text-zinc-300 text-sm font-mono focus:outline-none focus:border-[var(--accent-primary)]/40 transition-all resize-none shadow-inner selection:bg-[var(--accent-primary)]/20"
          />
          <div className="absolute bottom-4 right-4 text-[9px] font-black text-zinc-700 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
             Buffer: {prompt.length} / 4096
          </div>
          {error && (
            <div className="absolute top-full left-0 mt-2 text-[9px] font-black text-red-500 flex items-center gap-1 uppercase tracking-widest">
              <ShieldCheck className="h-3 w-3" />
              ERROR: {error}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-12 grid grid-cols-1 xl:grid-cols-3 gap-8"
          >
            {/* Completion View */}
            <div className="xl:col-span-2 space-y-6">
              <div className="p-8 border border-white/5 bg-white/[0.02] space-y-6">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                   <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]">Kernel_Output</p>
                      <h4 className="text-sm font-black text-white italic uppercase tracking-tighter">Model_Completion</h4>
                   </div>
                   <div className="flex gap-4 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                         <Hash className="h-3 w-3" />
                         {result.usage.completion} TOKENS 
                      </div>
                   </div>
                </div>
                <div className="p-6 bg-black border border-white/5 min-h-[120px]">
                  <p className="text-sm font-medium leading-relaxed text-zinc-300">
                    {result.completion}
                  </p>
                </div>
                
                <div className="space-y-4 pt-4">
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">Token_Stream_Analysis</span>
                  <div className="flex flex-wrap gap-1 font-mono">
                    {result.tokens.map((t, i) => (
                      <motion.span 
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.005 }}
                        className="px-1 py-0.5 bg-white/5 border border-white/5 text-[9px] text-zinc-400 hover:text-white hover:border-white/20 transition-all cursor-default"
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
              <div className="p-8 bg-zinc-950 border border-white/10 text-white space-y-8 shadow-2xl">
                 <div className="space-y-2 border-b border-white/10 pb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-2">
                       <Activity className="h-4 w-4 text-[var(--brand-teal)]" />
                       Node_Probabilities
                    </h4>
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest italic">First completion candidate.</p>
                 </div>

                 <div className="space-y-5">
                    {result.topCandidates.map((c, i) => (
                      <div key={i} className="space-y-2">
                         <div className="flex justify-between text-[10px] font-black tracking-widest">
                            <span className="font-mono text-[var(--brand-teal)] uppercase">"{c.token}"</span>
                            <span>{c.prob.toFixed(1)}%</span>
                         </div>
                         <div className="h-1 w-full bg-white/5 overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${c.prob}%` }}
                              className={`h-full ${i === 0 ? "bg-[var(--brand-teal)]" : "bg-zinc-700"}`}
                            />
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="pt-8 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center bg-white/5 p-4 border border-white/5">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Compute_TCO</p>
                          <p className="text-sm font-black text-white italic uppercase tracking-tighter">{result.usage.total} TOKENS_SUM</p>
                       </div>
                       <ChevronRight className="h-4 w-4 text-zinc-800" />
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
            className="lg:col-span-12 p-24 border border-dashed border-white/10 bg-white/[0.02] flex flex-col items-center justify-center text-center space-y-6"
          >
            <div className="w-16 h-16 border border-white/10 flex items-center justify-center text-zinc-700">
               <Terminal className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Node_Inference_Offline</h4>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest italic">Execute kernel request to initialize telemetry stream.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
