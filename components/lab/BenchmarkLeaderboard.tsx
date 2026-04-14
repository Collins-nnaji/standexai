"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from "recharts";
import { Filter, Info, TrendingUp } from "lucide-react";

const benchmarkData = {
  mmlu: [
    { name: "GPT-4o", score: 88.7, color: "var(--accent-primary)" },
    { name: "Claude 3.5 Sonnet", score: 88.7, color: "var(--brand-teal)" },
    { name: "Gemini 1.5 Pro", score: 85.9, color: "#3b82f6" },
    { name: "Llama 3 70B", score: 82.0, color: "#06b6d4" },
    { name: "GPT-4 (Original)", score: 86.4, color: "#a1a1aa" },
  ],
  gsm8k: [
    { name: "GPT-4o", score: 92.0, color: "var(--accent-primary)" },
    { name: "Claude 3.5 Sonnet", score: 92.0, color: "var(--brand-teal)" },
    { name: "Gemini 1.5 Pro", score: 91.7, color: "#3b82f6" },
    { name: "Llama 3 70B", score: 82.9, color: "#06b6d4" },
    { name: "GPT-4 (Original)", score: 92.0, color: "#a1a1aa" },
  ],
  humaneval: [
    { name: "GPT-4o", score: 90.2, score_pct: 90.2, color: "var(--accent-primary)" },
    { name: "Claude 3.5 Sonnet", score: 92.0, score_pct: 92.0, color: "var(--brand-teal)" },
    { name: "Gemini 1.5 Pro", score: 84.1, score_pct: 84.1, color: "#3b82f6" },
    { name: "Llama 3 70B", score: 81.7, score_pct: 81.7, color: "#06b6d4" },
    { name: "GPT-4 (Original)", score: 67.0, score_pct: 67.0, color: "#a1a1aa" },
  ]
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-white/10 p-4 shadow-2xl [font-family:var(--font-console-mono),ui-monospace,monospace]">
        <p className="text-[9px] font-black uppercase text-zinc-500 mb-1 tracking-widest leading-none">{label}</p>
        <div className="flex items-center gap-2">
           <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
           <p className="text-sm font-black text-white italic">
             RESULT: {payload[0].value}%
           </p>
        </div>
      </div>
    );
  }
  return null;
};

export function BenchmarkLeaderboard() {
  const [metric, setMetric] = useState<keyof typeof benchmarkData>("mmlu");

  return (
    <div className="h-full flex flex-col space-y-8 [font-family:var(--font-console-mono),ui-monospace,monospace]">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
           <div className="h-2 w-2 bg-[var(--accent-primary)] animate-pulse" />
           <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">SOTA_LEADERBOARD_STREAM</span>
        </div>
        
        <div className="flex bg-white/5 border border-white/5 p-1">
          {(Object.keys(benchmarkData) as Array<keyof typeof benchmarkData>).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                metric === m 
                  ? "bg-white text-black shadow-lg" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 w-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={benchmarkData[metric]}
            layout="vertical"
            margin={{ top: 10, right: 60, left: 10, bottom: 10 }}
            barSize={44}
          >
            <CartesianGrid strokeDasharray="4 4" horizontal={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis 
              type="number" 
              hide 
              domain={[0, 100]}
            />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: '#71717a', fontSize: 10, fontWeight: 900, textAnchor: 'start' }}
              width={140}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
            <Bar 
              dataKey="score" 
              animationDuration={1500}
            >
              {benchmarkData[metric].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
              ))}
              <LabelList 
                dataKey="score" 
                position="right" 
                formatter={(val: any) => `${val}%`}
                style={{ fill: '#a1a1aa', fontSize: 10, fontWeight: 900 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footnote */}
      <div className="flex items-center gap-3 text-[9px] text-zinc-600 font-black uppercase tracking-widest italic pt-4 border-t border-white/5">
        <Info className="h-3 w-3" />
        Source: SXAI_REGISTRY / Q1_2026_TELEMETRY.
      </div>
    </div>
  );
}
