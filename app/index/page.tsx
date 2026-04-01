import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { TopNav } from "@/components/network/TopNav";
import { neonAuth } from "@/lib/neon/auth-server";
import { Share2, TrendingUp, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "AI Index | Weekly Top Research",
  description: "The top 10 most impactful AI research works this week based on verified peer reproductions and citations.",
  openGraph: {
    title: "AI Index | Weekly Top Research",
    description: "The top 10 most impactful AI research works this week based on verified peer reproductions and citations.",
    images: [{ url: "/api/og/index" }], // Mock route for OG generation
  },
};

export default async function IndexPage() {
  const { data: session } = await neonAuth.getSession();

  // Compute signal velocity: sum of signal values in last 7 days grouped by work item
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Note: Prisma aggregate grouping is great, but we can also just fetch signals and map it (easier for mock data)
  // Finding Top Work Items
  const popularWorks = await prisma.workItem.findMany({
    take: 10,
    include: {
      user: { select: { id: true, name: true, institution: true } },
      reputationSignals: {
        where: { createdAt: { gte: sevenDaysAgo } }
      }
    }
  });

  // Calculate scores and sort
  const scoredWorks = popularWorks.map(w => {
    const weeklyScore = w.reputationSignals.reduce((acc, sig) => acc + sig.value, 0);
    return { ...w, weeklyScore };
  }).sort((a, b) => b.weeklyScore - a.weeklyScore).slice(0, 10);

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-zinc-600">
      <TopNav user={session?.user} />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="relative mx-auto mb-8 flex flex-col items-center justify-center">
            {/* The Mark of Approval Container */}
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-zinc-200/50">
              <div className="absolute inset-0 animate-pulse rounded-full bg-[#7C5CFC]/5 blur-xl group-hover:bg-[#7C5CFC]/10" />
              <Image 
                src="/standexailogo.png" 
                alt="StandexAI Logo" 
                width={80} 
                height={24} 
                className="relative z-10 w-20 object-contain"
              />
              {/* Approval Badge */}
              <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1 shadow-md ring-1 ring-zinc-200">
                <CheckCircle2 className="h-6 w-6 text-[#7C5CFC] fill-[#7C5CFC] text-white" />
              </div>
            </div>
            
            <h1 className="font-syne mt-8 text-5xl font-bold tracking-tight text-zinc-900 md:text-6xl">
              AI Index
            </h1>
          </div>
          <p className="text-xl leading-relaxed text-zinc-500">
            The defining weekly benchmark of AI research velocity. 
            Ranked by peer reproductions, citations, and completions in the last 7 days.
          </p>
          <div className="mt-8">
            <button className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-zinc-100 px-6 py-2.5 text-sm font-bold text-zinc-900 transition-colors hover:bg-zinc-200">
              <Share2 className="h-4 w-4" /> Share Leaderboard
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white shadow-sm shadow-2xl overflow-hidden relative">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[#7C5CFC] to-transparent opacity-50" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-black/20 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="px-6 py-4 font-bold">Rank</th>
                  <th className="px-6 py-4 font-bold">Work Title</th>
                  <th className="px-6 py-4 font-bold">Primary Domain</th>
                  <th className="px-6 py-4 font-bold text-right">Velocity Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scoredWorks.length > 0 ? scoredWorks.map((work, index) => (
                  <tr key={work.id} className="group transition-colors hover:bg-zinc-100">
                    <td className="px-6 py-6">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                        index === 0 ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" :
                        index === 1 ? "bg-zinc-300/20 text-zinc-600 border border-zinc-300/30" :
                        index === 2 ? "bg-amber-700/20 text-amber-600 border border-amber-700/30" :
                        "bg-zinc-100 text-zinc-500"
                      }`}>
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-6 min-w-[300px]">
                      <Link href={`/work/${work.id}`} className="block">
                        <p className="font-syne text-lg font-bold text-zinc-900 group-hover:text-[#7C5CFC] transition-colors line-clamp-1">{work.title}</p>
                        <p className="mt-1 text-xs text-zinc-500">by {work.user.name}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-6 text-zinc-500">
                      <span className="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold">
                        {work.tags[0] || "AI Research"}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 font-bold text-emerald-400">
                        <TrendingUp className="h-4 w-4" />
                        <span className="text-lg">{work.weeklyScore > 0 ? work.weeklyScore : "—"}</span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                     <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 shadow-inner">
                        Building the intelligence graph. Results will populate shortly.
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
