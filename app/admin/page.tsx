import { neonAuth } from "@/lib/neon/auth-server";
import { prismaDb as prisma } from "@/lib/prisma";
import { TopNav } from "@/components/network/TopNav";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { data: session } = await neonAuth.getSession();

  if (!session?.user?.email) {
    redirect("/auth/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { role: true }
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-black text-zinc-900 border-b-2 border-[#7C5CFC] pb-2 mb-4">RESTRICTED</h1>
        <p className="text-sm font-medium text-zinc-400 uppercase tracking-widest">Administrative access required for the personnel network.</p>
      </div>
    );
  }

  // Fetch initial data
  const users = await prisma.user.findMany({
    where: { role: { in: ["RESEARCHER", "ENGINEER", "PRO"] } },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVetted: true,
      vettedCategory: true,
    },
    orderBy: { createdAt: "desc" }
  }) as any[];

  const leads = await prisma.managedProjectRequest.findMany({
    orderBy: { createdAt: "desc" }
  }) as any[];

  const pendingProjects = await prisma.researchBrief.findMany({
    where: { isApproved: false },
    include: { company: true },
    orderBy: { createdAt: "desc" }
  }) as any[];

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <TopNav user={session.user} />
      
      <main className="mx-auto max-w-7xl px-6 lg:px-12 py-12">
        <div className="mb-12">
           <h1 className="font-syne text-5xl font-black text-zinc-900 leading-tight">Network <span className="text-[#7C5CFC]">Control.</span></h1>
           <p className="text-sm font-medium text-zinc-400 uppercase tracking-[0.2em] mt-2">Administrative Hub for Managed Implementing & Vetting</p>
        </div>

        <AdminDashboard 
          initialUsers={users} 
          initialLeads={leads} 
          initialPendingProjects={pendingProjects}
        />
      </main>
    </div>
  );
}
