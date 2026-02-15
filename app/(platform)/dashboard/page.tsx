"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, CheckCircle2, Download, Loader2, Sparkles } from "lucide-react";

type ModelResult = {
  engine: "GPT-4o" | "Claude 3.5" | "Gemini 1.5";
  mentioned: boolean;
  sentiment: "positive" | "neutral" | "negative";
  competitors: string[];
  descriptors: string[];
  reasoning: string;
  source: "live" | "simulated";
};

type CitationSource = {
  source: "Reddit" | "Wikipedia" | "Hacker News";
  found: boolean;
  signal: "red" | "yellow" | "green";
  detail: string;
};

type SemanticCheck = {
  normalizedUrl: string;
  title: string;
  metaDescription: string;
  wordCount: number;
  schemaScriptCount: number;
  hasFaqSchema: boolean;
  hasLlmsTxt: boolean;
  issues: string[];
  quickWins: string[];
  score: number;
};

type AuditResponse = {
  auditId: string;
  keyword: string;
  simulation?: {
    enabled: boolean;
    usedPrompt: string | null;
    provider: string | null;
    model: string | null;
  };
  dataQuality?: {
    liveModels: number;
    simulatedModels: number;
  };
  geoReport: {
    geoScore: number;
    modelShare: number;
    sentiment: "positive" | "neutral" | "negative";
    citationSources: string[];
    status: "red" | "yellow" | "green";
  };
  semanticCheck: SemanticCheck;
  modelResults: ModelResult[];
  citationAudit: CitationSource[];
  aiOptimizedBlurb: string;
  llmsTxt: string;
};

type AuditHistory = {
  id: string;
  url: string;
  keyword: string;
  title: string | null;
  geoScore: number;
  modelShare: number;
  sentiment: "positive" | "neutral" | "negative";
  createdAt: string;
};

type CorrectionTarget = {
  target: "Reddit" | "Wikipedia Talk" | "Docs/Changelog";
  priority: "high" | "medium" | "low";
  draft: string;
  action: string;
};

type CorrectionResponse = {
  correctionId: string;
  status: "drafted";
  summary: string;
  submissionTargets: CorrectionTarget[];
};

type VerificationMethod = "llms" | "meta" | "dns";

type VerificationInitResponse = {
  verificationId: string;
  domain: string;
  method: VerificationMethod;
  token: string;
  instructions: {
    title: string;
    location: string;
    snippet: string;
  };
};

