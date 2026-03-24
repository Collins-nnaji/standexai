"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bot, Loader2, Sparkles, ChevronRight, CheckCircle2, XCircle, Wrench, MessageSquare,
  Copy, Check, ArrowRight, BookOpen,
} from "lucide-react";

type AgentStep =
  | { kind: "assistant"; content: string | null }
  | { kind: "tool_start"; name: string; arguments: Record<string, unknown> }
  | { kind: "tool_done"; name: string; ok: boolean; summary: string }
  | { kind: "error"; message: string };

type AgentResponse = {
  steps: AgentStep[];
  finalMessage: string;
  workingText: string;
  usageNote?: string;
};

const TOOL_LABELS: Record<string, string> = {
  analyze_communication: "Analyze communication",
  check_compliance_risk: "Check compliance & risk",
  analyze_intent_psychology: "Analyze intent & psychology",
  detect_ai_content: "Detect AI vs human style",
  rewrite_communication: "Rewrite text",
};

/** Preset goals — tap to fill the goal field (not auto-run). */
const GOAL_PRESETS: Array<{
  id: string;
  label: string;
  hint: string;
  goal: string;
}> = [
  {
    id: "hr-broadcast",
    label: "HR / company-wide",
    hint: "Safer, clearer all-staff tone",
    goal:
      "Make this appropriate for a company-wide email: reduce HR and legal risk, keep tone professional and inclusive, and clarify the main ask.",
  },
  {
    id: "customer-email",
    label: "Customer email",
    hint: "Professional, low-risk wording",
    goal:
      "Review for compliance and tone, then rewrite so it is clear, professional, and unlikely to create legal or reputational risk.",
  },
  {
    id: "slack-reply",
    label: "Slack / chat reply",
    hint: "Shorter, less sharp",
    goal:
      "Soften any sharp tone, remove anything that could read as passive-aggressive, and keep it concise for Slack.",
  },
  {
    id: "speech",
    label: "Speech or script",
    hint: "Sounds natural spoken aloud",
    goal:
      "Turn this into delivery-ready language: natural rhythm, clear emphasis, and safe wording for a live or recorded talk.",
  },
  {
    id: "intent-check",
    label: "Hidden pressure?",
    hint: "Intent & psychology pass",
    goal:
      "Analyze whether this uses manipulation or undue pressure; suggest a neutral, respectful alternative that preserves the substance.",
  },
  {
    id: "ai-human",
    label: "Sound more human",
    hint: "AI detection + rewrite",
    goal:
      "Check how AI-like this reads, then rewrite so it sounds more naturally human while staying accurate and professional.",
  },
  {
    id: "policy-snippet",
    label: "Policy / legal snippet",
    hint: "Compliance-heavy",
    goal:
      "Focus on compliance and risk: flag problematic claims, suggest safer phrasing, and keep disclaimers where needed.",
  },
];

const TOOL_CHAIN_LINE =
  "Communication · Compliance · Intent · AI style · Rewrite — chained to match your goal.";

