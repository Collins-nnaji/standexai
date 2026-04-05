import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: session } = await neonAuth.getSession();

  try {
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
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
