"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sliders, Hash, Info, Zap } from "lucide-react";

export function ModelSimulator() {
  const [inputText, setInputText] = useState("Artificial Intelligence is transforming how we build software.");
  const [temperature, setTemperature] = useState(0.7);

  // Mock tokenization
  const tokens = useMemo(() => {
    const words = inputText.split(" ");
    return words.flatMap((w) => {
      if (w.length > 7) {
        return [w.slice(0, 4), w.slice(4)]; // Mock subword splitting
      }
      return [w];
    });
  }, [inputText]);

  const candidates = [
    { word: "intelligence", baseProb: 0.45 },
    { word: "models", baseProb: 0.25 },
    { word: "agents", baseProb: 0.15 },
    { word: "networks", baseProb: 0.10 },
    { word: "systems", baseProb: 0.05 },
  ];

  const adjustedCandidates = useMemo(() => {
    const logits = candidates.map(c => Math.log(c.baseProb) / (temperature + 0.1));
    const maxLogit = Math.max(...logits);
    const exps = logits.map(l => Math.exp(l - maxLogit));
    const sumExps = exps.reduce((a, b) => a + b, 0);
    const probs = exps.map(e => (e / sumExps) * 100);
    
    return candidates.map((c, i) => ({ ...c, prob: probs[i] }));
  }, [temperature]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
      
      {/* 1. Tokenizer Lab */}
      <div className="rounded-[32px] border border-[var(--line)] bg-white p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-[var(--ink-900)] flex items-center gap-2">
              <Hash className="h-5 w-5 text-[var(--accent-primary)]" />
              Tokenization
            </h3>
            <p className="text-xs text-[var(--ink-500)] font-medium italic">How the model sees your text.</p>
          </div>
          <div className="px-3 py-1 bg-[var(--accent-primary)]/5 text-[var(--accent-primary)] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[var(--accent-primary)]/10">
            {tokens.length} Tokens
          </div>
        </div>

        <textarea 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type something..."
          className="w-full h-32 p-4 rounded-2xl bg-zinc-50 border border-[var(--line)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/10 transition-all resize-none shadow-inner"
        />

        <div className="flex flex-wrap gap-2">
          {tokens.map((token, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.02 }}
              className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold border ${
                i % 2 === 0 
                  ? "bg-blue-50 border-blue-100 text-blue-600 shadow-sm" 
                  : "bg-[var(--accent-primary)]/5 border-[var(--accent-primary)]/10 text-[var(--accent-primary)] shadow-sm"
              }`}
            >
              {token}
            </motion.span>
          ))}
        </div>
      </div>

      {/* 2. Sampling Lab */}
      <div className="rounded-[32px] border border-[var(--line)] bg-white p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold tracking-tight text-[var(--ink-900)] flex items-center gap-2">
              <Sliders className="h-5 w-5 text-[var(--brand-teal)]" />
              Inference Sampling
            </h3>
            <p className="text-xs text-[var(--ink-500)] font-medium italic">Adjusting output randomness.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-500)] flex items-center gap-1">
                Temperature
              </label>
              <span className="text-sm font-bold text-[var(--accent-primary)]">{temperature.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.01" 
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
            />
            <div className="flex justify-between text-[10px] font-bold text-zinc-400 tracking-wider">
              <span>DETERMINISTIC</span>
              <span>CREATIVE / RANDOM</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-500)]">Next Token Probability</p>
              <Zap className="h-3 w-3 text-amber-500" />
            </div>
            <div className="space-y-3">
              {adjustedCandidates.map((c, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[var(--ink-500)] font-mono">"{c.word}"</span>
                    <span className="text-[var(--ink-900)]">{c.prob.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${c.prob}%` }}
                      className={`h-full rounded-full ${i === 0 ? "bg-[var(--accent-primary)]" : "bg-zinc-300"}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 rounded-xl bg-zinc-50 border border-[var(--line)] flex items-start gap-3">
            <Info className="h-4 w-4 text-[var(--ink-500)] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[var(--ink-500)] leading-relaxed font-medium">Temperature scales the logits before Softmax. Higher values create a 'flatter' distribution, leading to more varied completions.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
