import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustSection from "@/components/TrustSection";
import ImpactSection from "@/components/ImpactSection";
import SOSButton from "@/components/SOSButton";

const TrustEthics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-24"
      >
        <TrustSection />
        <ImpactSection />
      </motion.div>
      <Footer />
      <SOSButton />
    </div>
  );
};

export default TrustEthics;
