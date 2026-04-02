"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Moon,
  Plus,
  Search,
  User,
  Sun,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WritingLabCore } from "@/components/workspace/WritingLabCore";
import {
  CONSOLE_THEMES,
  THEME_STORAGE_KEY,
  type ConsoleThemeMode,
} from "@/components/console/console-theme";
import { COMMUNICATION_SAVED_EVENT } from "@/lib/console-events";
import { WorkspaceModeNav } from "@/components/platform/WorkspaceModeNav";

const HISTORY_SIDEBAR_KEY = "standex-console-history-sidebar";

type DraftRow = {
  id: string;
  title: string;
  source: string;
  riskLevel: string | null;
  overallScore: number | null;
  createdAt: string;
};

type AnalysisDetail = {
  id: string;
  title: string;
  source: string;
  kind: string;
  contentText: string | null;
  overallScore: number | null;
  toneScore: number | null;
  riskScore: number | null;
  clarityScore: number | null;
  aiProbability: number | null;
  riskLevel: string | null;
  createdAt: string;
};

function formatAnalysisTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function historyBucket(iso: string): "today" | "yesterday" | "earlier" {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "earlier";
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startD = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((startToday - startD) / 86400000);
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  return "earlier";
}

/**
 * Single platform shell: Console (writing analysis) + Generation + theme.
 * Legacy `/writing-lab` redirects here.
 */
