import { TopNav } from "@/components/network/TopNav";
import Footer from "@/components/standex-ai/Footer";

// AI Platform Base Components
import { LandingHero } from "@/components/ui/LandingHero";
import HomeCourses from "@/components/standex-ai/Home/HomeCourses";

// Standex Digital Integrated Components
import HomeAbout from "@/components/standex-ai/Home/HomeAbout";
import HomeServices from "@/components/standex-ai/Home/HomeServices";
import WhyChooseUs from "@/components/standex-ai/Home/WhyChooseUs";
import AIImplementation from "@/components/standex-ai/Home/AIImplementation";
import Testimonials from "@/components/standex-ai/Testimonials";

export default function Page() {
  return (
    <div className="flex min-h-[100dvh] flex-col overflow-hidden selection:bg-[#7C5CFC]/20 bg-white">
      <TopNav />
      
      <main className="relative flex-1 flex flex-col items-center z-10 antialiased">
        
        {/* 1. HERO (AI Platform Base) */}
        <div className="w-full">
          <LandingHero />
        </div>

        {/* 2. CORPORATE SERVICES (Restyled HomeServices) */}
        <div className="w-full">
          <HomeServices />
        </div>

        {/* 3. AI IMPLEMENTATION SOLUTION */}
        <div className="w-full">
          <AIImplementation />
        </div>

        {/* 4. ACADEMY CURRICULUM (HomeCourses) */}
        <div className="w-full">
          <HomeCourses />
        </div>

        {/* 5. ABOUT & EXPERTISE (Restyled HomeAbout) */}
        <div className="w-full">
          <HomeAbout />
        </div>

        {/* 6. STRATEGIC ADVANTAGE (Restyled WhyChooseUs) */}
        <div className="w-full">
          <WhyChooseUs />
        </div>

        {/* 7. SOCIAL PROOF (Testimonials) */}
        <div className="w-full bg-white">
          <Testimonials />
        </div>

      </main>

      <Footer />
    </div>
  );
}
