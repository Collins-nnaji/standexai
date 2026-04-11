"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { ArrowRight, Sparkles, GraduationCap, ChevronLeft, ChevronRight } from "lucide-react";
import { COURSE_TOOLS } from "@/data/courseTools";

const floatingNodes = [
  { top: "15%", left: "20%", size: 4, delay: 0, moveX: 30, moveY: -40 },
  { top: "25%", left: "75%", size: 6, delay: 2, moveX: -20, moveY: 50 },
  { top: "60%", left: "10%", size: 3, delay: 5, moveX: 40, moveY: 20 },
  { top: "80%", left: "80%", size: 5, delay: 1, moveX: -30, moveY: -30 },
  { top: "40%", left: "40%", size: 8, delay: 3, moveX: 20, moveY: -20 },
  { top: "10%", left: "60%", size: 4, delay: 6, moveX: -40, moveY: -10 },
  { top: "70%", left: "30%", size: 5, delay: 4, moveX: 30, moveY: 30 },
  { top: "90%", left: "55%", size: 3, delay: 2, moveX: -20, moveY: -40 },
  { top: "50%", left: "85%", size: 6, delay: 5, moveX: 10, moveY: 40 },
  { top: "30%", left: "5%", size: 4, delay: 1, moveX: 40, moveY: -20 },
  { top: "5%", left: "90%", size: 3, delay: 4, moveX: -30, moveY: 20 },
  { top: "95%", left: "15%", size: 5, delay: 0, moveX: 20, moveY: -30 },
];

function AIBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-70">
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
      
      {/* Infinite scrolling grid mesh */}
      <div 
        className="absolute w-[150%] h-[150%] top-0 left-0 bg-[linear-gradient(to_right,rgba(124,92,252,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,92,252,0.06)_1px,transparent_1px)] bg-[size:60px_60px]"
        style={{ animation: "hero-panning 40s linear infinite" }}
      />

      {/* AI Scanner Line */}
      <div 
        className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#7C5CFC]/30 to-transparent shadow-[0_0_15px_rgba(124,92,252,0.4)]"
        style={{ animation: "hero-scanner 8s ease-in-out infinite" }}
      />
      
      {/* Floating Data Nodes */}
      {floatingNodes.map((node, i) => (
        <motion.div
           key={i}
           className="absolute rounded-full bg-[#7C5CFC] shadow-[0_0_12px_2px_rgba(124,92,252,0.4)] blur-[0.5px]"
           style={{ top: node.top, left: node.left, width: node.size, height: node.size }}
           animate={{
             y: [0, node.moveY, 0],
             x: [0, node.moveX, 0],
             opacity: [0.1, 0.7, 0.1],
           }}
           transition={{
             duration: 15 + (i % 5)*3,
             repeat: Infinity,
             delay: node.delay,
             ease: "easeInOut"
           }}
        />
      ))}
    </div>
  );
}



const stats = [
  { value: "6", unit: "wk", label: "Cohort" },
  { value: "2×", unit: "/wk", label: "Live Sessions" },
  { value: "1", unit: "", label: "Build / Week" },
  { value: "∞", unit: "", label: "Rolling Start" },
];

const weeks = [
  { week: 1, title: "System thinking + product scope", milestone: "Audit a real AI integration", color: "#3B82F6", description: "Learn to architect AI solutions by defining robust system boundaries, mapping data pipelines, and evaluating LLM capabilities against product goals." },
  { week: 2, title: "Ship your first AI feature", milestone: "Working agent inside an app", color: "#7C5CFC", highlight: true, description: "Build an end-to-end intelligent feature. You'll work with core APIs to craft an agent that understands context and acts within a real codebase." },
  { week: 3, title: "Give your product memory", milestone: "RAG assistant over your data", color: "#10B981", description: "Implement Retrieval-Augmented Generation (RAG). You'll set up vector stores, chunk data, and build embeddings to give your AI persistent memory." },
  { week: 4, title: "Chain agents together", milestone: "Multi-agent pipeline running", color: "#F59E0B", description: "Scale beyond single prompts by chaining multiple specialized sub-agents together. Learn orchestration, routing, and creating complex workflows." },
  { week: 5, title: "Production hardening", milestone: "Eval + monitoring in place", color: "#EC4899", description: "Move from prototype to production. Implement strict evaluations, prompt monitoring, guardrails, and latency optimization techniques." },
  { week: 6, title: "Capstone ship", milestone: "Production release + certificate", color: "#7C5CFC", description: "Finalize your capstone project and deploy it live. Stand perfectly positioned to earn contributor status on Open Projects." },
];

