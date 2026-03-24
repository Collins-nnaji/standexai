"use client";

import { Suspense, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  FileText, Sparkles, Loader2, AlertTriangle, AlertCircle, Info,
  PenTool, Smile, CheckCircle2, TrendingUp, Eye, ChevronDown, ChevronUp,
  Mic, Upload, ShieldAlert, Brain, Shield, Copy, ScanSearch, Bot, User, Wand2,
  Zap, Minus, RefreshCw, LayoutDashboard,
} from "lucide-react";
import type { RewriteMode } from "@/lib/communication-llm";

type Flag = {
  text: string;
  severity: "critical" | "warning" | "info";
  category: string;
  explanation: string;
  suggestion: string;
};

type AnalysisResult = {
  toneScore: number;
  riskScore: number;
  clarityScore: number;
  overallScore: number;
  flags: Flag[];
  summary: string;
  strengths: string[];
  improvements: string[];
};

type RiskResult = {
  riskLevel: string;
  overallScore: number;
  issues: Array<{
    category: string;
    text: string;
    severity: string;
    explanation: string;
    saferVersion: string;
  }>;
  summary: string;
  recommendations: string[];
};

type IntentResult = {
  overallAssessment: string;
  confidenceScore: number;
  tactics: Array<{
    type: string;
    text: string;
    explanation: string;
    impact: string;
  }>;
  biasDetected: string[];
  summary: string;
  neutralVersion: string;
};

type DetectionResult = {
  aiProbability: number;
  verdict: string;
  sections: Array<{ text: string; probability: number; reason: string }>;
  indicators: { aiSignals: string[]; humanSignals: string[] };
  suggestions: string[];
  summary: string;
};

type RewriteResult = {
  rewritten?: string;
  changes?: Array<{ original: string; rewritten: string; reason: string }>;
  summary?: string;
  toneShift?: string;
  wordCountOriginal?: number;
  wordCountRewritten?: number;
};

type ToolId = "communication" | "compliance" | "intent" | "detect";

type ToolDef = {
  id: ToolId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconWrap: string;
  iconColor: string;
  activeClass: string;
  idleClass: string;
  analyzeType: "text" | "risk" | "intent" | "detect";
};

type WorkspaceTab = "review" | "rewrite";

const STUDIO_MODES: {
  id: RewriteMode;
  label: string;
  icon: LucideIcon;
  desc: string;
  chip: string;
  chipActive: string;
}[] = [
  { id: "professional", label: "Professional", icon: PenTool, desc: "Polished business tone", chip: "border-slate-200 bg-white text-slate-700 hover:border-[#0f2744]/25", chipActive: "border-[#0f2744] bg-[#0f2744] text-white shadow-md" },
  { id: "friendly", label: "Friendly", icon: Smile, desc: "Warm and approachable", chip: "border-slate-200 bg-white text-slate-700 hover:border-emerald-300/50", chipActive: "border-emerald-600 bg-emerald-600 text-white shadow-md" },
  { id: "persuasive", label: "Persuasive", icon: Zap, desc: "Compelling rhetoric", chip: "border-slate-200 bg-white text-slate-700 hover:border-amber-300/50", chipActive: "border-amber-600 bg-amber-600 text-white shadow-md" },
  { id: "safe", label: "Safe", icon: CheckCircle2, desc: "Lower-risk wording", chip: "border-slate-200 bg-white text-slate-700 hover:border-sky-300/50", chipActive: "border-sky-600 bg-sky-600 text-white shadow-md" },
  { id: "speaker", label: "Speech", icon: Mic, desc: "Delivery-ready script", chip: "border-slate-200 bg-white text-slate-700 hover:border-violet-300/50", chipActive: "border-violet-600 bg-violet-600 text-white shadow-md" },
  { id: "neutral", label: "Neutral", icon: Minus, desc: "Balanced and objective", chip: "border-slate-200 bg-white text-slate-700 hover:border-zinc-400/50", chipActive: "border-zinc-700 bg-zinc-800 text-white shadow-md" },
];

const RISK_COLORS: Record<string, { bg: string; border: string; text: string; icon: string; label: string }> = {
  low: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-900", icon: "text-emerald-600", label: "Low risk" },
  medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-950", icon: "text-amber-600", label: "Medium risk" },
  high: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-950", icon: "text-rose-600", label: "High risk" },
  critical: { bg: "bg-rose-100", border: "border-rose-300", text: "text-rose-950", icon: "text-rose-700", label: "Critical risk" },
};

const CATEGORY_LABELS: Record<string, string> = {
  harassment: "Harassment",
  discrimination: "Discrimination",
  threat: "Threat",
  legal: "Legal risk",
  policy: "Policy violation",
  privacy: "Privacy concern",
};

const ASSESSMENT_CONFIG: Record<string, { bg: string; border: string; text: string; label: string; desc: string }> = {
  neutral: { bg: "bg-zinc-50", border: "border-zinc-200", text: "text-zinc-900", label: "Neutral", desc: "No persuasion or manipulation tactics detected." },
  mildly_persuasive: {
    bg: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    text: "text-fuchsia-950",
    label: "Mildly persuasive",
    desc: "Uses standard persuasion techniques common in everyday communication.",
  },
  strongly_persuasive: {
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-950",
    label: "Strongly persuasive",
    desc: "Contains significant persuasion tactics that could influence decision-making.",
  },
  manipulative: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-950",
    label: "Manipulative",
    desc: "Contains manipulative language designed to exploit psychological vulnerabilities.",
  },
};

const TACTIC_LABELS: Record<string, string> = {
  social_pressure: "Social pressure",
  emotional_manipulation: "Emotional manipulation",
  false_urgency: "False urgency",
  gaslighting: "Gaslighting",
  bandwagon: "Bandwagon effect",
  guilt_trip: "Guilt trip",
  fear_appeal: "Fear appeal",
  flattery: "Flattery",
  authority_bias: "Authority bias",
  straw_man: "Straw man",
  appeal_to_emotion: "Appeal to emotion",
};

const IMPACT_COLORS: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-900 border border-emerald-200",
  medium: "bg-amber-50 text-amber-950 border border-amber-200",
  high: "bg-rose-50 text-rose-950 border border-rose-200",
};

