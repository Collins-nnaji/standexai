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
      <div className="bg-white border border-[var(--line)] p-4 rounded-2xl shadow-xl">
        <p className="text-xs font-bold uppercase text-[var(--ink-500)] mb-1">{label}</p>
        <p className="text-sm font-bold text-[var(--ink-900)]">
          Result: <span style={{ color: payload[0].payload.color }}>{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export function BenchmarkLeaderboard() {
  const [metric, setMetric] = useState<keyof typeof benchmarkData>("mmlu");

  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-50 border border-[var(--line)] rounded-2xl">
          <TrendingUp className="h-4 w-4 text-zinc-400" />
          <span className="text-xs font-bold text-[var(--ink-900)] uppercase tracking-widest">SOTA Leaderboard</span>
        </div>
        
        <div className="flex bg-zinc-100 p-1 rounded-2xl">
          {(Object.keys(benchmarkData) as Array<keyof typeof benchmarkData>).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                metric === m 
                  ? "bg-white text-[var(--accent-primary)] shadow-sm" 
                  : "text-zinc-400 hover:text-zinc-600"
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
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f4f4f5" />
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
              tick={{ fill: '#3f3f46', fontSize: 11, fontWeight: 900 }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 92, 252, 0.05)', radius: 12 }} />
            <Bar 
              dataKey="score" 
              radius={[0, 12, 12, 0]}
              animationDuration={1500}
            >
              {benchmarkData[metric].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.9} />
              ))}
              <LabelList 
                dataKey="score" 
                position="right" 
                formatter={(val: any) => `${val}%`}
                style={{ fill: '#09090b', fontSize: 12, fontWeight: 800 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footnote */}
      <div className="flex items-center gap-2 text-[10px] text-zinc-400 italic">
        <Info className="h-3 w-3" />
        Data based on official model reports as of Q1 2024. Results may vary by quantization and prompt template.
      </div>
    </div>
  );
}
