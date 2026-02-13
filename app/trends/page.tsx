"use client";

import { useState } from "react";
import { AppHeader } from "@/components/navigation/app-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Filter, Sparkles, Waves } from "lucide-react";

type TrendItem = {
  title: string;
  source: string;
  summary: string;
  url?: string;
  company?: string;
};

type TrendSummary = {
  summary: string;
  who: Array<{ actor: string; activity: string }>;
  themes: string[];
  notable: string[];
};

type TrendResponse = {
  items: TrendItem[];
  summary: TrendSummary;
  sentiment: {
    sentiment: { score: number; label: "positive" | "neutral" | "negative"; confidence: number };
    aiNoise: { score: number; level: "clean" | "watch" | "high"; matchedPatterns: string[] };
    qualitySignals: { clarityScore: number; specificityScore: number; hypeScore: number };
    rewriteGuidance: string[];
  };
};

const SAMPLE_QUERY = "enterprise controls OR model updates";

export default function TrendsPage() {
  const [filter, setFilter] = useState(SAMPLE_QUERY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<TrendResponse | null>(null);

  async function runTrends() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/trends/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filter, limit: 8 }),
      });

      const payload = (await response.json()) as TrendResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load trends");
      }

      setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trends");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-page">
      <AppHeader
        title="AI News and Sentiment"
        subtitle="See what is happening in AI, who is launching what, and how the market tone is shifting."
        rightSlot={<Badge className="border border-slate-200 bg-slate-50 text-slate-600">Easy View</Badge>}
      />

      <main className="app-shell">
        <section className="kpi-hero fade-in">
          <h2 className="kpi-title">Turn AI news into a quick, useful summary.</h2>
          <p className="kpi-copy">Filter updates, view key themes, and understand overall sentiment without reading dozens of articles.</p>
          <div className="pill-row">
            <span className="pill">Topic Filter</span>
            <span className="pill">Who is Building What</span>
            <span className="pill">Sentiment + Hype Check</span>
          </div>
        </section>

        <section className="surface fade-in">
          <div className="surface-head">
            <h3>Filter AI news</h3>
            <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Live filters</Badge>
          </div>

          <div className="row">
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="model updates OR agent workflows"
            />
            <Button onClick={runTrends} disabled={loading}>
              {loading ? "Loading..." : "Show Results"}
              <Filter className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => setFilter(SAMPLE_QUERY)}>Reset</Button>
          </div>

          {error ? <p className="subtext" style={{ color: "#b91c1c", marginTop: "0.65rem" }}>{error}</p> : null}
        </section>

        <section className="grid-2 fade-in">
          <article className="surface">
            <div className="surface-head">
            <h3>Summary</h3>
              <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Signal view</Badge>
            </div>

            {!data ? (
              <div className="empty">
                <div>
                  <Waves className="mx-auto h-10 w-10 text-sky-700" />
                  <h4>No results yet</h4>
                  <p>Run a search to see key updates and top companies in this topic.</p>
                </div>
              </div>
            ) : (
              <>
                <p className="subtext">{data.summary.summary}</p>

                <div className="chip-list">
                  {data.summary.themes.map((theme) => (
                    <span key={theme}>{theme}</span>
                  ))}
                </div>

                <div className="metric-grid" style={{ marginTop: "0.7rem" }}>
                  <div className="metric">
                    <p>Sentiment</p>
                    <strong>{data.sentiment.sentiment.label}</strong>
                  </div>
                  <div className="metric">
                    <p>Sentiment score</p>
                    <strong>{data.sentiment.sentiment.score}</strong>
                  </div>
                  <div className="metric">
                    <p>Hype level</p>
                    <strong>{data.sentiment.aiNoise.level}</strong>
                  </div>
                  <div className="metric">
                    <p>Hype score</p>
                    <strong>{data.sentiment.aiNoise.score}</strong>
                  </div>
                </div>

                <ul className="note-list">
                  {data.summary.who.map((item) => (
                    <li key={`${item.actor}-${item.activity}`}>
                      <strong>{item.actor}:</strong> {item.activity}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </article>

          <article className="surface">
            <div className="surface-head">
              <h3>Top Updates</h3>
              <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Companies and moves</Badge>
            </div>

            {!data ? (
              <div className="empty">
                <div>
                  <Sparkles className="mx-auto h-10 w-10 text-sky-700" />
                  <h4>Waiting for search</h4>
                  <p>Stories and quick summaries will appear here.</p>
                </div>
              </div>
            ) : (
              <div className="grid-2">
                {data.items.map((item) => (
                  <div key={item.title} className="metric">
                    <p>{item.company ?? item.source}</p>
                    <strong>{item.title}</strong>
                    <p className="subtext" style={{ marginTop: "0.25rem", fontSize: "0.8rem" }}>{item.summary}</p>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="link-quiet" style={{ fontSize: "0.8rem" }}>
                        Source
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        {data ? (
          <section className="surface fade-in">
            <div className="surface-head">
              <h3>Writing guidance</h3>
              <Badge className="border border-slate-200 bg-slate-50 text-slate-600">Plain-language tips</Badge>
            </div>
            <ul className="note-list">
              {data.sentiment.rewriteGuidance.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="row" style={{ marginTop: "0.8rem" }}>
              <Button asChild>
                <a href="/dashboard">
                  Open Decision Tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
