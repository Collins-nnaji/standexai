import { NextRequest, NextResponse } from "next/server";
import { prismaDb as prisma } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = await getOrCreateCurrentUserId();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const workItem = await prisma.workItem.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!workItem) {
      return NextResponse.json({ error: "Work item not found" }, { status: 404 });
    }

    if (workItem.userId !== userId) {
      return NextResponse.json({ error: "Forbidden: You do not own this resource" }, { status: 403 });
    }

    const body = await req.json();
    const { title, type, abstract, tags, externalUrl } = body;

    const updatedWork = await prisma.workItem.update({
      where: { id },
      data: {
        title: title || undefined,
        type: type || undefined,
        abstract: abstract || undefined,
        tags: tags || undefined,
        externalUrl: externalUrl || undefined,
      }
    });

    return NextResponse.json(updatedWork, { status: 200 });
  } catch (error: any) {
    console.error("Update WorkItem error:", error);
    return NextResponse.json({ error: "Failed to update work item." }, { status: 500 });
  }
}
