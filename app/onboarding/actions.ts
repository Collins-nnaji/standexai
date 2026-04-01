"use server";

import { prisma } from "@/lib/prisma";

export async function saveOnboarding(formData: FormData) {
  try {
    const userId = formData.get("userId") as string;
    const roleForm = formData.get("role") as string;
    const name = formData.get("name") as string;
    const institution = formData.get("institution") as string;
    const location = formData.get("location") as string;
    const bio = formData.get("bio") as string;
    const openToWork = formData.get("openToWork") === "on";

    if (!userId) {
      return { error: "Missing user ID." };
    }

    const validRoles = ["RESEARCHER", "LAB", "PRO"];
    const role = validRoles.includes(roleForm) ? (roleForm as "RESEARCHER" | "LAB" | "PRO") : "RESEARCHER";

    const updateData: any = {
      role,
      name,
      institution,
      location,
      bio,
    };

    if (role === "RESEARCHER") {
      updateData.openToWork = openToWork;
    } else {
      updateData.openToWork = false;
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    if (role === "LAB") {
      // Create empty lab profile
      await prisma.labProfile.upsert({
        where: { userId },
        create: {
          userId,
          companyName: institution || name,
        },
        update: {
          companyName: institution || name,
        },
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return { error: "Failed to save profile." };
  }
}
