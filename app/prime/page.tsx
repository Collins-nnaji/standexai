import { neonAuth } from "@/lib/neon/auth-server";
import { TopNav } from "@/components/network/TopNav";
import { PrimeClient } from "@/components/network/PrimeClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Standex Prime | Managed Implementation",
  description: "Elite squad allocation for mission-critical AI architecture and production engineering.",
};

export default async function PrimePage() {
  const { data: session } = await neonAuth.getSession();

  return (
    <div className="min-h-screen bg-[#FAFAF9] font-[family-name:var(--font-inter)] selection:bg-[#7C5CFC]/20">
      <TopNav user={session?.user} />
      <PrimeClient />
    </div>
  );
}
