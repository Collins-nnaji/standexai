"use client";

import { Suspense, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  FileText, Sparkles, Loader2, AlertTriangle, AlertCircle, Info,
  PenTool, Smile, CheckCircle2, TrendingUp, Eye, ChevronDown, ChevronUp,
  Mic, ShieldAlert, Brain, Shield, Copy, ScanSearch, Bot, User, Wand2,
  Zap, Minus, RefreshCw, Plus, Trash2, X, BookOpen, LayoutList, Users, BadgeAlert,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CONSOLE_THEMES,
  type ConsoleThemeMode,
} from "@/components/console/console-theme";
import { dispatchCommunicationSaved } from "@/lib/console-events";
import type { AnalyzeType, RewriteMode } from "@/lib/communication-llm";

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

type ReadabilityResult = {
  readingEaseScore: number;
  gradeLevelApprox: string;
  avgSentenceLength: number;
  longSentenceCount: number;
  wordCount: number;
  issues: Array<{ text: string; issue: string; fix: string }>;
  summary: string;
  recommendations: string[];
};

type StructureResult = {
  documentTypeGuess: string;
  hasClearAsk: boolean;
  missingSections: string[];
  strengths: string[];
  suggestedOutline: string[];
  summary: string;
};

type InclusionResult = {
  inclusionScore: number;
  flags: Array<{ text: string; issue: string; suggestion: string }>;
  summary: string;
  goodPractices: string[];
};

type ClaimsResult = {
  overclaimRisk: string;
  flags: Array<{ text: string; concern: string; suggestion: string }>;
  summary: string;
  recommendations: string[];
};

type RewriteResult = {
  rewritten?: string;
  changes?: Array<{ original: string; rewritten: string; reason: string }>;
  summary?: string;
  toneShift?: string;
  wordCountOriginal?: number;
  wordCountRewritten?: number;
};

type ToolId =
  | "communication"
  | "compliance"
  | "intent"
  | "detect"
  | "readability"
  | "structure"
  | "inclusion"
  | "claims";

