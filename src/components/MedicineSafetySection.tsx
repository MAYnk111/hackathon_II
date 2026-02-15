import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Utensils, ShieldCheck, ChevronDown, Sparkles, Bell, Upload, X, Loader2 } from "lucide-react";
import medicineScan from "@/assets/medicine-scan.png";
import VedicGuidance from "./VedicGuidance";
import MedicineReminders from "./MedicineReminders";
import { API_ENDPOINTS } from "@/config/apiConfig";

const features = [
  {
    icon: Camera,
    title: "Fake vs Real Medicine Check",
    description: "Upload an image of your medicine strip and our platform cross-references it against verified databases to flag potential counterfeits.",
    color: "bg-warm text-warm-foreground",
    type: "text",
  },
  {
    icon: Utensils,
    title: "Food–Medicine Compatibility",
    description: "Check if your daily foods interact with your current medications. Some common foods can reduce drug effectiveness or cause adverse reactions.",
    color: "bg-accent text-accent-foreground",
    type: "text",
  },
  {
    icon: Sparkles,
    title: "Vedic Health Guidance",
    description: "Ancient wisdom for modern wellness — explore timeless principles of balance and vitality.",
    color: "bg-sage/30 text-sage-foreground",
    type: "component",
    component: VedicGuidance,
  },
  {
    icon: Bell,
    title: "Medicine Reminders",
    description: "Set personalized medication reminders with browser notifications to never miss a dose.",
    color: "bg-primary/10 text-primary",
    type: "component",
    component: MedicineReminders,
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
  }),
};

const MedicineSafetySection = () => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const navigate = useNavigate();

  // Medicine verification states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setVerificationResult(null); // Clear previous result
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setVerificationResult(null);
  };

  const handleVerifyMedicine = async () => {
    if (!selectedImage) return;

    setVerifying(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_MEDICINE, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error('Medicine verification error:', error);
      setVerificationResult({
        error: true,
        message: 'Failed to verify medicine. Please try again with a clearer image.'
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleFeatureClick = (index: number, featureTitle: string) => {
    // Special handling for Food-Medicine Compatibility
    if (featureTitle === "Food–Medicine Compatibility") {
      navigate("/chat", {
        state: {
          prefill: "Can you tell me about food-medicine interactions? What foods should I avoid with common medications?"
        }
      });
    } else {
      // Normal expand/collapse behavior for other features
      setExpanded(expanded === index ? null : index);
    }
  };

  return (
    <section id="medicine" className="py-24 bg-card">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl rotate-3 scale-105" />
              <img
                src={medicineScan}
                alt="Phone scanning a medicine strip"
                className="relative rounded-3xl w-72 md:w-80 shadow-xl"
              />
            </div>
          </motion.div>

          {/* Content */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
            >
              Primary Feature
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4"
            >
              Medicine Safety Platform
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-muted-foreground mb-8 leading-relaxed"
            >
              Verify your medicines and understand how your food choices interact with your treatments — all in one calm, trustworthy experience.
            </motion.p>

            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className={`rounded-2xl border border-border bg-background p-5 transition-all duration-300 ${
                    feature.title === "Food–Medicine Compatibility" 
                      ? "hover:shadow-lg hover:border-primary/50 hover:scale-[1.02] cursor-pointer" 
                      : "hover:shadow-md"
                  }`}
                >
                  <div 
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => handleFeatureClick(i, feature.title)}
                  >
                    <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center shrink-0`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-foreground">{feature.title}</h3>
                      {feature.title === "Food–Medicine Compatibility" && (
                        <p className="text-xs text-primary mt-0.5">Click to ask AI Assistant →</p>
                      )}
                    </div>
                    {feature.title !== "Food–Medicine Compatibility" && (
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${expanded === i ? "rotate-180" : ""}`}
                      />
                    )}
                  </div>
                  
                  {feature.type === "text" && feature.title !== "Food–Medicine Compatibility" ? (
                    <>
                      {feature.title === "Fake vs Real Medicine Check" ? (
                        <motion.div
                          initial={false}
                          animate={{ height: expanded === i ? "auto" : 0, opacity: expanded === i ? 1 : 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pl-16 space-y-4">
                            {!imagePreview ? (
                              <div>
                                <label className="block">
                                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/30">
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                    <p className="text-sm font-medium text-foreground mb-1">
                                      Upload Medicine Image
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Take a clear photo of your medicine strip or bottle
                                    </p>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageSelect}
                                      className="hidden"
                                    />
                                  </div>
                                </label>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {feature.description}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="relative rounded-lg overflow-hidden border border-border">
                                  <img
                                    src={imagePreview}
                                    alt="Medicine preview"
                                    className="w-full h-48 object-cover"
                                  />
                                  <button
                                    onClick={handleImageRemove}
                                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 hover:bg-destructive/90 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>

                                {!verificationResult && !verifying && (
                                  <button
                                    onClick={handleVerifyMedicine}
                                    className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium hover:bg-primary/90 transition-colors"
                                  >
                                    Verify Medicine Authenticity
                                  </button>
                                )}

                                {verifying && (
                                  <div className="bg-muted rounded-lg p-4 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                                    <p className="text-sm text-muted-foreground">Analyzing image...</p>
                                  </div>
                                )}

                                {verificationResult && !verificationResult.error && (
                                  <div className="bg-card border border-border rounded-lg p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium text-muted-foreground">
                                        Confidence Score
                                      </span>
                                      <span className="text-2xl font-bold text-foreground">
                                        {verificationResult.confidence}%
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-muted-foreground">
                                        Risk Level:
                                      </span>
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                          verificationResult.riskLevel === 'Low'
                                            ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                                            : verificationResult.riskLevel === 'Moderate'
                                            ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
                                            : 'bg-red-500/20 text-red-700 dark:text-red-400'
                                        }`}
                                      >
                                        {verificationResult.riskLevel}
                                      </span>
                                    </div>

                                    <div className="bg-muted/50 rounded-lg p-3">
                                      <p className="text-sm text-foreground whitespace-pre-line">
                                        {verificationResult.message}
                                      </p>
                                    </div>

                                    <button
                                      onClick={handleImageRemove}
                                      className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      Verify Another Medicine
                                    </button>
                                  </div>
                                )}

                                {verificationResult && verificationResult.error && (
                                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                                    <p className="text-sm text-destructive">
                                      {verificationResult.message}
                                    </p>
                                    <button
                                      onClick={handleImageRemove}
                                      className="mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      Try Again
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={false}
                          animate={{ height: expanded === i ? "auto" : 0, opacity: expanded === i ? 1 : 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <p className="text-muted-foreground text-sm mt-3 pl-16 leading-relaxed">
                            {feature.description}
                          </p>
                        </motion.div>
                      )}
                    </>
                  ) : feature.component ? (
                    <feature.component isExpanded={expanded === i} />
                  ) : null}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <ShieldCheck className="w-4 h-4 text-sage" />
              <span>All checks are informational — always consult your doctor.</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MedicineSafetySection;
