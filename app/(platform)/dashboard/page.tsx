"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Mic, PenTool, ScanSearch, ShieldAlert, Brain,
  ArrowRight, Sparkles, Upload, Loader2, TrendingUp, Shield, Eye,
  BarChart3, Clock, Zap
} from "lucide-react";

const FEATURES = [
  {
    name: "Text Analyzer",
    desc: "Paste any text to get instant tone, risk, and clarity analysis with actionable suggestions.",
    icon: FileText,
    href: "/text-analyzer",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    name: "Speech Analyzer",
    desc: "Upload audio, record live, or paste a script to analyze delivery, filler words, and impact.",
    icon: Mic,
    href: "/speech-analyzer",
    color: "text-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    name: "Rewrite Studio",
    desc: "Transform your text into professional, friendly, persuasive, or safe versions side by side.",
    icon: PenTool,
    href: "/rewrite-studio",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    name: "AI Detection",
    desc: "Check if text was AI-generated and get suggestions to make it more authentically human.",
    icon: ScanSearch,
    href: "/ai-detection",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    name: "Risk & Compliance",
    desc: "Detect harassment, threats, discrimination, and legal risks with safer alternatives.",
    icon: ShieldAlert,
    href: "/risk-compliance",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
  },
  {
    name: "Intent Analyzer",
    desc: "Uncover manipulation, emotional pressure, bias, and hidden persuasion tactics.",
    icon: Brain,
    href: "/intent-analyzer",
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-100",
  },
];

const RECENT_ANALYSES = [
  { title: "Email draft to client", type: "Text Analysis", score: 82, time: "2 min ago", status: "good" },
  { title: "Quarterly review speech", type: "Speech Analysis", score: 71, time: "1 hour ago", status: "moderate" },
  { title: "LinkedIn post", type: "AI Detection", score: 34, time: "3 hours ago", status: "good" },
  { title: "HR policy update", type: "Risk Check", score: 15, time: "Yesterday", status: "excellent" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const handleQuickAnalyze = () => {
    if (!text.trim()) return;
    const encoded = encodeURIComponent(text);
    router.push(`/text-analyzer?text=${encoded}`);
  };

  return (
    <div className="flex flex-1 flex-col overflow-auto">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 lg:px-8 lg:py-10 space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-semibold text-indigo-600">AI Communication Coach</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Say the right thing, the right way
          </h1>
          <p className="mt-2 text-base text-zinc-500">
            Analyze, improve, and safeguard your communication in real time.
          </p>
        </div>

        {/* Quick Analysis Input */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <label className="text-sm font-semibold text-zinc-700 mb-3 block">Quick Analysis</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste or type any text here — an email, speech, social post, message — and get instant insights..."
            className="w-full min-h-[120px] rounded-xl border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-50 transition resize-none"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={handleQuickAnalyze}
              disabled={!text.trim() || analyzing}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Analyze Text
            </button>
            <button
              onClick={() => router.push("/speech-analyzer")}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <Mic className="h-4 w-4 text-zinc-400" />
              Analyze Speech
            </button>
            <button
              onClick={() => router.push("/text-analyzer")}
              className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <Upload className="h-4 w-4 text-zinc-400" />
              Upload File
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Left */}
          <div className="space-y-8">
            {/* Feature Cards */}
            <div>
              <h2 className="text-sm font-semibold text-zinc-500 mb-4">Communication Tools</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {FEATURES.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => router.push(f.href)}
                    className="group flex flex-col items-start gap-3 rounded-2xl border border-zinc-100 bg-white p-5 text-left transition-all hover:shadow-lg hover:border-zinc-200 hover:-translate-y-0.5"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${f.bg} ${f.border} border`}>
                      <f.icon className={`h-5 w-5 ${f.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-zinc-900 mb-1">{f.name}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">{f.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-600 transition-colors mt-auto" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Analyses */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-500">Recent Analyses</h2>
                <button
                  onClick={() => router.push("/insights")}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {RECENT_ANALYSES.map((a, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-xl border border-zinc-100 bg-white px-5 py-4 transition hover:shadow-sm">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      a.status === "excellent" ? "bg-emerald-50 text-emerald-600" :
                      a.status === "good" ? "bg-blue-50 text-blue-600" :
                      "bg-amber-50 text-amber-600"
                    }`}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-900 truncate">{a.title}</p>
                      <p className="text-xs text-zinc-400">{a.type}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-lg font-bold ${
                        a.score <= 30 ? "text-emerald-600" :
                        a.score <= 60 ? "text-amber-600" :
                        "text-zinc-900"
                      }`}>
                        {a.type === "Risk Check" ? `${a.score}%` : `${a.score}/100`}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <Clock className="h-3 w-3" />
                        {a.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-zinc-500 mb-5 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Your Communication Scores
              </h3>
              <div className="space-y-5">
                {[
                  { label: "Tone Score", value: 78, icon: TrendingUp, color: "bg-indigo-500", textColor: "text-indigo-600" },
                  { label: "Risk Level", value: "Low", icon: Shield, color: "bg-emerald-500", textColor: "text-emerald-600", isText: true },
                  { label: "Clarity Score", value: 85, icon: Eye, color: "bg-violet-500", textColor: "text-violet-600" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <s.icon className={`h-4 w-4 ${s.textColor}`} />
                        <span className="text-xs font-semibold text-zinc-600">{s.label}</span>
                      </div>
                      <span className={`text-lg font-bold ${s.textColor}`}>
                        {s.isText ? s.value : `${s.value}%`}
                      </span>
                    </div>
                    {!s.isText && (
                      <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.color} transition-all duration-700`}
                          style={{ width: `${s.value}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Speaker Mode CTA */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white relative overflow-hidden shadow-xl">
              <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <Mic className="h-7 w-7 text-indigo-200 mb-3 relative z-10" />
              <h3 className="text-lg font-bold mb-2 relative z-10">Speaker Mode</h3>
              <p className="text-sm text-indigo-100 mb-5 leading-relaxed relative z-10">
                Get real-time coaching on clarity, engagement, pacing, and emotional impact for your speeches.
              </p>
              <button
                onClick={() => router.push("/speech-analyzer")}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-indigo-600 shadow-lg transition hover:scale-[1.02] relative z-10"
              >
                <Zap className="h-4 w-4" />
                Try Speaker Mode
              </button>
            </div>

            {/* Quick Tips */}
            <div className="rounded-2xl border border-zinc-100 bg-white p-6">
              <h3 className="text-sm font-semibold text-zinc-500 mb-4">Communication Tips</h3>
              <div className="space-y-3">
                {[
                  "Replace \"I think\" with confident assertions",
                  "Avoid passive voice for stronger impact",
                  "Use specific numbers instead of vague claims",
                  "Start with your key message, then support it",
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-zinc-600 leading-relaxed">{tip}</p>
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
