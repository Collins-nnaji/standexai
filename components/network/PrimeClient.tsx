"use client";

import React from "react";
import { 
  Zap, 
  ShieldCheck, 
  Globe, 
  Database, 
  Cpu, 
  Layers, 
  Code2, 
  Terminal, 
  Workflow, 
  Box,
  ChevronRight,
  Home
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ManagedProjectForm } from "@/components/consulting/ManagedProjectForm";
import { PrimeCourses } from "@/components/consulting/PrimeCourses";

export function PrimeClient() {
  const navItems = [
    { name: "AI Talent", href: "/talent" },
    { name: "Open Projects", href: "/projects" },
    { name: "Prime", href: "/prime" },
  ];

  const toolkit = [
    { name: "LangChain", desc: "Agentic Workflows", icon: Workflow },
    { name: "PyTorch", desc: "Model Architecture", icon: Cpu },
    { name: "Pinecone", desc: "Vector Retrieval", icon: Database },
    { name: "Weights & Biases", desc: "Experiment Tracking", icon: Layers },
    { name: "Docker", desc: "Containerized Logic", icon: Box },
    { name: "JAX", desc: "TPU Acceleration", icon: Terminal },
    { name: "LlamaIndex", desc: "RAG Infrastructure", icon: Code2 },
    { name: "Kubernetes", desc: "Elite Deployment", icon: Globe }
  ];

  return (
    <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 py-10 lg:py-20">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,252,0.03),transparent_70%)] pointer-events-none" />

      {/* Breadcrumbs: compact on mobile, full trail on sm+ */}
      <nav className="relative z-10 mb-8 min-w-0 sm:mb-12" aria-label="Breadcrumb">
        <div className="flex min-w-0 items-center gap-2 sm:hidden bg-zinc-950/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-zinc-800 shadow-2xl w-fit">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:text-white"
          >
            <Home className="h-3.5 w-3.5 shrink-0" />
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-zinc-700" />
          <p className="truncate text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Standex Prime</p>
        </div>
        <div className="hidden min-w-0 items-center gap-2 pb-2 sm:flex sm:flex-wrap sm:gap-x-2 sm:gap-y-1">
          <Link href="/" className="flex shrink-0 items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:text-zinc-900">
            <Home className="h-3 w-3" /> Network
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-zinc-200" aria-hidden />
          <Link
            href="/projects"
            className="shrink-0 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:text-zinc-900"
          >
            Projects
          </Link>
          <ChevronRight className="h-3 w-3 shrink-0 text-zinc-200" aria-hidden />
          <span className="min-w-0 truncate text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">Standex Prime</span>
        </div>
      </nav>

      <div className="mb-12 lg:mb-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <Image 
                src="/standexailogo.png" 
                alt="Standex Digital" 
                width={140} 
                height={32} 
                className="h-6 sm:h-7 w-auto contrast-150"
              />
              <div className="h-4 w-px bg-zinc-200" />
              <span className="font-syne text-lg sm:text-xl font-black text-[#7C5CFC] tracking-tight uppercase">Prime</span>
            </div>
            <h1 className="font-syne text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] text-zinc-900">
              Managed <span className="text-[#7C5CFC]">Implementation.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg font-medium text-zinc-500 leading-relaxed">
              Elite squad allocation for mission-critical AI architecture and production engineering.
            </p>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 pb-2">
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center overflow-hidden shadow-sm">
                     <img src={`https://i.pravatar.cc/150?u=a${i}`} className="h-full w-full object-cover grayscale opacity-60" />
                  </div>
                ))}
             </div>
             <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">84 Active Vetted Personnel</span>
          </div>
        </div>
      </div>

      {/* Refined "Prime Card" (Standex Prime Banner) */}
      <div className="relative mb-16 lg:mb-24 overflow-hidden rounded-[32px] sm:rounded-[56px] border border-zinc-900 bg-zinc-950 p-0.5 sm:p-1 shadow-2xl shadow-[#7C5CFC]/10">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(124,92,252,0.15),transparent_70%)] pointer-events-none" />
         <div className="absolute inset-0 bg-[grid-white/2%] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none" />
         
         <div className="relative overflow-hidden rounded-[30px] sm:rounded-[54px] bg-zinc-950 px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
               <div className="lg:col-span-5 space-y-6 sm:space-y-8">
                  <div className="flex items-center gap-3 sm:gap-4">
                     <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-[#7C5CFC]" />
                     <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Standex Vetted Exclusive Layer</span>
                  </div>
                  <h2 className="font-syne text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                     Deploy the Highest-Density <span className="text-[#7C5CFC]">AI Talent</span> for Production.
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-zinc-500 leading-relaxed">
                     Leverage Standex Prime for high-touch implementation. We handle the entire lifecycle, from scouting domain experts to delivering production milestones.
                  </p>
                  <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
                     <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 px-4 py-3 sm:px-6 sm:py-4">
                        <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#7C5CFC] mb-1">Response Time</span>
                        <span className="text-lg sm:text-xl font-black text-white">&lt; 24h</span>
                     </div>
                     <div className="rounded-xl sm:rounded-2xl bg-white/5 border border-white/5 px-4 py-3 sm:px-6 sm:py-4">
                        <span className="block text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#7C5CFC] mb-1">Min Contract</span>
                        <span className="text-lg sm:text-xl font-black text-white">$25k</span>
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-7">
                  <div className="rounded-[32px] sm:rounded-[40px] bg-white/[0.03] border border-white/5 p-6 sm:p-8 backdrop-blur-xl">
                     <div className="mb-6 sm:mb-8 text-center sm:text-left">
                        <h3 className="font-syne text-lg sm:text-xl font-black text-white mb-2">Implementation Intake</h3>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Connect with our core engineering desk</p>
                     </div>
                     <ManagedProjectForm />
                  </div>
               </div>
            </div>
          </div>
       </div>
 
       <div className="-mt-12">
         <PrimeCourses />
       </div>

      {/* Technical Toolkit Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-4 space-y-4 sm:space-y-6">
          <h3 className="font-syne text-2xl sm:text-3xl font-black text-zinc-900 border-b-2 border-[#7C5CFC]/20 pb-4 inline-block">Technical <span className="text-[#7C5CFC]">Toolkit.</span></h3>
          <p className="text-sm font-medium text-zinc-500 leading-relaxed capitalize">
            Our squads specialize in the following high-density tech stacks for mission-critical engineering.
          </p>
        </div>

        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {toolkit.map((tool, i) => (
              <div key={i} className="flex flex-col items-center text-center p-5 sm:p-6 rounded-[24px] sm:rounded-[32px] bg-white border border-zinc-100 hover:border-[#7C5CFC]/30 group transition-all hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-[#7C5CFC]/5 hover:bg-white/[0.9]">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover:text-[#7C5CFC] group-hover:bg-[#7C5CFC]/5 transition-all mb-3 sm:mb-4">
                  <tool.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <h4 className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-900 mb-1">{tool.name}</h4>
                <p className="text-[7px] sm:text-[8px] font-bold text-zinc-400 uppercase tracking-widest leading-tight">{tool.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
