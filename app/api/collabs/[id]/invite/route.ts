import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { neonAuth } from "@/lib/neon/auth-server";

// POST /api/collabs/[id]/invite — Add a user to a Collaboration by email or userId
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

    // Check requester is owner of this collab
    const membership = await prisma.collabMember.findUnique({
      where: { collabId_userId: { collabId, userId: requestingUser.id } }
    });
    if (!membership || membership.role !== "owner") {
      return NextResponse.json({ error: "Only the room owner can invite members" }, { status: 403 });
    }

    const body = await req.json();
    const { email, userId: inviteUserId } = body;

    // Resolve the invite target
    let targetUser: { id: string } | null = null;
    if (inviteUserId) {
      targetUser = await prisma.user.findUnique({ where: { id: inviteUserId }, select: { id: true } });
    } else if (email) {
      targetUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    }

    if (!targetUser) {
      return NextResponse.json({ error: "Invited user not found" }, { status: 404 });
    }

    // Idempotent — upsert
    const member = await prisma.collabMember.upsert({
      where: { collabId_userId: { collabId, userId: targetUser.id } },
      update: {},
      create: { collabId, userId: targetUser.id, role: "contributor" }
    });

    return NextResponse.json({ member }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/collabs/[id]/invite]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
