"use client";

import { useMemo } from "react";
import Image from "next/image";
import {
  Shield,
  BarChart3,
  Layers,
  Gauge,
  Eye,
  Zap,
  Database,
  Cpu,
  Scale,
  Target,
  Rocket,
  CheckCircle2,
  Server,
  Lock,
  TrendingUp,
  FileCheck,
  Sparkles,
} from "lucide-react";

type Slide = {
  id: string;
  title: string;
  subtitle?: string;
  theme: string;
  content: React.ReactNode;
};

const SLIDE_THEME = "bg-gradient-to-br from-zinc-100 via-white to-zinc-50 text-zinc-900";

export default function PeerxPresentationPage() {
  const slides = useMemo<Slide[]>(
    () => [
      {
        id: "01",
        title: "StandexAI",
        subtitle: "The Vanta for AI representation accuracy",
        theme: SLIDE_THEME,
        content: (
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white/90 p-6">
              <p className="text-2xl font-semibold leading-relaxed text-zinc-800">
                &quot;StandexAI is the compliance infrastructure that monitors, corrects, and certifies how AI models represent brands — in text, and across every modality AI touches.&quot;
              </p>
              <p className="mt-4 text-sm font-medium text-zinc-600">
                Built to be category-defining and defensible: proprietary methodology, compounding data, and workflow lock-in — not a thin wrapper others can clone.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Category", value: "AI Representation Management", icon: Shield },
                { label: "Core Metric", value: "Standex Score (0-100)", icon: BarChart3 },
                { label: "Output", value: "Evidence + Compliance Signal", icon: FileCheck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                <div key={item.label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                  <Icon className="mb-2 h-6 w-6 text-zinc-600" />
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{item.label}</p>
                  <p className="mt-2 text-lg font-bold leading-snug text-zinc-900">{item.value}</p>
                </div>
              );})}
            </div>
          </div>
        ),
      },
      {
        id: "02",
        title: "The Big Picture",
        subtitle: "StandexAI is infrastructure, not a point tool",
        theme: SLIDE_THEME,
        content: (
          <div className="space-y-5">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6">
              <p className="text-lg font-semibold leading-relaxed text-zinc-700">
                SSL made the web trustworthy. SOC 2 made enterprise SaaS procurable. StandexAI makes AI-mediated brand interactions commercially and legally trustworthy.
              </p>
              <p className="mt-3 text-sm font-medium text-zinc-600">
                The full stack — monitor → score → correct → certify — is integrated by design. Copying one piece doesn’t replicate the system.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { layer: "MONITOR", detail: "Continuously scan how major AI models represent a brand.", icon: Eye },
                { layer: "SCORE", detail: "Produce one 0-100 accuracy metric across models and time.", icon: Gauge },
                { layer: "CORRECT", detail: "Publish verifiable correction signals that can be consumed downstream.", icon: Zap },
                { layer: "CERTIFY", detail: "Issue certifiable proof of representation accuracy.", icon: Shield },
              ].map((item) => {
                const Icon = item.icon;
                return (
                <div key={item.layer} className="rounded-2xl border border-zinc-200 bg-white p-5">
                  <Icon className="mb-2 h-6 w-6 text-zinc-600" />
                  <p className="text-sm font-black tracking-[0.2em] text-zinc-800">{item.layer}</p>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-700">{item.detail}</p>
                </div>
              );})}
            </div>
          </div>
        ),
      },
      {
        id: "03",
        title: "Why Now",
        subtitle: "Regulatory pressure creates the wedge",
        theme: SLIDE_THEME,
        content: (
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                h: "EU AI Act",
                p: "AI output risk and accountability are now part of compliance planning, especially for customer-facing claims.",
                icon: Scale,
              },
              {
                h: "FTC AI Guidance",
                p: "Misleading AI-mediated claims are increasingly treated as consumer protection issues.",
                icon: Shield,
              },
              {
                h: "SEC Disclosure Context",
                p: "Public companies need defensible narratives for AI risk exposure and controls.",
                icon: FileCheck,
              },
            ].map((card) => {
              const Icon = card.icon;
              return (
              <div key={card.h} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <Icon className="mb-3 h-7 w-7 text-zinc-600" />
                <h3 className="text-xl font-black tracking-tight text-zinc-900">{card.h}</h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-700">{card.p}</p>
              </div>
            );})}
            <div className="md:col-span-3 rounded-2xl border border-zinc-300 bg-zinc-100 p-6">
              <p className="text-base font-semibold leading-relaxed text-zinc-900">
                StandexAI is the bridge between what AI says and what brands need AI to say for commercial trust and legal defensibility.
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "04",
        title: "Live Data Diagnostics Dashboard",
        subtitle: "Product demo + lead engine + category benchmark",
        theme: "bg-white text-zinc-900",
        content: (
          <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <Eye className="mb-3 h-6 w-6 text-zinc-600" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">What it is</p>
                <p className="mt-3 text-base font-medium leading-relaxed text-zinc-700">
                  Public real-time tool showing side-by-side output from <strong>GPT-4o</strong>, <strong>Claude</strong>, and <strong>Gemini</strong> for any searched brand.
                </p>
                <p className="mt-2 text-xs font-medium text-zinc-500">Tech: serverless fan-out, normalized schema, live API calls.</p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                <TrendingUp className="mb-3 h-6 w-6 text-zinc-600" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">What it does commercially</p>
                <p className="mt-3 text-base font-medium leading-relaxed text-zinc-700">
                  Converts curiosity into qualified inbound by exposing concrete brand-risk signals before a sales conversation.
                </p>
                <p className="mt-2 text-xs font-medium text-zinc-500">Lead capture → CRM handoff, email-gated breakdown.</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              {[
                { text: "Cross-model comparison", icon: Cpu },
                { text: "Discrepancy and hallucination flags", icon: Zap },
                { text: "Standex Score + risk tier", icon: Gauge },
                { text: "Email-gated full breakdown", icon: Lock },
              ].map((item) => {
                const Icon = item.icon;
                return (
                <div key={item.text} className="rounded-xl border border-zinc-200 bg-white p-4 text-sm font-semibold text-zinc-800 flex items-start gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-zinc-600 mt-0.5" />
                  {item.text}
                </div>
              );})}
            </div>
          </div>
        ),
      },
      {
        id: "05",
        title: "Technical Stack",
        subtitle: "How the system works in production",
        theme: SLIDE_THEME,
        content: (
          <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <Cpu className="mb-3 h-6 w-6 text-zinc-600" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-800">Ingestion & normalization</p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-zinc-700">
                  <li><strong>Canonical representation schema</strong> — claim-level structure (entity, claim, source model, confidence) so GPT-4o, Claude, Gemini outputs are comparable.</li>
                  <li><strong>Model-specific adapters</strong> — per-provider request shaping, response parsing, and error handling; new models plug in without changing the core pipeline.</li>
                  <li>Single brand query → parallel fan-out → raw responses transformed into canonical claims before any scoring.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <Zap className="mb-3 h-6 w-6 text-zinc-600" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-800">Discrepancy & scoring engine</p>
                <ul className="mt-4 space-y-2 text-sm font-medium text-zinc-700">
                  <li><strong>Discrepancy engine</strong> — cross-model comparison, contradiction detection, and stale-claim flagging (proprietary rules + thresholds).</li>
                  <li><strong>Standex scoring pipeline</strong> — deterministic weighted factors (40/25/20/15), tier assignment, and factor-level breakdown persisted for audit.</li>
                  <li>Flags and scores are computed in our stack; providers only return raw text.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 md:col-span-2">
                <Database className="mb-3 h-6 w-6 text-zinc-600" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-800">Data & evidence layer</p>
                <ul className="mt-3 space-y-1.5 text-sm font-medium text-zinc-700">
                  <li><strong>Postgres</strong> — <code className="text-xs bg-zinc-100 px-1 rounded">ReadinessScan</code>, per-scan factor breakdowns, claim-level and flag history; time-series for trends and compliance exports.</li>
                  <li>Evidence bundle generation for certificates (what was measured, when, and how the score was derived). Hosting: Next.js on Vercel for UX; serverless/API for the pipeline.</li>
                </ul>
              </div>
            </div>
        ),
      },
      {
        id: "06",
        title: "Standex Score Mechanics",
        subtitle: "One number, decomposed into auditable factors",
        theme: SLIDE_THEME,
        content: (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <BarChart3 className="mb-3 h-6 w-6 text-zinc-600" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">Weighted Factors</p>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
                  <li>40% Factual Accuracy</li>
                  <li>25% Cross-Model Consensus</li>
                  <li>20% Data Freshness</li>
                  <li>15% Hallucination Density Control</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-6">
                <Gauge className="mb-3 h-6 w-6 text-zinc-600" />
                <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">Tiers</p>
                <ul className="mt-3 space-y-2 text-sm font-semibold text-zinc-800">
                  <li>90-100: Excellent</li>
                  <li>70-89: Moderate Risk</li>
                  <li>50-69: High Risk</li>
                  <li>Below 50: Critical</li>
                </ul>
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
              <FileCheck className="inline h-5 w-5 mr-2 text-zinc-600 align-middle" />
              <span className="text-sm font-semibold leading-relaxed text-zinc-700">
                This score is designed for decision velocity: one headline number for leadership, with full factor-level traceability for operators and compliance teams.
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "07",
        title: "UX Flow",
        subtitle: "Screen-by-screen narrative",
        theme: SLIDE_THEME,
        content: (
          <div className="space-y-4">
            {[
              {
                h: "Hero",
                p: "Immediate urgency via live ticker + brand search. Visitors feel the risk before reading long copy.",
                icon: Sparkles,
              },
              {
                h: "Comparison View",
                p: "Three-column model outputs with highlighted divergences and reasoned discrepancy flags.",
                icon: Cpu,
              },
              {
                h: "Score Panel",
                p: "Standex Score + tier + explanation of detected risk signals for the searched brand.",
                icon: Gauge,
              },
              {
                h: "Email Gate",
                p: "Full breakdown unlocked by email; converts active concern into warm, self-qualified pipeline.",
                icon: Lock,
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
              <div key={step.h} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <Icon className="mb-2 h-5 w-5 text-zinc-600" />
                <h3 className="text-lg font-black tracking-tight text-zinc-900">{step.h}</h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-zinc-700">{step.p}</p>
              </div>
            );})}
          </div>
        ),
      },
      {
        id: "08",
        title: "Scalability & Architecture",
        subtitle: "Designed for high-volume brand monitoring",
        theme: SLIDE_THEME,
        content: (
          <div className="grid gap-4 md:grid-cols-2">
              {[
                { id: "req", text: "Request path: Edge/API receives brand query → cache lookup (brand + schema version). On miss: fan-out to model adapters, normalize to canonical claims, run discrepancy engine and scoring pipeline, then cache result and persist scan + factors + flags.", icon: Cpu },
                { id: "bg", text: "Background path: Async jobs for scheduled refresh (hot brands, enterprise lists), idempotent scan semantics, and certificate/evidence bundle generation. Queue backpressure and provider rate limits respected.", icon: Zap },
                { id: "cache", text: "Cache & cost: Cache key = brand + canonical query fingerprint + schema version. Reduces repeated provider calls; TTL and invalidation policy per use case (demo vs. enterprise).", icon: Server },
                { id: "data", text: "Data: Postgres for scans, factor breakdowns, and time-series; history tables for trend and compliance exports. Evidence bundles are deterministic from stored scan data.", icon: Database },
                { id: "ext", text: "Extensibility: New model = new adapter + same canonical schema. New brand or region = same pipeline. No change to discrepancy rules or scoring formula required.", icon: Layers },
                { id: "ops", text: "Operations: Lead capture and CRM handoff live in the product flow; pipeline usage feeds measurable sales ops and retention.", icon: TrendingUp },
              ].map((item) => {
                const Icon = item.icon;
                return (
                <div key={item.id} className="rounded-xl border border-zinc-200 bg-white p-5 text-sm font-medium leading-relaxed text-zinc-800 flex items-start gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-zinc-700 mt-0.5" />
                  {item.text}
                </div>
              );})}
            </div>
        ),
      },
      {
        id: "09",
        title: "Competitive Moat",
        subtitle: "Innovative by design — not easily copied",
        theme: "bg-white text-zinc-900",
        content: (
          <div className="space-y-5">
            <div className="rounded-2xl border border-zinc-300 bg-zinc-100/80 p-5">
              <p className="text-base font-semibold leading-relaxed text-zinc-900">
                The combination of multi-model comparison, a single auditable score, and certifiable evidence is novel. Replicating it requires methodology, data history, and workflow integration — not just API calls.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  h: "Proprietary Risk Dataset",
                  p: "Continuous capture of model disagreements and flagged claims creates compounding proprietary data. Competitors start from zero; we compound over time. Not copyable without the same runway.",
                  icon: Database,
                },
                {
                  h: "Workflow Embedding",
                  p: "Score + ledger embed into legal, brand, and compliance rhythms. High switching cost once teams depend on the artifact for audits and boards. Point-in-time tools don’t create lock-in.",
                  icon: Layers,
                },
                {
                  h: "Trust Artifact Layer",
                  p: "Certification and evidence become decision artifacts for boards, regulators, and partners. The bar to replace a trusted audit trail is regulatory and organizational — not just technical.",
                  icon: Shield,
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                <div key={card.h} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <Icon className="mb-3 h-6 w-6 text-zinc-600" />
                  <h3 className="text-xl font-black tracking-tight text-zinc-900">{card.h}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-zinc-700">{card.p}</p>
                </div>
              );})}
            </div>
          </div>
        ),
      },
      {
        id: "10",
        title: "Action Plan & Next Steps",
        subtitle: "Execution priorities",
        theme: SLIDE_THEME,
        content: (
          <div className="space-y-4">
            {[
              { text: "Deepen benchmark coverage with additional tracked brands and recurring refresh cycles.", icon: BarChart3 },
              { text: "Harden enterprise reporting outputs from score events into board/compliance-friendly artifacts.", icon: FileCheck },
              { text: "Expand correction and certification workflows to increase switching cost and retention.", icon: Zap },
              { text: "Formalize distribution loop: dashboard traffic → email capture → guided sales conversion.", icon: Target },
            ].map((item) => {
              const Icon = item.icon;
              return (
              <div key={item.text} className="rounded-xl border border-zinc-200 bg-white p-5 text-base font-semibold leading-relaxed text-zinc-800 flex items-start gap-3">
                <Icon className="h-5 w-5 shrink-0 text-zinc-600 mt-0.5" />
                {item.text}
              </div>
            );})}
          </div>
        ),
      },
      {
        id: "11",
        title: "Close",
        subtitle: "StandexAI makes AI brand risk measurable, actionable, and certifiable",
        theme: SLIDE_THEME,
        content: (
          <div className="space-y-6">
            <p className="max-w-3xl text-2xl font-semibold leading-relaxed text-zinc-700">
              We are building the operating system for brand truth in the AI channel.
            </p>
            <div className="rounded-2xl border border-zinc-400 bg-zinc-200/60 p-6">
              <CheckCircle2 className="mb-2 h-6 w-6 text-zinc-800" />
              <p className="text-sm font-black uppercase tracking-[0.2em] text-zinc-800">Live Demo Path</p>
              <p className="mt-2 text-xl font-bold text-zinc-900">Data Diagnostics → Readiness Ledger</p>
              <p className="text-base text-zinc-600">StandexAI Team</p>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-zinc-100">
      <main className="snap-y snap-mandatory overflow-y-auto">
        {slides.map((slide, index) => (
          <section
            key={slide.id}
            id={`slide-${slide.id}`}
            className={`relative flex min-h-screen snap-start items-center ${slide.theme}`}
          >
            <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:px-10">
              <div className="mb-8">
                <Image
                  src="/standexailogo.png"
                  alt="StandexAI"
                  width={150}
                  height={40}
                  className="h-9 w-auto object-contain"
                  priority={index === 0}
                />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-zinc-600">Slide {String(index + 1).padStart(2, "0")}</p>
              <h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">{slide.title}</h1>
              {slide.subtitle ? (
                <p className="mt-4 max-w-4xl text-xl font-semibold leading-relaxed text-zinc-700">
                  {slide.subtitle}
                </p>
              ) : null}
              <div className="mt-10">{slide.content}</div>
            </div>
          </section>
        ))}
      </main>
    </div>
  );
}
