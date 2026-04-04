import { notFound } from "next/navigation";
import Link from "next/link";
import { prismaDb as prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

import { TopNav } from "@/components/network/TopNav";
import { ImpactCard } from "@/components/network/ImpactCard";
import { WorkItemCard } from "@/components/network/WorkItemCard";
import { ExternalLink, Users, FileText, Share2, Eye, MessageSquare } from "lucide-react";
import { neonAuth } from "@/lib/neon/auth-server";

export default async function WorkItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await neonAuth.getSession();

  const work = await prisma.workItem.findUnique({
    where: { id },
    include: {
      user: true,
      reputationSignals: {
        include: { fromUser: { select: { id: true, name: true, avatar: true } } }
      }
    }
  }) as any;

  if (!work) {
    return notFound();
  }

  // Increment view (in a real app, this would be a client side fetch or done safely via a specialized route to avoid cache busting)
  // For demo logic we'll just increment it lazily if someone visits
  const isOwner = session?.user?.email 
    ? await prisma.user.findFirst({ where: { email: session.user.email, id: work.userId } }) !== null
    : false;
  
  await prisma.workItem.update({ where: { id: work.id }, data: { views: { increment: 1 } } }) as any;

  const reproductions = work.reputationSignals.filter((s: any) => s.signalType === "reproduction");
  const citations = work.reputationSignals.filter((s: any) => s.signalType === "citation");

  // Optional: fetch related work by matching some tags
  const related = await prisma.workItem.findMany({
    where: { 
      id: { not: work.id },
      tags: { hasSome: work.tags || [] } 
    },
    take: 3,
    include: { user: { select: { id: true, name: true } } }
  }) as any;

  return (
    <div className="min-h-screen text-zinc-600">
      <TopNav user={session?.user} />
      
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[#7C5CFC]/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#7C5CFC] border border-[#7C5CFC]/30">
              {work.type}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-zinc-500">
              <Eye className="h-4 w-4" /> {work.views + 1} views
            </span>
          </div>

          <h1 className="font-syne mb-6 text-3xl font-bold leading-tight text-zinc-900 sm:text-5xl">
            {work.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 border-b border-black/10 pb-8">
            <Link href={`/r/${work.user.id}`} className="group flex items-center gap-3">
              <div className="flex h-10 w-10 overflow-hidden rounded-full bg-zinc-100">
                {work.user.avatar && (
                  <img src={work.user.avatar} alt="Author" className="h-full w-full object-cover" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 group-hover:text-[#7C5CFC] transition-colors">{work.user.name}</p>
                <p className="text-xs text-zinc-500">{work.user.institution || "Independent Researcher"}</p>
              </div>
            </Link>

            {work.fileUrl && (
              <a 
                href={work.fileUrl} 
                target="_blank" 
                rel="noreferrer"
                className="ml-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-bold text-white transition-transform hover:scale-105 shadow-[0_4px_15px_rgba(16,185,129,0.3)]"
              >
                <FileText className="h-4 w-4" /> Download Artifact
              </a>
            )}

            {work.externalUrl && (
              <a 
                href={work.externalUrl} 
                target="_blank" 
                rel="noreferrer"
                className={`${work.fileUrl ? '' : 'ml-auto'} inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-black/10 px-5 py-2.5 text-sm font-bold text-zinc-900 shadow-sm transition-transform hover:scale-105`}
              >
                <FileText className="h-4 w-4" /> Read Full Resource
                <ExternalLink className="h-4 w-4 opacity-50 text-zinc-500" />
              </a>
            )}

            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-zinc-100 text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900" title="Share via Standex Index">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {isOwner && work.user.role === "PRO" && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-5 py-3">
            <Users className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-bold text-zinc-900">Advanced scout metrics: 3 labs viewed this resource in the last 48 hours.</span>
          </div>
        )}

        <div className="mb-12">
          <ImpactCard 
            problemSolved={work.problemSolved} 
            improvesOn={work.improvesOn} 
          />
        </div>

        <div className="mb-12">
          <h2 className="font-syne mb-4 text-2xl font-bold text-zinc-900">Abstract Snapshot</h2>
          <div className="rounded-2xl border border-black/5 bg-white shadow-sm p-6 text-sm leading-relaxed text-zinc-600">
            {work.abstract}
          </div>
        </div>

        <div className="mb-12 flex flex-wrap gap-2">
          {work.tags.map((t: any) => (
            <span key={t} className="rounded-full bg-zinc-100 border border-black/5 px-3 py-1 text-xs font-semibold text-zinc-500">
              {t}
            </span>
          ))}
        </div>

        {/* Dynamic Signals List */}
        <div className="mb-16 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="font-syne mb-4 text-xl font-bold text-zinc-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">{reproductions.length}</span> Reproductions
            </h3>
            {reproductions.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No verified reproductions yet.</p>
            ) : (
              <ul className="space-y-3">
                {reproductions.map((rep: any) => (
                  <li key={rep.id} className="flex items-center gap-3 rounded-xl border border-black/5 bg-zinc-100 p-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 shrink-0 overflow-hidden">
                      {rep.fromUser?.avatar && <img src={rep.fromUser.avatar} alt="User" className="h-full w-full object-cover" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-zinc-900 truncate">{rep.fromUser?.name}</p>
                      <p className="text-xs text-zinc-500 truncate">Verified reproduction</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
             <h3 className="font-syne mb-4 text-xl font-bold text-zinc-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">{citations.length}</span> Citations
            </h3>
            {citations.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No indexed citations yet.</p>
            ) : (
              <ul className="space-y-3">
                {citations.map((cit: any) => (
                  <li key={cit.id} className="flex items-center gap-3 rounded-xl border border-black/5 bg-zinc-100 p-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-zinc-900 truncate">{cit.fromUser?.name} cited this contextually</p>
                      <p className="text-xs text-zinc-500 truncate">in related peer review</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Simple Comment Thread UI */}
        <div className="mb-16 rounded-2xl border border-black/5 bg-white shadow-sm p-6 lg:p-8">
          <h3 className="font-syne flex items-center gap-2 text-xl font-bold text-zinc-900 mb-6">
            <MessageSquare className="h-5 w-5 text-zinc-500" /> Peer Comments Thread
          </h3>
          <div className="mb-6 rounded-xl border border-black/10 p-4">
            <textarea 
              rows={3} 
              placeholder="Add your peer review thoughts..." 
              className="mb-3 w-full resize-none border-none bg-transparent text-sm text-zinc-900 placeholder-zinc-600 focus:outline-none focus:ring-0" 
            />
            <div className="flex items-center justify-end">
              <button disabled className="rounded-lg bg-[#7C5CFC] px-4 py-2 text-xs font-bold text-white opacity-50">Post Review</button>
            </div>
          </div>
          <div className="py-8 text-center text-sm text-zinc-500">
            Be the first to leave a verified peer review on this work.
          </div>
        </div>

        {/* Related Work */}
        {related.length > 0 && (
          <div>
            <h2 className="font-syne mb-6 text-2xl font-bold text-zinc-900">Related Work in "{work.tags[0]}"</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((r: any) => (
                <WorkItemCard
                  key={r.id}
                  id={r.id}
                  type={r.type}
                  title={r.title}
                  abstract={r.abstract}
                  tags={r.tags}
                  views={r.views}
                  authorName={r.user.name}
                  authorId={r.user.id}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
