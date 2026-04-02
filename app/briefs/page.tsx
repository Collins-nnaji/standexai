import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { TopNav } from "@/components/network/TopNav";
import { ResearchBriefCard } from "@/components/network/ResearchBriefCard";
import { Briefcase, Building, Plus } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Projects | StandexAI",
  description: "Discover active AI research projects from frontier labs.",
};

export const dynamic = "force-dynamic";

export default async function BriefsPage() {
  const { data: session } = await neonAuth.getSession();
  
  const currentUser = session?.user?.email ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, ranks: { select: { domain: true } } }
  }) as any : null;

  const isLab = currentUser?.role === "LAB";

  // Domain-overlap match scoring — researcher's rank domains vs brief's domain tags
  const userDomains = (currentUser?.ranks ?? []).map((r: any) => r.domain.toLowerCase());
  
  function computeMatchScore(briefDomains: string[]): number | null {
    if (!userDomains.length || !briefDomains.length) return null;
    const briefLower = briefDomains.map(d => d.toLowerCase());
    const overlap = briefLower.filter(d => userDomains.some((u: any) => u.includes(d) || d.includes(u)));
    return Math.round((overlap.length / briefLower.length) * 100);
  }

  const briefs = await prisma.researchBrief.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        include: { labProfile: true }
      }
    }
  }) as any;

  return (
    <div className="min-h-screen text-zinc-600">
      <TopNav user={session?.user} />
      
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="font-syne mb-2 text-4xl font-bold text-zinc-900 md:text-5xl">
              Open Projects
            </h1>
            <p className="max-w-2xl text-lg text-zinc-500">
              Discover active AI projects from labs and companies. 
              Submit a research proposal to initiate a verified collaboration.
            </p>
          </div>
          
          {isLab && (
            <button className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] px-6 text-sm font-bold text-zinc-900 transition-all hover:bg-[#6042db] active:scale-95 shadow-[0_0_20px_rgba(124,92,252,0.3)]">
              <Plus className="h-4 w-4" /> Post a Brief
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-5">
               <h3 className="font-syne mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
                 <Building className="h-4 w-4 text-[#7C5CFC]" /> 
                 For Labs
               </h3>
               <p className="mb-4 text-xs leading-relaxed text-zinc-500">
                 Labs on the Pro tier ($299/mo) can post up to 3 active briefs concurrently and use Scout Search.
               </p>
               {!isLab && (
                 <Link href="/pricing" className="block text-center rounded-lg bg-zinc-200 py-2 text-xs font-bold text-zinc-900 hover:bg-white/20 transition-colors">
                   Upgrade to Lab
                 </Link>
               )}
            </div>
            
            <div className="rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-xl shadow-sm p-5">
               <h3 className="font-syne mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900">
                 Filter Domains
               </h3>
               <div className="flex flex-wrap gap-2">
                 <button className="rounded-full bg-[#7C5CFC]/10 px-3 py-1.5 text-[11px] font-bold text-[#7C5CFC] transition-colors border border-[#7C5CFC]/20">
                   All Domains
                 </button>
                 <button className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 border border-zinc-200/50">
                   NLP & LLMs
                 </button>
                 <button className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 border border-zinc-200/50">
                   Computer Vision
                 </button>
                 <button className="rounded-full bg-zinc-100 px-3 py-1.5 text-[11px] font-semibold text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 border border-zinc-200/50">
                   Robotics
                 </button>
               </div>
               
               <h3 className="font-syne mt-6 mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900">
                 Company Type
               </h3>
               <div className="space-y-2">
                 <button className="w-full flex justify-between items-center rounded-lg bg-zinc-100/50 px-3 py-2 text-xs font-medium text-zinc-600 border border-zinc-200/50 hover:bg-zinc-100 transition-colors">
                   <span>Startups</span>
                   <span className="text-[10px] text-zinc-400">14</span>
                 </button>
                 <button className="w-full flex justify-between items-center rounded-lg bg-[#7C5CFC]/5 px-3 py-2 text-xs font-semibold text-[#7C5CFC] border border-[#7C5CFC]/20 transition-colors">
                   <span>Enterprise Labs</span>
                   <span className="text-[10px] bg-[#7C5CFC]/20 px-1.5 py-0.5 rounded-md text-[#7C5CFC]">8</span>
                 </button>
               </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-6">
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
                  matchScore={isLab ? null : computeMatchScore(brief.domain)}
                />
              )) : (
                <div className="rounded-2xl border border-dashed border-black/10 p-16 text-center">
                  <Briefcase className="mx-auto mb-4 h-12 w-12 text-zinc-500 opacity-50" />
                  <p className="text-sm font-medium text-zinc-500">No active briefs available right now.</p>
                  <p className="mt-1 text-xs text-zinc-500">Check back later or follow top labs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
