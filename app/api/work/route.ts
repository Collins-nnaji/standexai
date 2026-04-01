import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { neonAuth } from "@/lib/neon/auth-server";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export async function POST(req: NextRequest) {
  try {
    const userId = await getOrCreateCurrentUserId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, type, abstract, impactSummary, problemSolved, improvesOn, tags, externalUrl, fileUrl } = body;

    const newWork = await prisma.workItem.create({
      data: {
        userId,
        title,
        type,
        abstract,
        impactSummary,
        problemSolved,
        improvesOn,
        tags: tags || [],
        externalUrl,
        fileUrl,
      }
    });

    return NextResponse.json({ id: newWork.id }, { status: 201 });
  } catch (error: any) {
    console.error("Create WorkItem error:", error);
    return NextResponse.json({ error: "Failed to publish work." }, { status: 500 });
  }
}
