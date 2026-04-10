"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Mic,
  Brain,
  Users,
  FileText,
  Rocket,
  ChevronRight,
} from "lucide-react";

import { applyToProject } from "@/app/projects/actions";
import { useRouter } from "next/navigation";

interface OpenProjectsGridProps {
  user: any;
  appliedProjects?: string[];
}

const projects = [
  {
    id: "01",
    name: "StandexAI Voice",
    tag: "Speech & Audio AI",
    status: "Active — accepting contributors",
    tagline: "The speech intelligence layer for applied AI systems.",
    description:
      "We're building the voice and speech model infrastructure that most AI products are missing. Real-time transcription, speaker diarisation, voice-commanded agents, and audio-grounded reasoning. If you've ever wanted to work at the intersection of LLMs and audio — this is it.",
    solving:
      "Most AI apps are text-in, text-out. Voice changes everything — lower friction, richer context, broader access. We're building the primitives that make voice-first AI products possible.",
    lookingFor: [
      "Engineers interested in speech models (Whisper, ElevenLabs, Deepgram)",
      "Product thinkers who see the voice opportunity",
      "Builders who want to ship, not just learn",
    ],
    logo: "/standexailogo.png",
    icon: Mic,
    accentColor: "#3B82F6",
    bgClass: "bg-blue-50",
    chipClass: "bg-blue-100 text-blue-700 border-blue-200",
    featured: true,
  },
  {
    id: "02",
    name: "GlobalCoachAI",
    tag: "Assessments & Adaptive Learning",
    status: "Active — accepting contributors",
    tagline: "AI that learns how you learn.",
    description:
      "GlobalCoachAI is an intelligent assessment and learning platform that maps user study patterns, identifies knowledge gaps in real time, and adapts content delivery to how each person actually learns. Not another quiz tool — a genuine AI tutor that gets smarter the more you use it.",
    solving:
      "Generic learning platforms treat every user the same. GlobalCoachAI builds a live model of each learner — their pace, their blind spots, their optimal recall windows — and teaches to that.",
    lookingFor: [
      "Engineers interested in learning science + AI",
      "Anyone with experience in spaced repetition, knowledge graphs, or edtech",
      "Builders who care about outcomes, not just engagement metrics",
    ],
    logo: "/images/globalcoachai-logo.png",
    icon: Brain,
    accentColor: "#7C5CFC",
    bgClass: "bg-violet-50",
    chipClass: "bg-violet-100 text-violet-700 border-violet-200",
    featured: false,
  },
  {
    id: "03",
    name: "Rekruuter",
    tag: "Recruitment & Interview AI",
    status: "Active — accepting contributors",
    tagline: "The AI layer recruiters actually needed.",
    description:
      "Rekruuter puts AI inside the recruitment workflow — from JD analysis and candidate screening to live interview assistance and structured scoring. Built for recruiters who want leverage, not replacement. Fast, fair, and auditable at every step.",
    solving:
      "Recruitment is slow, inconsistent, and bias-prone. Rekruuter gives recruiters an AI co-pilot that surfaces signal, reduces noise, and makes every decision more defensible.",
    lookingFor: [
      "Engineers interested in NLP, ranking, and structured data extraction",
      "Anyone who's worked in HR tech or understands recruiter workflows",
      "Builders who care about fairness and auditability in AI systems",
    ],
    logo: "/images/rekruuter-logo.png",
    icon: Users,
    accentColor: "#4338CA",
    bgClass: "bg-indigo-50",
    chipClass: "bg-indigo-100 text-indigo-700 border-indigo-200",
    featured: false,
  },
  {
    id: "04",
    name: "AccurateCV",
    tag: "Career & CV Intelligence",
    status: "Active — accepting contributors",
    tagline: "Your CV, adapted for every opportunity.",
    description:
      "AccurateCV is an AI CV agent that reads a job description, understands what the employer is actually looking for, and rewrites and repositions your CV to match — without fabricating anything. It also tracks application patterns, learns what works, and gets sharper with every role you apply for.",
    solving:
      "Most people send the same CV everywhere and wonder why they don't hear back. AccurateCV treats your CV as a living document — one that adapts, improves, and advocates for you intelligently with every application.",
    lookingFor: [
      "Engineers interested in document intelligence and personalisation",
      "Anyone with experience in job market data or career platforms",
      "Builders who want to work on something with immediate, personal impact",
    ],
    logo: "/images/accuratecv-logo.png",
    icon: FileText,
    accentColor: "#0369A1",
    bgClass: "bg-sky-50",
    chipClass: "bg-sky-100 text-sky-700 border-sky-200",
    featured: false,
  },
];

