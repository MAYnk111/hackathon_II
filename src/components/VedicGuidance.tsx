import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const VedicGuidance = ({ isExpanded }: { isExpanded: boolean }) => {
  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden"
    >
      <div className="mt-4 pl-16 pr-4">
        <div className="bg-gradient-to-br from-sage/10 to-primary/5 rounded-2xl p-6 max-h-80 overflow-y-auto border border-sage/20">
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-medium text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sage" />
              Ancient Wisdom for Modern Wellness
            </p>
            
            <p>
              In the tradition of <span className="text-sage-foreground font-semibold">Ayurveda</span>, health is not merely the absence of disease, but a state of complete balance — where body, mind, and spirit exist in harmony.
            </p>
            
            <p>
              <span className="text-primary font-semibold">Satya</span> (truth) reminds us to be honest with ourselves about our health. Listen to your body's signals with <span className="text-primary font-semibold">Dhairya</span> (patience) and kindness.
            </p>
            
            <p>
              <span className="text-sage-foreground font-semibold">Arogya</span> (wellness) flows naturally when we maintain <span className="text-sage-foreground font-semibold">Shuddha</span> (purity) in our choices — clean food, clean water, clean thoughts.
            </p>
            
            <p>
              The life force, <span className="text-primary font-semibold">Prana</span>, moves through us with each breath. Deep breathing calms the mind, strengthens digestion, and supports healing.
            </p>
            
            <p>
              <span className="text-sage-foreground font-semibold">Ritu</span> (seasons) teach us that our needs change with time. Adapt your diet and routines to nature's rhythms for sustained vitality.
            </p>
            
            <p className="pt-2 border-t border-sage/20 italic text-xs">
              These are guiding principles for awareness, not medical prescriptions. Always consult qualified healthcare professionals for treatment.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VedicGuidance;
