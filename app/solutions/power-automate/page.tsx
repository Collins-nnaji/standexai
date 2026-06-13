import PowerAutomate from "@/components/standex-ai/PowerAutomate";
import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
export default async function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-[#f6fbf8]">
      <TopNav />
      <main className="relative flex-1 flex flex-col z-10">
        <PowerAutomate />
      </main>
      <Footer />
    </div>
  );
}