export function ConsoleWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [themeMode, setThemeMode] = useState<ConsoleThemeMode>("light");
  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [historyQuery, setHistoryQuery] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [historyDetail, setHistoryDetail] = useState<AnalysisDetail | null>(null);
  const [historyDetailLoading, setHistoryDetailLoading] = useState(false);
  const [historyLoadError, setHistoryLoadError] = useState<string | null>(null);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(true);

  const t = CONSOLE_THEMES[themeMode];

  useEffect(() => {
    const s = localStorage.getItem(THEME_STORAGE_KEY) as ConsoleThemeMode | null;
    if (s === "light" || s === "dark") setThemeMode(s);
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(HISTORY_SIDEBAR_KEY);
    if (raw === "0") setHistorySidebarOpen(false);
    if (raw === "1") setHistorySidebarOpen(true);
  }, []);

  const setHistoryOpen = (open: boolean) => {
    setHistorySidebarOpen(open);
    localStorage.setItem(HISTORY_SIDEBAR_KEY, open ? "1" : "0");
  };

  const persistTheme = (m: ConsoleThemeMode) => {
    setThemeMode(m);
    localStorage.setItem(THEME_STORAGE_KEY, m);
  };

  const applyRecentRows = useCallback(
    (
      recent: Array<{
        id: string;
        title: string;
        source: string;
        riskLevel: string | null;
        overallScore: number | null;
        createdAt: string;
      }>,
    ) => {
      setDrafts(
        recent.map((r) => ({
          id: r.id,
          title: (r.title && r.title.trim()) || "Untitled run",
          source: r.source,
          riskLevel: r.riskLevel,
          overallScore: r.overallScore,
          createdAt: r.createdAt ?? new Date().toISOString(),
        })),
      );
    },
    [],
  );

  const loadDrafts = useCallback(async () => {
    setHistoryLoadError(null);
    try {
      const res = await fetch("/api/communication-analysis", {
        cache: "no-store",
        credentials: "include",
      });
      const data = (await res.json()) as {
        recent?: Array<{
          id: string;
          title: string;
          source: string;
          riskLevel: string | null;
          overallScore: number | null;
          createdAt: string;
        }>;
        error?: string;
      };
      if (res.ok) {
        applyRecentRows(data.recent ?? []);
        return;
      }
      if (res.status === 401) {
        setDrafts([]);
        setHistoryLoadError(data.error || "Sign in to see history");
        return;
      }
      const fallback = await fetch("/api/console", { cache: "no-store", credentials: "include" });
      const fb = (await fallback.json()) as {
        communication?: {
          recent?: Array<{
            id: string;
            title: string;
            source: string;
            riskLevel: string | null;
            overallScore: number | null;
            createdAt: string;
          }>;
        };
        error?: string;
      };
      if (fallback.ok) {
        applyRecentRows(fb.communication?.recent ?? []);
        return;
      }
      setDrafts([]);
      setHistoryLoadError(data.error || fb.error || `Could not load history (${res.status})`);
    } catch {
      setDrafts([]);
      setHistoryLoadError("Network error loading history");
    }
  }, [applyRecentRows]);

  useEffect(() => {
    void loadDrafts();
  }, [loadDrafts]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") void loadDrafts();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [loadDrafts]);

  useEffect(() => {
    const onSaved = () => void loadDrafts();
    window.addEventListener(COMMUNICATION_SAVED_EVENT, onSaved);
    return () => window.removeEventListener(COMMUNICATION_SAVED_EVENT, onSaved);
  }, [loadDrafts]);

  useEffect(() => {
    if (!selectedHistoryId) {
      setHistoryDetail(null);
      return;
    }
    let cancelled = false;
    setHistoryDetailLoading(true);
    setHistoryDetail(null);
    void fetch(`/api/communication-analysis/${encodeURIComponent(selectedHistoryId)}`, {
      cache: "no-store",
      credentials: "include",
    })
      .then(async (res) => {
        const data = (await res.json()) as { analysis?: AnalysisDetail; error?: string };
        if (!res.ok) throw new Error(data.error || "Failed");
        if (!cancelled && data.analysis) setHistoryDetail(data.analysis);
      })
      .catch(() => {
        if (!cancelled) setHistoryDetail(null);
      })
      .finally(() => {
        if (!cancelled) setHistoryDetailLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedHistoryId]);

  /** Voice coach removed — normalize legacy `?tab=voice` / `?voice=1` to Console. */
  useEffect(() => {
    if (searchParams.get("tab") === "voice" || searchParams.get("voice") === "1") {
      const q = new URLSearchParams(searchParams.toString());
      q.delete("voice");
      q.set("tab", "lab");
      router.replace(`/console?${q.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  /** Generation tab removed — AI generate lives in Console; keep deep links working. */
  useEffect(() => {
    if (searchParams.get("tab") === "gen") {
      const q = new URLSearchParams(searchParams.toString());
      q.set("tab", "lab");
      router.replace(`/console?${q.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  const setTab = (next: "lab" | "gen") => {
    const q = new URLSearchParams(searchParams.toString());
    q.set("tab", next);
    q.delete("voice");
    router.replace(`/console?${q.toString()}`, { scroll: false });
  };

  const filteredDrafts = useMemo(() => {
    const q = historyQuery.trim().toLowerCase();
    if (!q) return drafts;
    return drafts.filter((d) => d.title.toLowerCase().includes(q));
  }, [drafts, historyQuery]);

  const historySnapshot = useMemo(() => {
    if (!selectedHistoryId || historyDetailLoading || !historyDetail) return null;
    if (historyDetail.id !== selectedHistoryId) return null;
    return { id: historyDetail.id, contentText: historyDetail.contentText };
  }, [selectedHistoryId, historyDetail, historyDetailLoading]);

  const grouped = useMemo(() => {
    const today: DraftRow[] = [];
    const yesterday: DraftRow[] = [];
    const earlier: DraftRow[] = [];
    for (const d of filteredDrafts) {
      const b = historyBucket(d.createdAt);
      if (b === "today") today.push(d);
      else if (b === "yesterday") yesterday.push(d);
      else earlier.push(d);
    }
    return { today, yesterday, earlier };
  }, [filteredDrafts]);

  const HistorySection = ({
    label,
    items,
  }: {
    label: string;
    items: DraftRow[];
  }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <p className={cn("mb-2 px-1 text-[12px] font-semibold uppercase tracking-wide", t.muted2)}>{label}</p>
        <ul className="space-y-0.5">
          {items.map((d) => {
            const active = selectedHistoryId === d.id;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (active) {
                      setSelectedHistoryId(null);
                    } else {
                      setSelectedHistoryId(d.id);
                    }
                  }}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg px-2 py-2.5 text-left transition-colors",
                    active
                      ? themeMode === "dark"
                        ? "bg-white/[0.1]"
                        : "bg-black/[0.06]"
                      : cn(t.muted, t.navHover),
                  )}
                >
                  <MessageSquare
                    className={cn("mt-0.5 h-4 w-4 shrink-0", active ? t.text : t.muted2)}
                    strokeWidth={1.75}
                  />
                  <div className="min-w-0 flex-1">
                    <p className={cn("line-clamp-2 text-[14px] leading-snug", active ? t.text : t.muted)}>{d.title}</p>
                    <p className={cn("mt-0.5 text-[12px]", t.muted2)}>
                      <span className={t.mono}>{formatAnalysisTime(d.createdAt)}</span>
                      {d.overallScore != null && (
                        <>
                          <span className="mx-1 opacity-50">·</span>
                          <span className="tabular-nums">{d.overallScore}</span>
                        </>
                      )}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "relative flex h-[100dvh] flex-col overflow-hidden [font-family:var(--font-landing-sans),sans-serif] text-[14px] leading-snug antialiased",
        t.shell,
        t.scrollbar,
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(237,235,228,0.04),transparent_55%)]",
          themeMode === "light" && "bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(17,17,16,0.03),transparent_55%)]",
        )}
      />

      <header
        className={cn(
          "relative z-10 flex h-12 shrink-0 items-center gap-3 px-4 backdrop-blur-md lg:gap-4 lg:px-6",
          t.workspaceSurface,
        )}
      >
        <WorkspaceModeNav active="console" consoleTheme={t} consoleThemeMode={themeMode} />

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/r/me"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
              t.borderSub,
              t.muted,
              t.navHover,
            )}
            title="My Profile"
          >
            <User className="h-4 w-4" strokeWidth={1.8} />
          </Link>
          <button
            type="button"
            onClick={() => persistTheme(themeMode === "dark" ? "light" : "dark")}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
              t.borderSub,
              t.muted,
              t.navHover,
            )}
            title={themeMode === "dark" ? "Light background" : "Dark background"}
          >
            {themeMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
        {historySidebarOpen ? (
          <aside
            className={cn(
              "flex min-h-[40vh] min-w-0 flex-col lg:min-h-0 lg:w-[min(100%,280px)] lg:max-w-[280px] lg:shrink-0",
              t.railSurface,
              themeMode === "dark"
                ? "shadow-[6px_0_28px_-12px_rgba(0,0,0,0.65)]"
                : "shadow-[6px_0_28px_-14px_rgba(0,0,0,0.1)]",
            )}
          >
            <div className="shrink-0 px-3 py-2.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className={cn("text-[13px] font-semibold tracking-tight", t.text)}>History</h2>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setHistoryOpen(false)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                      t.muted,
                      t.navHover,
                    )}
                    title="Collapse history"
                    aria-label="Collapse history"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <Link
                    href="/console?tab=lab"
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold transition-colors",
                      t.muted,
                      t.navHover,
                    )}
                    onClick={() => {
                      setSelectedHistoryId(null);
                      setHistoryQuery("");
                    }}
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    New
                  </Link>
                </div>
              </div>
              <div className="relative">
                <Search
                  className={cn("pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2", t.muted2)}
                  strokeWidth={2}
                />
                <input
                  type="search"
                  value={historyQuery}
                  onChange={(e) => setHistoryQuery(e.target.value)}
                  placeholder="Search…"
                  className={cn(
                    "w-full rounded-lg border py-2 pl-8 pr-2 text-[13px] outline-none placeholder:opacity-60",
                    t.input,
                  )}
                  aria-label="Search analysis history"
                />
              </div>
            </div>

            <div className={cn("min-h-0 flex-1 overflow-y-auto px-2 py-2", t.scrollbar)}>
              {historyLoadError ? (
                <div className={cn("rounded-lg border border-dashed px-3 py-4 text-center", t.borderSub)}>
                  <p className={cn("text-[12px] leading-relaxed", t.danger)}>{historyLoadError}</p>
                  <button
                    type="button"
                    onClick={() => void loadDrafts()}
                    className={cn("mt-2 text-[12px] font-semibold underline", t.muted, t.navHover)}
                  >
                    Retry
                  </button>
                </div>
              ) : filteredDrafts.length === 0 ? (
                <div className={cn("rounded-lg border border-dashed px-3 py-8 text-center", t.borderSub)}>
                  <p className={cn("text-[12px] leading-relaxed", t.muted)}>
                    {drafts.length === 0
                      ? "No runs yet. Run Communication or all analyses in Console."
                      : "No matches. Try another search."}
                  </p>
                </div>
              ) : (
                <>
                  <HistorySection label="Today" items={grouped.today} />
                  <HistorySection label="Yesterday" items={grouped.yesterday} />
                  <HistorySection label="Earlier" items={grouped.earlier} />
                </>
              )}
            </div>

            {selectedHistoryId && (
            <div
              className={cn(
                "shrink-0 px-3 py-3",
                themeMode === "dark" ? "bg-[#121211]" : "bg-zinc-100/90",
              )}
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className={cn("text-[11px] font-semibold uppercase tracking-wide", t.muted2)}>Run summary</p>
                <button
                  type="button"
                  className={cn("rounded p-0.5", t.muted, t.navHover)}
                  aria-label="Close detail"
                  onClick={() => setSelectedHistoryId(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {historyDetailLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className={cn("h-6 w-6 animate-spin", t.muted)} />
                </div>
              ) : historyDetail ? (
                <div className="space-y-2">
                  <p className={cn("line-clamp-2 text-[13px] font-medium leading-snug", t.text)}>{historyDetail.title}</p>
                  <div className={cn("grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]", t.muted2)}>
                    <span>Overall</span>
                    <span className={cn("text-right tabular-nums", t.text)}>{historyDetail.overallScore ?? "—"}</span>
                    <span>Tone</span>
                    <span className={cn("text-right tabular-nums", t.text)}>{historyDetail.toneScore ?? "—"}</span>
                    <span>Risk</span>
                    <span className={cn("text-right tabular-nums", t.text)}>{historyDetail.riskScore ?? "—"}</span>
                    <span>Clarity</span>
                    <span className={cn("text-right tabular-nums", t.text)}>{historyDetail.clarityScore ?? "—"}</span>
                    <span>AI %</span>
                    <span className={cn("text-right tabular-nums", t.text)}>{historyDetail.aiProbability ?? "—"}</span>
                    <span>Compliance</span>
                    <span className={cn("text-right uppercase", t.text)}>{historyDetail.riskLevel ?? "—"}</span>
                  </div>
                  <p className={cn("text-[11px] leading-relaxed", t.muted2)}>
                    {formatAnalysisTime(historyDetail.createdAt)} · {historyDetail.source} · {historyDetail.kind}
                  </p>
                </div>
              ) : (
                <p className={cn("text-[12px]", t.danger)}>Could not load this run.</p>
              )}
            </div>
          )}
        </aside>
        ) : (
          <div className={cn("flex w-full shrink-0 flex-col items-center py-2 lg:w-11 lg:py-3", t.railSurface)}>
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                t.muted,
                t.navHover,
              )}
              title="Show history"
              aria-label="Show history"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
            <span className="mt-2 hidden lg:block" aria-hidden>
              <MessageSquare className={cn("h-4 w-4 opacity-40", t.muted2)} strokeWidth={1.5} />
            </span>
          </div>
        )}

        <div className={cn("relative min-h-0 min-w-0 flex-1", t.workspaceSurface)}>
          <div className="flex h-full min-h-0 flex-col">
            <WritingLabCore
              themeMode={themeMode}
              historySnapshot={historySnapshot}
              historySelectionId={selectedHistoryId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
