"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TopNav } from "@/components/network/TopNav";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, ArrowRight, Sparkles, Rocket, ChevronDown,
  Code2, Database, Network, BarChart3, Layers, Trophy, GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { neonAuthClient } from "@/lib/neon/auth-client";

const T = {
  nextjs:  { name: "Next.js", src: "/images/nextjslogo.png"    },
  openai:  { name: "OpenAI",  src: "/images/openai logo.svg"   },
  claude:  { name: "Claude",  src: "/images/claude logo.svg"   },
  google:  { name: "Google",  src: "/images/google logo.png"   },
  vercel:  { name: "Vercel",  src: "/images/vercel logo.svg"   },
  react:   { name: "React",   src: "/images/react logo.png"    },
  github:  { name: "GitHub",  src: "/images/github logo.png"   },
  azure:   { name: "Azure",   src: "/images/azure logo.png"    },
  stripe:  { name: "Stripe",  src: "/images/stripe logo.png"   },
  neon:    { name: "Neon",    src: "/images/neon logo.webp"    },
  cursor:  { name: "Cursor",  src: "/images/cursor logo.png"   },
};

const weeks = [
  {
    week: 1, title: "System Thinking & Product Scope",
    subtitle: "Architecture, APIs & Tradeoffs",
    description: "Master end-to-end AI system architecture. Learn how LLMs, APIs, tokens, context windows, and latency tradeoffs work together.",
    realUse: "Evaluate AI vendors, spec integrations, architect the right system from day one.",
    milestone: "Audited a real AI integration",
    tools: [T.nextjs, T.openai, T.vercel, T.github],
    builds: ["API integration audit", "System architecture diagram", "Cost model spreadsheet"],
    fullCurriculum: [
      {
        session: "Session 1 — How AI Systems Actually Work",
        topics: [
          "LLM internals: tokenisation, temperature, sampling, top-p, stop sequences",
          "Context windows explained: what goes in, what gets lost, and why it costs money",
          "How inference works: prompt → completion, the role of system prompts",
          "Comparing GPT-4o, Claude 3.5, Gemini 1.5 — when each wins and why",
          "AI system design patterns: direct API, wrapper service, gateway proxy",
          "Latency budgets, cost modelling per token, and rate limit tradeoffs",
          "Evaluating open-source vs hosted: Llama 3, Mixtral, Mistral on Hugging Face",
          "Hands-on: call the OpenAI API directly and build a cost calculator",
        ],
      },
      {
        session: "Session 2 — Architecture Decisions & Audit",
        topics: [
          "When NOT to use AI — replacing logic that doesn't need a model",
          "Architectural patterns: monolith vs microservices for AI products",
          "How to audit an existing AI integration: prompts, output quality, error handling",
          "The AI integration checklist: what every production system needs from day 1",
          "Writing a technical AI spec: model choice, fallback strategy, eval criteria",
          "Common failure modes: hallucination, context stuffing, prompt injection",
          "Reading and interpreting AI vendor documentation like an engineer",
          "Milestone: submit your audit report + system architecture diagram",
        ],
      },
    ],
    icon: Layers, color: "#3B82F6",
  },
  {
    week: 2, title: "Ship Your First AI Feature",
    subtitle: "Tool Use, Agents & Structured Outputs",
    description: "Build and deploy a working tool-using agent from scratch. Function calling, structured outputs, and error handling inside a real app.",
    realUse: "Automate repetitive workflows, add intelligent AI features to existing products.",
    milestone: "Working agent deployed in a live app",
    tools: [T.nextjs, T.openai, T.react, T.vercel, T.cursor],
    builds: ["Function-calling agent", "Deployed Next.js AI app", "Structured data extractor"],
    fullCurriculum: [
      {
        session: "Session 1 — Agents, Tool Calling & Full-Stack UI",
        topics: [
          "What is an agent? Action loops, tool use, and LLM reasoning steps explained",
          "OpenAI tool/function calling: schema definition, parallel calls, return handling",
          "Structured JSON outputs: Zod schemas, response_format, strict mode",
          "Building a multi-step agent that calls real external APIs",
          "Next.js App Router for AI apps: server actions and streaming routes",
          "Building a real-time React chat UI with streaming token-by-token responses",
          "Server-Sent Events (SSE) and ReadableStream for live AI output",
          "Hands-on: build a research agent inside a live Next.js chat interface",
        ],
      },
      {
        session: "Session 2 — Deploy, Harden & Ship",
        topics: [
          "Managing conversation history: message arrays, token limits, context pruning",
          "Deploying Next.js to Vercel: environment variables, edge vs serverless functions",
          "Error handling patterns: timeouts, retries with exponential backoff, fallback models",
          "Rate limiting your own API to prevent abuse and runaway costs",
          "Cursor AI workflow: writing agents with AI assistance, prompt-to-code patterns",
          "Monitoring your deployed app: Vercel logs, error boundaries, alerting",
          "Prompt engineering for agents: system prompts, few-shot examples, chain-of-thought",
          "Milestone: live deployed agent URL + GitHub repo submitted",
        ],
      },
    ],
    icon: Code2, color: "#7C5CFC",
  },
  {
    week: 3, title: "Give Your App a Memory",
    subtitle: "RAG, Vector DBs & Embeddings",
    description: "Implement Retrieval-Augmented Generation from scratch. Vector stores, chunking strategies, embedding pipelines, and hybrid retrieval.",
    realUse: "Internal knowledge bases, AI over company docs, smart contextual search.",
    milestone: "RAG assistant live over your own dataset",
    tools: [T.neon, T.openai, T.nextjs, T.github, T.react],
    builds: ["Vector embedding pipeline", "RAG API endpoint", "Semantic document search UI"],
    fullCurriculum: [
      {
        session: "Session 1 — Embeddings, Vectors & the RAG Pipeline",
        topics: [
          "What embeddings are and why they enable semantic search over your own data",
          "OpenAI text-embedding-3-small vs large: cost vs quality tradeoffs",
          "Vector distance metrics: cosine similarity, dot product, L2 — which to use and why",
          "Setting up pgvector on Neon Postgres: schema design, IVFFLAT vs HNSW index types",
          "Chunking strategies: fixed-size, recursive, sentence-based, semantic chunking",
          "The full RAG architecture: ingest → embed → store → retrieve → generate",
          "Document ingestion pipeline: loaders for PDF, Markdown, web pages, Notion",
          "Hands-on: embed 100 documents and run your first semantic similarity search",
        ],
      },
      {
        session: "Session 2 — Hybrid Search, UI & Production",
        topics: [
          "Metadata filtering: attaching source, date, author to chunks for filtered recall",
          "Hybrid search: combining BM25 keyword search with vector search for higher recall",
          "Re-ranking with cross-encoders: boosting retrieval precision post-search",
          "Building the full RAG API route in Next.js with streaming responses",
          "Building a document Q&A UI in React with source citation display",
          "Handling hallucinations: confidence scoring and 'I don't know' fallbacks",
          "Evaluating RAG quality: recall@k, context relevance, and faithfulness metrics",
          "Milestone: live RAG assistant with searchable document UI deployed",
        ],
      },
    ],
    icon: Database, color: "#10B981",
  },
  {
    week: 4, title: "Chain Agents Together",
    subtitle: "Multi-Agent Orchestration & Pipelines",
    description: "Architect multi-agent pipelines with parallel tasks, handoffs, and failure recovery — running autonomously without babysitting.",
    realUse: "Automated research workflows, content pipelines, complex multi-step business processes.",
    milestone: "Multi-agent pipeline running autonomously",
    tools: [T.claude, T.openai, T.neon, T.github, T.vercel],
    builds: ["Multi-agent orchestrator", "Autonomous research pipeline", "Agent error recovery system"],
    fullCurriculum: [
      {
        session: "Session 1 — Multi-Agent Design & Reliability",
        topics: [
          "Why single agents fail on complex tasks — and what multi-agent architecture solves",
          "Orchestration patterns: supervisor/worker, router, chain, parallel fan-out",
          "Specialist agent design: research, writer, critic, and validator agents",
          "Using Claude 3.5 Sonnet for long-context summarisation and structured planning",
          "Shared state management: how agents pass results between each other safely",
          "Failure recovery: retry loops, fallback agents, dead-letter queues for failed tasks",
          "Idempotency in pipelines: making re-runs safe and predictable",
          "Hands-on: build a 3-agent research pipeline (search → summarise → format)",
        ],
      },
      {
        session: "Session 2 — Memory, Observability & Autonomous Deployment",
        topics: [
          "Persistent agent memory: storing run history and outputs in Neon Postgres",
          "Agent observability: trace IDs, structured logs, and step-level telemetry",
          "Concurrency: running agents in parallel with Promise.all, managing race conditions",
          "Deploying agent pipelines as scheduled jobs using Vercel Cron Functions",
          "Webhook triggers: launching agent runs from external events (Slack, GitHub, etc.)",
          "Budget controls: max-token limits, cost caps, kill switches for runaway pipelines",
          "Security: sandboxing agent tool calls, preventing prompt injection at scale",
          "Milestone: fully autonomous pipeline deployed and running on a cron schedule",
        ],
      },
    ],
    icon: Network, color: "#F59E0B",
  },
  {
    week: 5, title: "Build, Monetise & Deploy",
    subtitle: "Auth, Payments, Database & Production",
    description: "Turn your AI into a real product. Auth, Stripe billing, production Postgres, and full observability deployed on scalable cloud.",
    realUse: "Go from prototype to something you'd actually charge for or put in front of users.",
    milestone: "Production app with auth, billing & monitoring",
    tools: [T.nextjs, T.stripe, T.neon, T.azure, T.vercel],
    builds: ["Stripe subscription billing", "Auth-gated AI features", "Production monitoring dashboard"],
    fullCurriculum: [
      {
        session: "Session 1 — Auth, Identity & Stripe Billing",
        topics: [
          "Authentication options for Next.js: NextAuth, Clerk, Neon Auth — tradeoffs",
          "JWT vs session cookies: when to use each and security considerations",
          "OAuth flows: Google and GitHub sign-in implemented in under 30 minutes",
          "Database-backed sessions: storing user state and AI history in Neon Postgres",
          "Role-based access control (RBAC): free tier vs paid tier feature gating",
          "Stripe fundamentals: Products, Prices, Customers, PaymentIntents, Subscriptions",
          "Stripe Checkout: hosted payment page + webhook lifecycle (activated, failed, cancelled)",
          "Hands-on: gate AI features behind a Stripe subscription with real billing events",
        ],
      },
      {
        session: "Session 2 — Production Infrastructure & Observability",
        topics: [
          "Usage-based billing: metering AI API calls and charging per-token with Stripe",
          "Rate limiting and usage quotas per subscription tier",
          "Dockerising a Next.js app: Dockerfile, .dockerignore, multi-stage builds",
          "Deploying containers to Azure Container Apps: scaling, health checks, secrets",
          "Production Postgres on Neon: connection pooling with PgBouncer, staging branches",
          "Observability stack: structured logging, distributed tracing with OpenTelemetry",
          "Cost monitoring: tracking OpenAI spend per user, alerting on budget thresholds",
          "Milestone: fully deployed, monetised AI product with live billing and monitoring",
        ],
      },
    ],
    icon: BarChart3, color: "#EC4899",
  },
  {
    week: 6, title: "Capstone: Fine-Tune & Ship",
    subtitle: "Fine-Tuning, Edge Deployment & Certificate",
    description: "Fine-tune a model on custom data, deploy to the edge, peer review, then earn your verified certificate.",
    realUse: "Walk away with a shipped portfolio project and the repeatable pattern to build more.",
    milestone: "Fine-tuned model + verified certificate",
    tools: [T.openai, T.google, T.github, T.azure, T.vercel],
    builds: ["Custom fine-tuned model", "Full-stack AI product", "CI/CD deployment pipeline"],
    fullCurriculum: [
      {
        session: "Session 1 — Fine-Tuning: Data, Training & Evaluation",
        topics: [
          "When fine-tuning wins vs RAG vs prompt engineering — a clear decision framework",
          "Preparing JSONL training data: format, quality signals, and minimum dataset size",
          "Data cleaning and deduplication: filtering noise that degrades model quality",
          "Fine-tuning with OpenAI API: submitting jobs, monitoring loss curves, checkpoints",
          "Fine-tuning with Google Vertex AI: dataset upload, training config, evaluation",
          "Evaluating your fine-tuned model: perplexity, task-specific evals, human review",
          "A/B testing: routing traffic between fine-tuned and base model for comparison",
          "Hands-on: prepare a domain dataset and run your first fine-tuning job end-to-end",
        ],
      },
      {
        session: "Session 2 — Edge Deployment, CI/CD & Capstone",
        topics: [
          "Deploying to Vercel Edge Functions: sub-50ms cold starts and global distribution",
          "CI/CD pipeline with GitHub Actions: auto-deploy on merge, canary releases",
          "Rollback strategies: version pinning and feature flags for safe model updates",
          "Capstone project scoping: define your real problem, success criteria, and user",
          "Architecture review: cohort peer feedback on your full system design",
          "Live demo session: present your shipped product to the group",
          "Portfolio documentation: writing your case study for LinkedIn and GitHub",
          "Verified certificate issued upon successful capstone submission and review",
        ],
      },
    ],
    icon: Trophy, color: "#7C5CFC",
  },
];

