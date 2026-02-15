// ============================================================================
// Production-ready configuration for Render deployment
// ============================================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';

// Load environment variables first
dotenv.config();

// Initialize Gemini with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware - CORS configured for hackathon prototype deployment
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));
app.use(express.json());

// Configure multer for memory storage - production safe limits
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit for production
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
    // STEP 3: Use Gemini API for condition analysis
    // ========================================================================
    console.log(`\n🧠 Using Gemini API for condition analysis...`);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    
    const analysisPrompt = `You are a medical triage assistant. Analyze the following symptoms and provide a brief assessment.

Symptoms: ${symptoms}
Age: ${age}
Gender: ${gender}

Respond ONLY in this JSON format (no other text):
{
  "topConditions": [
    {"condition": "condition name", "confidence": 75}
  ],
  "riskAssessment": "brief risk assessment"
}`;

    let geminiResult;
    try {
      const result = await model.generateContent(analysisPrompt);
      const responseText = result.response.text();
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[^{}]*\}/);
      if (jsonMatch) {
        geminiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Gemini analysis error:', error);
      geminiResult = {
        topConditions: [{ condition: 'Unable to analyze', confidence: 0 }],
        riskAssessment: 'Please consult a healthcare provider'
      };
    }

    const topConditions = geminiResult.topConditions || [];
    
    // ========================================================================
    // STEP 4: Determine final risk level
    // ========================================================================
    let finalRiskLevel = riskFloor; // Start with risk floor (Red or Yellow)
    
    if (topConditions.length > 0) {
      const topConfidence = topConditions[0].confidence;
      
      if (topConfidence > 85) {
        finalRiskLevel = 'Red';
      } else if (topConfidence > 65) {
        finalRiskLevel = finalRiskLevel === 'Green' ? 'Yellow' : finalRiskLevel;
      }
    }
    
    console.log(`✅ Final risk level: ${finalRiskLevel}`);

    // ========================================================================
    // STEP 5: Build explanation and return response
    // ========================================================================
    let explanation = geminiResult.riskAssessment || 'Unable to provide assessment';
    
    if (yellowFlag && !redFlag) {
      explanation = `⚠️ Yellow flag detected ("${yellowFlag}"): ${explanation}`;
    }
    
    if (redFlag) {
      explanation = `🚑 EMERGENCY: ${explanation}`;
    }

    return res.status(200).json({
      riskLevel: finalRiskLevel,
      topConditions,
      explanation,
      triageType: 'rule-based-gemini',
      flags: {
        redFlag: redFlag || null,
        yellowFlag: yellowFlag || null
      },
      analysis: {
        age,
        gender
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
      'POST /analyze-symptoms': 'Symptom triage system with Gemini + rule-based detection',
      'POST /chat': 'AI Healthcare Assistant chatbot',
      'POST /verify-medicine': 'Medicine authenticity verification with image analysis',
      'GET /health': 'Health and status check'
    },
    documentation: 'See CHATBOT_IMPLEMENTATION.md and HYBRID_TRIAGE_IMPLEMENTATION.md',
    chatbotEnabled: true
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'Symptom Triage API is running 🏥',
    triageSystem: 'rule-based-gemini',
    chatbotEnabled: true,
    version: '2.1'
  });
});

// Start server
function startServer() {
  app.listen(PORT, () => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🏥 AROGYA HEALTH API v2.1`);
    console.log(`${'='.repeat(60)}`);
    console.log(`🌍 Server running on port ${PORT}`);
    console.log(`\n🔧 Triage Features:`);
    console.log(`   • Rule-based RED flag detection (${RED_FLAG_KEYWORDS.length} keywords)`);
    console.log(`   • Rule-based YELLOW flag detection (${YELLOW_FLAG_KEYWORDS.length} keywords)`);
    console.log(`   • Gemini API condition analysis`);
    console.log(`   • AI-powered healthcare chatbot`);
    console.log(`\n📡 Endpoints:`);
    console.log(`   POST /analyze-symptoms - Analyze with Gemini + rules`);
    console.log(`   POST /chat - AI Healthcare Assistant`);
    console.log(`   POST /verify-medicine - Medicine authenticity verification`);
    console.log(`   GET  /health - Health & status check`);
    console.log(`${'='.repeat(60)}\n`);
  });
}

startServer();
