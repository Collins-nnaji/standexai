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
    <div className="border border-white/5 bg-black/40 overflow-hidden shadow-2xl [font-family:var(--font-console-mono),ui-monospace,monospace]">
      <div className="p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Memory_Buffer_Diagnostics</p>
          </div>
          <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2 uppercase italic">
            Buffer Visualizer
          </h3>
        </div>

        <div className="flex bg-white/5 border border-white/5 p-1 overflow-x-auto max-w-full">
          {windowSizes.map((size) => (
            <button
              key={size.name}
              onClick={() => setSelectedSize(size)}
              className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                selectedSize.name === size.name 
                  ? "bg-white text-black shadow-lg" 
                  : "text-zinc-500 hover:text-zinc-300"
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
            <div className="flex items-center gap-4">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Allocation_Status</span>
               <div className="px-3 py-1 border border-white/5 bg-white/5 text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                  {mockTokenCount.toLocaleString()} / {selectedSize.value.toLocaleString()} TOKENS
               </div>
            </div>
            <span className={`text-sm font-black italic tracking-tighter ${percentage > 90 ? "text-red-500" : "text-[var(--accent-primary)]"}`}>
              {percentage.toFixed(2)}%_LOAD
            </span>
          </div>

          {/* Immersive Buffer Bar */}
          <div className="relative h-24 w-full bg-black border border-white/5 p-4 flex items-center gap-1.5 overflow-hidden group">
             {/* Simulating attention weights with bars */}
             {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ height: "10%" }}
                  animate={{ 
                    height: i < (60 * (percentage / 100)) 
                      ? `${30 + Math.random() * 60}%` 
                      : "10%",
                    opacity: i < (60 * (percentage / 100)) ? 1 : 0.1
                  }}
                  className={`flex-1 ${
                    i < (60 * (percentage / 100)) 
                      ? selectedSize.color 
                      : "bg-zinc-800"
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
             
             {/* Scanline Overlay */}
             <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_2px,3px_100%] opacity-20" />
          </div>
        </div>

        {/* Input & Insights */}
        <div className="lg:col-span-8 space-y-4">
           <p className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em] italic">Buffer_Input_Stream</p>
           <textarea 
             value={inputText}
             onChange={(e) => setInputText(e.target.value)}
             className="w-full h-40 p-6 bg-black border border-white/10 text-zinc-300 text-sm font-mono focus:outline-none focus:border-[var(--accent-primary)]/40 transition-all resize-none shadow-inner selection:bg-[var(--accent-primary)]/20"
             placeholder="SYSTEM_CMD: Input stream to evaluate capacity..."
           />
           <div className="flex items-center gap-3 text-[9px] text-zinc-600 font-black uppercase tracking-widest italic">
             <Info className="h-3 w-3" />
             Metric_ID: Attention_Quadratic_Overhead (SX-99).
           </div>
        </div>

         <div className="lg:col-span-4 space-y-6 text-left">
            <div className="p-8 border border-white/10 bg-zinc-950 text-white space-y-6 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap className="h-20 w-20" />
              </div>
              <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 border-b border-white/10 pb-4 relative z-10">
                Diagnostic_Insight
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed relative z-10 italic">
                Input exceeding context window triggers <span className="text-white font-black italic">FIFO_Truncation</span>. 
                Modern SOTA uses <span className="text-[var(--brand-teal)] font-black italic">KV_Caching</span> for efficient memory addressable space.
              </p>
              <div className="pt-4 space-y-3 relative z-10">
                 <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                   <span className="text-zinc-600">Metric_Complexity</span>
                   <span className="text-zinc-300">O(N²)</span>
                 </div>
                 <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                   <span className="text-zinc-600">Metric_Latency</span>
                   <span className="text-zinc-300">LINEAR_SCALE</span>
                 </div>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
