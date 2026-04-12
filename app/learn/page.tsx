"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TopNav } from "@/components/network/TopNav";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Sparkles, Rocket,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { neonAuthClient } from "@/lib/neon/auth-client";

const T = {
  nextjs: { name: "Next.js", src: "/images/nextjslogo.png" },
  openai: { name: "OpenAI", src: "/images/openai logo.svg" },
  claude: { name: "Claude", src: "/images/claude logo.svg" },
  google: { name: "Google", src: "/images/google logo.png" },
  vercel: { name: "Vercel", src: "/images/vercel logo.svg" },
  react: { name: "React", src: "/images/react logo.png" },
  github: { name: "GitHub", src: "/images/github logo.png" },
  azure: { name: "Azure", src: "/images/azure logo.png" },
  stripe: { name: "Stripe", src: "/images/stripe logo.png" },
  neon: { name: "Neon", src: "/images/neon logo.webp" },
  cursor: { name: "Cursor", src: "/images/cursor logo.png" },
};

const weeks = [
  {
    week: 1, title: "System Thinking & Product Scope",
    subtitle: "Architecture, APIs & Tradeoffs",
    description: "Master end-to-end AI system architecture. Learn how LLMs, APIs, tokens, context windows, and latency tradeoffs work together.",
    tools: [T.nextjs, T.openai, T.vercel, T.github],
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
        ],
      },
    ],
  },
  {
    week: 2, title: "Ship Your First AI Feature",
    subtitle: "Tool Use, Agents & Structured Outputs",
    description: "Build and deploy a working tool-using agent from scratch. Function calling, structured outputs, and error handling inside a real app.",
    tools: [T.nextjs, T.openai, T.react, T.vercel, T.cursor],
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
        ],
      },
    ],
  },
  {
    week: 3, title: "Give Your App a Memory",
    subtitle: "RAG, Vector DBs & Embeddings",
    description: "Implement Retrieval-Augmented Generation from scratch. Vector stores, chunking strategies, embedding pipelines, and hybrid retrieval.",
    tools: [T.neon, T.openai, T.nextjs, T.github, T.react],
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
        ],
      },
    ],
  },
  {
    week: 4, title: "Chain Agents Together",
    subtitle: "Multi-Agent Orchestration & Pipelines",
    description: "Architect multi-agent pipelines with parallel tasks, handoffs, and failure recovery — running autonomously without babysitting.",
    tools: [T.claude, T.openai, T.neon, T.github, T.vercel],
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
        ],
      },
    ],
  },
  {
    week: 5, title: "Build, Monetise & Deploy",
    subtitle: "Auth, Payments, Database & Production",
    description: "Turn your AI into a real product. Auth, Stripe billing, production Postgres, and full observability deployed on scalable cloud.",
    tools: [T.nextjs, T.stripe, T.neon, T.azure, T.vercel],
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
        ],
      },
    ],
  },
  {
    week: 6, title: "Capstone: Fine-Tune & Ship",
    subtitle: "Fine-Tuning, Edge Deployment & Certificate",
    description: "Fine-tune a model on custom data, deploy to the edge, peer review, then earn your verified certificate.",
    tools: [T.openai, T.google, T.github, T.azure, T.vercel],
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
  },
];

const floatingNodes = [
  { top: "15%", left: "20%", size: 4, delay: 0, moveX: 30, moveY: -40 },
  { top: "25%", left: "75%", size: 6, delay: 2, moveX: -20, moveY: 50 },
  { top: "60%", left: "10%", size: 3, delay: 5, moveX: 40, moveY: 20 },
  { top: "80%", left: "80%", size: 5, delay: 1, moveX: -30, moveY: -30 },
  { top: "40%", left: "40%", size: 8, delay: 3, moveX: 20, moveY: -20 },
];

function AIBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes hero-panning {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-60px) translateX(-60px); }
        }
        @keyframes hero-scanner {
          0% { transform: translateY(-100%); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
      `}} />
      <div 
        className="absolute w-[150%] h-[150%] top-0 left-0 bg-[linear-gradient(to_right,rgba(124,92,252,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,92,252,0.06)_1px,transparent_1px)] bg-[size:60px_60px]"
        style={{ animation: "hero-panning 40s linear infinite" }}
      />
      <div 
        className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#7C5CFC]/20 to-transparent"
        style={{ animation: "hero-scanner 10s ease-in-out infinite" }}
      />
      {floatingNodes.map((node, i) => (
        <motion.div
           key={i}
           className="absolute rounded-full bg-[#7C5CFC] shadow-[0_0_8px_rgba(124,92,252,0.4)]"
           style={{ top: node.top, left: node.left, width: node.size, height: node.size }}
           animate={{ y: [0, node.moveY, 0], x: [0, node.moveX, 0], opacity: [0.1, 0.4, 0.1] }}
           transition={{ duration: 15 + i*3, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex w-full">
      <Link href={href} className={className}>
        {children}
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Link>
    </div>
  );
}

function TiltCard({ tool }: { tool: any }) {
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className="h-14 w-14 lg:h-16 lg:w-16 rounded-xl flex items-center justify-center p-2.5 border border-white/10 bg-white shadow-md transition-all duration-300 relative overflow-hidden group-hover:scale-110">
        <div className="relative h-full w-full z-10">
          <Image src={tool.src} alt={tool.name} fill className="object-contain" unoptimized />
        </div>
      </div>
      <span className="text-[9px] font-black text-zinc-400 group-hover:text-white transition-colors uppercase tracking-widest text-center px-1">
        {tool.name}
      </span>
    </div>
  );
}

export default function LearnPage() {
  const { data: session } = neonAuthClient.useSession();
  const [activeWeek, setActiveWeek] = useState(1);

  const w = weeks.find(wk => wk.week === activeWeek) || weeks[0];

  const stats = [
    { label: "Duration", value: "6 Weeks", id: "duration" },
    { label: "Next Cohort", value: "May 5", id: "cohort" },
    { label: "Sessions", value: "2h 30m / session", id: "sessions" },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-[#7C5CFC]/15 font-sans pb-20">
      <TopNav user={session?.user} />

      {/* ── UNIFIED CURRICULUM & SIDEBAR LAYOUT ── */}
      <div className="relative overflow-hidden pt-6 lg:pt-12">
        <AIBackground />
        
        {/* Subtle decorative mesh overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')] opacity-[0.03]" />
        
        {/* Radial glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(124,92,252,0.08)_0%,transparent_65%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* LEFT COLUMN: CURRICULUM (START THE PAGE) */}
            <div className="flex-1 w-full flex flex-col pt-4">
              <div className="mb-10 flex flex-col items-start">
                <div className="flex items-center gap-2 mb-4 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7C5CFC]">
                    Applied AI Engineering Curriculum
                  </span>
                </div>
                
                {/* BIGGER TABS */}
                <div className="flex flex-wrap gap-2 lg:gap-3 mb-10 w-full">
                  {weeks.map((weekData) => (
                    <button
                      key={weekData.week}
                      onClick={() => setActiveWeek(weekData.week)}
                      className={`px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all border-2 flex-1 md:flex-initial text-center ${
                        activeWeek === weekData.week
                          ? "bg-[#7C5CFC] text-white border-[#7C5CFC] shadow-[0_12px_24px_-8px_rgba(124,92,252,0.5)] scale-[1.02]"
                          : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-200 hover:text-zinc-600"
                      }`}
                    >
                      Week 0{weekData.week}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeWeek}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-[#7C5CFC]/10 flex items-center justify-center border border-[#7C5CFC]/20">
                        <Rocket className="h-6 w-6 text-[#7C5CFC]" />
                      </div>
                      <p className="text-sm font-black uppercase tracking-[0.25em] text-[#7C5CFC]">{w.subtitle}</p>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-zinc-950 tracking-tighter leading-[0.9] mb-8 uppercase italic">
                      {w.title}
                    </h2>
                    
                    <p className="text-lg md:text-xl text-zinc-500 font-medium leading-relaxed max-w-4xl mb-12">
                      {w.description}
                    </p>

                    {/* HORIZONTAL TOOL STACK */}
                    <div className="mb-12">
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7C5CFC] mb-6">Master these Tools in Week 0{w.week}</p>
                      <div className="flex flex-wrap gap-8 lg:gap-12">
                        {w.tools.map((tool, ti) => (
                           <div key={ti} className="flex flex-col items-center gap-2 group">
                              <div className="h-14 w-14 rounded-2xl bg-white border border-zinc-100 shadow-sm flex items-center justify-center p-3 group-hover:scale-110 group-hover:border-violet-200 transition-all">
                                <Image src={tool.src} alt={tool.name} width={32} height={32} className="object-contain" unoptimized />
                              </div>
                              <span className="text-[9px] font-black text-zinc-400 group-hover:text-zinc-950 transition-colors uppercase tracking-widest">{tool.name}</span>
                           </div>
                        ))}
                      </div>
                    </div>

                    {/* SYLLABUS BREAKDOWN */}
                    <div className="w-full border-t border-zinc-100 pt-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">
                          Detailed Syllabus Breakdown — Week {w.week}
                        </p>
                        <div className="flex items-center gap-2 bg-[#7C5CFC]/8 text-[#7C5CFC] px-4 py-1.5 rounded-full border border-[#7C5CFC]/20">
                          <span className="text-[10px] font-black uppercase tracking-widest">Two 2.5 Hour Sessions</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-12 lg:gap-16">
                        {w.fullCurriculum.map((group, gi) => (
                          <div key={gi} className="group">
                            <div className="flex items-start md:items-center gap-5 mb-8">
                               <div className="h-10 w-10 rounded-xl flex items-center justify-center text-md font-black text-white shrink-0 bg-[#7C5CFC] shadow-[0_6px_15px_rgba(124,92,252,0.3)]">{gi + 1}</div>
                               <h3 className="text-2xl md:text-3xl font-black text-zinc-950 tracking-tight">{group.session}</h3>
                            </div>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-5 pl-15 border-l-2 border-zinc-100 ml-5 py-2">
                               {group.topics.map((topic, ti) => (
                                  <li key={ti} className="flex items-start gap-4 text-base font-semibold text-zinc-600 leading-relaxed hover:text-[#7C5CFC] transition-colors">
                                    <div className="mt-2.5 h-1.5 w-1.5 rounded-full shrink-0 bg-[#7C5CFC]/40" />
                                    {topic}
                                  </li>
                               ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* RIGHT COLUMN: SIDEBAR (PRICE CARD ONLY) */}
            <div className="lg:w-[400px] shrink-0 sticky top-12 flex flex-col gap-6 w-full lg:mt-4">
              
              {/* PRICE & STATS CARD (COMPACT GREY THEME) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col bg-zinc-50 rounded-[28px] border border-zinc-200 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.05)] overflow-hidden p-6 group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-[#7C5CFC] animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#7C5CFC]">
                      4th Cohort — Active
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-0.5 mb-6">
                  <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Enrollment Fee</span>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-4xl font-black tracking-tighter text-zinc-900 uppercase italic leading-none">
                      $1800
                    </h3>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest line-through">$3500</span>
                  </div>
                </div>

                {/* COMPACT PRICE CARD STATS */}
                <div className="grid grid-cols-1 gap-1 mb-6">
                  {stats.map(s => (
                    <div key={s.id} className="flex items-center justify-between py-2.5 border-b border-zinc-100 last:border-0 hover:bg-white/60 transition-colors px-2 rounded-lg">
                      <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#7C5CFC]/70">{s.label}</span>
                      <span className="text-[11px] font-black text-zinc-900 uppercase tracking-tight">{s.value}</span>
                    </div>
                  ))}
                </div>

                <MagneticLink href="https://buy.stripe.com/your-payment-link" className="group relative w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#A892FF] px-6 py-4 text-[12px] font-black uppercase tracking-[0.15em] text-white shadow-[0_8px_20px_-4px_rgba(124,92,252,0.4)] hover:shadow-[0_12px_28px_-6px_rgba(124,92,252,0.6)] transition-all active:scale-95 mb-3">
                   <GraduationCap className="h-5 w-5" /> Enroll Now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </MagneticLink>

                <div className="flex items-center justify-center gap-2 pt-3 border-t border-zinc-100">
                  <Sparkles className="h-3.5 w-3.5 text-[#7C5CFC]" />
                  <span className="text-[8px] font-black uppercase tracking-[0.15em] text-zinc-400">
                    Spots strictly limited
                  </span>
                </div>
              </motion.div>

            </div>

          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="max-w-7xl mx-auto px-6 py-16 mt-12 border-t border-zinc-100 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-zinc-200" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">© 2026 StandexAI Applied Engineering</p>
        </div>
        <Link 
          href="/presentation/ai" 
          className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-[#7C5CFC] transition-colors border border-transparent hover:border-zinc-100 rounded-lg px-4 py-2 bg-zinc-50/50"
        >
          Dev: Strategy Deck
        </Link>
      </footer>
    </div>
  );
}
