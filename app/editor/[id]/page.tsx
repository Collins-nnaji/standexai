"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { AppHeader } from "@/components/navigation/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Band = "low" | "medium" | "high";

type ScenarioInput = {
  industry: string;
  businessFunction: string;
  useCase: string;
  monthlyTaskVolume: number;
  currentProcessMonthlyCost: number;
  riskTolerance: Band;
  dataSensitivity: Band;
  repetitionLevel: Band;
  dataStructureQuality: Band;
  humanJudgmentDependency: Band;
  errorTolerance: Band;
};

type DecisionResult = {
  aiFitScore: number;
  recommendation: { status: "GO" | "PROCEED_WITH_CAUTION" | "NO_GO"; summary: string; confidence: number };
  roiEstimate: { netMonthlyImpact: number; breakEvenMonths: number; oneYearRoiPercent: number };
  riskAnalysis: { dataPrivacyRisk: number; hallucinationRisk: number; regulatoryRisk: number; brandRisk: number };
};

const PRESETS: Record<string, ScenarioInput> = {
  new: {
    industry: "Fintech",
    businessFunction: "Operations",
    useCase: "KYC document pre-screening",
    monthlyTaskVolume: 4500,
    currentProcessMonthlyCost: 22000,
    riskTolerance: "medium",
    dataSensitivity: "high",
    repetitionLevel: "high",
    dataStructureQuality: "medium",
    humanJudgmentDependency: "high",
    errorTolerance: "low",
  },
  support: {
    industry: "SaaS",
    businessFunction: "Support",
    useCase: "Tier-1 support response drafting",
    monthlyTaskVolume: 9000,
    currentProcessMonthlyCost: 26000,
    riskTolerance: "medium",
    dataSensitivity: "medium",
    repetitionLevel: "high",
    dataStructureQuality: "high",
    humanJudgmentDependency: "low",
    errorTolerance: "medium",
  },
  marketing: {
    industry: "Insurance",
    businessFunction: "Marketing",
    useCase: "Campaign copy generation for product pages",
    monthlyTaskVolume: 2200,
    currentProcessMonthlyCost: 14000,
    riskTolerance: "low",
    dataSensitivity: "medium",
    repetitionLevel: "medium",
    dataStructureQuality: "medium",
    humanJudgmentDependency: "medium",
    errorTolerance: "low",
  },
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

async function evaluate(input: ScenarioInput): Promise<DecisionResult> {
  const response = await fetch("/api/decision/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as { result?: DecisionResult; error?: string };
  if (!response.ok || !payload.result) {
    throw new Error(payload.error ?? "Scenario evaluation failed");
  }

  return payload.result;
}

export default function ScenarioLabPage() {
  const params = useParams();
  const scenarioId = String(params.id ?? "new").toLowerCase();

  const startingScenario = useMemo(() => PRESETS[scenarioId] ?? PRESETS.new, [scenarioId]);

  const [base, setBase] = useState<ScenarioInput>(startingScenario);
  const [optimized, setOptimized] = useState<ScenarioInput>({
    ...startingScenario,
    dataStructureQuality: "high",
    humanJudgmentDependency: startingScenario.humanJudgmentDependency === "high" ? "medium" : startingScenario.humanJudgmentDependency,
    errorTolerance: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [baseResult, setBaseResult] = useState<DecisionResult | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<DecisionResult | null>(null);

  async function runComparison() {
    setError("");
    setLoading(true);
    try {
      const [left, right] = await Promise.all([evaluate(base), evaluate(optimized)]);
      setBaseResult(left);
      setOptimizedResult(right);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Comparison failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page">
      <AppHeader
        title="Plan Comparison"
        subtitle="Compare your current plan with an improved one before you commit time and budget."
        rightSlot={<Badge className="border border-slate-200 bg-slate-50 text-slate-600">Side-by-side</Badge>}
      />

      <main className="app-shell">
        <section className="kpi-hero fade-in">
          <h2 className="kpi-title">Compare outcomes before making a decision.</h2>
          <p className="kpi-copy">Test two plans side by side to see how they affect fit, risk, and estimated payback time.</p>
          <div className="pill-row">
            <span className="pill">Baseline Model</span>
            <span className="pill">Optimized Plan</span>
            <span className="pill">Impact Delta</span>
          </div>
        </section>

        <section className="surface fade-in">
          <div className="surface-head">
            <h3>Plan details</h3>
            <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Preset: {scenarioId}</Badge>
          </div>

          <div className="form-grid">
            <label>
              Industry
              <input
                value={base.industry}
                onChange={(e) => {
                  const value = e.target.value;
                  setBase((s) => ({ ...s, industry: value }));
                  setOptimized((s) => ({ ...s, industry: value }));
                }}
              />
            </label>

            <label>
              Function
              <input
                value={base.businessFunction}
                onChange={(e) => {
                  const value = e.target.value;
                  setBase((s) => ({ ...s, businessFunction: value }));
                  setOptimized((s) => ({ ...s, businessFunction: value }));
                }}
              />
            </label>

            <label className="full-span">
              Use case
              <input
                value={base.useCase}
                onChange={(e) => {
                  const value = e.target.value;
                  setBase((s) => ({ ...s, useCase: value }));
                  setOptimized((s) => ({ ...s, useCase: value }));
                }}
              />
            </label>

            <label>
              Monthly volume
              <input
                type="number"
                min={1}
                value={base.monthlyTaskVolume}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setBase((s) => ({ ...s, monthlyTaskVolume: value }));
                  setOptimized((s) => ({ ...s, monthlyTaskVolume: value }));
                }}
              />
            </label>

            <label>
              Current monthly cost
              <input
                type="number"
                min={0}
                value={base.currentProcessMonthlyCost}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setBase((s) => ({ ...s, currentProcessMonthlyCost: value }));
                  setOptimized((s) => ({ ...s, currentProcessMonthlyCost: value }));
                }}
              />
            </label>
          </div>

          <div className="row" style={{ marginTop: "0.8rem" }}>
            <Button onClick={runComparison} disabled={loading}>
              {loading ? "Comparing..." : "Compare Plans"}
            </Button>
          </div>

          {error ? <p className="subtext" style={{ color: "#b91c1c", marginTop: "0.6rem" }}>{error}</p> : null}
        </section>

        <section className="grid-2 fade-in">
          <article className="surface">
            <div className="surface-head">
              <h3>Current plan</h3>
              <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Today</Badge>
            </div>

            {!baseResult ? (
              <p className="subtext">No output yet.</p>
            ) : (
              <div className="metric-grid">
                <div className="metric">
                  <p>Decision</p>
                  <strong>{baseResult.recommendation.status}</strong>
                </div>
                <div className="metric">
                  <p>AI Fit</p>
                  <strong>{baseResult.aiFitScore}</strong>
                </div>
                <div className="metric">
                  <p>Net monthly impact</p>
                  <strong>{money(baseResult.roiEstimate.netMonthlyImpact)}</strong>
                </div>
                <div className="metric">
                  <p>Break-even</p>
                  <strong>{baseResult.roiEstimate.breakEvenMonths} months</strong>
                </div>
              </div>
            )}
          </article>

          <article className="surface">
            <div className="surface-head">
              <h3>Improved plan</h3>
              <Badge className="border-0 bg-emerald-600 text-white">Recommended version</Badge>
            </div>

            {!optimizedResult ? (
              <p className="subtext">No output yet.</p>
            ) : (
              <div className="metric-grid">
                <div className="metric">
                  <p>Decision</p>
                  <strong>{optimizedResult.recommendation.status}</strong>
                </div>
                <div className="metric">
                  <p>AI Fit</p>
                  <strong>{optimizedResult.aiFitScore}</strong>
                </div>
                <div className="metric">
                  <p>Net monthly impact</p>
                  <strong>{money(optimizedResult.roiEstimate.netMonthlyImpact)}</strong>
                </div>
                <div className="metric">
                  <p>Break-even</p>
                  <strong>{optimizedResult.roiEstimate.breakEvenMonths} months</strong>
                </div>
              </div>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}