export default function AgentPage() {
  const [goal, setGoal] = useState(
    "Make this safe for HR and clearer for a company-wide email. Rewrite in a professional tone.",
  );
  const [text, setText] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<AgentResponse | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const run = async () => {
    if (!goal.trim()) return;
    setRunning(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: goal.trim(), text: text.trim(), maxSteps: 12 }),
      });
      const data = (await res.json()) as AgentResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Agent failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Agent failed");
    } finally {
      setRunning(false);
    }
  };

  const copyWorking = () => {
    if (!result?.workingText) return;
    void navigator.clipboard.writeText(result.workingText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (p: (typeof GOAL_PRESETS)[0]) => {
    setGoal(p.goal);
    setActivePresetId(p.id);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#FAFAFA]">
      {/* Hero — single column, intentional hierarchy */}
      <header className="relative shrink-0 overflow-hidden border-b border-zinc-200/90 bg-white">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-30%,rgba(99,102,241,0.09),transparent_55%)]"
          aria-hidden
        />
        <div className="relative mx-auto w-full max-w-[1400px] px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4 lg:px-6">
          <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_min(260px,28%)] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_min(300px,26%)]">
            <div className="text-center lg:text-left">
              <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20 lg:mx-0">
                <Bot className="h-[1.15rem] w-[1.15rem]" strokeWidth={2} />
              </div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-indigo-600">StandexAI</p>
              <h1 className="mt-1 text-xl font-extrabold leading-tight tracking-tight text-zinc-950 sm:text-2xl lg:text-[1.65rem]">
                Communication Coach
              </h1>
              <p className="mx-auto mt-1.5 max-w-xl text-[13px] leading-snug text-zinc-600 lg:mx-0">
                Describe the outcome; the coach chains Writing Lab tools until your goal is met.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-1.5 rounded-xl border border-zinc-100 bg-zinc-50/90 px-3 py-2.5 sm:px-3.5">
              <p className="text-[11px] leading-tight text-zinc-500">{TOOL_CHAIN_LINE}</p>
              <div className="flex flex-col gap-1 border-t border-zinc-200/80 pt-2">
                <Link
                  href="/writing-lab"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition hover:text-indigo-800"
                >
                  Writing Lab (manual tools)
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <p className="text-[11px] leading-tight text-zinc-500">You pick tools in the lab; the coach chains them here.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-100 bg-zinc-50/80">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-2 px-3 py-2 sm:grid-cols-3 sm:gap-0 sm:px-4 sm:py-2.5 lg:px-6">
            {[
              { step: "1", title: "Goal", body: "What “done” looks like." },
              { step: "2", title: "Draft", body: "Paste your text." },
              { step: "3", title: "Run", body: "Coach runs tools + summary." },
            ].map((s, i) => (
              <div
                key={s.step}
                className={`relative text-center sm:px-2 ${i > 0 ? "sm:border-l sm:border-zinc-200/90" : ""}`}
              >
                <span className="text-[10px] font-bold tabular-nums text-indigo-500">{s.step}</span>
                <p className="mt-0.5 text-xs font-semibold text-zinc-900">{s.title}</p>
                <p className="mx-auto mt-0.5 max-w-[12rem] text-[10px] leading-tight text-zinc-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1400px] space-y-4 px-3 py-3 sm:space-y-4 sm:px-4 sm:py-4 lg:px-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_min(280px,34%)] lg:items-start lg:gap-5 xl:grid-cols-[minmax(0,1fr)_min(320px,32%)]">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900">Session</h2>
                    <p className="text-[12px] text-zinc-500">Goal, text, run.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void run()}
                    disabled={running || !goal.trim()}
                    className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-50 sm:w-auto sm:px-5 sm:py-2.5"
                  >
                    {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {running ? "Running…" : "Run coach"}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="coach-goal" className="text-[11px] font-semibold text-zinc-700">
                    Your goal <span className="font-normal text-zinc-400">(required)</span>
                  </label>
                  <textarea
                    id="coach-goal"
                    value={goal}
                    onChange={(e) => {
                      setGoal(e.target.value);
                      setActivePresetId(null);
                    }}
                    rows={3}
                    placeholder="Example: Make this safe for HR, fix unclear sentences, then rewrite in a calm professional tone."
                    className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="coach-text" className="text-[11px] font-semibold text-zinc-700">
                    Text to improve <span className="font-normal text-zinc-400">(draft)</span>
                  </label>
                  <textarea
                    id="coach-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                    placeholder="Paste email, Slack thread, speech notes, policy excerpt…"
                    className="min-h-[120px] w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 lg:min-h-[140px] xl:min-h-[160px]"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3">
                  <button
                    type="button"
                    onClick={() => void run()}
                    disabled={running || !goal.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/25 transition hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {running ? "Running…" : "Run coach"}
                  </button>
                  {!text.trim() && (
                    <p className="text-xs text-amber-800">
                      You can run with goal only; pasting draft text usually gives better results.
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-900">
                    {error}
                  </div>
                )}

                {running && (
                  <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-4 text-sm text-indigo-950">
                    <Loader2 className="h-5 w-5 shrink-0 animate-spin text-indigo-600" />
                    <span>Planning steps and calling tools…</span>
                  </div>
                )}
              </div>

              <aside className="min-w-0 rounded-xl border border-zinc-200/90 bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] lg:sticky lg:top-3 lg:max-h-[calc(100dvh-4rem)] lg:overflow-y-auto lg:p-3.5">
                <div className="mb-2 border-b border-zinc-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
                    <h3 className="text-xs font-semibold text-zinc-900">Goal library</h3>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-zinc-500">Tap to fill your goal (edit left).</p>
                </div>
                <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                  {GOAL_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applyPreset(p)}
                      className={`rounded-lg border px-2.5 py-2 text-left transition ${
                        activePresetId === p.id
                          ? "border-indigo-300 bg-indigo-50/80 ring-1 ring-indigo-200"
                          : "border-zinc-100 bg-zinc-50/50 hover:border-zinc-200 hover:bg-white"
                      }`}
                    >
                      <p className="text-xs font-bold text-zinc-900">{p.label}</p>
                      <p className="mt-0.5 text-[11px] text-zinc-500">{p.hint}</p>
                    </button>
                  ))}
                </div>
              </aside>
            </div>

            {result && (
              <div className="space-y-4 border-t border-zinc-200/80 pt-4">
                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-zinc-900">
                    <MessageSquare className="h-4 w-4 text-indigo-500" />
                    Summary
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{result.finalMessage}</p>
                  {result.usageNote && <p className="mt-3 text-xs text-amber-700">{result.usageNote}</p>}
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                      <Wrench className="h-4 w-4 text-zinc-500" />
                      What the coach did
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">
                      {result.steps.length} steps
                    </span>
                  </div>
                  <ol className="space-y-3">
                    {result.steps.map((s, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold text-zinc-500">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          {s.kind === "assistant" && (
                            <p className="leading-relaxed text-zinc-600">
                              <span className="font-semibold text-zinc-800">Coach: </span>
                              {s.content}
                            </p>
                          )}
                          {s.kind === "tool_start" && (
                            <div className="rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-2">
                              <div className="flex items-center gap-2 font-semibold text-zinc-800">
                                <ChevronRight className="h-3.5 w-3.5 text-indigo-500" />
                                {TOOL_LABELS[s.name] ?? s.name}
                              </div>
                              {Object.keys(s.arguments).length > 0 && (
                                <pre className="mt-2 max-h-24 overflow-auto text-[10px] text-zinc-500">
                                  {JSON.stringify(s.arguments, null, 2)}
                                </pre>
                              )}
                            </div>
                          )}
                          {s.kind === "tool_done" && (
                            <div
                              className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${
                                s.ok ? "border-emerald-100 bg-emerald-50/50" : "border-rose-100 bg-rose-50/50"
                              }`}
                            >
                              {s.ok ? (
                                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                              ) : (
                                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                              )}
                              <div>
                                <div className="text-xs font-semibold text-zinc-800">
                                  {TOOL_LABELS[s.name] ?? s.name}
                                </div>
                                <p className="text-xs leading-relaxed text-zinc-600">{s.summary}</p>
                              </div>
                            </div>
                          )}
                          {s.kind === "error" && (
                            <p className="text-xs font-medium text-rose-800">{s.message}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-zinc-900">Working text (latest)</span>
                    <button
                      type="button"
                      onClick={copyWorking}
                      disabled={!result.workingText}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 disabled:opacity-50"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  {result.workingText ? (
                    <p className="max-h-80 overflow-y-auto whitespace-pre-wrap text-sm leading-relaxed text-zinc-800">
                      {result.workingText}
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-400">No text in session.</p>
                  )}
                  {result.workingText ? (
                    <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold">
                      <a
                        href={`/writing-lab?workspace=rewrite&rewriteMode=safe&text=${encodeURIComponent(result.workingText)}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Open in Transform →
                      </a>
                      <span className="text-zinc-300">·</span>
                      <a
                        href={`/writing-lab?text=${encodeURIComponent(result.workingText)}`}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Open in Writing Lab (Review) →
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
