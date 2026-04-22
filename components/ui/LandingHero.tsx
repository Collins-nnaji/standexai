"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap, Settings, CheckCircle2, TerminalSquare, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Icons for the Vertical Marquees ──
const powerPlatformIcons = [
  { src: "/PowerApps.svg", name: "Power Apps" },
  { src: "/PowerAutomate.svg", name: "Power Automate" },
  { src: "/PowerBi.svg", name: "Power BI" },
  { src: "/PowerPlatform.svg", name: "Power Platform" },
  { src: "/CopilotStudio.svg", name: "Copilot Studio" },
];

const aiCloudIcons = [
  { src: "/images/openai%20logo.svg", name: "OpenAI" },
  { src: "/images/azure%20logo.png", name: "Azure AI" },
  { src: "/images/claude%20logo.svg", name: "Anthropic" },
  { src: "/images/nextjslogo.png", name: "Next.js" },
];

const toolLogos = [
  { name: "Microsoft Power Platform", src: "/PowerPlatform.svg" },
  { name: "Azure AI", src: "/images/azure%20logo.png" },
  { name: "OpenAI", src: "/images/openai%20logo.svg" },
  { name: "Anthropic", src: "/images/claude%20logo.svg" },
  { name: "Copilot Studio", src: "/CopilotStudio.svg" },
  { name: "Power Automate", src: "/PowerAutomate.svg" },
];

export function LandingHero() {
  return (
    <section className="relative min-h-[100vh] w-full overflow-hidden bg-zinc-950">
      {/* ── Background: Dark Emerald Diagnostic Texture ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.12),transparent_70%)]" />
        <CodeBackground />
        
        {/* Radial subtle grid */}
        <div className="absolute inset-0 opacity-[0.08]" 
             style={{ backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 h-full flex flex-col justify-center min-h-[90vh] pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-24 items-center py-8">
          
          {/* ── Left Column: Engineering-Grade Messaging ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-10 z-10 lg:-ml-8"
          >
            <div className="space-y-6">

              
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.95] text-white">
                Architecting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400">
                  Intelligent
                </span><br />
                Systems.
              </h1>
            </div>

            <p className="max-w-xl text-xl md:text-2xl font-medium leading-relaxed text-zinc-400">
              Transforming enterprise complexity into high-performance 
              <span className="text-white font-bold border-b-2 border-emerald-500/30 mx-1">AI Agents</span> 
              and 
              <span className="text-white font-bold border-b-2 border-emerald-500/30 mx-1">Power Platform</span> 
              innovations. We implement the future, then train your team to own it.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link 
                href="/Contact"
                className="group relative flex h-16 items-center gap-4 overflow-hidden rounded-2xl bg-emerald-500 px-10 text-sm font-bold tracking-widest text-white transition-all hover:bg-emerald-600 shadow-lg shadow-emerald-200"
              >
                <span>ENGINEER A SOLUTION</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>


          </motion.div>

          {/* ── Right Column: Dual Vertical Icon Columns ── */}
          <div className="relative h-[600px] lg:h-[750px] grid grid-cols-2 gap-6 overflow-hidden">
            <div className="relative h-full">
              <VerticalIconColumn icons={powerPlatformIcons} direction="up" speed={40} />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
            </div>
            <div className="relative h-full translate-y-20">
              <VerticalIconColumn icons={aiCloudIcons} direction="down" speed={35} />
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-zinc-950 to-transparent z-10" />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
            </div>
            

          </div>
        </div>
      </div>
    </section>
  );
}

// ── Supporting Components ──

function VerticalIconColumn({ icons, direction = "up", speed = 30 }: { icons: any[], direction?: "up" | "down", speed?: number }) {
  return (
    <div className="flex flex-col gap-6 py-6 h-full">
      <motion.div
        animate={{
          y: direction === "up" ? [0, -1000] : [-1000, 0],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex flex-col gap-6"
      >
        {[...icons, ...icons, ...icons, ...icons].map((icon, i) => (
          <div key={i} className="group relative">
            <div className="h-28 w-28 flex items-center justify-center p-4 transition-all">
              <img src={icon.src} alt={icon.name} className="h-full w-full object-contain filter brightness-110 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function CodeBackground() {
  const lines = [
    "class IntelligentEngine {",
    "  public async deployAgent(model: string) {",
    "    const system = await PowerPlatform.init();",
    "    return system.inject(AI_CORE);",
    "  }",
    "}",
    "const Standex = new AI_Engineering_Partner();",
    "Standex.audit(infrastructure).optimize();",
    "// LLM context: high-performance tokens only",
    "// Power Platform: Low-code scaling active",
  ];

  return (
    <div className="absolute inset-0 pointer-events-none select-none opacity-[0.1]">
      {Array.from({ length: 8 }).map((_, i) => (
          <div
               key={`code-pill-${i}`}
               className="absolute flex items-center gap-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full" 
               style={{ top: `${15 + (i * 12)}%`, left: `${4 + (i * 2)}%` }}>
             <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[8px] font-bold text-emerald-500/80 tracking-widest uppercase">{lines[i % lines.length]}</span>
          </div>
      ))}
      
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i + 8}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i, duration: 1.2 }}
          className="absolute text-[10px] font-mono text-emerald-500/50 whitespace-nowrap text-right"
          style={{ 
            bottom: `${10 + (i * 12)}%`, 
            right: `${2 + (i * 2)}%`,
          }}
        >
          {lines[(i + 4) % lines.length]}
        </motion.div>
      ))}
    </div>
  );
}
