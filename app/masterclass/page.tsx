"use client";

import React, { useState } from "react";
import { TopNav } from "@/components/network/TopNav";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Rocket,
  Trophy,
  Target,
  Zap,
  Star,
  GraduationCap,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Code2,
  Brain,
  Database,
  Network,
  BarChart3,
  Layers,
} from "lucide-react";
import Link from "next/link";
import { neonAuthClient } from "@/lib/neon/auth-client";
import { useRef } from "react";

const weeks = [
  {
    week: 1,
    title: "Understand the Stack, Make Better Decisions",
    subtitle: "Architecture, APIs & Tradeoffs",
    description:
      "How AI systems are architected end-to-end. LLMs, APIs, tokens, context, cost, latency tradeoffs. By the end you can audit an AI integration, have an informed technical conversation with any engineer, and know exactly where AI fits — and doesn't — in your stack or workflow.",
    realUse:
      "Evaluate AI vendors, spec an integration, stop being the non-technical person in the room.",
    milestone: "You've audited a real AI integration",
    icon: Layers,
    color: "#3B82F6",
    bg: "bg-blue-50",
    border: "border-blue-100",
    chip: "bg-blue-100 text-blue-700",
  },
  {
    week: 2,
    title: "Build Your First AI-Powered Feature",
    subtitle: "Tool Use, Agents & Structured Outputs",
    description:
      "Ship a working tool-using agent from scratch. Function calling, structured outputs, error handling. You integrate it into a simple app — a Slack bot, an internal tool, a browser extension — something you could actually hand to a colleague.",
    realUse:
      "Automate a repetitive workflow, add AI to an existing product, prototype in hours not weeks.",
    milestone: "Working agent integrated into a real app",
    icon: Code2,
    color: "#7C5CFC",
    bg: "bg-violet-50",
    border: "border-violet-100",
    chip: "bg-violet-100 text-violet-700",
  },
  {
    week: 3,
    title: "Give Your App a Memory",
    subtitle: "RAG, Vector DBs & Embeddings",
    description:
      "Vector databases, RAG pipelines, embedding models, hybrid retrieval. You build a system that can search, recall, and reason over your own data — documents, notes, customer records, codebases.",
    realUse:
      "Internal knowledge base, AI over your company docs, smarter search for any product.",
    milestone: "Custom knowledge assistant over your own data",
    icon: Database,
    color: "#10B981",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    chip: "bg-emerald-100 text-emerald-700",
  },
  {
    week: 4,
    title: "Chain Agents Together",
    subtitle: "Multi-Agent Orchestration & Pipelines",
    description:
      "Multi-agent orchestration, parallel tasks, handoffs, failure recovery. You build a pipeline where agents collaborate — one researches, one writes, one checks — without you babysitting it.",
    realUse:
      "Automated research workflows, content pipelines, complex multi-step business processes running on autopilot.",
    milestone: "Multi-agent pipeline running autonomously",
    icon: Network,
    color: "#F59E0B",
    bg: "bg-amber-50",
    border: "border-amber-100",
    chip: "bg-amber-100 text-amber-700",
  },
  {
    week: 5,
    title: "Take It to Production",
    subtitle: "Evals, Observability & Deployment",
    description:
      "Evals, observability, cost optimisation, deployment patterns. You instrument your system so you know when it breaks, why it's slow, and how much it costs to run at scale.",
    realUse:
      "Go from prototype to something you'd actually charge for or put in front of users.",
    milestone: "Production system with monitoring & evals",
    icon: BarChart3,
    color: "#EC4899",
    bg: "bg-pink-50",
    border: "border-pink-100",
    chip: "bg-pink-100 text-pink-700",
  },
  {
    week: 6,
    title: "Capstone: Build Something That Matters",
    subtitle: "Real Problem, Full System, Shipped",
    description:
      "You define a real problem — in your job, your business, your side project — and build the full AI system around it. Peer review, iteration, and a verified certificate of completion.",
    realUse:
      "Walk away with a shipped project in your portfolio and the pattern to repeat it.",
    milestone: "Shipped AI system + verified certificate",
    icon: Trophy,
    color: "#7C5CFC",
    bg: "bg-violet-50",
    border: "border-violet-100",
    chip: "bg-violet-100 text-violet-700",
  },
];

