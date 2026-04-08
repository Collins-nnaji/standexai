"use server";

import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";

export async function applyToProject(projectName: string) {
  const { data: session } = await neonAuth.getSession();
  if (!session?.user) {
    return { error: "You must be signed in to apply." };
  }

  const brief = await prisma.researchBrief.findFirst({
    where: { title: projectName },
  });

  if (!brief) {
    return { error: "Project not found in database." };
  }

  try {
    await prisma.briefInterest.create({
      data: {
        briefId: brief.id,
        userId: session.user.id,
        message: "I am interested in joining this open project squad.",
      },
    });
    return { success: true };
  } catch (err: any) {
    // If they already applied, Prisma throws a unique constraint error (P2002)
    if (err.code === "P2002") {
      return { success: true }; 
    }
    console.error("Failed to apply:", err);
    return { error: "An error occurred while applying." };
  }
}
