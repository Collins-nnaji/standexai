"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, FileText, AlertTriangle, Clock, BrainCircuit, Cpu, RotateCw, Search } from "lucide-react";
import Link from "next/link";

type Project = {
  id: string;
  title: string;
  source: "content" | "brief";
  status: "draft" | "in_review" | "approved" | "published";
  seoScore: number;
  geoScore: number;
  complianceScore: number;
  riskLevel: "low" | "medium" | "high" | "critical";
  updatedAt: string;
  flagCount: number;
  wordCount: number;
  targetKeyword?: string;
};

type ModelUsage = {
  provider: string;
  model: string;
  count: number;
  lastUsedAt: string;
};

type DashboardData = {
  summary: {
    totalProjects: number;
    published: number;
    inReview: number;
    draft: number;
    avgSeoScore: number;
    avgComplianceScore: number;
    avgGeoScore: number;
  };
  llm: {
    totalGenerations: number;
    providersUsed: number;
    mostUsedModel: string;
    modelUsage: ModelUsage[];
    geoCoverage: Array<{
      engine: string;
      provider: string;
      observedRuns: number;
      lastObservedAt: string | null;
      status: "active" | "not_seen";
    }>;
  };
  projects: Project[];
};

const EMPTY_PROJECTS: Project[] = [];