function formatRelative(dateIso: string) {
  const date = new Date(dateIso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

function signalClass(signal: "red" | "yellow" | "green") {
  if (signal === "green") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (signal === "yellow") return "border-yellow-200 bg-yellow-50 text-yellow-700";
  return "border-red-200 bg-red-50 text-red-700";
}

export default function DashboardPage() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [simulationPrompt, setSimulationPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditResponse | null>(null);

  const [history, setHistory] = useState<AuditHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [hallucinatedClaim, setHallucinatedClaim] = useState("");
  const [correctFact, setCorrectFact] = useState("");
  const [evidenceInput, setEvidenceInput] = useState("");
  const [selectedModel, setSelectedModel] = useState<ModelResult["engine"]>("GPT-4o");
  const [correctionLoading, setCorrectionLoading] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);
  const [correctionPack, setCorrectionPack] = useState<CorrectionResponse | null>(null);
  const [strategyIntent, setStrategyIntent] = useState(false);
  const [strategyUnlocked, setStrategyUnlocked] = useState(false);
  const [ownerDomain, setOwnerDomain] = useState("");
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>("llms");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationInit, setVerificationInit] = useState<VerificationInitResponse | null>(null);
  const [verificationChecking, setVerificationChecking] = useState(false);
  const [verificationEvidence, setVerificationEvidence] = useState<string | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const response = await fetch("/api/visibility/audits", { cache: "no-store" });
      if (!response.ok) return;
      const data = (await response.json()) as { audits?: AuditHistory[] };
      setHistory(data.audits ?? []);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const runScan = async () => {
    if (!url.trim() || !keyword.trim()) {
      setError("Enter website URL and target keyword.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/visibility/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          keyword: keyword.trim(),
          prompt: simulationPrompt.trim() || undefined,
          simulation: Boolean(simulationPrompt.trim()),
        }),
      });

      const data = (await response.json()) as AuditResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Scan failed");
      setReport(data);
      setStrategyIntent(false);
      setStrategyUnlocked(false);
      setVerificationError(null);
      setVerificationInit(null);
      setVerificationEvidence(null);
      loadHistory();
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadLlms = () => {
    if (!report?.llmsTxt) return;
    const blob = new Blob([report.llmsTxt], { type: "text/plain;charset=utf-8" });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "llms.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const openRewrite = () => {
    if (!report) return;
    const text = [
      `Discovery URL: ${report.semanticCheck.normalizedUrl}`,
      `Keyword: ${report.keyword}`,
      `GEO Score: ${report.geoReport.geoScore}`,
      `Model Share: ${report.geoReport.modelShare}%`,
      `Sentiment: ${report.geoReport.sentiment}`,
      `Top Issues: ${report.semanticCheck.issues.slice(0, 5).join("; ") || "None"}`,
      `Quick Wins: ${report.semanticCheck.quickWins.slice(0, 5).join("; ") || "None"}`,
      "Task: Rewrite this into AI-answer-engine-friendly content with clear claims, fact anchors, concise Q&A, and schema-aware structure.",
    ].join("\n");

    router.push(
      `/studio/editor?prefillTitle=${encodeURIComponent(`AI-Optimized Blurb - ${report.keyword}`)}&prefillText=${encodeURIComponent(text)}`,
    );
  };

  const generateCorrectionPackage = async () => {
    if (!strategyUnlocked) {
      setCorrectionError("Verify ownership to unlock AI-agent reputation fixes.");
      return;
    }
    if (!report) return;
    if (!hallucinatedClaim.trim() || !correctFact.trim()) {
      setCorrectionError("Add the hallucinated claim and the correct fact.");
      return;
    }

    setCorrectionLoading(true);
    setCorrectionError(null);
    setCorrectionPack(null);
    try {
      const evidenceUrls = evidenceInput
        .split(/\\n|,/)
        .map((item) => item.trim())
        .filter(Boolean);
      const response = await fetch("/api/visibility/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId: report.auditId,
          model: selectedModel,
          hallucinatedClaim: hallucinatedClaim.trim(),
          correctFact: correctFact.trim(),
          evidenceUrls,
          brandUrl: report.semanticCheck.normalizedUrl,
          keyword: report.keyword,
        }),
      });
      const data = (await response.json()) as CorrectionResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to build correction package");
      setCorrectionPack(data);
    } catch (buildError) {
      setCorrectionError(buildError instanceof Error ? buildError.message : "Correction workflow failed");
    } finally {
      setCorrectionLoading(false);
    }
  };

  const checkVerificationStatus = useCallback(async () => {
    if (!ownerDomain.trim()) return;
    try {
      const response = await fetch(`/api/verification/status?domain=${encodeURIComponent(ownerDomain.trim())}`, { cache: "no-store" });
      const data = (await response.json()) as { verified?: boolean; verifiedMethod?: VerificationMethod; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to fetch verification status");
      if (data.verified) {
        setStrategyUnlocked(true);
        setVerificationEvidence(`Domain verified via ${data.verifiedMethod ?? "one of the supported methods"}. Strategy Suite unlocked.`);
      }
    } catch (statusError) {
      setVerificationError(statusError instanceof Error ? statusError.message : "Failed to check verification status");
    }
  }, [ownerDomain]);

  const startVerification = async () => {
    if (!ownerDomain.trim()) {
      setVerificationError("Enter your domain first (e.g. yourcompany.com).");
      return;
    }
    setVerificationLoading(true);
    setVerificationError(null);
    setVerificationEvidence(null);
    try {
      const response = await fetch("/api/verification/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: ownerDomain.trim(), method: verificationMethod }),
      });
      const data = (await response.json()) as VerificationInitResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to initialize verification");
      setOwnerDomain(data.domain);
      setVerificationInit(data);
      setVerificationEvidence("Verification challenge created. Add the snippet, then click Check verification.");
    } catch (initError) {
      setVerificationError(initError instanceof Error ? initError.message : "Failed to initialize verification");
    } finally {
      setVerificationLoading(false);
    }
  };

  const checkVerification = async () => {
    if (!verificationInit?.verificationId) {
      setVerificationError("Start verification first.");
      return;
    }
    setVerificationChecking(true);
    setVerificationError(null);
    try {
      const response = await fetch("/api/verification/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationId: verificationInit.verificationId }),
      });
      const data = (await response.json()) as { verified?: boolean; evidence?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "Failed to check verification");
      setVerificationEvidence(data.evidence ?? null);
      if (data.verified) {
        setStrategyUnlocked(true);
      }
    } catch (checkError) {
      setVerificationError(checkError instanceof Error ? checkError.message : "Failed to check verification");
    } finally {
      setVerificationChecking(false);
    }
  };

  useEffect(() => {
    if (!ownerDomain.trim() || strategyUnlocked) return;
    const timer = setTimeout(() => {
      void checkVerificationStatus();
    }, 300);
    return () => clearTimeout(timer);
  }, [ownerDomain, strategyUnlocked, checkVerificationStatus]);

  const geoStatus = report?.geoReport.status ?? "yellow";
  const dataQuality = report?.dataQuality ?? { liveModels: 0, simulatedModels: 0 };

  const processSteps = useMemo(
    () => [
      "Model queries (GPT-4o, Claude, Gemini)",
      "Semantic check (schema + llms.txt)",
      "Citation audit (Reddit, Wikipedia, Hacker News)",
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-white px-4 pb-8 pt-6 text-[#1D1D1F] sm:px-6 sm:pb-10 sm:pt-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="reveal reveal-1 rounded-3xl border border-[#E5E5EA] bg-[#FAFAFA] p-5 sm:p-7 md:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#AEAEB2]">SEO/GEO Audit Workspace</p>
          <h1 className="mt-2 text-3xl font-semibold">Visibility Scan</h1>
          <p className="mt-2 max-w-3xl text-sm text-[#6E6E73]">
            Ask one question: when people ask AI about your niche, do you exist?
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Website URL (e.g. acme.com)"
              className="rounded-xl border border-[#AEB5C2] bg-white px-4 py-3 text-sm shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] outline-none transition focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10"
            />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder='Target keyword (e.g. "Best CRM for startups")'
              className="rounded-xl border border-[#AEB5C2] bg-white px-4 py-3 text-sm shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] outline-none transition focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10"
            />
            <button
              onClick={runScan}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#1D1D1F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Run Scan
            </button>
          </div>
          <div className="mt-3">
            <textarea
              value={simulationPrompt}
              onChange={(e) => setSimulationPrompt(e.target.value)}
              placeholder="Optional simulation prompt (e.g. Simulate an aggressive competitor landscape with low trust signals and tell me where we lose citations)"
              className="min-h-20 w-full rounded-xl border border-[#AEB5C2] bg-white px-4 py-3 text-sm shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] outline-none transition focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10"
            />
            <p className="mt-1 text-xs text-[#8E8E93]">If provided, the audit uses your deployed AI model to simulate results from this prompt.</p>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-5 rounded-2xl border border-[#E5E5EA] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#AEAEB2]">Backend Scan Process</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {processSteps.map((step) => (
                <span key={step} className="rounded-full border border-[#D1D1D6] bg-[#FAFAFA] px-3 py-1 text-xs text-[#6E6E73]">
                  {step}
                </span>
              ))}
            </div>
          </div>
        </section>

        {report && (
          <section className="reveal reveal-2 grid gap-7 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-[#E5E5EA] bg-white p-5 sm:p-7 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">GEO Health Report</p>
                  <h2 className="mt-1 text-2xl font-semibold">{report.semanticCheck.normalizedUrl}</h2>
                  <p className="mt-1 text-xs text-[#8E8E93]">Keyword: {report.keyword}</p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${
                    geoStatus === "green"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : geoStatus === "yellow"
                        ? "border-yellow-300 bg-yellow-50 text-yellow-700"
                        : "border-red-300 bg-red-50 text-red-700"
                  }`}
                >
                  {geoStatus === "green" ? "Healthy" : geoStatus === "yellow" ? "Needs Attention" : "Critical"}
                </span>
              </div>

              {dataQuality.simulatedModels > 0 && (
                <p className="mt-3 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-700">
                  {dataQuality.liveModels} live model result(s), {dataQuality.simulatedModels} simulated fallback result(s).
                </p>
              )}
              {report.simulation?.enabled && (
                <p className="mt-3 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                  AI simulation mode enabled via {report.simulation.provider} ({report.simulation.model}).
                </p>
              )}

              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className={`rounded-2xl border p-3 ${signalClass(geoStatus)}`}>
                  <p className="text-xs">GEO Score</p>
                  <p className="mt-1 text-2xl font-semibold">{report.geoReport.geoScore}/100</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/60">
                    <div className="h-full bg-current/70" style={{ width: `${report.geoReport.geoScore}%` }} />
                  </div>
                </div>
                <div className={`rounded-2xl border p-3 ${signalClass(report.geoReport.modelShare >= 60 ? "green" : report.geoReport.modelShare >= 35 ? "yellow" : "red")}`}>
                  <p className="text-xs">Share of Model</p>
                  <p className="mt-1 text-2xl font-semibold">{report.geoReport.modelShare}%</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/60">
                    <div className="h-full bg-current/70" style={{ width: `${report.geoReport.modelShare}%` }} />
                  </div>
                </div>
                <div className={`rounded-2xl border p-3 ${signalClass(report.geoReport.sentiment === "positive" ? "green" : report.geoReport.sentiment === "neutral" ? "yellow" : "red")}`}>
                  <p className="text-xs">Sentiment</p>
                  <p className="mt-1 text-2xl font-semibold capitalize">{report.geoReport.sentiment}</p>
                  <p className="mt-2 text-[11px] opacity-75">
                    {report.geoReport.sentiment === "positive"
                      ? "Strong brand trust signals"
                      : report.geoReport.sentiment === "neutral"
                        ? "Mixed perception across engines"
                        : "Negative cues need correction"}
                  </p>
                </div>
                <div className={`rounded-2xl border p-3 ${signalClass(report.geoReport.citationSources.length >= 2 ? "green" : report.geoReport.citationSources.length === 1 ? "yellow" : "red")}`}>
                  <p className="text-xs">Citation Sources</p>
                  <p className="mt-1 text-2xl font-semibold">{report.geoReport.citationSources.length}</p>
                  <p className="mt-2 text-[11px] opacity-75">
                    {report.geoReport.citationSources.length > 0 ? report.geoReport.citationSources.join(", ") : "No strong source signal"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#E5E5EA] bg-[#FAFAFA] p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#8E8E93]">Technical Snapshot</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  <div className="rounded-xl border border-[#E1E4EC] bg-white px-3 py-2">
                    <p className="text-[11px] text-[#8E8E93]">Structured Data</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D1D1F]">{report.semanticCheck.schemaScriptCount} schema script(s)</p>
                  </div>
                  <div className="rounded-xl border border-[#E1E4EC] bg-white px-3 py-2">
                    <p className="text-[11px] text-[#8E8E93]">llms.txt</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D1D1F]">{report.semanticCheck.hasLlmsTxt ? "Present" : "Missing"}</p>
                  </div>
                  <div className="rounded-xl border border-[#E1E4EC] bg-white px-3 py-2">
                    <p className="text-[11px] text-[#8E8E93]">Content Depth</p>
                    <p className="mt-1 text-sm font-semibold text-[#1D1D1F]">{report.semanticCheck.wordCount} words</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="min-w-0">
                  <p className="mb-2 text-sm font-semibold">Model Results</p>
                  <div className="space-y-2">
                    {report.modelResults.map((model) => (
                      <div key={model.engine} className="rounded-xl border border-[#E5E5EA] bg-[#FAFAFA] p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-[#1D1D1F]">{model.engine}</p>
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-full border border-[#D1D1D6] bg-white px-2 py-0.5 text-[10px] uppercase text-[#6E6E73]">{model.source}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${model.mentioned ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                              {model.mentioned ? "Mentioned" : "Not Mentioned"}
                            </span>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-[#6E6E73]">Sentiment: <span className="font-medium capitalize">{model.sentiment}</span></p>
                        <p className="mt-1 text-xs text-[#6E6E73]">Top competitors: {model.competitors.slice(0, 3).join(", ") || "None"}</p>
                        {model.descriptors.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {model.descriptors.slice(0, 3).map((item) => (
                              <span key={`${model.engine}-${item}`} className="rounded-full border border-[#D1D1D6] bg-white px-2 py-0.5 text-[10px] text-[#50545E]">
                                {item}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="mb-2 text-sm font-semibold">Citation Audit</p>
                  <div className="space-y-2">
                    {report.citationAudit.map((citation) => (
                      <div key={citation.source} className={`rounded-xl border p-3 ${signalClass(citation.signal)}`}>
                        <p className="text-sm font-semibold">{citation.source}</p>
                        <p className="mt-1 text-xs">{citation.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-red-200 bg-red-50/60 p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-red-700">Red Areas (Fix First)</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-red-700">{report.semanticCheck.issues.length}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#6E6E73]">
                    {report.semanticCheck.issues.length ? report.semanticCheck.issues.slice(0, 6).map((issue) => (
                      <li key={issue} className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 text-red-500" />
                        <span>{issue}</span>
                      </li>
                    )) : <li>No immediate red flags.</li>}
                  </ul>
                </div>
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3.5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-semibold text-emerald-700">Green Moves (Actionable)</p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-emerald-700">{report.semanticCheck.quickWins.length}</span>
                  </div>
                  <ul className="space-y-2 text-sm text-[#6E6E73]">
                    {report.semanticCheck.quickWins.length ? report.semanticCheck.quickWins.slice(0, 6).map((win) => (
                      <li key={win} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                        <span>{win}</span>
                      </li>
                    )) : <li>No quick wins surfaced.</li>}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-7">
              <div className="rounded-3xl border border-[#E5E5EA] bg-white p-5 sm:p-7 md:p-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Strategy Suite Access</p>
                <h3 className="mt-1 text-lg font-semibold">Unlock Fix-it Mode</h3>
                <p className="mt-2 text-sm text-[#6E6E73]">
                  Open scan data is available to everyone. Fix-it actions require domain ownership verification.
                </p>

                {!strategyIntent && (
                  <button
                    onClick={() => setStrategyIntent(true)}
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    Show me how to beat them
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}

                {strategyIntent && !strategyUnlocked && (
                  <div className="mt-4 space-y-3 rounded-2xl border border-[#E5E5EA] bg-[#FAFAFA] p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Step 3: Verify your own domain</p>
                    <input
                      value={ownerDomain}
                      onChange={(e) => setOwnerDomain(e.target.value)}
                      placeholder="Your domain (e.g. acme.com)"
                      className="w-full rounded-xl border border-[#AEB5C2] bg-white px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10"
                    />
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "llms", label: "llms.txt (AI-native)" },
                        { value: "meta", label: "HTML Meta Tag" },
                        { value: "dns", label: "DNS TXT (secure)" },
                      ].map((method) => (
                        <button
                          key={method.value}
                          onClick={() => setVerificationMethod(method.value as VerificationMethod)}
                          className={`rounded-full border px-3 py-1 text-xs transition ${
                            verificationMethod === method.value
                              ? "border-[#1D1D1F] bg-[#1D1D1F] text-white"
                              : "border-[#D1D1D6] bg-white text-[#4B4B4E]"
                          }`}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={startVerification}
                        disabled={verificationLoading}
                        className="inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
                      >
                        {verificationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                        Generate Verification
                      </button>
                      <button
                        onClick={checkVerification}
                        disabled={verificationChecking || !verificationInit}
                        className="inline-flex items-center gap-2 rounded-full border border-[#D1D1D6] px-4 py-2 text-sm font-semibold text-[#1D1D1F] transition hover:border-[#1D1D1F] disabled:opacity-60"
                      >
                        {verificationChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Check Verification
                      </button>
                    </div>

                    {verificationInit && (
                      <div className="rounded-xl border border-[#E5E5EA] bg-white p-3 text-xs text-[#4B4B4E]">
                        <p className="font-semibold text-[#1D1D1F]">{verificationInit.instructions.title}</p>
                        <p className="mt-1">Location: {verificationInit.instructions.location}</p>
                        <pre className="mt-2 max-h-28 overflow-auto rounded-lg border border-[#E5E5EA] bg-[#FAFAFA] p-2 text-xs text-[#444]">
                          {verificationInit.instructions.snippet}
                        </pre>
                      </div>
                    )}

                    {verificationError && <p className="text-sm text-red-600">{verificationError}</p>}
                    {verificationEvidence && <p className="text-sm text-[#6E6E73]">{verificationEvidence}</p>}
                  </div>
                )}

                {strategyUnlocked && (
                  <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    Step 4 complete. Domain ownership verified. Strategy Suite is unlocked.
                  </p>
                )}
              </div>

              <div className={`rounded-3xl border border-[#E5E5EA] bg-white p-5 sm:p-7 md:p-8 transition ${strategyUnlocked ? "" : "opacity-60"}`}>
                <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Pivot-Ready Output</p>
                <h3 className="mt-1 text-lg font-semibold">AI-Optimized Blurb</h3>
                <p className="mt-2 rounded-xl border border-[#E5E5EA] bg-[#FAFAFA] p-4 text-sm text-[#4B4B4E]">
                  {report.aiOptimizedBlurb}
                </p>
                <button
                  onClick={openRewrite}
                  disabled={!strategyUnlocked}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  Send to Editor for Rewrite
                </button>
              </div>

              <div className={`rounded-3xl border border-[#E5E5EA] bg-white p-5 sm:p-7 md:p-8 transition ${strategyUnlocked ? "" : "opacity-60"}`}>
                <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Technical Fix</p>
                <h3 className="mt-1 text-lg font-semibold">Tailored llms.txt</h3>
                <button
                  onClick={downloadLlms}
                  disabled={!strategyUnlocked}
                  className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#D1D1D6] px-4 py-2 text-sm font-semibold text-[#1D1D1F] transition hover:border-[#1D1D1F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Download llms.txt
                </button>
                <pre className="mt-4 max-h-72 overflow-auto rounded-xl border border-[#E5E5EA] bg-[#FAFAFA] p-3 text-xs text-[#444]">
                  {report.llmsTxt}
                </pre>
              </div>

              <div className={`rounded-3xl border border-[#E5E5EA] bg-white p-5 sm:p-7 md:p-8 transition ${strategyUnlocked ? "" : "opacity-60"}`}>
                <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">AI-Agent Reputation Management</p>
                <h3 className="mt-1 text-lg font-semibold">Respond to AI Hallucinations</h3>
                <p className="mt-2 text-sm text-[#6E6E73]">
                  If a model states a wrong product fact, generate correction submissions for trusted training-data sources.
                </p>

                <div className="mt-4 space-y-3">
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value as ModelResult["engine"])}
                    className="w-full rounded-xl border border-[#AEB5C2] bg-white px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10"
                  >
                    <option>GPT-4o</option>
                    <option>Claude 3.5</option>
                    <option>Gemini 1.5</option>
                  </select>
                  <textarea
                    value={hallucinatedClaim}
                    onChange={(e) => setHallucinatedClaim(e.target.value)}
                    placeholder='Hallucinated claim (e.g. \"Product does not support API integrations\")'
                    className="min-h-20 w-full rounded-xl border border-[#AEB5C2] bg-white px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10"
                  />
                  <textarea
                    value={correctFact}
                    onChange={(e) => setCorrectFact(e.target.value)}
                    placeholder='Correct fact (e.g. \"Product supports REST and GraphQL APIs\")'
                    className="min-h-20 w-full rounded-xl border border-[#AEB5C2] bg-white px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10"
                  />
                  <textarea
                    value={evidenceInput}
                    onChange={(e) => setEvidenceInput(e.target.value)}
                    placeholder="Evidence URLs (comma or newline separated)"
                    className="min-h-16 w-full rounded-xl border border-[#AEB5C2] bg-white px-3 py-2.5 text-sm shadow-[inset_0_0_0_1px_rgba(17,24,39,0.04)] outline-none focus:border-[#1D1D1F] focus:ring-2 focus:ring-[#1D1D1F]/10"
                  />
                  <button
                    onClick={generateCorrectionPackage}
                    disabled={correctionLoading || !strategyUnlocked}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-black disabled:opacity-60"
                  >
                    {correctionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Generate Correction Package
                  </button>
                </div>

                {correctionError && <p className="mt-3 text-sm text-red-600">{correctionError}</p>}

                {correctionPack && (
                  <div className="mt-4 space-y-3">
                    <p className="text-sm text-[#6E6E73]">{correctionPack.summary}</p>
                    {correctionPack.submissionTargets.map((target) => (
                      <div key={target.target} className="rounded-xl border border-[#E5E5EA] bg-[#FAFAFA] p-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">{target.target}</p>
                          <span className="rounded-full border border-[#D1D1D6] bg-white px-2 py-0.5 text-xs uppercase text-[#6E6E73]">{target.priority}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#6E6E73]">{target.action}</p>
                        <pre className="mt-2 max-h-40 overflow-auto rounded-lg border border-[#E5E5EA] bg-white p-2 text-xs text-[#444]">
                          {target.draft}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="reveal reveal-3 rounded-3xl border border-[#E5E5EA] bg-white p-5 sm:p-7 md:p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#AEAEB2]">Audit History</p>
          <h3 className="mt-1 text-lg font-semibold">Recent Discovery Scans</h3>

          {historyLoading ? (
            <p className="mt-3 text-sm text-[#6E6E73]">Loading history...</p>
          ) : history.length ? (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-[#E5E5EA]">
              <table className="min-w-[760px] w-full border-collapse bg-white">
                <thead className="bg-[#F5F5F7]">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6E73]">URL</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6E73]">Keyword</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6E73]">GEO</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6E73]">Model Share</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6E73]">Sentiment</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-[#6E6E73]">When</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((audit) => (
                    <tr key={audit.id} className="border-t border-[#E5E5EA]">
                      <td className="max-w-[260px] truncate px-3 py-2 text-sm text-[#1D1D1F]">{audit.url}</td>
                      <td className="max-w-[220px] truncate px-3 py-2 text-sm text-[#6E6E73]">{audit.keyword}</td>
                      <td className="px-3 py-2 text-sm font-semibold text-[#1D1D1F]">{audit.geoScore}</td>
                      <td className="px-3 py-2 text-sm text-[#6E6E73]">{audit.modelShare}%</td>
                      <td className="px-3 py-2 text-sm capitalize text-[#6E6E73]">{audit.sentiment}</td>
                      <td className="px-3 py-2 text-sm text-[#6E6E73]">{formatRelative(audit.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-sm text-[#6E6E73]">No scans yet.</p>
          )}
        </section>
      </div>
      <style jsx>{`
        .reveal {
          opacity: 0;
          transform: translateY(14px);
          animation: rise 420ms ease-out forwards;
        }
        .reveal-1 {
          animation-delay: 40ms;
        }
        .reveal-2 {
          animation-delay: 110ms;
        }
        .reveal-3 {
          animation-delay: 230ms;
        }
        @keyframes rise {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
