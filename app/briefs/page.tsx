"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/navigation/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type Priority = "cost" | "compliance" | "speed" | "control";

type ToolCard = {
  name: string;
  type: string;
  strengths: string[];
  bestFor: Priority[];
  caution: string;
  metrics: {
    accuracy: number;
    latency: number;
    cost: number;
  };
};

const TOOLS: ToolCard[] = [
  {
    name: "Gemini 1.5 Flash",
    type: "Commercial API",
    strengths: ["Fast routing", "Good for summarization", "Cost efficient"],
    bestFor: ["speed", "cost"],
    caution: "Lower reasoning depth for complex logic.",
    metrics: { accuracy: 78, latency: 92, cost: 96 },
  },
  {
    name: "GPT-4o",
    type: "Commercial API",
    strengths: ["Strong reasoning", "Stable API", "Wide ecosystem"],
    bestFor: ["compliance", "speed"],
    caution: "Higher cost per request.",
    metrics: { accuracy: 92, latency: 70, cost: 48 },
  },
  {
    name: "Claude 3.5 Sonnet",
    type: "Commercial API",
    strengths: ["Policy compliance", "Long-form coherence", "Safe outputs"],
    bestFor: ["compliance", "control"],
    caution: "Latency can spike for very long prompts.",
    metrics: { accuracy: 90, latency: 75, cost: 60 },
  },
  {
    name: "Llama 3.1 / Mistral",
    type: "Open-source",
    strengths: ["Full control", "Private deployment", "Custom fine-tuning"],
    bestFor: ["control", "cost"],
    caution: "Requires MLOps and ongoing evaluation.",
    metrics: { accuracy: 80, latency: 62, cost: 88 },
  },
  {
    name: "Vertical AI vendor",
    type: "Specialized SaaS",
    strengths: ["Fast onboarding", "Domain templates", "Workflow integration"],
    bestFor: ["speed", "compliance"],
    caution: "Vendor lock-in if requirements evolve.",
    metrics: { accuracy: 86, latency: 68, cost: 72 },
  },
];

const PRIORITY_LABEL: Record<Priority, string> = {
  cost: "Cost Efficiency",
  compliance: "Compliance",
  speed: "Speed to Value",
  control: "Infrastructure Control",
};

function computeSES(tool: ToolCard, weights: { accuracy: number; latency: number; cost: number }) {
  return Math.round(tool.metrics.accuracy * weights.accuracy + tool.metrics.latency * weights.latency + tool.metrics.cost * weights.cost);
}

