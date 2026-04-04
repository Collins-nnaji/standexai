"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { SubmitProjectModal } from "@/components/network/SubmitProjectModal";
import { EditBriefModal } from "@/components/network/EditBriefModal";
import { ResearchBriefCard } from "@/components/network/ResearchBriefCard";
import { Briefcase } from "lucide-react";

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
      <div className="relative z-20 mb-12 flex flex-col md:flex-row items-end justify-between gap-8">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/10 bg-white/60 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#7C5CFC] shadow-sm">
            <Plus className="h-3 w-3" /> Managed Research
          </div>
          <h1 className="font-syne mb-3 text-4xl font-black tracking-tight text-zinc-900 md:text-5xl leading-tight">
             Open <span className="text-[#7C5CFC]">Projects.</span>
          </h1>
          <p className="text-base font-medium text-zinc-500 leading-relaxed">
             Submit your project brief and our team will match you with the top 1% of AI talent from our verified research network.
          </p>
        </div>
        
        <div className="flex shrink-0 items-center gap-8 px-4">
            <div className="flex flex-col">
               <span className="font-syne text-2xl font-black text-zinc-900 leading-none">{totalActiveBriefs}</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] mt-2">Active Briefs</span>
            </div>
            <div className="h-10 w-px bg-zinc-200" />
            <div className="flex flex-col">
               <span className="font-syne text-2xl font-black text-zinc-900 leading-none">{totalLabs}</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2">Partner Labs</span>
            </div>
            <div className="h-10 w-px bg-zinc-200" />
            <div className="flex flex-col">
               <span className="font-syne text-2xl font-black text-emerald-500 leading-none">24h</span>
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2">Avg. Response</span>
            </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main List & Submission Trigger */}
        <div className="flex-1 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {/* Managed Submission Call-to-Action Card */}
             <div className="group relative overflow-hidden rounded-[40px] border border-[#7C5CFC]/20 bg-[#7C5CFC]/5 p-8 transition-all hover:bg-[#7C5CFC]/10 shadow-2xl shadow-[#7C5CFC]/5 flex flex-col justify-between min-h-[320px]">
                <div className="absolute top-0 right-0 h-48 w-48 bg-[radial-gradient(circle_at_100%_0%,rgba(124,92,252,0.1),transparent_70%)] pointer-events-none" />
                <div>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-xl shadow-[#7C5CFC]/10 text-[#7C5CFC]">
                     <Plus className="h-7 w-7" />
                  </div>
                  <h3 className="font-syne text-2xl font-black text-zinc-900 mb-3">Submit Managed Project</h3>
                  <p className="text-xs font-bold text-zinc-400 leading-relaxed mb-6">
                     Stop chasing talent. Submit your technical goal and we will handle the vetting, matching, and initiation.
                  </p>
                </div>
                <button 
                  onClick={() => setIsOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-[#7C5CFC] transition-all active:scale-95 shadow-xl shadow-zinc-900/10"
                >
                   Initialize Brief <ArrowRight className="h-4 w-4" />
                </button>
             </div>

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
