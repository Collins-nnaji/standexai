import { prismaDb as prisma } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const userId = await getOrCreateCurrentUserId();
    const admin = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();

    const lead = await prisma.managedProjectRequest.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, lead });
  } catch (err) {
    console.error("Lead Status Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
