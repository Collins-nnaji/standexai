"use client";

import { useState } from "react";
import {
  BarChart3, TrendingUp, Shield, Eye, Sparkles, ArrowRight,
  FileText, Mic, PenTool, Calendar, ThumbsUp
} from "lucide-react";

const MOCK_HISTORY = [
  { date: "Mar 23", tone: 78, risk: 12, clarity: 85, type: "text" },
  { date: "Mar 22", tone: 72, risk: 25, clarity: 80, type: "speech" },
  { date: "Mar 21", tone: 81, risk: 8, clarity: 88, type: "text" },
  { date: "Mar 20", tone: 65, risk: 35, clarity: 72, type: "text" },
  { date: "Mar 19", tone: 75, risk: 18, clarity: 83, type: "speech" },
  { date: "Mar 18", tone: 82, risk: 10, clarity: 87, type: "text" },
  { date: "Mar 17", tone: 70, risk: 22, clarity: 78, type: "text" },
];

const COMMUNICATION_STYLE = [
  { trait: "Directness", score: 82, desc: "You tend to communicate clearly and directly" },
  { trait: "Empathy", score: 71, desc: "Good emotional awareness; room for more acknowledgment" },
  { trait: "Formality", score: 68, desc: "Moderately formal; adapts based on context" },
  { trait: "Persuasiveness", score: 75, desc: "Effective at making points; could use more evidence" },
  { trait: "Inclusivity", score: 88, desc: "Excellent use of inclusive, accessible language" },
];

const TIPS = [
  { category: "Tone", tip: "Replace hedge words like 'I think' and 'maybe' with confident assertions when presenting facts.", priority: "high" },
  { category: "Clarity", tip: "Your sentences average 28 words — try to keep them under 20 for better readability.", priority: "high" },
  { category: "Risk", tip: "Avoid superlatives like 'always' and 'never' in professional emails — they can sound absolute.", priority: "medium" },
  { category: "Speech", tip: "Reduce filler words by pausing silently instead of saying 'um' or 'uh'.", priority: "medium" },
  { category: "Engagement", tip: "Start messages with the key takeaway instead of context-setting.", priority: "low" },
];

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState("7d");

  const avgTone = Math.round(MOCK_HISTORY.reduce((a, b) => a + b.tone, 0) / MOCK_HISTORY.length);
  const avgClarity = Math.round(MOCK_HISTORY.reduce((a, b) => a + b.clarity, 0) / MOCK_HISTORY.length);
  const avgRisk = Math.round(MOCK_HISTORY.reduce((a, b) => a + b.risk, 0) / MOCK_HISTORY.length);
  const totalAnalyses = MOCK_HISTORY.length;

  const maxScore = Math.max(...MOCK_HISTORY.flatMap(h => [h.tone, h.clarity]));

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-8 lg:py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-100">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">Personal Insights</h1>
              <p className="text-xs text-zinc-400">Track your communication improvement over time</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {["7d", "30d", "90d"].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                  timeRange === r ? "bg-zinc-900 text-white shadow-md" : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                }`}
              >
                {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: "Average Tone", value: avgTone, icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", trend: "+3" },
            { label: "Average Clarity", value: avgClarity, icon: Eye, color: "text-violet-600", bg: "bg-violet-50", trend: "+5" },
            { label: "Risk Level", value: `${avgRisk}%`, icon: Shield, color: "text-emerald-600", bg: "bg-emerald-50", trend: "-2" },
            { label: "Total Analyses", value: totalAnalyses, icon: FileText, color: "text-blue-600", bg: "bg-blue-50", trend: "" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-zinc-100 bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <span className="text-xs font-semibold text-zinc-400">{s.label}</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-zinc-900">{s.value}</span>
                {s.trend && (
                  <span className={`text-xs font-semibold ${s.trend.startsWith("-") ? "text-emerald-500" : "text-emerald-500"} mb-1`}>
                    {s.trend.startsWith("-") ? s.trend : `+${s.trend}`}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left */}
          <div className="space-y-8">
            {/* Score Trend Chart */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-6">
              <h3 className="text-sm font-semibold text-zinc-700 mb-6 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                Communication Score Over Time
              </h3>
              <div className="relative h-48">
                <div className="absolute inset-0 flex items-end justify-between gap-2">
                  {MOCK_HISTORY.map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex gap-0.5 items-end" style={{ height: "160px" }}>
                        <div
                          className="flex-1 bg-indigo-200 rounded-t-md transition-all hover:bg-indigo-400"
                          style={{ height: `${(h.tone / maxScore) * 100}%` }}
                          title={`Tone: ${h.tone}`}
                        />
                        <div
                          className="flex-1 bg-violet-200 rounded-t-md transition-all hover:bg-violet-400"
                          style={{ height: `${(h.clarity / maxScore) * 100}%` }}
                          title={`Clarity: ${h.clarity}`}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400">{h.date.split(" ")[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-zinc-50">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-indigo-300" />
                  <span className="text-xs text-zinc-500">Tone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-violet-300" />
                  <span className="text-xs text-zinc-500">Clarity</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-6">
              <h3 className="text-sm font-semibold text-zinc-700 mb-4 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {MOCK_HISTORY.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl bg-zinc-50 px-4 py-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${h.type === "speech" ? "bg-violet-50" : "bg-indigo-50"}`}>
                      {h.type === "speech" ? <Mic className="h-4 w-4 text-violet-500" /> : <FileText className="h-4 w-4 text-indigo-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-zinc-700">{h.type === "speech" ? "Speech Analysis" : "Text Analysis"}</p>
                      <p className="text-[10px] text-zinc-400">{h.date}</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-indigo-600 font-semibold">T:{h.tone}</span>
                      <span className="text-violet-600 font-semibold">C:{h.clarity}</span>
                      <span className={`font-semibold ${h.risk <= 15 ? "text-emerald-600" : h.risk <= 30 ? "text-amber-600" : "text-red-600"}`}>R:{h.risk}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">
            {/* Communication Style */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-6">
              <h3 className="text-sm font-semibold text-zinc-700 mb-5 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-emerald-500" />
                Communication Style
              </h3>
              <div className="space-y-4">
                {COMMUNICATION_STYLE.map((s) => (
                  <div key={s.trait}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-600">{s.trait}</span>
                      <span className={`text-xs font-bold ${
                        s.score >= 80 ? "text-emerald-600" : s.score >= 65 ? "text-amber-600" : "text-red-600"
                      }`}>{s.score}</span>
                    </div>
                    <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          s.score >= 80 ? "bg-emerald-500" : s.score >= 65 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-zinc-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-6">
              <h3 className="text-sm font-semibold text-zinc-700 mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                Improvement Suggestions
              </h3>
              <div className="space-y-3">
                {TIPS.map((t, i) => (
                  <div key={i} className={`rounded-xl border p-3 ${
                    t.priority === "high" ? "border-indigo-100 bg-indigo-50/50" :
                    t.priority === "medium" ? "border-zinc-100 bg-zinc-50" :
                    "border-zinc-50 bg-white"
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold uppercase ${
                        t.priority === "high" ? "text-indigo-600" :
                        t.priority === "medium" ? "text-zinc-500" :
                        "text-zinc-400"
                      }`}>{t.priority}</span>
                      <span className="text-[10px] text-zinc-300">&middot;</span>
                      <span className="text-[10px] text-zinc-400">{t.category}</span>
                    </div>
                    <p className="text-xs text-zinc-600 leading-relaxed">{t.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
