"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText, Mic, PenTool, Bot,
  ArrowRight, Sparkles, Loader2, TrendingUp, Shield, Eye,
  BarChart3, Clock, Zap, LayoutDashboard, Activity, Database,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const FEATURES = [
  {
    name: "Writing Lab",
    desc: "Review workspace for communication, compliance, intent, and AI signals — Transform workspace for full rewrites (six modes) and voice input.",
    icon: FileText,
    href: "/writing-lab",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
  {
    name: "Coach (Agent)",
    desc: "Set a goal and let the agent chain analysis, compliance, intent checks, detection, and rewrites.",
    icon: Bot,
    href: "/agent",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    name: "Transform",
    desc: "Open the lab in Transform mode — professional, friendly, persuasive, safe, speech, and neutral rewrites side by side.",
    icon: PenTool,
    href: "/writing-lab?workspace=rewrite",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
];

type DashboardPayload = {
  summary: {
    totalProjects: number;
    published: number;
    inReview: number;
    draft: number;
    avgSeoScore: number;
    avgComplianceScore: number;
    avgGeoScore: number;
  };
  communication: {
    totalRuns: number;
    avgOverall: number;
    avgTone: number;
    avgRisk: number;
    avgClarity: number;
    avgAiProbability: number;
    lastRunAt: string | null;
    recent: Array<{
      id: string;
      title: string;
      source: string;
      kind: string;
      overallScore: number | null;
      toneScore: number | null;
      riskScore: number | null;
      clarityScore: number | null;
      aiProbability: number | null;
      riskLevel: string | null;
      createdAt: string;
    }>;
  };
  llm: {
    totalGenerations: number;
    providersUsed: number;
    mostUsedModel: string;
  };
  projects: Array<{
    id: string;
    title: string;
    source: string;
    status: string;
    updatedAt: string;
    complianceScore: number;
    seoScore: number;
  }>;
};

function scoreToneLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Build";
}

function riskLevelLabel(level: string | null | undefined): string {
  if (!level) return "—";
  const n = level.toLowerCase();
  if (n === "low") return "Low";
  if (n === "medium") return "Medium";
  if (n === "high") return "High";
  if (n === "critical") return "Critical";
  return level;
}

export default function ConsolePage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingDash, setLoadingDash] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch("/api/console", { cache: "no-store" });
      const json = (await res.json()) as DashboardPayload & { error?: string };
      if (!res.ok) throw new Error(json.error || "Failed to load dashboard");
      setData(json);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load dashboard");
      setData(null);
    } finally {
      setLoadingDash(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const handleQuickAnalyze = () => {
    if (!text.trim()) return;
    const encoded = encodeURIComponent(text);
    router.push(`/writing-lab?text=${encoded}`);
  };

  const comm = data?.communication;
  const summary = data?.summary;
  const recent = comm?.recent ?? [];

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-auto bg-zinc-50/80">
      <div className="w-full border-b border-zinc-200/80 bg-white/95 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
        <div className="mx-auto w-full max-w-[1400px] px-3 py-3 sm:px-4 lg:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-0.5 flex items-center gap-1.5">
                <LayoutDashboard className="h-3.5 w-3.5 text-indigo-500" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-indigo-900/80">Dashboard</span>
              </div>
              <h1 className="text-xl font-extrabold tracking-tight text-zinc-900 sm:text-2xl">Console</h1>
              <p className="mt-0.5 max-w-2xl text-[13px] leading-snug text-zinc-500">
                Live metrics — lab runs, content, model usage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={loadingDash}
              className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-zinc-200 bg-white px-3 py-2 text-[11px] font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50 sm:self-auto"
            >
              {loadingDash ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Activity className="h-3.5 w-3.5 text-indigo-500" />}
              Refresh
            </button>
          </div>

          {loadError && (
            <div className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
              {loadError}
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Lab analyses</p>
              <p className="mt-0.5 text-xl font-black tabular-nums text-zinc-900">
                {loadingDash ? "—" : comm?.totalRuns ?? 0}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">From Writing Lab</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Avg overall</p>
              <p className="mt-0.5 text-xl font-black tabular-nums text-indigo-700">
                {loadingDash ? "—" : comm?.totalRuns ? `${comm.avgOverall}` : "—"}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">Last {Math.min(comm?.totalRuns ?? 0, 30)} runs</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Content</p>
              <p className="mt-0.5 text-xl font-black tabular-nums text-zinc-900">
                {loadingDash ? "—" : summary?.totalProjects ?? 0}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">Workspace items</p>
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">Model activity</p>
              <p className="mt-0.5 text-xl font-black tabular-nums text-zinc-900">
                {loadingDash ? "—" : data?.llm.totalGenerations ?? 0}
              </p>
              <p className="mt-0.5 truncate text-[11px] text-zinc-500" title={data?.llm.mostUsedModel}>
                {data?.llm.mostUsedModel ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] flex-1 space-y-4 px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
          <label className="mb-1.5 block text-[11px] font-semibold text-zinc-700">Quick analysis</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste text — opens Writing Lab with full checks…"
            className="w-full min-h-[88px] resize-y rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-indigo-200 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={handleQuickAnalyze}
              disabled={!text.trim() || analyzing}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Open in Writing Lab
            </button>
            <button
              onClick={() => router.push("/writing-lab?voice=1")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              <Mic className="h-4 w-4 text-violet-500" />
              Voice to text
            </button>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">Workspace</h2>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {FEATURES.map((f) => (
              <button
                key={f.name}
                onClick={() => router.push(f.href)}
                className="group flex flex-col items-start gap-2 rounded-xl border border-zinc-100 bg-white p-3 text-left shadow-sm transition-all hover:border-zinc-200 hover:shadow-md"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${f.bg} ${f.border}`}>
                  <f.icon className={`h-[1.1rem] w-[1.1rem] ${f.color}`} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900">{f.name}</h3>
                  <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">{f.desc}</p>
                </div>
                <ArrowRight className="mt-auto h-3.5 w-3.5 text-zinc-300 transition-colors group-hover:text-indigo-500" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1fr_minmax(260px,300px)] xl:items-start xl:gap-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Recent lab analyses</h2>
              <button
                type="button"
                onClick={() => router.push("/writing-lab")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Open Writing Lab
              </button>
            </div>

            {loadingDash ? (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-300" />
              </div>
            ) : recent.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-6 text-center">
                <Database className="mx-auto h-8 w-8 text-zinc-300" />
                <p className="mt-2 text-sm font-semibold text-zinc-800">No saved analyses yet</p>
                <p className="mt-0.5 text-[11px] text-zinc-500">
                  Run an analysis in Writing Lab — results sync here.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                <div className="divide-y divide-zinc-100">
                  {recent.map((a) => (
                    <div
                      key={a.id}
                      className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-3"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-zinc-900">{a.title}</p>
                          <p className="text-[11px] text-zinc-400">
                            {a.kind === "run_all" ? "Full analysis" : "Communication"}{" "}
                            · {a.source === "VOICE" ? "Voice" : "Text"} ·{" "}
                            {formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                        <div className="text-right">
                          <span className="text-base font-bold tabular-nums text-zinc-900">
                            {a.overallScore != null ? `${a.overallScore}` : "—"}
                          </span>
                          <span className="ml-1 text-[10px] text-zinc-400">overall</span>
                        </div>
                        <div className="text-right text-[11px] text-zinc-500">
                          <span className="block font-medium text-zinc-700">
                            {riskLevelLabel(a.riskLevel)}
                          </span>
                          <span>Risk tier</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 lg:sticky lg:top-3">
            <div className="rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
              <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                <BarChart3 className="h-3.5 w-3.5 text-indigo-500" />
                Communication scores
              </h3>
              <p className="mb-3 text-[10px] leading-snug text-zinc-400">Avg. of last 30 saved runs.</p>
              <div className="space-y-3">
                {[
                  {
                    label: "Tone",
                    value: comm?.avgTone,
                    icon: TrendingUp,
                    color: "bg-indigo-500",
                    textColor: "text-indigo-800",
                    isText: false,
                  },
                  {
                    label: "Risk (signal)",
                    value: comm?.avgRisk,
                    icon: Shield,
                    color: "bg-amber-500",
                    textColor: "text-amber-900",
                    isText: false,
                  },
                  {
                    label: "Clarity",
                    value: comm?.avgClarity,
                    icon: Eye,
                    color: "bg-violet-500",
                    textColor: "text-violet-800",
                    isText: false,
                  },
                  {
                    label: "Overall",
                    value: comm?.avgOverall,
                    icon: Sparkles,
                    color: "bg-indigo-600",
                    textColor: "text-indigo-900",
                    isText: false,
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <s.icon className={`h-3.5 w-3.5 ${s.textColor}`} />
                        <span className="text-[11px] font-semibold text-zinc-600">{s.label}</span>
                      </div>
                      <span className={`text-sm font-bold tabular-nums ${s.textColor}`}>
                        {comm?.totalRuns ? (s.value != null ? `${s.value}` : "—") : "—"}
                      </span>
                    </div>
                    {comm?.totalRuns && s.value != null && (
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className={`h-full rounded-full ${s.color} transition-all duration-700`}
                          style={{ width: `${Math.min(100, s.value)}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
                {comm && comm.totalRuns > 0 && (
                  <p className="border-t border-zinc-50 pt-2 text-[10px] text-zinc-500">
                    Tone profile:{" "}
                    <span className="font-semibold text-zinc-800">
                      {scoreToneLabel(comm.avgTone || comm.avgOverall || 0)}
                    </span>
                  </p>
                )}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-700 to-violet-800 p-4 text-white shadow-lg shadow-indigo-900/20">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-2xl" />
              <Mic className="relative z-10 mb-2 h-5 w-5 text-indigo-200" />
              <h3 className="relative z-10 mb-1 text-sm font-bold">Voice → analyze</h3>
              <p className="relative z-10 mb-3 text-[11px] leading-snug text-indigo-100">
                Transcribe, then run the full analyzer on the text.
              </p>
              <button
                type="button"
                onClick={() => router.push("/writing-lab?voice=1")}
                className="relative z-10 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-2 text-xs font-bold text-indigo-700 shadow-md transition hover:bg-indigo-50"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Transcribe &amp; analyze
              </button>
            </div>

            {summary && summary.totalProjects > 0 && (
              <div className="rounded-xl border border-zinc-100 bg-white p-4 shadow-sm">
                <h3 className="mb-2 text-xs font-semibold text-zinc-500">Content snapshot</h3>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg bg-zinc-50 py-2">
                    <p className="text-lg font-bold text-zinc-900">{summary.draft}</p>
                    <p className="text-[9px] font-semibold uppercase text-zinc-400">Drafts</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 py-2">
                    <p className="text-lg font-bold text-zinc-900">{summary.published}</p>
                    <p className="text-[9px] font-semibold uppercase text-zinc-400">Published</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 py-2">
                    <p className="text-lg font-bold text-zinc-900">{summary.avgComplianceScore || "—"}</p>
                    <p className="text-[9px] font-semibold uppercase text-zinc-400">Avg compliance</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 py-2">
                    <p className="text-lg font-bold text-zinc-900">{summary.avgSeoScore || "—"}</p>
                    <p className="text-[9px] font-semibold uppercase text-zinc-400">Avg SEO</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
