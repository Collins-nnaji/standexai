import PowerPlatformCourse from "@/components/standex-ai/Training/PowerPlatformCourse";
import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";
export default async function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-white">
      <TopNav />
      <main className="relative flex-1 flex flex-col z-10">
        <PowerPlatformCourse />
      </main>
      <Footer />
    </div>
  );
}
