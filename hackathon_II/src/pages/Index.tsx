import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MedicineSafetySection from "@/components/MedicineSafetySection";
import SymptomSection from "@/components/SymptomSection";
import NutritionSection from "@/components/NutritionSection";
import SOSSection from "@/components/SOSSection";
import TrustSection from "@/components/TrustSection";
import ImpactSection from "@/components/ImpactSection";
import Footer from "@/components/Footer";
import SOSButton from "@/components/SOSButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MedicineSafetySection />
      <SymptomSection />
      <NutritionSection />
      <SOSSection />
      <TrustSection />
      <ImpactSection />
      <Footer />
      <SOSButton />
    </div>
  );
};

export default Index;
