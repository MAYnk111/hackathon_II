import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";

const SOSButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-16 right-0 bg-card border border-border rounded-2xl shadow-xl p-5 w-64 mb-2"
          >
            <p className="font-heading font-bold text-foreground text-sm mb-1">🚨 Emergency?</p>
            <p className="text-muted-foreground text-xs mb-4">If this is an emergency, please seek immediate medical help.</p>
            <div className="flex flex-col gap-2">
              <a href="tel:108" className="flex items-center gap-2 bg-sos text-sos-foreground rounded-xl px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" /> Call 108
              </a>
              <a href="tel:112" className="flex items-center gap-2 bg-foreground text-background rounded-xl px-4 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity">
                <Phone className="w-4 h-4" /> Call 112
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-sos text-sos-foreground shadow-lg shadow-sos/30 flex items-center justify-center font-heading font-bold text-sm"
      >
        {open ? <X className="w-5 h-5" /> : "SOS"}
      </motion.button>
    </div>
  );
};

export default SOSButton;
