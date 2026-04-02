import { neonAuth } from "@/lib/neon/auth-server";
import { Metadata } from "next";
import { prismaDb as prisma } from "@/lib/prisma";
import { TopNav } from "@/components/network/TopNav";
import { ScoutSearch } from "@/components/network/ScoutSearch";
import { TalentCard } from "@/components/network/TalentCard";
import { WorkItemCard } from "@/components/network/WorkItemCard";
import { TalentInterests } from "@/components/network/TalentInterests";
import { PublicationActions } from "@/components/network/PublicationManager";
import { UserAvatar } from "@/components/network/UserAvatar";
import Link from "next/link";
import { Eye, Users, Zap, Sparkles, TrendingUp, ShieldCheck, ArrowUpRight } from "lucide-react";

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
        where: { role: { in: ["RESEARCHER", "PRO"] } },
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
    where: { role: { in: ["RESEARCHER", "PRO"] } },
    take: 9,
    include: {
      workItems: { orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, type: true } },
      ranks: { orderBy: { rankPosition: "asc" }, take: 1, select: { domain: true, rankPosition: true, score: true } }
    }
  }) as any;

  const recentWork = await prisma.workItem.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, handle: true, avatar: true } } }
  });

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-[family-name:var(--font-inter)] selection:bg-[#7C5CFC]/20">
      <TopNav user={session?.user} />

      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,252,0.05),transparent_70%)] pointer-events-none" />

        {/* Compressed Discovery Hero */}
        <div className="relative mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/10 bg-white/60 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-widest text-[#7C5CFC] shadow-sm">
            <TrendingUp className="h-3 w-3" /> Reputation Directory
          </div>
          <h1 className="font-syne mb-3 text-3xl font-black tracking-tight text-zinc-900 md:text-5xl leading-tight">
            Elite AI <span className="text-[#7C5CFC]">Talent.</span>
          </h1>
          <p className="mx-auto max-w-xl text-sm font-medium text-zinc-500 leading-relaxed">
            The world's first reputation-verified network for frontier AI research. Find your next high-impact collaborator.
          </p>
        </div>

        {/* Tighter Search Bar */}
        <div className="relative z-20 mb-12 max-w-2xl mx-auto">
          <div className="rounded-3xl border border-zinc-200 bg-white/80 p-1.5 shadow-xl backdrop-blur-xl">
             <ScoutSearch isLab={isLab} />
          </div>
        </div>

        {/* Scout Dashboard (Labs Only) */}
        {isLab && (
          <section className="mb-24">
            <div className="relative overflow-hidden rounded-[32px] border border-[#7C5CFC]/20 bg-white p-8 shadow-2xl shadow-[#7C5CFC]/5 md:p-12">
               <div className="absolute top-0 right-0 h-64 w-64 bg-[radial-gradient(circle_at_100%_0%,rgba(124,92,252,0.1),transparent_70%)] pointer-events-none" />
               <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="max-w-xl text-left">
                     <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-[#7C5CFC]/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#7C5CFC]">
                        <ShieldCheck className="h-3.5 w-3.5" /> Scout Matching Active
                     </div>
                     <h2 className="font-syne text-3xl font-black text-zinc-900 md:text-4xl leading-tight mb-4">
                        Collaborator <br className="hidden md:block" />Matchmaking.
                     </h2>
                     <p className="text-base font-medium text-zinc-500 leading-relaxed">
                        Verified researchers matching your AI project briefs are algorithmically highlighted. Every match is backed by peer-verified reproduction signals.
                     </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                     <div className="flex flex-col items-center justify-center rounded-3xl bg-zinc-50 border border-zinc-100 p-6 shadow-inner w-32 h-32">
                        <span className="font-syne text-3xl font-black text-[#7C5CFC]">{matchedResearchers.length}</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Matches</span>
                     </div>
                     <Link href="/briefs" className="flex items-center gap-2 rounded-2xl bg-zinc-900 px-6 py-4 text-sm font-black text-white hover:bg-[#7C5CFC] transition-all active:scale-95 shadow-xl shadow-zinc-900/20">
                        Manage Briefs <ArrowUpRight className="h-4 w-4" />
                     </Link>
                  </div>
               </div>

               {/* Matched Grid */}
               {matchedResearchers.length > 0 && (
                 <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                   {matchedResearchers.map((user: any) => (
                      <TalentCard key={user.id} {...user} domain={user.ranks[0]?.domain || "AI Research"} rankPosition={user.ranks[0]?.rankPosition || null} isScoutView={true} />
                   ))}
                 </div>
               )}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Main Feed: Elite Researchers */}
          <div className="flex-1">
            <div className="mb-10 flex items-center justify-between border-b border-zinc-100 pb-6">
              <h2 className="font-syne text-2xl font-black text-zinc-900 md:text-3xl">Elite Researchers</h2>
              <div className="flex gap-2">
                 <button className="rounded-full bg-white border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-500 hover:border-[#7C5CFC] hover:text-[#7C5CFC] transition-all">Most Impact</button>
                 <button className="rounded-full bg-white border border-zinc-200 px-4 py-2 text-xs font-bold text-zinc-500 hover:border-[#7C5CFC] hover:text-[#7C5CFC] transition-all">Trending</button>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {researchers.length > 0 ? researchers.map((user: any) => (
                 <TalentCard key={user.id} {...user} domain={user.ranks[0]?.domain || "AI Research"} rankPosition={user.ranks[0]?.rankPosition || null} isScoutView={isLab} />
              )) : (
                <div className="col-span-2 rounded-[32px] border border-dashed border-zinc-200 py-32 text-center text-zinc-400">
                  <span className="font-syne font-black text-xl uppercase tracking-widest">Awaiting Signal</span>
                </div>
              )}
            </div>

            <div className="mt-12 flex justify-center">
              <button className="rounded-full border border-zinc-200 bg-white px-8 py-3 text-sm font-bold text-zinc-600 transition-all hover:border-[#7C5CFC] hover:text-[#7C5CFC]">
                Load More Researchers
              </button>
            </div>
          </div>

          {/* Sidebar: The Signal Stream & Controls */}
          <div className="lg:w-[400px] shrink-0">
            <div className="sticky top-28 space-y-8">
              
              <div className="mb-10">
                <div className="mb-6 flex items-center justify-between border-b border-zinc-100 pb-4">
                  <h2 className="font-syne text-2xl font-black text-zinc-900 md:text-3xl">Signal Stream</h2>
                  <div className="flex h-2 w-2 rounded-full bg-[#7C5CFC] animate-pulse" />
                </div>

                <div className="space-y-4">
                  {recentWork.length > 0 ? recentWork.map((work: any) => (
                    <div key={work.id} className="group relative rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-[#7C5CFC]/30 hover:shadow-xl">
                       <div className="mb-4 flex items-center gap-3">
                          <Link href={`/r/${work.user.handle || work.user.id}`} className="transition-transform hover:scale-105 active:scale-95">
                             <UserAvatar src={work.user.avatar} name={work.user.name} size="sm" className="h-8 w-8 border border-zinc-100" />
                          </Link>
                          <div className="flex flex-col">
                             <Link href={`/r/${work.user.handle || work.user.id}`} className="text-xs font-black text-zinc-900 leading-none hover:text-[#7C5CFC] transition-colors">
                                {work.user.name}
                             </Link>
                             <p className="text-[9px] font-bold text-[#7C5CFC] uppercase tracking-widest mt-1">Verified Reproduction</p>
                          </div>
                          <Link href={`/work/${work.id}`} className="ml-auto group/arrow">
                             <ArrowUpRight className="h-4 w-4 text-zinc-300 group-hover/arrow:text-[#7C5CFC] transition-colors" />
                          </Link>
                       </div>
                       <Link href={`/work/${work.id}`} className="block">
                          <h4 className="font-syne text-sm font-bold text-zinc-800 leading-tight mb-2 group-hover:text-[#7C5CFC] transition-colors">{work.title}</h4>
                       </Link>
                       <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-zinc-50 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-zinc-400">{work.type}</span>
                          <div className="h-0.5 w-0.5 rounded-full bg-zinc-200" />
                          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">2h ago</span>
                       </div>

                       {/* Impact Gain Visualization */}
                       <div className="absolute top-4 right-4 text-[10px] font-black text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity translate-y-1 group-hover:translate-y-0 duration-300">
                          +15 Impact
                       </div>
                    </div>
                  )) : (
                    <div className="rounded-[32px] border border-dashed border-zinc-200 p-12 text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Listening for signals...
                    </div>
                  )}
                </div>
              </div>

              {/* Controls at Bottom */}
              <div className="space-y-4 pt-8 border-t border-zinc-100">
                <PublicationActions />
                <TalentInterests />

                <div className="mt-8 rounded-[32px] border border-emerald-500/20 bg-emerald-50/50 p-6">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-emerald-500/20">
                         <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <h5 className="font-syne text-sm font-bold text-zinc-900">Network Momentum</h5>
                   </div>
                   <p className="text-[11px] font-medium leading-relaxed text-zinc-500">
                      The network matches are accelerating. 12 verified collaborations formed in the last 24 hours.
                   </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
