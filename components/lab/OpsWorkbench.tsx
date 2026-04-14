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
  Info,
  Hash
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
    <div className="border border-white/5 bg-black/40 overflow-hidden shadow-2xl [font-family:var(--font-console-mono),ui-monospace,monospace]">
      <div className="p-8 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/[0.02]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-[var(--brand-teal)] animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Financial_Telemetry_Node</p>
          </div>
          <h3 className="text-xl font-black tracking-tight text-white flex items-center gap-2 uppercase italic">
            Infrastructure & Ops
          </h3>
        </div>
        <div className="px-5 py-2 border border-white/10 bg-white/5 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
           System: Verified
        </div>
      </div>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Configuration */}
         <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4 text-left">
               <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Target_Model_Logic</label>
               <div className="grid grid-cols-1 gap-2">
                 {modelSpecs.map((m) => (
                   <button
                     key={m.name}
                     onClick={() => setSelectedModel(m)}
                     className={`flex items-center justify-between px-6 py-4 border transition-all ${
                       selectedModel.name === m.name 
                         ? "bg-[var(--accent-primary)] border-[var(--accent-primary)] text-white shadow-[4px_4px_0_rgba(124,92,252,0.2)]" 
                         : "bg-white/[0.02] border-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200"
                     }`}
                   >
                     <span className="text-xs font-black uppercase tracking-widest">{m.name}</span>
                     <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-black opacity-60 italic">
                        <span>${m.pricing}/M</span>
                        <ChevronRight className="h-3 w-3" />
                     </div>
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-4 text-left">
               <div className="flex justify-between items-end">
                 <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Throughput_Volume</label>
                 <div className="text-sm font-black text-white italic">{inputMillions}M_TOKENS</div>
               </div>
               <input 
                 type="range" 
                 min="0.1" 
                 max="100" 
                 step="0.1" 
                 value={inputMillions}
                 onChange={(e) => setInputMillions(parseFloat(e.target.value))}
                 className="w-full h-1 bg-white/10 appearance-none cursor-pointer accent-[var(--accent-primary)]"
               />
            </div>
         </div>

        {/* Results / Visuals */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {/* Financial Cost Card */}
            <div className="p-8 border border-white/5 bg-white/[0.02] flex flex-col justify-between group hover:border-[var(--accent-primary)]/40 transition-all">
               <div className="space-y-6">
                 <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-white group-hover:bg-[var(--accent-primary)] group-hover:border-[var(--accent-primary)] transition-all">
                   <Hash className="h-5 w-5" />
                 </div>
                 <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Financial_TCO</h4>
                   <p className="text-3xl font-black tracking-tighter text-white italic">${costs.financial.toLocaleString()}</p>
                   <p className="text-[9px] font-black text-zinc-600 mt-2 uppercase tracking-widest">EST. OPERATIONAL_EXPENDITURE</p>
                 </div>
               </div>
               <div className="pt-6">
                  <div className="h-1 w-full bg-white/5 overflow-hidden">
                     <motion.div 
                       animate={{ width: `${Math.min(costs.financial / 50, 100)}%` }}
                       className="h-full bg-green-500/50" 
                     />
                  </div>
               </div>
            </div>

            {/* Latency Card */}
            <div className="p-8 border border-[var(--accent-primary)]/20 bg-[var(--accent-primary)]/5 text-white flex flex-col justify-between group relative overflow-hidden shadow-[0_0_30px_rgba(124,92,252,0.1)]">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Clock className="h-20 w-20" />
               </div>
               <div className="space-y-6 relative z-10">
                 <div className="w-10 h-10 border border-[var(--accent-primary)] flex items-center justify-center bg-[var(--accent-primary)] group-hover:shadow-[0_0_15px_rgba(124,92,252,0.5)] transition-all">
                   <Clock className="h-5 w-5" />
                 </div>
                 <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--accent-primary)]/70">Gen_Latency_P99</h4>
                   <p className="text-3xl font-black tracking-tighter text-white italic">{(selectedModel.latency / 1000).toFixed(2)}s_TTFT</p>
                   <p className="text-[9px] font-black text-zinc-500 mt-2 uppercase tracking-widest">Base_Latency: {selectedModel.latency}ms</p>
                 </div>
               </div>
               <div className="pt-6 space-y-2 relative z-10">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                     <span>Node_Speed</span>
                     <span>{selectedModel.tps} TOK/S</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 overflow-hidden">
                     <motion.div 
                       animate={{ width: `${(selectedModel.tps / 120) * 100}%` }}
                       className="h-full bg-[var(--accent-primary)] shadow-[0_0_10px_var(--accent-primary)]" 
                     />
                  </div>
               </div>
            </div>

            {/* Sustainability Card */}
            <div className="p-8 border border-white/5 bg-white/[0.01] flex flex-col justify-between sm:col-span-2 group hover:border-[var(--brand-teal)]/40 transition-all">
               <div className="flex flex-col sm:flex-row justify-between items-start gap-12">
                 <div className="space-y-6 min-w-[240px]">
                   <div className="w-10 h-10 border border-[var(--brand-teal)] flex items-center justify-center group-hover:bg-[var(--brand-teal)] transition-all">
                     <Leaf className="h-5 w-5 text-[var(--brand-teal)] group-hover:text-black transition-all" />
                   </div>
                   <div>
                     <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Eco_Impact_Metric</h4>
                     <p className="text-4xl font-black tracking-tighter text-white italic">{costs.carbon.toFixed(2)}kg_CO2e</p>
                     <p className="text-[9px] font-black text-zinc-600 mt-2 uppercase tracking-widest">MONTHLY_EMISSIONS_DELTA</p>
                   </div>
                 </div>

                 <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    <div className="p-5 border border-white/5 bg-white/[0.02] space-y-2">
                       <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest italic">Eq_Kilometers</p>
                       <p className="text-lg font-black text-zinc-300 italic uppercase tracking-tighter">{Math.floor(costs.carbon / 0.4)}_KM</p>
                    </div>
                    <div className="p-5 border border-white/5 bg-white/[0.02] space-y-2">
                       <p className="text-[9px] font-black uppercase text-zinc-600 tracking-widest italic">Carbon_Offset</p>
                       <p className="text-lg font-black text-zinc-300 italic uppercase tracking-tighter">{Math.ceil(costs.carbon / 2)}_TREES</p>
                    </div>
                 </div>
               </div>
               
               <div className="mt-8 p-4 border border-white/5 bg-white/5 flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full border border-[var(--brand-teal)]/30 flex items-center justify-center shrink-0">
                     <Info className="h-4 w-4 text-[var(--brand-teal)]" />
                  </div>
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest leading-relaxed italic">
                    Node_Calculation: Based on GPU TDP (350W) and local grid intensity averages.
                  </p>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
}