type ToolDef = {
  id: ToolId;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconWrap: string;
  iconColor: string;
  activeClass: string;
  idleClass: string;
  analyzeType: AnalyzeType;
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
  {
    id: "readability",
    title: "Readability",
    subtitle: "Sentence length, grade level & clarity fixes",
    icon: BookOpen,
    iconWrap: "border-sky-200 bg-sky-50",
    iconColor: "text-sky-600",
    activeClass: "border-sky-400 bg-sky-50/90 shadow-md shadow-sky-500/10 ring-1 ring-sky-200",
    idleClass: "border-slate-200/80 bg-white/90 hover:border-sky-200",
    analyzeType: "readability",
  },
  {
    id: "structure",
    title: "Structure",
    subtitle: "Outline, asks, and missing sections",
    icon: LayoutList,
    iconWrap: "border-indigo-200 bg-indigo-50",
    iconColor: "text-indigo-600",
    activeClass: "border-indigo-400 bg-indigo-50/90 shadow-md shadow-indigo-500/10 ring-1 ring-indigo-200",
    idleClass: "border-slate-200/80 bg-white/90 hover:border-indigo-200",
    analyzeType: "structure",
  },
  {
    id: "inclusion",
    title: "Inclusive language",
    subtitle: "Respectful, accessible wording",
    icon: Users,
    iconWrap: "border-teal-200 bg-teal-50",
    iconColor: "text-teal-600",
    activeClass: "border-teal-400 bg-teal-50/90 shadow-md shadow-teal-500/10 ring-1 ring-teal-200",
    idleClass: "border-slate-200/80 bg-white/90 hover:border-teal-200",
    analyzeType: "inclusion",
  },
  {
    id: "claims",
    title: "Claims & certainty",
    subtitle: "Overstatements & supportable wording",
    icon: BadgeAlert,
    iconWrap: "border-orange-200 bg-orange-50",
    iconColor: "text-orange-600",
    activeClass: "border-orange-400 bg-orange-50/90 shadow-md shadow-orange-500/10 ring-1 ring-orange-200",
    idleClass: "border-slate-200/80 bg-white/90 hover:border-orange-200",
    analyzeType: "claims",
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
  contentText?: string;
  overallScore?: number;
  toneScore?: number;
  riskScore?: number;
  clarityScore?: number;
  aiProbability?: number;
  riskLevel?: string | null;
}) {
  try {
    const res = await fetch("/api/communication-analysis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) dispatchCommunicationSaved();
  } catch {
    /* non-blocking */
  }
}

type Props = {
  themeMode?: ConsoleThemeMode;
  /** When set, loads draft into the editor without running analysis (ChatGPT-style history). */
  historySnapshot?: { id: string; contentText: string | null } | null;
  /** Sidebar row id while fetch runs — keeps URL sync from clobbering the composer before snapshot arrives. */
  historySelectionId?: string | null;
};

/** Full analysis + transform workspace — mounted from `/console` (single platform). */
export function WritingLabCore({
  themeMode = "light",
  historySnapshot = null,
  historySelectionId = null,
}: Props) {
  const t = CONSOLE_THEMES[themeMode];
  return (
    <Suspense fallback={<div className={cn("flex flex-1 items-center justify-center", t.shell)}><Loader2 className={cn("h-6 w-6 animate-spin", t.muted)} /></div>}>
      <WritingLabInner
        themeMode={themeMode}
        historySnapshot={historySnapshot}
        historySelectionId={historySelectionId}
      />
    </Suspense>
  );
}

function WritingLabInner({
  themeMode = "light",
  historySnapshot = null,
  historySelectionId = null,
}: Props) {
  const t = CONSOLE_THEMES[themeMode];
  const searchParams = useSearchParams();
  const router = useRouter();
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("review");
  const [text, setText] = useState("");
  const [runAllAnalyzeLoading, setRunAllAnalyzeLoading] = useState(false);
  const [commResult, setCommResult] = useState<AnalysisResult | null>(null);
  const [riskResult, setRiskResult] = useState<RiskResult | null>(null);
  const [intentResult, setIntentResult] = useState<IntentResult | null>(null);
  const [detectResult, setDetectResult] = useState<DetectionResult | null>(null);
  const [readabilityResult, setReadabilityResult] = useState<ReadabilityResult | null>(null);
  const [structureResult, setStructureResult] = useState<StructureResult | null>(null);
  const [inclusionResult, setInclusionResult] = useState<InclusionResult | null>(null);
  const [claimsResult, setClaimsResult] = useState<ClaimsResult | null>(null);
  const [studioMode, setStudioMode] = useState<RewriteMode>("professional");
  const [studioResult, setStudioResult] = useState<RewriteResult | null>(null);
  const [studioLoading, setStudioLoading] = useState(false);
  const [studioError, setStudioError] = useState("");
  const [showStudioChanges, setShowStudioChanges] = useState(false);
  const [studioCopied, setStudioCopied] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);
  /** Tools marked to run together via “Run selected”. */
  const [batchSelected, setBatchSelected] = useState<Set<ToolId>>(() => new Set());
  const historyAppliedRef = useRef<string | null>(null);
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

  const hasAnyResult = Boolean(
    commResult ||
      riskResult ||
      intentResult ||
      detectResult ||
      readabilityResult ||
      structureResult ||
      inclusionResult ||
      claimsResult,
  );

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
      case "readability":
        return readabilityResult != null;
      case "structure":
        return structureResult != null;
      case "inclusion":
        return inclusionResult != null;
      case "claims":
        return claimsResult != null;
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

  const openGeneratorWithText = useCallback(() => {
    const seed = (studioResult?.rewritten || text || "").trim();
    const prompt = seed
      ? `Generate a polished enterprise communication from this starting draft. Keep claims supportable.\\n\\n${seed}`
      : "Generate a polished enterprise communication from a short brief. Keep claims supportable.";
    router.replace(`/console?tab=gen&prompt=${encodeURIComponent(prompt)}`, { scroll: false });
  }, [router, studioResult?.rewritten, text]);

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
    // While a sidebar history row is selected, keep the composer driven by history load / snapshot,
    // not by URL (avoids racing `workspace=` / `text=` with the detail fetch).
    if (historySelectionId) return;

    const prefilled = searchParams.get("text");
    if (prefilled) {
      setText(decodeURIComponent(prefilled));
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
  }, [searchParams, historySelectionId]);

  /** Load saved draft from history into the editor — no API re-analysis. */
  useEffect(() => {
    if (!historySnapshot) {
      historyAppliedRef.current = null;
      return;
    }
    if (historyAppliedRef.current === historySnapshot.id) return;
    historyAppliedRef.current = historySnapshot.id;
    setText(historySnapshot.contentText ?? "");
    setActivePersonaId(null);
    setCommResult(null);
    setRiskResult(null);
    setIntentResult(null);
    setDetectResult(null);
    setReadabilityResult(null);
    setStructureResult(null);
    setInclusionResult(null);
    setClaimsResult(null);
    setExpandedFlag(null);
    setShowNeutral(false);
    setSelectedTool(null);
    setBatchSelected(new Set());
    setToolErrors({});
    setLoadingTools({});
    setWorkspaceTab("review");
    router.replace("/console?tab=lab", { scroll: false });
  }, [historySnapshot, router]);

  const clearAnalysis = () => {
    setCommResult(null);
    setRiskResult(null);
    setIntentResult(null);
    setDetectResult(null);
    setReadabilityResult(null);
    setStructureResult(null);
    setInclusionResult(null);
    setClaimsResult(null);
    setExpandedFlag(null);
    setShowNeutral(false);
    setSelectedTool(null);
    setBatchSelected(new Set());
    setToolErrors({});
    setLoadingTools({});
  };

  const applyAnalyzeResult = (type: AnalyzeType, result: unknown) => {
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
      case "readability":
        setReadabilityResult(result as ReadabilityResult);
        break;
      case "structure":
        setStructureResult(result as StructureResult);
        break;
      case "inclusion":
        setInclusionResult(result as InclusionResult);
        break;
      case "claims":
        setClaimsResult(result as ClaimsResult);
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
          source: "TEXT",
          kind: "communication",
          contentText: text.trim(),
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

  const focusToolPanel = (id: ToolId) => {
    setSelectedTool(id);
  };

  const toggleBatchTool = (id: ToolId) => {
    setBatchSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const handleRunSelectedBatch = async () => {
    if (!text.trim() || batchSelected.size === 0) return;
    setRunAllAnalyzeLoading(true);
    setError("");
    try {
      await Promise.all([...batchSelected].map((id) => runTool(id)));
    } finally {
      setRunAllAnalyzeLoading(false);
    }
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
        source: "TEXT",
        kind: "run_all",
        contentText: text.trim(),
        overallScore: bundle.text.overallScore,
        toneScore: bundle.text.toneScore,
        riskScore: bundle.text.riskScore,
        clarityScore: bundle.text.clarityScore,
        aiProbability: bundle.detect?.aiProbability,
        riskLevel: bundle.risk?.riskLevel ?? null,
      });
    }
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
      <header
        className={cn(
          "relative shrink-0 overflow-hidden px-4 py-3 sm:px-5 sm:py-3",
          themeMode === "dark" ? "bg-[#0D0D0C] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]" : "bg-zinc-50/90 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.04)]",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -right-24 -top-16 h-48 w-48 rounded-full blur-3xl opacity-80",
            themeMode === "dark" ? "bg-[var(--brand-teal)]/[0.06]" : "bg-[var(--brand-teal)]/[0.1]",
          )}
        />
        <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2.5">
            <div
              className={cn(
                "inline-flex rounded-xl p-1 ring-1",
                themeMode === "dark" ? "bg-[#090908]/55 ring-white/[0.12]" : "bg-[#F0EDE6] ring-black/[0.08]",
              )}
            >
              <button
                type="button"
                onClick={() => goReview()}
                className={cn(
                  "rounded-lg px-4 py-2 text-[12px] font-semibold tracking-tight transition-all",
                  workspaceTab === "review"
                    ? cn(
                        themeMode === "dark"
                          ? "bg-[#1A1A17] text-[#EDEBE4] shadow-md shadow-black/30"
                          : "bg-white text-[#111110] shadow-md",
                      )
                    : cn(t.muted, t.navHover),
                )}
              >
                Review
              </button>
              <button
                type="button"
                onClick={() => goRewrite()}
                className={cn(
                  "rounded-lg px-4 py-2 text-[12px] font-semibold tracking-tight transition-all",
                  workspaceTab === "rewrite"
                    ? cn(
                        themeMode === "dark"
                          ? "bg-[#1A1A17] text-[#EDEBE4] shadow-md shadow-black/30"
                          : "bg-white text-[#111110] shadow-md",
                      )
                    : cn(t.muted, t.navHover),
                )}
              >
                Transform
              </button>
            </div>
            {workspaceTab === "review" ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void handleRunSelectedBatch()}
                  disabled={!text.trim() || runAllAnalyzeLoading || batchSelected.size === 0}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-[12px] font-semibold transition disabled:opacity-45",
                    t.borderSub,
                    t.s2,
                    t.text,
                    t.navHover,
                  )}
                  title="Run only the tools you checked in the list"
                >
                  {runAllAnalyzeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 opacity-90" />}
                  Run selected
                  {batchSelected.size > 0 ? ` (${batchSelected.size})` : ""}
                </button>
                <button
                  type="button"
                  onClick={() => void handleRunAllAnalyze()}
                  disabled={!text.trim() || runAllAnalyzeLoading}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-semibold shadow-lg transition disabled:opacity-45",
                    t.btnPrimary,
                    themeMode === "dark" && "shadow-[#EDEBE4]/10",
                  )}
                >
                  {runAllAnalyzeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 opacity-90" />}
                  {runAllAnalyzeLoading ? "Running…" : "Run all analyses"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => void handleStudioRewrite()}
                disabled={!text.trim() || studioLoading}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--brand-teal)] px-4 py-2.5 text-[12px] font-semibold text-[#0C0C0B] shadow-lg shadow-[var(--brand-teal)]/25 transition hover:brightness-105 disabled:opacity-45"
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
          <div
            className={cn(
              "shrink-0 px-4 py-3 sm:px-6",
              themeMode === "dark"
                ? "bg-[#0D0D0C] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]"
                : "bg-zinc-50/95 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.05)]",
            )}
          >
            <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className={cn("text-[10px] font-bold uppercase tracking-[0.14em]", t.muted2)}>Built-in modes</p>
                <p className={cn("mt-0.5 text-[11px]", t.muted)}>Pick a preset or a saved persona — then transform.</p>
              </div>
            </div>
            <div className="relative -mx-1">
              <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
                {STUDIO_MODES.map((m) => {
                  const Icon = m.icon;
                  const active = !activePersonaId && studioMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      title={m.desc}
                      onClick={() => selectStudioMode(m.id)}
                      className={cn(
                        "group flex min-w-[118px] shrink-0 flex-col gap-1 rounded-xl border px-3 py-2.5 text-left transition-all",
                        active
                          ? "border-[var(--brand-teal)] bg-[var(--brand-teal)]/[0.12] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
                          : cn(t.borderSub, t.s2, "hover:border-white/15"),
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-lg border transition-colors",
                            active
                              ? "border-[var(--brand-teal)]/40 bg-[var(--brand-teal)]/15 text-[var(--brand-teal)]"
                              : cn(t.borderSub, t.muted),
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span
                          className={cn(
                            "text-[12px] font-semibold leading-tight",
                            active ? "text-[var(--brand-teal)]" : t.text,
                          )}
                        >
                          {m.label}
                        </span>
                      </span>
                      <span className={cn("line-clamp-2 pl-[34px] text-[10px] leading-snug", t.muted2)}>{m.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className={cn("mt-4 flex flex-wrap items-center gap-2 border-t pt-4", t.border)}>
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <p className={cn("text-[10px] font-bold uppercase tracking-[0.14em]", t.muted2)}>Your personas</p>
                {personasLoading ? <Loader2 className={cn("h-3.5 w-3.5 animate-spin", t.muted)} /> : null}
              </div>
              <button
                type="button"
                onClick={() => openPersonaModal()}
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold",
                  t.borderSub,
                  t.muted,
                  t.navHover,
                )}
              >
                <Plus className="h-3.5 w-3.5" />
                New persona
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {personas.length === 0 && !personasLoading ? (
                <p className={cn("w-full rounded-lg border border-dashed px-3 py-2.5 text-[11px] leading-relaxed", t.borderSub, t.muted2)}>
                  Generate a persona with AI or add one manually — it becomes a one-tap transform voice.
                </p>
              ) : null}
              {personas.map((p) => {
                const active = activePersonaId === p.id;
                return (
                  <div
                    key={p.id}
                    className={cn(
                      "flex shrink-0 items-center gap-0.5 overflow-hidden rounded-xl border transition",
                      active
                        ? "border-[var(--brand-magenta)]/60 bg-[var(--brand-magenta)]/[0.12] shadow-sm"
                        : cn(t.borderSub, t.s2, "hover:border-white/12"),
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => selectPersona(p.id)}
                      className={cn(
                        "max-w-[200px] truncate px-3 py-2 text-left text-[12px] font-semibold",
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
                        "rounded-md p-2 transition disabled:opacity-40",
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
            <div
              className={cn(
                "flex min-h-[240px] flex-1 flex-col overflow-hidden lg:min-h-0",
                themeMode === "dark" ? "bg-[#0A0A09]" : "bg-zinc-50/90",
              )}
            >
              <div
                className={cn(
                  "flex shrink-0 items-center justify-between px-4 py-2.5 sm:px-6",
                  themeMode === "dark"
                    ? "bg-[#0E0E0D] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]"
                    : "bg-zinc-100/85 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.05)]",
                )}
              >
                <span className={cn("text-[10px] font-bold uppercase tracking-[0.14em]", t.muted2)}>Source</span>
                <span className={cn(t.mono, "text-[10px] tabular-nums", t.muted2)}>
                  {text.trim() ? `${text.trim().split(/\s+/).length} words` : "—"}
                </span>
              </div>
              <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
                <textarea
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    setStudioResult(null);
                  }}
                  placeholder="Paste or type the text you want to transform…"
                  className={cn(
                    "h-full min-h-[280px] w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-[14px] leading-[1.75] outline-none ring-0 transition-[box-shadow] focus:border-white/20 focus:shadow-[0_0_0_3px_rgba(237,235,228,0.06)]",
                    t.borderSub,
                    t.text,
                    "placeholder:opacity-40",
                  )}
                />
              </div>
            </div>
            <div
              className={cn(
                "flex min-h-[280px] flex-1 flex-col overflow-hidden lg:min-h-0",
                themeMode === "dark" ? "bg-[#0F0F0E]" : "bg-white",
              )}
            >
              <div
                className={cn(
                  "flex shrink-0 items-center justify-between px-4 py-2.5 sm:px-6",
                  themeMode === "dark"
                    ? "bg-[#0D0D0C] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]"
                    : "bg-zinc-50/95 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.05)]",
                )}
              >
                <span className={cn("text-[10px] font-bold uppercase tracking-[0.14em]", t.muted2)}>Output</span>
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
                  <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-4 px-6 text-center">
                    <div
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-inner",
                        t.borderSub,
                        themeMode === "dark" ? "from-white/[0.04] to-transparent" : "from-black/[0.03] to-transparent",
                      )}
                    >
                      <PenTool className={cn("h-7 w-7 opacity-35", t.muted)} />
                    </div>
                    <div className="space-y-1">
                      <p className={cn("text-[15px] font-semibold tracking-tight", t.text)}>Output ready after transform</p>
                      <p className={cn("mx-auto max-w-[280px] text-[12px] leading-relaxed", t.muted2)}>
                        Choose a built-in mode or persona, then run <span className={cn("font-semibold", t.muted)}>Transform text</span>.
                      </p>
                    </div>
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
                <div className={cn("flex shrink-0 flex-wrap items-center justify-between gap-3 border-t px-4 py-3 sm:px-6", t.border, t.s1)}>
                  <span className={cn(t.mono, "text-[11px] tabular-nums", t.muted2)}>
                    {studioResult.wordCountRewritten != null ? `${studioResult.wordCountRewritten} w` : ""}
                    {studioResult.wordCountOriginal != null && studioResult.wordCountRewritten != null && (
                      <span className="ml-1.5">
                        ({studioResult.wordCountRewritten > studioResult.wordCountOriginal ? "+" : ""}
                        {studioResult.wordCountRewritten - studioResult.wordCountOriginal})
                      </span>
                    )}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
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
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                        t.borderSub,
                        t.text,
                        t.navHover,
                      )}
                    >
                      Apply to source
                    </button>
                    <button
                      type="button"
                      onClick={openGeneratorWithText}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                        t.borderSub,
                        t.text,
                        t.navHover,
                      )}
                    >
                      Generate artifact
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleStudioRewrite()}
                      disabled={studioLoading}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold disabled:opacity-45",
                        t.muted,
                        t.navHover,
                      )}
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
        <div
          className={cn(
            "flex min-h-[min(50vh,420px)] flex-1 flex-col overflow-hidden lg:min-h-0",
            themeMode === "dark" ? "bg-[#0A0A09]" : "bg-zinc-50/90",
          )}
        >
          {!commResult && (
            <div
              className={cn(
                "shrink-0 px-4 py-2 sm:px-5",
                themeMode === "dark" ? "bg-[#0E0E0D]" : "bg-zinc-100/85",
              )}
            >
              <p className={cn("text-[10px] font-bold uppercase tracking-[0.14em]", t.muted2)}>Composer</p>
              <p className={cn("mt-0.5 text-[11px]", t.muted)}>Type or paste — then run tools on the right.</p>
            </div>
          )}
          <div className="flex-1 overflow-auto p-4 sm:p-5">
            {commResult ? (
              <div className="min-h-full">
                <div
                  className={cn(
                    "mb-4 rounded-xl border border-[var(--brand-teal)]/35 px-4 py-3 sm:px-5",
                    themeMode === "dark" ? "bg-[var(--brand-teal)]/[0.06]" : "bg-[var(--brand-teal)]/[0.08]",
                  )}
                >
                  <p className={cn("text-[10px] font-bold uppercase tracking-[0.14em]", t.muted2)}>Highlighted draft</p>
                  <p className={cn("mt-1 text-[12px] leading-relaxed", t.muted)}>
                    Phrase-level flags from Communication. Open other tools on the right for compliance, intent, and AI authorship.
                  </p>
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-4 sm:px-5 sm:py-5",
                    themeMode === "dark" ? "bg-[#141413]" : "bg-white",
                    "whitespace-pre-wrap text-[14px] leading-[1.85] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                    t.text,
                  )}
                  dangerouslySetInnerHTML={{ __html: highlightText(text, commResult.flags) }}
                />
              </div>
            ) : (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={"Paste or type your text here…\n\nRun each tool on the right, or use Run all analyses for every pass at once."}
                className={cn(
                  "min-h-[min(50vh,320px)] w-full resize-none rounded-2xl bg-transparent px-4 py-4 text-[14px] leading-relaxed outline-none transition-shadow focus:shadow-[0_0_0_2px_rgba(237,235,228,0.12),inset_0_0_0_1px_rgba(255,255,255,0.08)] sm:min-h-[420px]",
                  themeMode === "dark" ? "bg-[#121211] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)]" : "bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]",
                  t.text,
                  "placeholder:opacity-35",
                )}
              />
            )}
          </div>

          <div
            className={cn(
              "flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-5",
              themeMode === "dark" ? "bg-[#0D0D0C] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]" : "bg-zinc-100/70 shadow-[inset_0_1px_0_0_rgba(0,0,0,0.04)]",
            )}
          >
            <span className={cn(t.mono, "text-[11px] tabular-nums", t.muted2)}>
              {text.trim() ? `${text.trim().split(/\s+/).length} words` : "No text"}
            </span>
            {hasAnyResult && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => clearAnalysis()}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                    t.borderSub,
                    t.muted,
                    t.navHover,
                  )}
                >
                  Edit text
                </button>
                {selectedTool && hasResultForTool(selectedTool) && (
                  <button
                    type="button"
                    onClick={() => void runTool(selectedTool)}
                    disabled={!text.trim() || Boolean(loadingTools[selectedTool])}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-[11px] font-semibold disabled:opacity-45",
                      t.text,
                      t.navHover,
                    )}
                  >
                    Refresh
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex w-full shrink-0 flex-col overflow-hidden lg:w-[min(100%,480px)] lg:max-w-[480px]",
            themeMode === "dark" ? "bg-[#0F0F0E]" : "bg-white",
          )}
        >
          <div
            className={cn(
              "shrink-0 px-3 py-2 sm:px-4",
              themeMode === "dark" ? "bg-[#0D0D0C] shadow-[inset_0_-1px_0_0_rgba(255,255,255,0.05)]" : "bg-zinc-50/95 shadow-[inset_0_-1px_0_0_rgba(0,0,0,0.05)]",
            )}
          >
            <p className={cn("text-[10px] font-bold uppercase tracking-[0.14em]", t.muted2)}>Intelligence</p>
            <p className={cn("mt-0.5 text-[11px] leading-tight", t.muted)}>
              Batch · <span className={cn("font-semibold", t.text)}>Run</span> per row · header runs all.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-2.5 py-2.5 sm:px-3 sm:py-3">
            {error && (
              <div className={cn("mb-2.5 rounded-lg border p-3", t.border, t.s2)}>
                <p className={cn("text-xs font-semibold", t.danger)}>{error}</p>
              </div>
            )}

            {!text.trim() && (
              <div
                className={cn(
                  "mb-2.5 flex gap-2 rounded-xl border px-3 py-2.5 text-[11px] leading-snug",
                  t.border,
                  t.s2,
                  t.muted,
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold",
                    t.borderSub,
                    t.muted2,
                  )}
                >
                  1
                </span>
                <div>
                  <p className={cn("font-semibold", t.text)}>Add copy on the left</p>
                  <p className="mt-0.5 text-[10px] leading-snug opacity-90">
                    Check tools · Run selected / per row / all in header.
                  </p>
                </div>
              </div>
            )}

            <nav aria-label="Analysis tools" className="mb-2 space-y-1">
              <div className="flex items-center justify-between gap-2 pb-0.5">
                <p className={cn("text-[10px] font-bold uppercase tracking-[0.14em]", t.muted2)}>Tools</p>
                <p className={cn("hidden text-[9px] sm:inline", t.muted2)}>Row = detail · Run = rerun</p>
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
                  teaser = <Loader2 className={cn("h-3.5 w-3.5 shrink-0 animate-spin", t.muted)} />;
                } else if (tool.id === "communication" && commResult) {
                  teaser = (
                    <div className="text-right leading-none">
                      <span className={cn("block text-sm font-black tabular-nums leading-tight", t.text)}>{commResult.overallScore}</span>
                      <span className={cn("text-[8px] font-semibold uppercase leading-tight", t.muted2)}>Overall</span>
                    </div>
                  );
                } else if (tool.id === "compliance" && riskResult) {
                  teaser = (
                    <div className="text-right leading-none">
                      <span className={`block text-[10px] font-bold leading-tight ${rc.text}`}>{rc.label}</span>
                      <span className={cn("text-[8px] font-semibold uppercase leading-tight", t.muted2)}>{riskResult.overallScore}</span>
                    </div>
                  );
                } else if (tool.id === "intent" && intentResult) {
                  teaser = (
                    <div className="max-w-[88px] text-right leading-none">
                      <span className={`block truncate text-[10px] font-bold leading-tight ${intentLabel.text}`}>{intentLabel.label}</span>
                      <span className={cn("text-[8px] font-semibold uppercase leading-tight", t.muted2)}>{intentResult.confidenceScore}%</span>
                    </div>
                  );
                } else if (tool.id === "detect" && detectResult) {
                  teaser = (
                    <div className="text-right leading-none">
                      <span className={cn("block text-sm font-black tabular-nums leading-tight", t.warn)}>{detectResult.aiProbability}%</span>
                      <span className={cn("text-[8px] font-semibold uppercase leading-tight", t.muted2)}>AI-like</span>
                    </div>
                  );
                } else if (tool.id === "readability" && readabilityResult) {
                  teaser = (
                    <div className="text-right leading-none">
                      <span className={cn("block text-sm font-black tabular-nums leading-tight", t.info)}>{readabilityResult.readingEaseScore}</span>
                      <span className={cn("text-[8px] font-semibold uppercase leading-tight", t.muted2)}>Ease</span>
                    </div>
                  );
                } else if (tool.id === "structure" && structureResult) {
                  teaser = (
                    <div className="max-w-[88px] text-right leading-none">
                      <span className={cn("block truncate text-[9px] font-bold capitalize leading-tight", t.text)}>
                        {structureResult.documentTypeGuess?.replace(/_/g, " ") || "—"}
                      </span>
                      <span className={cn("text-[8px] font-semibold uppercase leading-tight", t.muted2)}>
                        {structureResult.hasClearAsk ? "Ask ✓" : "Ask ?"}
                      </span>
                    </div>
                  );
                } else if (tool.id === "inclusion" && inclusionResult) {
                  teaser = (
                    <div className="text-right leading-none">
                      <span className={cn("block text-sm font-black tabular-nums leading-tight", t.ok)}>{inclusionResult.inclusionScore}</span>
                      <span className={cn("text-[8px] font-semibold uppercase leading-tight", t.muted2)}>Score</span>
                    </div>
                  );
                } else if (tool.id === "claims" && claimsResult) {
                  teaser = (
                    <div className="text-right leading-none">
                      <span className={cn("block text-[10px] font-bold capitalize leading-tight", t.warn)}>{claimsResult.overclaimRisk}</span>
                      <span className={cn("text-[8px] font-semibold uppercase leading-tight", t.muted2)}>Risk</span>
                    </div>
                  );
                } else {
                  teaser = <span className={cn("text-[9px] font-semibold tabular-nums", t.muted2)}>—</span>;
                }
                return (
                  <div
                    key={tool.id}
                    className={cn(
                      "flex w-full items-center gap-1 rounded-lg border px-1 py-0.5 text-left transition-all",
                      active
                        ? cn(
                            t.s1,
                            t.border,
                            "shadow-sm shadow-black/15 ring-1 ring-white/[0.05]",
                            themeMode === "light" && "ring-black/[0.05]",
                          )
                        : cn(t.s2, t.border, "hover:-translate-y-[0.5px]", t.navHover),
                    )}
                  >
                    <label
                      className="flex shrink-0 cursor-pointer items-center px-0.5 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={batchSelected.has(tool.id)}
                        onChange={() => toggleBatchTool(tool.id)}
                        className={cn(
                          "h-3.5 w-3.5 rounded border",
                          themeMode === "dark" ? "border-white/30 bg-[#171716]" : "border-zinc-300 bg-white",
                        )}
                        aria-label={`Include ${tool.title} in batch run`}
                      />
                    </label>
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => focusToolPanel(tool.id)}
                      disabled={busy}
                      className={cn(
                        "group flex min-w-0 flex-1 items-center gap-2 rounded-md px-1 py-1 text-left transition-colors disabled:cursor-wait disabled:opacity-60",
                        t.navHover,
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          t.border,
                          active ? t.s4 : t.s3,
                          "group-hover:border-white/10",
                        )}
                      >
                        <Icon className={cn("h-4 w-4", tool.iconColor)} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-[11px] font-semibold leading-tight", t.text)}>{tool.title}</p>
                        <p className={cn("mt-px line-clamp-2 text-[9px] leading-snug", t.muted2)}>{tool.subtitle}</p>
                      </div>
                    </button>
                    <div className="flex shrink-0 items-center gap-1.5 pr-0.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void runTool(tool.id);
                        }}
                        disabled={!text.trim() || busy || runAllAnalyzeLoading}
                        className={cn(
                          "inline-flex h-7 shrink-0 items-center gap-0.5 rounded-md border px-2 text-[10px] font-semibold transition-colors disabled:opacity-45",
                          t.borderSub,
                          t.btnGhost,
                        )}
                        title="Run this tool only"
                      >
                        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                        <span className="hidden min-[380px]:inline">Run</span>
                      </button>
                      <div className="flex min-h-[26px] min-w-[52px] items-center justify-end">{teaser}</div>
                    </div>
                  </div>
                );
              })}
            </nav>

            {selectedTool && toolErrors[selectedTool] && (
              <div className={cn("mb-2.5 rounded-lg border p-2.5", t.border)}>
                <p className={cn("text-[10px] font-semibold", t.danger)}>{toolErrors[selectedTool]}</p>
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
              <div
                className={cn(
                  "mb-4 flex flex-col items-center gap-2 rounded-xl border border-dashed py-6",
                  t.borderSub,
                )}
              >
                <Loader2 className={cn("h-6 w-6 animate-spin", t.info)} />
                <p className={cn("text-[12px] font-medium", t.muted)}>Running analysis…</p>
                <p className={cn("text-[10px]", t.muted2)}>Usually a few seconds</p>
              </div>
            )}

            {!selectedTool && (
              <div
                className={cn(
                  "rounded-xl border border-dashed px-4 py-5 text-center",
                  t.borderSub,
                  t.muted2,
                )}
              >
                <p className={cn("text-[12px] font-medium", t.muted)}>Select a tool</p>
                <p className={cn("mx-auto mt-1.5 max-w-[240px] text-[11px] leading-snug", t.muted2)}>
                  Detail & scores below. <span className={cn("font-semibold", t.muted)}>Transform</span> tab for rewrites.
                </p>
              </div>
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

                {selectedTool === "readability" && readabilityResult && (
                  <div className="space-y-4">
                    <div className={cn("grid grid-cols-2 gap-2 rounded-xl border p-3 sm:grid-cols-4", t.border, t.s2)}>
                      <div className="text-center">
                        <div className={cn("text-lg font-bold tabular-nums", t.info)}>{readabilityResult.readingEaseScore}</div>
                        <div className={cn("text-[9px] font-semibold uppercase", t.muted2)}>Reading ease</div>
                      </div>
                      <div className="text-center">
                        <div className={cn("text-sm font-bold", t.text)}>{readabilityResult.gradeLevelApprox}</div>
                        <div className={cn("text-[9px] font-semibold uppercase", t.muted2)}>Level</div>
                      </div>
                      <div className="text-center">
                        <div className={cn("text-lg font-bold tabular-nums", t.text)}>{readabilityResult.avgSentenceLength}</div>
                        <div className={cn("text-[9px] font-semibold uppercase", t.muted2)}>Avg words/sent.</div>
                      </div>
                      <div className="text-center">
                        <div className={cn("text-lg font-bold tabular-nums", t.warn)}>{readabilityResult.longSentenceCount}</div>
                        <div className={cn("text-[9px] font-semibold uppercase", t.muted2)}>Long sentences</div>
                      </div>
                    </div>
                    <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                      <p className={cn("text-[12px] leading-relaxed", t.muted)}>{readabilityResult.summary}</p>
                    </div>
                    {readabilityResult.issues?.length > 0 && (
                      <div>
                        <h3 className={cn("mb-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Issues</h3>
                        <div className="space-y-2">
                          {readabilityResult.issues.map((issue, i) => (
                            <div key={i} className={cn("rounded-xl border p-3", t.border, t.s2)}>
                              <p className={cn("text-[12px] font-medium", t.text)}>&ldquo;{issue.text}&rdquo;</p>
                              <p className={cn("mt-1 text-[11px]", t.muted)}>{issue.issue}</p>
                              <p className={cn("mt-2 text-[11px]", t.ok)}>{issue.fix}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {readabilityResult.recommendations?.length > 0 && (
                      <ul className={cn("space-y-1 rounded-xl border p-3", t.border, t.s2)}>
                        {readabilityResult.recommendations.map((r, i) => (
                          <li key={i} className={cn("flex items-start gap-2 text-[11px]", t.muted)}>
                            <CheckCircle2 className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", t.info)} />
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {selectedTool === "structure" && structureResult && (
                  <div className="space-y-4">
                    <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Detected type</p>
                      <p className={cn("mt-1 text-sm font-semibold capitalize", t.text)}>
                        {structureResult.documentTypeGuess?.replace(/_/g, " ")}
                      </p>
                      <p className={cn("mt-2 text-[12px]", t.muted)}>
                        Clear ask: <span className="font-semibold">{structureResult.hasClearAsk ? "Yes" : "No"}</span>
                      </p>
                    </div>
                    <p className={cn("text-[12px] leading-relaxed", t.muted)}>{structureResult.summary}</p>
                    {structureResult.strengths?.length > 0 && (
                      <div>
                        <h3 className={cn("mb-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Strengths</h3>
                        <ul className="space-y-1">
                          {structureResult.strengths.map((s, i) => (
                            <li key={i} className={cn("flex items-start gap-2 text-[11px]", t.muted)}>
                              <CheckCircle2 className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", t.ok)} />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {structureResult.missingSections?.length > 0 && (
                      <div>
                        <h3 className={cn("mb-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Missing</h3>
                        <ul className="space-y-1">
                          {structureResult.missingSections.map((s, i) => (
                            <li key={i} className={cn("flex items-start gap-2 text-[11px]", t.muted)}>
                              <AlertCircle className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", t.warn)} />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {structureResult.suggestedOutline?.length > 0 && (
                      <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                        <h3 className={cn("mb-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Suggested outline</h3>
                        <ol className="list-decimal space-y-1 pl-4 text-[11px]">
                          {structureResult.suggestedOutline.map((s, i) => (
                            <li key={i} className={cn("leading-relaxed", t.muted)}>
                              {s}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}

                {selectedTool === "inclusion" && inclusionResult && (
                  <div className="space-y-4">
                    <div className={cn("rounded-xl border p-4 text-center", t.border, t.s2)}>
                      <div className={cn("text-3xl font-black tabular-nums", t.ok)}>{inclusionResult.inclusionScore}</div>
                      <div className={cn("text-[9px] font-semibold uppercase", t.muted2)}>Inclusion score</div>
                    </div>
                    <p className={cn("text-[12px] leading-relaxed", t.muted)}>{inclusionResult.summary}</p>
                    {inclusionResult.flags?.length > 0 && (
                      <div className="space-y-2">
                        {inclusionResult.flags.map((f, i) => (
                          <div key={i} className={cn("rounded-xl border p-3", t.border, t.s2)}>
                            <p className={cn("text-[12px] font-medium", t.text)}>&ldquo;{f.text}&rdquo;</p>
                            <p className={cn("mt-1 text-[11px]", t.muted)}>{f.issue}</p>
                            <p className={cn("mt-2 text-[11px]", t.ok)}>{f.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {inclusionResult.goodPractices?.length > 0 && (
                      <div>
                        <h3 className={cn("mb-2 text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Already strong</h3>
                        <ul className="space-y-1">
                          {inclusionResult.goodPractices.map((g, i) => (
                            <li key={i} className={cn("flex items-start gap-2 text-[11px]", t.muted)}>
                              <CheckCircle2 className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", t.ok)} />
                              {g}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {selectedTool === "claims" && claimsResult && (
                  <div className="space-y-4">
                    <div className={cn("rounded-xl border p-3", t.border, t.s2)}>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", t.muted2)}>Overclaim risk</p>
                      <p className={cn("mt-1 text-lg font-bold capitalize", t.warn)}>{claimsResult.overclaimRisk}</p>
                    </div>
                    <p className={cn("text-[12px] leading-relaxed", t.muted)}>{claimsResult.summary}</p>
                    {claimsResult.flags?.length > 0 && (
                      <div className="space-y-2">
                        {claimsResult.flags.map((f, i) => (
                          <div key={i} className={cn("rounded-xl border p-3", t.border, t.s2)}>
                            <p className={cn("text-[12px] font-medium", t.text)}>&ldquo;{f.text}&rdquo;</p>
                            <p className={cn("mt-1 text-[11px]", t.muted)}>{f.concern}</p>
                            <p className={cn("mt-2 text-[11px]", t.ok)}>{f.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {claimsResult.recommendations?.length > 0 && (
                      <ul className={cn("space-y-1 rounded-xl border p-3", t.border, t.s2)}>
                        {claimsResult.recommendations.map((r, i) => (
                          <li key={i} className={cn("flex items-start gap-2 text-[11px]", t.muted)}>
                            <ArrowRight className={cn("mt-0.5 h-3 w-3 shrink-0", t.warn)} />
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

            {text.trim() &&
              (commResult ||
                riskResult ||
                intentResult ||
                detectResult ||
                readabilityResult ||
                structureResult ||
                inclusionResult ||
                claimsResult) && (
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
