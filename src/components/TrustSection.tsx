import { motion } from "framer-motion";
import { ShieldOff, Pill, UserX, Lock, BarChart3, Heart } from "lucide-react";

const principles = [
  { icon: ShieldOff, title: "Not a Diagnostic Tool", desc: "We never diagnose conditions — only share possibilities." },
  { icon: Pill, title: "No Prescriptions", desc: "We never recommend or prescribe any medications." },
  { icon: UserX, title: "No Doctor Replacement", desc: "Always consult qualified healthcare professionals." },
  { icon: Lock, title: "Privacy & Consent-First", desc: "Your data stays private. No information is shared." },
  { icon: BarChart3, title: "Confidence & Uncertainty", desc: "We show probability levels so you understand our limits." },
  { icon: Heart, title: "Built with Care", desc: "Designed to reduce panic, not create it." },
];

const TrustSection = () => {
  return (
    <section id="trust" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-sage/30 text-sage-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            🧠 Ethics & Safety
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4"
          >
            Trust, Safety & Ethics
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-muted-foreground leading-relaxed"
          >
            We believe healthcare technology should be transparent about what it can and cannot do.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {principles.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="flex items-start gap-4 bg-background rounded-2xl border border-border p-5 hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <p.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-foreground text-sm mb-1">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
