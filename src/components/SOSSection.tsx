import { motion } from "framer-motion";
import { Phone, AlertTriangle } from "lucide-react";

const SOSSection = () => {
  return (
    <section id="sos" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-sos/5 border-2 border-sos/20 rounded-3xl p-8 md:p-12 text-center"
        >
          <div className="w-16 h-16 bg-sos/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-sos" />
          </div>
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            Emergency? Get Help Now.
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            If this is an emergency, please seek immediate medical help. No AI advice is provided here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:108"
              className="flex items-center justify-center gap-2 bg-sos text-sos-foreground px-8 py-4 rounded-2xl font-heading font-bold text-lg hover:opacity-90 transition-opacity duration-300"
            >
              <Phone className="w-5 h-5" />
              Call 108
            </a>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-2xl font-heading font-bold text-lg hover:opacity-90 transition-opacity duration-300"
            >
              <Phone className="w-5 h-5" />
              Call 112
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SOSSection;
