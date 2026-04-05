import { NextRequest, NextResponse } from "next/server";
import { prismaDb as prisma } from "@/lib/prisma";
import { neonAuth } from "@/lib/neon/auth-server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: session } = await neonAuth.getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { canvasContent } = body;

    // Verify membership
    const membership = await prisma.collabMember.findFirst({
      where: {
        collabId: id,
        user: { email: session.user.email }
      }
    });

    if (!membership) {
      return NextResponse.json({ error: "Forbidden: Not a member of this collaboration" }, { status: 403 });
    }

    const updatedCollab = await prisma.collaboration.update({
      where: { id },
      data: { canvasContent }
    });

    return NextResponse.json({ collab: updatedCollab });
  } catch (err) {
    console.error("[PATCH /api/collabs/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/collabs/[id] — Fetch collaboration details (alternative to server components if needed)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: session } = await neonAuth.getSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collab = await prisma.collaboration.findUnique({
      where: { id },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, handle: true, avatar: true, email: true } } }
        }
      }
    });

    if (!collab) {
      return NextResponse.json({ error: "Collaboration not found" }, { status: 404 });
    }

    // Check membership
    const isMember = collab.members.some(m => m.user.email === session.user?.email);
    if (collab.visibility === "private" && !isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ collab });
  } catch (err) {
    console.error("[GET /api/collabs/[id]]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
