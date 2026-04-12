"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { ArrowRight, Sparkles, GraduationCap, ChevronLeft, ChevronRight, Bot, Cpu, Database, Layers, Zap, Code, Terminal, CpuIcon, Brain } from "lucide-react";
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

const floatingIcons = [
  { Icon: Bot, top: "20%", left: "15%", size: 32, delay: 0, duration: 25 },
  { Icon: Cpu, top: "45%", left: "85%", size: 40, delay: 5, duration: 30 },
  { Icon: Database, top: "75%", left: "10%", size: 28, delay: 2, duration: 35 },
  { Icon: Layers, top: "15%", left: "75%", size: 36, delay: 7, duration: 28 },
  { Icon: Zap, top: "85%", left: "80%", size: 30, delay: 3, duration: 22 },
  { Icon: Code, top: "60%", left: "40%", size: 34, delay: 10, duration: 40 },
  { Icon: Brain, top: "30%", left: "60%", size: 38, delay: 1, duration: 32 },
  { Icon: Terminal, top: "10%", left: "30%", size: 24, delay: 6, duration: 25 },
];


function AIBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-70">
      <style dangerouslySetInnerHTML={{
        __html: `
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
            duration: 15 + (i % 5) * 3,
            repeat: Infinity,
            delay: node.delay,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Floating AI Icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute text-[#7C5CFC] opacity-30"
          style={{ top: item.top, left: item.left }}
          animate={{
            y: [0, -40, 0],
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: "linear"
          }}
        >
          <item.Icon size={item.size} strokeWidth={1.5} />
        </motion.div>
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

const milestones = [
  { id: "01", title: "Cloud architecture", milestone: "Full-stack Foundations", color: "#FACC15", description: "Master the cloud primitives and state management required for high-frequency AI applications." },
  { id: "02", title: "API production", milestone: "Scalable API Design", color: "#60A5FA", description: "Design and deploy production-ready API layers and middleware for LLM orchestration." },
  { id: "03", title: "RAG optimization", milestone: "Vector DB & Search", color: "#34D399", description: "Build and tune Retrieval-Augmented Generation systems with advanced vector search." },
  { id: "04", title: "Agentic flows", milestone: "Swarm & Multi-Agent", color: "#7C5CFC", description: "Implement hierarchical and decentralized agent routing using Swarm and LangGraph." },
  { id: "05", title: "Function calling", milestone: "Tool-Use & Action", color: "#FB7185", description: "Give your agents real-world leverage through advanced function calling and local tool-use." },
  { id: "06", title: "Observability", milestone: "LangSmith & Monitoring", color: "#F472B6", description: "Integrate production-grade monitoring, evaluation, and tracing for AI reliability at scale." },
  { id: "07", title: "Evaluations", milestone: "Evals & Fine-tuning", color: "#A78BFA", description: "Quantitative testing and optimization of LLM responses using domain-specific evals." },
  { id: "08", title: "Infrastructure", milestone: "Deployment & CI/CD", color: "#FB923C", description: "Automated deployment pipelines for AI agents with continuous performance measurement." },
  { id: "09", title: "Capstone ship", milestone: "Professional Release", color: "#7C5CFC", description: "Finalize and launch a production-ready AI product to the Standex Open Projects gallery." },
];

const toolLogos = [
  { name: "Next.js", src: "/images/nextjslogo.png" },
  { name: "OpenAI", src: "/images/openai logo.svg" },
  { name: "Claude", src: "/images/claude logo.svg" },
  { name: "Google", src: "/images/google logo.png" },
  { name: "Vercel", src: "/images/vercel logo.svg" },
  { name: "React", src: "/images/react logo.png" },
  { name: "GitHub", src: "/images/github logo.png" },
  { name: "Azure", src: "/images/azure logo.png" },
  { name: "Stripe", src: "/images/stripe logo.png" },
  { name: "Neon", src: "/images/neon logo.webp" },
  { name: "Cursor", src: "/images/cursor logo.png" },
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

  // Auto-scroll every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % milestones.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [index]);

  const next = () => setIndex((i) => (i + 1) % milestones.length);
  const prev = () => setIndex((i) => (i - 1 + milestones.length) % milestones.length);

  return (
    <div className="flex flex-col gap-4 flex-1 h-full min-h-0">
      <div className="flex-1 relative min-h-0 bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 p-6 flex flex-col gap-4 overflow-y-auto"
          >
            <div className="flex items-center gap-4">
              <div
                className="h-12 w-12 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 shadow-lg"
                style={{ backgroundColor: `${milestones[index].color}20`, color: milestones[index].color }}
              >
                {milestones[index].id}
              </div>
              <div className="flex flex-col">
                <p className="text-[11px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-0.5">
                  {milestones[index].title}
                </p>
                <h4 className="text-xl lg:text-2xl font-black text-white leading-[1.1] tracking-tight">
                  {milestones[index].milestone}
                </h4>
              </div>
            </div>

            <p className="text-sm sm:text-base font-medium text-zinc-300 leading-relaxed italic border-l-2 pl-4 py-1" style={{ borderColor: milestones[index].color }}>
              &ldquo;{milestones[index].description}&rdquo;
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-4 shrink-0 pt-4 border-t border-white/5">
        <div className="flex gap-1.5 flex-1">
          {milestones.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 transition-all duration-500 rounded-full flex-1 ${i === index ? "bg-[#A892FF] shadow-[0_0_12px_rgba(168,146,255,0.4)]" : "bg-white/10"}`}
              aria-label={`Go to milestone ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-3">
          <button
            onClick={prev}
            className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="h-9 w-9 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors active:scale-95"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function HeroStaticContent({ inView }: { inView: boolean }) {
  const headline = [
    { text: "Build AI Agents.", color: "text-transparent bg-clip-text bg-[linear-gradient(to_right,#7C5CFC,#000000)]" },
    { text: "Ship Products.", color: "text-transparent bg-clip-text bg-[linear-gradient(to_right,#7C5CFC,#000000)]" },
    { text: "Engineering First.", color: "text-zinc-400" }
  ];

  return (
    <div className="flex-1 w-full flex flex-col items-center lg:items-start text-center lg:text-left shrink-0 min-h-[400px] lg:min-h-[480px]">
      <div className="flex w-full flex-col items-center lg:items-start max-w-2xl xl:max-w-3xl flex-1">
        <div className="mb-3 lg:mb-4 space-y-0.5">
          {headline.map((line, i) => (
            <div key={i} className="overflow-hidden py-1">
              <motion.h1
                initial={{ y: "100%" }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`block tracking-[-0.04em] leading-[0.95] font-black text-[clamp(2.8rem,7vw,4.5rem)] lg:text-[clamp(3.5rem,8vw,5.5rem)] ${line.color}`}
              >
                {line.text}
              </motion.h1>
            </div>
          ))}
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex flex-col gap-1.5 pt-1"
          >
            <div className="flex items-center justify-center lg:justify-start gap-2.5">
              <div className="h-1 w-1 rounded-full bg-[#7C5CFC]" />
              <p className="text-base sm:text-lg font-bold text-zinc-800 tracking-tight">
                6-Week cohort shipping weekly AI products.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65 }}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-4"
        >
          <MagneticLink
            href="/learn"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#7C5CFC] to-[#A892FF] px-6 py-3.5 text-[12px] font-black uppercase tracking-widest text-white shadow-[0_0_30px_-10px_rgba(124,92,252,0.8)] hover:shadow-[0_0_50px_-15px_rgba(124,92,252,1)] transition-all active:scale-95"
          >
            <GraduationCap className="h-4 w-4" />
            Learn
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </MagneticLink>
          <MagneticLink
            href="/assessment"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl border-2 border-[#7C5CFC]/30 px-6 py-3.5 text-[12px] font-black uppercase tracking-widest text-[#7C5CFC] hover:border-[#7C5CFC] hover:bg-[#7C5CFC]/5 transition-all active:scale-95 bg-white backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4" />
            Free Assessment
          </MagneticLink>
        </motion.div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-white/10 mt-6 lg:mt-8 w-full max-w-2xl pt-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 + i * 0.07 }}
            className="border-r last:border-r-0 border-zinc-200 px-0 py-2 sm:px-4 first:pl-0"
          >
            <p className="text-xl lg:text-2xl font-black text-zinc-900 tracking-tight">
              {s.value}<span className="text-[#7C5CFC]">{s.unit}</span>
            </p>
            <p className="mt-0.5 text-[10px] lg:text-[11px] font-bold uppercase tracking-widest text-zinc-500">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
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
      className="relative w-full overflow-hidden border-b border-zinc-100 min-h-[600px] lg:min-h-[750px] antialiased"
    >

      <AIBackground />

      {/* Cinematic Flash Overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 z-50 bg-white pointer-events-none"
      />

      {/* ── Background decoration ── */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white via-white to-transparent z-10 pointer-events-none" />

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

      <motion.div
        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        animate={inView ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 pt-0 pb-4 lg:pt-0 lg:pb-8 flex min-h-[500px] lg:min-h-[650px] flex-col lg:flex-row items-center lg:items-center gap-6 lg:gap-8 xl:gap-16"
      >

        <HeroStaticContent inView={inView} />

        {/* RIGHT COLUMN: CAROUSEL CARD */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:max-w-md shrink-0 flex flex-col justify-center"
        >
          <div className="relative rounded-[24px] border border-[#7C5CFC]/20 bg-[#13062C] p-5 lg:p-7 shadow-[0_24px_64px_rgba(124,92,252,0.25)] overflow-hidden backdrop-blur-xl group h-[480px] lg:h-[520px] flex flex-col">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="landing-gloss-sweep landing-gloss-sweep--dark" />
            </div>

            {/* Top: intake header */}
            <div className="border-b border-white/10 pb-4 mb-2 shrink-0 z-10 flex flex-col gap-2 relative">
              <div className="flex flex-col gap-1 items-start">
                <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(124,92,252,0.4)] bg-[#7C5CFC]/10 px-2.5 py-1 backdrop-blur-md mb-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#A892FF] shadow-[0_0_8px_2px_rgba(124,92,252,0.8)] animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-[0.18em] text-[#A892FF]">
                    Expected Milestones
                  </span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400 leading-none mb-1">
                  Intake: Quarter 2
                </p>
                <p className="text-xl lg:text-2xl font-black tracking-tight text-white leading-none">
                  Ship AI Products
                </p>
              </div>
            </div>

            <WeekCarousel />
          </div>
        </motion.div>

      </motion.div>

      {/* ── Tools Marquee Promoted to Hero ── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1, duration: 1 }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 mt-0 lg:-mt-10 opacity-100 transition-opacity pb-8 lg:pb-12"
      >
        <div className="flex flex-col items-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Tools you&apos;ll master
          </p>
          <div className="relative w-full overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: `
              @keyframes hero-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
              .hero-marquee-track { animation: hero-marquee 30s linear infinite; }
            ` }} />
            <div className="hero-marquee-track flex items-center gap-10 w-max">
              {[...toolLogos, ...toolLogos].map((logo, i) => (
                <div key={`${logo.name}-${i}`} className="flex items-center gap-3 shrink-0 group transition-all">
                  <div className="h-10 w-10 relative opacity-100 transition-opacity">
                    <Image src={logo.src} alt={logo.name} fill className="object-contain" unoptimized />
                  </div>
                  <span className="text-[11px] font-black text-zinc-500 group-hover:text-[#7C5CFC] transition-colors tracking-widest uppercase">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
