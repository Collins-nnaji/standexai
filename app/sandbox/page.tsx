"use client";

import { useState } from "react";
import { AppHeader } from "@/components/navigation/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Split } from "lucide-react";

type ProviderResult = {
  provider: string;
  status: "ok" | "missing_key" | "error";
  latencyMs?: number;
  tokens?: number;
  output?: string;
  error?: string;
};

type SandboxResponse = {
  results: ProviderResult[];
  notes?: string;
};

const SAMPLE_PROMPT = "Summarize the top three risks of adopting AI for customer support in a regulated industry.";

export default function SandboxPage() {
  const [prompt, setPrompt] = useState(SAMPLE_PROMPT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<SandboxResponse | null>(null);

  async function runSandbox() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/sandbox/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const payload = (await response.json()) as SandboxResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Sandbox run failed");
      }

      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sandbox run failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page">
      <AppHeader
        title="Side-by-Side AI Comparison"
        subtitle="Try one prompt on multiple AI tools and compare the responses in one place."
        rightSlot={<Badge className="border border-slate-200 bg-slate-50 text-slate-600">Parallel Compare</Badge>}
      />

      <main className="app-shell">
        <section className="kpi-hero fade-in">
          <h2 className="kpi-title">Compare AI outputs before choosing a tool.</h2>
          <p className="kpi-copy">See response quality, speed, and token usage so you can pick the most practical option for your team.</p>
          <div className="pill-row">
            <span className="pill">Output Quality</span>
            <span className="pill">Latency Footprint</span>
            <span className="pill">Token Profile</span>
          </div>
        </section>

        <section className="surface fade-in">
          <div className="surface-head">
            <h3>Enter your prompt</h3>
            <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Sandbox Run</Badge>
          </div>

          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={6} />

          <div className="row" style={{ marginTop: "0.7rem" }}>
            <Button onClick={runSandbox} disabled={loading}>
              {loading ? "Running..." : "Compare Tools"}
              <Split className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setPrompt(SAMPLE_PROMPT)}>Use example prompt</Button>
          </div>

          {error ? <p className="subtext" style={{ color: "#b91c1c", marginTop: "0.65rem" }}>{error}</p> : null}
          {data?.notes ? <p className="subtext" style={{ marginTop: "0.5rem" }}>{data.notes}</p> : null}
        </section>

        <section className="grid-2 fade-in">
          {(data?.results ?? []).length === 0 ? (
            <article className="surface">
              <div className="empty">
                <div>
                  <Sparkles className="mx-auto h-10 w-10 text-sky-700" />
                  <h4>No results yet</h4>
                  <p>Run a comparison to see outputs, speed, and token usage from each provider.</p>
                </div>
              </div>
            </article>
          ) : null}

          {(data?.results ?? []).map((result) => (
            <article key={result.provider} className="surface">
              <div className="surface-head">
                <h3>{result.provider}</h3>
                <Badge className={result.status === "ok" ? "border-0 bg-emerald-600 text-white" : "border-0 bg-slate-300 text-slate-700"}>
                  {result.status}
                </Badge>
              </div>

              {result.status === "ok" ? (
                <>
                  <p className="subtext">{result.output}</p>
                  <div className="metric-grid" style={{ marginTop: "0.7rem" }}>
                    <div className="metric">
                      <p>Latency</p>
                      <strong>{result.latencyMs} ms</strong>
                    </div>
                    <div className="metric">
                      <p>Tokens</p>
                      <strong>{result.tokens ?? 0}</strong>
                    </div>
                    <div className="metric">
                      <p>Score rank</p>
                      <strong>Pending</strong>
                    </div>
                    <div className="metric">
                      <p>Next action</p>
                      <strong>Review</strong>
                    </div>
                  </div>
                </>
              ) : (
                <p className="subtext">{result.error ?? "Missing provider key."}</p>
              )}
            </article>
          ))}
        </section>

        <section className="surface fade-in">
          <div className="surface-head">
            <h3>Choose your default tool</h3>
            <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Next step</Badge>
          </div>
          <p className="subtext">After reviewing results, set the best-performing model as your default for this task.</p>
          <div className="row" style={{ marginTop: "0.7rem" }}>
            <Button asChild>
              <a href="/dashboard">
                Open Decision Tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
