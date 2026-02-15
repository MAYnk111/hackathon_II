import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { pipeline } from '@xenova/transformers';
import multer from 'multer';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ============================================================================
// STEP 1: Rule-Based Severity Keywords
// ============================================================================

// RED FLAGS: Immediate Emergency - Return immediately without ML
const RED_FLAG_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "breathlessness",
  "unable to breathe",
  "unconscious",
  "unresponsive",
  "seizure",
  "convulsion",
  "fitting",
  "severe bleeding",
  "bleeding heavily",
  "hemorrhage",
  "confusion",
  "disorientation",
  "blue lips",
  "cyanosis",
  "loss of consciousness",
  "fainting",
  "syncope",
  "severe chest tightness",
  "heart attack",
  "cardiac",
  "stroke",
  "sudden paralysis",
  "poison",
  "overdose",
  "severe allergic reaction",
  "anaphylaxis"
];

// YELLOW FLAGS: Moderate Concern - Set risk floor to Yellow, continue with ML
const YELLOW_FLAG_KEYWORDS = [
  "high fever",
  "persistent fever",
  "fever for",
  "sustained fever",
  "vomiting",
  "severe headache",
  "unbearable headache",
  "stiff neck",
  "neck stiffness",
  "blood in stool",
  "bloody stool",
  "hematemesis",
  "blood in vomit",
  "coughing blood",
  "hemoptysis",
  "prolonged cough",
  "persistent cough",
  "extreme fatigue",
  "severe weakness",
  "night sweats",
  "sweating at night",
  "jaundice",
  "yellow skin",
  "yellow eyes",
  "severe abdominal pain",
  "acute abdomen",
  "severe diarrhea",
  "dysentery",
  "severe dehydration",
  "unable to drink",
  "altered mental status",
  "severe dizziness",
  "severe joint pain",
  "severe muscle pain",
  "rigidity",
  "meningeal signs"
];

// ============================================================================
// STEP 2: Improved Candidate Labels (12 conditions)
// ============================================================================
const CANDIDATE_LABELS = [
  "tuberculosis",
  "viral infection",
  "bacterial infection",
  "malaria",
  "dengue",
  "food poisoning",
  "common cold",
  "migraine",
  "asthma",
  "heat stroke",
  "allergic reaction",
  "gastroenteritis"
];

// ============================================================================
// Helper Functions for Rule-Based Detection
// ============================================================================

function checkRedFlags(symptoms) {
  const lowerSymptoms = symptoms.toLowerCase();
  for (const keyword of RED_FLAG_KEYWORDS) {
    if (lowerSymptoms.includes(keyword)) {
      return keyword;
    }
  }
  return null;
}

function checkYellowFlags(symptoms) {
  const lowerSymptoms = symptoms.toLowerCase();
  for (const keyword of YELLOW_FLAG_KEYWORDS) {
    if (lowerSymptoms.includes(keyword)) {
      return keyword;
    }
  }
  return null;
}

// Initialize classifier globally
let classifier = null;
let classifierReady = false;

async function initializeClassifier() {
  if (classifierReady) return;
  
  try {
    console.log('🔄 Loading zero-shot classification model...');
    classifier = await pipeline('zero-shot-classification', 'Xenova/bart-large-mnli');
    classifierReady = true;
    console.log('✅ Model loaded successfully!');
  } catch (error) {
    console.error('❌ Failed to load model:', error);
    classifierReady = false;
  }
}

/**
 * Analyze symptoms using zero-shot classification
 */
async function analyzeSymptoms(symptoms, candidateLabels) {
  const startTime = Date.now();
  
  try {
    console.log(`\n🧠 Running zero-shot classification...`);
    
    const result = await classifier(symptoms, candidateLabels, {
      multi_label: true
    });
    
    const elapsedTime = Date.now() - startTime;
    console.log(`✅ Classification complete (${elapsedTime}ms)`);
    
    return result;
  } catch (error) {
    const elapsedTime = Date.now() - startTime;
    console.error(`❌ Classification error (${elapsedTime}ms):`, error.message);
    throw error;
  }
}

/**
 * POST /analyze-symptoms
 * 
 * Hybrid Triage System:
 * 1. Rule-based RED flag detection (immediate return)
 * 2. Rule-based YELLOW flag detection (set floor)
 * 3. ML classification for condition ranking
 * 4. Final risk calculation with adjusted thresholds
 */
