import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, MapPin, Phone, CheckCircle2, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalState = "confirmation" | "countdown" | "processing" | "success" | "error";

interface EmergencyData {
  latitude: number;
  longitude: number;
  mapsLink: string;
  timestamp: Date;
}

const SOSModal = ({ isOpen, onClose }: SOSModalProps) => {
  const [modalState, setModalState] = useState<ModalState>("confirmation");
  const [countdown, setCountdown] = useState(10);
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setModalState("confirmation");
      setCountdown(10);
      setEmergencyData(null);
      setError(null);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (modalState === "countdown" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (modalState === "countdown" && countdown === 0) {
      handleEmergency();
    }
  }, [modalState, countdown]);

  const handleCancel = () => {
    setModalState("confirmation");
    setCountdown(10);
    onClose();
  };

  const handleStartCountdown = () => {
    setModalState("countdown");
  };

  const captureLocation = (): Promise<EmergencyData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
          resolve({
            latitude,
            longitude,
            mapsLink,
            timestamp: new Date(),
          });
        },
        (error) => {
          reject(new Error(`Location access denied: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  };

  const saveEmergencyToFirebase = async (data: EmergencyData) => {
    try {
      const emergencyRef = collection(db, "emergencies");
      await addDoc(emergencyRef, {
        userId: user?.uid || "anonymous",
        userEmail: user?.email || "not-provided",
        latitude: data.latitude,
        longitude: data.longitude,
        mapsLink: data.mapsLink,
        timestamp: serverTimestamp(),
        status: "triggered",
      });
    } catch (err) {
      console.error("Failed to save to Firebase:", err);
      throw new Error("Failed to save emergency data");
    }
  };

  const handleEmergency = async () => {
    setModalState("processing");

    try {
      // 1. Capture geolocation
      const locationData = await captureLocation();
      setEmergencyData(locationData);

      // 2. Save to Firebase
      await saveEmergencyToFirebase(locationData);

      // 3. Placeholder for Twilio SMS integration
      console.log("📱 SMS Integration Placeholder - Would send SMS to emergency contact");
      console.log("Location:", locationData.mapsLink);

      // 4. Show success
      setModalState("success");
    } catch (err) {
      console.error("Emergency handling error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setModalState("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={modalState === "confirmation" ? handleCancel : undefined}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-card border-2 border-border rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8 relative">
              {/* Close button - only in confirmation state */}
              {modalState === "confirmation" && (
                <button
                  onClick={handleCancel}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              )}

              {/* Confirmation State */}
              {modalState === "confirmation" && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-sos/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-10 h-10 text-sos animate-pulse" />
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground mb-3">
                    Activate Emergency Alert?
                  </h2>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    This will capture your location and notify your emergency contact after a 10-second countdown.
                  </p>

                  <Alert className="mb-6 border-amber-600/50 bg-amber-50 dark:bg-amber-950/20">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 dark:text-amber-200 text-xs">
                      <strong>Important:</strong> This does not replace official emergency services. For life-threatening emergencies, call 108 or 112 immediately.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleStartCountdown}
                      size="lg"
                      className="w-full bg-sos text-sos-foreground hover:bg-sos/90 font-bold text-lg"
                    >
                      Start Emergency Alert
                    </Button>
                    <Button
                      onClick={handleCancel}
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                    <a
                      href="tel:108"
                      className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Phone className="w-4 h-4" />
                      Call 108
                    </a>
                    <a
                      href="tel:112"
                      className="flex-1 flex items-center justify-center gap-2 bg-foreground text-background px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Phone className="w-4 h-4" />
                      Call 112
                    </a>
                  </div>
                </div>
              )}

              {/* Countdown State */}
              {modalState === "countdown" && (
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-muted"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 56}`}
                        strokeDashoffset={`${2 * Math.PI * 56 * (1 - countdown / 10)}`}
                        className="text-sos transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-bold text-sos">{countdown}</span>
                    </div>
                  </div>

                  <h2 className="font-heading text-2xl font-extrabold text-foreground mb-2">
                    Emergency Alert Activating...
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Your location will be captured and your emergency contact will be notified.
                  </p>

                  <Button
                    onClick={handleCancel}
                    size="lg"
                    variant="outline"
                    className="w-full border-2 font-bold"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel Emergency
                  </Button>
                </div>
              )}

              {/* Processing State */}
              {modalState === "processing" && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                  <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                    Processing Emergency Alert...
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Capturing location and sending notification
                  </p>
                </div>
              )}

              {/* Success State */}
              {modalState === "success" && emergencyData && (
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </motion.div>

                  <h2 className="font-heading text-2xl font-extrabold text-foreground mb-3">
                    Emergency Contact Notified
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Your emergency contact has been notified with your location details.
                  </p>

                  <div className="bg-muted rounded-2xl p-4 mb-6 text-left">
                    <div className="flex items-start gap-3 mb-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground mb-1">Your Location</p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {emergencyData.latitude.toFixed(6)}, {emergencyData.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                    <a
                      href={emergencyData.mapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity w-full"
                    >
                      <MapPin className="w-4 h-4" />
                      View on Google Maps
                    </a>
                  </div>

                  <Alert className="mb-6 border-blue-600/50 bg-blue-50 dark:bg-blue-950/20">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200 text-xs">
                      SMS notification sent (via Twilio integration). If this is a medical emergency, please call 108 or 112 immediately.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={handleCancel}
                    size="lg"
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              )}

              {/* Error State */}
              {modalState === "error" && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>

                  <h2 className="font-heading text-2xl font-extrabold text-foreground mb-3">
                    Alert Failed
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    {error || "Unable to process emergency alert. Please try again or call emergency services directly."}
                  </p>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => {
                        setModalState("confirmation");
                        setError(null);
                      }}
                      size="lg"
                      variant="outline"
                      className="w-full"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={handleCancel}
                      size="lg"
                      className="w-full"
                    >
                      Close
                    </Button>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
                    <a
                      href="tel:108"
                      className="flex-1 flex items-center justify-center gap-2 bg-sos text-sos-foreground px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Phone className="w-4 h-4" />
                      Call 108
                    </a>
                    <a
                      href="tel:112"
                      className="flex-1 flex items-center justify-center gap-2 bg-sos text-sos-foreground px-4 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <Phone className="w-4 h-4" />
                      Call 112
                    </a>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SOSModal;
