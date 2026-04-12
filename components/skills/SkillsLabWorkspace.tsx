"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  MessageSquare,
  Mic,
  Plus,
  RefreshCw,
  Search,
  Settings,
  PenLine,
  Square,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ExamFramework } from "@/lib/exam-eval-llm";
import { WorkspaceModeNav } from "@/components/platform/WorkspaceModeNav";
import { SKILLS_RUN_SAVED_EVENT } from "@/lib/skills-events";
import {
  formatDailyPracticeDate,
  pickDailySpeakingCue,
  pickDailyWritingPrompt,
} from "@/lib/skills-daily-prompts";

type TabId = "writing" | "speaking";

type Perspective = {
  id?: string;
  label?: string;
  band?: number;
  feedback?: string;
  focusNote?: string;
};

type BreakdownBand = { band?: number; comment?: string };

type EvalResult = {
  examLabel?: string;
  overallBand?: number;
  breakdown?: {
    taskResponse?: BreakdownBand;
    coherenceCohesion?: BreakdownBand;
    lexicalResource?: BreakdownBand;
    grammaticalRange?: BreakdownBand;
  };
  perspectives?: Perspective[];
  whyScoresDiffer?: string;
  problemSentences?: Array<{ quote?: string; issue?: string; better?: string }>;
  fillerWordsIfAny?: string[];
  improvedVersion?: string;
  rewriteBullets?: string[];
};

type DraftRow = {
  id: string;
  title: string;
  mode: string;
  overallBand: number | null;
  createdAt: string;
};

type RunDetail = {
  id: string;
  title: string;
  mode: string;
  examFramework: string | null;
  taskPrompt: string | null;
  bodyText: string;
  simPrompt: string | null;
  overallBand: number | null;
  resultJson: unknown;
  createdAt: string;
};

const FRAMEWORK_OPTIONS: { value: ExamFramework; label: string }[] = [
  { value: "ielts_task2", label: "IELTS Writing Task 2" },
  { value: "toefl_independent", label: "TOEFL Independent" },
  { value: "pte_essay", label: "PTE Essay" },
  { value: "det_writing", label: "Duolingo English Test" },
];

const SIM_MINUTES = 40;
const HISTORY_SIDEBAR_KEY = "standex-skills-history-sidebar";

function safeNum(v: unknown): number | undefined {
  return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
}

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

function isEvalResult(v: unknown): v is EvalResult {
  return v != null && typeof v === "object";
}

