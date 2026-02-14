import { motion } from "framer-motion";
import { useState } from "react";
import { Camera, Utensils, ShieldCheck, ChevronDown, Sparkles, Bell } from "lucide-react";
import medicineScan from "@/assets/medicine-scan.png";
import VedicGuidance from "./VedicGuidance";
import MedicineReminders from "./MedicineReminders";

const features = [
  {
    icon: Camera,
    title: "Fake vs Real Medicine Check",
    description: "Upload an image of your medicine strip and our platform cross-references it against verified databases to flag potential counterfeits.",
    color: "bg-warm text-warm-foreground",
    type: "text",
  },
  {
    icon: Utensils,
    title: "Food–Medicine Compatibility",
    description: "Check if your daily foods interact with your current medications. Some common foods can reduce drug effectiveness or cause adverse reactions.",
    color: "bg-accent text-accent-foreground",
    type: "text",
  },
  {
    icon: Sparkles,
    title: "Vedic Health Guidance",
    description: "Ancient wisdom for modern wellness — explore timeless principles of balance and vitality.",
    color: "bg-sage/30 text-sage-foreground",
    type: "component",
    component: VedicGuidance,
  },
  {
    icon: Bell,
    title: "Medicine Reminders",
    description: "Set personalized medication reminders with browser notifications to never miss a dose.",
    color: "bg-primary/10 text-primary",
    type: "component",
    component: MedicineReminders,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
  }),
};

const MedicineSafetySection = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="medicine" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-3 scale-105" />
              <img
                src={medicineScan}
                alt="Phone scanning a medicine strip"
                className="relative rounded-3xl w-72 md:w-80 shadow-xl"
              />
            </div>
          </motion.div>

          {/* Content */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            >
              Primary Feature
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4"
            >
              Medicine Safety Platform
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground mb-8 leading-relaxed"
            >
              Verify your medicines and understand how your food choices interact with your treatments — all in one calm, trustworthy experience.
            </motion.p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="rounded-2xl border border-border bg-background p-5 cursor-pointer hover:shadow-md transition-shadow duration-300"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center shrink-0`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-foreground">{feature.title}</h3>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${expanded === i ? "rotate-180" : ""}`}
                    />
                  </div>
                  
                  {feature.type === "text" ? (
                    <motion.div
                      initial={false}
                      animate={{ height: expanded === i ? "auto" : 0, opacity: expanded === i ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted-foreground text-sm mt-3 pl-16 leading-relaxed">
                        {feature.description}
                      </p>
                    </motion.div>
                  ) : feature.component ? (
                    <feature.component isExpanded={expanded === i} />
                  ) : null}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ShieldCheck className="w-4 h-4 text-sage" />
              <span>All checks are informational — always consult your doctor.</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicineSafetySection;