const ANALYZER_TOOLS: ToolDef[] = [
  {
    id: "communication",
    title: "Communication",
    subtitle: "Tone, clarity, overall quality & phrase-level flags",
    icon: FileText,
    iconWrap: "border-[#0f2744]/15 bg-[#0f2744]/[0.04]",
    iconColor: "text-[#0f2744]",
    activeClass: "border-[#0f2744]/40 bg-white shadow-lg shadow-[#0f2744]/[0.07] ring-1 ring-[#0f2744]/15",
    idleClass: "border-slate-200/80 bg-white/90 hover:border-[#0f2744]/20",
    analyzeType: "text",
  },
  {
    id: "compliance",
    title: "Compliance & risk",
    subtitle: "HR, legal, policy & safer wording alternatives",
    icon: ShieldAlert,
    iconWrap: "border-rose-200 bg-rose-50",
    iconColor: "text-rose-600",
    activeClass: "border-rose-400 bg-rose-50/90 shadow-md shadow-rose-500/10 ring-1 ring-rose-200",
    idleClass: "border-slate-200/80 bg-white/90 hover:border-rose-200",
    analyzeType: "risk",
  },
  {
    id: "intent",
    title: "Intent & psychology",
    subtitle: "Persuasion tactics, pressure & cognitive bias signals",
    icon: Brain,
    iconWrap: "border-fuchsia-200 bg-fuchsia-50",
    iconColor: "text-fuchsia-600",
    activeClass: "border-fuchsia-400 bg-fuchsia-50/90 shadow-md shadow-fuchsia-500/10 ring-1 ring-fuchsia-200",
    idleClass: "border-slate-200/80 bg-white/90 hover:border-fuchsia-200",
    analyzeType: "intent",
  },
  {
    id: "detect",
    title: "AI authorship",
    subtitle: "How AI-like the text reads & tips to sound more human",
    icon: ScanSearch,
    iconWrap: "border-amber-200 bg-amber-50",
    iconColor: "text-amber-600",
    activeClass: "border-amber-400 bg-amber-50/90 shadow-md shadow-amber-500/10 ring-1 ring-amber-200",
    idleClass: "border-slate-200/80 bg-white/90 hover:border-amber-200",
    analyzeType: "detect",
  },
];

function firstLineTitle(raw: string): string {
  const line = raw.split(/\r?\n/).find((l) => l.trim()) ?? raw;
  const t = line.trim().replace(/\s+/g, " ");
  if (t.length <= 120) return t || "Untitled";
  return `${t.slice(0, 117)}…`;
}

async function persistCommunicationAnalysis(payload: {
  title: string;
  source: "TEXT" | "VOICE";
  kind: string;
  overallScore?: number;
  toneScore?: number;
  riskScore?: number;
  clarityScore?: number;
  aiProbability?: number;
  riskLevel?: string | null;
}) {
  try {
    await fetch("/api/communication-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    /* non-blocking */
  }
}

export default function WritingLabPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>}>
      <WritingLabInner />
    </Suspense>
  );
}

type InputTab = "type" | "voice";

function WritingLabInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("review");
  const [text, setText] = useState("");
  const [inputTab, setInputTab] = useState<InputTab>("type");
  const [runAllAnalyzeLoading, setRunAllAnalyzeLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [recording, setRecording] = useState(false);
  const [commResult, setCommResult] = useState<AnalysisResult | null>(null);
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [intentResult, setIntentResult] = useState<IntentResult | null>(null);
  const [detectResult, setDetectResult] = useState<DetectionResult | null>(null);
  const [studioMode, setStudioMode] = useState<RewriteMode>("professional");
  const [studioResult, setStudioResult] = useState<RewriteResult | null>(null);
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioError, setStudioError] = useState("");
  const [showStudioChanges, setShowStudioChanges] = useState(false);
  const [studioCopied, setStudioCopied] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);
  const [loadingTools, setLoadingTools] = useState<Partial<Record<ToolId, boolean>>>({});
  const [toolErrors, setToolErrors] = useState<Partial<Record<ToolId, string>>>({});
  const [error, setError] = useState("");
  const [expandedFlag, setExpandedFlag] = useState<number | null>(null);
  const [showNeutral, setShowNeutral] = useState(false);
  const [copiedRiskIdx, setCopiedRiskIdx] = useState<number | null>(null);
  const [humanizing, setHumanizing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasAnyResult = Boolean(commResult || riskResult || intentResult || detectResult);

  const hasResultForTool = (id: ToolId): boolean => {
    switch (id) {
      case "communication":
        return commResult != null;
      case "compliance":
        return riskResult != null;
      case "intent":
        return intentResult != null;
      case "detect":
        return detectResult != null;
      default:
        return false;
    }
  };

  const goReview = useCallback(() => {
    setWorkspaceTab("review");
    router.replace("/writing-lab", { scroll: false });
  }, [router]);

  const goRewrite = useCallback(
    (mode?: RewriteMode) => {
      const m = mode ?? studioMode;
      setWorkspaceTab("rewrite");
      if (mode) setStudioMode(mode);
      router.replace(`/writing-lab?workspace=rewrite&rewriteMode=${encodeURIComponent(m)}`, { scroll: false });
    },
    [router, studioMode],
  );

  useEffect(() => {
    const prefilled = searchParams.get("text");
    if (prefilled) {
      setText(decodeURIComponent(prefilled));
      setInputTab("type");
    }
    if (searchParams.get("voice") === "1") {
      setInputTab("voice");
    }
    const ws = searchParams.get("workspace");
    setWorkspaceTab(ws === "rewrite" ? "rewrite" : "review");
    const rm = searchParams.get("rewriteMode");
    if (rm && STUDIO_MODES.some((x) => x.id === rm)) {
      setStudioMode(rm as RewriteMode);
    }
  }, [searchParams]);

  const clearAnalysis = () => {
    setCommResult(null);
    setRiskResult(null);
    setIntentResult(null);
    setDetectResult(null);
    setExpandedFlag(null);
    setShowNeutral(false);
    setSelectedTool(null);
    setToolErrors({});
    setLoadingTools({});
  };

  const applyAnalyzeResult = (type: "text" | "risk" | "intent" | "detect", result: unknown) => {
    switch (type) {
      case "text":
        setCommResult(result as AnalysisResult);
        break;
      case "risk":
        setRiskResult(result as RiskResult);
        break;
      case "intent":
        setIntentResult(result as IntentResult);
        break;
      case "detect":
        setDetectResult(result as DetectionResult);
        break;
    }
  };

  const runTool = async (id: ToolId) => {
    if (!text.trim()) return;
    setSelectedTool(id);
    setToolErrors((e) => {
      const next = { ...e };
      delete next[id];
      return next;
    });
    setLoadingTools((l) => ({ ...l, [id]: true }));
    const def = ANALYZER_TOOLS.find((t) => t.id === id);
    if (!def) {
      setLoadingTools((l) => ({ ...l, [id]: false }));
      return;
    }
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), type: def.analyzeType }),
      });
      const data = (await res.json()) as { result?: unknown; error?: string };
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      applyAnalyzeResult(def.analyzeType, data.result);
      if (def.analyzeType === "text" && data.result) {
        const r = data.result as AnalysisResult;
        void persistCommunicationAnalysis({
          title: firstLineTitle(text.trim()),
          source: inputTab === "voice" ? "VOICE" : "TEXT",
          kind: "communication",
          overallScore: r.overallScore,
          toneScore: r.toneScore,
          riskScore: r.riskScore,
          clarityScore: r.clarityScore,
        });
      }
    } catch (err) {
      setToolErrors((e) => ({
        ...e,
        [id]: err instanceof Error ? err.message : "Something went wrong",
      }));
    } finally {
      setLoadingTools((l) => ({ ...l, [id]: false }));
    }
  };

  const onToolRowClick = (id: ToolId) => {
    if (selectedTool !== id && hasResultForTool(id)) {
      setSelectedTool(id);
      return;
    }
    if (!text.trim()) return;
    void runTool(id);
  };

  const handleRunAllAnalyze = async () => {
    if (!text.trim()) return;
    setRunAllAnalyzeLoading(true);
    setError("");
    const analyzeIds = ANALYZER_TOOLS;
    for (const t of analyzeIds) {
      setToolErrors((e) => {
        const next = { ...e };
        delete next[t.id];
        return next;
      });
      setLoadingTools((l) => ({ ...l, [t.id]: true }));
    }
    const payload = { text: text.trim() };
    const bundle: {
      text?: AnalysisResult;
      risk?: RiskResult;
      intent?: IntentResult;
      detect?: DetectionResult;
    } = {};

    await Promise.all(
      analyzeIds.map(async (t) => {
        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, type: t.analyzeType }),
          });
          const data = (await res.json()) as { result?: unknown; error?: string };
          if (!res.ok) throw new Error(data.error || "Analysis failed");
          const r = data.result;
          if (t.analyzeType === "text") bundle.text = r as AnalysisResult;
          if (t.analyzeType === "risk") bundle.risk = r as RiskResult;
          if (t.analyzeType === "intent") bundle.intent = r as IntentResult;
          if (t.analyzeType === "detect") bundle.detect = r as DetectionResult;
          applyAnalyzeResult(t.analyzeType, r);
        } catch (err) {
          setToolErrors((e) => ({
            ...e,
            [t.id]: err instanceof Error ? err.message : "Analysis failed",
          }));
        } finally {
          setLoadingTools((l) => ({ ...l, [t.id]: false }));
        }
      }),
    );
    setSelectedTool("communication");
    setRunAllAnalyzeLoading(false);

    if (bundle.text) {
      void persistCommunicationAnalysis({
        title: firstLineTitle(text.trim()),
        source: inputTab === "voice" ? "VOICE" : "TEXT",
        kind: "run_all",
        overallScore: bundle.text.overallScore,
        toneScore: bundle.text.toneScore,
        riskScore: bundle.text.riskScore,
        clarityScore: bundle.text.clarityScore,
        aiProbability: bundle.detect?.aiProbability,
        riskLevel: bundle.risk?.riskLevel ?? null,
      });
    }
  };

  const transcribeBlob = async (blob: Blob, filename = "recording.webm") => {
    setTranscribing(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", blob, filename);
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Transcription failed");
      const next = (data.text ?? "").trim();
      setText(next);
      clearAnalysis();
      setInputTab("type");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transcription failed");
    } finally {
      setTranscribing(false);
    }
  };

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        void transcribeBlob(blob);
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch {
      setError("Microphone access denied or unavailable.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const onAudioFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    void transcribeBlob(f, f.name || "audio");
  };

  const copySafer = (saferText: string, idx: number) => {
    navigator.clipboard.writeText(saferText);
    setCopiedRiskIdx(idx);
    setTimeout(() => setCopiedRiskIdx(null), 2000);
  };

  const handleHumanize = async () => {
    if (!text.trim()) return;
    setHumanizing(true);
    setError("");
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode: "friendly" }),
      });
      const data = (await res.json()) as { result?: { rewritten?: string }; error?: string };
      if (!res.ok) throw new Error(data.error || "Humanize failed");
      const next = data.result?.rewritten?.trim();
      if (next) {
        setText(next);
        clearAnalysis();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Humanize failed");
    } finally {
      setHumanizing(false);
    }
  };

  const handleStudioRewrite = async () => {
    if (!text.trim()) return;
    setStudioLoading(true);
    setStudioError("");
    setStudioResult(null);
    setShowStudioChanges(false);
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode: studioMode }),
      });
      const data = (await res.json()) as { result?: RewriteResult; error?: string };
      if (!res.ok) throw new Error(data.error || "Rewrite failed");
      setStudioResult(data.result ?? null);
    } catch (err) {
      setStudioError(err instanceof Error ? err.message : "Rewrite failed");
    } finally {
      setStudioLoading(false);
    }
  };

  const selectStudioMode = (m: RewriteMode) => {
    setStudioMode(m);
    setStudioResult(null);
    setStudioError("");
    if (workspaceTab === "rewrite") {
      router.replace(`/writing-lab?workspace=rewrite&rewriteMode=${encodeURIComponent(m)}`, { scroll: false });
    }
  };

  const severityConfig = {
    critical: { icon: AlertTriangle, color: "text-zinc-800", bg: "bg-zinc-100", border: "border-zinc-300", label: "Harmful / Toxic" },
    warning: { icon: AlertCircle, color: "text-zinc-700", bg: "bg-zinc-100", border: "border-zinc-300", label: "Unclear / Risky" },
    info: { icon: Info, color: "text-zinc-800", bg: "bg-zinc-100", border: "border-zinc-200", label: "Suggestion" },
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#F43F5E";
  };

  const getRiskColor = (score: number) => {
    if (score <= 20) return "#10B981";
    if (score <= 50) return "#F59E0B";
    return "#F43F5E";
  };

  const highlightText = (inputText: string, flags: Flag[]) => {
    if (!flags?.length) return inputText;
    let highlighted = inputText;
    const sortedFlags = [...flags].sort((a, b) => b.text.length - a.text.length);
    for (const flag of sortedFlags) {
      if (!flag.text) continue;
      const escaped = flag.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(${escaped})`, "gi");
      const cls = flag.severity === "critical" ? "highlight-danger" : flag.severity === "warning" ? "highlight-warning" : "highlight-info";
      highlighted = highlighted.replace(regex, `<span class="${cls}" title="${flag.explanation}">$1</span>`);
    }
    return highlighted;
  };

  const riskConfig = riskResult ? (RISK_COLORS[riskResult.riskLevel] || RISK_COLORS.low) : RISK_COLORS.low;
  const assessment = intentResult ? (ASSESSMENT_CONFIG[intentResult.overallAssessment] || ASSESSMENT_CONFIG.neutral) : null;

  const getAiProbStyle = (prob: number) => {
    if (prob <= 30) return { text: "text-emerald-800", bg: "bg-emerald-500", ring: "#10B981" };
    if (prob <= 60) return { text: "text-amber-900", bg: "bg-amber-500", ring: "#F59E0B" };
    return { text: "text-rose-900", bg: "bg-rose-500", ring: "#F43F5E" };
  };

  const verdictLabels: Record<string, string> = {
    likely_human: "Likely human-written",
    mixed: "Mixed content",
    likely_ai: "Likely AI-generated",
    definitely_ai: "Almost certainly AI",
  };

  const aiRingCircumference = 2 * Math.PI * 40;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-gradient-to-br from-[#f6f4ef] via-[#faf9f6] to-[#e8ebe9]">
      <header className="shrink-0 border-b border-slate-200/60 bg-white/80 px-4 py-3 shadow-[0_1px_0_rgba(15,39,68,0.04)] backdrop-blur-md sm:px-6 sm:py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0f2744] text-white shadow-lg shadow-[#0f2744]/25">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-[#0f2744] sm:text-xl">Writing Lab</h1>
              <p className="text-[11px] leading-snug text-slate-500 sm:text-xs">
                Analysis, risk, and intent on the <span className="font-semibold text-slate-700">Review</span> workspace — full rewrites on{" "}
                <span className="font-semibold text-slate-700">Transform</span>.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1 shadow-inner">
              <button
                type="button"
                onClick={() => goReview()}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition sm:px-4 ${
                  workspaceTab === "review" ? "bg-white text-[#0f2744] shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Review
              </button>
              <button
                type="button"
                onClick={() => goRewrite()}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition sm:px-4 ${
                  workspaceTab === "rewrite" ? "bg-white text-[#0f2744] shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Transform
              </button>
            </div>
            {workspaceTab === "review" ? (
              <button
                type="button"
                onClick={() => void handleRunAllAnalyze()}
                disabled={!text.trim() || runAllAnalyzeLoading}
                className="flex shrink-0 items-center gap-2 rounded-2xl bg-[#0f2744] px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-[#0f2744]/20 transition hover:bg-[#0a1f36] disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {runAllAnalyzeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {runAllAnalyzeLoading ? "Running…" : "Run all analyses"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleStudioRewrite()}
                disabled={!text.trim() || studioLoading}
                className="flex shrink-0 items-center gap-2 rounded-2xl bg-[#c9a227] px-3 py-2 text-xs font-semibold text-[#1a1508] shadow-lg shadow-[#c9a227]/25 transition hover:bg-[#b89220] disabled:opacity-50 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {studioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PenTool className="h-4 w-4" />}
                {studioLoading ? "Transforming…" : "Transform text"}
              </button>
            )}
          </div>
        </div>
      </header>

      {workspaceTab === "rewrite" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-slate-200/60 bg-white/50 px-4 py-3 backdrop-blur-sm sm:px-6">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Mode</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {STUDIO_MODES.map((m) => {
                const Icon = m.icon;
                const active = studioMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectStudioMode(m.id)}
                    className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                      active ? m.chipActive : m.chip
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 opacity-90" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
            <div className="flex min-h-[240px] flex-1 flex-col overflow-hidden border-b border-slate-200/60 bg-white/40 backdrop-blur-sm lg:min-h-0 lg:border-b-0 lg:border-r">
              <div className="shrink-0 border-b border-slate-100 px-4 py-2.5 sm:px-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Source</span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setStudioResult(null);
                  }}
                  placeholder="Paste or type the text you want to transform…"
                  className="h-full min-h-[280px] w-full resize-none bg-transparent text-[15px] leading-[1.75] text-slate-800 placeholder:text-slate-400 outline-none"
                />
              </div>
              <div className="shrink-0 border-t border-slate-100 bg-white/60 px-4 py-2.5 sm:px-6">
                <span className="text-xs text-slate-400">
                  {text.trim() ? `${text.trim().split(/\s+/).length} words` : "No text yet"}
                </span>
              </div>
            </div>
            <div className="flex min-h-[280px] flex-1 flex-col overflow-hidden bg-white/30 backdrop-blur-sm lg:min-h-0">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-2.5 sm:px-6">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f2744]">Output</span>
                {studioResult?.rewritten && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowStudioChanges(!showStudioChanges)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                    >
                      {showStudioChanges ? "Hide changes" : "Show changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (studioResult.rewritten) {
                          navigator.clipboard.writeText(studioResult.rewritten);
                          setStudioCopied(true);
                          setTimeout(() => setStudioCopied(false), 2000);
                        }
                      }}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
                    >
                      {studioCopied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {studioCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
                {studioLoading && (
                  <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3">
                    <Loader2 className="h-9 w-9 animate-spin text-[#0f2744]" />
                    <p className="text-sm font-medium text-slate-600">Crafting your {STUDIO_MODES.find((x) => x.id === studioMode)?.label.toLowerCase()} version…</p>
                  </div>
                )}
                {studioError && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4">
                    <p className="text-sm font-semibold text-rose-900">{studioError}</p>
                  </div>
                )}
                {!studioLoading && !studioError && !studioResult && (
                  <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                      <PenTool className="h-7 w-7 text-slate-300" />
                    </div>
                    <p className="text-sm font-semibold text-slate-500">Your transformed text appears here</p>
                    <p className="max-w-xs text-xs text-slate-400">Pick a mode, then use Transform text</p>
                  </div>
                )}
                {studioResult && !showStudioChanges && studioResult.rewritten && (
                  <p className="whitespace-pre-wrap text-[15px] leading-[1.75] text-slate-800">{studioResult.rewritten}</p>
                )}
                {studioResult && showStudioChanges && studioResult.changes && studioResult.changes.length > 0 && (
                  <div className="space-y-3">
                    {studioResult.changes.map((c, i) => (
                      <div key={i} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <div className="border-b border-slate-100 bg-slate-50 px-3 py-2">
                          <p className="text-xs text-slate-500 line-through">{c.original}</p>
                        </div>
                        <div className="border-b border-slate-100 px-3 py-2">
                          <p className="text-xs font-semibold text-slate-900">{c.rewritten}</p>
                        </div>
                        <div className="px-3 py-2">
                          <p className="text-[11px] text-slate-500">{c.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {studioResult?.rewritten && (
                <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-slate-100 bg-white/70 px-4 py-3 sm:px-6">
                  <span className="text-xs text-slate-400">
                    {studioResult.wordCountRewritten != null ? `${studioResult.wordCountRewritten} words` : ""}
                    {studioResult.wordCountOriginal != null && studioResult.wordCountRewritten != null && (
                      <span className="ml-2 text-slate-300">
                        ({studioResult.wordCountRewritten > studioResult.wordCountOriginal ? "+" : ""}
                        {studioResult.wordCountRewritten - studioResult.wordCountOriginal})
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const next = studioResult.rewritten?.trim();
                        if (next) {
                          setText(next);
                          clearAnalysis();
                          setStudioResult(null);
                        }
                      }}
                      className="text-xs font-bold text-[#0f2744] hover:underline"
                    >
                      Apply to source
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleStudioRewrite()}
                      disabled={studioLoading}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-50"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {studioResult?.summary && (
            <div className="shrink-0 border-t border-slate-200/60 bg-[#0f2744]/[0.06] px-4 py-3 sm:px-6">
              <p className="text-xs font-medium text-[#0f2744]">
                <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-[#c9a227]" />
                {studioResult.summary}
                {studioResult.toneShift && <span className="ml-2 font-normal text-slate-600">· {studioResult.toneShift}</span>}
              </p>
            </div>
          )}
        </div>
      ) : (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className="flex min-h-[min(50vh,420px)] flex-1 flex-col overflow-hidden border-b border-slate-200/60 bg-white/30 backdrop-blur-[2px] lg:min-h-0 lg:border-b-0 lg:border-r lg:border-slate-200/60">
          {!commResult && (
            <div className="shrink-0 border-b border-zinc-100 bg-zinc-50/80 px-4 py-2 sm:px-6">
              <div className="flex gap-1 rounded-lg bg-zinc-100/80 p-1">
                <button
                  type="button"
                  onClick={() => setInputTab("type")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${
                    inputTab === "type" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Type or paste
                </button>
                <button
                  type="button"
                  onClick={() => setInputTab("voice")}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${
                    inputTab === "voice" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-800"
                  }`}
                >
                  <Mic className="h-3.5 w-3.5 text-violet-600" />
                  Voice
                </button>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            {commResult ? (
              <div className="min-h-full">
                <div className="mb-3 space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                    Analyzed text (communication flags highlighted)
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Use the tool buttons on the right for compliance, intent, and AI authorship — each uses its own analysis.
                  </p>
                </div>
                <div
                  className="whitespace-pre-wrap text-[15px] leading-[1.8] text-zinc-700"
                  dangerouslySetInnerHTML={{ __html: highlightText(text, commResult.flags) }}
                />
              </div>
            ) : inputTab === "voice" ? (
              <div className="flex min-h-[min(50vh,400px)] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50/50 px-4 py-8 text-center sm:min-h-[400px] sm:gap-6 sm:px-6 sm:py-10">
                {transcribing ? (
                  <>
                    <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-800">Transcribing audio…</p>
                      <p className="mt-1 text-xs text-zinc-500">Using your Azure speech-to-text deployment</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50">
                      <Mic className="h-7 w-7 text-violet-600" />
                    </div>
                    <div className="max-w-md space-y-2">
                      <p className="text-sm font-semibold text-zinc-900">Turn speech into text</p>
                      <p className="text-xs leading-relaxed text-zinc-500">
                        Record or upload audio. We transcribe it with your configured speech model, then you run the same analysis as typed text.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {!recording ? (
                        <button
                          type="button"
                          onClick={() => void startRecording()}
                          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-700"
                        >
                          <Mic className="h-4 w-4" />
                          Start recording
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-800 transition hover:bg-rose-100"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-600" />
                          </span>
                          Stop &amp; transcribe
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
                      >
                        <Upload className="h-4 w-4 text-zinc-600" />
                        Upload audio
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={onAudioFile}
                      />
                    </div>
                  </>
                )}
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste or type your text here...&#10;&#10;Use each tool on the right to run that analysis, or Run all analyses for the four core passes at once."
                className="h-full min-h-[240px] w-full resize-none bg-transparent text-[15px] leading-relaxed text-zinc-800 placeholder:text-zinc-400 outline-none sm:min-h-[400px]"
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-50 bg-zinc-50/50 px-4 py-3 sm:px-6">
            <span className="text-xs text-zinc-400">
              {transcribing
                ? "Transcribing…"
                : inputTab === "voice" && !commResult
                  ? "Voice → text appears in the editor after transcription"
                  : text.trim()
                    ? `${text.trim().split(/\s+/).length} words`
                    : "No text entered"}
            </span>
            {hasAnyResult && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    clearAnalysis();
                  }}
                  className="text-xs font-semibold text-zinc-500 hover:text-zinc-700"
                >
                  Edit text
                </button>
                {selectedTool && hasResultForTool(selectedTool) && (
                  <button
                    type="button"
                    onClick={() => void runTool(selectedTool)}
                    disabled={!text.trim() || Boolean(loadingTools[selectedTool])}
                    className="text-xs font-semibold text-zinc-800 hover:text-zinc-800 disabled:opacity-50"
                  >
                    Refresh current tool
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col overflow-hidden border-t border-slate-200/60 bg-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-sm lg:w-[580px] lg:max-w-[580px] lg:border-l lg:border-t-0 lg:shadow-[inset_1px_0_0_rgba(255,255,255,0.6)]">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {error && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="text-sm font-semibold text-rose-900">{error}</p>
              </div>
            )}

            {!text.trim() && (
              <div className="mb-4 rounded-xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-xs leading-relaxed text-amber-950">
                Add text on the left to run a tool. If you already have results, you can open another tool to view it without re-running.
              </div>
            )}

            <nav aria-label="Analysis and rewrite tools" className="mb-5 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Tools</p>
              <p className="mb-1 text-[10px] leading-snug text-zinc-500">
                Tap a tool to run it on your text. If it already has a result, tap a different tool to view that result; tap the same tool again to refresh.
              </p>
              {ANALYZER_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const active = selectedTool === tool.id;
                const busy = Boolean(loadingTools[tool.id]);
                const rc = riskResult ? RISK_COLORS[riskResult.riskLevel] || RISK_COLORS.low : RISK_COLORS.low;
                const intentLabel = intentResult
                  ? ASSESSMENT_CONFIG[intentResult.overallAssessment] || ASSESSMENT_CONFIG.neutral
                  : ASSESSMENT_CONFIG.neutral;
                let teaser: ReactNode = null;
                if (busy) {
                  teaser = <Loader2 className="h-5 w-5 shrink-0 animate-spin text-zinc-400" />;
                } else if (tool.id === "communication" && commResult) {
                  teaser = (
                    <div className="text-right">
                      <span className="block text-lg font-black tabular-nums text-indigo-700">{commResult.overallScore}</span>
                      <span className="text-[9px] font-semibold uppercase text-zinc-400">Overall</span>
                    </div>
                  );
                } else if (tool.id === "compliance" && riskResult) {
                  teaser = (
                    <div className="text-right">
                      <span className={`block text-xs font-bold ${rc.text}`}>{rc.label}</span>
                      <span className="text-[9px] font-semibold uppercase text-zinc-400">Safety {riskResult.overallScore}</span>
                    </div>
                  );
                } else if (tool.id === "intent" && intentResult) {
                  teaser = (
                    <div className="max-w-[112px] text-right">
                      <span className={`block truncate text-xs font-bold ${intentLabel.text}`}>{intentLabel.label}</span>
                      <span className="text-[9px] font-semibold uppercase text-zinc-400">{intentResult.confidenceScore}% conf.</span>
                    </div>
                  );
                } else if (tool.id === "detect" && detectResult) {
                  teaser = (
                    <div className="text-right">
                      <span className="block text-lg font-black tabular-nums text-amber-800">{detectResult.aiProbability}%</span>
                      <span className="text-[9px] font-semibold uppercase text-zinc-400">AI-like</span>
                    </div>
                  );
                } else {
                  teaser = (
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Run</span>
                  );
                }
                return (
                  <button
                    key={tool.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onToolRowClick(tool.id)}
                    disabled={busy}
                    className={`flex w-full items-center gap-3 rounded-xl border-2 px-3 py-3 text-left transition disabled:cursor-wait disabled:opacity-70 ${
                      active ? tool.activeClass : tool.idleClass
                    }`}
                  >
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tool.iconWrap}`}>
                      <Icon className={`h-5 w-5 ${tool.iconColor}`} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-zinc-900">{tool.title}</p>
                      <p className="mt-0.5 text-[11px] leading-snug text-zinc-600">{tool.subtitle}</p>
                    </div>
                    <div className="flex shrink-0 items-center justify-end">{teaser}</div>
                  </button>
                );
              })}
            </nav>

            {selectedTool && toolErrors[selectedTool] && (
              <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
                <p className="text-xs font-semibold text-rose-900">{toolErrors[selectedTool]}</p>
                <button
                  type="button"
                  onClick={() => void runTool(selectedTool)}
                  disabled={!text.trim() || Boolean(loadingTools[selectedTool])}
                  className="mt-2 text-xs font-semibold text-rose-700 hover:text-rose-900 disabled:opacity-50"
                >
                  Retry
                </button>
              </div>
            )}

            {selectedTool && loadingTools[selectedTool] && !hasResultForTool(selectedTool) && !toolErrors[selectedTool] && (
              <div className="mb-6 flex flex-col items-center gap-2 py-8">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <p className="text-sm text-zinc-600">Running…</p>
              </div>
            )}

            {!selectedTool && (
              <p className="py-6 text-center text-xs text-slate-500">Pick a tool above to run an analysis — details appear here. Use Transform for full rewrites.</p>
            )}

            {selectedTool === "communication" && commResult && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {[
                        { label: "Tone", score: commResult.toneScore, color: getScoreColor(commResult.toneScore) },
                        { label: "Risk", score: commResult.riskScore, color: getRiskColor(commResult.riskScore) },
                        { label: "Clarity", score: commResult.clarityScore, color: getScoreColor(commResult.clarityScore) },
                        { label: "Overall", score: commResult.overallScore, color: getScoreColor(commResult.overallScore) },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <div className="text-xl font-bold sm:text-2xl" style={{ color: s.color }}>
                            {s.score}
                          </div>
                          <div className="text-[9px] font-semibold uppercase tracking-wide text-zinc-400">{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl bg-zinc-50 p-4">
                      <p className="text-sm leading-relaxed text-zinc-600">{commResult.summary}</p>
                    </div>
                    {commResult.flags?.length > 0 && (
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Flagged issues ({commResult.flags.length})
                        </h3>
                        <div className="space-y-2">
                          {commResult.flags.map((flag, i) => {
                            const config = severityConfig[flag.severity];
                            const Icon = config.icon;
                            const isExpanded = expandedFlag === i;
                            return (
                              <div key={i} className={`overflow-hidden rounded-xl border ${config.border} ${config.bg}`}>
                                <button
                                  type="button"
                                  onClick={() => setExpandedFlag(isExpanded ? null : i)}
                                  className="flex w-full items-start gap-3 p-3 text-left"
                                >
                                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.color}`} />
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-zinc-800">&ldquo;{flag.text}&rdquo;</p>
                                    <p className="mt-0.5 text-[10px] text-zinc-500">
                                      {config.label} · {flag.category}
                                    </p>
                                  </div>
                                  {isExpanded ? <ChevronUp className="h-4 w-4 shrink-0 text-zinc-400" /> : <ChevronDown className="h-4 w-4 shrink-0 text-zinc-400" />}
                                </button>
                                {isExpanded && (
                                  <div className="border-t border-white/50 px-3 pb-3 pt-0">
                                    <p className="mb-2 text-xs leading-relaxed text-zinc-600">{flag.explanation}</p>
                                    <div className="rounded-lg border border-zinc-200 bg-white p-2.5">
                                      <p className="mb-1 text-[10px] font-semibold uppercase text-zinc-400">Suggestion</p>
                                      <p className="text-xs text-zinc-700">{flag.suggestion}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {commResult.strengths?.length > 0 && (
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          <CheckCircle2 className="h-3.5 w-3.5 text-zinc-600" />
                          Strengths
                        </h3>
                        <div className="space-y-2">
                          {commResult.strengths.map((s, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-600">
                              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-500" />
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {commResult.improvements?.length > 0 && (
                      <div>
                        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                          <TrendingUp className="h-3.5 w-3.5 text-zinc-600" />
                          Improvements
                        </h3>
                        <div className="space-y-2">
                          {commResult.improvements.map((s, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-600">
                              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" />
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedTool === "compliance" && riskResult && (
                  <div className="space-y-5">
                    <div className={`rounded-2xl border p-4 ${riskConfig.bg} ${riskConfig.border}`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/80 shadow-sm">
                            {riskResult.riskLevel === "low" ? (
                              <CheckCircle2 className={`h-6 w-6 ${riskConfig.icon}`} />
                            ) : riskResult.riskLevel === "critical" ? (
                              <AlertTriangle className={`h-6 w-6 ${riskConfig.icon}`} />
                            ) : (
                              <AlertCircle className={`h-6 w-6 ${riskConfig.icon}`} />
                            )}
                          </div>
                          <div>
                            <h2 className={`text-lg font-bold ${riskConfig.text}`}>{riskConfig.label}</h2>
                            <p className="mt-0.5 text-xs text-zinc-600">{riskResult.summary}</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className={`text-3xl font-bold ${riskConfig.text}`}>{riskResult.overallScore}</div>
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Safety score</div>
                        </div>
                      </div>
                    </div>
                    {riskResult.issues?.length > 0 ? (
                      <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-xs font-semibold text-zinc-800">
                          <AlertTriangle className="h-4 w-4 text-rose-500" />
                          Issues ({riskResult.issues.length})
                        </h3>
                        {riskResult.issues.map((issue, i) => (
                          <div key={i} className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
                            <div className="border-b border-zinc-100 px-4 py-3">
                              <div className="mb-2 flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                    issue.severity === "critical"
                                      ? "bg-rose-100 text-rose-900"
                                      : issue.severity === "warning"
                                        ? "bg-amber-100 text-amber-950"
                                        : "bg-zinc-100 text-zinc-800"
                                  }`}
                                >
                                  {issue.severity}
                                </span>
                                <span className="text-xs font-semibold text-zinc-500">
                                  {CATEGORY_LABELS[issue.category] || issue.category}
                                </span>
                              </div>
                              <p className="text-sm font-semibold text-zinc-900">&ldquo;{issue.text}&rdquo;</p>
                              <p className="mt-2 text-xs leading-relaxed text-zinc-500">{issue.explanation}</p>
                            </div>
                            <div className="bg-rose-50/40 px-4 py-3">
                              <div className="mb-2 flex items-center justify-between">
                                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase text-rose-800">
                                  <Shield className="h-3 w-3" />
                                  Safer alternative
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copySafer(issue.saferVersion, i)}
                                  className="flex items-center gap-1 text-[10px] font-semibold text-rose-600 hover:text-rose-800"
                                >
                                  {copiedRiskIdx === i ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  {copiedRiskIdx === i ? "Copied" : "Copy"}
                                </button>
                              </div>
                              <p className="text-sm leading-relaxed text-zinc-900">{issue.saferVersion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-center">
                        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
                        <p className="font-bold text-emerald-950">All clear</p>
                        <p className="mt-1 text-xs text-emerald-900/80">No compliance issues flagged.</p>
                      </div>
                    )}
                    {riskResult.recommendations?.length > 0 && (
                      <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                        <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-800">
                          <Sparkles className="h-3.5 w-3.5 text-rose-500" />
                          Recommendations
                        </h3>
                        <ul className="space-y-2">
                          {riskResult.recommendations.map((r, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs leading-relaxed text-zinc-600">
                              <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-rose-500" />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {selectedTool === "intent" && intentResult && assessment && (
                  <div className="space-y-5">
                    <div className={`rounded-2xl border p-4 ${assessment.bg} ${assessment.border}`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/90 shadow-sm">
                            <Brain className={`h-6 w-6 ${assessment.text}`} />
                          </div>
                          <div>
                            <h2 className={`text-lg font-bold ${assessment.text}`}>{assessment.label}</h2>
                            <p className="mt-0.5 text-xs text-zinc-600">{assessment.desc}</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className={`text-3xl font-bold ${assessment.text}`}>{intentResult.confidenceScore}%</div>
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">Confidence</div>
                        </div>
                      </div>
                    </div>
                    {intentResult.tactics?.length > 0 ? (
                      <div className="space-y-3">
                        <h3 className="flex items-center gap-2 text-xs font-semibold text-zinc-900">
                          <Eye className="h-4 w-4 text-fuchsia-500" />
                          Tactics ({intentResult.tactics.length})
                        </h3>
                        {intentResult.tactics.map((t, i) => (
                          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                  IMPACT_COLORS[t.impact] || IMPACT_COLORS.low
                                }`}
                              >
                                {t.impact} impact
                              </span>
                              <span className="text-xs font-semibold text-zinc-800">{TACTIC_LABELS[t.type] || t.type}</span>
                            </div>
                            <div className="mb-2 rounded-lg border border-fuchsia-100 bg-fuchsia-50/50 px-3 py-2">
                              <p className="text-sm font-medium text-zinc-900">&ldquo;{t.text}&rdquo;</p>
                            </div>
                            <p className="text-xs leading-relaxed text-zinc-600">{t.explanation}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-6 text-center">
                        <Shield className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
                        <p className="font-bold text-emerald-950">No tactics detected</p>
                        <p className="mt-1 text-xs text-emerald-900/80">Text appears straightforward.</p>
                      </div>
                    )}
                    {intentResult.biasDetected?.length > 0 && (
                      <div>
                        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                          Cognitive biases
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {intentResult.biasDetected.map((b, i) => (
                            <span
                              key={i}
                              className="rounded-lg border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-900"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {intentResult.neutralVersion && (
                      <div className="rounded-xl border border-zinc-100 bg-white p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="flex items-center gap-1.5 text-xs font-semibold text-zinc-700">
                            <Shield className="h-3.5 w-3.5 text-fuchsia-500" />
                            Neutral version
                          </h3>
                          <button
                            type="button"
                            onClick={() => setShowNeutral(!showNeutral)}
                            className="text-[11px] font-semibold text-fuchsia-700 hover:text-fuchsia-900"
                          >
                            {showNeutral ? "Hide" : "Show"}
                          </button>
                        </div>
                        {showNeutral && (
                          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
                            <p className="text-sm leading-relaxed text-zinc-900">{intentResult.neutralVersion}</p>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                      <p className="text-xs font-semibold text-zinc-800">Summary</p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-700">{intentResult.summary}</p>
                    </div>
                  </div>
                )}

                {selectedTool === "detect" && detectResult && (
                  <div className="space-y-5">
                    <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 text-center">
                      <div className="relative mx-auto mb-3 inline-block">
                        <svg width="108" height="108" className="score-ring">
                          <circle className="score-ring-track" cx="54" cy="54" r="40" strokeWidth="7" />
                          <circle
                            className="score-ring-fill"
                            cx="54"
                            cy="54"
                            r="40"
                            strokeWidth="7"
                            stroke={getAiProbStyle(detectResult.aiProbability).ring}
                            strokeDasharray={aiRingCircumference}
                            strokeDashoffset={
                              aiRingCircumference - (detectResult.aiProbability / 100) * aiRingCircumference
                            }
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-2xl font-black ${getAiProbStyle(detectResult.aiProbability).text}`}>
                            {detectResult.aiProbability}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-zinc-900">
                        {verdictLabels[detectResult.verdict] || detectResult.verdict}
                      </p>
                      <p className="mt-1 text-[11px] text-zinc-500">Estimated AI probability (heuristic)</p>
                    </div>

                    <div className="space-y-3 rounded-xl border border-zinc-100 bg-zinc-50/80 p-4">
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-800">
                          <Bot className="h-4 w-4 text-amber-600" />
                          AI signals
                        </h3>
                        <div className="space-y-1.5">
                          {detectResult.indicators?.aiSignals?.map((s, i) => (
                            <p key={i} className="flex items-start gap-2 text-[11px] text-zinc-600">
                              <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-amber-500" />
                              {s}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className="border-t border-zinc-200 pt-3">
                        <h3 className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-800">
                          <User className="h-4 w-4 text-emerald-600" />
                          Human signals
                        </h3>
                        <div className="space-y-1.5">
                          {detectResult.indicators?.humanSignals?.map((s, i) => (
                            <p key={i} className="flex items-start gap-2 text-[11px] text-zinc-600">
                              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                              {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {detectResult.sections?.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-xs font-bold text-zinc-800">By section</h3>
                        <div className="space-y-2">
                          {detectResult.sections.map((s, i) => {
                            const c = getAiProbStyle(s.probability);
                            return (
                              <div key={i} className="overflow-hidden rounded-lg border border-zinc-100">
                                <div className="flex items-center justify-between bg-zinc-50 px-3 py-1.5">
                                  <div className="flex items-center gap-2">
                                    <div className={`h-2 w-2 rounded-full ${c.bg}`} />
                                    <span className={`text-xs font-bold ${c.text}`}>{s.probability}% AI</span>
                                  </div>
                                  <span className="text-[10px] text-zinc-400">{s.reason}</span>
                                </div>
                                <p className="px-3 py-2 text-xs leading-relaxed text-zinc-700">{s.text}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {detectResult.suggestions?.length > 0 && (
                      <div>
                        <h3 className="mb-2 flex items-center gap-2 text-xs font-bold text-zinc-900">
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          Sound more human
                        </h3>
                        <div className="space-y-2">
                          {detectResult.suggestions.map((s, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50/50 p-2.5"
                            >
                              <Wand2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
                              <p className="text-[11px] leading-relaxed text-zinc-800">{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="rounded-xl border border-zinc-200 bg-white p-4">
                      <p className="text-sm leading-relaxed text-zinc-700">{detectResult.summary}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleHumanize()}
                      disabled={humanizing || !text.trim()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 py-3 text-xs font-bold text-emerald-900 transition hover:bg-emerald-100 disabled:opacity-50"
                    >
                      {humanizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      Humanize text (friendly rewrite)
                    </button>
                  </div>
                )}

            {text.trim() && (commResult || riskResult || intentResult || detectResult) && (
              <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200/80 pt-4">
                <button
                  type="button"
                  onClick={() => goRewrite("safe")}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-[#0f2744]/25 hover:bg-slate-50"
                >
                  <PenTool className="h-3.5 w-3.5 text-[#0f2744]" />
                  Refine: Safe
                </button>
                <button
                  type="button"
                  onClick={() => goRewrite("professional")}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#0f2744]/25 hover:bg-slate-50"
                >
                  <Eye className="h-3.5 w-3.5 text-slate-500" />
                  Refine: Professional
                </button>
                <button
                  type="button"
                  onClick={() => goRewrite("friendly")}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-[#0f2744]/25 hover:bg-slate-50"
                >
                  <Smile className="h-3.5 w-3.5 text-emerald-600" />
                  Refine: Friendly
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

function ArrowRight(props: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
