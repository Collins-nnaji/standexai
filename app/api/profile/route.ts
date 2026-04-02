import { NextResponse } from "next/server";
import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  try {
    const { data: session } = await neonAuth.getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { handle, name, bio, openToWork } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify handle uniqueness if provided
    if (handle) {
      // Basic validation: alphanumeric and hyphens/underscores only
      if (!/^[a-zA-Z0-9_-]+$/.test(handle)) {
        return NextResponse.json({ error: "Handle can only contain letters, numbers, hyphens, and underscores." }, { status: 400 });
      }

      const existingHandle = await prisma.user.findFirst({
        where: { 
          handle,
          NOT: { id: user.id } // exclude current user
        }
      });
      if (existingHandle) {
        return NextResponse.json({ error: "Handle is already taken." }, { status: 400 });
      }
    }

    const updateData: any = {};
    if (handle !== undefined) updateData.handle = handle;
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (openToWork !== undefined) updateData.openToWork = openToWork;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        handle: true,
        name: true,
        bio: true,
        openToWork: true,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
