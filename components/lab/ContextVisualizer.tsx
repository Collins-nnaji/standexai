"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Info, Zap } from "lucide-react";

const windowSizes = [
  { name: "32K (Standard)", value: 32000, color: "bg-blue-500" },
  { name: "128K (GPT-4 Turbo)", value: 128000, color: "bg-[var(--accent-primary)]" },
  { name: "200K (Claude 3)", value: 200000, color: "bg-amber-500" },
  { name: "1M+ (Gemini 1.5)", value: 1000000, color: "bg-[var(--brand-teal)]" },
];

export function ContextVisualizer() {
  const [selectedSize, setSelectedSize] = useState(windowSizes[1]);
  const [inputText, setInputText] = useState("In the early days of transformers, context was limited. Now, we handle millions of tokens...");
  
  const mockTokenCount = useMemo(() => {
    return Math.floor(inputText.length / 3) + 120; // Mock count
  }, [inputText]);

  const percentage = Math.min((mockTokenCount / selectedSize.value) * 100, 100);

  return (
    <div className="rounded-[32px] border border-[var(--line)] bg-white overflow-hidden shadow-sm">
      <div className="p-8 border-b border-[var(--line)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-50/30">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-[var(--ink-900)] flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[var(--accent-primary)]" />
            Context Memory Visualizer
          </h3>
          <p className="text-xs text-[var(--ink-500)] font-medium italic">Simulating how the Attention mechanism manages 'memory'.</p>
        </div>

        <div className="flex bg-zinc-100 p-1 rounded-2xl overflow-x-auto max-w-full">
          {windowSizes.map((size) => (
            <button
              key={size.name}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                selectedSize.name === size.name 
                  ? "bg-white text-[var(--accent-primary)] shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              {size.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Memory Buffer Visualization */}
        <div className="lg:col-span-12 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold uppercase text-[var(--ink-500)]">Memory Utilization</span>
               <div className="px-2 py-0.5 rounded-full bg-zinc-100 border border-[var(--line)] text-[9px] font-bold text-[var(--ink-500)]">
                  {mockTokenCount.toLocaleString()} / {selectedSize.value.toLocaleString()} Tokens
               </div>
            </div>
            <span className={`text-sm font-bold ${percentage > 90 ? "text-red-500" : "text-[var(--accent-primary)]"}`}>
              {percentage.toFixed(2)}% Used
            </span>
          </div>

          {/* Immersive Buffer Bar */}
          <div className="relative h-24 w-full bg-zinc-50 rounded-[24px] border border-[var(--line)] p-2 flex items-center gap-1 overflow-hidden group">
             {/* Simulating attention weights with bars */}
             {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: "10%" }}
                  animate={{ 
                    height: i < (60 * (percentage / 100)) 
                      ? `${30 + Math.random() * 60}%` 
                      : "10%",
                    opacity: i < (60 * (percentage / 100)) ? 1 : 0.2
                  }}
                  className={`flex-1 rounded-sm ${
                    i < (60 * (percentage / 100)) 
                      ? selectedSize.color 
                      : "bg-zinc-200"
                  }`}
                  transition={{ 
                    duration: 0.5, 
                    delay: i * 0.01,
                    repeat: i < (60 * (percentage / 100)) ? Infinity : 0,
                    repeatType: "reverse",
                    repeatDelay: Math.random() * 2
                  }}
                />
             ))}
             
             {/* Gradient Overlay */}
             <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-white/10" />
          </div>
        </div>

        {/* Input & Insights */}
        <div className="lg:col-span-8 space-y-4">
           <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Simulation Text</p>
           <textarea 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             className="w-full h-40 p-6 rounded-3xl bg-zinc-50 border border-[var(--line)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/10 transition-all resize-none shadow-inner"
             placeholder="Type or paste a long document to see how context is managed..."
           />
           <div className="flex items-center gap-2 text-[10px] text-zinc-400">
             <Info className="h-3 w-3" />
             The Attention mechanism's memory cost grows quadratically or linearly depending on the architecture (e.g., Sparse Attention).
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6 text-left">
           <div className="p-6 rounded-3xl bg-[var(--ink-900)] text-white space-y-4 shadow-xl">
             <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
               <Zap className="h-4 w-4 text-amber-500" />
               Technical Insight
             </h4>
             <p className="text-xs text-zinc-400 leading-relaxed">
               When the input exceeds the context window, models usually "forget" or "truncate" early tokens. 
               Advanced models use <span className="text-white font-bold italic">KV Caching</span> to keep inference fast even at 100k+ tokens.
             </p>
             <div className="pt-4 border-t border-white/5 space-y-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-500 uppercase font-bold">Complexity</span>
                  <span className="text-zinc-100">O(N²)</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-zinc-500 uppercase font-bold">Latency</span>
                  <span className="text-zinc-100">Increases with N</span>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
