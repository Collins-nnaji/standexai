"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Users, Sparkles, CheckCircle2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

const RESEARCHERS = [
  { name: "Dr. Aris Chen", role: "LLM Safety", match: "98%", initial: "AC" },
  { name: "Prof. Sarah Jensen", role: "Vision/Transformer", match: "95%", initial: "SJ" },
  { name: "Dr. Liam O'Connell", role: "Model Optimization", match: "91%", initial: "LO" },
];

export function HeroGraphic() {
  const [activeNode, setActiveNode] = useState(0);
  const [nodes, setNodes] = useState<{ top: string; left: string; x: number[]; y: number[] }[]>([]);

  useEffect(() => {
    // Generate random positions only on the client to avoid hydration mismatch
    const generatedNodes = [...Array(6)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      x: [0, Math.random() * 20 - 10, 0],
      y: [0, Math.random() * 20 - 10, 0]
    }));
    setNodes(generatedNodes);

    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % RESEARCHERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-visible select-none pointer-events-none">
      {/* Background Deep Signal Nodes */}
      <div className="absolute inset-0 z-0">
        {nodes.map((node, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
              x: node.x,
              y: node.y
            }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
            className="absolute h-2 w-2 rounded-full bg-[#7C5CFC]/30 shadow-[0_0_15px_#7C5CFC]"
            style={{
              top: node.top,
              left: node.left,
            }}
          />
        ))}
      </div>

      {/* Connection Beams (Paths) */}
      <svg className="absolute inset-0 h-full w-full z-10 overflow-visible">
         <defs>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0" />
               <stop offset="50%" stopColor="#7C5CFC" stopOpacity="0.6" />
               <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0" />
            </linearGradient>
         </defs>
         
         <AnimatePresence mode="wait">
            <motion.path
               key={activeNode}
               initial={{ pathLength: 0, opacity: 0 }}
               animate={{ pathLength: 1, opacity: 1 }}
               exit={{ opacity: 0 }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               d={`M 50% 50% L ${activeNode === 0 ? "80%" : activeNode === 1 ? "75%" : "85%"} ${activeNode === 0 ? "20%" : activeNode === 1 ? "40%" : "70%"}`}
               stroke="url(#beamGradient)"
               strokeWidth="2"
               fill="transparent"
               className="translate-x-[-50%] translate-y-[-50%]"
            />
         </AnimatePresence>
      </svg>

      {/* Main Project Brief Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative z-20 w-full max-w-[340px] rounded-[32px] border border-white/20 bg-white/10 p-6 backdrop-blur-3xl shadow-[0_32px_128px_rgba(0,0,0,0.15)] ring-1 ring-white/10"
      >
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
           <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7C5CFC]/20 text-[#7C5CFC]">
                 <Terminal className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Technical Brief</p>
           </div>
           <Zap className="h-4 w-4 text-emerald-500 fill-emerald-500 animate-pulse" />
        </div>

        <div className="space-y-4">
           <div>
              <h3 className="font-syne text-lg font-black text-white leading-tight">Quantum Neural Architectures</h3>
              <p className="mt-1 text-[11px] text-zinc-400">Next-gen systems via Sparse Autoencoders</p>
           </div>

           <div className="space-y-2">
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 2, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#7C5CFC] to-blue-500" 
                 />
              </div>
              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
                 <span>Data Readiness</span>
                 <span className="text-[#7C5CFC]">85%</span>
              </div>
           </div>

           <div className="rounded-2xl bg-white/5 p-3 border border-white/5">
              <div className="flex items-center gap-3">
                 <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#7C5CFC]">Verified Objective</p>
                    <p className="text-[10px] font-bold text-white">Impact: 1,240 Signals</p>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>

      {/* Satelite Researcher Nodes */}
      <div className="absolute inset-0 z-30">
        {RESEARCHERS.map((res, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: activeNode === i ? [0, -5, 0] : 0
            }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.2 }}
            className={cn(
               "absolute rounded-3xl border p-4 backdrop-blur-2xl transition-all duration-500",
               activeNode === i 
                 ? "border-[#7C5CFC]/40 bg-[#7C5CFC]/10 shadow-[0_15px_45px_rgba(124,92,252,0.2)] scale-110" 
                 : "border-white/10 bg-white/5 opacity-60"
            )}
            style={{
              top: i === 0 ? "15%" : i === 1 ? "45%" : "75%",
              right: i === 0 ? "5%" : i === 1 ? "0%" : "8%",
            }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full text-xs font-black ring-2",
                activeNode === i ? "bg-[#7C5CFC] text-white ring-[#7C5CFC]/30" : "bg-white/10 text-zinc-400 ring-white/10"
              )}>
                {res.initial}
              </div>
              <div className="max-w-[120px]">
                <p className="text-[10px] font-black text-white truncate">{res.name}</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">{res.role}</p>
                {activeNode === i && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-1 text-[9px] font-black text-[#7C5CFC]"
                  >
                    {res.match} Match
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
