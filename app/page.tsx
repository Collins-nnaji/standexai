import dynamic from "next/dynamic";
import { TopNav } from "@/components/network/TopNav";
import { LandingHero } from "@/components/ui/LandingHero";

const HomeServices = dynamic(() => import("@/components/standex-ai/Home/HomeServices"), {
  loading: () => <div className="min-h-[480px] w-full" aria-hidden />,
});
const AIImplementation = dynamic(() => import("@/components/standex-ai/Home/AIImplementation"), {
  loading: () => <div className="min-h-[400px] w-full" aria-hidden />,
});
const HomeCourses = dynamic(() => import("@/components/standex-ai/Home/HomeCourses"), {
  loading: () => <div className="min-h-[520px] w-full" aria-hidden />,
});
const HomeAbout = dynamic(() => import("@/components/standex-ai/Home/HomeAbout"), {
  loading: () => <div className="min-h-[480px] w-full" aria-hidden />,
});
const WhyChooseUs = dynamic(() => import("@/components/standex-ai/Home/WhyChooseUs"), {
  loading: () => <div className="min-h-[360px] w-full" aria-hidden />,
});
const Testimonials = dynamic(() => import("@/components/standex-ai/Testimonials"), {
  loading: () => <div className="min-h-[400px] w-full" aria-hidden />,
});
const Footer = dynamic(() => import("@/components/standex-ai/Footer"), {
  loading: () => <div className="min-h-[120px] w-full" aria-hidden />,
});

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col selection:bg-[#7C5CFC]/20 bg-white">
      <TopNav />

      <main className="relative flex-1 flex flex-col items-center z-10 antialiased overflow-x-hidden">
        <div className="w-full">
          <LandingHero />
        </div>

        <div id="services" className="w-full">
          <HomeServices />
        </div>

        <div className="w-full">
          <AIImplementation />
        </div>

        <div id="academy" className="w-full">
          <HomeCourses />
        </div>

        <div id="about" className="w-full">
          <HomeAbout />
        </div>

        <div className="w-full">
          <WhyChooseUs />
        </div>

        <div className="w-full bg-white">
          <Testimonials />
        </div>
      </main>

      <Footer />
    </div>
  );
}
