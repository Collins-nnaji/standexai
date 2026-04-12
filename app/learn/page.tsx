"use client";

import React, { useState } from "react";
import Image from "next/image";
import { TopNav } from "@/components/network/TopNav";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Sparkles, Rocket,
  GraduationCap, Layers, Bot, Database, Zap, 
  BarChart3, ShieldCheck, CreditCard
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
    week: 1, title: "Foundations & Modern LLMs",
    subtitle: "Evolution, Architecture & Prompting",
    description: "Master the internals of modern LLMs. Understand how GPT-4o, Claude, and Gemini actually process tokens and how to architect systems around them using advanced prompting and structured outputs.",
    tools: [T.nextjs, T.openai, T.vercel, T.github],
    fullCurriculum: [
      {
        session: "Session 1 — Modern AI System Internals",
        topics: [
          "Evolution of LLMs: From transformers to GPT-4o, Claude 3.5, and Gemini 1.5 Pro",
          "How LLMs actually work: tokenisation, temperature, sampling, top-p, stop sequences",
          "Context windows explained: what goes in, what gets lost (lost-in-the-middle phenomena)",
          "Comparing model capabilities: benchmarks vs real-world production performance",
          "AI system design patterns: direct API, wrapper service, and gateway proxies",
          "Latency budgets and cost modelling: calculating TCO per token across providers",
          "Theoretical Audit: Reading AI vendor documentation like a senior engineer",
        ],
      },
      {
        session: "Session 2 — Advanced Prompting & Structured Logic",
        topics: [
          "Prompt engineering fundamentals: role prompting, few-shot examples, and chain-of-thought",
          "System prompts vs User prompts: defining 'unbreakable' personality and constraints",
          "Structured JSON outputs: response_format, strict mode, and Zod schema validation",
          "Prompt chaining: breaking complex tasks into reliable, sequential AI steps",
          "Common failure modes: hallucination, context stuffing, and prompt injection security",
          "Hands-on: building a reliable schema generator for unstructured data",
        ],
      },
    ],
  },
  {
    week: 2, title: "Shipping AI-Powered Interfaces",
    subtitle: "Next.js, UX & Token Streaming",
    description: "Build production-grade AI interfaces that feel instant. Master token streaming, server-side AI orchestration, and the unique UX challenges of conversational software.",
    tools: [T.nextjs, T.openai, T.react, T.vercel, T.cursor],
    fullCurriculum: [
      {
        session: "Session 1 — Next.js: The AI Application Framework",
        topics: [
          "Next.js App Router: Server Components vs Client Components for AI rendering",
          "Server Actions: triggering AI completions without complex API state management",
          "Architecture: Building streaming API routes with Vercel AI SDK",
          "Token streaming: implementing SSE (Server-Sent Events) for real-time output",
          "ReadableStreams: how to handle and pipe AI chunks from the LLM to the client",
        ],
      },
      {
        session: "Session 2 — Interactive AI UX & State",
        topics: [
          "Designing world-class chat interfaces: message history, auto-scrolling, and loading states",
          "Managing conversation state: client-side optimistic updates and persistent history",
          "Streaming UI patterns: rendering markdown, code blocks, and adaptive UI components",
          "Cursor AI workflow: writing production AI code with AI assistance and prompt-to-code",
          "UX Best Practices: handling 'AI thinking' states and graceful error recovery",
        ],
      },
    ],
  },
  {
    week: 3, title: "Data, Memory & Retrieval (RAG)",
    subtitle: "Postgres, Vector Stores & pgvector",
    description: "Give your AI product long-term memory. Implement a complete RAG (Retrieval-Augmented Generation) pipeline using Neon Postgres and advanced vector search.",
    tools: [T.neon, T.openai, T.nextjs, T.github, T.react],
    fullCurriculum: [
      {
        session: "Session 1 — Postgres & the Vector Pipeline",
        topics: [
          "Introduction to Neon: serverless Postgres for high-velocity AI apps",
          "Schema design for AI: storing conversation logs, user metadata, and vector IDs",
          "Vector Embeddings: text-embedding-3-small vs large — quality vs cost tradeoffs",
          "pgvector on Neon: implementing IVFFLAT vs HNSW indexes for sub-100ms search",
          "Vector distance metrics: choosing between Cosine Similarity, Dot Product, and L2",
        ],
      },
      {
        session: "Session 2 — The RAG Pipeline From Scratch",
        topics: [
          "Chunking strategies: fixed-size, recursive character, and semantic chunking explained",
          "The full RAG loop: ingestion → embedding → storage → retrieval → generation",
          "Hybrid search: combining BM25 keyword search with vector semantic search",
          "Handling hallucinations: confidence scoring and 'Grounding' with source citations",
          "Building a production RAG route in Next.js with multi-document support",
        ],
      },
    ],
  },
  {
    week: 4, title: "Advanced Agents & Multi-Model",
    subtitle: "Orchestration, Automation & Tool Use",
    description: "Build autonomous agents that can take actions. Orchestrate multiple models (GPT + Claude + Gemini) to handle complex engineering tasks without human intervention.",
    tools: [T.claude, T.openai, T.google, T.neon, T.vercel],
    fullCurriculum: [
      {
        session: "Session 1 — Multi-Model Orchestration",
        topics: [
          "Routing strategies: when to use Claude 3.5 for reasoning vs GPT-4o for speed",
          "Using Gemini 1.5 Pro for mass long-context summarisation and analysis",
          "Model fallbacks: building resilient systems that switch providers on failure",
          "ROI Optimization: choosing models based on cost, speed, and intelligence requirements",
        ],
      },
      {
        session: "Session 2 — Autonomous AI Agents",
        topics: [
          "Agent action loops: ReAct (Reason + Act) and reflection patterns explained",
          "Tool Use / Function Calling: defining schemas that allow AI to call external APIs",
          "Multi-agent orchestration: supervisor/worker patterns vs autonomous swarms",
          "Scheduling with Cron: using Vercel Cron to launch autonomous agent tasks",
          "Webhooks: triggering agent runs from external events (GitHub, Slack, etc.)",
        ],
      },
    ],
  },
  {
    week: 5, title: "Production, Scaling & Observability",
    subtitle: "Infrastructure, CI/CD & Analytics",
    description: "Scale your AI app to thousands of users. Master production deployment, automated pipelines, and deep observability across your model interactions.",
    tools: [T.nextjs, T.azure, T.vercel, T.github],
    fullCurriculum: [
      {
        session: "Session 1 — Scaling & Containerisation",
        topics: [
          "Vercel Edge performance: deploying AI logic to 100+ global regions",
          "Dockerising AI apps: building efficient multi-stage containers for Azure",
          "Azure Container Apps: scaling to zero and handling high-concurrency inference",
          "Infrastructure-as-Code: managing AI environment variables and secrets safely",
        ],
      },
      {
        session: "Session 2 — Observability & Analytics",
        topics: [
          "CI/CD with GitHub Actions: automated testing and deployment for AI pipelines",
          "Model Observability: implementing trace IDs and step-level telemetry with OpenTelemetry",
          "Production Monitoring: tracking token spend per user and model latency in real-time",
          "**Google Analytics integration**: tracking AI UX success and user journey metrics",
          "Error boundaries: catching and logging model failures in production",
        ],
      },
    ],
  },
  {
    week: 6, title: "Monetization & Capstone Launch",
    subtitle: "Stripe, Business Models & Final Ship",
    description: "Turn your engineering skills into revenue. Master complex Stripe integrations and finalize your capstone AI product for live launch.",
    tools: [T.stripe, T.nextjs, T.neon, T.vercel],
    fullCurriculum: [
      {
        session: "Session 1 — Payments & Revenue Strategy",
        topics: [
          "Integrating Stripe: from checkout sessions to subscription lifecycle management",
          "**Usage-based billing**: metering AI API calls and charging per-token in real-time",
          "Subscription logic: tiering features and model access (GPT-3.5 vs GPT-4o tiers)",
          "Webhook security: handling Stripe events (payment_succeeded, subscription_deleted)",
        ],
      },
      {
        session: "Session 2 — Capstone Sprint & Portfolio",
        topics: [
          "Capstone Build: final refinement of your core AI feature (chat, agent, or automation)",
          "Deployment Strategy: final go-live on production domain",
          "Growth & Iteration: collecting user feedback and planning v2 development",
          "Portfolio Day: documenting your technical build for LinkedIn and GitHub",
          "Graduation: peer review and verified certificate issuance for Cohort 04",
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
  const [showCertificate, setShowCertificate] = useState(false);

  const w = weeks.find(wk => wk.week === activeWeek) || weeks[0];

  const stats = [
    { label: "Duration", value: "6 Weeks", id: "duration" },
    { label: "Next Cohort", value: "May 5", id: "cohort" },
    { label: "Sessions", value: "2h 30m / session", id: "sessions" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-[#7C5CFC]/15 font-sans pb-24 overflow-x-hidden">
      <TopNav user={session?.user} />

      {/* ── PREMIUM BACKGROUND ARCHITECTURE ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AIBackground />
        {/* Energetic Mesh Gradients */}
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-[radial-gradient(circle_at_center,rgba(124,92,252,0.05)_0%,transparent_70%)] blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-[radial-gradient(circle_at_center,rgba(168,146,255,0.03)_0%,transparent_70%)] blur-[100px]" />
        {/* Engineering Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
      </div>

      <div className="relative z-10 pt-10">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            
            {/* LEFT COLUMN: CURRICULUM CONSOLE */}
            <div className="flex-1 w-full min-w-0">
              
              {/* CONSOLE HEADER & RAIL */}
              <div className="mb-14">
                <div className="flex items-center gap-3 mb-8">
                  <span className="h-[1px] w-12 bg-zinc-200" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#7C5CFC]">
                    Engineering Curriculum 2026
                  </span>
                </div>

                {/* CONSOLE-STYLE NAVIGATION RAIL */}
                <div className="bg-white/80 backdrop-blur-md border border-zinc-200/60 rounded-[24px] p-2 flex gap-1 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.03)] overflow-x-auto no-scrollbar">
                  {weeks.map((weekData) => (
                    <button
                      key={weekData.week}
                      onClick={() => setActiveWeek(weekData.week)}
                      className={`relative px-4 py-4 rounded-[18px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden flex-1 ${
                        activeWeek === weekData.week
                          ? "text-white"
                          : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50"
                      }`}
                    >
                      {activeWeek === weekData.week && (
                        <motion.div
                          layoutId="active-tab"
                          className="absolute inset-0 bg-[#7C5CFC] shadow-[0_8px_20px_-4px_rgba(124,92,252,0.4)]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">Week {weekData.week < 10 ? `0${weekData.week}` : weekData.week}</span>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWeek}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* HERO SECTION FOR ACTIVE WEEK */}
                  <div className="mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-zinc-950 tracking-tighter leading-[0.9] mb-8 uppercase italic">
                      {w.title}
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-zinc-500 font-medium leading-[1.4] max-w-4xl mb-12">
                      {w.description}
                    </p>
                  </div>

                  {/* MASTERCLASS SYLLABUS CARDS */}
                  <div className="space-y-10">
                    <div className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-6">
                      <Layers className="h-4 w-4" /> Syllabus Architecture
                    </div>
                    
                    <div className="grid grid-cols-1 gap-12 lg:gap-16">
                      {w.fullCurriculum.map((group, gi) => (
                        <div key={gi} className="group relative">
                          {/* Card Background Overlay */}
                          <div className="absolute -inset-x-8 -inset-y-6 bg-transparent group-hover:bg-violet-50/50 rounded-[40px] transition-colors duration-500 -z-10" />
                          
                          <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex flex-col items-center shrink-0">
                               <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-black text-white bg-zinc-950 shadow-[0_8px_20px_rgba(0,0,0,0.1)] group-hover:bg-[#7C5CFC] transition-colors duration-500">
                                 {gi + 1}
                               </div>
                               <div className="w-[2px] h-full flex-1 bg-zinc-100 group-last:hidden mt-4" />
                            </div>
                            
                            <div className="flex-1 pt-1">
                               <div className="flex items-center gap-3 mb-4">
                                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Session 0{gi + 1} Intensive</span>
                                 <span className="h-1 w-1 rounded-full bg-zinc-300" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 underline decoration-violet-200 underline-offset-4">Live Lab</span>
                               </div>
                               <h3 className="text-3xl md:text-4xl font-black text-zinc-950 tracking-tight leading-tight mb-8">
                                 {group.session}
                               </h3>
                               
                               <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                  {group.topics.map((topic, ti) => (
                                     <li key={ti} className="flex items-start gap-4 text-base font-semibold text-zinc-600 leading-relaxed hover:text-[#7C5CFC] transition-all transform hover:translate-x-1">
                                       <div className="mt-2.5 h-1.5 w-1.5 rounded-full shrink-0 bg-[#7C5CFC]/30 group-hover:bg-[#7C5CFC]/60 transition-colors" />
                                       {topic}
                                     </li>
                                  ))}
                               </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT COLUMN: FLOATING GLASS SIDEBAR */}
            <div className="lg:w-[460px] shrink-0 sticky top-12 flex flex-col gap-6 w-full">
              
              {/* TECH STACK CARD (VERTICAL LIST) */}
              <div className="bg-zinc-50/50 backdrop-blur-xl rounded-[32px] border border-zinc-200/50 p-6 flex flex-col gap-6">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#7C5CFC]">Module Toolchain</p>
                <div className="grid grid-cols-2 gap-4">
                   {w.tools.map((tool, ti) => (
                      <div key={ti} className="flex items-center gap-3 bg-white/80 p-3 rounded-2xl border border-zinc-100 shadow-sm transition-all hover:border-[#7C5CFC]/30 group">
                         <div className="h-10 w-10 shrink-0 relative p-1">
                            <Image src={tool.src} alt={tool.name} fill className="object-contain" unoptimized />
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-950 truncate">{tool.name}</span>
                      </div>
                   ))}
                </div>
              </div>

              {/* PRICE & STATS CARD (COMPACT REFINED) */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative group p-[1px] rounded-[32px] bg-gradient-to-b from-white/20 to-zinc-200/20"
              >
                <div className="flex flex-col bg-white/80 backdrop-blur-3xl rounded-[31px] border border-zinc-200 shadow-[0_32px_80px_-20px_rgba(0,0,0,0.06)] p-8 overflow-hidden relative">
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2.5">
                      <div className="h-2 w-2 rounded-full bg-[#7C5CFC] animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C5CFC]">
                        Cohort 04 — Active Enrollment
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mb-8">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Early Access Pricing</span>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-5xl font-black tracking-tighter text-zinc-950 uppercase italic leading-none">
                        $1800
                      </h3>
                      <span className="text-base font-black text-zinc-400 uppercase tracking-widest line-through decoration-zinc-950/20">$3500</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1 mb-8 bg-zinc-50/50 rounded-2xl p-2">
                    {stats.map(s => (
                      <div key={s.id} className="flex items-center justify-between py-3 border-b border-zinc-100 last:border-0 hover:translate-x-1 transition-transform px-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFC] opacity-70">{s.label}</span>
                        <span className="text-xs font-black text-zinc-950 uppercase tracking-tight">{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <MagneticLink href="https://buy.stripe.com/28E4gB0JK6Z8dDi697fnO0j" className="group relative w-full inline-flex items-center justify-center gap-4 rounded-[20px] bg-zinc-950 px-8 py-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] hover:bg-[#7C5CFC] transition-all duration-500 active:scale-95 mb-4 z-20">
                     <span className="relative z-30 text-[13px] font-black uppercase tracking-[0.2em] text-white">Enroll Now</span> <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-2 transition-transform relative z-30" />
                  </MagneticLink>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 italic">
                      Verified Cohort 04 Graduation Path
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Graduate Trust Segment */}
              <div className="px-10 py-6 bg-zinc-50/50 rounded-[32px] border border-zinc-100 flex flex-col gap-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Trusted by Engineering Teams</p>
                 <div className="flex gap-4 opacity-30 grayscale saturate-0">
                    {/* Minimal logo placeholders */}
                    <div className="h-5 w-5 border-2 border-zinc-950 rounded-sm" />
                    <div className="h-5 w-5 border-2 border-zinc-950 rounded-full" />
                    <div className="h-5 w-12 border-2 border-zinc-950 rounded-full" />
                 </div>
              </div>

            </div>

          </div>

          {/* NEW: UNIFIED CAPSTONE MASTERY SECTION */}
          <section className="mt-32 pt-20 border-t border-zinc-100 mb-20">
             <div className="flex flex-col items-center text-center mb-16">
                <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 mb-4">
                   <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-600">Verification Phase</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black tracking-[-0.03em] text-zinc-950 mb-4 italic uppercase">Capstone Graduation Mastery</h2>
                <p className="text-zinc-500 font-medium max-w-2xl px-4">Demonstrate your engineering expertise to the world.</p>
             </div>

             <div className="max-w-4xl mx-auto">
                <div className="group relative p-[1px] rounded-[40px] bg-gradient-to-br from-violet-200/50 via-zinc-200/50 to-violet-200/50">
                   <div className="bg-white/90 backdrop-blur-3xl rounded-[39px] p-10 lg:p-16 border border-white shadow-xl overflow-hidden relative">
                      {/* Decorative Background Icon */}
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                         <GraduationCap className="h-64 w-64 text-violet-950" />
                      </div>

                      <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                         <div className="flex-1">
                            <h3 className="text-3xl font-black text-zinc-950 uppercase italic tracking-tight mb-6">Mastery Requirements</h3>
                            <p className="text-lg font-semibold text-zinc-600 leading-relaxed mb-10">
                               The capstone requirement is a **full AI product** with all the features taught in the course—autonomous agents, RAG, usage-based billing, and deep observability. Every project is **personally tested by our team** for production-grade reliability and architectural integrity.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-10">
                               {[
                                 "Multi-Agent Orchestration",
                                 "Vector-driven Memory (RAG)",
                                 "Stripe Token-Billing",
                                 "Azure/Vercel Auto-Scaling",
                                 "Observability & Analytics",
                                 "Production README & Case Study"
                               ].map((feat, fi) => (
                                 <div key={fi} className="flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{feat}</span>
                                 </div>
                               ))}
                            </div>

                            <button 
                               onClick={() => setShowCertificate(true)}
                               className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-violet-50 border border-violet-100 text-[11px] font-black uppercase tracking-[0.2em] text-violet-600 hover:bg-violet-100 transition-all group"
                            >
                               View Digital Mastery Badge <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                            </button>
                         </div>

                         <div className="w-full md:w-80 shrink-0">
                            <motion.div 
                               whileHover={{ scale: 1.05, rotate: -2 }}
                               onClick={() => setShowCertificate(true)}
                               className="cursor-pointer relative group"
                            >
                               <div className="absolute -inset-4 bg-violet-400/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                               {/* PREVIEW CARD */}
                               <div className="relative aspect-[1/1] rounded-24 overflow-hidden border-8 border-white shadow-2xl bg-zinc-950 p-6 flex flex-col justify-between">
                                  <div className="flex justify-between items-start">
                                     <div className="h-8 w-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                                        <div className="h-4 w-4 rounded-full bg-violet-500 animate-pulse" />
                                     </div>
                                     <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.3em]">SXAI-V26-04</span>
                                  </div>
                                  <div className="space-y-2">
                                     <p className="text-[8px] font-black text-violet-400 uppercase tracking-widest">Mastery Level 04</p>
                                     <p className="text-sm font-black text-white uppercase italic tracking-tighter">Applied AI Engineer</p>
                                  </div>
                                  <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-white/20 to-transparent" />
                               </div>
                            </motion.div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

        </div>
      </div>

      {/* CERTIFICATE LIGHTBOX MODAL */}
      <AnimatePresence>
        {showCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCertificate(false)}
            className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-zinc-950/95 backdrop-blur-xl cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.8, rotateX: 10 }}
              animate={{ scale: 1, rotateX: 0 }}
              exit={{ scale: 0.8, rotateX: 10 }}
              className="relative max-w-[900px] w-full aspect-square md:aspect-[1.414/1] rounded-sm overflow-hidden shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] bg-white p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full relative border-[12px] border-double border-zinc-100 p-8 lg:p-12 flex flex-col justify-between items-center text-zinc-950">
                 {/* Elegant Frame Outline */}
                 <div className="absolute inset-4 border border-zinc-200 pointer-events-none" />
                 
                 {/* HEADER SECTION */}
                 <div className="flex flex-col items-center gap-2 relative z-10 w-full mb-2">
                    <div className="relative h-20 w-56">
                       <Image 
                          src="/standexailogo.png" 
                          alt="StandexAI Logo" 
                          fill 
                          className="object-contain"
                          unoptimized 
                       />
                    </div>
                    <div className="flex flex-col items-center gap-1">
                       <span className="text-[11px] font-black uppercase tracking-[0.4em] text-violet-600">Applied AI Engineering Hub</span>
                       <div className="h-[1px] w-32 bg-zinc-200 mt-1" />
                    </div>
                 </div>

                 {/* BODY SECTION */}
                 <div className="flex flex-col items-center text-center gap-6 relative z-10 w-full">
                    <div className="space-y-2">
                       <p className="text-[12px] font-medium uppercase tracking-[0.3em] text-zinc-400">This is to certify that</p>
                       <h2 className="text-5xl md:text-7xl font-black text-zinc-950 uppercase tracking-tighter leading-none font-serif pt-2 pb-6 border-b-2 border-zinc-100 px-12 min-w-[450px]">
                          John Doe
                       </h2>
                    </div>

                    <div className="flex flex-col items-center gap-4 max-w-2xl px-12">
                       <p className="text-[14px] font-black text-zinc-900 uppercase tracking-[0.4em]">Applied AI Engineer</p>
                       <p className="text-zinc-500 font-medium text-base leading-relaxed">
                          Awarded for mastering Multi-Agent Orchestration, production-grade RAG architectures, and the deployment of scalable AI systems.
                       </p>
                    </div>
                 </div>

                 {/* FOOTER SECTION (SIGNATURES & DATE) */}
                 <div className="w-full flex justify-between items-end relative z-10 px-8 pt-4">
                    <div className="flex flex-col items-center gap-1">
                       <div className="h-[1px] w-40 bg-zinc-300" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-950">Issuance Date</p>
                       <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest italic">October 24, 2026</p>
                    </div>

                    {/* Official Seal Placeholder */}
                    <div className="relative group">
                       <div className="h-20 w-20 rounded-full border-4 border-double border-violet-100 flex items-center justify-center bg-violet-50/30 transform rotate-12 transition-transform group-hover:rotate-0">
                          <ShieldCheck className="h-8 w-8 text-violet-600/30" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <span className="text-[5px] font-black text-violet-600/20 uppercase tracking-tighter leading-none transform -rotate-45">Certified SXAI Engineer</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                       <div className="h-[1px] w-40 bg-zinc-300" />
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-950">SXAI Verification</p>
                       <code className="text-[8px] font-mono text-violet-500/50 font-bold tracking-tighter">
                          8K2N9M-V26-04
                       </code>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setShowCertificate(false)}
                className="absolute top-6 right-6 h-10 w-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors z-30"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer className="max-w-7xl mx-auto px-12 py-24 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <div className="h-2 w-2 rounded-full bg-[#7C5CFC]" />
             <p className="text-sm font-black uppercase tracking-[0.3em] text-zinc-950">StandexAI</p>
          </div>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">© 2026 Applied Engineering Hub • All Rights Reserved</p>
        </div>
        <div className="flex items-center gap-12">
          <Link href="/presentation/ai" className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-[#7C5CFC] transition-colors">Course Deck</Link>
          <Link href="#" className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-400 hover:text-[#7C5CFC] transition-colors">Privacy</Link>
          <Link href="#" className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-950 border-b-2 border-[#7C5CFC]">Applied Cohort 04</Link>
        </div>
      </footer>
    </div>
  );
}
