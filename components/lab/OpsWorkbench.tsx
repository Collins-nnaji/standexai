"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  Cpu, 
  Zap, 
  Clock, 
  Leaf, 
  ChevronRight, 
  Info
} from "lucide-react";

const modelSpecs = [
  { name: "GPT-4o", pricing: 5.0, latency: 150, tps: 80, co2: 1.2 },
  { name: "Claude 3.5", pricing: 3.0, latency: 180, tps: 70, co2: 0.9 },
  { name: "Gemini 1.5 Pro", pricing: 3.5, latency: 200, tps: 65, co2: 1.1 },
  { name: "Llama 3 70B", pricing: 0.6, latency: 250, tps: 40, co2: 0.8 },
  { name: "GPT-3.5 Turbo", pricing: 0.5, latency: 100, tps: 120, co2: 0.4 },
];

export function OpsWorkbench() {
  const [selectedModel, setSelectedModel] = useState(modelSpecs[0]);
  const [inputMillions, setInputMillions] = useState(1);

  const costs = useMemo(() => {
    return {
      financial: inputMillions * selectedModel.pricing,
      latencyTotal: selectedModel.latency + (1000 / selectedModel.tps) * 1000,
      carbon: inputMillions * selectedModel.co2,
    };
  }, [selectedModel, inputMillions]);

  return (
    <div className="rounded-[32px] border border-[var(--line)] bg-white overflow-hidden shadow-sm">
      <div className="p-8 border-b border-[var(--line)] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-zinc-50/50">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-[var(--ink-900)] flex items-center gap-2">
            <Cpu className="h-5 w-5 text-[var(--brand-teal)]" />
            Infrastructure & Ops Workbench
          </h3>
          <p className="text-xs text-[var(--ink-500)] font-medium italic">Calculating the real-world cost of intelligence.</p>
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Configuration */}
        <div className="lg:col-span-5 space-y-8">
           <div className="space-y-4 text-left">
              <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-500)]">Select Production Model</label>
              <div className="grid grid-cols-1 gap-2">
                {modelSpecs.map((m) => (
                  <button
                    key={m.name}
                    onClick={() => setSelectedModel(m)}
                    className={`flex items-center justify-between px-6 py-4 rounded-2xl border transition-all ${
                      selectedModel.name === m.name 
                        ? "bg-[var(--accent-primary)]/10 border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-sm" 
                        : "bg-white border-[var(--line)] text-[var(--ink-500)] hover:border-zinc-300 hover:text-[var(--ink-900)]"
                    }`}
                  >
                    <span className="text-sm font-bold">{m.name}</span>
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold opacity-60">
                       <span>${m.pricing}/M</span>
                       <ChevronRight className="h-3 w-3" />
                    </div>
                  </button>
                ))}
              </div>
           </div>

           <div className="space-y-4 text-left">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-500)]">Monthly Volume (Tokens)</label>
                <div className="text-sm font-bold text-[var(--ink-900)]">{inputMillions}M Tokens</div>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="100" 
                step="0.1" 
                value={inputMillions}
                onChange={(e) => setInputMillions(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-[var(--accent-primary)]"
              />
           </div>
        </div>

        {/* Results / Visuals */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
           {/* Financial Cost Card */}
           <div className="p-8 rounded-[32px] bg-white border border-[var(--line)] shadow-sm flex flex-col justify-between group hover:border-[var(--accent-primary)]/20 transition-all">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--ink-900)] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-500)]">Financial Impact</h4>
                  <p className="text-3xl font-bold tracking-tight text-[var(--ink-900)]">${costs.financial.toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-[var(--ink-500)] mt-1 tracking-wider">EST. MONTHLY OPEX</p>
                </div>
              </div>
              <div className="pt-6">
                 <div className="h-1.5 w-full bg-zinc-50 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${Math.min(costs.financial / 50, 100)}%` }}
                      className="h-full bg-green-500 rounded-full" 
                    />
                 </div>
              </div>
           </div>

           {/* Latency Card */}
           <div className="p-8 rounded-[32px] bg-[var(--ink-900)] text-white shadow-xl flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary)] flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)] group-hover:rotate-12 transition-transform">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Avg. Generation Time</h4>
                  <p className="text-3xl font-bold tracking-tight text-white">{(selectedModel.latency / 1000).toFixed(2)}s</p>
                  <p className="text-[10px] font-bold text-zinc-500 mt-1 tracking-wider">TTFT: {selectedModel.latency}ms</p>
                </div>
              </div>
              <div className="pt-6 space-y-2">
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <span>TPS (Speed)</span>
                    <span>{selectedModel.tps} tok/s</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: `${(selectedModel.tps / 120) * 100}%` }}
                      className="h-full bg-[var(--accent-primary)] rounded-full" 
                    />
                 </div>
              </div>
           </div>

           {/* Sustainability Card */}
           <div className="p-8 rounded-[32px] bg-white border border-[var(--line)] shadow-sm flex flex-col justify-between sm:col-span-2 group hover:border-[var(--brand-teal)]/20 transition-all">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
                <div className="space-y-4 min-w-[200px]">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--brand-teal)] text-white flex items-center justify-center shadow-lg group-hover:translate-y-[-4px] transition-transform">
                    <Leaf className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-500)]">Carbon Footprint</h4>
                    <p className="text-3xl font-bold tracking-tight text-[var(--ink-900)]">{costs.carbon.toFixed(2)}kg CO2e</p>
                    <p className="text-[10px] font-bold text-[var(--ink-500)] mt-1 tracking-wider">ESTIMATED EMISSIONS PER MONTH</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                   <div className="p-4 rounded-2xl bg-zinc-50 border border-[var(--line)] space-y-1">
                      <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">Equivalent to</p>
                      <p className="text-sm font-bold text-[var(--ink-900)]">{Math.floor(costs.carbon / 0.4)} km driven</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-zinc-50 border border-[var(--line)] space-y-1">
                      <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-wider">Trees to offset</p>
                      <p className="text-sm font-bold text-[var(--ink-900)]">{Math.ceil(costs.carbon / 2)} adult trees</p>
                   </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 rounded-2xl bg-[var(--brand-teal)]/5 border border-[var(--brand-teal)]/10 flex items-center gap-3">
                 <Info className="h-4 w-4 text-[var(--brand-teal)] shrink-0" />
                 <p className="text-[10px] text-[var(--ink-500)] font-medium leading-relaxed">Calculation based on GPU thermal design power (TDP) and regional energy grid carbon intensity averages.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