function ProjectCard({ project, user, appliedProjects }: { project: any, user: any, appliedProjects: string[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = project.icon;
  const router = useRouter();
  const [isApplying, setIsApplying] = React.useState(false);
  const [isApplied, setIsApplied] = React.useState(() => appliedProjects.includes(project.name));

  const handleApply = async (e: React.MouseEvent) => {
    if (!user) {
      // Let it normally navigate to sign-in
      return;
    }
    e.preventDefault(); // Prevent navigation since we have a user
    if (isApplied || isApplying) return;
    
    setIsApplying(true);
    const result = await applyToProject(project.name);
    setIsApplying(false);
    
    if (result && result.success) {
      setIsApplied(true);
    } else if (result?.error) {
      console.error(result.error);
    }
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-[32px] border border-zinc-200 bg-white overflow-hidden hover:border-zinc-300 hover:shadow-2xl hover:shadow-zinc-100 transition-all duration-500"
    >
      {/* Accent glow */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl pointer-events-none"
        style={{ backgroundColor: `${project.accentColor}10` }}
      />

      <div className="relative z-10 p-7 lg:p-8">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Logo / Icon */}
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${project.bgClass}`}
            >
              <Icon className="h-5 w-5" style={{ color: project.accentColor }} />
            </div>
            <div>
              <h3 className="font-syne text-xl font-black text-zinc-900 tracking-tight">
                {project.name}
              </h3>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: project.accentColor }}>
                {project.tag}
              </p>
            </div>
          </div>
          {/* Project number */}
          <span className="shrink-0 font-syne text-4xl font-black text-zinc-100 leading-none select-none">
            {project.id}
          </span>
        </div>

        {/* Status chip */}
        <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest mb-4 ${project.chipClass}`}>
          <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: project.accentColor }} />
          {project.status}
        </div>

        {/* Tagline */}
        <p className="font-syne text-base font-black text-zinc-900 tracking-tight mb-3">
          "{project.tagline}"
        </p>

        {/* Description */}
        <p className="text-[13px] font-medium text-zinc-500 leading-relaxed mb-5">
          {project.description}
        </p>

        {/* What we're solving */}
        <div className={`rounded-2xl border p-4 mb-5 ${project.bgClass} border-transparent`}>
          <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: project.accentColor }}>
            What we're solving
          </p>
          <p className="text-xs font-semibold text-zinc-700 leading-relaxed">{project.solving}</p>
        </div>

        {/* Looking for */}
        <div className="mb-6">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">
            Looking for
          </p>
          <ul className="space-y-2">
            {project.lookingFor.map((item: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: project.accentColor }} />
                <span className="text-[12px] font-semibold text-zinc-600">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        {isApplied ? (
          <div className="inline-flex items-center gap-2 rounded-2xl border-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-zinc-100 text-zinc-500 border-zinc-200 cursor-default select-none">
            <CheckCircle2 className="h-3.5 w-3.5" /> Applied
          </div>
        ) : (
          <Link
            href={user ? "#" : "/auth/sign-in"}
            onClick={handleApply}
            className={`inline-flex items-center gap-2 rounded-2xl border-2 px-5 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${isApplying ? "opacity-50 cursor-not-allowed" : "active:scale-95 hover:text-white"} group/btn`}
            style={{ borderColor: project.accentColor, color: project.accentColor }}
            onMouseEnter={(e) => {
              if (isApplying) return;
              (e.currentTarget as HTMLElement).style.backgroundColor = project.accentColor;
              (e.currentTarget as HTMLElement).style.color = "white";
            }}
            onMouseLeave={(e) => {
              if (isApplying) return;
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = project.accentColor;
            }}
          >
            {isApplying ? "Applying..." : "Apply to Join"} 
            {!isApplying && <ArrowRight className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 transition-transform" />}
          </Link>
        )}
      </div>
    </motion.article>
  );
}

