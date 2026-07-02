import { NextResponse } from "next/server";
import { prismaDb as prisma } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getOrCreateCurrentUserId();

    const body = await req.json();
    const { title, description, lookingFor, domain, active } = body;

    const brief = await prisma.researchBrief.findUnique({
      where: { id },
      select: { companyId: true }
    });

    if (!brief) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check ownership (only the person who posted it can edit)
    if (brief.companyId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedBrief = await prisma.researchBrief.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        lookingFor: lookingFor !== undefined ? lookingFor : undefined,
        domain: domain !== undefined ? domain : undefined,
        active: active !== undefined ? active : undefined,
      }
    });

    return NextResponse.json(updatedBrief);
  } catch (error: any) {
    console.error("Project update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getOrCreateCurrentUserId();

    const brief = await prisma.researchBrief.findUnique({
      where: { id },
      select: { companyId: true }
    });

    if (!brief) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (brief.companyId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.researchBrief.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Project deletion error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