export default function ToolAtlasPage() {
  const [priority, setPriority] = useState<Priority>("compliance");
  const [weights, setWeights] = useState({ accuracy: 0.5, latency: 0.3, cost: 0.2 });
  const [complexity, setComplexity] = useState(35);
  const [volume, setVolume] = useState(10000);

  const ranked = useMemo(() => {
    return [...TOOLS].sort((a, b) => Number(b.bestFor.includes(priority)) - Number(a.bestFor.includes(priority)));
  }, [priority]);

  const sesTable = useMemo(() => {
    return [...TOOLS]
      .map((tool) => ({ tool, ses: computeSES(tool, weights) }))
      .sort((a, b) => b.ses - a.ses);
  }, [weights]);

  const routing = useMemo(() => {
    const flashShare = Math.max(0, Math.min(100, 100 - complexity));
    const ultraShare = 100 - flashShare;
    const flashCost = volume * 0.0001;
    const ultraCost = volume * 0.03;
    const blendedCost = (flashShare / 100) * flashCost + (ultraShare / 100) * ultraCost;
    const flatUltraCost = ultraCost;
    const savings = flatUltraCost - blendedCost;

    return { flashShare, ultraShare, blendedCost, savings };
  }, [complexity, volume]);

  return (
    <div className="app-page">
      <AppHeader
        title="AI Tool Comparison"
        subtitle="Compare tools by quality, speed, and cost so you can choose the best fit."
        rightSlot={<Badge className="border border-slate-200 bg-slate-50 text-slate-600">Comparison</Badge>}
      />

      <main className="app-shell">
        <section className="kpi-hero fade-in">
          <h2 className="kpi-title">Compare AI options with clear tradeoffs.</h2>
          <p className="kpi-copy">Adjust what matters most to you and see which tool gives the best balance of quality, speed, and price.</p>
          <div className="pill-row">
            <span className="pill">Accuracy Weighting</span>
            <span className="pill">Latency Prioritization</span>
            <span className="pill">Cost Efficiency Scoring</span>
          </div>
        </section>

        <section className="surface fade-in">
          <div className="surface-head">
            <h3>Scoring controls</h3>
            <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Customize priorities</Badge>
          </div>

          <div className="grid-3">
            <label>
              Accuracy weight
              <input
                type="range"
                min={0.2}
                max={0.7}
                step={0.05}
                value={weights.accuracy}
                onChange={(e) => setWeights((s) => ({ ...s, accuracy: Number(e.target.value), latency: 1 - Number(e.target.value) - s.cost }))}
              />
              <span className="subtext">{Math.round(weights.accuracy * 100)}%</span>
            </label>
            <label>
              Latency weight
              <input
                type="range"
                min={0.1}
                max={0.5}
                step={0.05}
                value={weights.latency}
                onChange={(e) => setWeights((s) => ({ ...s, latency: Number(e.target.value), accuracy: 1 - Number(e.target.value) - s.cost }))}
              />
              <span className="subtext">{Math.round(weights.latency * 100)}%</span>
            </label>
            <label>
              Cost weight
              <input
                type="range"
                min={0.1}
                max={0.5}
                step={0.05}
                value={weights.cost}
                onChange={(e) => setWeights((s) => ({ ...s, cost: Number(e.target.value) }))}
              />
              <span className="subtext">{Math.round(weights.cost * 100)}%</span>
            </label>
          </div>
        </section>

        <section className="surface fade-in">
          <div className="surface-head">
            <h3>Tool ranking table</h3>
            <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Live results</Badge>
          </div>
          <div className="table">
            <div className="table-row head">
              <span>Model</span>
              <span>Score</span>
              <span>Accuracy</span>
              <span>Latency</span>
              <span>Cost</span>
            </div>
            {sesTable.map(({ tool, ses }) => (
              <div key={tool.name} className="table-row">
                <span>{tool.name}</span>
                <span>{ses}</span>
                <span>{tool.metrics.accuracy}</span>
                <span>{tool.metrics.latency}</span>
                <span>{tool.metrics.cost}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid-2 fade-in">
          <article className="surface">
            <div className="surface-head">
            <h3>Cost savings simulator</h3>
              <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Estimate savings</Badge>
            </div>

            <div className="grid-2">
              <label>
                Prompt complexity
                <input type="range" min={0} max={100} value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} />
                <span className="subtext">{complexity}% complex</span>
              </label>

              <label>
                Monthly volume
                <input type="number" min={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
                <span className="subtext">{volume.toLocaleString()} prompts</span>
              </label>
            </div>

            <div className="metric-grid" style={{ marginTop: "0.8rem" }}>
              <div className="metric">
                <p>Flash share</p>
                <strong>{Math.round(routing.flashShare)}%</strong>
              </div>
              <div className="metric">
                <p>Ultra share</p>
                <strong>{Math.round(routing.ultraShare)}%</strong>
              </div>
              <div className="metric">
                <p>Blended cost</p>
                <strong>${routing.blendedCost.toFixed(2)}</strong>
              </div>
              <div className="metric">
                <p>Estimated savings</p>
                <strong>${routing.savings.toFixed(2)}</strong>
              </div>
            </div>
          </article>

          <article className="surface">
            <div className="surface-head">
            <h3>Tool picker</h3>
            <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Filter by priority</Badge>
            </div>

            <div className="row">
              {(Object.keys(PRIORITY_LABEL) as Priority[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setPriority(item)}
                  className={priority === item ? "app-nav-pill active" : "app-nav-pill"}
                >
                  {PRIORITY_LABEL[item]}
                </button>
              ))}
            </div>

            <div className="grid-2" style={{ marginTop: "0.75rem" }}>
              {ranked.map((tool) => (
                <div key={tool.name} className="metric">
                  <p>{tool.type}</p>
                  <strong>{tool.name}</strong>
                  <p className="subtext" style={{ fontSize: "0.8rem", marginTop: "0.2rem" }}>{tool.strengths.join(" · ")}</p>
                  <p className="subtext" style={{ fontSize: "0.78rem", marginTop: "0.35rem" }}>Caution: {tool.caution}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="surface fade-in">
          <div className="surface-head">
            <h3>Want to compare real outputs too?</h3>
            <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Shadow Sandbox</Badge>
          </div>
          <p className="subtext">Run the same prompt across providers and pick the one that performs best for your use case.</p>
          <div className="row" style={{ marginTop: "0.7rem" }}>
            <Button asChild>
              <a href="/sandbox">
                Compare Real Outputs
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