const details = [
  { label: "Format", value: "Live Cohort", sub: "2 sessions / week" },
  { label: "Commitment", value: "8–10 hrs", sub: "Per week" },
  { label: "Certificate", value: "Verified", sub: "On completion" },
  { label: "Next Cohort", value: "May 5", sub: "Rolling intake" },
];

const stackContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.04, delayChildren: 0.12 },
  },
};

const stackItem = (reduceMotion: boolean) => ({
  hidden: { opacity: 0, x: reduceMotion ? 0 : 14, filter: reduceMotion ? "blur(0px)" : "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
});

function HeroStackPanel() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="hidden w-full max-w-[min(100%,280px)] shrink-0 lg:block xl:max-w-[300px]">
      <p className="mb-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500">
        Stack you&apos;ll use
      </p>
      <div className="hero-stack-panel relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-5">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40 hero-stack-panel-sheen"
        />
        <motion.ul
          variants={stackContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="relative grid grid-cols-1 gap-x-3 gap-y-2.5 sm:grid-cols-2 sm:gap-y-2"
        >
          {COURSE_TOOLS.map((tool) => (
            <motion.li
              key={tool.id}
              variants={stackItem(!!reduceMotion)}
              className="hero-stack-name text-left text-[13px] font-black tracking-tight text-zinc-100 xl:text-sm"
            >
              {tool.name}
            </motion.li>
          ))}
        </motion.ul>
      </div>
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
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 180, damping: 18, mass: 0.35 });

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={(event) => {
        const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
        const dx = event.clientX - rect.left - rect.width / 2;
        const dy = event.clientY - rect.top - rect.height / 2;
        x.set(dx * 0.18);
        y.set(dy * 0.18);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      className="inline-flex"
    >
      <Link href={href} className={className}>
        {children}
        <span
          aria-hidden
          className="landing-gloss-sweep opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </Link>
    </motion.div>
  );
}

