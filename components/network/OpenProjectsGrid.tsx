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
  Hexagon,
  Calendar,
  Layers
} from "lucide-react";

import { applyToProject } from "@/app/projects/actions";

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
    tools: ["Whisper API", "ElevenLabs", "Deepgram", "Next.js", "React", "PostgreSQL", "LLMs", "Stripe", "Resend", "Redis Cache", "Azure Storage"],
    collaborators: 15,
    process: "Live weekly codebase reviews, rapid sprint cycles, and active architectural discussions in the StandexAI voice squad channel.",
    datePrimary: "Active",
    dateSubtext: "sprint phase",
    lookingFor: [
      "Engineers interested in speech models",
      "Product thinkers who see the voice opportunity",
      "Builders who want to ship",
    ],
    logo: "/standexailogo.png",
    logoWidth: "w-48 sm:w-56",
    icon: Mic,
    accentColor: "#7C5CFC",
    bgClass: "bg-violet-50",
    chipClass: "bg-violet-100 text-violet-700 border-violet-200",
    featured: true,
    isLatest: true,
  },
  {
    id: "02",
    name: "GlobalCoachAI",
    tag: "Assessments & Adaptive Learning",
    status: "Completed — Previous Cohort",
    tagline: "AI that learns how you learn.",
    description:
      "GlobalCoachAI is an intelligent assessment and learning platform that maps user study patterns, identifies knowledge gaps in real time, and adapts content delivery to how each person actually learns. Not another quiz tool — a genuine AI tutor that gets smarter the more you use it.",
    solving:
      "Generic learning platforms treat every user the same. GlobalCoachAI builds a live model of each learner — their pace, their blind spots, their optimal recall windows — and teaches to that.",
    tools: ["OpenAI Embeddings", "Vector DB (Pinecone)", "Next.js", "React", "PostgreSQL", "LLMs", "Stripe", "Resend", "Redis Cache", "Azure Storage"],
    collaborators: 9,
    process: "Iterative design testing, continuous integration for new assessment metrics, and rigorous prompt engineering cycles.",
    datePrimary: "Q1 2026",
    dateSubtext: "completed",
    lookingFor: [
      "Engineers interested in learning science + AI",
      "Anyone with experience in spaced repetition",
      "Builders who care about outcomes",
    ],
    logo: "/globalcoachlogo.png",
    logoWidth: "w-40 sm:w-48",
    icon: Brain,
    accentColor: "#7C5CFC",
    bgClass: "bg-zinc-50",
    chipClass: "bg-zinc-100 text-zinc-700 border-zinc-200",
    featured: false,
    isLatest: false,
    website: "https://globalcoachai.com",
  },
  {
    id: "03",
    name: "Rekruuter",
    tag: "Recruitment & Interview AI",
    status: "Completed — Previous Cohort",
    tagline: "The AI layer recruiters actually needed.",
    description:
      "Rekruuter puts AI inside the recruitment workflow — from JD analysis and candidate screening to live interview assistance and structured scoring. Built for recruiters who want leverage, not replacement. Fast, fair, and auditable at every step.",
    solving:
      "Recruitment is slow, inconsistent, and bias-prone. Rekruuter gives recruiters an AI co-pilot that surfaces signal, reduces noise, and makes every decision more defensible.",
    tools: ["Semantic Search", "Next.js", "React", "PostgreSQL", "LLMs", "Stripe", "Resend", "Redis Cache", "Azure Storage"],
    collaborators: 12,
    process: "Cross-functional building with HR advisors, robust data modeling for bias reduction, and staging deploys.",
    datePrimary: "Q4 2025",
    dateSubtext: "completed",
    lookingFor: [
      "Engineers interested in NLP",
      "Anyone who's worked in HR tech",
      "Builders who care about fairness",
    ],
    logo: "/Rekruuter.png",
    logoWidth: "w-36 sm:w-44",
    icon: Users,
    accentColor: "#7C5CFC",
    bgClass: "bg-zinc-50",
    chipClass: "bg-zinc-100 text-zinc-700 border-zinc-200",
    featured: false,
    isLatest: false,
    website: "https://rekruuter.com",
  },
  {
    id: "04",
    name: "AccurateCV",
    tag: "Career & CV Intelligence",
    status: "Completed — Previous Cohort",
    tagline: "Your CV, adapted for every opportunity.",
    description:
      "AccurateCV is an AI CV agent that reads a job description, understands what the employer is actually looking for, and rewrites and repositions your CV to match — without fabricating anything. It also tracks application patterns, learns what works, and gets sharper with every role you apply for.",
    solving:
      "Most people send the same CV everywhere and wonder why they don't hear back. AccurateCV treats your CV as a living document — one that adapts, improves, and advocates for you intelligently with every application.",
    tools: ["PDF Generation", "Edge Functions", "Next.js", "React", "PostgreSQL", "LLMs", "Stripe", "Resend", "Redis Cache", "Azure Storage"],
    collaborators: 8,
    process: "System integration testing for variable PDF parsers and asynchronous webhook processing systems.",
    datePrimary: "Q3 2025",
    dateSubtext: "completed",
    lookingFor: [
      "Engineers interested in document intelligence",
      "Experience in job market data",
      "Builders analyzing impact data",
    ],
    logo: "/ACCURATECV.png",
    logoWidth: "w-40 sm:w-48",
    icon: FileText,
    accentColor: "#7C5CFC",
    bgClass: "bg-zinc-50",
    chipClass: "bg-zinc-100 text-zinc-700 border-zinc-200",
    featured: false,
    isLatest: false,
    website: "https://accuratecv.com",
  },
];

