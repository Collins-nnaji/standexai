"use client";

import { Suspense, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  FileText, Sparkles, Loader2, AlertTriangle, AlertCircle, Info,
  PenTool, Smile, CheckCircle2, TrendingUp, Eye, ChevronDown, ChevronUp,
  Mic, Upload, ShieldAlert, Brain, Shield, Copy, ScanSearch, Bot, User, Wand2,
  Zap, Minus, RefreshCw, Plus, Trash2, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CONSOLE_THEMES,
  type ConsoleThemeMode,
} from "@/components/console/console-theme";
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

type TransformPersonaRow = {
  id: string;
  name: string;
  instructions: string;
  createdAt?: string;
  updatedAt?: string;
};

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
  source: "TEXT" | "VOICE" | "DICTATE";
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

type Props = { themeMode?: ConsoleThemeMode };

/** Full analysis + transform workspace — mounted from `/console` (single platform). */
export function WritingLabCore({ themeMode = "dark" }: Props) {
  const t = CONSOLE_THEMES[themeMode];
  return (
    <Suspense fallback={<div className={cn("flex flex-1 items-center justify-center", t.shell)}><Loader2 className={cn("h-6 w-6 animate-spin", t.muted)} /></div>}>
      <WritingLabInner themeMode={themeMode} />
    </Suspense>
  );
}

type InputTab = "type" | "dictate";

