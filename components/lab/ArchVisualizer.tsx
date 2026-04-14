"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Layers, Zap, InfoIcon, ChevronRight, Activity, Search } from "lucide-react";

const layers = [
  { id: "input", name: "Input Embeddings", color: "bg-blue-500", description: "Converts tokens into high-dimensional vectors. Captures semantic meaning of words." },
  { id: "pos", name: "Positional Encoding", color: "bg-indigo-500", description: "Adds information about the position of each token in the sequence." },
  { id: "mha", name: "Multi-Head Attention", color: "bg-[var(--accent-primary)]", description: "Allows the model to focus on different parts of the input sequence simultaneously." },
  { id: "norm1", name: "Add & Norm", color: "bg-zinc-400", description: "Residual connection and Layer Normalization for training stability." },
  { id: "ff", name: "Feed Forward", color: "bg-[var(--brand-teal)]", description: "Apply non-linear transformations to each token's representation independently." },
  { id: "norm2", name: "Add & Norm", color: "bg-zinc-400", description: "Final processing before the next block or output layer." },
  { id: "output", name: "Linear & Softmax", color: "bg-green-500", description: "Projects vectors back to vocabulary space and calculates probabilities." },
];

export function ArchVisualizer() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);

  return (
    <div className="flex flex-col lg:flex-row h-[700px]">
      {/* Visual Canvas */}
      <div className="flex-1 bg-zinc-950 relative overflow-hidden flex flex-col items-center justify-center p-12">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-50" />
        
        {/* Connection Lines (Static Background) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <defs>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-primary)" />
              <stop offset="100%" stopColor="var(--brand-teal)" />
            </linearGradient>
          </defs>
          <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="url(#line-grad)" strokeWidth="2" strokeDasharray="4 4" />
        </svg>

        {/* Animated Particles */}
        <AnimatePresence>
           {[...Array(5)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ y: 0, x: "50%", opacity: 0 }}
               animate={{ 
                 y: ["10%", "90%"], 
                 opacity: [0, 1, 1, 0],
                 x: ["48%", "52%", "50%", "49%", "51%"]
               }}
               transition={{ 
                 duration: 4, 
                 repeat: Infinity, 
                 delay: i * 0.8,
                 ease: "linear"
               }}
               className="absolute w-1 h-1 bg-[var(--accent-primary)] rounded-full blur-[1px] z-0"
             />
           ))}
        </AnimatePresence>

        {/* Layers Stack */}
        <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
          {layers.map((layer, index) => (
            <motion.div
              key={layer.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setActiveLayer(layer.id)}
              onClick={() => setActiveLayer(layer.id)}
              className={`group relative cursor-pointer px-6 py-4 rounded-2xl border transition-all duration-300 ${
                activeLayer === layer.id 
                  ? "bg-zinc-900 border-[var(--accent-primary)] shadow-[0_0_20px_rgba(147,51,234,0.3)] scale-105" 
                  : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${layer.color} text-white shadow-sm`}>
                    <Layers className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)]">Layer {index + 1}</p>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">{layer.name}</h3>
                  </div>
                </div>
                <div className={`p-1.5 rounded-full transition-colors ${activeLayer === layer.id ? "bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]" : "text-zinc-600 group-hover:text-zinc-400"}`}>
                  <Activity className="h-4 w-4" />
                </div>
              </div>

              {/* Interaction Hint */}
              {activeLayer === layer.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute -left-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--accent-primary)] rounded-full shadow-[0_0_10px_var(--accent-primary)]" 
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-full lg:w-80 border-l border-zinc-200 bg-white p-8 flex flex-col justify-between">
        <AnimatePresence mode="wait">
          {activeLayer ? (
            <motion.div
              key={activeLayer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-primary)]">Module Deep Dive</p>
                <h3 className="text-2xl font-bold tracking-tight text-[var(--ink-900)]">{layers.find(l => l.id === activeLayer)?.name}</h3>
              </div>
              
              <div className="p-4 rounded-2xl bg-zinc-50 border border-[var(--line)] text-sm text-[var(--ink-500)] leading-relaxed italic">
                "{layers.find(l => l.id === activeLayer)?.description}"
              </div>

              <div className="space-y-4 pt-4 border-t border-[var(--line)]">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-md bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-tight text-[var(--ink-900)]">Complexity</h4>
                    <p className="text-xs text-[var(--ink-500)]">O(n² · d) for Attention layers, where n is sequence length.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-md bg-blue-500/10 text-blue-600">
                    <InfoIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-tight text-[var(--ink-900)]">Key Parameters</h4>
                    <p className="text-xs text-[var(--ink-500)]">Dimension (d_model), Heads (h), and Hidden Dimension (d_ff).</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center">
                <Search className="h-8 w-8 text-zinc-300" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 uppercase tracking-widest">Select a Layer</p>
                <p className="text-xs text-zinc-400 mt-1">Insights will appear here</p>
              </div>
            </div>
          )}
        </AnimatePresence>

        <div className="pt-8 border-t border-[var(--line)]">
          <button className="w-full flex items-center justify-between px-4 py-3 bg-[var(--ink-900)] text-white rounded-xl text-xs font-bold uppercase tracking-widest group hover:bg-[var(--accent-primary)] transition-colors">
            View Paper
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
