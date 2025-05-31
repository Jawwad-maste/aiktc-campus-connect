
import InteractiveHero from "@/components/ui/hero-section-nexus";
import DepartmentsSection from "@/components/sections/DepartmentsSection";
import StatsSection from "@/components/sections/StatsSection";
import QuickLinksSection from "@/components/sections/QuickLinksSection";
import FooterSection from "@/components/sections/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-aiktc-ivory">
      <InteractiveHero />
      <DepartmentsSection />
      <StatsSection />
      <QuickLinksSection />
      <FooterSection />
    </div>
  );
};

export default Index;
