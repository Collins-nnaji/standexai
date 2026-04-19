import Standex DigitalPage from "@/components/standex-digital/Standex DigitalPage";
import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-digital/Footer";
import { neonAuth } from "@/lib/neon/auth-server";

export default async function Page() {
  let session = null;
  try {
    const result = await neonAuth.getSession();
    session = result?.data;
  } catch {}

  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden bg-white">
      <TopNav user={session?.user} />
      <main className="relative flex-1 flex flex-col z-10">
        <Standex DigitalPage />
      </main>
      <Footer />
    </div>
  );
}
