"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/navigation/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CircleDollarSign,
  Gauge,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Waves,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

type Band = "low" | "medium" | "high";

type DecisionResult = {
  aiFitScore: number;
  recommendation: {
    status: "GO" | "PROCEED_WITH_CAUTION" | "NO_GO";
    summary: string;
    confidence: number;
  };
  toolRecommendations: Array<{
    category: "cost_efficiency" | "compliance" | "scale" | "open_source";
    tool: string;
    why: string;
  }>;
  costProjection: {
    monthlyAiApiCost: number;
    monthlyInfrastructureCost: number;
    oneTimeImplementationCost: number;
    monthlyMaintenanceCost: number;
    totalMonthlyRunCost: number;
    yearOneTotalCost: number;
  };
  roiEstimate: {
    monthlyHoursSaved: number;
    monthlyLaborCostSaved: number;
    netMonthlyImpact: number;
    breakEvenMonths: number;
    oneYearRoiPercent: number;
  };
  riskAnalysis: {
    dataPrivacyRisk: number;
    hallucinationRisk: number;
    regulatoryRisk: number;
    brandRisk: number;
    keyConcerns: string[];
  };
  standoutIdeas: string[];
};

type SignalResult = {
  sentiment: {
    score: number;
    label: "positive" | "neutral" | "negative";
    confidence: number;
  };
  aiNoise: {
    score: number;
    level: "clean" | "watch" | "high";
    matchedPatterns: string[];
  };
  qualitySignals: {
    clarityScore: number;
    specificityScore: number;
    hypeScore: number;
  };
  rewriteGuidance: string[];
};

const BAND_OPTIONS: Band[] = ["low", "medium", "high"];

const DEFAULT_FORM = {
  industry: "Fintech",
  businessFunction: "Customer Support",
  useCase: "Customer email response drafting",
  monthlyTaskVolume: 6200,
  currentProcessMonthlyCost: 18000,
  riskTolerance: "medium" as Band,
  dataSensitivity: "high" as Band,
  repetitionLevel: "high" as Band,
  dataStructureQuality: "medium" as Band,
  humanJudgmentDependency: "medium" as Band,
  errorTolerance: "medium" as Band,
};

const DEFAULT_SIGNAL_TEXT =
  "Our revolutionary AI solution instantly transforms customer operations with seamless automation and best-in-class results. It guarantees better outcomes with no risk and next-generation intelligence.";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function StatusBadge({ status }: { status: DecisionResult["recommendation"]["status"] }) {
  if (status === "GO") return <Badge className="border-0 bg-emerald-600 text-white">GO</Badge>;
  if (status === "PROCEED_WITH_CAUTION") return <Badge className="border-0 bg-amber-500 text-white">Proceed with caution</Badge>;
  return <Badge className="border-0 bg-rose-600 text-white">NO-GO</Badge>;
}

function SignalBadge({ level }: { level: SignalResult["aiNoise"]["level"] }) {
  if (level === "clean") return <Badge className="border-0 bg-emerald-600 text-white">Noise: Clean</Badge>;
  if (level === "watch") return <Badge className="border-0 bg-amber-500 text-white">Noise: Watch</Badge>;
  return <Badge className="border-0 bg-rose-600 text-white">Noise: High</Badge>;
}

