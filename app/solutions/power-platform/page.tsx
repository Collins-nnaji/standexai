import PowerPlatform from "@/components/standex-ai/PowerPlatform";
import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-white">
      <TopNav />
      <main className="relative flex-1 flex flex-col z-10">
        <PowerPlatform />
      </main>
      <Footer />
    </div>
  );
}
