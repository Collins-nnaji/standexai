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
    <div className="grid grid-cols-1 lg:grid-cols-4 h-[600px] border border-[var(--line)] rounded-[32px] overflow-hidden bg-white shadow-sm">
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 border-r border-[var(--line)] bg-zinc-50/50 p-6 flex flex-col gap-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold tracking-tight text-[var(--ink-900)] flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-[var(--accent-primary)]" />
            Vector Space
          </h3>
          <p className="text-xs text-[var(--ink-500)] font-medium">Visualizing semantic clusters.</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search vectors..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[var(--line)] rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all shadow-sm"
          />
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Semantic Clusters</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(categoryColors).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 capitalize">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                {cat}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pt-4 border-t border-[var(--line)]">
          <AnimatePresence mode="wait">
            {hoveredPoint ? (
              <motion.div
                key={hoveredPoint.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-4"
              >
                <div className="p-4 rounded-2xl bg-white border border-[var(--line)] shadow-sm space-y-2">
                  <h4 className="text-sm font-bold text-[var(--ink-900)] uppercase tracking-wider">{hoveredPoint.name}</h4>
                  <p className="text-xs text-[var(--ink-500)] leading-relaxed">{hoveredPoint.description}</p>
                </div>

                {neighbors.length > 0 && (
                  <div className="space-y-2">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Nearest Neighbors</p>
                     <div className="space-y-1">
                       {neighbors.map(n => (
                         <div key={n.id} className="flex items-center justify-between text-[11px] font-bold text-zinc-600 bg-white/50 p-2 rounded-lg border border-[var(--line)]">
                            <span>{n.name}</span>
                            <span className="text-[var(--accent-primary)]">{(n.similarity * 100).toFixed(0)}% sim</span>
                         </div>
                       ))}
                     </div>
                  </div>
                )}
              </motion.div>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50 grayscale">
                 <Crosshair className="h-8 w-8 text-zinc-300 mb-2" />
                 <p className="text-[10px] font-bold uppercase text-zinc-400">Hover a point to explore</p>
               </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Starfield */}
      <div className="lg:col-span-3 bg-zinc-950 relative overflow-hidden flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-50" />
        
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
           <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 backdrop-blur-md rounded-full border border-zinc-800 text-[10px] font-bold uppercase text-zinc-400">
             <Activity className="h-3 w-3 text-[var(--brand-teal)]" />
             Dimensions: 1536 (Normalized)
           </div>
           <div className="p-2 bg-zinc-900/80 backdrop-blur-md rounded-xl border border-zinc-800 text-zinc-400 hover:text-white cursor-help transition-colors">
              <HelpCircle className="h-4 w-4" />
           </div>
        </div>
      </div>
    </div>
  );
}
