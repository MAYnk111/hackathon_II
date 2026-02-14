import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Leaf, AlertCircle, Flame, Wind } from "lucide-react";

interface SymptomRemedy {
  symptomName: string;
  emoji: string;
  aroyaFoods: string[];
  avoidForBalance: string[];
  vedicSupport: string;
  culturalContext: string;
  disclaimer: string;
  dosha?: string;
}

const remedies: SymptomRemedy[] = [
  {
    symptomName: "Common Cold & Cough",
    emoji: "🌬️",
    aroyaFoods: [
      "Warm turmeric milk (Haldi doodh)",
      "Ginger tea with honey",
      "Garlic and onion preparations",
      "Kulanji (carom) water",
      "Steamed vegetables with ghee",
      "Warm broths and soups",
    ],
    avoidForBalance: [
      "Cold water and ice cream",
      "Fried & processed foods",
      "Excess dairy (yogurt, paneer)",
      "Refined sugar",
      "Heavy, oily foods",
    ],
    vedicSupport:
      "Cold season imbalance (Vata & Kapha) requires warming foods. Ushna (warm) herbs like ginger and turmeric support Prana (vital energy) circulation and strengthen immune response through traditional practice.",
    culturalContext:
      "In Indian homes, the first remedy for cold is often warm turmeric milk mixed with ghee and black pepper. Grandmothers recommend adding jaggery and sesame oil for sustained warmth and nutrition.",
    disclaimer:
      "These foods support general wellness and may complement hydration and rest. Not a replacement for medical advice. Consult a doctor for persistent symptoms lasting over 7 days.",
    dosha: "Vata - Kapha",
  },
  {
    symptomName: "Digestive Discomfort",
    emoji: "🔥",
    aroyaFoods: [
      "Jeera (cumin) water",
      "Ajwain (carom) seeds",
      "Fennel and coriander tea",
      "Ginger root preparation",
      "Rice with ghee",
      "Moong dal soup",
      "Buttermilk with spices",
    ],
    avoidForBalance: [
      "Excess chili and spices",
      "Fried & greasy foods",
      "Raw vegetables",
      "Processed foods",
      "Very cold drinks",
      "Heavy meats",
    ],
    vedicSupport:
      "Agni (digestive fire) thrives with Satvik foods and warming spices. Jeera and ajwain kindle the digestive flame while ghee (clarified butter) lubricates and strengthens the GI tract.",
    culturalContext:
      "Indian cuisine uses 'spice blends' (masalas) not just for taste but to support digestion. A simple cumin water is considered a natural digestive aid passed through generations.",
    disclaimer:
      "Mild digestive support only. Persistent pain, bleeding, or changes in bowel habits require medical evaluation. Not suitable for diagnosed GI conditions without professional guidance.",
    dosha: "Pitta",
  },
  {
    symptomName: "Fatigue & Low Energy",
    emoji: "⚡",
    aroyaFoods: [
      "Sesame seed paste (til ke laddoo)",
      "Ghee with warm milk",
      "Dates and jaggery",
      "Almonds (soaked overnight)",
      "Ashwagandha root (Withania somnifera)",
      "Iron-rich leafy greens",
      "Whole grain preparations",
    ],
    avoidForBalance: [
      "Excess caffeine",
      "Refined sugars",
      "Processed soft drinks",
      "Very light foods",
      "Skipping meals",
      "Overeating",
    ],
    vedicSupport:
      "Depletion of Ojas (vital strength) requires building foods rich in Prana. Sesame, ghee, and grounding herbs like ashwagandha restore energy channels and support sustained vitality.",
    culturalContext:
      "Til ke laddoo (sesame balls) are traditionally given to children and evening snacks to boost strength. Ashwagandha, known as 'Rasayana' in Vedic texts, is one of the most revered rejuvenating tonics.",
    disclaimer:
      "General energy support through nutrition. Persistent fatigue may indicate anemia, thyroid issues, or other conditions requiring blood tests and medical consultation.",
    dosha: "Vata - Kapha",
  },
  {
    symptomName: "Skin Irritation & Inflammation",
    emoji: "🌿",
    aroyaFoods: [
      "Turmeric paste (haldi)",
      "Neem leaves (bitter, purifying)",
      "Coconut oil",
      "Sesame oil (warm)",
      "Aloe vera gel",
      "Mint leaves",
      "Water-rich fruits",
    ],
    avoidForBalance: [
      "Excess heat-generating foods (chili)",
      "Fried & processed items",
      "Excess salt",
      "Very sour foods",
      "Alcohol & smoking",
      "Hot & spicy combinations",
    ],
    vedicSupport:
      "Excess Pitta (fire element) manifests as skin heat. Sheetal (cooling) herbs like neem and aloe, combined with turmeric's antibacterial Satvik qualities, support natural skin healing.",
    culturalContext:
      "Turmeric paste is the oldest Indian remedy for wounds, pimples, and rashes. Neem is considered a 'purifier' and is used in traditional bathing rituals. Coconut oil is revered for cooling and softening skin.",
    disclaimer:
      "Supports mild skin concerns through topical application and diet. Severe, spreading, or persistent conditions require dermatological evaluation. Not for infected wounds without professional assessment.",
    dosha: "Pitta",
  },
  {
    symptomName: "Joint & Muscle Comfort",
    emoji: "🦵",
    aroyaFoods: [
      "Golden milk with turmeric",
      "Sesame oil massage (abhyanga)",
      "Bone broth",
      "Ghee-cooked vegetables",
      "Warming spices (dry ginger)",
      "Milk with nutmeg",
      "Rock salt preparations",
    ],
    avoidForBalance: [
      "Too much raw food",
      "Cold & damp environments",
      "Excess sour tastes",
      "Uncooked vegetables",
      "Very light diets",
      "Skipping warm meals",
    ],
    vedicSupport:
      "Vata imbalance creates movement disorders in joints. Warm oils (Sneha), warm foods, and Ushna spices stabilize mobility. Daily oil massage (abhyanga) is a cornerstone Vedic wellness practice.",
    culturalContext:
      "Oil massage with turmeric is recommended for stiff joints, especially in winter. Warm milk with turmeric and nutmeg is given in the evening. Bone broths are traditional joint tonics in Indian cuisine.",
    disclaimer:
      "Nutritional and topical support for general comfort. Severe pain, swelling, reduced mobility, or diagnosed arthritis requires medical management. Not a substitute for physical therapy.",
    dosha: "Vata",
  },
];

