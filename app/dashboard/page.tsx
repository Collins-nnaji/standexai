"use client";

import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/navigation/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Search,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  Activity,
  Globe,
  Share2,
  TrendingDown,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";

export default function DashboardPage() {
  const [url, setUrl] = useState("standex.ai");
  const [scanning, setScanning] = useState(false);

  // Mock Data for Visualization
  const shareOfVoice = [
    { platform: "ChatGPT (GPT-4o)", score: 18, total: 100, color: "bg-blue-500", trend: "+2.4%" },
    { platform: "Perplexity", score: 42, total: 100, color: "bg-cyan-500", trend: "+5.1%" },
    { platform: "Gemini 1.5", score: 12, total: 100, color: "bg-amber-500", trend: "-1.2%" },
    { platform: "Claude 3.5", score: 5, total: 100, color: "bg-rose-500", trend: "0.0%" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--ink-900)] font-sans">
      <AppHeader
        title="Dashboard"
        subtitle="Real-time AI visibility and reputation monitoring."
        rightSlot={
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-slate-300">Live Monitoring</span>
          </div>
        }
      />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 space-y-8">

        {/* SCORECARD ROW */}
        <section className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1 bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 relative overflow-hidden group hover:border-[var(--accent-primary)] transition-all shadow-lg hover:shadow-[var(--accent-primary)]/5">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Activity className="h-16 w-16 text-[var(--accent-primary)]" />
            </div>
            <h3 className="text-sm font-medium text-[var(--ink-500)] mb-2">Visibility Score</h3>
            <div className="flex items-baseline gap-2 mb-1">
              <div className="text-5xl font-bold text-white tracking-tight">19.2</div>
              <div className="text-sm font-medium text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> 12%
              </div>
            </div>
            <p className="text-xs text-[var(--ink-500)]">Weighted avg. across 4 major LLMs</p>
          </div>

          <div className="md:col-span-3 bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-medium text-[var(--ink-500)]">Share of Voice Breakdown</h3>
              <Button size="sm" variant="ghost" className="h-8 text-xs text-[var(--accent-primary)] hover:text-white hover:bg-[var(--accent-primary)]/10 rounded-full">
                Full Report <ArrowUpRight className="ml-1 h-3 w-3" />
              </Button>
            </div>

            <div className="space-y-5">
              {shareOfVoice.map((item) => (
                <div key={item.platform} className="grid grid-cols-12 gap-6 items-center group">
                  <div className="col-span-3 text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{item.platform}</div>
                  <div className="col-span-7 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <div className="col-span-1 text-right text-sm font-bold text-slate-200">{item.score}%</div>
                  <div className={`col-span-1 text-right text-xs font-medium ${item.trend.startsWith('+') ? 'text-emerald-400' : item.trend.startsWith('-') ? 'text-rose-400' : 'text-slate-500'}`}>
                    {item.trend}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CITATION MAP & HEALTH CHECK */}
        <section className="grid lg:grid-cols-3 gap-6">
          {/* CITATION MAP VISUALIZATION */}
          <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--line)] rounded-2xl overflow-hidden shadow-lg flex flex-col relative group">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--bg-panel)]/50 z-10">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[var(--accent-secondary)]" />
                <span className="text-sm font-bold text-slate-200">Mentions Map</span>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="border-slate-700 text-slate-400 font-normal text-[10px]">Depth: 2</Badge>
                <Badge variant="outline" className="border-slate-700 text-slate-400 font-normal text-[10px]">Nodes: 14</Badge>
              </div>
            </div>

            <div className="relative h-[320px] bg-slate-950/50 overflow-hidden">
              {/* Decorative Map Nodes */}
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Central Node (Brand) */}
                <div className="relative z-20 h-16 w-16 bg-[var(--accent-primary)]/20 rounded-full flex items-center justify-center border-2 border-[var(--accent-primary)] shadow-[0_0_30px_rgba(59,130,246,0.3)] animate-pulse">
                  <div className="h-3 w-3 bg-[var(--accent-primary)] rounded-full"></div>
                </div>
                {/* Connecting Lines */}
                <svg className="absolute inset-0 h-full w-full z-10 pointer-events-none opacity-30">
                  <line x1="50%" y1="50%" x2="20%" y2="30%" stroke="var(--accent-secondary)" strokeWidth="1" />
                  <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="var(--accent-secondary)" strokeWidth="1" />
                  <line x1="50%" y1="50%" x2="30%" y2="80%" stroke="var(--accent-warn)" strokeWidth="1" />
                  <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="var(--accent-alert)" strokeWidth="1" />
                </svg>

                {/* Satellite Nodes */}
                <div className="absolute top-[30%] left-[20%] text-center">
                  <div className="h-8 w-8 bg-slate-800 rounded-full border border-[var(--accent-secondary)] mx-auto flex items-center justify-center text-[10px] text-white font-bold">R</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Reddit</span>
                </div>
                <div className="absolute top-[20%] right-[20%] text-center">
                  <div className="h-8 w-8 bg-slate-800 rounded-full border border-[var(--accent-secondary)] mx-auto flex items-center justify-center text-[10px] text-white font-bold">W</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Wikipedia</span>
                </div>
                <div className="absolute bottom-[20%] left-[30%] text-center">
                  <div className="h-8 w-8 bg-slate-800 rounded-full border border-[var(--accent-warn)] mx-auto flex items-center justify-center text-[10px] text-white font-bold">G</div>
                  <span className="text-[10px] text-slate-400 mt-1 block">G2 Reviews</span>
                </div>
                {/* Hallucination Node */}
                <div className="absolute bottom-[30%] right-[30%] text-center">
                  <div className="h-8 w-8 bg-rose-900/50 rounded-full border border-[var(--accent-alert)] mx-auto flex items-center justify-center text-[10px] text-rose-200 font-bold animate-bounce">!</div>
                  <span className="text-[10px] text-rose-400 mt-1 block">Hallucination</span>
                </div>
              </div>
            </div>
          </div>

          {/* SENTIMENT ALERT / HEALTH CHECK */}
          <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 flex flex-col shadow-lg">
            <h3 className="text-sm font-bold text-slate-200 mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-[var(--accent-primary)]" /> System Health</span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-none">94% Stable</Badge>
            </h3>

            <div className="space-y-4 flex-1">
              {/* Critical Alert */}
              <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-xl flex gap-4 items-start group hover:bg-rose-500/10 transition-colors cursor-pointer">
                <div className="mt-1 bg-rose-500/20 p-1.5 rounded-lg text-rose-400">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Pricing Drift Detected</h4>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    Gemini is quoting <span className="text-rose-400">$29/mo</span>.
                    Vault says <span className="text-emerald-400">$49/mo</span>.
                  </p>
                  <Button size="sm" className="h-7 text-xs bg-rose-500 text-white hover:bg-rose-600 border-0 rounded-full w-full shadow-lg shadow-rose-500/20">
                    Fix Issue
                  </Button>
                </div>
              </div>

              {/* Warning */}
              <div className="p-4 border border-amber-500/20 bg-amber-500/5 rounded-xl flex gap-4 items-start hover:border-amber-500/30 transition-all cursor-pointer group">
                <div className="mt-1 bg-amber-500/20 p-1.5 rounded-lg text-amber-400">
                  <TrendingDown className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200 group-hover:text-white mb-1">Sentiment Dip (Claude)</h4>
                  <p className="text-xs text-slate-400 mb-2 leading-relaxed">Negative sentiment detected in recent cached responses.</p>
                  <span className="text-[10px] text-amber-500 font-medium cursor-pointer hover:underline">Investigate Source &rarr;</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