function ToolLogo({ tool, accentColor }: { tool: { name: string; src: string }; accentColor: string }) {
  return (
    <div className="flex flex-col items-center gap-1 group" title={tool.name}>
      <div
        className="h-9 w-9 rounded-lg flex items-center justify-center p-1.5 border transition-transform duration-200 group-hover:scale-110"
        style={{ backgroundColor: `${accentColor}12`, borderColor: `${accentColor}25` }}
      >
        <div className="relative h-full w-full">
          <Image src={tool.src} alt={tool.name} fill className="object-contain" unoptimized />
        </div>
      </div>
      <span className="text-[8px] font-semibold text-zinc-400 group-hover:text-zinc-600 transition-colors leading-none">
        {tool.name}
      </span>
    </div>
  );
}

export default function LearnPage() {
  const { data: session } = neonAuthClient.useSession();
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);

  function go(i: number) {
    if (i === active) return;
    setActive(i);
    setExpanded(false);
  }

  const w = weeks[active];
  const Icon = w.icon;

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-[#7C5CFC]/15">
      <TopNav user={session?.user} />

      {/* ── MAIN LAYOUT: left sidebar + right curriculum ── */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">

        {/* ── LEFT SIDEBAR (1/4) ── */}
        <aside className="lg:w-[300px] xl:w-[320px] shrink-0 bg-zinc-950 border-b lg:border-b-0 lg:border-r border-white/5 px-6 py-8 flex flex-col gap-6 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -left-20 -top-20 h-64 w-64 bg-[#7C5CFC]/10 blur-[100px] pointer-events-none" />
          <div className="absolute -right-20 -bottom-20 h-64 w-64 bg-[#7C5CFC]/5 blur-[100px] pointer-events-none" />


          {/* Intake badge */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-200">
              Q2 · May 5, 2025 · Rolling Intake
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-2xl font-black tracking-tight leading-tight text-white">
              Learn<br />
              <span className="text-[#7C5CFC]">6-Week Outcomes</span>
            </h1>
            <p className="text-sm text-zinc-300 mt-2.5 leading-relaxed">
              Become an <span className="text-white">Applied AI Engineer</span>. We focus purely on building and shipping. Each week has one clear milestone.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Duration",   value: "6 Weeks" },
              { label: "Format",     value: "Live Cohort" },
              { label: "Sessions",   value: "2× / Week" },
              { label: "Hours",      value: "8–10 / wk" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-white/[0.04] border border-white/5 px-3 py-2.5">
                <p className="text-[9px] font-bold uppercase tracking-wide text-zinc-300">{s.label}</p>
                <p className="text-sm font-black text-white mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-2">
            <Link href="https://buy.stripe.com/your-payment-link" className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] px-4 py-3 text-xs font-black uppercase tracking-wide text-white overflow-hidden transition-all active:scale-95 shadow-[0_0_20px_rgba(124,92,252,0.3)] hover:shadow-[0_0_25px_rgba(124,92,252,0.5)]">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine" />
              <GraduationCap className="h-4 w-4 shrink-0 transition-transform group-hover:-rotate-12" /> Enroll Now
            </Link>
            
            <div className="mt-2 space-y-2">
              <p className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest text-center">Find your starting point</p>
              <Link href="/assessment" className="group inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-black uppercase tracking-wide text-white hover:bg-white/20 transition-all active:scale-95 shadow-sm">
                <Sparkles className="h-4 w-4 shrink-0 text-[#A892FF] transition-transform group-hover:scale-110" /> Free Assessment
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/5" />

          {/* After graduation — compact */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Rocket className="h-3.5 w-3.5 text-[#7C5CFC]" />
              <span className="text-[10px] font-black uppercase tracking-wide text-[#7C5CFC]">After graduation</span>
            </div>
            <p className="text-sm font-black text-white leading-snug">
              Exceptional graduates <span className="text-[#7C5CFC]">join the build.</span>
            </p>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Top performers join live Open Projects alongside Microsoft, Google & Anthropic partners.
            </p>
            <ul className="space-y-2">
              {[
                "Live products built in public",
                "Core engineering team access",
                "Performance-based invitations only",
              ].map((p, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#7C5CFC] shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-white hover:text-white/80 transition-colors">
              Open Projects <ArrowRight className="h-3.5 w-3.5 text-[#A892FF]" />
            </Link>
          </div>
        </aside>

        {/* ── RIGHT: CURRICULUM ── */}
        <main className="flex-1 bg-zinc-50 px-4 sm:px-6 py-6 overflow-y-auto">
          
          {/* Section label + week tabs */}
          <div className="mb-4">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">
              The Curriculum — Six weeks, six things you build
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              {weeks.map((wk, i) => (
                <button
                  key={wk.week}
                  onClick={() => go(i)}
                  className={`shrink-0 rounded-lg px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all duration-200 border ${
                    active === i
                      ? "text-white border-transparent shadow-md"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
                  }`}
                  style={active === i ? { backgroundColor: wk.color } : {}}
                >
                  Wk {wk.week}
                </button>
              ))}
            </div>
          </div>

          {/* Week card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm transition-shadow duration-500"
              style={{ boxShadow: `0 0 40px -15px ${w.color}25` }}
            >
              {/* Coloured accent bar */}
              <div
                className="h-[3px] w-full transition-colors duration-500"
                style={{ backgroundColor: w.color }}
              />

              <div className="relative overflow-hidden">
                {/* Watermark number */}
                <div
                  className="pointer-events-none select-none absolute -right-4 -bottom-4 font-black leading-none opacity-[0.03]"
                  style={{ fontSize: "clamp(10rem,20vw,16rem)", color: w.color, lineHeight: 1 }}
                >
                  {String(w.week).padStart(2, "0")}
                </div>

                <div className="relative z-10 px-6 py-8 lg:px-10 flex flex-col md:flex-row gap-10">
                  
                  {/* LEFT COLUMN: Content */}
                  <div className="flex-1 flex flex-col gap-8">
                    {/* ── HEADER ── */}
                    <motion.div
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05, duration: 0.35 }}
                      className="flex items-start justify-between gap-4"
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2"
                          style={{ backgroundColor: `${w.color}10`, borderColor: `${w.color}30` }}
                        >
                          <Icon className="h-7 w-7" style={{ color: w.color }} />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.22em] mb-1.5" style={{ color: w.color }}>
                            Week {w.week} · {w.subtitle}
                          </p>
                          <h2 className="text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
                            {w.title}
                          </h2>
                        </div>
                      </div>
                      {/* Milestone badge */}
                      <div
                        className="shrink-0 hidden xl:flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-[11px] font-black uppercase tracking-wider"
                        style={{ borderColor: `${w.color}35`, color: w.color, backgroundColor: `${w.color}08` }}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        {w.milestone}
                      </div>
                    </motion.div>

                    {/* ── DESCRIPTION ── */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.12, duration: 0.35 }}
                      className="text-lg lg:text-xl font-medium text-zinc-600 leading-relaxed border-l-4 pl-6"
                      style={{ borderColor: `${w.color}40` }}
                    >
                      {w.description}
                    </motion.p>

                    {/* ── WHAT YOU SHIP — inline list ── */}
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.24, duration: 0.35 }}
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-400 mb-4">What you ship</p>
                      <div className="flex flex-wrap gap-2.5">
                        {w.builds.map(b => (
                          <span
                            key={b}
                            className="inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 text-xs font-bold text-zinc-800"
                            style={{ borderColor: `${w.color}20`, backgroundColor: `${w.color}06` }}
                          >
                            <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: w.color }} />
                            {b}
                          </span>
                        ))}
                      </div>
                    </motion.div>

                    {/* ── REAL USE — callout ── */}
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.35 }}
                      className="rounded-2xl px-6 py-5 flex items-start gap-4"
                      style={{ backgroundColor: `${w.color}08`, border: `2px solid ${w.color}15` }}
                    >
                      <div className="mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: w.color }} />
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1.5" style={{ color: w.color }}>
                          Real-world application
                        </p>
                        <p className="text-base font-bold text-zinc-900 leading-snug">{w.realUse}</p>
                      </div>
                    </motion.div>

                    {/* ── FULL SYLLABUS ACCORDION ── */}
                    <div className="mt-2">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.34, duration: 0.3 }}
                      >
                        <button
                          onClick={() => setExpanded(e => !e)}
                          className="flex items-center justify-between w-full rounded-2xl border-2 bg-zinc-50 hover:bg-zinc-100 px-6 py-4 transition-colors text-left group"
                          style={{ borderColor: expanded ? w.color : "#e4e4e7" }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: w.color }} />
                            <span className="text-sm font-black uppercase tracking-wide text-zinc-700 group-hover:text-zinc-900 transition-colors">
                              Full Week {w.week} Curriculum
                            </span>
                            <span className="text-xs font-medium text-zinc-400">
                              — {w.fullCurriculum.length} sessions
                            </span>
                          </div>
                          <ChevronDown
                            className="h-5 w-5 text-zinc-400 transition-transform duration-300"
                            style={{
                              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                              color: expanded ? w.color : undefined
                            }}
                          />
                        </button>

                        <AnimatePresence>
                          {expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              {/* Scrollable container — no scrollbar lines */}
                              <div
                                className="mt-3 rounded-2xl overflow-y-auto"
                                style={{
                                  backgroundColor: `${w.color}05`,
                                  border: `2px solid ${w.color}12`,
                                  maxHeight: "420px",
                                  scrollbarWidth: "none",
                                  msOverflowStyle: "none",
                                }}
                              >
                                <style>{`.no-sb::-webkit-scrollbar{display:none}`}</style>
                                <div className="no-sb px-6 py-6 flex flex-col gap-8">
                                  {w.fullCurriculum.map((group, gi) => (
                                    <motion.div
                                      key={gi}
                                      initial={{ opacity: 0, y: 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: gi * 0.08, duration: 0.3 }}
                                    >
                                      {/* Session label */}
                                      <div className="flex items-center gap-3 mb-4">
                                        <div
                                          className="h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
                                          style={{ backgroundColor: w.color }}
                                        >
                                          {gi + 1}
                                        </div>
                                        <p className="text-sm font-black text-zinc-900 tracking-tight">
                                          {group.session}
                                        </p>
                                      </div>

                                      {/* Topics */}
                                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pl-9">
                                        {group.topics.map((topic, ti) => (
                                          <motion.li
                                            key={ti}
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: gi * 0.08 + ti * 0.03, duration: 0.22 }}
                                            className="flex items-start gap-3 text-sm font-medium text-zinc-600 leading-snug"
                                          >
                                            <span
                                              className="mt-2 h-1.5 w-1.5 rounded-full shrink-0 opacity-60"
                                              style={{ backgroundColor: w.color }}
                                            />
                                            {topic}
                                          </motion.li>
                                        ))}
                                      </ul>

                                      {/* Session divider */}
                                      {gi < w.fullCurriculum.length - 1 && (
                                        <div className="mt-6 border-t-2" style={{ borderColor: `${w.color}10` }} />
                                      )}
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Tool Stack */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="w-full md:w-[220px] lg:w-[260px] shrink-0"
                  >
                    <div 
                      className="rounded-3xl p-6 lg:p-8 h-full flex flex-col gap-6"
                      style={{ backgroundColor: `${w.color}05`, border: `2px solid ${w.color}10` }}
                    >
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">Tool Stack</p>
                      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
                        {w.tools.map((tool, ti) => (
                          <motion.div 
                            key={`${tool.name}-${ti}`}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="flex flex-col items-center gap-2 group"
                          >
                            <div
                              className="h-16 w-16 lg:h-20 lg:w-20 rounded-2xl flex items-center justify-center p-3 border-2 transition-all duration-300 bg-white group-hover:shadow-lg"
                              style={{ borderColor: `${w.color}20` }}
                            >
                              <div className="relative h-full w-full">
                                <Image src={tool.src} alt={tool.name} fill className="object-contain" unoptimized />
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-zinc-500 group-hover:text-zinc-900 transition-colors uppercase tracking-wider">
                              {tool.name}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                      
                      <div className="mt-auto pt-6 border-t border-zinc-200/50">
                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Build Duration</p>
                        <p className="text-xs font-black text-zinc-900">7-10 Days / Module</p>
                      </div>
                    </div>
                  </motion.div>


                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
