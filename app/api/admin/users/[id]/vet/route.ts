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

    const { isVetted } = await req.json();

    const user = await prisma.user.update({
      where: { id },
      data: { isVetted, vettedCategory: isVetted ? "Standalone Implementation" : null },
    });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error("Vetting Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
