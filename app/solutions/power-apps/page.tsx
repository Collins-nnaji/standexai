import PowerApps from "@/components/standex-ai/PowerApps";
import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
export default async function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-[#f6fbf8]">
      <TopNav />
      <main className="relative flex-1 flex flex-col z-10">
        <PowerApps />
      </main>
      <Footer />
    </div>
  );
}
