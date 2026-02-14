"use client";

import { useState } from "react";
import { AppHeader } from "@/components/navigation/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Share2,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  Filter,
  Check
} from "lucide-react";

type Citation = {
  source: string;
  url: string;
  context: string;
  sentiment: "positive" | "neutral" | "negative";
  authority: "high" | "medium" | "low";
  type: "discussion" | "wiki" | "news";
};

const OPPORTUNITIES: Citation[] = [
  {
    source: "Reddit (r/SaaS)",
    url: "https://reddit.com/r/SaaS/comments/...",
    context: "User asked for 'Best AI security tools' - Competitors mentioned: 4. You are missing.",
    sentiment: "neutral",
    authority: "high",
    type: "discussion",
  },
  {
    source: "Wikipedia (Generative AI)",
    url: "https://en.wikipedia.org/wiki/Generative_AI",
    context: "New section on 'AI Governance' added. Good spot for a citation on StandexAI protocols.",
    sentiment: "neutral",
    authority: "high",
    type: "wiki",
  },
  {
    source: "Hacker News",
    url: "https://news.ycombinator.com/item?id=...",
    context: "Thread on 'LLM hallucinations' trending. High relevance for your 'Fact Density' tool.",
    sentiment: "positive",
    authority: "high",
    type: "discussion",
  },
];

export default function ExchangePage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--ink-900)] font-sans">
      <AppHeader
        title="The Exchange"
        subtitle="Track where AI models learn about you. Claim your citations."
        rightSlot={
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
            <Globe className="h-3 w-3 text-[var(--accent-secondary)]" />
            <span className="text-xs font-medium text-slate-300">Network Active</span>
          </div>
        }
      />

      <main className="mx-auto w-full max-w-7xl px-6 py-8">

        {/* KPI CARDS */}
        <section className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-[var(--ink-500)] mb-2">Total Citations</h3>
            <div className="text-4xl font-bold text-white mb-1">142</div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-400/10 w-fit px-1.5 py-0.5 rounded">
              <TrendingUp className="h-3 w-3" /> +12 this week
            </div>
          </div>

          <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <h3 className="text-sm font-medium text-[var(--ink-500)] mb-2">Co-Occurrence Rate</h3>
            <div className="text-4xl font-bold text-white mb-1">8.4%</div>
            <div className="text-xs text-slate-400">Frequency with "Data Security"</div>
          </div>

          <div className="bg-[var(--bg-panel)] border border-amber-500/20 bg-amber-500/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-amber-500 mb-2">Missed Opportunities</h3>
                <div className="text-4xl font-bold text-amber-500 mb-1">24</div>
              </div>
              <AlertCircle className="h-8 w-8 text-amber-500 opacity-50" />
            </div>
            <div className="text-xs text-amber-500/80 font-medium">High authority gaps identified</div>
          </div>
        </section>

        {/* MAIN FEED */}
        <div className="grid lg:grid-cols-3 gap-8">

          {/* FEED LIST */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="h-5 w-5 text-[var(--accent-secondary)]" /> Citation Opportunities
              </h2>
              <div className="flex gap-2 bg-[var(--bg-card)] p-1 rounded-lg border border-[var(--line)]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter("all")}
                  className={`h-7 text-xs rounded-md ${filter === 'all' ? 'bg-[var(--bg-panel)] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter("high")}
                  className={`h-7 text-xs rounded-md ${filter === 'high' ? 'bg-[var(--bg-panel)] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  High Authority
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {OPPORTUNITIES.map((opp, i) => (
                <div key={i} className="bg-[var(--bg-card)] border border-[var(--line)] rounded-2xl p-6 hover:border-[var(--accent-secondary)]/50 transition-all group shadow-sm hover:shadow-md">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[var(--bg-panel)] flex items-center justify-center border border-[var(--line)]">
                        {opp.type === 'discussion' ? <MessageSquare className="h-5 w-5 text-slate-400" /> : <Globe className="h-5 w-5 text-slate-400" />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          {opp.source}
                          {opp.authority === 'high' && (
                            <Badge className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border-transparent text-[10px] h-5 rounded-full px-2">
                              High Authority
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">2 hours ago</div>
                      </div>
                    </div>
                    <a href={opp.url} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors bg-[var(--bg-panel)] p-2 rounded-lg border border-[var(--line)] hover:border-slate-500">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  <div className="bg-[var(--bg-panel)] rounded-xl p-4 mb-4 border border-[var(--line)] text-sm text-slate-300 leading-relaxed group-hover:bg-slate-900/80 transition-colors">
                    "{opp.context}"
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button size="sm" variant="outline" className="h-9 text-xs border-[var(--line)] text-slate-400 hover:text-white rounded-full px-4 hover:bg-[var(--bg-panel)]">
                      Ignore
                    </Button>
                    <Button size="sm" className="h-9 text-xs bg-white text-black hover:bg-slate-200 border-0 font-bold rounded-full px-6 shadow-md shadow-white/5">
                      Claim Citation
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SIDEBAR: TECHNICAL GEO */}
          <aside className="space-y-6">
            <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-200 mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-[var(--accent-primary)]" /> Technical Files
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--bg-card)] border border-[var(--line)] rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-[var(--accent-primary)]/10 flex items-center justify-center text-[var(--accent-primary)]">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-white group-hover:text-[var(--accent-primary)] transition-colors">llms.txt</div>
                      <div className="text-[10px] text-slate-500">Updated 2h ago</div>
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-[var(--accent-primary)] animate-pulse"></div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[var(--bg-card)] border border-[var(--line)] rounded-xl hover:bg-slate-800/50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <AlertCircle className="h-4 w-4" />
                    </div>
                    <div className="text-sm">
                      <div className="font-bold text-white group-hover:text-rose-400 transition-colors">robots.txt</div>
                      <div className="text-[10px] text-slate-500">Blocking GPTBot?</div>
                    </div>
                  </div>
                  <Button size="sm" variant="link" className="text-rose-400 h-auto p-0 text-[10px] font-bold">Fix</Button>
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-panel)] border border-[var(--line)] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-200 mb-4">Sentiment Drift</h3>
              <div className="h-32 flex items-end justify-between gap-1 border-b border-[var(--line)] pb-1 px-2">
                {[40, 65, 55, 70, 85, 82, 90].map((h, i) => (
                  <div key={i} className="w-full bg-[var(--accent-secondary)]/20 hover:bg-[var(--accent-secondary)] transition-all relative group rounded-t-sm">
                    <div className="absolute bottom-0 left-0 w-full bg-[var(--accent-secondary)] rounded-t-sm" style={{ height: `${h}%` }}></div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                      {h}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 mt-3 font-medium px-1">
                <span>Mon</span>
                <span>Today</span>
              </div>
            </div>
          </aside>
        </div>

      </main>
    </div>
  );
}