export function SkillsLabWorkspace() {
  const [tab, setTab] = useState<TabId>("writing");
  const [framework, setFramework] = useState<ExamFramework>("ielts_task2");
  const [writingVariant, setWritingVariant] = useState(0);
  const [speakingVariant, setSpeakingVariant] = useState(0);
  const [taskPrompt, setTaskPrompt] = useState("");
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EvalResult | null>(null);

  const dailyWrite = useMemo(() => pickDailyWritingPrompt(new Date(), writingVariant), [writingVariant]);
  const dailySpeak = useMemo(() => pickDailySpeakingCue(new Date(), speakingVariant), [speakingVariant]);

  const [timedPracticeOn, setTimedPracticeOn] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SIM_MINUTES * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerStartedRef = useRef(false);

  const [speakingPrompt, setSpeakingPrompt] = useState("");
  const [transcript, setTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const [drafts, setDrafts] = useState<DraftRow[]>([]);
  const [historyQuery, setHistoryQuery] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [historyDetail, setHistoryDetail] = useState<RunDetail | null>(null);
  const [historyDetailLoading, setHistoryDetailLoading] = useState(false);
  const [historyLoadError, setHistoryLoadError] = useState<string | null>(null);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(HISTORY_SIDEBAR_KEY);
    if (raw === "0") setHistorySidebarOpen(false);
    if (raw === "1") setHistorySidebarOpen(true);
  }, []);

  useEffect(() => {
    if (selectedHistoryId) return;
    setTaskPrompt(dailyWrite);
  }, [selectedHistoryId, dailyWrite]);

  useEffect(() => {
    if (selectedHistoryId) return;
    setSpeakingPrompt(dailySpeak);
  }, [selectedHistoryId, dailySpeak]);

  const setHistoryOpen = (open: boolean) => {
    setHistorySidebarOpen(open);
    localStorage.setItem(HISTORY_SIDEBAR_KEY, open ? "1" : "0");
  };

  const loadDrafts = useCallback(async () => {
    setHistoryLoadError(null);
    try {
      const res = await fetch("/api/skills-runs", { cache: "no-store", credentials: "include" });
      const data = (await res.json()) as {
        recent?: DraftRow[];
        error?: string;
      };
      if (res.ok) {
        setDrafts(data.recent ?? []);
        return;
      }
      if (res.status === 401) {
        setDrafts([]);
        setHistoryLoadError(data.error || "Sign in to see history");
        return;
      }
      setDrafts([]);
      setHistoryLoadError(data.error || `Could not load history (${res.status})`);
    } catch {
      setDrafts([]);
      setHistoryLoadError("Network error loading history");
    }
  }, []);

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
    window.addEventListener(SKILLS_RUN_SAVED_EVENT, onSaved);
    return () => window.removeEventListener(SKILLS_RUN_SAVED_EVENT, onSaved);
  }, [loadDrafts]);

  useEffect(() => {
    if (!selectedHistoryId) {
      setHistoryDetail(null);
      return;
    }
    let cancelled = false;
    setHistoryDetailLoading(true);
    setHistoryDetail(null);
    void fetch(`/api/skills-runs/${encodeURIComponent(selectedHistoryId)}`, {
      cache: "no-store",
      credentials: "include",
    })
      .then(async (res) => {
        const data = (await res.json()) as { run?: RunDetail; error?: string };
        if (!res.ok) throw new Error(data.error || "Failed");
        if (!cancelled && data.run) setHistoryDetail(data.run);
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

  const lastHydratedRunId = useRef<string | null>(null);

  useEffect(() => {
    if (!selectedHistoryId) {
      lastHydratedRunId.current = null;
      return;
    }
    if (!historyDetail || historyDetail.id !== selectedHistoryId) return;
    if (lastHydratedRunId.current === historyDetail.id) return;
    lastHydratedRunId.current = historyDetail.id;

    const m = historyDetail.mode as string;
    if (m === "speaking") {
      setTab("speaking");
    } else {
      setTab("writing");
    }
    if (historyDetail.examFramework) {
      const f = historyDetail.examFramework as ExamFramework;
      if (FRAMEWORK_OPTIONS.some((o) => o.value === f)) setFramework(f);
    }
    if (m === "speaking") {
      setTranscript(historyDetail.bodyText);
      setSpeakingPrompt(historyDetail.taskPrompt ?? pickDailySpeakingCue(new Date(), 0));
      setEssay("");
      setTimedPracticeOn(false);
      timerStartedRef.current = false;
      setTimerRunning(false);
      setSecondsLeft(SIM_MINUTES * 60);
    } else if (m === "simulation") {
      setEssay(historyDetail.bodyText);
      setTaskPrompt(historyDetail.simPrompt ?? historyDetail.taskPrompt ?? pickDailyWritingPrompt(new Date(), 0));
      setTranscript("");
      setTimedPracticeOn(true);
      timerStartedRef.current = false;
      setTimerRunning(false);
      setSecondsLeft(SIM_MINUTES * 60);
    } else {
      setEssay(historyDetail.bodyText);
      setTaskPrompt(historyDetail.taskPrompt ?? pickDailyWritingPrompt(new Date(), 0));
      setTranscript("");
      setTimedPracticeOn(false);
      timerStartedRef.current = false;
      setTimerRunning(false);
      setSecondsLeft(SIM_MINUTES * 60);
    }
    if (isEvalResult(historyDetail.resultJson)) {
      setResult(historyDetail.resultJson);
    } else {
      setResult(null);
    }
  }, [historyDetail, selectedHistoryId]);

  useEffect(() => {
    if (!timerRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  const resetWritingTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(SIM_MINUTES * 60);
    timerStartedRef.current = false;
  };

  const persistRun = useCallback(async (evalResult: EvalResult, currentTab: TabId) => {
    const bodyText = currentTab === "speaking" ? transcript : essay;
    const title =
      (typeof evalResult.examLabel === "string" && evalResult.examLabel.trim().slice(0, 120)) ||
      bodyText.trim().slice(0, 72).replace(/\s+/g, " ") ||
      "Practice run";
    const overallBand =
      typeof evalResult.overallBand === "number" && !Number.isNaN(evalResult.overallBand)
        ? evalResult.overallBand
        : null;

    let examFramework: string | null = null;
    let taskPromptVal: string | null = null;
    if (currentTab === "writing") {
      examFramework = framework;
      taskPromptVal = taskPrompt.trim() || null;
    } else {
      examFramework = "ielts_speaking2";
      taskPromptVal = speakingPrompt.trim() || null;
    }

    try {
      const res = await fetch("/api/skills-runs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          mode: currentTab,
          examFramework,
          taskPrompt: taskPromptVal,
          simPrompt: null,
          bodyText,
          overallBand,
          resultJson: evalResult,
        }),
      });
      if (res.ok) {
        window.dispatchEvent(new Event(SKILLS_RUN_SAVED_EVENT));
      }
    } catch {
      /* non-blocking */
    }
  }, [essay, transcript, framework, taskPrompt, speakingPrompt]);

  const runEvaluate = useCallback(
    async (payload: {
      text: string;
      framework: ExamFramework;
      taskPrompt?: string;
      timedContext?: string;
      saveTab: TabId;
    }) => {
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const res = await fetch("/api/exam-evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await res.json()) as { result?: EvalResult; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Request failed");
        const r = data.result ?? null;
        setResult(r);
        if (r) void persistRun(r, payload.saveTab);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [persistRun],
  );

  const onSubmitWriting = () => {
    let timedContext: string | undefined;
    if (timedPracticeOn && timerStartedRef.current) {
      const elapsed = SIM_MINUTES * 60 - secondsLeft;
      timedContext =
        secondsLeft === 0
          ? `Candidate wrote under a ${SIM_MINUTES}-minute countdown; timer reached zero.`
          : `Candidate stopped with ${Math.floor(elapsed / 60)}m ${elapsed % 60}s elapsed of a ${SIM_MINUTES}-minute window.`;
    }
    void runEvaluate({
      text: essay,
      framework,
      taskPrompt: taskPrompt.trim() || undefined,
      timedContext,
      saveTab: "writing",
    });
  };

  const transcribeBlob = async (blob: Blob) => {
    const fd = new FormData();
    const file = new File([blob], "recording.webm", { type: blob.type || "audio/webm" });
    fd.append("file", file);
    const res = await fetch("/api/transcribe", { method: "POST", body: fd });
    const data = (await res.json()) as { text?: string; error?: string };
    if (!res.ok) throw new Error(data.error ?? "Transcription failed");
    return data.text ?? "";
  };

  const stopRecording = useCallback(() => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    setRecording(false);
    mediaRecorderRef.current = null;
  }, []);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mime });
        void (async () => {
          setLoading(true);
          try {
            const text = await transcribeBlob(blob);
            setTranscript(text);
          } catch (e) {
            setError(e instanceof Error ? e.message : "Transcription failed");
          } finally {
            setLoading(false);
          }
        })();
      };
      mr.start();
      setRecording(true);
    } catch {
      setError("Microphone access denied or unavailable.");
    }
  };

  const runSpeakingAnalysis = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/exam-speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          taskPrompt: speakingPrompt.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { result?: EvalResult; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      const r = data.result ?? null;
      setResult(r);
      if (r) void persistRun(r, "speaking");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const filteredDrafts = useMemo(() => {
    const q = historyQuery.trim().toLowerCase();
    if (!q) return drafts;
    return drafts.filter((d) => d.title.toLowerCase().includes(q));
  }, [drafts, historyQuery]);

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

  const startNew = () => {
    lastHydratedRunId.current = null;
    setWritingVariant(0);
    setSpeakingVariant(0);
    setSelectedHistoryId(null);
    setHistoryDetail(null);
    setHistoryQuery("");
    setResult(null);
    setError(null);
    setTimedPracticeOn(false);
    resetWritingTimer();
  };

  const perspectives = result?.perspectives ?? [];
  const breakdown = result?.breakdown;

  const HistorySection = ({ label, items }: { label: string; items: DraftRow[] }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-4">
        <p className="mb-2 px-1 text-[12px] font-semibold uppercase tracking-wide text-zinc-500">{label}</p>
        <ul className="space-y-0.5">
          {items.map((d) => {
            const active = selectedHistoryId === d.id;
            return (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => {
                    if (active) setSelectedHistoryId(null);
                    else setSelectedHistoryId(d.id);
                  }}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg px-2 py-2.5 text-left transition-colors",
                    active ? "bg-indigo-50 ring-1 ring-indigo-100" : "text-zinc-600 hover:bg-zinc-100",
                  )}
                >
                  <MessageSquare className={cn("mt-0.5 h-4 w-4 shrink-0", active ? "text-indigo-700" : "text-zinc-400")} strokeWidth={1.75} />
                  <div className="min-w-0 flex-1">
                    <p className={cn("line-clamp-2 text-[14px] leading-snug", active ? "font-medium text-zinc-900" : "text-zinc-700")}>
                      {d.title}
                    </p>
                    <p className="mt-0.5 text-[12px] text-zinc-500">
                      <span className="font-mono tabular-nums">{formatAnalysisTime(d.createdAt)}</span>
                      {d.overallBand != null && (
                        <>
                          <span className="mx-1 opacity-50">·</span>
                          <span className="tabular-nums">band {d.overallBand}</span>
                        </>
                      )}
                      <span className="mx-1 opacity-50">·</span>
                      <span className="uppercase">{d.mode}</span>
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
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-zinc-50 text-zinc-900 antialiased">
      <header className="flex h-12 min-h-12 shrink-0 items-center gap-2 border-b border-zinc-200 bg-white px-3 backdrop-blur-md sm:gap-3 sm:px-4 lg:gap-4 lg:px-6">
        <WorkspaceModeNav active="skills" className="min-w-0" />
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/settings"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
            title="Settings"
          >
            <Settings className="h-4 w-4" strokeWidth={1.8} />
          </Link>
        </div>
      </header>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
        {historySidebarOpen ? (
          <aside className="flex min-h-[36vh] w-full flex-col border-b border-zinc-200 bg-white shadow-[6px_0_28px_-14px_rgba(0,0,0,0.08)] lg:min-h-0 lg:w-[min(100%,280px)] lg:max-w-[280px] lg:shrink-0 lg:border-b-0 lg:border-r">
            <div className="shrink-0 px-3 py-2.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <h2 className="text-[13px] font-semibold tracking-tight text-zinc-900">History</h2>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setHistoryOpen(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
                    title="Collapse history"
                    aria-label="Collapse history"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[12px] font-semibold text-zinc-600 transition-colors hover:bg-zinc-100"
                    onClick={startNew}
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                    New
                  </button>
                </div>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" strokeWidth={2} />
                <input
                  type="search"
                  value={historyQuery}
                  onChange={(e) => setHistoryQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-8 pr-2 text-[13px] text-zinc-900 outline-none placeholder:text-zinc-400"
                  aria-label="Search skills history"
                />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
              {historyLoadError ? (
                <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-4 text-center">
                  <p className="text-[12px] leading-relaxed text-red-700">{historyLoadError}</p>
                  <button
                    type="button"
                    onClick={() => void loadDrafts()}
                    className="mt-2 text-[12px] font-semibold text-zinc-600 underline hover:text-zinc-900"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredDrafts.length === 0 ? (
                <div className="rounded-lg border border-dashed border-zinc-200 px-3 py-8 text-center">
                  <p className="text-[12px] leading-relaxed text-zinc-500">
                    {drafts.length === 0
                      ? "No runs yet. Submit a writing or speaking practice to build history."
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

            {selectedHistoryId ? (
              <div className="shrink-0 border-t border-zinc-100 bg-zinc-50/90 px-3 py-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">Run summary</p>
                  <button
                    type="button"
                    className="rounded p-0.5 text-zinc-500 hover:bg-zinc-200/80"
                    aria-label="Close detail"
                    onClick={() => setSelectedHistoryId(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {historyDetailLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                  </div>
                ) : historyDetail ? (
                  <div className="space-y-2">
                    <p className="line-clamp-2 text-[13px] font-medium leading-snug text-zinc-900">{historyDetail.title}</p>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-zinc-500">
                      <span>Band</span>
                      <span className="text-right tabular-nums text-zinc-900">{historyDetail.overallBand ?? "—"}</span>
                      <span>Mode</span>
                      <span className="text-right uppercase text-zinc-900">{historyDetail.mode}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-500">
                      {formatAnalysisTime(historyDetail.createdAt)}
                    </p>
                  </div>
                ) : (
                  <p className="text-[12px] text-red-700">Could not load this run.</p>
                )}
              </div>
            ) : null}
          </aside>
        ) : (
          <div className="flex w-full shrink-0 flex-col items-center border-b border-zinc-200 bg-white py-2 lg:w-11 lg:border-b-0 lg:border-r lg:py-3">
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100"
              title="Show history"
              aria-label="Show history"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
            <span className="mt-2 hidden lg:block" aria-hidden>
              <MessageSquare className="h-4 w-4 text-zinc-300" strokeWidth={1.5} />
            </span>
          </div>
        )}

        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-zinc-50">
          <div className="border-b border-zinc-200 bg-white px-4 py-3 lg:px-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">Daily practice</p>
            <p className="mt-1 max-w-2xl text-[13px] leading-snug text-zinc-600">
              Fixed prompts, structured scores. Optional timed writing below.{" "}
              <Link href="/console" className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-2 hover:decoration-zinc-500">
                Console
              </Link>{" "}
              is for org workflows.
            </p>
            <div className="mt-3 flex gap-0 border-b border-zinc-200">
              {(
                [
                  { id: "writing" as const, label: "Writing", icon: PenLine },
                  { id: "speaking" as const, label: "Speaking", icon: Mic },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setTab(id);
                    setError(null);
                  }}
                  className={cn(
                    "-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors",
                    tab === id
                      ? "border-zinc-900 text-zinc-900"
                      : "border-transparent text-zinc-500 hover:text-zinc-800",
                  )}
                >
                  <Icon className="h-4 w-4 opacity-80" strokeWidth={1.75} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-8">
            <div className="mx-auto flex max-w-5xl flex-col gap-6">
              {tab === "writing" && (
                <section className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
                    <div className="flex items-center gap-2 text-[13px] text-zinc-800">
                      <Calendar className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.75} />
                      <span className="font-medium">{formatDailyPracticeDate(new Date())}</span>
                    </div>
                    <button
                      type="button"
                      disabled={Boolean(selectedHistoryId)}
                      onClick={() => setWritingVariant((v) => v + 1)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                      title={selectedHistoryId ? "Clear history selection to change task" : "Another angle today"}
                    >
                      <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                      Another prompt
                    </button>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="mb-2 text-[12px] font-medium text-zinc-500">Writing task</p>
                    <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-[14px] leading-relaxed text-zinc-900">
                      {taskPrompt || dailyWrite}
                    </div>

                    <div className="mt-5 border-t border-zinc-100 pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-zinc-500" strokeWidth={1.75} />
                          <div>
                            <p className="text-[13px] font-medium text-zinc-900">Timed practice</p>
                            <p className="text-[11px] text-zinc-500">{SIM_MINUTES}-minute window · optional</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={timedPracticeOn}
                          disabled={Boolean(selectedHistoryId)}
                          onClick={() => {
                            const next = !timedPracticeOn;
                            setTimedPracticeOn(next);
                            if (!next) {
                              setTimerRunning(false);
                              setSecondsLeft(SIM_MINUTES * 60);
                              timerStartedRef.current = false;
                            }
                          }}
                          className={cn(
                            "relative h-7 w-11 shrink-0 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400 disabled:opacity-50",
                            timedPracticeOn ? "bg-zinc-900" : "bg-zinc-200",
                          )}
                        >
                          <span
                            className={cn(
                              "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ease-out",
                              timedPracticeOn ? "translate-x-4" : "translate-x-0.5",
                            )}
                            aria-hidden
                          />
                        </button>
                      </div>
                      {timedPracticeOn ? (
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <div
                            className={cn(
                              "rounded-md border px-3 py-2 font-mono text-xl font-semibold tabular-nums tracking-tight",
                              secondsLeft <= 120 && secondsLeft > 0
                                ? "border-amber-200 bg-amber-50 text-amber-950"
                                : secondsLeft === 0
                                  ? "border-red-200 bg-red-50 text-red-900"
                                  : "border-zinc-200 bg-zinc-50 text-zinc-900",
                            )}
                          >
                            {fmtTime(secondsLeft)}
                          </div>
                          {!timerRunning ? (
                            <button
                              type="button"
                              onClick={() => {
                                timerStartedRef.current = true;
                                setTimerRunning(true);
                              }}
                              className="rounded-md bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-zinc-800"
                            >
                              Start
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setTimerRunning(false)}
                              className="rounded-md border border-zinc-200 bg-white px-4 py-2 text-[13px] font-medium text-zinc-800 transition hover:bg-zinc-50"
                            >
                              Pause
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={resetWritingTimer}
                            className="text-[13px] font-medium text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-zinc-900"
                          >
                            Reset
                          </button>
                        </div>
                      ) : null}
                    </div>

                    <label className="mb-2 mt-5 block text-[12px] font-medium text-zinc-500">Rubric</label>
                    <select
                      value={framework}
                      onChange={(e) => setFramework(e.target.value as ExamFramework)}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-[13px] text-zinc-900"
                    >
                      {FRAMEWORK_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <label className="mb-2 mt-4 block text-[12px] font-medium text-zinc-500">Your response</label>
                    <textarea
                      value={essay}
                      onChange={(e) => setEssay(e.target.value)}
                      placeholder="Write your answer. For essay-style rubrics, aim for clear structure and sufficient length."
                      rows={14}
                      className="w-full rounded-md border border-zinc-200 px-3 py-2.5 text-[13px] leading-relaxed text-zinc-900 placeholder:text-zinc-400"
                    />
                    <button
                      type="button"
                      disabled={loading || !essay.trim() || !(taskPrompt || dailyWrite).trim()}
                      onClick={onSubmitWriting}
                      className="mt-4 inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" strokeWidth={2} />}
                      Get feedback
                    </button>
                  </div>
                </section>
              )}

              {tab === "speaking" && (
                <section className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-4">
                    <div className="flex items-center gap-2 text-[13px] text-zinc-800">
                      <Calendar className="h-4 w-4 shrink-0 text-zinc-500" strokeWidth={1.75} />
                      <span className="font-medium">Speaking cue</span>
                    </div>
                    <button
                      type="button"
                      disabled={Boolean(selectedHistoryId)}
                      onClick={() => setSpeakingVariant((v) => v + 1)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-[12px] font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
                      Another cue
                    </button>
                  </div>
                  <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="mb-2 text-[12px] font-medium text-zinc-500">Cue</p>
                    <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-[14px] leading-relaxed text-zinc-900">
                      {speakingPrompt || dailySpeak}
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {!recording ? (
                        <button
                          type="button"
                          onClick={() => void startRecording()}
                          disabled={loading}
                          className="inline-flex items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 py-2 text-[13px] font-medium text-zinc-900 shadow-sm transition hover:bg-zinc-50 disabled:opacity-50"
                        >
                          <Mic className="h-4 w-4" strokeWidth={2} />
                          Record
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-[13px] font-medium text-white transition hover:bg-zinc-800"
                        >
                          <Square className="h-3 w-3 fill-current" />
                          Stop &amp; transcribe
                        </button>
                      )}
                      {recording ? (
                        <span className="flex items-center gap-2 text-[13px] text-zinc-600">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                          </span>
                          Recording
                        </span>
                      ) : null}
                    </div>
                    <label className="mb-2 mt-5 block text-[12px] font-medium text-zinc-500">Transcript</label>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      rows={10}
                      placeholder="Appears after recording, or paste your own text."
                      className="w-full rounded-md border border-zinc-200 px-3 py-2.5 text-[13px] leading-relaxed text-zinc-900 placeholder:text-zinc-400"
                    />
                    <button
                      type="button"
                      disabled={loading || !transcript.trim()}
                      onClick={() => void runSpeakingAnalysis()}
                      className="mt-4 inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} /> : <Mic className="h-4 w-4" strokeWidth={2} />}
                      Analyse speaking
                    </button>
                  </div>
                </section>
              )}

              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
              ) : null}

              {result ? (
                <section className="space-y-6 pb-12">
                  <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">Summary</p>
                    <h2 className="mt-1 text-xl font-bold text-zinc-900">{result.examLabel ?? "Feedback"}</h2>
                    <p className="mt-2 text-4xl font-bold tabular-nums text-indigo-700">
                      {safeNum(result.overallBand) ?? "—"}
                      <span className="ml-2 text-base font-semibold text-zinc-500">overall</span>
                    </p>
                  </div>

                  {breakdown ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(
                        [
                          ["Task response", breakdown.taskResponse],
                          ["Coherence & cohesion", breakdown.coherenceCohesion],
                          ["Lexical resource", breakdown.lexicalResource],
                          ["Grammar", breakdown.grammaticalRange],
                        ] as const
                      ).map(([title, b]) =>
                        b ? (
                          <div key={title} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                            <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">{title}</p>
                            <p className="mt-1 text-2xl font-bold tabular-nums text-zinc-900">{safeNum(b.band) ?? "—"}</p>
                            <p className="mt-2 text-sm text-zinc-600">{b.comment}</p>
                          </div>
                        ) : null,
                      )}
                    </div>
                  ) : null}

                  {perspectives.length > 0 ? (
                    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                      <div className="border-b border-zinc-100 bg-zinc-50 px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">Perspectives</p>
                        <p className="text-sm text-zinc-600">
                          Multiple rater lenses in one pass — how strictness and focus shift the score.
                        </p>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px] text-left text-sm">
                          <thead>
                            <tr className="border-b border-zinc-100 text-[11px] font-bold uppercase tracking-wide text-zinc-500">
                              <th className="px-4 py-3">Lens</th>
                              <th className="px-4 py-3">Score</th>
                              <th className="px-4 py-3">Feedback</th>
                            </tr>
                          </thead>
                          <tbody>
                            {perspectives.map((p, i) => (
                              <tr key={p.id ?? i} className="border-b border-zinc-50 align-top">
                                <td className="px-4 py-3">
                                  <p className="font-semibold text-zinc-900">{p.label ?? "Rater"}</p>
                                  <p className="mt-1 text-xs text-zinc-500">{p.focusNote}</p>
                                </td>
                                <td className="px-4 py-3 font-bold tabular-nums text-indigo-700">{safeNum(p.band) ?? "—"}</td>
                                <td className="px-4 py-3 text-zinc-700">{p.feedback}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}

                  {result.whyScoresDiffer ? (
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-indigo-800">Why scores differ</p>
                      <p className="mt-2 text-sm leading-relaxed text-indigo-950">{result.whyScoresDiffer}</p>
                    </div>
                  ) : null}

                  {result.problemSentences && result.problemSentences.length > 0 ? (
                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">Sentences to improve</p>
                      <ul className="mt-3 space-y-4">
                        {result.problemSentences.map((row, i) => (
                          <li key={i} className="border-l-2 border-amber-400 pl-4">
                            <p className="text-sm italic text-zinc-800">&ldquo;{row.quote}&rdquo;</p>
                            <p className="mt-1 text-sm text-red-800">{row.issue}</p>
                            <p className="mt-2 text-sm text-emerald-800">
                              <span className="font-semibold">Better: </span>
                              {row.better}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {result.fillerWordsIfAny && result.fillerWordsIfAny.length > 0 ? (
                    <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm">
                      <span className="font-semibold text-zinc-800">Filler words: </span>
                      {result.fillerWordsIfAny.join(", ")}
                    </div>
                  ) : null}

                  {result.improvedVersion ? (
                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">Improved version</p>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">{result.improvedVersion}</p>
                    </div>
                  ) : null}

                  {result.rewriteBullets && result.rewriteBullets.length > 0 ? (
                    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-zinc-500">Next steps</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700">
                        {result.rewriteBullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