export function OpenProjectsGrid({ user, appliedProjects = [] }: OpenProjectsGridProps) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-60px" });

  return (
    <main>
      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-white border-b border-zinc-100"
      >
        {/* Drifting grid */}
        <div aria-hidden className="pointer-events-none animate-grid-drift" style={{ position: "absolute", inset: -80, zIndex: 0, backgroundImage: "linear-gradient(to right, rgba(124,92,252,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,92,252,0.055) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        {/* Diagonal hatch */}
        <div aria-hidden className="pointer-events-none animate-hatch-slide" style={{ position: "absolute", inset: -60, zIndex: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(124,92,252,0.022) 0px, rgba(124,92,252,0.022) 1px, transparent 1px, transparent 30px)" }} />
        {/* Radial glow */}
        <div aria-hidden className="pointer-events-none animate-radial-breathe" style={{ position: "absolute", top: "-10%", left: "50%", width: 900, height: 700, borderRadius: "50%", background: "radial-gradient(ellipse at center, rgba(124,92,252,0.07) 0%, transparent 65%)", zIndex: 0 }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/25 bg-[#7C5CFC]/8 px-4 py-2"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7C5CFC]">
              Arm 02 — Open Projects
            </span>
          </motion.div>

          {/* Headline */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: "100%" }}
              animate={heroInView ? { y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-syne text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black text-zinc-900 tracking-tight leading-[0.88]"
            >
              Open Projects.
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.span
              initial={{ y: "100%" }}
              animate={heroInView ? { y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="block font-syne text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black text-[#7C5CFC] tracking-tight leading-[0.88]"
            >
              Join the Build.
            </motion.span>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.35 }}
            className="text-lg font-medium text-zinc-500 mb-10 max-w-xl leading-relaxed"
          >
            StandexAI runs open product squads. Pick a project, contribute, and
            ship real AI products alongside the cohort.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45 }}
            className="flex flex-wrap gap-4"
          >
            {[
              { v: "4", l: "Active Projects" },
              { v: "100%", l: "Built in Open" },
              { v: "Real", l: "Users & Problems" },
              { v: "Invite", l: "Performance-based" },
            ].map((s, i) => (
              <div key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-3">
                <p className="font-syne text-xl font-black text-zinc-900">{s.v}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROJECT GRID ── */}
      <section className="bg-zinc-50 border-b border-zinc-100 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} user={user} appliedProjects={appliedProjects} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BLOCK ── */}
      <section ref={ctaRef} className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[40px] border-2 border-zinc-900 bg-zinc-950 p-8 lg:p-14 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,92,252,0.15),transparent_65%)] pointer-events-none" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#7C5CFC]/15 border border-[#7C5CFC]/25 px-3 py-1.5">
                  <Rocket className="h-3 w-3 text-[#7C5CFC]" />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#7C5CFC]">
                    Apply Now
                  </span>
                </div>
                <h2 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[0.92] mb-4">
                  Ready to build
                  <br />
                  <span className="text-[#7C5CFC]">something real?</span>
                </h2>
                <p className="text-base font-medium text-zinc-400 leading-relaxed mb-2">
                  These aren't side projects. They're products in active development
                  with real users, real problems, and real stakes. Join a squad,
                  contribute to the build, and ship AI that matters.
                </p>
                <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
                  Open to Academy cohort members · Built in the open with StandexAI infrastructure.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/sign-in"
                  className="flex items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-[11px] font-black uppercase tracking-widest text-zinc-900 shadow-xl hover:bg-zinc-100 transition-all active:scale-95"
                >
                  Apply to Join a Project Squad
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/learn"
                  className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 px-8 py-4 text-[11px] font-black uppercase tracking-widest text-white hover:border-white/30 hover:bg-white/5 transition-all"
                >
                  Complete Learn First
                </Link>

                {/* Project logo strip */}
                <div className="mt-3 flex items-center gap-4 flex-wrap">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Active projects:</p>
                  {["StandexAI Voice", "GlobalCoachAI", "Rekruuter", "AccurateCV"].map((name, i) => (
                    <span key={i} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-zinc-300">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
