import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, X } from "lucide-react";
import SOSModal from "./SOSModal";

const SOSButton = () => {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSOSClick = () => {
    setOpen(false);
    setModalOpen(true);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="absolute bottom-16 right-0 bg-card border border-border rounded-2xl shadow-xl p-5 w-72 mb-2"
            >
              <p className="font-heading font-bold text-foreground text-sm mb-1">🚨 Need Help?</p>
              <p className="text-muted-foreground text-xs mb-4">
                Activate smart emergency alert or call emergency services directly.
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSOSClick}
                  className="w-full flex items-center justify-center gap-2 bg-sos text-sos-foreground rounded-xl px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  🚨 Smart Emergency Alert
                </button>
                <div className="flex gap-2">
                  <a
                    href="tel:108"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background rounded-xl px-3 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Phone className="w-3.5 h-3.5" /> 108
                  </a>
                  <a
                    href="tel:112"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-foreground text-background rounded-xl px-3 py-2.5 text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Phone className="w-3.5 h-3.5" /> 112
                  </a>
                </div>
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

      <SOSModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default SOSButton;
