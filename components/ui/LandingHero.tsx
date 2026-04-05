"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { HeroGraphic } from "./HeroGraphic";

export function LandingHero() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl w-full px-4 pt-12 pb-12 sm:px-6">
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center">
        
        {/* Left Column: Messaging */}
        <div className="flex flex-col items-start text-left max-w-2xl py-8 lg:py-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-syne mb-8 text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl leading-[0.95]"
          >
            Solve Complex <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] via-[#A892FF] to-blue-400">AI Projects.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 text-xl leading-relaxed text-zinc-400 max-w-xl font-medium"
          >
            The primary workspace for frontier AI development. Connect with verified researchers, launch technical briefs, and build breakthrough models together.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-5 items-center"
          >
            <Link
              href="/projects"
              className="group inline-flex h-16 items-center justify-center gap-3 rounded-2xl bg-white px-10 text-xs font-black uppercase tracking-widest text-zinc-950 transition-all hover:bg-[#7C5CFC] hover:text-white active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              Launch Project
              <Zap className="h-4 w-4" />
            </Link>
            <Link
              href="/talent"
              className="inline-flex h-16 items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-10 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 active:scale-95"
            >
              Find Talent
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Verified Trust Band */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 flex items-center gap-10 border-t border-white/5 pt-10"
          >
             <div className="flex flex-col">
               <span className="text-3xl font-black text-white font-syne">1.2k+</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Researchers</span>
             </div>
             <div className="h-10 w-px bg-white/10" />
             <div className="flex flex-col">
               <span className="text-3xl font-black text-white font-syne">89%</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Match Accuracy</span>
             </div>
          </motion.div>
        </div>

        {/* Right Column: Interactive Code Graphic */}
        <div className="relative w-full aspect-square lg:aspect-auto lg:h-[700px] animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <HeroGraphic />
        </div>
      </div>
    </section>
  );
}