function WeekCarousel() {
  const [index, setIndex] = useState(0);

  // Timer resets whenever index changes
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % weeks.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [index]);

  const handleNext = () => setIndex((c) => (c + 1) % weeks.length);
  const handlePrev = () => setIndex((c) => (c - 1 + weeks.length) % weeks.length);

  const week = weeks[index];

  return (
    <>
      <div className="flex-1 w-full relative flex items-center justify-center pt-6 pb-2 min-h-[220px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
            style={{ transformOrigin: "bottom" }}
            className="absolute inset-0 flex flex-col justify-center border-l-[3px] border-[#7C5CFC]/40 pl-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight text-white leading-none">
                {String(week.week).padStart(2, "0")}
              </span>
              <span className="text-[12px] font-black uppercase tracking-[0.14em] text-[#7C5CFC]">
                Week {week.week}
              </span>
            </div>
            <p className="mt-2 text-xl font-black leading-snug tracking-tight text-zinc-100 mb-3 max-w-sm">
              {week.title}
            </p>
            <p className="text-[13px] sm:text-sm font-medium leading-relaxed text-zinc-400 max-w-sm">
              {week.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination & Controls */}
      <div className="pt-5 mt-auto border-t border-white/10 z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
            Weekly Syllabus
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors"
              aria-label="Previous week"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors"
              aria-label="Next week"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Clickable Progress Dots */}
        <div className="flex items-center gap-1.5 justify-between">
          {weeks.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 transition-all duration-300 rounded-full flex-1 ${
                index === i 
                  ? "bg-[#7C5CFC] shadow-[0_0_8px_rgba(124,92,252,0.6)]" 
                  : "bg-white/10 hover:bg-white/20"
              }`}
              aria-label={`Go to week ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export function LandingHero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const glowY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden bg-white border-b border-zinc-100 min-h-[calc(100dvh-4rem)] antialiased"
    >

      <AIBackground />

      {/* ── Background decoration matching the image ── */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brick-wall.png')] opacity-[0.05]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#7C5CFC]/5 via-transparent to-transparent" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(124,92,252,0.1)_0%,transparent_50%)]" />
      {/* Radial glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none animate-radial-breathe landing-soft-pulse"
        style={{
          position: "absolute",
          top: "-10%",
          left: "50%",
          width: 900,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(124,92,252,0.08) 0%, transparent 65%)",
          zIndex: 0,
          y: glowY,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-10 lg:pt-8 lg:pb-16 flex min-h-[calc(100dvh-4rem)] flex-col lg:flex-row items-center lg:items-center gap-12 lg:gap-8 xl:gap-16">
        
        {/* LEFT COLUMN: HERO TEXT */}
        <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">
          <div className="flex w-full flex-col items-center lg:items-start max-w-2xl xl:max-w-3xl">
            <div className="mb-4 space-y-1">
              {["Build production", "AI systems."].map((line, li) => (
                <div key={li} className="overflow-hidden">
                  <motion.h1
                    initial={{ y: "100%", opacity: 0 }}
                    animate={inView ? { y: 0, opacity: 1 } : {}}
                    transition={{ delay: 0.1 + li * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="block tracking-[-0.045em] leading-[0.92] font-black text-[clamp(3rem,6.5vw,5.5rem)] lg:text-[clamp(3.5rem,7vw,6.5rem)] text-transparent bg-clip-text bg-[linear-gradient(to_right,#7C5CFC,#000000)]"
                  >
                    {line}
                  </motion.h1>
                </div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 }}
              className="text-base sm:text-lg lg:text-xl font-medium text-zinc-600 mb-8 max-w-xl leading-relaxed tracking-tight"
            >
              A 6‑week applied cohort that ships weekly. Learn by building real
              AI products with live mentorship and production‑grade standards.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8"
            >
              <MagneticLink
                href="/learn"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#7C5CFC] to-[#A892FF] px-8 py-4 text-[13px] font-black uppercase tracking-widest text-white shadow-[0_0_40px_-10px_rgba(124,92,252,0.8)] hover:shadow-[0_0_60px_-15px_rgba(124,92,252,1)] transition-all active:scale-95"
              >
                <GraduationCap className="h-5 w-5" />
                Learn
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </MagneticLink>
              <MagneticLink
                href="/assessment"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#7C5CFC]/30 px-8 py-4 text-[13px] font-black uppercase tracking-widest text-[#7C5CFC] hover:border-[#7C5CFC] hover:bg-[#7C5CFC]/5 transition-all active:scale-95 bg-white backdrop-blur-sm"
              >
                <Sparkles className="h-5 w-5" />
                Free Assessment
              </MagneticLink>
            </motion.div>
          </div>

          {/* Stats inside left column */}
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-white/10 mt-12 w-full max-w-2xl pt-4">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.07 }}
                className="border-r last:border-r-0 border-zinc-200 px-0 py-3 sm:px-5 first:pl-0"
              >
                <p className="text-xl lg:text-2xl font-black text-zinc-900 tracking-tight">
                  {s.value}<span className="text-[#7C5CFC]">{s.unit}</span>
                </p>
                <p className="mt-0.5 text-[10px] lg:text-[11px] font-bold uppercase tracking-widest text-zinc-500">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: CAROUSEL CARD */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-md shrink-0 flex flex-col justify-center"
        >
          <div className="relative rounded-[24px] border border-[#7C5CFC]/20 bg-[#13062C] p-6 lg:p-8 shadow-[0_24px_64px_rgba(124,92,252,0.25)] overflow-hidden backdrop-blur-xl group h-[500px] lg:h-[550px] flex flex-col">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="landing-gloss-sweep landing-gloss-sweep--dark" />
            </div>
            
            {/* Top: intake header */}
            <div className="border-b border-white/10 pb-6 mb-2 shrink-0 z-10 flex flex-col gap-3 relative">
              <div className="flex flex-col gap-1 items-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(124,92,252,0.4)] bg-[#7C5CFC]/10 px-3 py-1.5 backdrop-blur-md mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#A892FF] shadow-[0_0_8px_2px_rgba(124,92,252,0.8)] animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-[0.18em] text-[#A892FF]">
                  Quarter 2 Intake
                  </span>
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-400">
                  Starts May 5th
                </p>
                <p className="text-2xl lg:text-3xl font-black tracking-tight text-white leading-none">
                  Build Production AI
                </p>
              </div>
            </div>
            
            {/* Flipping Carousel & Controls inside */}
            <WeekCarousel />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
