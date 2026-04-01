"use client";

import Link from "next/link";
import { User, Sparkles, Briefcase, ChevronRight } from "lucide-react";
import { RankBadge } from "./RankBadge";

interface CompactWorkItem {
  id: string;
  title: string;
  type: string;
}

export interface TalentCardProps {
  id: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  institution: string | null;
  openToWork: boolean;
  domain: string;
  rankPosition: number | null;
  workItems: CompactWorkItem[];
  isScoutView?: boolean;
}

export function TalentCard({
  id,
  name,
  avatar,
  bio,
  institution,
  openToWork,
  domain,
  rankPosition,
  workItems,
  isScoutView = false,
}: TalentCardProps) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm p-5 transition-all hover:border-black/20 hover:shadow-md">
      {/* Background glow on hover */}
      <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-[#7C5CFC]/0 to-transparent transition-all group-hover:via-[#7C5CFC]/40" />
      
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href={`/r/${id}`} className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-black/10 bg-zinc-100">
            {avatar ? (
              <img src={avatar} alt={name || "Researcher"} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-zinc-100 text-zinc-500">
                <User className="h-6 w-6" />
              </div>
            )}
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/r/${id}`} className="font-syne block truncate text-base font-bold text-zinc-900 transition-colors hover:text-[#7C5CFC]">
              {name || "Anonymous Researcher"}
            </Link>
            {institution && <p className="truncate text-xs font-medium text-zinc-500">{institution}</p>}
          </div>
        </div>
        
        {rankPosition && <RankBadge domain={domain} position={rankPosition} compact />}
      </div>

      <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-zinc-500">
        {bio || "No bio provided."}
      </p>

      {/* Mini Work Feed */}
      <div className="mb-5 flex-1 space-y-2">
        {workItems.length > 0 ? (
          workItems.slice(0, 3).map((work) => (
            <Link 
              key={work.id} 
              href={`/work/${work.id}`}
              className="flex items-center justify-between rounded-lg border border-black/5 bg-zinc-100 py-1.5 px-3 transition-colors hover:bg-zinc-200"
            >
              <div className="min-w-0 flex-1 pr-2">
                <p className="truncate text-xs font-medium text-zinc-900/90">{work.title}</p>
              </div>
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {work.type}
              </span>
            </Link>
          ))
        ) : (
          <div className="flex h-[88px] items-center justify-center rounded-lg border border-dashed border-black/10 text-xs text-zinc-500">
            No public work items yet.
          </div>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-4">
        <div>
          {openToWork && (
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
              <Briefcase className="h-3 w-3" />
              Open to Work
            </div>
          )}
        </div>
        {isScoutView ? (
          <Link
            href={`/r/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-[#7C5CFC] hover:shadow-[0_0_10px_rgba(124,92,252,0.3)] active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5" /> Scout Profile
          </Link>
        ) : (
          <Link
            href={`/r/${id}`}
            className="inline-flex items-center text-xs font-semibold text-zinc-500 transition-colors group-hover:text-[#7C5CFC]"
          >
            View Profile <ChevronRight className="ml-1 h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