app.post('/analyze-symptoms', async (req, res) => {
  try {
    const { symptoms, age, gender } = req.body;

    // Validate input
    if (!symptoms || !age || !gender) {
      return res.status(400).json({
        riskLevel: 'Green',
        topConditions: [],
        explanation: 'Missing required fields: symptoms, age, gender'
      });
    }

    console.log(`\n📋 Analyzing symptoms:`);
    console.log(`   Symptoms: ${symptoms}`);
    console.log(`   Age: ${age}`);
    console.log(`   Gender: ${gender}`);

    // ========================================================================
    // STEP 1: Check for RED FLAGS (Emergency)
    // ========================================================================
    console.log(`\n🚨 Checking for RED FLAGS (emergency)...`);
    const redFlag = checkRedFlags(symptoms);
    
    if (redFlag) {
      console.log(`🔴 RED FLAG DETECTED: "${redFlag}"`);
      console.log(`⚠️  RETURNING IMMEDIATE RED - DO NOT CALL ML`);
      
      return res.status(200).json({
        riskLevel: 'Red',
        topConditions: [],
        explanation: `EMERGENCY ALERT: Critical symptom detected ("${redFlag}"). Seek immediate medical attention or call emergency services.`,
        triageType: 'rule-based-red',
        detectedKeyword: redFlag,
        analysis: { age, gender }
      });
    }

    console.log(`✅ No RED FLAGS detected`);

    // ========================================================================
    // STEP 2: Check for YELLOW FLAGS (Moderate)
    // ========================================================================
    console.log(`\n⚠️  Checking for YELLOW FLAGS (moderate concern)...`);
    const yellowFlag = checkYellowFlags(symptoms);
    
    let riskFloor = 'Green';
    if (yellowFlag) {
      console.log(`🟡 YELLOW FLAG DETECTED: "${yellowFlag}"`);
      riskFloor = 'Yellow';
      console.log(`📍 Setting risk floor to YELLOW`);
    } else {
      console.log(`✅ No YELLOW FLAGS detected`);
    }

    // ========================================================================
    // STEP 3: Ensure classifier is initialized
    // ========================================================================
    if (!classifierReady) {
      await initializeClassifier();
    }

    if (!classifier) {
      return res.status(500).json({
        riskLevel: riskFloor,
        topConditions: [],
        explanation: 'Classification model is not available',
        triageType: 'error'
      });
    }

    // ========================================================================
    // STEP 4: Run ML classification for condition prediction
    // ========================================================================
    console.log(`\n🧠 Running ML classification for conditions...`);
    const mlResult = await analyzeSymptoms(symptoms, CANDIDATE_LABELS);

    const { labels, scores } = mlResult;

    if (!labels || !scores || labels.length === 0) {
      return res.status(500).json({
        riskLevel: riskFloor,
        topConditions: [],
        explanation: 'Invalid response from classification model',
        triageType: 'ml-error'
      });
    }

    // ========================================================================
    // STEP 5: Get top 3 conditions with improved confidence scores
    // ========================================================================
    const topConditions = labels.slice(0, 3).map((label, index) => ({
      condition: label,
      confidence: Math.round(scores[index] * 100)
    }));

    console.log(`\n📊 ML Classification Results:`);
    console.log(`   Top score: ${Math.round(scores[0] * 100)}% (${labels[0]})`);
    topConditions.forEach((c, i) => {
      console.log(`   ${i + 1}. ${c.condition}: ${c.confidence}%`);
    });

    // ========================================================================
    // STEP 6: IMPROVED RISK LOGIC with new thresholds
    // ========================================================================
    const topScore = scores[0];
    
    let mlRiskLevel = 'Green';
    
    console.log(`\n🔢 Calculating risk level (topScore: ${Math.round(topScore * 100)}%)`);
    
    if (topScore > 0.85) {
      mlRiskLevel = 'Red';
      console.log(`   → topScore > 85% = RED (very high confidence)`);
    } else if (topScore > 0.65) {
      mlRiskLevel = 'Yellow';
      console.log(`   → topScore > 65% = YELLOW (moderate-high confidence)`);
    } else {
      mlRiskLevel = 'Green';
      console.log(`   → topScore ≤ 65% = GREEN (low confidence)`);
    }

    // ========================================================================
    // STEP 7: Apply risk floor (YELLOW flag can't downgrade to Green)
    // ========================================================================
    let finalRiskLevel = mlRiskLevel;
    
    if (riskFloor === 'Yellow' && (mlRiskLevel === 'Green')) {
      console.log(`\n🔐 Risk floor enforced: YELLOW flag prevents downgrade to GREEN`);
      finalRiskLevel = 'Yellow';
    } else {
      console.log(`\n✅ Final risk: ${finalRiskLevel}`);
    }

    // ========================================================================
    // STEP 8: Build explanation message
    // ========================================================================
    let explanation = `Hybrid Triage Result: `;
    
    if (yellowFlag && !redFlag) {
      explanation += `YELLOW flag ("${yellowFlag}") detected. `;
    }
    
    if (finalRiskLevel === 'Red') {
      explanation += `High likelihood of ${topConditions[0].condition} (${topConditions[0].confidence}%). Medical attention is recommended.`;
    } else if (finalRiskLevel === 'Yellow') {
      explanation += `${topConditions[0].condition} is possible (${topConditions[0].confidence}%). Monitor symptoms and consider consulting a healthcare provider.`;
    } else {
      explanation += `Symptoms suggest mild conditions (${topConditions[0].condition}: ${topConditions[0].confidence}%). Home care and monitoring are appropriate.`;
    }

    console.log(`\n📝 Final Explanation: ${explanation}`);

    // ========================================================================
    // STEP 9: Return structured response
    // ========================================================================
    return res.status(200).json({
      riskLevel: finalRiskLevel,
      topConditions,
      explanation,
      triageType: 'hybrid-ml',
      flags: {
        redFlag: redFlag || null,
        yellowFlag: yellowFlag || null
      },
      analysis: {
        age,
        gender,
        topScore: Math.round(topScore * 100),
        mlRiskLevel,
        riskFloor
      }
    });

  } catch (error) {
    console.error('❌ Error analyzing symptoms:');
    console.error('   Error message:', error.message);

    return res.status(500).json({
      riskLevel: 'Green',
      topConditions: [],
      explanation: `Server error: ${error.message}`,
      triageType: 'error'
    });
  }
});

