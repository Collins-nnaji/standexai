"use client";

import React, { useState } from "react";
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight, Zap, CheckCircle2, ChevronRight, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  tags: string[];
  isHot: boolean;
  description: string;
  requirements: string[];
}

interface JobsBoardClientProps {
  jobs: JobItem[];
}

export function JobsBoardClient({ jobs }: JobsBoardClientProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-8 h-[calc(100vh-280px)] min-h-[600px]">
      
      {/* LEFT COLUMN: JOB LIST */}
      <div className="w-full lg:w-[400px] xl:w-[450px] shrink-0 flex flex-col pt-2 pb-8 h-full">
        <div className="mb-4 px-1 flex items-center justify-between">
          <h2 className="text-sm font-black text-zinc-900 uppercase tracking-widest">{jobs.length} Open Roles</h2>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-zinc-200">
          {jobs.map((job) => {
            const isSelected = selectedJobId === job.id;
            return (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={cn(
                  "w-full text-left p-5 rounded-2xl border transition-all duration-200 block",
                  isSelected 
                    ? "border-[#7C5CFC] bg-[#7C5CFC]/5 shadow-[0_4px_20px_rgba(124,92,252,0.1)] ring-1 ring-[#7C5CFC]" 
                    : "border-zinc-200 bg-white hover:border-[#7C5CFC]/40 hover:shadow-md"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-zinc-900 leading-tight">{job.title}</h3>
                  {job.isHot && <Zap className="h-4 w-4 text-[#7C5CFC] shrink-0" fill="currentColor" />}
                </div>
                <p className="text-xs font-semibold text-zinc-600 mb-3">{job.company}</p>
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider font-bold text-zinc-500 mb-3">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {job.location}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {job.salary}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {job.tags.slice(0, 3).map(tag => (
                    <span key={tag} className={cn(
                      "px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                      isSelected ? "bg-white text-[#7C5CFC]" : "bg-zinc-100 text-zinc-600"
                    )}>
                      {tag}
                    </span>
                  ))}
                  {job.tags.length > 3 && (
                    <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-400 text-[9px] font-black">+{job.tags.length - 3}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: JOB DETAILS */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full hidden lg:flex">
        {selectedJob ? (
          <>
            <div className="p-8 border-b border-zinc-100 bg-zinc-50/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-3xl font-black text-zinc-900 tracking-tight leading-tight">{selectedJob.title}</h2>
                  <p className="text-base font-bold text-[#7C5CFC] mt-1">{selectedJob.company}</p>
                </div>
                <div className="flex gap-2">
                  <button className="h-10 w-10 flex items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button className="h-10 px-6 flex items-center justify-center rounded-full bg-zinc-900 text-[11px] font-black uppercase tracking-[0.1em] text-white hover:bg-[#7C5CFC] transition-colors shadow-lg active:scale-95">
                    Apply Now
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-zinc-200/60">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500"><MapPin className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Location</p>
                    <p className="text-xs font-bold text-zinc-800">{selectedJob.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500"><DollarSign className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Compensation</p>
                    <p className="text-xs font-bold text-zinc-800">{selectedJob.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500"><Clock className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Commitment</p>
                    <p className="text-xs font-bold text-zinc-800">{selectedJob.type}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-thin scrollbar-thumb-zinc-200">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#7C5CFC]" /> Role Overview
                </h3>
                <p className="text-sm text-zinc-600 leading-relaxed font-medium">
                  {selectedJob.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#7C5CFC]" /> Key Requirements
                </h3>
                <ul className="space-y-3">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] mt-1.5 shrink-0" />
                      <span className="text-sm font-medium text-zinc-600">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-900 mb-4 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#7C5CFC]" /> Tech Stack Alignment
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold rounded-lg shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-zinc-100 bg-white flex justify-end shrink-0">
               <button className="h-12 px-8 flex items-center justify-center rounded-xl bg-[#7C5CFC] text-[11px] font-black uppercase tracking-[0.1em] text-white hover:bg-[#6545ea] transition-all shadow-[0_4px_20px_rgba(124,92,252,0.3)] active:scale-95">
                  Submit Application <ChevronRight className="h-4 w-4 ml-2" />
               </button>
            </div>
          </>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-zinc-400">
             <Briefcase className="h-12 w-12 text-zinc-200 mb-4" />
             <p className="font-semibold text-sm">Select a role to view details</p>
           </div>
        )}
      </div>

      {/* MOBILE JOB DETAILS OVERLAY (if selected on mobile, optional UI layer) */}
      {/* For simplicity right now, desktop only gets the split view. 
          On true mobile, typically the pane slides in. 
          Given time constraints, lg:flex keeps the split on large screens. */}
    </div>
  );
}
