"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  CircleCheckBig,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

type Module = {
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  cta: string;
  href: string;
};

const modules: Module[] = [
  {
    title: "Decision Check",
    subtitle: "Should we use AI for this use case?",
    description:
      "Standex continuously monitors your use case profile and gives a go/no-go recommendation with confidence and risk context.",
    bullets: [
      "Use-case fit scoring",
      "Continuous risk monitoring",
      "Decision confidence tracking",
    ],
    cta: "Run decision check",
    href: "/dashboard",
  },
  {
    title: "Cost + ROI Monitor",
    subtitle: "What will it cost and save over time?",
    description:
      "Track projected spend, savings, and break-even with ongoing updates as usage patterns and tool performance shift.",
    bullets: [
      "Monthly cost forecasts",
      "ROI and break-even timeline",
      "Continuous budget monitoring",
    ],
    cta: "Compare scenarios",
    href: "/editor/new",
  },
  {
    title: "Trend Signal",
    subtitle: "What is changing in the AI market?",
    description:
      "Monitor trending AI launches, sentiment shifts, and hype risk so your decisions stay current as the market moves.",
    bullets: [
      "AI news aggregation",
      "Sentiment and hype tracking",
      "Actor and trend monitoring",
    ],
    cta: "Open trend signal",
    href: "/trends",
  },
];

const tableRows = [
  {
    model: "Gemini 1.5 Flash",
    score: 94,
    latency: "0.4s",
    cost: "$0.0001",
    fit: "Fast repetitive workflows",
  },
  {
    model: "Claude 3.5 Sonnet",
    score: 91,
    latency: "0.9s",
    cost: "$0.015",
    fit: "Policy-sensitive operations",
  },
  {
    model: "GPT-4o",
    score: 88,
    latency: "1.2s",
    cost: "$0.03",
    fit: "Complex, multi-step reasoning",
  },
];