function WritingLabInner({ themeMode = "dark" }: Props) {
  const t = CONSOLE_THEMES[themeMode];
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
  const [personas, setPersonas] = useState<TransformPersonaRow[]>([]);
  const [personasLoading, setPersonasLoading] = useState(false);
  const [activePersonaId, setActivePersonaId] = useState<string | null>(null);
  const [personaModalOpen, setPersonaModalOpen] = useState(false);
  const [personaModalTab, setPersonaModalTab] = useState<"ai" | "manual">("ai");
  const [personaAiDescription, setPersonaAiDescription] = useState("");
  const [personaGenLoading, setPersonaGenLoading] = useState(false);
  const [personaFormName, setPersonaFormName] = useState("");
  const [personaFormInstructions, setPersonaFormInstructions] = useState("");
  const [personaSaveLoading, setPersonaSaveLoading] = useState(false);
  const [personaDeletingId, setPersonaDeletingId] = useState<string | null>(null);
  const [personaModalError, setPersonaModalError] = useState("");
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
    router.replace("/console?tab=lab", { scroll: false });
  }, [router]);

  const goRewrite = useCallback(
    (mode?: RewriteMode) => {
      const m = mode ?? studioMode;
      setWorkspaceTab("rewrite");
      setActivePersonaId(null);
      if (mode) setStudioMode(mode);
      router.replace(`/console?tab=lab&workspace=rewrite&rewriteMode=${encodeURIComponent(m)}`, { scroll: false });
    },
    [router, studioMode],
  );

  const loadPersonas = useCallback(async () => {
    setPersonasLoading(true);
    try {
      const res = await fetch("/api/transform-personas", { cache: "no-store" });
      const data = (await res.json()) as { personas?: TransformPersonaRow[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed to load personas");
      setPersonas(data.personas ?? []);
    } catch {
      setPersonas([]);
    } finally {
      setPersonasLoading(false);
    }
  }, []);

  useEffect(() => {
    if (workspaceTab !== "rewrite") return;
    void loadPersonas();
  }, [workspaceTab, loadPersonas]);

  useEffect(() => {
    if (personasLoading) return;
    if (!activePersonaId) return;
    if (personas.some((p) => p.id === activePersonaId)) return;
    setActivePersonaId(null);
    router.replace(
      `/console?tab=lab&workspace=rewrite&rewriteMode=${encodeURIComponent(studioMode)}`,
      { scroll: false },
    );
  }, [personasLoading, activePersonaId, personas, router, studioMode]);

  useEffect(() => {
    const prefilled = searchParams.get("text");
    if (prefilled) {
      setText(decodeURIComponent(prefilled));
      setInputTab("type");
    }
    if (searchParams.get("dictate") === "1") {
      setInputTab("dictate");
    }
    const ws = searchParams.get("workspace");
    setWorkspaceTab(ws === "rewrite" ? "rewrite" : "review");
    const personaParam = searchParams.get("persona");
    if (personaParam) {
      setActivePersonaId(personaParam);
    } else {
      setActivePersonaId(null);
      const rm = searchParams.get("rewriteMode");
      if (rm && STUDIO_MODES.some((x) => x.id === rm)) {
        setStudioMode(rm as RewriteMode);
      }
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
          source: inputTab === "dictate" ? "DICTATE" : "TEXT",
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
        source: inputTab === "dictate" ? "DICTATE" : "TEXT",
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
        body: JSON.stringify(
          activePersonaId
            ? { text, personaId: activePersonaId }
            : { text, mode: studioMode },
        ),
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
    setActivePersonaId(null);
    setStudioMode(m);
    setStudioResult(null);
    setStudioError("");
    if (workspaceTab === "rewrite") {
      router.replace(`/console?tab=lab&workspace=rewrite&rewriteMode=${encodeURIComponent(m)}`, { scroll: false });
    }
  };

  const selectPersona = (id: string) => {
    setActivePersonaId(id);
    setStudioResult(null);
    setStudioError("");
    router.replace(`/console?tab=lab&workspace=rewrite&persona=${encodeURIComponent(id)}`, { scroll: false });
  };

  const openPersonaModal = () => {
    setPersonaModalTab("ai");
    setPersonaAiDescription("");
    setPersonaFormName("");
    setPersonaFormInstructions("");
    setPersonaModalError("");
    setPersonaModalOpen(true);
  };

  const generatePersonaDraft = async () => {
    const d = personaAiDescription.trim();
    if (d.length < 8) return;
    setPersonaGenLoading(true);
    try {
      const res = await fetch("/api/transform-personas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: d }),
      });
      const data = (await res.json()) as {
        draft?: { name: string; instructions: string };
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Generation failed");
      if (!data.draft) throw new Error("No draft returned");
      setPersonaFormName(data.draft.name);
      setPersonaFormInstructions(data.draft.instructions);
      setPersonaModalError("");
    } catch (e) {
      setPersonaModalError(e instanceof Error ? e.message : "Persona generation failed");
    } finally {
      setPersonaGenLoading(false);
    }
  };

  const savePersonaFromModal = async () => {
    const name = personaFormName.trim();
    const instructions = personaFormInstructions.trim();
    if (!name || !instructions) return;
    setPersonaSaveLoading(true);
    try {
      const res = await fetch("/api/transform-personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, instructions }),
      });
      const data = (await res.json()) as { persona?: TransformPersonaRow; error?: string };
      if (!res.ok) throw new Error(data.error || "Save failed");
      if (!data.persona?.id) throw new Error("No persona returned");
      await loadPersonas();
      setPersonaModalOpen(false);
      selectPersona(data.persona.id);
    } catch (e) {
      setPersonaModalError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setPersonaSaveLoading(false);
    }
  };

  const deletePersona = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this persona?")) return;
    setPersonaDeletingId(id);
    try {
      const res = await fetch(`/api/transform-personas/${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Delete failed");
      }
      if (activePersonaId === id) {
        setActivePersonaId(null);
        router.replace(
          `/console?tab=lab&workspace=rewrite&rewriteMode=${encodeURIComponent(studioMode)}`,
          { scroll: false },
        );
      }
      await loadPersonas();
    } catch (err) {
      setStudioError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setPersonaDeletingId(null);
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
    <div className={cn("flex flex-1 flex-col overflow-hidden", t.shell)}>
      <header className={cn("shrink-0 border-b px-4 py-3 sm:px-5 sm:py-3.5", t.border, t.s1)}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className={cn("text-base font-semibold tracking-tight sm:text-lg", t.text)}>Workspace</h1>
            <p className={cn("mt-0.5 text-[11px] leading-snug sm:text-xs", t.muted)}>
              <span className={cn("font-medium", t.text)}>Review</span> and{" "}
              <span className={cn("font-medium", t.text)}>Transform</span> written copy.
              Switch to <span className={cn("font-medium", t.text)}>Voice coach</span> above to coach delivery.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className={cn("flex rounded-lg border p-0.5", t.borderSub, t.s2)}>
              <button
                type="button"
                onClick={() => goReview()}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[11px] font-semibold transition",
                  workspaceTab === "review"
                    ? cn(t.s1, t.text, "shadow-sm")
                    : cn(t.muted, t.navHover),
                )}
              >
                Review
              </button>
              <button
                type="button"
                onClick={() => goRewrite()}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[11px] font-semibold transition",
                  workspaceTab === "rewrite"
                    ? cn(t.s1, t.text, "shadow-sm")
                    : cn(t.muted, t.navHover),
                )}
              >
                Transform
              </button>
            </div>
            {workspaceTab === "review" ? (
              <button
                type="button"
                onClick={() => void handleRunAllAnalyze()}
                disabled={!text.trim() || runAllAnalyzeLoading}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition disabled:opacity-45",
                  t.btnPrimary,
                )}
              >
                {runAllAnalyzeLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
                {runAllAnalyzeLoading ? "Running…" : "Run all analyses"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleStudioRewrite()}
                disabled={!text.trim() || studioLoading}
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--brand-teal)] px-3 py-1.5 text-[11px] font-semibold text-[#0C0C0B] transition hover:opacity-90 disabled:opacity-45"
              >
                {studioLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <PenTool className="h-3.5 w-3.5" />}
                {studioLoading ? "Transforming…" : "Transform text"}
              </button>
            )}
          </div>
        </div>
      </header>

      {workspaceTab === "rewrite" ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className={cn("shrink-0 border-b px-4 py-2.5 sm:px-5", t.border, t.s1)}>
            <p className={cn("mb-2 text-[10px] font-bold uppercase tracking-[0.12em]", t.muted2)}>Built-in modes</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {STUDIO_MODES.map((m) => {
                const Icon = m.icon;
                const active = !activePersonaId && studioMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectStudioMode(m.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-left text-[11px] font-semibold transition",
                      active
                        ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/10 text-[var(--brand-teal)]"
                        : cn(t.borderSub, t.muted, t.navHover),
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 opacity-90" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
            <div className={cn("mt-3 flex flex-wrap items-center gap-2 border-t pt-3", t.border)}>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <p className={cn("shrink-0 text-[10px] font-bold uppercase tracking-[0.12em]", t.muted2)}>
                  Your personas
                </p>
                {personasLoading ? (
                  <Loader2 className={cn("h-3.5 w-3.5 animate-spin", t.muted)} />
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => openPersonaModal()}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                  t.borderSub,
                  t.muted,
                  t.navHover,
                )}
              >
                <Plus className="h-3 w-3" />
                New
              </button>
            </div>
            <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
              {personas.length === 0 && !personasLoading ? (
                <p className={cn("text-[11px]", t.muted2)}>Save a custom voice after generating with AI, or add one manually.</p>
              ) : null}
              {personas.map((p) => {
                const active = activePersonaId === p.id;
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "flex shrink-0 items-center gap-0.5 rounded-lg border pr-0.5 transition",
                      active
                        ? "border-[var(--brand-magenta)] bg-[var(--brand-magenta)]/10"
                        : cn(t.borderSub, t.s2),
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => selectPersona(p.id)}
                      className={cn(
                        "max-w-[200px] truncate px-3 py-1.5 text-left text-[11px] font-semibold",
                        active ? "text-[var(--brand-magenta)]" : cn(t.muted, t.navHover),
                      )}
                    >
                      {p.name}
                    </button>
                    <button
                      type="button"
                      title="Delete persona"
                      disabled={personaDeletingId === p.id}
                      onClick={(e) => void deletePersona(p.id, e)}
                      className={cn(
                        "rounded p-1 transition disabled:opacity-40",
                        t.muted,
                        t.navHover,
                      )}
                    >
                      {personaDeletingId === p.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
            <div className={cn("flex min-h-[240px] flex-1 flex-col overflow-hidden border-b lg:min-h-0 lg:border-b-0 lg:border-r", t.border)}>
              <div className={cn("shrink-0 border-b px-4 py-2 sm:px-5", t.border)}>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Source</span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setStudioResult(null);
                  }}
                  placeholder="Paste or type the text you want to transform…"
                  className={cn(
                    "h-full min-h-[280px] w-full resize-none bg-transparent text-[14px] leading-[1.75] outline-none",
                    t.text,
                    "placeholder:opacity-40",
                  )}
                />
              </div>
              <div className={cn("shrink-0 border-t px-4 py-2 sm:px-5", t.border)}>
                <span className={cn("text-[11px]", t.muted2)}>
                  {text.trim() ? `${text.trim().split(/\s+/).length} words` : "No text yet"}
                </span>
              </div>
            </div>
            <div className={cn("flex min-h-[280px] flex-1 flex-col overflow-hidden lg:min-h-0", t.s2)}>
              <div className={cn("flex shrink-0 items-center justify-between border-b px-4 py-2 sm:px-5", t.border)}>
                <span className={cn("text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Output</span>
                {studioResult?.rewritten && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowStudioChanges(!showStudioChanges)}
                      className={cn("text-[11px] font-semibold", t.muted, t.navHover)}
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
                      className={cn("flex items-center gap-1 text-[11px] font-semibold", t.muted, t.navHover)}
                    >
                      {studioCopied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {studioCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-5">
                {studioLoading && (
                  <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3">
                    <Loader2 className={cn("h-8 w-8 animate-spin", t.info)} />
                    <p className={cn("text-sm font-medium", t.muted)}>
                      Crafting your{" "}
                      {activePersonaId
                        ? (personas.find((p) => p.id === activePersonaId)?.name ?? "persona")
                        : (STUDIO_MODES.find((x) => x.id === studioMode)?.label.toLowerCase() ?? "text")}{" "}
                      version…
                    </p>
                  </div>
                )}
                {studioError && (
                  <div className={cn("rounded-xl border p-4", t.border)}>
                    <p className={cn("text-sm font-semibold", t.danger)}>{studioError}</p>
                  </div>
                )}
                {!studioLoading && !studioError && !studioResult && (
                  <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-3 text-center">
                    <PenTool className={cn("h-8 w-8 opacity-20", t.muted)} />
                    <p className={cn("text-sm font-semibold", t.muted)}>Transformed text appears here</p>
                    <p className={cn("max-w-xs text-xs", t.muted2)}>Pick a mode above, then tap Transform text</p>
                  </div>
                )}
                {studioResult && !showStudioChanges && studioResult.rewritten && (
                  <p className={cn("whitespace-pre-wrap text-[14px] leading-[1.75]", t.text)}>{studioResult.rewritten}</p>
                )}
                {studioResult && showStudioChanges && studioResult.changes && studioResult.changes.length > 0 && (
                  <div className="space-y-3">
                    {studioResult.changes.map((c, i) => (
                      <div key={i} className={cn("overflow-hidden rounded-xl border", t.border, t.s3)}>
                        <div className={cn("border-b px-3 py-2", t.border)}>
                          <p className={cn("text-xs line-through", t.muted)}>{c.original}</p>
                        </div>
                        <div className={cn("border-b px-3 py-2", t.border)}>
                          <p className={cn("text-xs font-semibold", t.text)}>{c.rewritten}</p>
                        </div>
                        <div className="px-3 py-2">
                          <p className={cn("text-[11px]", t.muted2)}>{c.reason}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {studioResult?.rewritten && (
                <div className={cn("flex shrink-0 flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5 sm:px-5", t.border)}>
                  <span className={cn("text-[11px]", t.muted2)}>
                    {studioResult.wordCountRewritten != null ? `${studioResult.wordCountRewritten} words` : ""}
                    {studioResult.wordCountOriginal != null && studioResult.wordCountRewritten != null && (
                      <span className={cn("ml-2", t.muted2)}>
                        ({studioResult.wordCountRewritten > studioResult.wordCountOriginal ? "+" : ""}
                        {studioResult.wordCountRewritten - studioResult.wordCountOriginal})
                      </span>
                    )}
                  </span>
                  <div className="flex items-center gap-3">
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
                      className={cn("text-[11px] font-bold", t.text, "hover:underline")}
                    >
                      Apply to source
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleStudioRewrite()}
                      disabled={studioLoading}
                      className={cn("flex items-center gap-1 text-[11px] font-semibold disabled:opacity-45", t.muted, t.navHover)}
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
            <div className={cn("shrink-0 border-t px-4 py-2.5 sm:px-5", t.border, t.s1)}>
              <p className={cn("text-[11px] font-medium", t.muted)}>
                <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-[var(--brand-teal)]" />
                {studioResult.summary}
                {studioResult.toneShift && <span className={cn("ml-2 font-normal", t.muted2)}>· {studioResult.toneShift}</span>}
              </p>
            </div>
          )}
        </div>
      ) : (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <div className={cn("flex min-h-[min(50vh,420px)] flex-1 flex-col overflow-hidden border-b lg:min-h-0 lg:border-b-0 lg:border-r", t.border)}>
          {!commResult && (
            <div className={cn("shrink-0 border-b px-4 py-2 sm:px-5", t.border)}>
              <div className={cn("flex gap-0.5 rounded-lg border p-0.5", t.borderSub, t.s2)}>
                <button
                  type="button"
                  onClick={() => setInputTab("type")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition",
                    inputTab === "type" ? cn(t.s1, t.text, "shadow-sm") : cn(t.muted, t.navHover),
                  )}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Type / paste
                </button>
                <button
                  type="button"
                  onClick={() => setInputTab("dictate")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-semibold transition",
                    inputTab === "dictate" ? cn(t.s1, t.text, "shadow-sm") : cn(t.muted, t.navHover),
                  )}
                >
                  <Mic className="h-3.5 w-3.5 text-[var(--brand-purple)]" />
                  Dictate
                </button>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-auto p-4 sm:p-5">
            {commResult ? (
              <div className="min-h-full">
                <div className="mb-3 space-y-0.5">
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                    Analyzed text — communication flags highlighted
                  </p>
                  <p className={cn("text-[11px]", t.muted)}>
                    Run other tools on the right for compliance, intent, and AI authorship.
                  </p>
                </div>
                <div
                  className={cn("whitespace-pre-wrap text-[14px] leading-[1.8]", t.text)}
                  dangerouslySetInnerHTML={{ __html: highlightText(text, commResult.flags) }}
                />
              </div>
            ) : inputTab === "dictate" ? (
              <div className={cn("flex min-h-[min(50vh,360px)] flex-col items-center justify-center gap-4 rounded-xl border border-dashed px-4 py-8 text-center sm:min-h-[360px] sm:gap-5 sm:px-6 sm:py-10", t.border)}>
                {transcribing ? (
                  <>
                    <Loader2 className={cn("h-9 w-9 animate-spin", t.info)} />
                    <div>
                      <p className={cn("text-sm font-semibold", t.text)}>Transcribing audio…</p>
                      <p className={cn("mt-1 text-xs", t.muted)}>Using your speech-to-text deployment</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl border", t.border)}>
                      <Mic className="h-6 w-6 text-[var(--brand-purple)]" />
                    </div>
                    <div className="max-w-md space-y-1.5">
                      <p className={cn("text-sm font-semibold", t.text)}>Speak to type</p>
                      <p className={cn("text-xs leading-relaxed", t.muted)}>
                        Dictation fills the editor for writing analysis. For how you{" "}
                        <span className={cn("font-semibold", t.text)}>sound</span> when speaking, use{" "}
                        <span className={cn("font-semibold", t.text)}>Voice coach</span> in the header.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {!recording ? (
                        <button
                          type="button"
                          onClick={() => void startRecording()}
                          className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-purple)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          <Mic className="h-4 w-4" />
                          Start recording
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={stopRecording}
                          className={cn("inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition", t.borderSub, t.danger, t.navHover)}
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                          </span>
                          Stop &amp; transcribe
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className={cn("inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition", t.borderSub, t.muted, t.navHover)}
                      >
                        <Upload className="h-4 w-4 opacity-70" />
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
                placeholder={"Paste or type your text here…\n\nRun each tool on the right individually, or tap Run all analyses for all four passes at once."}
                className={cn(
                  "h-full min-h-[240px] w-full resize-none bg-transparent text-[14px] leading-relaxed outline-none sm:min-h-[400px]",
                  t.text,
                  "placeholder:opacity-35",
                )}
              />
            )}
          </div>

          <div className={cn("flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5 sm:px-5", t.border)}>
            <span className={cn("text-[11px]", t.muted2)}>
              {transcribing
                ? "Transcribing…"
                : inputTab === "dictate" && !commResult
                  ? "Transcription fills the editor"
                  : text.trim()
                    ? `${text.trim().split(/\s+/).length} words`
                    : "No text entered"}
            </span>
            {hasAnyResult && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => clearAnalysis()}
                  className={cn("text-[11px] font-semibold", t.muted, t.navHover)}
                >
                  Edit text
                </button>
                {selectedTool && hasResultForTool(selectedTool) && (
                  <button
                    type="button"
                    onClick={() => void runTool(selectedTool)}
                    disabled={!text.trim() || Boolean(loadingTools[selectedTool])}
                    className={cn("text-[11px] font-semibold disabled:opacity-45", t.text, t.navHover)}
                  >
                    Refresh
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={cn("flex w-full shrink-0 flex-col overflow-hidden border-t lg:w-[520px] lg:max-w-[520px] lg:border-l lg:border-t-0", t.border, t.s1)}>
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {error && (
              <div className={cn("mb-4 rounded-xl border p-3", t.border)}>
                <p className={cn("text-sm font-semibold", t.danger)}>{error}</p>
              </div>
            )}

            {!text.trim() && (
              <div className={cn("mb-4 rounded-xl border px-4 py-3 text-[12px] leading-relaxed", t.border, t.s2, t.muted)}>
                Add text on the left to run a tool.
              </div>
            )}

            <nav aria-label="Analysis tools" className="mb-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className={cn("text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Analysis tools</p>
                <p className={cn("text-[10px]", t.muted2)}>Tap to run · tap again to refresh</p>
              </div>
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
                  teaser = <Loader2 className={cn("h-4 w-4 shrink-0 animate-spin", t.muted)} />;
                } else if (tool.id === "communication" && commResult) {
                  teaser = (
                    <div className="text-right">
                      <span className={cn("block text-base font-black tabular-nums", t.text)}>{commResult.overallScore}</span>
                      <span className={cn("text-[9px] font-semibold uppercase", t.muted2)}>Overall</span>
                    </div>
                  );
                } else if (tool.id === "compliance" && riskResult) {
                  teaser = (
                    <div className="text-right">
                      <span className={`block text-[11px] font-bold ${rc.text}`}>{rc.label}</span>
                      <span className={cn("text-[9px] font-semibold uppercase", t.muted2)}>{riskResult.overallScore}</span>
                    </div>
                  );
                } else if (tool.id === "intent" && intentResult) {
                  teaser = (
                    <div className="max-w-[100px] text-right">
                      <span className={`block truncate text-[11px] font-bold ${intentLabel.text}`}>{intentLabel.label}</span>
                      <span className={cn("text-[9px] font-semibold uppercase", t.muted2)}>{intentResult.confidenceScore}%</span>
                    </div>
                  );
                } else if (tool.id === "detect" && detectResult) {
                  teaser = (
                    <div className="text-right">
                      <span className={cn("block text-base font-black tabular-nums", t.warn)}>{detectResult.aiProbability}%</span>
                      <span className={cn("text-[9px] font-semibold uppercase", t.muted2)}>AI-like</span>
                    </div>
                  );
                } else {
                  teaser = (
                    <span className={cn("text-[10px] font-semibold uppercase", t.muted2)}>Run</span>
                  );
                }
                return (
                  <button
                    key={tool.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => onToolRowClick(tool.id)}
                    disabled={busy}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition disabled:cursor-wait disabled:opacity-60",
                      active
                        ? cn(t.s3, t.border)
                        : cn(t.s2, t.border, t.navHover),
                    )}
                  >
                    <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", t.border, active ? t.s4 : t.s3)}>
                      <Icon className={cn("h-4 w-4", tool.iconColor)} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className={cn("text-[12px] font-semibold", t.text)}>{tool.title}</p>
                      <p className={cn("mt-0.5 text-[10px] leading-snug", t.muted2)}>{tool.subtitle}</p>
                    </div>
                    <div className="flex shrink-0 items-center justify-end">{teaser}</div>
                  </button>
                );
              })}
            </nav>

            {selectedTool && toolErrors[selectedTool] && (
              <div className={cn("mb-4 rounded-xl border p-3", t.border)}>
                <p className={cn("text-[11px] font-semibold", t.danger)}>{toolErrors[selectedTool]}</p>
                <button
                  type="button"
                  onClick={() => void runTool(selectedTool)}
                  disabled={!text.trim() || Boolean(loadingTools[selectedTool])}
                  className={cn("mt-2 text-[11px] font-semibold disabled:opacity-45", t.danger)}
                >
                  Retry
                </button>
              </div>
            )}

            {selectedTool && loadingTools[selectedTool] && !hasResultForTool(selectedTool) && !toolErrors[selectedTool] && (
              <div className="mb-6 flex flex-col items-center gap-2 py-8">
                <Loader2 className={cn("h-7 w-7 animate-spin", t.info)} />
                <p className={cn("text-sm", t.muted)}>Running analysis…</p>
              </div>
            )}

            {!selectedTool && (
              <p className={cn("py-6 text-center text-xs", t.muted2)}>Pick a tool above — details appear here. Use Transform for full rewrites.</p>
            )}

            {selectedTool === "communication" && commResult && (
                  <div className="space-y-4">
                    <div className={cn("grid grid-cols-4 gap-2 rounded-xl border p-3", t.border, t.s2)}>
                      {[
                        { label: "Tone", score: commResult.toneScore, color: getScoreColor(commResult.toneScore) },
                        { label: "Risk", score: commResult.riskScore, color: getRiskColor(commResult.riskScore) },
                        { label: "Clarity", score: commResult.clarityScore, color: getScoreColor(commResult.clarityScore) },
                        { label: "Overall", score: commResult.overallScore, color: getScoreColor(commResult.overallScore) },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <div className="text-lg font-bold tabular-nums" style={{ color: s.color }}>{s.score}</div>
                          <div className={cn("text-[9px] font-semibold uppercase tracking-wide", t.muted2)}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                      <p className={cn("text-[12px] leading-relaxed", t.muted)}>{commResult.summary}</p>
                    </div>
                    {commResult.flags?.length > 0 && (
                      <div>
                        <h3 className={cn("mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <AlertTriangle className="h-3 w-3" />
                          Flagged issues ({commResult.flags.length})
                        </h3>
                        <div className="space-y-1.5">
                          {commResult.flags.map((flag, i) => {
                            const config = severityConfig[flag.severity];
                            const Icon = config.icon;
                            const isExpanded = expandedFlag === i;
                            return (
                              <div key={i} className={cn("overflow-hidden rounded-xl border", t.border, t.s2)}>
                                <button
                                  type="button"
                                  onClick={() => setExpandedFlag(isExpanded ? null : i)}
                                  className="flex w-full items-start gap-3 p-2.5 text-left"
                                >
                                  <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", config.color)} />
                                  <div className="min-w-0 flex-1">
                                    <p className={cn("truncate text-[12px] font-semibold", t.text)}>&ldquo;{flag.text}&rdquo;</p>
                                    <p className={cn("mt-0.5 text-[10px]", t.muted2)}>{config.label} · {flag.category}</p>
                                  </div>
                                  {isExpanded ? <ChevronUp className={cn("h-3.5 w-3.5 shrink-0", t.muted2)} /> : <ChevronDown className={cn("h-3.5 w-3.5 shrink-0", t.muted2)} />}
                                </button>
                                {isExpanded && (
                                  <div className={cn("border-t px-3 pb-3 pt-2", t.border)}>
                                    <p className={cn("mb-2 text-[11px] leading-relaxed", t.muted)}>{flag.explanation}</p>
                                    <div className={cn("rounded-lg border p-2.5", t.border, t.s3)}>
                                      <p className={cn("mb-1 text-[9px] font-semibold uppercase", t.muted2)}>Suggestion</p>
                                      <p className={cn("text-[11px]", t.text)}>{flag.suggestion}</p>
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
                        <h3 className={cn("mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <CheckCircle2 className="h-3 w-3" />
                          Strengths
                        </h3>
                        <div className="space-y-1.5">
                          {commResult.strengths.map((s, i) => (
                            <div key={i} className={cn("flex items-start gap-2 text-[11px] leading-relaxed", t.muted)}>
                              <CheckCircle2 className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", t.ok)} />
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {commResult.improvements?.length > 0 && (
                      <div>
                        <h3 className={cn("mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <TrendingUp className="h-3 w-3" />
                          Improvements
                        </h3>
                        <div className="space-y-1.5">
                          {commResult.improvements.map((s, i) => (
                            <div key={i} className={cn("flex items-start gap-2 text-[11px] leading-relaxed", t.muted)}>
                              <ArrowRight className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", t.info)} />
                              {s}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedTool === "compliance" && riskResult && (
                  <div className="space-y-4">
                    <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", t.border)}>
                            {riskResult.riskLevel === "low" ? (
                              <CheckCircle2 className={cn("h-5 w-5", t.ok)} />
                            ) : riskResult.riskLevel === "critical" ? (
                              <AlertTriangle className={cn("h-5 w-5", t.danger)} />
                            ) : (
                              <AlertCircle className={cn("h-5 w-5", t.warn)} />
                            )}
                          </div>
                          <div>
                            <h2 className={cn("text-sm font-bold", riskConfig.text)}>{riskConfig.label}</h2>
                            <p className={cn("mt-0.5 text-[11px]", t.muted)}>{riskResult.summary}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn("text-2xl font-bold tabular-nums", riskConfig.text)}>{riskResult.overallScore}</div>
                          <div className={cn("text-[9px] font-semibold uppercase", t.muted2)}>Safety</div>
                        </div>
                      </div>
                    </div>
                    {riskResult.issues?.length > 0 ? (
                      <div className="space-y-2">
                        <h3 className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <AlertTriangle className="h-3 w-3" />
                          Issues ({riskResult.issues.length})
                        </h3>
                        {riskResult.issues.map((issue, i) => (
                          <div key={i} className={cn("overflow-hidden rounded-xl border", t.border, t.s2)}>
                            <div className={cn("border-b px-3 py-2.5", t.border)}>
                              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                                  issue.severity === "critical" ? "bg-rose-500/15 text-rose-400" :
                                  issue.severity === "warning" ? "bg-amber-500/15 text-amber-400" :
                                  cn(t.s4, t.muted)
                                )}>
                                  {issue.severity}
                                </span>
                                <span className={cn("text-[10px] font-semibold", t.muted2)}>
                                  {CATEGORY_LABELS[issue.category] || issue.category}
                                </span>
                              </div>
                              <p className={cn("text-[12px] font-semibold", t.text)}>&ldquo;{issue.text}&rdquo;</p>
                              <p className={cn("mt-1.5 text-[11px] leading-relaxed", t.muted)}>{issue.explanation}</p>
                            </div>
                            <div className={cn("px-3 py-2.5", t.s3)}>
                              <div className="mb-1.5 flex items-center justify-between">
                                <span className={cn("flex items-center gap-1 text-[9px] font-bold uppercase", t.ok)}>
                                  <Shield className="h-3 w-3" />
                                  Safer alternative
                                </span>
                                <button
                                  type="button"
                                  onClick={() => copySafer(issue.saferVersion, i)}
                                  className={cn("flex items-center gap-1 text-[10px] font-semibold", t.muted, t.navHover)}
                                >
                                  {copiedRiskIdx === i ? <CheckCircle2 className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                  {copiedRiskIdx === i ? "Copied" : "Copy"}
                                </button>
                              </div>
                              <p className={cn("text-[12px] leading-relaxed", t.text)}>{issue.saferVersion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={cn("rounded-xl border p-5 text-center", t.border, t.s2)}>
                        <CheckCircle2 className={cn("mx-auto mb-2 h-7 w-7", t.ok)} />
                        <p className={cn("font-bold text-sm", t.text)}>All clear</p>
                        <p className={cn("mt-1 text-[11px]", t.muted)}>No compliance issues flagged.</p>
                      </div>
                    )}
                    {riskResult.recommendations?.length > 0 && (
                      <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                        <h3 className={cn("mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <Sparkles className="h-3 w-3" />
                          Recommendations
                        </h3>
                        <ul className="space-y-1.5">
                          {riskResult.recommendations.map((r, i) => (
                            <li key={i} className={cn("flex items-start gap-2 text-[11px] leading-relaxed", t.muted)}>
                              <ArrowRight className={cn("mt-0.5 h-3 w-3 shrink-0", t.danger)} />
                              {r}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {selectedTool === "intent" && intentResult && assessment && (
                  <div className="space-y-4">
                    <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border", t.border)}>
                            <Brain className={cn("h-5 w-5", t.info)} />
                          </div>
                          <div>
                            <h2 className={cn("text-sm font-bold", t.text)}>{assessment.label}</h2>
                            <p className={cn("mt-0.5 text-[11px]", t.muted)}>{assessment.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn("text-2xl font-bold tabular-nums", t.text)}>{intentResult.confidenceScore}%</div>
                          <div className={cn("text-[9px] font-semibold uppercase", t.muted2)}>Confidence</div>
                        </div>
                      </div>
                    </div>
                    {intentResult.tactics?.length > 0 ? (
                      <div className="space-y-2">
                        <h3 className={cn("flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <Eye className="h-3 w-3" />
                          Tactics ({intentResult.tactics.length})
                        </h3>
                        {intentResult.tactics.map((tactic, i) => (
                          <div key={i} className={cn("rounded-xl border p-3", t.border, t.s2)}>
                            <div className="mb-1.5 flex flex-wrap items-center gap-2">
                              <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase",
                                tactic.impact === "high" ? "bg-rose-500/15 text-rose-400" :
                                tactic.impact === "medium" ? "bg-amber-500/15 text-amber-400" :
                                cn(t.s4, t.muted)
                              )}>
                                {tactic.impact} impact
                              </span>
                              <span className={cn("text-[11px] font-semibold", t.text)}>{TACTIC_LABELS[tactic.type] || tactic.type}</span>
                            </div>
                            <div className={cn("mb-1.5 rounded-lg border px-3 py-2", t.border, t.s3)}>
                              <p className={cn("text-[12px] font-medium", t.text)}>&ldquo;{tactic.text}&rdquo;</p>
                            </div>
                            <p className={cn("text-[11px] leading-relaxed", t.muted)}>{tactic.explanation}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className={cn("rounded-xl border p-5 text-center", t.border, t.s2)}>
                        <Shield className={cn("mx-auto mb-2 h-7 w-7", t.ok)} />
                        <p className={cn("font-bold text-sm", t.text)}>No tactics detected</p>
                        <p className={cn("mt-1 text-[11px]", t.muted)}>Text appears straightforward.</p>
                      </div>
                    )}
                    {intentResult.biasDetected?.length > 0 && (
                      <div>
                        <h3 className={cn("mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <AlertTriangle className="h-3 w-3" />
                          Cognitive biases
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {intentResult.biasDetected.map((b, i) => (
                            <span key={i} className={cn("rounded-lg border px-2.5 py-1 text-[11px] font-semibold", t.border, t.s3, t.text)}>
                              {b}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {intentResult.neutralVersion && (
                      <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                            <Shield className="h-3 w-3" />
                            Neutral version
                          </h3>
                          <button
                            type="button"
                            onClick={() => setShowNeutral(!showNeutral)}
                            className={cn("text-[11px] font-semibold", t.muted, t.navHover)}
                          >
                            {showNeutral ? "Hide" : "Show"}
                          </button>
                        </div>
                        {showNeutral && (
                          <div className={cn("rounded-lg border p-3", t.border, t.s3)}>
                            <p className={cn("text-[12px] leading-relaxed", t.text)}>{intentResult.neutralVersion}</p>
                          </div>
                        )}
                      </div>
                    )}
                    <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider mb-1", t.muted2)}>Summary</p>
                      <p className={cn("text-[12px] leading-relaxed", t.muted)}>{intentResult.summary}</p>
                    </div>
                  </div>
                )}

                {selectedTool === "detect" && detectResult && (
                  <div className="space-y-4">
                    <div className={cn("rounded-xl border p-4 text-center", t.border, t.s2)}>
                      <div className="relative mx-auto mb-3 inline-block">
                        <svg width="96" height="96" className="score-ring">
                          <circle className="score-ring-track" cx="48" cy="48" r="36" strokeWidth="6" />
                          <circle
                            className="score-ring-fill"
                            cx="48"
                            cy="48"
                            r="36"
                            strokeWidth="6"
                            stroke={getAiProbStyle(detectResult.aiProbability).ring}
                            strokeDasharray={aiRingCircumference}
                            strokeDashoffset={
                              aiRingCircumference - (detectResult.aiProbability / 100) * aiRingCircumference
                            }
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={cn("text-xl font-black", t.warn)}>
                            {detectResult.aiProbability}%
                          </span>
                        </div>
                      </div>
                      <p className={cn("text-sm font-bold", t.text)}>
                        {verdictLabels[detectResult.verdict] || detectResult.verdict}
                      </p>
                      <p className={cn("mt-1 text-[11px]", t.muted2)}>Estimated AI probability (heuristic)</p>
                    </div>

                    <div className={cn("space-y-3 rounded-xl border p-3", t.border, t.s2)}>
                      <div>
                        <h3 className={cn("mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <Bot className="h-3 w-3" />
                          AI signals
                        </h3>
                        <div className="space-y-1.5">
                          {detectResult.indicators?.aiSignals?.map((s, i) => (
                            <p key={i} className={cn("flex items-start gap-2 text-[11px]", t.muted)}>
                              <AlertTriangle className={cn("mt-0.5 h-3 w-3 shrink-0", t.warn)} />
                              {s}
                            </p>
                          ))}
                        </div>
                      </div>
                      <div className={cn("border-t pt-3", t.border)}>
                        <h3 className={cn("mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <User className="h-3 w-3" />
                          Human signals
                        </h3>
                        <div className="space-y-1.5">
                          {detectResult.indicators?.humanSignals?.map((s, i) => (
                            <p key={i} className={cn("flex items-start gap-2 text-[11px]", t.muted)}>
                              <CheckCircle2 className={cn("mt-0.5 h-3 w-3 shrink-0", t.ok)} />
                              {s}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {detectResult.sections?.length > 0 && (
                      <div>
                        <h3 className={cn("mb-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>By section</h3>
                        <div className="space-y-1.5">
                          {detectResult.sections.map((s, i) => {
                            const c = getAiProbStyle(s.probability);
                            return (
                              <div key={i} className={cn("overflow-hidden rounded-lg border", t.border)}>
                                <div className={cn("flex items-center justify-between px-3 py-1.5", t.s3)}>
                                  <div className="flex items-center gap-2">
                                    <div className={cn("h-2 w-2 rounded-full", c.bg)} />
                                    <span className={cn("text-[11px] font-bold", c.text)}>{s.probability}% AI</span>
                                  </div>
                                  <span className={cn("text-[10px]", t.muted2)}>{s.reason}</span>
                                </div>
                                <p className={cn("px-3 py-2 text-[11px] leading-relaxed", t.muted)}>{s.text}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {detectResult.suggestions?.length > 0 && (
                      <div>
                        <h3 className={cn("mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                          <Sparkles className="h-3 w-3" />
                          Sound more human
                        </h3>
                        <div className="space-y-1.5">
                          {detectResult.suggestions.map((s, i) => (
                            <div key={i} className={cn("flex items-start gap-2 rounded-lg border p-2.5", t.border, t.s2)}>
                              <Wand2 className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", t.warn)} />
                              <p className={cn("text-[11px] leading-relaxed", t.muted)}>{s}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                      <p className={cn("text-[12px] leading-relaxed", t.muted)}>{detectResult.summary}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => void handleHumanize()}
                      disabled={humanizing || !text.trim()}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-[11px] font-bold transition disabled:opacity-45",
                        t.borderSub, t.muted, t.navHover,
                      )}
                    >
                      {humanizing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      Humanize text (friendly rewrite)
                    </button>
                  </div>
                )}

            {text.trim() && (commResult || riskResult || intentResult || detectResult) && (
              <div className={cn("mt-4 flex flex-wrap gap-2 border-t pt-4", t.border)}>
                <button
                  type="button"
                  onClick={() => goRewrite("safe")}
                  className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition", t.borderSub, t.muted, t.navHover)}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  Refine: Safe
                </button>
                <button
                  type="button"
                  onClick={() => goRewrite("professional")}
                  className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition", t.borderSub, t.muted, t.navHover)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Refine: Professional
                </button>
                <button
                  type="button"
                  onClick={() => goRewrite("friendly")}
                  className={cn("flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[11px] font-semibold transition", t.borderSub, t.muted, t.navHover)}
                >
                  <Smile className="h-3.5 w-3.5" />
                  Refine: Friendly
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {personaModalOpen ? (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="persona-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close"
            onClick={() => setPersonaModalOpen(false)}
          />
          <div
            className={cn(
              "relative z-10 flex max-h-[min(90vh,640px)] w-full max-w-lg flex-col rounded-xl border shadow-xl",
              t.s1,
              t.border,
            )}
          >
            <div className={cn("flex items-center justify-between border-b px-4 py-3", t.border)}>
              <h2 id="persona-modal-title" className={cn("text-sm font-semibold", t.text)}>
                New transform persona
              </h2>
              <button
                type="button"
                onClick={() => setPersonaModalOpen(false)}
                className={cn("rounded p-1", t.muted, t.navHover)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className={cn("flex border-b", t.border)}>
              <button
                type="button"
                onClick={() => setPersonaModalTab("ai")}
                className={cn(
                  "flex-1 px-3 py-2 text-[11px] font-semibold",
                  personaModalTab === "ai" ? cn(t.text, t.s2) : cn(t.muted, t.navHover),
                )}
              >
                Generate with AI
              </button>
              <button
                type="button"
                onClick={() => setPersonaModalTab("manual")}
                className={cn(
                  "flex-1 px-3 py-2 text-[11px] font-semibold",
                  personaModalTab === "manual" ? cn(t.text, t.s2) : cn(t.muted, t.navHover),
                )}
              >
                Manual
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {personaModalError ? (
                <p className={cn("mb-3 rounded-lg border px-3 py-2 text-[12px]", t.border, t.danger)} role="alert">
                  {personaModalError}
                </p>
              ) : null}
              {personaModalTab === "ai" ? (
                <div className="space-y-3">
                  <p className={cn("text-[11px] leading-relaxed", t.muted)}>
                    Describe who this voice is for or how it should sound. We&apos;ll draft a name and rewriter instructions you can edit before saving.
                  </p>
                  <textarea
                    value={personaAiDescription}
                    onChange={(e) => setPersonaAiDescription(e.target.value)}
                    placeholder="e.g. Our general counsel — concise, cautious, no hype; or friendly onboarding for new customers…"
                    rows={4}
                    className={cn(
                      "w-full resize-y rounded-lg border px-3 py-2 text-[13px] outline-none",
                      t.input,
                    )}
                  />
                  <button
                    type="button"
                    disabled={personaAiDescription.trim().length < 8 || personaGenLoading}
                    onClick={() => void generatePersonaDraft()}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-semibold disabled:opacity-45",
                      t.btnPrimary,
                    )}
                  >
                    {personaGenLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Generate draft
                  </button>
                </div>
              ) : null}
              {(personaModalTab === "manual" || (personaModalTab === "ai" && (personaFormName || personaFormInstructions))) ? (
                <div className={cn("space-y-3", personaModalTab === "ai" ? "mt-4 border-t pt-4" : "", t.border)}>
                  <div>
                    <label htmlFor="persona-name" className={cn("mb-1 block text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                      Name
                    </label>
                    <input
                      id="persona-name"
                      value={personaFormName}
                      onChange={(e) => setPersonaFormName(e.target.value)}
                      className={cn("w-full rounded-lg border px-3 py-2 text-[13px] outline-none", t.input)}
                      placeholder="e.g. Legal review tone"
                    />
                  </div>
                  <div>
                    <label htmlFor="persona-instructions" className={cn("mb-1 block text-[10px] font-bold uppercase tracking-wider", t.muted2)}>
                      Rewriter instructions
                    </label>
                    <textarea
                      id="persona-instructions"
                      value={personaFormInstructions}
                      onChange={(e) => setPersonaFormInstructions(e.target.value)}
                      rows={8}
                      className={cn("w-full resize-y rounded-lg border px-3 py-2 text-[13px] leading-relaxed outline-none", t.input)}
                      placeholder="Instructions the model follows when transforming text…"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <div className={cn("flex justify-end gap-2 border-t px-4 py-3", t.border)}>
              <button
                type="button"
                onClick={() => setPersonaModalOpen(false)}
                className={cn("rounded-lg border px-3 py-2 text-[11px] font-semibold", t.borderSub, t.muted, t.navHover)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={
                  personaSaveLoading ||
                  !personaFormName.trim() ||
                  !personaFormInstructions.trim()
                }
                onClick={() => void savePersonaFromModal()}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[11px] font-semibold disabled:opacity-45",
                  t.btnPrimary,
                )}
              >
                {personaSaveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save persona
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