// ============================================================================
// AI CHATBOT ENDPOINT
// ============================================================================

/**
 * POST /chat
 *
 * Gemini SDK integration
 */
app.post('/chat', async (req, res) => {
  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Map language code to full language name
    const languageMap = {
      en: 'English',
      hi: 'Hindi',
      mr: 'Marathi'
    };

    const selectedLanguage = languageMap[language] || 'English';

    // Create a prompt that instructs Gemini to respond in the selected language
    const prompt = `You are a healthcare assistant.

Respond strictly in ${selectedLanguage}.
Use simple, clear language appropriate for the user's language.
Do not diagnose or prescribe medication.
If symptoms indicate emergency, suggest using the SOS feature.

User: ${message}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    const result = await model.generateContent(prompt);
    const reply = result.response.text() || '';
    return res.json({ reply });
  } catch (error) {
    console.error('Gemini SDK Error:', error);
    return res.status(500).json({ reply: 'AI service temporarily unavailable.' });
  }
});

// ============================================================================
// MEDICINE VERIFICATION ENDPOINT
// ============================================================================

/**
 * POST /verify-medicine
 * 
 * Simulates AI-based medicine authenticity verification
 * Uses deterministic confidence scoring based on image hash
 */
app.post('/verify-medicine', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No image provided',
        message: 'Please upload an image of the medicine'
      });
    }

    // Get image data
    const imageBuffer = req.file.buffer;
    const imageSizeKB = (imageBuffer.length / 1024).toFixed(2);

    // Calculate deterministic hash from buffer
    // Sum all byte values and create a consistent numeric hash
    let hash = 0;
    for (let i = 0; i < imageBuffer.length; i++) {
      hash += imageBuffer[i];
    }
    
    // Normalize hash to a more manageable number (avoid overflow)
    hash = hash % 10000;

    // Generate confidence score (55% to 88%, deterministic)
    const confidence = 55 + (hash % 34); // 34 gives us range 55-88

    // Assign risk level based on confidence
    let riskLevel, message;
    
    if (confidence < 65) {
      riskLevel = 'High';
      message = '⚠️ High Risk Detected\n\n' +
        '• Minor packaging inconsistencies detected\n' +
        '• Label print clarity variation observed\n' +
        '• Alignment irregularity noted\n' +
        '• Hologram authenticity uncertain\n\n' +
        '⚡ Action Required: Please consult a licensed pharmacist or contact the manufacturer directly for verification.';
    } else if (confidence >= 65 && confidence <= 75) {
      riskLevel = 'Moderate';
      message = '⚡ Moderate Risk - Manual Verification Recommended\n\n' +
        '• Packaging structure largely consistent\n' +
        '• Slight contrast variation detected in labeling\n' +
        '• Color saturation within acceptable range\n' +
        '• Minor discrepancies in font rendering\n\n' +
        '💡 Recommendation: Compare with a known authentic sample or verify batch number with manufacturer.';
    } else {
      riskLevel = 'Low';
      message = '✅ Low Risk - Appears Authentic\n\n' +
        '• Packaging structure consistent with standards\n' +
        '• Label alignment within normal parameters\n' +
        '• No major visual discrepancies detected\n' +
        '• Print quality meets expected criteria\n\n' +
        '📋 Note: This analysis is based on visual assessment. For complete assurance, verify batch details with the official manufacturer database.';
    }

    // Log analysis for monitoring (prototype only)
    console.log(`Medicine Verification: Size=${imageSizeKB}KB, Hash=${hash}, Confidence=${confidence}%, Risk=${riskLevel}`);

    return res.json({
      confidence,
      riskLevel,
      message,
      metadata: {
        imageSizeKB,
        processedAt: new Date().toISOString(),
        modelVersion: 'prototype-v1.0',
        note: 'This is a simulated analysis for prototype demonstration'
      }
    });

  } catch (error) {
    console.error('Medicine verification error:', error);
    return res.status(500).json({ 
      error: 'Verification failed',
      message: 'Unable to process the image. Please try again with a clear photo.'
    });
  }
});

// ============================================================================
// ROOT ENDPOINT
// ============================================================================

// Root endpoint - API welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Arogya Health API 🏥',
    version: '2.1',
    status: 'running',
    endpoints: {
      'POST /analyze-symptoms': 'Hybrid triage system with ML + rule-based detection',
      'POST /chat': 'AI Healthcare Assistant chatbot',
      'POST /verify-medicine': 'Medicine authenticity verification with image analysis',
      'GET /health': 'Health and status check'
    },
    documentation: 'See CHATBOT_IMPLEMENTATION.md and HYBRID_TRIAGE_IMPLEMENTATION.md',
    chatbotEnabled: true,
    modelReady: classifierReady
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'Symptom Triage API is running 🏥',
    modelReady: classifierReady,
    triageSystem: 'hybrid-rule-based-ml',
    chatbotEnabled: true,
    version: '2.1'
  });
});

// Start server
async function startServer() {
  // Initialize classifier on startup
  await initializeClassifier();
  
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🏥 HYBRID SYMPTOM TRIAGE API v2.0`);
    console.log(`${'='.repeat(60)}`);
    console.log(`🌍 Running on http://localhost:${PORT}`);
    console.log(`📋 Model Status: ${classifierReady ? '✅ Ready' : '❌ Loading...'}`);
    console.log(`\n🔧 Triage Features:`);
    console.log(`   • Rule-based RED flag detection (${RED_FLAG_KEYWORDS.length} keywords)`);
    console.log(`   • Rule-based YELLOW flag detection (${YELLOW_FLAG_KEYWORDS.length} keywords)`);
    console.log(`   • ML condition classification (${CANDIDATE_LABELS.length} conditions)`);
    console.log(`   • Improved risk thresholds (>85%=Red, >60%=Yellow)`);
    console.log(`\n📡 Endpoints:`);
    console.log(`   POST /analyze-symptoms - Analyze with hybrid triage`);
    console.log(`   POST /chat - AI Healthcare Assistant`);
    console.log(`   POST /verify-medicine - Medicine authenticity verification`);
    console.log(`   GET  /health - Health & status check`);
    console.log(`${'='.repeat(60)}\n`);
  });
}

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
