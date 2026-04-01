import { NextRequest, NextResponse } from "next/server";
import { prismaDb as prisma } from "@/lib/prisma";
import { neonAuth } from "@/lib/neon/auth-server";

// POST /api/collabs/[id]/publish — Co-publish work, mark collab complete, award reputation
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: collabId } = await params;
    const { data: session } = await neonAuth.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestingUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    if (!requestingUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Fetch the collab with all members
    const collab = await prisma.collaboration.findUnique({
      where: { id: collabId },
      include: {
        members: { include: { user: { select: { id: true, name: true } } } },
        brief: { select: { id: true, title: true, domain: true } }
      }
    });

    if (!collab) return NextResponse.json({ error: "Collaboration not found" }, { status: 404 });
    if (collab.status === "completed") {
      return NextResponse.json({ error: "This room has already been published" }, { status: 400 });
    }

    // Only members can publish
    const isMember = collab.members.some((m: any) => m.userId === requestingUser.id);
    if (!isMember) return NextResponse.json({ error: "You are not a member of this room" }, { status: 403 });

    const body = await req.json();
    const { title, abstract, impactSummary, problemSolved, improvesOn, tags, externalUrl } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Work item title is required" }, { status: 400 });
    }

    const allMemberIds = collab.members.map((m: any) => m.userId);
    const ownerMember = collab.members.find((m: any) => m.role === "owner");
    const primaryAuthorId = ownerMember?.userId ?? requestingUser.id;

    // Build domain tags from linked brief + custom tags
    const briefDomains = collab.brief?.domain ?? [];
    const allTags = [...new Set([...(tags ?? []), ...briefDomains])];

    // 1. Create the co-published WorkItem on the owner's profile
    const workItem = await prisma.workItem.create({
      data: {
        userId: primaryAuthorId,
        type: "collab_experiment",
        title: title.trim(),
        abstract: abstract?.trim() || collab.description,
        impactSummary: impactSummary?.trim() || `Collaborative experiment by ${collab.members.length} researchers.`,
        problemSolved: problemSolved?.trim() || collab.brief?.title || "Research collaboration",
        improvesOn: improvesOn?.trim() || "Prior state of the art",
        tags: allTags,
        externalUrl: externalUrl || null,
        collaborationId: collabId,
        coAuthors: allMemberIds.filter((id: string) => id !== primaryAuthorId)
      }
    });

    // 2. Fire ReputationSignals for every member
    await prisma.reputationSignal.createMany({
      data: allMemberIds.map((memberId: string) => ({
        userId: memberId,
        fromUserId: requestingUser.id,
        workItemId: workItem.id,
        signalType: "collab",
        value: 75 // Each collab contribution = 75 points
      }))
    });

    // 3. Update StandexRank for all members in each domain of the collab
    const domains = allTags;
    if (domains.length > 0) {
      for (const memberId of allMemberIds) {
        for (const domain of domains) {
          // Upsert the rank record for this user/domain combination
          await prisma.standexRank.upsert({
            where: { userId_domain: { userId: memberId, domain } },
            update: { score: { increment: 75 } },
            create: { userId: memberId, domain, score: 75 }
          });
        }
      }
    }

    // 4. Mark the collab as completed and link to the work item
    await prisma.collaboration.update({
      where: { id: collabId },
      data: {
        status: "completed",
        publishedWorkItemId: workItem.id
      }
    });

    return NextResponse.json({ workItem }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/collabs/[id]/publish]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
