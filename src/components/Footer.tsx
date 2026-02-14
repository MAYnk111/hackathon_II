import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg text-background">SafeCare</span>
            </div>
            <p className="text-background/60 text-sm max-w-xs leading-relaxed">
              A healthcare safety platform for medicine awareness and responsible symptom understanding.
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <h4 className="font-heading font-bold text-background text-sm mb-3">Platform</h4>
              <div className="flex flex-col gap-2">
                <a href="#medicine" className="text-background/60 text-sm hover:text-background transition-colors">Medicine Safety</a>
                <a href="#symptoms" className="text-background/60 text-sm hover:text-background transition-colors">Symptom Awareness</a>
                <a href="#nutrition" className="text-background/60 text-sm hover:text-background transition-colors">Nutrition</a>
              </div>
            </div>
            <div>
              <h4 className="font-heading font-bold text-background text-sm mb-3">Legal</h4>
              <div className="flex flex-col gap-2">
                <a href="#trust" className="text-background/60 text-sm hover:text-background transition-colors">Privacy & Consent</a>
                <a href="#trust" className="text-background/60 text-sm hover:text-background transition-colors">Ethics</a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/40 text-xs">
            ⚕️ Medical Disclaimer: This platform is for informational purposes only. It does not diagnose, prescribe, or replace professional medical advice.
          </p>
          <p className="text-background/40 text-xs">Built for Hackathon 2026</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
