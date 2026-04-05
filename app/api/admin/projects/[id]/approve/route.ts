import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { data: session } = await neonAuth.getSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (admin?.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { isApproved } = await req.json();

    const project = await prisma.researchBrief.update({
      where: { id: projectId },
      data: { isApproved }
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_APPROVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { data: session } = await neonAuth.getSession();
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { role: true }
    });

    if (admin?.role !== "ADMIN") {
      return new NextResponse("Forbidden", { status: 403 });
    }

    await prisma.researchBrief.delete({
      where: { id: projectId }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PROJECT_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
