import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Activity, AlertCircle, Info, Loader, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Condition {
  name: string;
  reason: string;
}

interface AnalysisResult {
  riskLevel: "Red" | "Yellow" | "Green" | null;
  topConditions: Condition[];
  advice: string[];
  fullText: string;
}

const SymptomSection = () => {
  const [userSymptoms, setUserSymptoms] = useState("");
  const [userAge, setUserAge] = useState("");
  const [userGender, setUserGender] = useState("notspecified");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const navigate = useNavigate();

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Red":
        return "bg-red-500 text-white";
      case "Yellow":
        return "bg-yellow-500 text-white";
      case "Green":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case "Red":
        return "🔴 High Risk";
      case "Yellow":
        return "🟡 Moderate Risk";
      case "Green":
        return "🟢 Low Risk";
      default:
        return "Risk Level";
    }
  };

  const parseGeminiResponse = (replyText: string): AnalysisResult => {
    const lines = replyText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    
    let riskLevel: "Red" | "Yellow" | "Green" | null = null;
    const topConditions: Condition[] = [];
    const advice: string[] = [];
    
    let section: "risk" | "conditions" | "advice" | null = null;
    
    for (const line of lines) {
      // Detect sections
      if (/^RiskLevel:/i.test(line)) {
        section = "risk";
        const match = line.match(/Red|Yellow|Green/i);
        if (match) {
          const level = match[0];
          riskLevel = (level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()) as "Red" | "Yellow" | "Green";
        }
        continue;
      }
      
      if (/^TopConditions:/i.test(line)) {
        section = "conditions";
        continue;
      }
      
      if (/^ShortAdvice:/i.test(line)) {
        section = "advice";
        continue;
      }
      
      // Parse content
      if (section === "conditions" && /^\d+\./.test(line)) {
        // Format: "1. Condition name – short reason"
        const match = line.match(/^\d+\.\s*(.+?)\s*[–—-]\s*(.+)$/);
        if (match) {
          topConditions.push({ name: match[1].trim(), reason: match[2].trim() });
        } else {
          // Fallback: just take the text after the number
          const text = line.replace(/^\d+\.\s*/, "").trim();
          if (text) {
            topConditions.push({ name: text, reason: "" });
          }
        }
      } else if (section === "advice" && /^[-•]/.test(line)) {
        const text = line.replace(/^[-•]\s*/, "").trim();
        if (text) {
          advice.push(text);
        }
      }
    }
    
    // Fallback: if no structured data found, try to extract inline
    if (!riskLevel) {
      const match = replyText.match(/\b(Red|Yellow|Green)\b/i);
      if (match) {
        const level = match[1];
        riskLevel = (level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()) as "Red" | "Yellow" | "Green";
      }
    }
    
    return {
      riskLevel,
      topConditions: topConditions.slice(0, 3), // Max 3
      advice: advice.slice(0, 3), // Max 3
      fullText: replyText,
    };
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
    setResult(null);
    setShowFullExplanation(false);

    try {
      const triagePrompt = `You are a healthcare triage assistant.

Analyze the symptoms below and respond STRICTLY in this JSON-like format:

RiskLevel: Green | Yellow | Red

TopConditions:
1. Condition name – short reason (1 line)
2. Condition name – short reason (1 line)
3. Condition name – short reason (1 line)

ShortAdvice:
- 2–3 bullet points only

Symptoms:
${userSymptoms}

Do NOT include long explanations.
Do NOT include markdown.
Keep it concise.`;

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: triagePrompt,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();
      const replyText = typeof data.reply === "string" ? data.reply : "";
      const parsed = parseGeminiResponse(replyText);
      
      setResult(parsed);
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
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm min-h-[500px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sage/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-sage-foreground" />
                </div>
                <h3 className="font-heading font-bold text-foreground">Analysis Results</h3>
              </div>

              {/* Empty State */}
              {!result && !loading && (
                <div className="text-center py-16">
                  <Activity className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Enter your symptoms and click "Analyze" to get started
                  </p>
                </div>
              )}

              {/* Loading State */}
              {loading && (
                <div className="text-center py-16">
                  <Loader className="w-12 h-12 mx-auto animate-spin text-primary mb-4" />
                  <p className="text-sm text-muted-foreground">Analyzing your symptoms...</p>
                  <p className="text-xs text-muted-foreground/70 mt-2">This may take a few seconds</p>
                </div>
              )}

              {/* Results Display */}
              {result && (
                <div className="space-y-6">
                  {/* 🔴 RISK BADGE */}
                  {result.riskLevel && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex justify-center"
                    >
                      <div
                        className={`${getRiskColor(result.riskLevel)} px-8 py-4 rounded-2xl font-bold text-lg shadow-lg`}
                      >
                        {getRiskLabel(result.riskLevel)}
                      </div>
                    </motion.div>
                  )}

                  {/* 🚨 SOS INTEGRATION */}
                  {result.riskLevel === "Red" && (
                    <motion.div
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="rounded-xl border-2 border-red-500 bg-red-50 p-4 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600" />
                        <p className="text-sm font-bold text-red-900">
                          This may require immediate medical attention.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate("/dashboard#sos")}
                        className="w-full rounded-xl bg-red-600 text-white py-3 text-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        🚨 Use SOS Feature Now
                      </button>
                    </motion.div>
                  )}

                  {/* 🦠 TOP 3 CONDITIONS */}
                  {result.topConditions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        🦠 Top Possible Conditions
                      </h4>
                      <div className="space-y-3">
                        {result.topConditions.map((condition, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-gradient-to-r from-primary/5 to-transparent border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="font-semibold text-foreground mb-1">
                              {condition.name}
                            </div>
                            {condition.reason && (
                              <div className="text-sm text-muted-foreground">
                                {condition.reason}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 🩺 QUICK ADVICE */}
                  {result.advice.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                        🩺 Quick Advice
                      </h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <ul className="space-y-2">
                          {result.advice.map((item, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="text-sm text-blue-900 flex items-start gap-2"
                            >
                              <span className="text-blue-600 mt-0.5">•</span>
                              <span>{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* 📄 VIEW DETAILED EXPLANATION TOGGLE */}
                  <div>
                    <button
                      onClick={() => setShowFullExplanation(!showFullExplanation)}
                      className="w-full flex items-center justify-between bg-muted hover:bg-muted/80 rounded-xl p-3 text-sm font-medium text-foreground transition-colors"
                    >
                      <span>View detailed explanation</span>
                      {showFullExplanation ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    {showFullExplanation && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 bg-muted/50 rounded-xl p-4 border border-border overflow-hidden"
                      >
                        <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {result.fullText}
                        </p>
                      </motion.div>
                    )}
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
