import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { TopNav } from "@/components/network/TopNav";
import { ResearchBriefCard } from "@/components/network/ResearchBriefCard";
import { Briefcase, Building, Plus } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | StandexAI",
  description: "Discover active AI research projects from frontier labs.",
};

export const dynamic = "force-dynamic";

import { ProjectsClient } from "@/components/network/ProjectsClient";

export default async function ProjectsPage() {
  const { data: session } = await neonAuth.getSession();
  
  const currentUser = session?.user?.email ? await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, ranks: { select: { domain: true } } }
  }) as any : null;

  const isLab = currentUser?.role === "LAB";

  const briefs = await prisma.researchBrief.findMany({
    where: { 
      active: true,
      isApproved: true 
    },
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        include: { labProfile: true }
      }
    }
  }) as any;

  const totalActiveBriefs = await prisma.researchBrief.count({ 
    where: { 
      active: true,
      isApproved: true 
    } 
  });
  const totalLabs = await prisma.user.count({ where: { role: "LAB" } });

  // Domain-overlap match scoring logic (passed to client)
  const userDomains = (currentUser?.ranks ?? []).map((r: any) => r.domain.toLowerCase());

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-[family-name:var(--font-inter)] selection:bg-[#7C5CFC]/20">
      <TopNav user={session?.user} />
      
      <main className="relative mx-auto max-w-[1440px] px-6 lg:px-12 py-10">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-48 bg-[radial-gradient(circle_at_50%_0%,rgba(124,92,252,0.03),transparent_70%)] pointer-events-none" />

        <ProjectsClient 
          briefs={briefs}
          totalActiveBriefs={totalActiveBriefs}
          totalLabs={totalLabs}
          isLab={isLab}
          userDomains={userDomains}
          currentUserId={currentUser?.id}
        />
      </main>
    </div>
  );
}