const AyurvedicRemedies = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section id="arogya" className="py-24 bg-gradient-to-b from-background to-sage/10">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-sage text-sage-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            🌿 Traditional Wellness
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4"
          >
            Arogya: Vedic Food & Natural Support
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-muted-foreground leading-relaxed text-lg"
          >
            Arogya means complete wellness. Explore Vedic-inspired food wisdom for common concerns — rooted in tradition,
            grounded in responsibility.
          </motion.p>
        </div>

        {/* Remedy Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {remedies.map((remedy, index) => (
            <motion.div
              key={remedy.symptomName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="border border-border rounded-2xl bg-card hover:shadow-lg transition-all duration-300"
            >
              {/* Header - Always Visible */}
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-4 text-left flex-1">
                  <span className="text-3xl">{remedy.emoji}</span>
                  <div>
                    <h3 className="font-heading font-bold text-foreground text-lg">{remedy.symptomName}</h3>
                    {remedy.dosha && (
                      <p className="text-xs text-muted-foreground mt-1">Dosha: {remedy.dosha}</p>
                    )}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                </motion.div>
              </button>

              {/* Expandable Content */}
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border"
                  >
                    <div className="px-6 py-6 space-y-6">
                      {/* Arogya Foods */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Leaf className="w-5 h-5 text-sage-foreground" />
                          <h4 className="font-heading font-bold text-foreground">🌿 Arogya Support Foods</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {remedy.aroyaFoods.map((food) => (
                            <div
                              key={food}
                              className="bg-sage/20 border border-sage/30 rounded-lg px-4 py-2 text-sm text-foreground"
                            >
                              ✓ {food}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Foods to Avoid */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Wind className="w-5 h-5 text-coral-foreground" />
                          <h4 className="font-heading font-bold text-foreground">🚫 Foods to Avoid for Balance</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {remedy.avoidForBalance.map((food) => (
                            <div
                              key={food}
                              className="bg-coral/15 border border-coral/30 rounded-lg px-4 py-2 text-sm text-foreground"
                            >
                              ✗ {food}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Vedic Support */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Flame className="w-5 h-5 text-warm-foreground" />
                          <h4 className="font-heading font-bold text-foreground">🪔 Traditional Support</h4>
                        </div>
                        <p className="text-muted-foreground leading-relaxed bg-warm/20 border border-warm/30 rounded-lg px-4 py-3 text-sm italic">
                          {remedy.vedicSupport}
                        </p>
                      </div>

                      {/* Cultural Context */}
                      <div>
                        <h4 className="font-heading font-bold text-foreground mb-2">📖 Cultural Wisdom</h4>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                          {remedy.culturalContext}
                        </p>
                      </div>

                      {/* Safety Note */}
                      <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-destructive mb-1">🛑 Safety Note</h5>
                          <p className="text-sm text-foreground">{remedy.disclaimer}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="max-w-4xl mx-auto mt-12 p-6 bg-accent/10 border border-accent/30 rounded-2xl text-center"
        >
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Vedic Wisdom + Modern Responsibility:</strong> These foods support general wellness based on
            traditional knowledge. Changes in diet should align with medical advice. Always consult qualified healthcare
            providers for diagnosed conditions or persistent symptoms.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AyurvedicRemedies;
