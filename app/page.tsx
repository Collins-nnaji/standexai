import { TopNav } from "@/components/network/TopNav";
import { AnimatedNetwork } from "@/components/ui/AnimatedNetwork";
import { LandingHero } from "@/components/ui/LandingHero";
import { neonAuth } from "@/lib/neon/auth-server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: session } = await neonAuth.getSession();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#FAFAF9] overflow-hidden font-[family-name:var(--font-inter)] selection:bg-[#7C5CFC]/20">
      <TopNav user={session?.user} />
      
      <main className="relative flex-1 flex flex-col justify-center">
        {/* Animated AI Technical Background (Subtle for Light Mode) */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <AnimatedNetwork />
        </div>

        {/* Professional Light Gradients */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-[#7C5CFC]/5 blur-[120px]" />
           <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        </div>

        {/* Hero Section - Full Viewport Focused */}
        <LandingHero />
      </main>
    </div>
  );
}
