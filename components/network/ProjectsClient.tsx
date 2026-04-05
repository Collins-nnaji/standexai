"use client";

import React, { useState } from "react";
import { Plus, Zap } from "lucide-react";
import { SubmitProjectModal } from "@/components/network/SubmitProjectModal";
import { EditBriefModal } from "@/components/network/EditBriefModal";
import { ResearchBriefCard } from "@/components/network/ResearchBriefCard";
import { Briefcase, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectsClientProps {
  briefs: any[];
  totalActiveBriefs: number;
  totalLabs: number;
  isLab: boolean;
  userDomains: string[];
  currentUserId?: string;
}

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

export function ProjectsClient({ 
  briefs, 
  totalActiveBriefs, 
  totalLabs, 
  isLab,
  userDomains,
  currentUserId
}: ProjectsClientProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<any>(null);

  function computeMatchScore(briefDomains: string[]): number | null {
    if (!userDomains.length || !briefDomains.length) return null;
    const briefLower = briefDomains.map(d => d.toLowerCase());
    const overlap = briefLower.filter(d => userDomains.some((u: any) => u.includes(d) || d.includes(u)));
    return Math.round((overlap.length / briefLower.length) * 100);
  }

  return (
    <>
      {/* Page Header & Summary Section */}
      <div className="relative z-20 mb-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/10 bg-white/60 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#7C5CFC] shadow-sm">
            <Zap className="h-3 w-3" /> Managed Implementation
          </div>
          <h1 className="font-syne mb-4 text-5xl font-black tracking-tight text-zinc-900 md:text-6xl leading-[1.1]">
             Open <span className="text-[#7C5CFC]">Projects.</span>
          </h1>
          <p className="text-lg font-medium text-zinc-500 leading-relaxed max-w-xl">
             Connect with frontier research laboratories or deploy managed AI squads for mission-critical engineering.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-16">
            <div className="flex flex-col">
               <span className="font-syne text-3xl font-black text-zinc-900 leading-none">{totalActiveBriefs}</span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#7C5CFC] mt-3 underline decoration-2 decoration-[#7C5CFC]/20 underline-offset-4">Active Briefs</span>
            </div>
            <div className="flex flex-col">
               <span className="font-syne text-3xl font-black text-zinc-900 leading-none">{totalLabs}</span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-3">Verified Labs</span>
            </div>
            <div className="hidden md:flex flex-col">
               <span className="font-syne text-3xl font-black text-emerald-500 leading-none">94.8%</span>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mt-3">Success Rate</span>
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16">
        {/* Main Brief Directory */}
        <div className="flex-1 space-y-12">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-8">
             <div>
                <h3 className="font-syne text-2xl font-black text-zinc-900">Community Briefs</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] mt-1">Self-Serve Research Signal</p>
             </div>
             <button 
               onClick={() => setIsOpen(true)}
               className="flex items-center gap-3 rounded-2xl bg-white border border-zinc-200 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 transition-all hover:border-[#7C5CFC] hover:text-[#7C5CFC] shadow-sm hover:shadow-xl hover:shadow-[#7C5CFC]/5 active:scale-95"
             >
                <Plus className="h-4 w-4" /> Post Your Brief
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
             {briefs.length > 0 ? briefs.map((brief: any) => (
               <ResearchBriefCard
                 key={brief.id}
                 id={brief.id}
                 companyName={brief.company.labProfile?.companyName || brief.company.name || "Unknown"}
                 logo={brief.company.labProfile?.logo || null}
                 title={brief.title}
                 description={brief.description}
                 lookingFor={brief.lookingFor}
                 domain={brief.domain}
                 status={brief.active ? "verified" : "managed"}
                 matchScore={isLab ? null : computeMatchScore(brief.domain)}
                 isOwner={brief.companyId === currentUserId}
                 onEdit={() => {
                   setSelectedBrief(brief);
                   setIsEditOpen(true);
                 }}
               />
             )) : null}

             {/* Placeholder for "Post New Brief" in the grid */}
             <button 
                onClick={() => setIsOpen(true)}
                className="group relative h-[400px] overflow-hidden rounded-[48px] border-2 border-dashed border-zinc-200 bg-white/40 transition-all hover:border-[#7C5CFC]/30 hover:bg-white hover:shadow-2xl hover:shadow-zinc-200/50 flex flex-col items-center justify-center text-center p-12"
             >
                 <div className="mb-6 h-16 w-16 rounded-[24px] bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300 group-hover:bg-[#7C5CFC]/5 group-hover:text-[#7C5CFC] group-hover:border-[#7C5CFC]/20 transition-all">
                    <Plus className="h-8 w-8" />
                 </div>
                 <h4 className="font-syne text-xl font-black text-zinc-900 mb-2">Publish New Brief</h4>
                 <p className="text-xs font-bold text-zinc-400 leading-relaxed uppercase tracking-widest">Broadcast your signal to the network</p>
             </button>
          </div>

          {briefs.length === 0 && (
            <div className="py-32 text-center rounded-[60px] border border-dashed border-zinc-200">
              <Briefcase className="mx-auto mb-6 h-16 w-16 text-zinc-200" />
              <p className="font-syne text-xl font-bold uppercase tracking-widest text-zinc-300">No public briefs active in network</p>
              <p className="text-xs font-bold text-zinc-400 mt-2">Submit a managed project above to get started.</p>
            </div>
          )}
        </div>
      </div>

      <SubmitProjectModal isOpen={isOpen} onOpenChange={setIsOpen} />
      {selectedBrief && (
        <EditBriefModal 
          isOpen={isEditOpen} 
          onOpenChange={setIsEditOpen} 
          brief={selectedBrief} 
        />
      )}
    </>
  );
}