export default function LandingPage() {
  const [activeModule, setActiveModule] = useState(0);
  const selected = modules[activeModule];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-6 py-4">
          <Link href="/" aria-label="StandexAI Home" className="inline-flex items-center">
            <Image src="/standexailogo.png" alt="StandexAI logo" width={170} height={42} priority className="h-auto w-[170px]" />
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="border-black bg-white text-slate-900">
              <Link href="/briefs">Compare Tools</Link>
            </Button>
            <Button asChild size="sm" className="shadow-[0_10px_24px_rgba(37,99,235,0.25)]">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-5 px-6 py-8 md:py-12">
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-3xl border-2 border-black bg-[radial-gradient(circle_at_88%_0%,rgba(59,130,246,0.14),transparent_34%),radial-gradient(circle_at_0%_100%,rgba(20,184,166,0.12),transparent_42%),#fff] p-8 shadow-[0_20px_42px_rgba(15,23,42,0.06)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              Continuous AI Monitoring by Standex
            </div>

            <h1 className="mt-4 text-4xl font-semibold leading-[1.03] tracking-[-0.03em] md:text-6xl">
              Monitor AI use cases continuously
              <br />
              and decide with confidence.
            </h1>

            <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
              StandexAI tracks your AI opportunities and market trend signals over time, then helps you decide what to adopt, what to avoid, and what to optimize next.
            </p>

            <div className="mt-7 flex flex-wrap gap-2">
              <Button asChild size="lg" className="shadow-[0_10px_24px_rgba(37,99,235,0.28)]">
                <Link href="/dashboard">
                  Run Decision Check
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-black bg-white text-slate-900">
                <Link href="/trends">Watch AI Trends</Link>
              </Button>
            </div>
          </article>

          <article className="grid gap-3 rounded-3xl border-2 border-black bg-slate-50/70 p-4 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
            {[
              ["Monitoring coverage", "24/7", "Tracks active use cases and performance drift"],
              ["Trend pulse", "Real-time", "Detects shifts in launches, sentiment, and market noise"],
              ["Decision speed", "<5 min", "Fast recommendation output for business teams"],
            ].map(([label, value, note]) => (
              <div key={label} className="rounded-2xl border border-black bg-white p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_20px_rgba(15,23,42,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{label}</p>
                <strong className="mt-1 block text-2xl font-semibold text-slate-900">{value}</strong>
                <p className="mt-1 text-sm text-slate-600">{note}</p>
              </div>
            ))}
          </article>
        </section>

        <section className="rounded-3xl border-2 border-black bg-white p-5 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Interactive Monitoring Modules</h2>
              <p className="mt-1 text-sm text-slate-600">Click a card to swap the live panel. Expand dropdowns for more details.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CircleCheckBig className="h-3.5 w-3.5" />
              Live interaction
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {modules.map((module, idx) => {
              const isActive = idx === activeModule;
              return (
                <button
                  key={module.title}
                  type="button"
                  onClick={() => setActiveModule(idx)}
                  className={`rounded-2xl border-2 p-4 text-left transition-all duration-300 ${
                    isActive
                      ? "border-black bg-slate-900 text-white shadow-[0_14px_26px_rgba(15,23,42,0.2)]"
                      : "border-black bg-white text-slate-900 hover:-translate-y-1 hover:shadow-[0_12px_22px_rgba(15,23,42,0.08)]"
                  }`}
                >
                  <p className={`text-xs uppercase tracking-[0.08em] ${isActive ? "text-slate-300" : "text-slate-500"}`}>Module</p>
                  <h3 className="mt-2 text-lg font-semibold">{module.title}</h3>
                  <p className={`mt-1 text-sm ${isActive ? "text-slate-200" : "text-slate-600"}`}>{module.subtitle}</p>
                </button>
              );
            })}
          </div>

          <div
            key={selected.title}
            className="mt-4 rounded-2xl border-2 border-black bg-[linear-gradient(130deg,#fff,rgba(243,248,255,0.9))] p-5"
            style={{ animation: "fadeInUp 360ms ease" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Active Module</p>
                <h3 className="text-xl font-semibold tracking-tight">{selected.title}</h3>
              </div>
              <Button asChild variant="outline" className="border-black bg-white text-slate-900">
                <Link href={selected.href}>
                  {selected.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <p className="mt-3 text-sm text-slate-700">{selected.description}</p>

            <details className="mt-4 rounded-xl border border-black bg-white">
              <summary className="cursor-pointer px-4 py-2 text-sm font-semibold text-slate-800">Show monitored signals</summary>
              <div className="border-t border-slate-200 px-4 py-3">
                <ul className="grid gap-2 text-sm text-slate-700">
                  {selected.bullets.map((item) => (
                    <li key={item} className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        </section>

        <section className="rounded-3xl border-2 border-black bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.06)]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Continuous Tool & Trend Snapshot</h2>
              <p className="mt-1 text-sm text-slate-600">Live view of model performance, speed, and cost with animated updates.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <CircleCheckBig className="h-3.5 w-3.5" />
              Updated
            </div>
          </div>

          <div className="grid gap-2">
            <div className="hidden grid-cols-[1.25fr_0.6fr_0.6fr_0.7fr_1.45fr] gap-2 rounded-xl border border-black bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 md:grid">
              <span>Tool</span>
              <span>Score</span>
              <span>Latency</span>
              <span>Cost / 1k</span>
              <span>Best for</span>
            </div>

            {tableRows.map((row, i) => (
              <div
                key={row.model}
                className="grid gap-2 rounded-xl border border-black bg-[linear-gradient(130deg,#fff,rgba(243,248,255,0.9))] px-3 py-3 text-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_24px_rgba(56,189,248,0.16)] md:grid-cols-[1.25fr_0.6fr_0.6fr_0.7fr_1.45fr] md:items-center md:py-2"
                style={{ animation: `fadeInUp 0.5s ease-out ${i * 120}ms both` }}
              >
                <div className="font-medium text-slate-900">{row.model}</div>
                <div>
                  <span className="inline-flex min-w-9 items-center justify-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-900">
                    {row.score}
                  </span>
                </div>
                <div className="text-slate-600">{row.latency}</div>
                <div className="text-slate-600">{row.cost}</div>
                <div className="text-slate-600">{row.fit}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border-2 border-black bg-slate-900 p-6 text-white shadow-[0_18px_36px_rgba(15,23,42,0.2)]">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Monitor, decide, and improve continuously.</h2>
            <p className="mt-1 text-sm text-slate-300">Standex keeps tracking use-case outcomes and trend shifts so your AI strategy stays current.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg" className="shadow-[0_10px_24px_rgba(37,99,235,0.28)]">
              <Link href="/dashboard">
                Open Decision Tool
                <Sparkles className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white bg-white text-slate-900">
              <Link href="/briefs">
                Compare Tools
                <BarChart3 className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white bg-white text-slate-900">
              <Link href="/trends">
                Watch Trends
                <ShieldCheck className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