export default function DashboardPage() {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<DecisionResult | null>(null);
  const [resultTab, setResultTab] = useState<"summary" | "risk" | "tools">("summary");

  const [signalText, setSignalText] = useState(DEFAULT_SIGNAL_TEXT);
  const [signalLoading, setSignalLoading] = useState(false);
  const [signalError, setSignalError] = useState("");
  const [signalResult, setSignalResult] = useState<SignalResult | null>(null);

  const riskBars = useMemo(() => {
    if (!result) return [];
    return [
      { label: "Data privacy", value: result.riskAnalysis.dataPrivacyRisk },
      { label: "Hallucination", value: result.riskAnalysis.hallucinationRisk },
      { label: "Regulatory", value: result.riskAnalysis.regulatoryRisk },
      { label: "Brand", value: result.riskAnalysis.brandRisk },
    ];
  }, [result]);

  async function onEvaluate(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/decision/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json()) as { result?: DecisionResult; error?: string };

      if (!response.ok || !payload.result) {
        throw new Error(payload.error ?? "Failed to evaluate use case");
      }

      setResult(payload.result);
      setResultTab("summary");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeSignals() {
    setSignalError("");
    setSignalLoading(true);

    try {
      const response = await fetch("/api/signals/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: signalText }),
      });

      const payload = (await response.json()) as { result?: SignalResult; error?: string };
      if (!response.ok || !payload.result) {
        throw new Error(payload.error ?? "Failed to analyze text signals");
      }

      setSignalResult(payload.result);
    } catch (err) {
      setSignalError(err instanceof Error ? err.message : "Signal analysis failed");
    } finally {
      setSignalLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <AppHeader
        title="AI Decision Workspace"
        subtitle="Evaluate, monitor, and improve AI use cases with continuous decision signals."
        rightSlot={<Badge className="border border-slate-200 bg-slate-50 text-slate-600">Continuous monitoring</Badge>}
      />

      <main className="mx-auto grid w-full max-w-7xl gap-4 px-6 py-6">
        <section className="rounded-3xl border-2 border-black bg-[radial-gradient(circle_at_100%_0%,rgba(59,130,246,0.13),transparent_34%),#fff] p-6 shadow-[0_18px_38px_rgba(15,23,42,0.06)]">
          <h2 className="text-3xl font-semibold tracking-tight">Decide faster. Monitor continuously.</h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600 md:text-base">
            This workspace helps you decide if an AI use case should launch, then keeps watching cost, risk, and trend signals as conditions change.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Go/No-Go", "Cost + ROI", "Risk checks", "Trend signal", "Message clarity"].map((item) => (
              <span key={item} className="rounded-full border border-black bg-white px-3 py-1 text-xs text-slate-700 md:text-sm">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <article className="rounded-3xl border-2 border-black bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h3 className="text-xl font-semibold">Use Case Intake</h3>
              <Badge className="border border-slate-200 bg-slate-50 text-slate-700">Step 1</Badge>
            </div>

            <form onSubmit={onEvaluate} className="grid gap-3 md:grid-cols-2">
              <label className="grid gap-1 text-sm text-slate-700">
                Industry
                <input className="rounded-xl border border-black/70 px-3 py-2" value={form.industry} onChange={(e) => setForm((s) => ({ ...s, industry: e.target.value }))} />
              </label>

              <label className="grid gap-1 text-sm text-slate-700">
                Business function
                <input className="rounded-xl border border-black/70 px-3 py-2" value={form.businessFunction} onChange={(e) => setForm((s) => ({ ...s, businessFunction: e.target.value }))} />
              </label>

              <label className="grid gap-1 text-sm text-slate-700 md:col-span-2">
                Use case
                <input className="rounded-xl border border-black/70 px-3 py-2" value={form.useCase} onChange={(e) => setForm((s) => ({ ...s, useCase: e.target.value }))} />
              </label>

              <label className="grid gap-1 text-sm text-slate-700">
                Monthly task volume
                <input
                  className="rounded-xl border border-black/70 px-3 py-2"
                  type="number"
                  min={1}
                  value={form.monthlyTaskVolume}
                  onChange={(e) => setForm((s) => ({ ...s, monthlyTaskVolume: Number(e.target.value) }))}
                />
              </label>

              <label className="grid gap-1 text-sm text-slate-700">
                Current monthly cost (USD)
                <input
                  className="rounded-xl border border-black/70 px-3 py-2"
                  type="number"
                  min={0}
                  value={form.currentProcessMonthlyCost}
                  onChange={(e) => setForm((s) => ({ ...s, currentProcessMonthlyCost: Number(e.target.value) }))}
                />
              </label>

              <details className="md:col-span-2 rounded-xl border border-black bg-slate-50/70">
                <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-slate-800">Advanced risk settings</summary>
                <div className="grid gap-3 border-t border-slate-200 p-3 md:grid-cols-2">
                  {[
                    ["Risk tolerance", "riskTolerance"],
                    ["Data sensitivity", "dataSensitivity"],
                    ["Repetition level", "repetitionLevel"],
                    ["Data quality", "dataStructureQuality"],
                    ["Human judgement need", "humanJudgmentDependency"],
                    ["Error tolerance", "errorTolerance"],
                  ].map(([label, key]) => (
                    <label key={key} className="grid gap-1 text-sm text-slate-700">
                      {label}
                      <select
                        className="rounded-xl border border-black/70 px-3 py-2"
                        value={form[key as keyof typeof form] as string}
                        onChange={(e) => setForm((s) => ({ ...s, [key]: e.target.value as Band }))}
                      >
                        {BAND_OPTIONS.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </details>

              <div className="md:col-span-2 flex flex-wrap gap-2 pt-1">
                <Button type="submit" disabled={loading} className="shadow-[0_10px_22px_rgba(37,99,235,0.24)]">
                  {loading ? "Checking..." : "Get Recommendation"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" onClick={() => setForm(DEFAULT_FORM)} className="border-black bg-white text-slate-900">
                  Reset inputs
                </Button>
              </div>
            </form>

            {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
          </article>

          <article className="rounded-3xl border-2 border-black bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-xl font-semibold">Recommendation Output</h3>
              {result ? <StatusBadge status={result.recommendation.status} /> : <Badge className="border border-slate-200 bg-slate-50 text-slate-700">Waiting</Badge>}
            </div>

            {!result ? (
              <div className="grid min-h-[360px] place-items-center text-center">
                <div>
                  <ShieldAlert className="mx-auto h-10 w-10 text-sky-700" />
                  <h4 className="mt-3 text-lg font-semibold">Your recommendation appears here</h4>
                  <p className="mt-1 max-w-sm text-sm text-slate-600">Run Step 1 to see summary, risk, and tool guidance.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3 flex flex-wrap gap-2">
                  {[
                    ["summary", "Summary"],
                    ["risk", "Risk"],
                    ["tools", "Tools"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setResultTab(key as "summary" | "risk" | "tools")}
                      className={`rounded-full border px-3 py-1 text-sm font-semibold transition ${
                        resultTab === key ? "border-black bg-slate-900 text-white" : "border-black bg-white text-slate-800"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {resultTab === "summary" ? (
                  <div style={{ animation: "fadeInUp 260ms ease" }}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-black bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">AI fit score</p>
                        <strong className="text-2xl">{result.aiFitScore}</strong>
                      </div>
                      <div className="rounded-xl border border-black bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Confidence</p>
                        <strong className="text-2xl">{result.recommendation.confidence}%</strong>
                      </div>
                      <div className="rounded-xl border border-black bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Estimated monthly cost</p>
                        <strong className="text-xl">{money(result.costProjection.totalMonthlyRunCost)}</strong>
                      </div>
                      <div className="rounded-xl border border-black bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">Estimated first-year ROI</p>
                        <strong className="text-xl">{result.roiEstimate.oneYearRoiPercent}%</strong>
                      </div>
                    </div>

                    <p className="mt-3 text-sm text-slate-700">{result.recommendation.summary}</p>

                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-xl border border-black bg-white p-3">
                        <p className="text-xs text-slate-500"><CircleDollarSign className="mr-1 inline h-3.5 w-3.5" /> Net monthly impact</p>
                        <strong>{money(result.roiEstimate.netMonthlyImpact)}</strong>
                      </div>
                      <div className="rounded-xl border border-black bg-white p-3">
                        <p className="text-xs text-slate-500"><Gauge className="mr-1 inline h-3.5 w-3.5" /> Break-even</p>
                        <strong>{result.roiEstimate.breakEvenMonths} months</strong>
                      </div>
                      <div className="rounded-xl border border-black bg-white p-3">
                        <p className="text-xs text-slate-500"><TrendingUp className="mr-1 inline h-3.5 w-3.5" /> Hours saved</p>
                        <strong>{result.roiEstimate.monthlyHoursSaved}</strong>
                      </div>
                      <div className="rounded-xl border border-black bg-white p-3">
                        <p className="text-xs text-slate-500"><Sparkles className="mr-1 inline h-3.5 w-3.5" /> Labor savings</p>
                        <strong>{money(result.roiEstimate.monthlyLaborCostSaved)}</strong>
                      </div>
                    </div>
                  </div>
                ) : null}

                {resultTab === "risk" ? (
                  <div style={{ animation: "fadeInUp 260ms ease" }}>
                    <div className="grid gap-3">
                      {riskBars.map((risk) => (
                        <div key={risk.label} className="rounded-xl border border-black p-3">
                          <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                            <span>{risk.label}</span>
                            <span>{risk.value}</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-200">
                            <div className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-600" style={{ width: `${risk.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 rounded-xl border border-black bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Key concern</p>
                      <p className="mt-1 text-sm text-slate-700">{result.riskAnalysis.keyConcerns[0] ?? "No major concern flagged."}</p>
                    </div>
                  </div>
                ) : null}

                {resultTab === "tools" ? (
                  <div style={{ animation: "fadeInUp 260ms ease" }}>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {result.toolRecommendations.map((tool) => (
                        <div key={tool.category} className="rounded-xl border border-black bg-slate-50 p-3">
                          <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{tool.category.replace(/_/g, " ")}</p>
                          <strong className="mt-1 block">{tool.tool}</strong>
                          <p className="mt-1 text-sm text-slate-700">{tool.why}</p>
                        </div>
                      ))}
                    </div>

                    <details className="mt-3 rounded-xl border border-black bg-white">
                      <summary className="cursor-pointer px-3 py-2 text-sm font-semibold text-slate-800">Show next moves</summary>
                      <ul className="grid gap-2 border-t border-slate-200 px-4 py-3 text-sm text-slate-700">
                        {result.standoutIdeas.map((idea) => (
                          <li key={idea}>• {idea}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ) : null}
              </>
            )}
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border-2 border-black bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-xl font-semibold">Message Clarity Monitor</h3>
              {signalResult ? <SignalBadge level={signalResult.aiNoise.level} /> : <Badge className="border border-slate-200 bg-slate-50 text-slate-700">Step 2</Badge>}
            </div>

            <p className="text-sm text-slate-600">Analyze AI messaging for clarity, hype risk, and trust signals.</p>

            <textarea
              value={signalText}
              onChange={(e) => setSignalText(e.target.value)}
              rows={7}
              className="mt-3 w-full rounded-xl border border-black/70 px-3 py-2"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={analyzeSignals} disabled={signalLoading} className="shadow-[0_10px_22px_rgba(37,99,235,0.24)]">
                {signalLoading ? "Checking..." : "Check Clarity"}
                <Waves className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setSignalText(DEFAULT_SIGNAL_TEXT)} className="border-black bg-white text-slate-900">
                Use example text
              </Button>
            </div>

            {signalError ? <p className="mt-2 text-sm text-rose-600">{signalError}</p> : null}

            {signalResult ? (
              <div className="mt-4" style={{ animation: "fadeInUp 260ms ease" }}>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-black bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Sentiment</p>
                    <strong>{signalResult.sentiment.label}</strong>
                  </div>
                  <div className="rounded-xl border border-black bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Buzzword score</p>
                    <strong>{signalResult.aiNoise.score}</strong>
                  </div>
                  <div className="rounded-xl border border-black bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Clarity score</p>
                    <strong>{signalResult.qualitySignals.clarityScore}</strong>
                  </div>
                  <div className="rounded-xl border border-black bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Hype level</p>
                    <strong>{signalResult.qualitySignals.hypeScore}</strong>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(signalResult.aiNoise.matchedPatterns.length
                    ? signalResult.aiNoise.matchedPatterns
                    : ["No major buzzword patterns detected"]).map((pattern) => (
                    <span key={pattern} className="rounded-full border border-black bg-white px-2 py-1 text-xs text-slate-700">
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </article>

          <article className="rounded-3xl border-2 border-black bg-slate-900 p-5 text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
            <h3 className="text-xl font-semibold">Continuous Command Center</h3>
            <p className="mt-2 text-sm text-slate-300">
              Keep monitoring use-case performance and trend signals after launch to adapt your AI strategy continuously.
            </p>

            <div className="mt-4 grid gap-2">
              {[
                "Track model performance drift over time",
                "Review trend and sentiment shifts weekly",
                "Update routing and tool choices with new data",
              ].map((line) => (
                <div key={line} className="rounded-xl border border-white/30 bg-white/5 px-3 py-2 text-sm text-slate-100">
                  {line}
                </div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild className="shadow-[0_10px_24px_rgba(37,99,235,0.28)]">
                <Link href="/sandbox">
                  Compare outputs
                  <BarChart3 className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white bg-white text-slate-900">
                <Link href="/trends">
                  View trend desk
                  <ShieldCheck className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