function ProjectSection({ project, user, appliedProjects }: { project: any, user: any, appliedProjects: string[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [isApplying, setIsApplying] = React.useState(false);
  const [isApplied, setIsApplied] = React.useState(() => appliedProjects.includes(project.name));

  const handleApply = async (e: React.MouseEvent) => {
    if (!user) return;
    e.preventDefault();
    if (isApplied || isApplying) return;
    
    setIsApplying(true);
    const result = await applyToProject(project.name);
    setIsApplying(false);
    
    if (result && result.success) {
      setIsApplied(true);
    }
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group w-full relative rounded-[32px] md:rounded-[40px] border border-zinc-200 bg-white shadow-sm overflow-hidden hover:border-[#7C5CFC]/30 hover:shadow-2xl hover:shadow-[#7C5CFC]/[0.08] transition-all duration-500"
    >
      <div className="flex flex-col lg:flex-row">
        
        {/* LEFT COLUMN: IDENTIFICATION & DESCRIPTION */}
        <div className="lg:w-[60%] p-8 sm:p-12 xl:p-16 border-b lg:border-b-0 lg:border-r border-zinc-100 flex flex-col justify-between">
          <div>
            {/* Branding - Bold and Open Logo */}
            <a 
              href={project.website || "#"} 
              target={project.website ? "_blank" : "_self"}
              rel={project.website ? "noreferrer" : ""}
              className={`mb-6 block relative flex items-center justify-start ${project.logoWidth} hover:opacity-80 transition-opacity`}
            >
               <Image 
                 src={project.logo} 
                 alt={project.name} 
                 width={400}
                 height={120}
                 className="w-full h-auto object-contain origin-left" 
                 unoptimized 
               />
            </a>
            
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                {project.tag}
              </span>
              <div className="h-4 w-px bg-zinc-200" />
              <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${project.chipClass}`}>
                <div className={`h-1.5 w-1.5 rounded-full ${project.isLatest ? "animate-pulse" : ""}`} style={{ backgroundColor: project.accentColor }} />
                {project.status}
              </div>
            </div>
            
            <p className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight mb-6">
              "{project.tagline}"
            </p>

            <div className="space-y-6">
              <div>
                <p className="text-sm md:text-[15px] font-medium text-zinc-600 leading-relaxed max-w-2xl">
                  {project.description}
                </p>
              </div>
              <div>
                <p className="text-[13px] font-medium text-zinc-500 leading-relaxed max-w-2xl bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <strong className="text-zinc-700">The Problem: </strong>{project.solving}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* RIGHT COLUMN: TECHNICAL METADATA & ACTIONS */}
        <div className="lg:w-[40%] bg-zinc-50/50 p-8 sm:p-12 xl:p-16 flex flex-col justify-between">
          <div>
            {/* Tech Stack */}
            <div className="mb-10">
              <h4 className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">
                 <Layers className="h-3.5 w-3.5" /> Tech Stack Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((t: string) => (
                  <span key={t} className="px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white shadow-sm text-[11px] font-bold text-zinc-700 hover:border-zinc-300 transition-colors">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Meta Data: Collaborators & Dates */}
            <div className="grid grid-cols-2 gap-8 mb-10">
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                   <Users className="h-3.5 w-3.5" /> Collaborators
                </h4>
                <p className="text-3xl md:text-4xl font-black text-zinc-900 leading-none flex items-baseline">
                  {project.collaborators}<span className="text-lg text-zinc-400 font-bold ml-1.5 leading-none">{project.isLatest ? "expected devs" : "devs"}</span>
                </p>
              </div>
              <div>
                <h4 className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2">
                   <Calendar className="h-3.5 w-3.5" /> Timeline
                </h4>
                <p className="text-2xl md:text-3xl font-black text-zinc-900 leading-none flex items-baseline">
                  {project.datePrimary}<span className="text-sm font-bold text-zinc-400 ml-1.5 leading-none">{project.dateSubtext}</span>
                </p>
              </div>
            </div>

            {/* Process */}
            <div className="mb-12">
              <h4 className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
                 <Hexagon className="h-3.5 w-3.5" /> Operating Process
              </h4>
              <p className="text-[13px] font-medium text-zinc-600 leading-relaxed">
                {project.process}
              </p>
            </div>
          </div>

          {/* Action Area */}
          {project.isLatest && (
            <div className="pt-8 border-t border-zinc-200/60 mt-auto">
              {isApplied ? (
                <div className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-100 p-5 text-[11px] font-black uppercase tracking-widest text-zinc-500 border border-zinc-200/80">
                  <CheckCircle2 className="h-4 w-4" /> Applied to Squad
                </div>
              ) : (
                <Link
                  href={user ? "#" : "/auth/sign-in"}
                  onClick={handleApply}
                  className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7C5CFC] p-5 text-[11px] font-black uppercase tracking-widest text-white transition-all shadow-[0_8px_30px_rgba(124,92,252,0.3)] hover:scale-[1.02] hover:bg-[#6841fb] active:scale-95"
                >
                  {isApplying ? "Authenticating..." : "Apply to Join Squad"}
                  {!isApplying && <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function OpenProjectsGrid({ user, appliedProjects = [] }: OpenProjectsGridProps) {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  
  const latestProjects = projects.filter(p => p.isLatest);
  const previousProjects = projects.filter(p => !p.isLatest);

  return (
    <main className="bg-[#FAFAF9] min-h-screen pb-20">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative overflow-hidden bg-white border-b border-zinc-200 pt-4 pb-2 lg:pt-6 lg:pb-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 px-4 py-2"
            >
              <div className="h-2 w-2 rounded-full bg-[#7C5CFC] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#7C5CFC]">
                Arm 02 — Elite Project Squads
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-7xl font-black text-zinc-900 tracking-tighter leading-[0.85] uppercase italic whitespace-nowrap"
            >
              Open{" "}
              <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#7C5CFC,#A892FF)]">Projects.</span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg font-medium text-zinc-500 max-w-sm leading-relaxed mb-2"
          >
            StandexAI runs open product squads. Pick a project, contribute, and
            ship real AI products built on state-of-the-art enterprise stacks.
          </motion.p>
        </div>
      </section>

      {/* ── LATEST PROJECTS ── */}
      <section className="pt-6 pb-12 lg:pt-8 lg:pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6 lg:mb-8">
            <h2 className="text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-[#7C5CFC]">
              Latest Active Squads
            </h2>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>
          <div className="flex flex-col gap-16">
            {latestProjects.map(p => (
              <ProjectSection key={p.id} project={p} user={user} appliedProjects={appliedProjects} />
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIOUS PROJECTS ── */}
      <section className="py-12 lg:py-20 px-4 sm:px-6 bg-zinc-100 border-t border-zinc-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-12 lg:mb-16">
            <h2 className="text-[11px] md:text-xs font-black uppercase tracking-[0.3em] text-zinc-400">
              Previous Cohort Deployments
            </h2>
            <div className="h-px flex-1 bg-zinc-300" />
          </div>
          <div className="flex flex-col gap-16">
            {previousProjects.map(p => (
              <ProjectSection key={p.id} project={p} user={user} appliedProjects={appliedProjects} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
