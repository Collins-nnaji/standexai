import { notFound } from "next/navigation";
import Link from "next/link";
import { prismaDb as prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { TopNav } from "@/components/network/TopNav";
import { WorkItemCard } from "@/components/network/WorkItemCard";
import { ReputationBar } from "@/components/network/ReputationBar";
import { RankBadge } from "@/components/network/RankBadge";
import { EditProfileModal } from "@/components/network/EditProfileModal";
import { ProfileInviteButton } from "@/components/network/ProfileInviteButton";
import { User, ShieldCheck, MapPin, Briefcase, Eye, Users, Sparkles, ArrowLeft } from "lucide-react";
import { neonAuth } from "@/lib/neon/auth-server";

export default async function ResearcherProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: session } = await neonAuth.getSession();

  // Detect Lab viewer for Scout Mode CTA
  const viewerUser = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, role: true } })
    : null;
  const isLabViewer = viewerUser?.role === "LAB";

  const user = await prisma.user.findFirst({
    where: { 
      OR: [
        { handle: id },
        { id: id }
      ]
    },
    include: {
      ranks: true,
      workItems: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      signalsReceived: true,
      collabMemberships: {
        include: { collaboration: true }
      }
    }
  }) as any;

  if (!user) {
    return notFound();
  }

  const viewingOwnProfile = session?.user?.email === user.email;

  // Calculate signals
  const breakdown = {
    reproductions: user.signalsReceived.filter((s: any) => s.signalType === "reproduction").reduce((a: any, b: any) => a + b.value, 0),
    citations: user.signalsReceived.filter((s: any) => s.signalType === "citation").reduce((a: any, b: any) => a + b.value, 0),
    collabs: user.signalsReceived.filter((s: any) => s.signalType === "collab").reduce((a: any, b: any) => a + b.value, 0),
    reviews: user.signalsReceived.filter((s: any) => s.signalType === "review").reduce((a: any, b: any) => a + b.value, 0),
  };

  const isPro = user.role === "PRO";

  return (
    <div className="min-h-screen text-zinc-600">
      <TopNav user={session?.user} />
      
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 min-w-0">
          <Link
            href="/talent"
            className="group inline-flex max-w-full min-w-0 items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-colors hover:text-[#7C5CFC]"
          >
            <ArrowLeft className="h-3 w-3 shrink-0 transition-transform group-hover:-translate-x-1" />
            <span className="min-w-0 truncate sm:whitespace-normal">Back to Talent Directory</span>
          </Link>
        </div>

        {/* Profile Hero */}
        <div className="mb-12 flex flex-col items-start gap-8 sm:flex-row sm:items-center">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-[#7C5CFC]/20 bg-zinc-100 relative shadow-[0_0_30px_rgba(124,92,252,0.15)]">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name!} className="h-full w-full object-cover" />
            ) : (
              <User className="h-12 w-12 text-zinc-500" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <h1 className="font-syne text-3xl font-bold text-zinc-900 sm:text-4xl">{user.name}</h1>
              {user.verified && (
                <ShieldCheck className="h-6 w-6 text-[#7C5CFC]" />
              )}
              {user.ranks.length > 0 && (
                <RankBadge domain={user.ranks[0].domain} position={user.ranks[0].rankPosition || 0} />
              )}
            </div>

            <p className="mb-4 text-lg font-medium text-zinc-500">
              {user.bio || "AI Researcher"}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-zinc-500">
              {user.institution && (
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> {user.institution}</span>
              )}
              {user.location && (
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {user.location}</span>
              )}
              {user.openToWork && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-emerald-400 border border-emerald-500/20">
                  <Briefcase className="h-4 w-4" /> Available for opportunities
                </span>
              )}
              {viewingOwnProfile && (
                <EditProfileModal user={{ handle: user.handle, name: user.name, bio: user.bio, openToWork: user.openToWork }} />
              )}
            </div>
          </div>
        </div>

        {/* Action CTAs — shown to other logged-in users */}
        {viewerUser && !viewingOwnProfile && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <ProfileInviteButton targetUserId={user.id} targetUserName={user.name || "Researcher"} />
            {isLabViewer && (
              <button className="flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#7C5CFC] hover:shadow-[0_0_15px_rgba(124,92,252,0.4)] transition-all active:scale-95">
                <Sparkles className="h-4 w-4" /> Scout &amp; Hire
              </button>
            )}
          </div>
        )}

        {/* Private Analytics Bar (Only Pro + Owner) */}
        {viewingOwnProfile && isPro && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-[#7C5CFC]/20 bg-[#7C5CFC]/10 px-5 py-3">
            <Eye className="h-5 w-5 text-[#7C5CFC]" />
            <span className="text-sm font-bold text-zinc-900">Your profile was viewed by 14 Labs this week.</span>
          </div>
        )}


        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* Reputation Section */}
            <section>
              <h2 className="font-syne mb-6 text-2xl font-bold text-zinc-900">Reputation</h2>
              <ReputationBar breakdown={breakdown} />
            </section>

            {/* Work Section */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-syne text-2xl font-bold text-zinc-900">Published Work</h2>
                {viewingOwnProfile && (
                  <Link href="/work/new" className="rounded-lg bg-[#7C5CFC] px-4 py-2 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#6042db] hover:shadow-md">
                    + Publish Work
                  </Link>
                )}
              </div>
              
              <div className="space-y-4">
                {user.workItems.length > 0 ? user.workItems.map((work: any) => (
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
                  />
                )) : (
                  <div className="rounded-2xl border border-dashed border-black/10 p-12 text-center text-zinc-500">
                    No work published to the network yet.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <section className="rounded-2xl border border-black/5 bg-white shadow-sm p-6">
              <h2 className="font-syne mb-6 text-xl font-bold text-zinc-900">Collaboration History</h2>
              
              <ul className="space-y-4">
                {user.collabMemberships.length > 0 ? user.collabMemberships.map((collab: any) => (
                  <li key={collab.collabId}>
                    <Link href={`/collab/${collab.collabId}`} className="group flex items-center gap-3 rounded-xl hover:bg-zinc-50 p-2 transition-colors -mx-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 border border-black/10 transition-colors group-hover:border-[#7C5CFC]/30 group-hover:bg-[#7C5CFC]/10">
                        <Briefcase className="h-4 w-4 text-[#7C5CFC]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-zinc-900 group-hover:text-[#7C5CFC] transition-colors">
                          {collab.collaboration.title}
                        </p>
                        <p className="text-xs text-zinc-500">{collab.role} · {collab.collaboration.status}</p>
                      </div>
                    </Link>
                  </li>
                )) : (
                  <li className="text-sm text-zinc-500">No public collaborations.</li>
                )}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