const outcomes = [
  "Audit and evaluate any AI system or vendor",
  "Build production tool-using agents from scratch",
  "Design RAG systems over your own data",
  "Orchestrate multi-agent pipelines that run autonomously",
  "Deploy and monitor AI systems at scale",
  "Leave with a real shipped project in your portfolio",
];

const slideVariants = {
  enter: (d: number) => ({ x: d > 0 ? "75%" : "-75%", opacity: 0, scale: 0.9 }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (d: number) => ({ x: d > 0 ? "-75%" : "75%", opacity: 0, scale: 0.9 }),
};

function WeekCarousel() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  function go(index: number) {
    if (index === active) return;
    setDir(index > active ? 1 : -1);
    setActive(index);
  }
  function prev() { go(active === 0 ? weeks.length - 1 : active - 1); }
  function next() { go(active === weeks.length - 1 ? 0 : active + 1); }

  const w = weeks[active];
  const Icon = w.icon;
  const nextW = weeks[(active + 1) % weeks.length];
  const prevW = weeks[(active - 1 + weeks.length) % weeks.length];

  return (
    <div className="relative select-none">
      {/* Week tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {weeks.map((wk, i) => (
          <button
            key={wk.week}
            onClick={() => go(i)}
            className={`shrink-0 rounded-2xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              active === i ? "text-white shadow-lg scale-105" : "bg-white/8 text-zinc-500 hover:text-zinc-300"
            }`}
            style={active === i ? { backgroundColor: wk.color } : {}}
          >
            Wk {wk.week}
          </button>
        ))}
      </div>

      {/* Peek row: prev | main | next */}
      <div className="flex items-stretch gap-3">
        {/* LEFT PEEK */}
        <button
          onClick={prev}
          aria-label="Previous week"
          className="hidden md:flex flex-col justify-between shrink-0 w-[110px] rounded-[28px] overflow-hidden p-4 text-left transition-all hover:scale-[1.03] hover:brightness-110 active:scale-95"
          style={{ background: `linear-gradient(150deg, ${prevW.color}22 0%, #09090b 100%)`, border: `1px solid ${prevW.color}35` }}
        >
          <div className="flex-1">
            <p className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: prevW.color }}>← Wk {prevW.week}</p>
            <p className="text-[11px] font-black text-white leading-tight line-clamp-4">{prevW.title}</p>
          </div>
          <div className="mt-3 h-0.5 w-full rounded-full" style={{ backgroundColor: `${prevW.color}40` }} />
        </button>
        {/* MAIN CARD */}
        <div className="relative flex-1 overflow-hidden rounded-[36px]" style={{ minHeight: 440 }}>
          <AnimatePresence custom={dir} mode="popLayout">
            <motion.div
              key={active}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (info.offset.x < -50) next();
                else if (info.offset.x > 50) prev();
              }}
              className="absolute inset-0 rounded-[36px] overflow-hidden cursor-grab active:cursor-grabbing"
            >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-white" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${w.color}15 0%, ${w.color}03 40%, #ffffff 100%)` }} />
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-50 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            {/* Large watermark week number */}
            <div className="absolute -right-4 -bottom-8 font-syne font-black leading-none select-none pointer-events-none" style={{ fontSize: "clamp(10rem,25vw,22rem)", color: `${w.color}0d` }}>
              {String(w.week).padStart(2, "0")}
            </div>

            {/* Content */}
            <div className="relative z-10 p-8 lg:p-12 h-full flex flex-col justify-between" style={{ minHeight: 460 }}>
              <div>
                {/* Top row */}
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border" style={{ backgroundColor: `${w.color}10`, borderColor: `${w.color}20` }}>
                      <Icon className="h-7 w-7" style={{ color: w.color }} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.25em]" style={{ color: w.color }}>
                        Week {w.week} · {w.subtitle}
                      </p>
                      <h3 className="font-syne text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight leading-tight mt-1">
                        {w.title}
                      </h3>
                    </div>
                  </div>
                  {/* Milestone badge */}
                  <div className="shrink-0 hidden sm:flex items-center gap-2 rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest" style={{ borderColor: `${w.color}30`, color: w.color, backgroundColor: `${w.color}08` }}>
                    <CheckCircle2 className="h-4 w-4" />
                    {w.milestone}
                  </div>
                </div>

                {/* Description */}
                <p className="text-base sm:text-lg font-medium text-zinc-600 leading-relaxed mb-6 max-w-3xl">
                  {w.description}
                </p>

                {/* Real Use */}
                <div className="inline-flex items-start gap-4 rounded-2xl border px-6 py-4 mt-2 max-w-3xl bg-white shadow-sm" style={{ borderColor: `${w.color}20` }}>
                  <div className="mt-1 h-2.5 w-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: w.color }} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: w.color }}>
                      Real Use
                    </p>
                    <p className="text-base font-semibold text-zinc-800">{w.realUse}</p>
                  </div>
                </div>
              </div>

              {/* Mobile milestone */}
              <div
                className="sm:hidden mt-5 flex items-center gap-1.5 rounded-2xl border px-4 py-2 text-[10px] font-black uppercase tracking-widest w-fit"
                style={{ borderColor: `${w.color}30`, color: w.color, backgroundColor: `${w.color}08` }}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                {w.milestone}
              </div>
            </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT PEEK */}
        <button
          onClick={next}
          aria-label="Next week"
          className="hidden md:flex flex-col justify-between shrink-0 w-[110px] rounded-[28px] overflow-hidden p-4 text-left transition-all hover:scale-[1.03] hover:brightness-110 active:scale-95"
          style={{ background: `linear-gradient(150deg, ${nextW.color}22 0%, #09090b 100%)`, border: `1px solid ${nextW.color}35` }}
        >
          <div className="flex-1">
            <p className="text-[8px] font-black uppercase tracking-widest mb-2" style={{ color: nextW.color }}>Wk {nextW.week} →</p>
            <p className="text-[11px] font-black text-white leading-tight line-clamp-4">{nextW.title}</p>
          </div>
          <div className="mt-3 h-0.5 w-full rounded-full" style={{ backgroundColor: `${nextW.color}40` }} />
        </button>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-5">
        <div className="flex gap-2">
          {weeks.map((_, i) => (
            <button key={i} onClick={() => go(i)} className="rounded-full transition-all duration-300" style={{ width: active === i ? 28 : 8, height: 8, backgroundColor: active === i ? w.color : "rgba(255,255,255,0.15)" }} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden md:block text-[9px] font-bold uppercase tracking-widest text-zinc-600">← drag to navigate →</p>
          <div className="flex gap-2 md:hidden">
            <button onClick={prev} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/8 text-white border border-white/10 hover:bg-white/15 transition-all active:scale-95"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={next} className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-all active:scale-95" style={{ backgroundColor: w.color }}><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MasterclassPage() {
  const { data: session } = neonAuthClient.useSession();
  const heroRef = useRef(null);

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-inter)] selection:bg-[#7C5CFC]/15">
      <TopNav user={session?.user} />

      {/* ── HERO ── WHITE BG, FOCUS ON OUTCOMES & ENROLLMENT ── */}
      <section className="bg-white border-b border-zinc-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-50 via-white to-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-12 lg:pt-20 lg:pb-16" ref={heroRef}>
          <div className="max-w-4xl text-center mx-auto">
            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 shadow-sm"
            >
              <div className="h-2 w-2 rounded-full bg-[#7C5CFC] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
                The Academy — 6-Week Outcomes
              </span>
            </motion.div>

            {/* Focused headline */}
            <div className="overflow-hidden mb-6">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-syne text-5xl sm:text-6xl lg:text-7xl font-black text-zinc-900 tracking-tight leading-[1]"
              >
                Become an <span className="text-[#7C5CFC]">Applied AI Engineer.</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-lg lg:text-xl font-medium text-zinc-600 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              A 6-week rolling program. We focus purely on outcomes and building.
              Each week has one clear milestone, and something you actually ship to production. 
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex justify-center flex-wrap gap-4"
            >
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-8 py-4 text-[12px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#7C5CFC]/20 hover:bg-[#6042db] transition-all active:scale-95"
              >
                Enroll Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-zinc-200 bg-white px-8 py-4 text-[12px] font-black uppercase tracking-widest text-zinc-900 shadow-sm hover:border-zinc-300 transition-all active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-[#7C5CFC]" />
                Take Free Assessment
              </Link>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-zinc-100 max-w-5xl mx-auto"
          >
            {[
              { label: "Duration", value: "6 Weeks", icon: Clock },
              { label: "Format", value: "Live Cohort", icon: Users },
              { label: "Sessions", value: "3× / Week", icon: Zap },
              { label: "Certificate", value: "Verified", icon: Trophy },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="flex items-center gap-3 justify-center sm:justify-start"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
                  <f.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{f.label}</p>
                  <p className="text-sm font-black text-zinc-900">{f.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CURRICULUM — CAROUSEL ── */}
      <section className="bg-white border-b border-zinc-100 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6"
          >
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
                  The Curriculum
                </span>
              </div>
              <h2 className="font-syne text-4xl sm:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-[1]">
                Six weeks.
                <br />
                <span className="text-[#7C5CFC]">Six things you build.</span>
              </h2>
            </div>
            <p className="text-base font-medium text-zinc-500 max-w-xs">
              Every week ends with a real deliverable — you ship something by Friday.
            </p>
          </motion.div>

          {/* Carousel */}
          <WeekCarousel />
        </div>
      </section>

      {/* ── WHAT YOU'LL BE ABLE TO DO ── */}
      <section className="bg-zinc-50 border-y border-zinc-100 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-500">
                  Outcomes
                </span>
              </div>
              <h2 className="font-syne text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-[0.92] mb-4">
                After 6 weeks,
                <br />
                <span className="text-[#7C5CFC]">this is what you can do.</span>
              </h2>
              <p className="text-base font-medium text-zinc-500 mb-8">
                Not aspirational goals. Verified, shipped deliverables that will
                be in your portfolio by week 6.
              </p>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#7C5CFC] px-7 py-3.5 text-[11px] font-black uppercase tracking-widest text-[#7C5CFC] hover:bg-[#7C5CFC] hover:text-white transition-all active:scale-95 group"
              >
                Find Your Starting Point
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            <div className="space-y-3">
              {outcomes.map((o, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm"
                >
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7C5CFC]/10">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#7C5CFC]" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-800">{o}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OPEN PROJECTS PATHWAY ── */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[40px] border-2 border-[#7C5CFC]/20 bg-gradient-to-br from-[#7C5CFC]/5 to-blue-500/5 p-8 lg:p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,92,252,0.08),transparent_65%)] pointer-events-none" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 px-3 py-1.5">
                  <Rocket className="h-3 w-3 text-[#7C5CFC]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#7C5CFC]">
                    What happens next
                  </span>
                </div>
                <h3 className="font-syne text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight mb-3">
                  Exceptional graduates
                  <br />
                  <span className="text-[#7C5CFC]">join the build.</span>
                </h3>
                <p className="text-base font-medium text-zinc-600 leading-relaxed">
                  Top performers from each cohort are invited to join active
                  Open Projects — real products, real teams, real ownership.
                  This is where theory becomes career.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Work on live products being built in public",
                  "Become part of the core engineering team",
                  "Real-world AI experience for your CV",
                  "Invitation based on cohort performance only",
                ].map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 rounded-2xl bg-white border border-zinc-200 px-5 py-3.5 shadow-sm"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#7C5CFC] shrink-0" />
                    <span className="text-sm font-semibold text-zinc-700">{p}</span>
                  </motion.div>
                ))}
                <div className="pt-2">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#7C5CFC] px-6 py-3 text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#6042db] transition-all active:scale-95 shadow-lg shadow-[#7C5CFC]/20"
                  >
                    See Open Projects <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-zinc-950 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="font-syne text-4xl sm:text-5xl font-black text-white tracking-tight mb-3">
              Ready to start building?
            </h3>
            <p className="text-base font-medium text-zinc-400 mb-10 max-w-md mx-auto">
              Take the free assessment first — we'll tell you exactly where to
              start based on your current level.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-[11px] font-black uppercase tracking-widest text-zinc-900 shadow-xl hover:bg-zinc-100 transition-all active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-[#7C5CFC]" />
                Free Assessment
              </Link>
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white hover:border-white/40 hover:bg-white/5 transition-all active:scale-95"
              >
                Enrol — £3,000 <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-6 text-xs font-medium text-zinc-600">
              Next cohort starts May 5, 2025 · Rolling intake · 8–10 hrs/week
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
