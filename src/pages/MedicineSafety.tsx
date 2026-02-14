import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MedicineSafetySection from "@/components/MedicineSafetySection";
import SOSButton from "@/components/SOSButton";

const MedicineSafety = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-24"
      >
        <MedicineSafetySection />
      </motion.div>
      <Footer />
      <SOSButton />
    </div>
  );
};

export default MedicineSafety;