const statusConfig = {
  draft: { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200", label: "Draft" },
  in_review: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", label: "In Review" },
  approved: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", label: "Approved" },
  published: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", label: "Published" },
};

const riskColors = {
  low: "text-emerald-500",
  medium: "text-yellow-500",
  high: "text-orange-500",
  critical: "text-red-500",
};

function formatRelative(dateIso: string) {
  const date = new Date(dateIso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function ScoreCircle({ score, label }: { score: number; label: string }) {
  const getColor = () => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-16 w-16">
        <svg className="h-16 w-16 -rotate-90 transform">
          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="none" className="text-[#E5E5EA]" />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke={getColor()}
            strokeWidth="4"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-[#1D1D1F]">{score}</span>
        </div>
      </div>
      <p className="mt-1.5 text-xs font-medium text-[#6E6E73]">{label}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<"all" | "draft" | "in_review" | "published">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "content" | "brief">("all");
  const [llmView, setLlmView] = useState<"engines" | "models">("engines");
  const [projectQuery, setProjectQuery] = useState("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastLoadedAt, setLastLoadedAt] = useState<string | null>(null);
  const [briefPipelineFocused, setBriefPipelineFocused] = useState(false);
  const briefPipelineRef = useRef<HTMLDivElement | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/dashboard", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to load dashboard metrics");
      const data = (await response.json()) as DashboardData;
      setDashboardData(data);
      setLastLoadedAt(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Dashboard unavailable");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const projects = dashboardData?.projects ?? EMPTY_PROJECTS;
  const contentProjectCount = projects.filter((project) => project.source === "content").length;
  const briefProjectCount = projects.filter((project) => project.source === "brief").length;
  const briefProjects = projects.filter((project) => project.source === "brief");
  const briefActiveCount = briefProjects.filter((project) => project.status !== "draft").length;
  const briefIssueCount = briefProjects.filter((project) => project.flagCount > 0).length;
  const latestBriefUpdate = briefProjects[0]?.updatedAt;

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        const passesStatus = filter === "all" || project.status === filter;
        const passesSource = sourceFilter === "all" || project.source === sourceFilter;
        const passesQuery =
          !projectQuery.trim() ||
          project.title.toLowerCase().includes(projectQuery.toLowerCase()) ||
          project.targetKeyword?.toLowerCase().includes(projectQuery.toLowerCase());
        return passesStatus && passesSource && passesQuery;
      }),
    [filter, projectQuery, projects, sourceFilter],
  );

  const avgPerformance =
    dashboardData &&
    Math.round(
      (dashboardData.summary.avgSeoScore + dashboardData.summary.avgComplianceScore + dashboardData.summary.avgGeoScore) / 3,
    );

  const focusBriefPipeline = () => {
    setSourceFilter("brief");
    briefPipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setBriefPipelineFocused(true);
    window.setTimeout(() => setBriefPipelineFocused(false), 1400);
  };

  return (
    <div className="min-h-screen bg-white text-[#1D1D1F]">
      <header className="border-b border-[#E5E5EA] bg-white px-6 py-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[#AEAEB2]">StandexAI Control Room</p>
            <h1 className="text-4xl font-semibold text-[#1D1D1F]" style={{ fontFamily: "Georgia, Cambria, Times New Roman, serif" }}>
              Dashboard
            </h1>
            <p className="max-w-xl text-sm text-[#6E6E73]">Precision view of content output, compliance posture, and GEO model coverage.</p>
            {lastLoadedAt && <p className="text-xs text-[#AEAEB2]">Last updated {formatRelative(lastLoadedAt)}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={focusBriefPipeline}
              className="group flex items-center gap-2 rounded-full border border-[#D1D1D6] bg-white px-5 py-3 text-sm font-semibold text-[#1D1D1F] transition hover:border-[#1D1D1F]"
            >
              <FileText className="h-4 w-4" />
              Brief Pipeline
            </button>
            <Link
              href="/studio/editor"
              className="group flex items-center gap-2 rounded-full bg-[#1D1D1F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
            >
              <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
              <span className="!text-white">New Content</span>
            </Link>
            <button
              onClick={loadDashboard}
              className="flex items-center gap-2 rounded-full border border-[#D1D1D6] px-4 py-3 text-sm font-semibold text-[#1D1D1F] transition hover:border-[#1D1D1F]"
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <div className="px-6 pb-10 pt-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {isLoading && <p className="text-sm text-[#6E6E73]">Loading dashboard metrics...</p>}
          {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</p>}

          {!isLoading && !error && dashboardData && (
            <>
              <div className="rounded-3xl border border-[#E5E5EA] bg-[#FAFAFA] p-6">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#AEAEB2]">Overview</p>
                    <h2 className="mt-2 text-xl font-semibold text-[#1D1D1F]">Core Metrics</h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#6E6E73]">
                    <FileText className="h-4 w-4" /> Projects & model usage
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Total Projects</p>
                    <p className="mt-2 text-2xl font-semibold text-[#1D1D1F]">{dashboardData.summary.totalProjects}</p>
                    <p className="mt-1 text-xs text-[#6E6E73]">Active portfolio</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Published</p>
                    <p className="mt-2 text-2xl font-semibold text-[#1D1D1F]">{dashboardData.summary.published}</p>
                    <p className="mt-1 text-xs text-[#6E6E73]">Production ready</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">In Review</p>
                    <p className="mt-2 text-2xl font-semibold text-[#1D1D1F]">{dashboardData.summary.inReview}</p>
                    <p className="mt-1 text-xs text-[#6E6E73]">QA & compliance</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Avg SEO</p>
                    <p className="mt-2 text-2xl font-semibold text-[#1D1D1F]">{dashboardData.summary.avgSeoScore}</p>
                    <p className="mt-1 text-xs text-[#6E6E73]">Search posture</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Compliance Rate</p>
                    <p className="mt-2 text-2xl font-semibold text-[#1D1D1F]">{dashboardData.summary.avgComplianceScore}%</p>
                    <p className="mt-1 text-xs text-[#6E6E73]">Policy alignment</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Avg Performance</p>
                    <p className="mt-2 text-2xl font-semibold text-[#1D1D1F]">{avgPerformance ?? 0}</p>
                    <p className="mt-1 text-xs text-[#6E6E73]">Composite score</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Total Generations</p>
                    <p className="mt-2 text-2xl font-semibold text-[#1D1D1F]">{dashboardData.llm.totalGenerations}</p>
                    <p className="mt-1 text-xs text-[#6E6E73]">Model calls</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Briefs vs Content</p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-[#6E6E73]">
                      <span>Briefs: {briefProjectCount}</span>
                      <span>Content: {contentProjectCount}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#6E6E73]">Pipeline mix</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-[#E5E5EA] bg-[#FAFAFA] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrainCircuit className="h-5 w-5 text-[#1D1D1F]" />
                    <h2 className="text-lg font-semibold text-[#1D1D1F]">GEO LLM Coverage</h2>
                  </div>
                  <span className="rounded-full border border-[#D1D1D6] bg-white px-3 py-1 text-xs font-medium text-[#6E6E73]">
                    {dashboardData.llm.providersUsed} provider{dashboardData.llm.providersUsed === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mb-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Primary Model</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D1D1F]">{dashboardData.llm.mostUsedModel}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Generations</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D1D1F]">{dashboardData.llm.totalGenerations}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Providers</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D1D1F]">{dashboardData.llm.providersUsed}</p>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-2">
                  <button
                    onClick={() => setLlmView("engines")}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      llmView === "engines" ? "bg-[#1D1D1F] text-white" : "border border-[#D1D1D6] text-[#6E6E73] hover:border-[#1D1D1F] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Engines
                  </button>
                  <button
                    onClick={() => setLlmView("models")}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      llmView === "models" ? "bg-[#1D1D1F] text-white" : "border border-[#D1D1D6] text-[#6E6E73] hover:border-[#1D1D1F] hover:text-[#1D1D1F]"
                    }`}
                  >
                    Models
                  </button>
                </div>

                {llmView === "engines" ? (
                  <div className="overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white">
                    <table className="w-full border-collapse">
                      <thead className="bg-[#F5F5F7] text-[#6E6E73]">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Engine</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Provider</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Runs</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Last Seen</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.llm.geoCoverage.map((entry) => (
                          <tr key={`${entry.engine}:${entry.provider}`} className="border-t border-[#E5E5EA]">
                            <td className="px-3 py-2 text-sm font-semibold text-[#1D1D1F]">
                              <div className="flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-[#6E6E73]" />
                                {entry.engine}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-sm text-[#6E6E73]">{entry.provider}</td>
                            <td className="px-3 py-2 text-sm text-[#1D1D1F]">{entry.observedRuns}</td>
                            <td className="px-3 py-2 text-sm text-[#6E6E73]">{entry.lastObservedAt ? formatRelative(entry.lastObservedAt) : "Never"}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  entry.status === "active"
                                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border border-[#E5E5EA] bg-[#F5F5F7] text-[#6E6E73]"
                                }`}
                              >
                                {entry.status === "active" ? "Active" : "Not Seen"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white">
                    <table className="w-full border-collapse">
                      <thead className="bg-[#F5F5F7] text-[#6E6E73]">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Observed Model</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Provider</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Runs</th>
                          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Last Used</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.llm.modelUsage.map((entry) => (
                          <tr key={`${entry.provider}:${entry.model}`} className="border-t border-[#E5E5EA]">
                            <td className="px-3 py-2 text-sm font-semibold text-[#1D1D1F]">{entry.model}</td>
                            <td className="px-3 py-2 text-sm text-[#6E6E73]">{entry.provider}</td>
                            <td className="px-3 py-2 text-sm text-[#1D1D1F]">{entry.count}</td>
                            <td className="px-3 py-2 text-sm text-[#6E6E73]">{formatRelative(entry.lastUsedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div
                id="brief-pipeline"
                ref={briefPipelineRef}
                className={`rounded-3xl border bg-[#FAFAFA] p-6 transition-all duration-300 ${
                  briefPipelineFocused ? "border-[#1D1D1F] shadow-[0_0_0_3px_rgba(29,29,31,0.08)]" : "border-[#E5E5EA]"
                }`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-[#AEAEB2]">Brief Pipeline</p>
                    <h2 className="mt-2 text-xl font-semibold text-[#1D1D1F]">Integrated Brief Intelligence</h2>
                  </div>
                  <span className="rounded-full border border-[#D1D1D6] bg-white px-3 py-1 text-xs font-medium text-[#6E6E73]">
                    {briefProjects.length} total briefs
                  </span>
                </div>

                <div className="mb-4 grid gap-3 md:grid-cols-4">
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Briefs</p>
                    <p className="mt-1 text-lg font-semibold text-[#1D1D1F]">{briefProjects.length}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">In Progress</p>
                    <p className="mt-1 text-lg font-semibold text-[#1D1D1F]">{briefActiveCount}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Needs Attention</p>
                    <p className="mt-1 text-lg font-semibold text-[#1D1D1F]">{briefIssueCount}</p>
                  </div>
                  <div className="rounded-2xl border border-[#E5E5EA] bg-white p-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Last Updated</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D1D1F]">
                      {latestBriefUpdate ? formatRelative(latestBriefUpdate) : "Never"}
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#E5E5EA] bg-white">
                  <table className="w-full border-collapse">
                    <thead className="bg-[#F5F5F7] text-[#6E6E73]">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Brief</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Keyword</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Flags</th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em]">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {briefProjects.length > 0 ? (
                        briefProjects.slice(0, 8).map((brief) => {
                          const config = statusConfig[brief.status];
                          return (
                            <tr key={`brief:${brief.id}`} className="border-t border-[#E5E5EA]">
                              <td className="px-3 py-2 text-sm font-semibold text-[#1D1D1F]">{brief.title}</td>
                              <td className="px-3 py-2 text-sm text-[#6E6E73]">{brief.targetKeyword ?? "Not set"}</td>
                              <td className="px-3 py-2">
                                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.border} ${config.bg} ${config.text}`}>
                                  {config.label}
                                </span>
                              </td>
                              <td className="px-3 py-2 text-sm text-[#6E6E73]">{brief.flagCount}</td>
                              <td className="px-3 py-2 text-sm text-[#6E6E73]">{formatRelative(brief.updatedAt)}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-3 py-6 text-center text-sm text-[#AEAEB2]">
                            No briefs in the pipeline yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative mr-2">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#AEAEB2]" />
                    <input
                      value={projectQuery}
                      onChange={(event) => setProjectQuery(event.target.value)}
                      placeholder="Search projects or keyword..."
                      className="w-56 rounded-full border border-[#D1D1D6] bg-white py-2 pl-8 pr-3 text-xs text-[#1D1D1F] placeholder:text-[#AEAEB2] outline-none transition focus:border-[#1D1D1F]"
                    />
                  </div>
                  <div className="flex items-center overflow-hidden rounded-full border border-[#D1D1D6] bg-white p-0.5">
                    {([
                      { key: "all", label: "All", count: projects.length },
                      { key: "content", label: "Content", count: contentProjectCount },
                      { key: "brief", label: "Briefs", count: briefProjectCount },
                    ] as const).map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setSourceFilter(tab.key)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          sourceFilter === tab.key ? "bg-[#1D1D1F] text-white" : "text-[#6E6E73] hover:text-[#1D1D1F]"
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>
                  {(["all", "draft", "in_review", "published"] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                        filter === status
                          ? "bg-[#1D1D1F] text-white"
                          : "border border-[#D1D1D6] text-[#6E6E73] hover:border-[#1D1D1F] hover:text-[#1D1D1F]"
                      }`}
                    >
                      {status === "all" ? "All Projects" : status.split("_").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-[#AEAEB2]">
                  Showing <span className="font-medium text-[#1D1D1F]">{filteredProjects.length}</span> of <span className="font-medium text-[#1D1D1F]">{projects.length}</span> projects
                </p>
              </div>

              <div className="space-y-3">
                {filteredProjects.map((project, index) => {
                  const config = statusConfig[project.status];
                  const projectHref = project.source === "brief" ? "/dashboard#brief-pipeline" : `/studio/editor?id=${project.id}`;
                  return (
                    <Link
                      key={project.id}
                      href={projectHref}
                      className="group block rounded-3xl border border-[#E5E5EA] bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-[#D1D1D6] hover:shadow-md"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              <div className="rounded-2xl border border-[#E5E5EA] bg-[#F5F5F7] p-2 text-[#6E6E73]">
                                <FileText className="h-4 w-4" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-[#1D1D1F] transition-colors group-hover:text-[#6E6E73]">{project.title}</h3>
                                {project.source === "brief" && (
                                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-600">Brief</span>
                                )}
                                <span className={`rounded-full border px-3 py-0.5 text-xs font-medium ${config.border} ${config.bg} ${config.text}`}>{config.label}</span>
                                {project.flagCount > 0 && (
                                  <span className="flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                                    <AlertTriangle className="h-3 w-3" />
                                    {project.flagCount} {project.flagCount === 1 ? "issue" : "issues"}
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 flex items-center gap-4 text-sm text-[#AEAEB2]">
                                <span className="flex items-center gap-1.5">
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatRelative(project.updatedAt)}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <FileText className="h-3.5 w-3.5" />
                                  {project.wordCount.toLocaleString()} words
                                </span>
                                {project.targetKeyword && <span className="truncate text-[#6E6E73]">Keyword: {project.targetKeyword}</span>}
                              </div>
                            </div>
                          </div>
                        </div>

                        {project.source === "brief" ? (
                          <div className="rounded-2xl border border-[#E5E5EA] bg-[#F5F5F7] px-4 py-3 text-sm text-[#6E6E73]">Brief project awaiting analysis scores</div>
                        ) : (
                          <div className="flex items-center gap-6">
                            <ScoreCircle score={project.seoScore} label="SEO" />
                            <ScoreCircle score={project.geoScore} label="GEO" />
                            <ScoreCircle score={project.complianceScore} label="Compliance" />
                            <div className="flex flex-col items-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E5E5EA] bg-[#F5F5F7]">
                                <AlertTriangle className={`h-6 w-6 ${riskColors[project.riskLevel]}`} />
                              </div>
                              <p className="mt-1.5 text-xs font-medium capitalize text-[#6E6E73]">{project.riskLevel}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#F5F5F7]">
                        <div
                          className="h-full rounded-full bg-[#1D1D1F] transition-all duration-1000"
                          style={{ width: `${Math.round((project.seoScore + project.geoScore + project.complianceScore) / 3)}%` }}
                        />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {filteredProjects.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#D1D1D6] bg-[#F5F5F7] py-16">
                  <FileText className="h-12 w-12 text-[#AEAEB2]" />
                  <p className="mt-4 text-lg font-medium text-[#6E6E73]">No projects found</p>
                  <p className="mt-1 text-sm text-[#AEAEB2]">Try adjusting your filters or create a new project</p>
                  <Link href="/studio/editor" className="mt-6 flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black">
                    <Plus className="h-4 w-4" />
                    Create Project
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
