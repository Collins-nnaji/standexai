import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { TopNav } from "@/components/network/TopNav";
import { Metadata } from "next";
import { OpenProjectsGrid } from "@/components/network/OpenProjectsGrid";

export const metadata: Metadata = {
  title: "Open Projects — Join the Build | StandexAI",
  description:
    "StandexAI runs open product squads. Pick a project, contribute, and ship real AI products alongside the cohort.",
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { data: session } = await neonAuth.getSession();

  let appliedProjects: string[] = [];
  if (session?.user?.id) {
    const interests = await prisma.briefInterest.findMany({
      where: { userId: session.user.id },
      include: { brief: true },
    });
    appliedProjects = interests.map((i) => i.brief.title);
  }

  return (
    <div className="min-h-screen bg-white selection:bg-[#7C5CFC]/20">
      <TopNav user={session?.user} />
      <OpenProjectsGrid user={session?.user ?? null} appliedProjects={appliedProjects} />
    </div>
  );
}
