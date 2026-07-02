import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

// GET /api/collabs/[id]/messages — Fetch discussion for a room
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getOrCreateCurrentUserId();

    const collab = await prisma.collaboration.findUnique({
      where: { id },
      select: { visibility: true, members: { select: { userId: true } } }
    });

    if (!collab) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const isMember = collab.members.some(m => m.userId === userId);

    if (collab.visibility === "private" && !isMember) {
      return NextResponse.json({ error: "Private room" }, { status: 403 });
    }

    const messages = await prisma.collabMessage.findMany({
      where: { collabId: id },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      },
      orderBy: { createdAt: "asc" }
    });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("[GET /api/collabs/messages]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/collabs/[id]/messages — Post a message to the room
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getOrCreateCurrentUserId();

    const collab = await prisma.collaboration.findUnique({
      where: { id },
      select: { members: { select: { userId: true } } }
    });

    if (!collab) return NextResponse.json({ error: "Room not found" }, { status: 404 });

    const isMember = collab.members.some(m => m.userId === userId);
    if (!isMember) return NextResponse.json({ error: "Must be a contributor to post" }, { status: 403 });

    const { content } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: "Message content required" }, { status: 400 });

    const message = await prisma.collabMessage.create({
      data: {
        collabId: id,
        userId,
        content: content.trim()
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } }
      }
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/collabs/messages]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
