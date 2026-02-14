import { motion } from "framer-motion";

const foods = [
  {
    emoji: "🫚",
    name: "Turmeric",
    benefit: "Anti-inflammatory properties",
    detail: "Contains curcumin which may help reduce inflammation naturally.",
    bg: "bg-warm",
  },
  {
    emoji: "🥬",
    name: "Leafy Vegetables",
    benefit: "Iron & haemoglobin support",
    detail: "Rich in iron and folic acid, supporting healthy blood formation.",
    bg: "bg-secondary",
  },
  {
    emoji: "🧂",
    name: "Iodized Salt",
    benefit: "Iodine intake",
    detail: "Essential for thyroid function and metabolic health.",
    bg: "bg-accent",
  },
  {
    emoji: "🥗",
    name: "Vegetables & Masalas",
    benefit: "Immunity & digestion",
    detail: "Traditional spice blends may support digestive health and general wellness.",
    bg: "bg-sage/30",
  },
];

const NutritionSection = () => {
  return (
    <section id="nutrition" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-secondary text-secondary-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            🍲 Everyday Wellness
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4"
          >
            Everyday Foods & Their Health Contributions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-muted-foreground leading-relaxed"
          >
            Understanding the nutritional value of common Indian kitchen ingredients — for awareness, not treatment.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {foods.map((food, i) => (
            <motion.div
              key={food.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group rounded-3xl border border-border bg-background p-6 hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 ${food.bg} rounded-2xl flex items-center justify-center text-2xl mb-4`}>
                {food.emoji}
              </div>
              <h3 className="font-heading font-bold text-foreground mb-1">{food.name}</h3>
              <p className="text-primary text-sm font-medium mb-2">{food.benefit}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{food.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NutritionSection;
