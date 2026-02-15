import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Activity, AlertCircle, Info, Loader } from "lucide-react";

interface Condition {
  condition: string;
  confidence: number;
}

const SymptomSection = () => {
  const [userSymptoms, setUserSymptoms] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userGender, setUserGender] = useState("notspecified");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [riskLevel, setRiskLevel] = useState<"Red" | "Yellow" | "Green" | null>(null);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [analysisMessage, setAnalysisMessage] = useState("");

  const getRiskColor = (level: string | null) => {
    switch (level) {
      case "Red":
        return "bg-destructive text-destructive-foreground";
      case "Yellow":
        return "bg-yellow-500 text-white";
      case "Green":
        return "bg-sage text-sage-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getConditionColor = (confidence: number) => {
    if (confidence >= 70) return "bg-destructive/20";
    if (confidence >= 40) return "bg-yellow-500/20";
    return "bg-sage/20";
  };

  const analyzeSymptoms = async () => {
    // Validate input
    if (!userSymptoms.trim()) {
      setError("Please describe your symptoms");
      return;
    }
    if (!userAge || userAge === "" || parseInt(userAge) < 1 || parseInt(userAge) > 150) {
      setError("Please enter a valid age (1-150)");
      return;
    }
    if (userGender === "notspecified") {
      setError("Please select your gender");
      return;
    }

    setLoading(true);
    setError("");
    setRiskLevel(null);
    setConditions([]);
    setAnalysisMessage("");

    try {
      console.log("📋 Sending request to backend...");
      console.log("   Symptoms:", userSymptoms);
      console.log("   Age:", userAge);
      console.log("   Gender:", userGender);

      const response = await fetch("http://localhost:5000/analyze-symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: userSymptoms,
          age: parseInt(userAge),
          gender: userGender,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Backend response:", data);

      setRiskLevel(data.riskLevel);
      setConditions(data.topConditions);
      setAnalysisMessage(data.message);
    } catch (err) {
      console.error("❌ Error:", err);
      if (err instanceof Error) {
        if (err.message.includes("fetch")) {
          setError(
            "Cannot connect to backend. Make sure the server is running on http://localhost:5000"
          );
        } else {
          setError(err.message || "Unable to analyze symptoms. Please try again.");
        }
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="symptoms" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="inline-block bg-accent text-accent-foreground text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            Support Tool
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-4"
          >
            Symptom Awareness
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted-foreground leading-relaxed"
          >
            Gently explore what your symptoms might suggest. Our calm, step-based experience helps you understand possibilities — never diagnoses.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Input side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground">Describe your symptoms</h3>
              </div>

              {/* Symptoms Input */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                  Your Symptoms
                </label>
                <textarea
                  value={userSymptoms}
                  onChange={(e) => setUserSymptoms(e.target.value)}
                  placeholder="e.g., I have a persistent headache for two days, runny nose, and mild sneezing..."
                  disabled={loading}
                  className="w-full bg-muted rounded-2xl p-4 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                  rows={4}
                />
              </div>

              {/* Age Input */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                    Age
                  </label>
                  <input
                    type="number"
                    value={userAge}
                    onChange={(e) => setUserAge(e.target.value)}
                    placeholder="e.g., 25"
                    disabled={loading}
                    min="1"
                    max="150"
                    className="w-full bg-muted rounded-lg p-3 text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                  />
                </div>

                {/* Gender Select */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block">
                    Gender
                  </label>
                  <select
                    value={userGender}
                    onChange={(e) => setUserGender(e.target.value)}
                    disabled={loading}
                    className="w-full bg-muted rounded-lg p-3 text-foreground border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
                  >
                    <option value="notspecified">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive-foreground">{error}</p>
                </div>
              )}

              {/* Analyze Button */}
              <button
                onClick={analyzeSymptoms}
                disabled={loading || !userSymptoms.trim()}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Symptoms"
                )}
              </button>
            </div>
          </motion.div>

          {/* Results side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sage/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-sage-foreground" />
                </div>
                <h3 className="font-heading font-bold text-foreground">Analysis Results</h3>
              </div>

              {!riskLevel && !loading && (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Enter your symptoms and click "Analyze" to get started
                  </p>
                </div>
              )}

              {loading && (
                <div className="text-center py-12">
                  <Loader className="w-10 h-10 mx-auto animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">Analyzing your symptoms...</p>
                </div>
              )}

              {riskLevel && (
                <div className="space-y-6">
                  {/* Risk Level Badge */}
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className={`px-4 py-2 rounded-full font-bold text-sm ${getRiskColor(
                        riskLevel
                      )}`}
                    >
                      Risk Level: {riskLevel}
                    </div>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>

                  {/* Analysis Message */}
                  {analysisMessage && (
                    <div className="bg-muted rounded-xl p-4 border-l-4 border-primary">
                      <p className="text-sm text-foreground leading-relaxed">
                        {analysisMessage}
                      </p>
                    </div>
                  )}

                  {/* Top 3 Conditions */}
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-4">
                      Possible Conditions
                    </h4>
                    <div className="space-y-3">
                      {conditions.map((condition, i) => (
                        <motion.div
                          key={condition.condition}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className={`rounded-lg p-3 ${getConditionColor(
                            condition.confidence
                          )}`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-foreground capitalize">
                              {condition.condition}
                            </span>
                            <span className="text-xs font-bold text-foreground">
                              {condition.confidence}%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${condition.confidence}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-full rounded-full ${
                                condition.confidence >= 70
                                  ? "bg-destructive"
                                  : condition.confidence >= 40
                                    ? "bg-yellow-500"
                                    : "bg-sage"
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="mt-6 flex items-start gap-2 bg-warm rounded-xl p-3">
                <Info className="w-4 h-4 text-warm-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-warm-foreground leading-relaxed">
                  This is informational AI-assisted analysis and not a medical diagnosis. Always consult
                  a qualified healthcare professional for proper medical advice.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SymptomSection;
