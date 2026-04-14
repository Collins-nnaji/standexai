"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Map, Crosshair, HelpCircle, Activity, LayoutGrid } from "lucide-react";

interface VectorPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  category: "science" | "nature" | "logic" | "art";
  description: string;
}

const vectorPoints: VectorPoint[] = [
  // Science Cluster
  { id: "1", name: "Quantum", x: 20, y: 30, category: "science", description: "Studies of the very small." },
  { id: "2", name: "Atom", x: 22, y: 32, category: "science", description: "The building block of matter." },
  { id: "3", name: "Gravity", x: 25, y: 28, category: "science", description: "Universal force of attraction." },
  { id: "4", name: "Relativity", x: 18, y: 35, category: "science", description: "Space-time physics." },
  
  // Nature Cluster
  { id: "5", name: "Forest", x: 70, y: 80, category: "nature", description: "Complex ecosystem of trees." },
  { id: "6", name: "River", x: 75, y: 75, category: "nature", description: "Flowing water body." },
  { id: "7", name: "Ecosystem", x: 72, y: 78, category: "nature", description: "Community of living organisms." },
  { id: "8", name: "Ocean", x: 80, y: 85, category: "nature", description: "Abundant salt water body." },

  // Logic Cluster
  { id: "9", name: "Algorithm", x: 20, y: 80, category: "logic", description: "Step-by-step procedure." },
  { id: "10", name: "Function", x: 25, y: 75, category: "logic", description: "Mathematical mapping." },
  { id: "11", name: "Variable", x: 22, y: 82, category: "logic", description: "Place holder for values." },
  { id: "12", name: "Recursion", x: 18, y: 85, category: "logic", description: "Self-referencing logic." },

  // Art Cluster
  { id: "13", name: "Canvas", x: 80, y: 20, category: "art", description: "Surface for painting." },
  { id: "14", name: "Pigment", x: 85, y: 25, category: "art", description: "Coloring material." },
  { id: "15", name: "Symmetry", x: 75, y: 15, category: "art", description: "Balanced proportions." },
  { id: "16", name: "Abstract", x: 82, y: 18, category: "art", description: "Non-representational style." },
];

const categoryColors = {
  science: "bg-blue-500",
  nature: "bg-green-500",
  logic: "bg-[var(--accent-primary)]",
  art: "bg-amber-500",
};

