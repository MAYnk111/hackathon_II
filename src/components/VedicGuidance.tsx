import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

const guidanceMessages = [
  {
    title: "Ancient Wisdom for Modern Wellness",
    content: [
      "In the tradition of <span class='text-sage-foreground font-semibold'>Ayurveda</span>, health is not merely the absence of disease, but a state of complete balance — where body, mind, and spirit exist in harmony.",
      "<span class='text-primary font-semibold'>Satya</span> (truth) reminds us to be honest with ourselves about our health. Listen to your body's signals with <span class='text-primary font-semibold'>Dhairya</span> (patience) and kindness.",
      "<span class='text-sage-foreground font-semibold'>Arogya</span> (wellness) flows naturally when we maintain <span class='text-sage-foreground font-semibold'>Shuddha</span> (purity) in our choices — clean food, clean water, clean thoughts.",
      "The life force, <span class='text-primary font-semibold'>Prana</span>, moves through us with each breath. Deep breathing calms the mind, strengthens digestion, and supports healing.",
      "<span class='text-sage-foreground font-semibold'>Ritu</span> (seasons) teach us that our needs change with time. Adapt your diet and routines to nature's rhythms for sustained vitality.",
    ],
  },
  {
    title: "The Path of Balance",
    content: [
      "<span class='text-primary font-semibold'>Sama</span> (balance) is the cornerstone of lasting health. When we honor the equilibrium between rest and activity, nourishment and fasting, we discover true vitality.",
      "Ancient texts speak of <span class='text-sage-foreground font-semibold'>Ahara</span> (diet) as medicine. Each meal is an opportunity to nourish not just the body, but the subtle energies that sustain us.",
      "<span class='text-primary font-semibold'>Dinacharya</span> (daily routine) creates a foundation for wellness. Rising with the sun, eating at regular times, and sleeping early align us with nature's wisdom.",
      "Practice <span class='text-sage-foreground font-semibold'>Swadhyaya</span> (self-study) — observe how different foods, activities, and thoughts affect your energy and mood. This awareness is healing itself.",
      "Remember that <span class='text-primary font-semibold'>Vaidya</span> (physician) means 'one who knows'. True knowledge comes from both ancient wisdom and modern science working together.",
    ],
  },
  {
    title: "Harmony Within",
    content: [
      "The concept of <span class='text-sage-foreground font-semibold'>Tridosha</span> teaches us that every person is unique. What brings balance to one may disturb another — listen to your body's wisdom.",
      "<span class='text-primary font-semibold'>Ojas</span> is the vital essence that sustains immunity and radiance. It grows through peaceful sleep, wholesome food, loving relationships, and purposeful living.",
      "When facing illness, approach with <span class='text-sage-foreground font-semibold'>Shanti</span> (peace) rather than fear. A calm mind supports the body's natural healing intelligence.",
      "<span class='text-primary font-semibold'>Pranayama</span> (breath control) is the bridge between body and mind. Five minutes of conscious breathing can transform your entire day.",
      "Honor <span class='text-sage-foreground font-semibold'>Agni</span> (digestive fire) — it transforms not just food, but experiences and emotions. Strong digestion is the root of health.",
    ],
  },
  {
    title: "Nature's Rhythms",
    content: [
      "The ancient principle of <span class='text-primary font-semibold'>Ritu-sattva</span> reminds us to attune to seasonal changes. In summer, cool; in winter, warm. Nature shows us the way.",
      "<span class='text-sage-foreground font-semibold'>Prakruti</span> is your innate constitution — the blueprint you were born with. Understanding it helps you make choices that support your natural strengths.",
      "Cultivate <span class='text-primary font-semibold'>Sattva</span> (purity, harmony) through mindful choices. Fresh food, gentle movement, kind speech, and peaceful environments all build this quality.",
      "<span class='text-sage-foreground font-semibold'>Mauna</span> (silence) is a profound healer. Even brief moments of quiet allow the nervous system to reset and restore balance.",
      "Traditional wisdom teaches that health is maintained through <span class='text-primary font-semibold'>Yukti</span> (appropriate reasoning) — making intelligent choices based on your unique needs.",
    ],
  },
  {
    title: "The Inner Physician",
    content: [
      "Within you resides an <span class='text-sage-foreground font-semibold'>Antaratma-vaidya</span> (inner healer) that knows what you need. Stillness and self-compassion help you hear its guidance.",
      "<span class='text-primary font-semibold'>Vyayama</span> (exercise) should leave you energized, not depleted. Movement that suits your nature brings lightness and joy to body and mind.",
      "The quality of <span class='text-sage-foreground font-semibold'>Maitri</span> (friendliness toward yourself) is essential. Judgment creates stress; kindness creates conditions for healing.",
      "<span class='text-primary font-semibold'>Aushadha</span> (medicine) extends beyond herbs and pills. Loving presence, meaningful work, and heartfelt laughter are powerful remedies.",
      "Remember <span class='text-sage-foreground font-semibold'>Kala</span> (time) is a great healer. Patience with your healing journey is not passive — it's an active practice of trust.",
    ],
  },
];

const VedicGuidance = ({ isExpanded }: { isExpanded: boolean }) => {
  const [currentMessage, setCurrentMessage] = useState(guidanceMessages[0]);
  const [previousIndex, setPreviousIndex] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (isExpanded) {
      // Select random message avoiding the previous one
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * guidanceMessages.length);
      } while (newIndex === previousIndex && guidanceMessages.length > 1);

      setCurrentMessage(guidanceMessages[newIndex]);
      setPreviousIndex(newIndex);
      setKey((prev) => prev + 1);
    }
  }, [isExpanded]);

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mt-4 pl-16 pr-4">
        <div className="bg-gradient-to-br from-sage/10 to-primary/5 rounded-2xl p-6 max-h-80 overflow-y-auto border border-sage/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="space-y-4 text-sm leading-relaxed text-muted-foreground"
            >
              <p className="font-medium text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sage" />
                {currentMessage.title}
              </p>
              
              {currentMessage.content.map((paragraph, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
              
              <p className="pt-2 border-t border-sage/20 italic text-xs">
                These are guiding principles for awareness, not medical prescriptions. Always consult qualified healthcare professionals for treatment.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default VedicGuidance;
