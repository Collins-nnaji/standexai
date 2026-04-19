"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles, GraduationCap } from "lucide-react";

const tracks = [
  {
    id: "ai",
    label: "AI Engineering",
    tag: "Engineering Curriculum 2026",
    price: "$1800",
    oldPrice: "$3500",
    cohort: "Cohort 04 — Active Enrollment",
    cohortDate: "May 5",
    description: "Master Multi-Agent Orchestration, production-grade RAG architectures, and the deployment of scalable AI systems.",
    enrollLink: "https://buy.stripe.com/28E4gB0JK6Z8dDi697fnO0j",
    color: "#049DCB",
    icon: Bot,
    image: "/ArtificialIntelligence.png",
  },
  {
    id: "pp",
    label: "Power Platform Developer",
    tag: "Developer Curriculum 2026",
    price: "$1500",
    oldPrice: "$3000",
    cohort: "Cohort 04 — Now Enrolling",
    cohortDate: "Jun 2",
    description: "Master the Microsoft Power Platform stack, enterprise data modelling, and the delivery of production-grade business solutions.",
    enrollLink: "https://buy.stripe.com/bIY1693YAcFMbx66os",
    color: "#049DCB",
    icon: GraduationCap,
    image: "/PowerPlatform.png",
  }
];

export default function HomeCourses() {
  return (
    <section className="relative w-full antialiased py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-1.5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-[#7C5CFC]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C5CFC]">Standex Digital Academy</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-950 leading-tight">
            Accelerate your <br className="hidden md:block" /> Engineering Career.
          </h2>
          <p className="mt-8 text-lg font-medium text-zinc-500 max-w-2xl">
            Intensive, cohort-based curriculum designed for senior engineers and business architects. 
            Built on real-world production stacks.
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {tracks.map((track) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group relative flex flex-col rounded-[40px] border border-zinc-200 bg-zinc-50/50 p-1 overflow-hidden transition-all duration-700 hover:shadow-[0_48px_100px_-20px_rgba(0,0,0,0.1)] hover:border-zinc-300"
            >
              <div className="bg-white rounded-[39px] p-8 md:p-10 flex flex-col h-full">
                {/* Track Badge */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: track.color }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: track.color }}>
                      {track.cohort}
                    </span>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-50 border border-zinc-100">
                    <track.icon className="h-5 w-5 text-zinc-900" />
                  </div>
                </div>

                {/* Label & Title Area */}
                <div className="flex-1 mb-8">
                  <div className="mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                      {track.tag}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-zinc-950 tracking-tight mb-6 leading-none">
                    {track.label}
                  </h3>
                  
                  {/* Course Graphic */}
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-zinc-100 mb-8 group-hover:border-zinc-200 transition-colors shadow-sm">
                    <Image 
                      src={track.image} 
                      alt={track.label} 
                      fill 
                      className="object-cover transition-transform duration-700 group-hover:scale-105" 
                      unoptimized
                    />
                  </div>

                  <p className="text-base font-semibold text-zinc-500 leading-relaxed mb-8">
                    {track.description}
                  </p>

                  <div className="flex items-baseline gap-3 mb-2">
                    <h4 className="text-4xl font-black tracking-tighter text-zinc-950 leading-none">
                      {track.price}
                    </h4>
                    <span className="text-sm font-black text-zinc-400 uppercase tracking-widest line-through decoration-zinc-950/20">
                      {track.oldPrice}
                    </span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Starts {track.cohortDate} • 6 Weeks Intensive
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={track.enrollLink}
                    className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl p-5 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] active:scale-95"
                    style={{ backgroundColor: track.color }}
                  >
                    Enroll Now <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/learn"
                    className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl p-5 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 transition-all"
                  >
                    View Syllabus
                  </Link>
                </div>
              </div>
              
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700">
                 <track.icon className="h-48 w-48 text-zinc-950" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Bottom Glow */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-3/4 h-32 bg-violet-100/20 blur-[100px] -z-10" />
      </div>
    </section>
  );
}
