import { redirect } from "next/navigation";
import { neonAuth } from "@/lib/neon/auth-server";
import { prisma } from "@/lib/prisma";
import { getOrCreateCurrentUserId } from "@/lib/server/current-user";
import { OnboardingForm } from "./OnboardingForm";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { data: session } = await neonAuth.getSession();
  
  if (!session?.user?.email) {
    redirect("/api/auth/signin");
  }

  const userId = await getOrCreateCurrentUserId({
    userEmailHeader: session.user.email,
    userNameHeader: session.user.name ?? undefined,
  });

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { 
      role: true,
      bio: true,
      institution: true,
      location: true,
    }
  }) as any;

  // If already onboarded (has specific role or bio), redirect to their domain
  if (user?.role === "RESEARCHER" || user?.role === "PRO" || user?.role === "LAB" || user?.bio) {
    redirect("/discover");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-zinc-800 bg-[#141525] p-8 shadow-2xl">
        <h1 className="font-syne mb-2 text-3xl font-bold text-zinc-900">Join the Network</h1>
        <p className="mb-8 text-zinc-500">Complete your profile to start discovering and publishing AI research.</p>
        
        <OnboardingForm userId={userId} />
      </div>
    </div>
  );
}
