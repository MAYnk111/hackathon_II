import { motion } from "framer-motion";
import { Search, Activity, AlertCircle, Info } from "lucide-react";

const sampleConditions = [
  { name: "Seasonal Allergies", confidence: 72, color: "bg-sage" },
  { name: "Common Cold", confidence: 58, color: "bg-accent" },
  { name: "Sinusitis", confidence: 34, color: "bg-warm" },
  { name: "Migraine Trigger", confidence: 15, color: "bg-muted" },
];

const SymptomSection = () => {
  return (
    <section id="symptoms" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-accent text-accent-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            Support Tool
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4"
          >
            Symptom Awareness
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground leading-relaxed"
          >
            Gently explore what your symptoms might suggest. Our calm, step-based experience helps you understand possibilities — never diagnoses.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Input side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground">Describe your symptoms</h3>
              </div>
              <div className="bg-muted rounded-2xl p-4 mb-4">
                <p className="text-sm text-muted-foreground italic">
                  "I've had a persistent headache for two days, runny nose, and mild sneezing..."
                </p>
              </div>
              <div className="flex gap-2">
                <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1.5 rounded-full">Headache</span>
                <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1.5 rounded-full">Runny nose</span>
                <span className="bg-secondary text-secondary-foreground text-xs px-3 py-1.5 rounded-full">Sneezing</span>
              </div>
            </div>
          </motion.div>

          {/* Results side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sage/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-sage-foreground" />
                </div>
                <h3 className="font-heading font-bold text-foreground">Possible Conditions</h3>
              </div>

              <div className="space-y-4">
                {sampleConditions.map((c, i) => (
                  <motion.div
                    key={c.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-foreground">{c.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {c.confidence < 25 ? "Low probability" : `${c.confidence}% confidence`}
                      </span>
                    </div>
                    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${c.confidence}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                        className={`h-full rounded-full ${c.color}`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex items-start gap-2 bg-warm rounded-xl p-3">
                <Info className="w-4 h-4 text-warm-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-warm-foreground leading-relaxed">
                  This is informational and not a medical diagnosis. Always consult a qualified healthcare professional.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SymptomSection;
