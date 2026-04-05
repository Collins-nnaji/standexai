"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Zap, ShieldCheck, ChevronRight, Users } from "lucide-react";
import { HeroGraphic } from "./HeroGraphic";

export function LandingHero() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 2);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const slides = [
    {
      id: "network",
      tag: "Network Discovery",
      title: (
        <>
          Solve Mission-Critical <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] via-[#A892FF] to-blue-600">AI Projects.</span>
        </>
      ),
      description: "The primary workspace for frontier AI development. Connect with verified researchers, launch technical briefs, and build breakthrough models together.",
      cta: [
        { label: "Launch Project", href: "/projects", primary: true, icon: Zap },
        { label: "Find Talent", href: "/talent", primary: false, icon: ArrowRight }
      ],
      trust: "Vetted AI Network • Secure Collaboration • Technical Depth"
    },
    {
      id: "prime",
      tag: "Standex Prime",
      title: (
        <>
          Elite Squad Allocation for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C5CFC] via-[#A892FF] to-blue-500 border-b-4 border-[#7C5CFC]/20">Enterprise AI.</span>
        </>
      ),
      description: "Direct high-touch engineering for mission-critical architecture. Deployment of elite AI talent for production-grade implementation and scaling.",
      cta: [
        { label: "Explore Prime", href: "/prime", primary: true, icon: ShieldCheck },
        { label: "View Directory", href: "/projects", primary: false, icon: ChevronRight }
      ],
      trust: "Managed Implementation • Production-Grade • SOTA Standards"
    }
  ];

  return (
    <section className="relative z-10 mx-auto max-w-7xl w-full px-4 pt-12 pb-12 sm:px-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-24 items-center"
        >
          {/* Left Column: Messaging */}
          <div className="flex flex-col items-start text-left max-w-2xl py-8 lg:py-16">
            <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="inline-flex items-center gap-2 rounded-full bg-[#7C5CFC]/5 border border-[#7C5CFC]/10 px-4 py-2 mb-8"
            >
               <Sparkles className="h-4 w-4 text-[#7C5CFC]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">{slides[activeSlide].tag}</span>
            </motion.div>

            <h1 className="font-syne mb-8 text-5xl font-black tracking-tighter text-zinc-900 md:text-7xl lg:text-8xl leading-[0.95]">
              {slides[activeSlide].title}
            </h1>
            
            <p className="mb-12 text-lg sm:text-xl leading-relaxed text-zinc-500 max-w-xl font-medium">
              {slides[activeSlide].description}
            </p>
            
            <div className="flex flex-wrap gap-4 items-center">
              {slides[activeSlide].cta.map((cta, idx) => (
                <Link
                  key={idx}
                  href={cta.href}
                  className={`group inline-flex h-16 items-center justify-center gap-3 rounded-2xl transition-all active:scale-95 px-8 sm:px-10 text-xs sm:text-sm font-black uppercase tracking-widest ${
                    cta.primary 
                      ? "bg-zinc-900 text-white hover:bg-[#7C5CFC] shadow-xl shadow-[#7C5CFC]/10" 
                      : "bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  {cta.label}
                  <cta.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>

            {/* Qualitative Trust Band */}
            <div className="mt-16 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-t border-zinc-100 pt-10">
               {slides[activeSlide].trust}
            </div>
          </div>

          {/* Right Column: Refined Graphic */}
          <div className="relative w-full aspect-square lg:aspect-auto lg:h-[700px]">
            <HeroGraphic />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="mt-8 flex justify-center lg:justify-start gap-2">
         {slides.map((_, i) => (
           <button 
             key={i} 
             onClick={() => setActiveSlide(i)}
             className={`h-1.5 rounded-full transition-all duration-500 ${activeSlide === i ? "w-8 bg-[#7C5CFC]" : "w-1.5 bg-zinc-200"}`}
           />
         ))}
      </div>
    </section>
  );
}
