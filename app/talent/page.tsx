import { neonAuth } from "@/lib/neon/auth-server";
import { Metadata } from "next";
import { prismaDb as prisma } from "@/lib/prisma";
import { TopNav } from "@/components/network/TopNav";
import { ScoutSearch } from "@/components/network/ScoutSearch";
import { TalentDiscovery } from "@/components/network/TalentDiscovery";
import Link from "next/link";
import { TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Talent | StandexAI",
  description: "Find and collaborate with elite AI researchers and labs.",
};

export const dynamic = "force-dynamic";

export default async function DiscoverPage() {
  const { data: session } = await neonAuth.getSession();

  const currentUser = session?.user?.email ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, handle: true, ranks: { select: { domain: true } } }
  }) as any : null;

  const isLab = currentUser?.role === "LAB";

  // Scout Mode: find researchers matched to the Lab's active Brief domains
  let matchedResearchers: any[] = [];

  if (isLab && currentUser) {
    const labBriefs = await prisma.researchBrief.findMany({
      where: { companyId: currentUser.id, active: true },
      select: { domain: true }
    });
    const labDomains = [...new Set(labBriefs.flatMap(b => b.domain.map(d => d.toLowerCase())))];

    if (labDomains.length > 0) {
      const allResearchers = await prisma.user.findMany({
        where: { role: { in: ["RESEARCHER", "PRO", "ENGINEER"] } },
        include: {
          ranks: { orderBy: { rankPosition: "asc" }, take: 1, select: { domain: true, rankPosition: true, score: true } },
          workItems: { orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, type: true } }
        }
      }) as any;
      matchedResearchers = allResearchers.filter((r: any) =>
        r.ranks.some((rank: any) =>
          labDomains.some((d: any) => rank.domain.toLowerCase().includes(d) || d.includes(rank.domain.toLowerCase()))
        )
      ).slice(0, 6);
    }
  }

  const researchers = await prisma.user.findMany({
    where: { role: { in: ["RESEARCHER", "PRO", "ENGINEER"] } },
    take: 20, // Fetch more for the list view
    include: {
      workItems: { orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, type: true, abstract: true, tags: true, views: true, externalUrl: true } },
      ranks: { orderBy: { rankPosition: "asc" }, take: 1, select: { domain: true, rankPosition: true, score: true } }
    }
  }) as any;

  const totalResearchers = await prisma.user.count({ where: { role: { in: ["RESEARCHER", "PRO", "ENGINEER"] } } });
  const totalWork = await prisma.workItem.count();

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-[family-name:var(--font-inter)] selection:bg-[#7C5CFC]/20">
      <TopNav user={session?.user} />

      <main className="relative mx-auto max-w-[1440px] px-6 lg:px-12 py-10">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,252,0.03),transparent_70%)] pointer-events-none" />

        {/* Compact Interaction Hero */}
        <div className="relative z-20 mb-12 flex flex-col lg:flex-row items-center gap-10">
           {/* Search & Filters */}
           <div className="flex-1 w-full">
              <div className="rounded-[40px] border border-zinc-200 bg-white shadow-2xl shadow-zinc-200/20 p-2 backdrop-blur-xl">
                 <ScoutSearch isLab={isLab} />
              </div>
           </div>
           
           {/* Global Network Stats */}
           <div className="flex shrink-0 items-center gap-10">
              <div className="flex flex-col">
                 <span className="font-syne text-2xl font-black text-zinc-900 leading-none">{totalResearchers}</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] mt-2">Personnel</span>
              </div>
              <div className="h-10 w-px bg-zinc-200" />
              <div className="flex flex-col">
                 <span className="font-syne text-2xl font-black text-zinc-900 leading-none">{totalWork}</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2">Artifacts</span>
              </div>
              <div className="h-10 w-px bg-zinc-200" />
              <div className="flex flex-col">
                 <span className="font-syne text-2xl font-black text-emerald-500 leading-none">99.8%</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2">Reliability</span>
              </div>
           </div>
        </div>

        {/* Scout Dashboard (Labs Only) - More Compact */}
        {isLab && (
          <section className="mb-10">
            <div className="relative overflow-hidden rounded-[40px] border border-black/5 bg-white p-6 shadow-sm">
               <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                      <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-[#7C5CFC]/5 text-[#7C5CFC]">
                         <ShieldCheck className="h-6 w-6" />
                      </div>
                      <div>
                         <h2 className="font-syne text-sm font-black text-zinc-900 uppercase tracking-tight">Active Scout Matchmaking</h2>
                         <p className="text-[11px] font-medium text-zinc-400">Personnel matching your project requirements are highlighted in the directory below.</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <Link href="/projects" className="text-[10px] font-black uppercase tracking-widest text-[#7C5CFC] hover:underline">
                        Manage Research Briefs
                     </Link>
                     <div className="rounded-2xl bg-zinc-900 px-6 py-3 text-[10px] font-black text-white">
                        {matchedResearchers.length} Target Matches
                     </div>
                  </div>
               </div>
            </div>
          </section>
        )}

        {/* Talent Discovery Master-Detail View */}
        <TalentDiscovery 
          researchers={researchers} 
          currentUserEmail={session?.user?.email}
        />
      </main>
    </div>
  );
}
