"use server";

import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";

export async function saveAssessment(payload: {
  score: number;
  totalQuestions: number;
  tier: string;
  history: any[];
}) {
  const { data: session } = await neonAuth.getSession();
  if (!session?.user) {
    return { error: "Unauthenticated" };
  }

  try {
    const run = await prisma.assessmentRun.create({
      data: {
        userId: session.user.id,
        score: payload.score,
        totalQuestions: payload.totalQuestions,
        tier: payload.tier,
        history: payload.history,
      },
    });
    return { success: true, runId: run.id };
  } catch (error) {
    console.error("Failed to save assessment run:", error);
    return { error: "Failed to persist assessment" };
  }
}

export async function getAssessmentHistory() {
  const { data: session } = await neonAuth.getSession();
  if (!session?.user) {
    return [];
  }

  const runs = await prisma.assessmentRun.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return runs;
}
