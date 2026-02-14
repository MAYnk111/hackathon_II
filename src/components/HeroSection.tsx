import { motion } from "framer-motion";
import { ArrowRight, Stethoscope } from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background illustration */}
      <div className="absolute inset-0 opacity-30">
        <img
          src={heroIllustration}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Floating shapes */}
      <div className="absolute top-32 left-10 w-20 h-20 rounded-full bg-primary/10 animate-float" />
      <div className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-sage/20 animate-float-slow" />
      <div className="absolute top-60 right-40 w-12 h-12 rounded-full bg-accent/30 animate-float" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block bg-secondary text-secondary-foreground text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              🌿 Your Health, Understood Better
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-tight mb-6 text-balance"
          >
            Safer Medicines.{" "}
            <span className="text-primary">Clearer Decisions.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            A healthcare safety platform that helps you verify medicines,
            understand food–medicine safety, and explore symptoms responsibly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <a
              href="#medicine"
              className="group bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-heading font-bold text-lg hover:opacity-90 transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              Check Medicine Safety
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
            <a
              href="#symptoms"
              className="group bg-card text-foreground px-8 py-4 rounded-2xl font-heading font-semibold text-lg border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <Stethoscope className="w-5 h-5 text-primary" />
              Clinical Triage Overview
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-sm text-muted-foreground mt-6"
          >
            For health information only. Not a medical diagnosis.
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
