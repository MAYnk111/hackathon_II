import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Hospital, Globe } from "lucide-react";

const impacts = [
  { 
    icon: ShieldCheck, 
    title: "Nakli Aushadhi Suraksha (नकली औषधि सुरक्षा)", 
    desc: "Protecting users from counterfeit medicines by helping identify fake drugs before consumption." 
  },
  { 
    icon: HeartHandshake, 
    title: "Aahar–Aushadhi Samvedana (आहार–औषधि संवेदन)", 
    desc: "Building awareness of food–drug interactions to prevent unsafe combinations in daily life." 
  },
  { 
    icon: Hospital, 
    title: "Shanti & Spashtata (शांति और स्पष्टता)", 
    desc: "Reducing panic through calm, clear, informational guidance that prevents unnecessary hospital visits." 
  },
  { 
    icon: Globe, 
    title: "Jan Arogya Seva (जन आरोग्य सेवा)", 
    desc: "Serving public health by strengthening healthcare awareness and responsibility across communities." 
  },
];

const ImpactSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            � Arogya Seva
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4"
          >
            Jan Arogya Prabhav: Our Public Health Impact
            <span className="block text-2xl md:text-3xl mt-2 text-primary/80">जन आरोग्य प्रभाव</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-muted-foreground leading-relaxed max-w-xl mx-auto"
          >
            Through <span className="font-semibold text-foreground">Seva</span> (service) to society, we aim to make healthcare safer, more informed, and accessible for every Indian family.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {impacts.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-card rounded-3xl border border-border p-8 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-500"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
