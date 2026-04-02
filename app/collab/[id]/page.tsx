import { prismaDb as prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import { TopNav } from "@/components/network/TopNav";
import { CollabRoom } from "@/components/network/CollabRoom";
import { CollabPublishPanel } from "@/components/network/CollabPublishPanel";
import { CollabInvitePanel } from "@/components/network/CollabInvitePanel";
import { CollabDiscussion } from "@/components/network/CollabDiscussion";
import { neonAuth } from "@/lib/neon/auth-server";
import Link from "next/link";
import {
  Users, FileText, CheckCircle, Share2,
  MessageSquare, AlertCircle, ExternalLink, Zap
} from "lucide-react";

export default async function CollabRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: session } = await neonAuth.getSession();

  const collab = await prisma.collaboration.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: { select: { id: true, name: true, handle: true, avatar: true, role: true } } }
      },
      brief: {
        select: {
          id: true,
          title: true,
          description: true,
          lookingFor: true,
          domain: true,
          company: { include: { labProfile: true } }
        }
      }
    }
  }) as any;

  if (!collab) return notFound();

  const currentUser = session?.user?.email
    ? await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, name: true } })
    : null;

  const isMember = currentUser
    ? collab.members.some((m: any) => m.userId === currentUser.id)
    : false;

  const isOwner = currentUser
    ? collab.members.some((m: any) => m.userId === currentUser.id && m.role === "owner")
    : false;

  if (collab.visibility === "private" && !isMember) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-zinc-400" />
          <h2 className="font-syne text-2xl font-bold text-zinc-900">Private Room</h2>
          <p className="mt-2 text-zinc-500">You must be a contributor to enter this workspace.</p>
        </div>
      </div>
    );
  }

  const isCompleted = collab.status === "completed";

  return (
    <div className="min-h-screen text-zinc-700">
      <TopNav user={session?.user} />

      {/* Room Header */}
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-4 py-6 sm:px-6">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-3">
              <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider border ${
                isCompleted
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-[#7C5CFC]/10 text-[#7C5CFC] border-[#7C5CFC]/20"
              }`}>
                {collab.status}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
                <Users className="h-3 w-3" /> {collab.members.length} Contributors
              </span>
            </div>
            <h1 className="font-syne text-2xl font-bold text-zinc-900 md:text-3xl">{collab.title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Member Avatars */}
            <div className="flex -space-x-2">
              {collab.members.slice(0, 5).map((m: any) => (
                <Link key={m.userId} href={`/r/${m.user.handle || m.userId}`} title={`${m.user.name} (${m.role})`}
                  className="relative z-0 hover:z-10 transition-transform hover:scale-110"
                >
                  <div className="h-9 w-9 rounded-full border-2 border-white bg-zinc-100 overflow-hidden shadow-sm">
                    {m.user.avatar ? (
                      <img src={m.user.avatar} alt={m.user.name || "User"} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-500">
                        {(m.user.name || "?")[0]}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-zinc-200 mx-1 hidden sm:block" />

            <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-900">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Linked Research Brief */}
        {collab.brief && (
          <div className="mb-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-600">
                <Zap className="h-4 w-4 fill-amber-500" /> Source Brief
              </p>
              <Link href={`/briefs`} className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
                View all briefs <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
            <h2 className="font-syne mb-2 text-xl font-bold text-zinc-900">{collab.brief.title}</h2>
            <p className="mb-3 text-sm leading-relaxed text-zinc-600 max-w-3xl">{collab.brief.description}</p>
            <div className="flex flex-wrap gap-2">
              {collab.brief.domain.map((tag: string) => (
                <span key={tag} className="rounded-md bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {!collab.brief && (
          <div className="mb-8 rounded-2xl border border-zinc-200/60 bg-white/60 backdrop-blur-sm p-6">
            <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-zinc-400">Room Objective</h2>
            <p className="text-sm font-medium leading-relaxed text-zinc-600 max-w-4xl">
              {collab.description || "No objective set for this room."}
            </p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main Canvas */}
          <div className="min-w-0 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-syne text-xl font-bold text-zinc-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#7C5CFC]" /> Shared Canvas
              </h2>
              {isMember && !isCompleted && (
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-600">
                  ● Live
                </span>
              )}
            </div>
            <div className={isCompleted || !isMember ? "pointer-events-none opacity-70" : ""}>
              <CollabRoom />
            </div>

            {/* Publish Panel — only for active members */}
            {isMember && !isCompleted && (
              <CollabPublishPanel collabId={id} briefTitle={collab.brief?.title} />
            )}

            {isCompleted && collab.publishedWorkItemId && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-6 flex items-center gap-4">
                <CheckCircle className="h-8 w-8 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-syne font-bold text-zinc-900">Work Published</p>
                  <p className="text-sm text-zinc-500">This collaboration has been published to all members&apos; profiles.</p>
                  <Link href={`/work/${collab.publishedWorkItemId}`} className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:underline">
                    View Published Work <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Chat Placeholder */}
            <CollabDiscussion collabId={id} isMember={isMember} />

            {/* Invite Panel */}
            {isOwner && !isCompleted && (
              <CollabInvitePanel collabId={id} />
            )}

            {/* Members List */}
            <div className="rounded-2xl border border-zinc-200/60 bg-white/70 backdrop-blur-md p-5">
              <h3 className="font-syne mb-4 text-sm font-bold uppercase tracking-wider text-zinc-900">
                Contributors
              </h3>
              <ul className="space-y-3">
                {collab.members.map((m: any) => (
                  <li key={m.userId}>
                    <Link href={`/r/${m.user.handle || m.userId}`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-zinc-50 transition-colors group">
                      <div className="h-9 w-9 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200 shrink-0">
                        {m.user.avatar ? (
                          <img src={m.user.avatar} alt={m.user.name || ""} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-400">
                            {(m.user.name || "?")[0]}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-900 group-hover:text-[#7C5CFC] transition-colors truncate">{m.user.name}</p>
                        <p className="text-[11px] capitalize text-zinc-500">{m.role}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
