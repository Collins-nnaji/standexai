import { neonAuth } from "@/lib/neon/auth-server";

export const dynamic = "force-dynamic";
import { prismaDb as prisma } from "@/lib/prisma";
import { TopNav } from "@/components/network/TopNav";
import { ScoutSearch } from "@/components/network/ScoutSearch";
import { TalentCard } from "@/components/network/TalentCard";
import { WorkItemCard } from "@/components/network/WorkItemCard";
import Link from "next/link";
import { Eye, Users, Zap } from "lucide-react";

export default async function DiscoverPage() {
  const { data: session } = await neonAuth.getSession();

  const currentUser = session?.user?.email ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, ranks: { select: { domain: true } } }
  }) as any : null;

  const isLab = currentUser?.role === "LAB";

  // Scout Mode: find researchers matched to the Lab's active Brief domains
  let matchedResearchers: {
    id: string; name: string | null; avatar: string | null; bio: string | null;
    institution: string | null; openToWork: boolean;
    ranks: { domain: string; rankPosition: number | null; score: number }[];
    workItems: { id: string; title: string; type: string }[];
  }[] = [];

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
      }) as any; // Cast for filter logic compatibility
      matchedResearchers = allResearchers.filter((r: any) =>
        r.ranks.some((rank: any) =>
          labDomains.some((d: any) => rank.domain.toLowerCase().includes(d) || d.includes(rank.domain.toLowerCase()))
        )
      ).slice(0, 6);
    }
  }

  const researchers = await prisma.user.findMany({
    where: { role: { in: ["RESEARCHER", "PRO"] } },
    take: 6,
    include: {
      workItems: { orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, type: true } },
      ranks: { orderBy: { rankPosition: "asc" }, take: 1, select: { domain: true, rankPosition: true, score: true } }
    }
  }) as any;

  const recentWork = await prisma.workItem.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true } } }
  });

  return (
    <div className="min-h-screen text-zinc-600">
      <TopNav user={session?.user} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Scout Mode Banner (Labs only) */}
        {isLab && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-[#7C5CFC]/20 bg-gradient-to-r from-[#7C5CFC]/10 via-transparent to-transparent p-5 flex items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/20">
              <Eye className="h-6 w-6 text-[#7C5CFC]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-syne font-bold text-zinc-900 flex items-center gap-2">
                Collaborator Matching Active <Zap className="h-4 w-4 text-[#7C5CFC] fill-[#7C5CFC]" />
              </p>
              <p className="text-sm text-zinc-500">Verified researchers matching your AI project briefs are highlighted below. Reputation signals are peer-verified for high-impact matching.</p>
            </div>
            <Link href="/briefs" className="hidden sm:flex shrink-0 items-center gap-2 rounded-xl bg-[#7C5CFC] px-4 py-2 text-sm font-bold text-white hover:bg-[#6042db] transition-colors">
              View My Briefs
            </Link>
          </div>
        )}

        <div className="mb-10 text-center">
          <h1 className="font-syne mb-4 text-4xl font-bold text-zinc-900 md:text-5xl">
            Discover <span className="text-[#7C5CFC]">AI Collaborators</span> & Research
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-500">
            Browse the latest papers, models, and datasets from top researchers, or find your next collaboration.
          </p>
        </div>

        <div className="mb-12">
          <ScoutSearch isLab={isLab} />
        </div>

        {/* Scout Matched Section (Labs with active briefs) */}
        {isLab && matchedResearchers.length > 0 && (
          <section className="mb-12">
            <div className="mb-6 flex items-center gap-3">
              <h2 className="font-syne text-2xl font-bold text-zinc-900">Project Collaborators</h2>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-600">
                {matchedResearchers.length} found
              </span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {matchedResearchers.map((user: any) => (
                <TalentCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  avatar={user.avatar}
                  bio={user.bio}
                  institution={user.institution}
                  openToWork={user.openToWork}
                  domain={user.ranks[0]?.domain || "AI Research"}
                  rankPosition={user.ranks[0]?.rankPosition || null}
                  workItems={user.workItems}
                  isScoutView={true}
                />
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-col gap-12 lg:flex-row">
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-syne text-2xl font-bold text-zinc-900">Top Researchers</h2>
              <Link href="/collab/new" className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC] transition-all">
                <Users className="h-4 w-4" /> New Collab Room
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {researchers.length > 0 ? researchers.map((user: any) => (
                <TalentCard
                  key={user.id}
                  id={user.id}
                  name={user.name}
                  avatar={user.avatar}
                  bio={user.bio}
                  institution={user.institution}
                  openToWork={user.openToWork}
                  domain={user.ranks[0]?.domain || "AI Research"}
                  rankPosition={user.ranks[0]?.rankPosition || null}
                  workItems={user.workItems}
                  isScoutView={isLab}
                />
              )) : (
                <div className="col-span-2 rounded-2xl border border-dashed border-black/10 p-12 text-center text-zinc-500">
                  No researchers found on the network yet.
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-[400px] shrink-0">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-syne text-2xl font-bold text-zinc-900">Latest Work</h2>
            </div>

            <div className="space-y-4">
              {recentWork.length > 0 ? recentWork.map((work: any) => (
                <WorkItemCard
                  key={work.id}
                  id={work.id}
                  type={work.type}
                  title={work.title}
                  abstract={work.abstract}
                  tags={work.tags}
                  views={work.views}
                  externalUrl={work.externalUrl}
                  fileUrl={work.fileUrl}
                  authorName={work.user.name}
                  authorId={work.user.id}
                  collaborationId={work.collaborationId}
                  coAuthors={work.coAuthors}
                />
              )) : (
                <div className="rounded-2xl border border-dashed border-black/10 p-8 text-center text-sm text-zinc-500">
                  No recent work published yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
