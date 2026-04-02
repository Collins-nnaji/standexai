import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { neonAuth } from "@/lib/neon/auth-server";

// POST /api/collabs — Create a new Collaboration (optionally linked to a brief)
export async function POST(req: NextRequest) {
  try {
    const { data: session } = await neonAuth.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { title, description, briefId, visibility = "private", invitedUserId } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // If briefId provided, pull its description as prompt
    let finalDescription = description?.trim() || "";
    if (briefId && !finalDescription) {
      const brief = await prisma.researchBrief.findUnique({
        where: { id: briefId },
        select: { title: true, description: true }
      });
      if (brief) {
        finalDescription = `Collaboration spawned from Brief: "${brief.title}"\n\n${brief.description}`;
      }
    }

    const collab = await prisma.collaboration.create({
      data: {
        title: title.trim(),
        description: finalDescription,
        visibility,
        briefId: briefId || null,
        members: {
          create: invitedUserId 
            ? [
                { userId: user.id, role: "owner" },
                { userId: invitedUserId, role: "contributor" }
              ]
            : [{ userId: user.id, role: "owner" }]
        }
      }
    });

    return NextResponse.json({ collab }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/collabs]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