export function VectorExplorer() {
  const [hoveredPoint, setHoveredPoint] = useState<VectorPoint | null>(null);
  const [search, setSearch] = useState("");

  const filteredPoints = useMemo(() => {
    return vectorPoints.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  // Calculate cosine similarity mock
  const neighbors = useMemo(() => {
    if (!hoveredPoint) return [];
    return vectorPoints
      .filter(p => p.id !== hoveredPoint.id)
      .map(p => {
        const dist = Math.sqrt(Math.pow(p.x - hoveredPoint.x, 2) + Math.pow(p.y - hoveredPoint.y, 2));
        return { ...p, similarity: Math.max(0, (100 - dist) / 100) };
      })
      .filter(p => p.similarity > 0.85)
      .sort((a, b) => b.similarity - a.similarity);
  }, [hoveredPoint]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 h-[600px] border border-white/5 overflow-hidden bg-black shadow-2xl [font-family:var(--font-console-mono),ui-monospace,monospace]">
      {/* Sidebar Controls (Cartography Nav) */}
      <div className="lg:col-span-1 border-r border-white/5 bg-white/[0.02] p-6 flex flex-col gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
             <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Cartography_HUD</p>
          </div>
          <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2 uppercase italic">
            Semantic Space
          </h3>
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 transition-colors group-hover:text-[var(--accent-primary)]" />
          <input 
            type="text" 
            placeholder="Search_Vectors..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-black border border-white/5 text-[10px] text-zinc-500 font-black uppercase tracking-widest focus:outline-none focus:border-[var(--accent-primary)]/40 hover:border-white/10 transition-all shadow-inner"
          />
        </div>

        <div className="space-y-4">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Semantic_Clusters</p>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(categoryColors).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                <div className={`w-1.5 h-1.5 ${color}`} />
                {cat}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pt-4 border-t border-white/5">
          <AnimatePresence mode="wait">
            {hoveredPoint ? (
              <motion.div
                key={hoveredPoint.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="p-4 border border-white/5 bg-white/[0.02] space-y-3">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em] italic border-b border-white/5 pb-2">{hoveredPoint.name}</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed font-medium capitalize">{hoveredPoint.description}</p>
                </div>

                {neighbors.length > 0 && (
                  <div className="space-y-3">
                     <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 italic">Nearest_Neighbors</p>
                     <div className="space-y-1">
                       {neighbors.map(n => (
                         <div key={n.id} className="flex items-center justify-between text-[10px] font-black text-zinc-500 bg-white/5 p-2 border border-white/5 uppercase tracking-tighter">
                            <span className="italic">{n.name}</span>
                            <span className="text-[var(--brand-teal)]">{(n.similarity * 100).toFixed(0)}%_SIM</span>
                         </div>
                       ))}
                     </div>
                  </div>
                )}
              </motion.div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-20">
                 <Crosshair className="h-6 w-6 text-zinc-500 mb-3" />
                 <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Initialising scan...</p>
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Starfield (Cartography Projection) */}
      <div className="lg:col-span-3 bg-black relative overflow-hidden flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,92,252,0.05),transparent_100%)] pointer-events-none z-0" />
        
        {/* Connection Lines for Neighbors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {hoveredPoint && neighbors.map(n => (
            <motion.line
              key={n.id}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.3 }}
              x1={`${hoveredPoint.x}%`}
              y1={`${hoveredPoint.y}%`}
              x2={`${n.x}%`}
              y2={`${n.y}%`}
              stroke="var(--accent-primary)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}
        </svg>

        {/* Vector Points */}
        <div className="w-full h-full relative">
          {vectorPoints.map(point => (
            <motion.div
              key={point.id}
              layoutId={point.id}
              initial={{ scale: 0 }}
              animate={{ 
                scale: filteredPoints.some(p => p.id === point.id) ? 1 : 0.5,
                opacity: filteredPoints.some(p => p.id === point.id) ? 1 : 0.1
              }}
              style={{ 
                left: `${point.x}%`, 
                top: `${point.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredPoint(point)}
              className={`absolute group cursor-pointer z-10 transition-all duration-300`}
            >
              <div className={`relative w-3 h-3 rounded-full ${categoryColors[point.category]} border-2 border-zinc-950 shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:scale-150 transition-transform`}>
                {hoveredPoint?.id === point.id && (
                  <motion.div 
                    layoutId="pulse"
                    className={`absolute inset-0 rounded-full ${categoryColors[point.category]} animate-ping opacity-50`}
                  />
                )}
              </div>
              
              <AnimatePresence>
                {(hoveredPoint?.id === point.id || filteredPoints.length === 1) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: -24 }}
                    className="absolute whitespace-nowrap px-2 py-1 bg-zinc-900 text-white text-[10px] font-bold rounded-md border border-zinc-800 shadow-xl pointer-events-none"
                  >
                    {point.name}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* HUD Elements */}
        <div className="absolute bottom-6 right-6 flex items-center gap-4">
           <div className="flex items-center gap-3 px-4 py-2 bg-black border border-white/10 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 shadow-2xl">
             <Activity className="h-3 w-3 text-[var(--brand-teal)]" />
             DIM: 1536_NRML
           </div>
           <div className="p-2 border border-white/10 bg-black text-zinc-700 hover:text-[var(--accent-primary)] hover:border-[var(--accent-primary)] cursor-help transition-all shadow-2xl">
              <HelpCircle className="h-4 w-4" />
           </div>
        </div>
      </div>
    </div>
  );
}
