# Hugging Face Symptom Classification Integration

## 🏥 Setup & Quick Start

### Prerequisites
- Node.js 16+ installed
- Hugging Face API key (free at https://huggingface.co/settings/tokens)

### Step 1: Configure Backend API Key

1. Open `/server/.env`
2. Replace with your actual Hugging Face API key:
```env
HF_API_KEY=hf_YOUR_ACTUAL_API_KEY_HERE
```

Get your key: https://huggingface.co/settings/tokens

### Step 2: Install Backend Dependencies

```powershell
cd server
npm install
```

### Step 3: Start Backend Server

```powershell
npm start
```

You should see:
```
🏥 Symptom API running on http://localhost:5000
📡 HF_API_KEY configured: ✅

Endpoints:
  POST /analyze-symptoms - Analyze health symptoms
  GET  /health - Health check
```

### Step 4: Keep Frontend Running

In another PowerShell window:
```powershell
npm run dev
```

Frontend: http://localhost:8080

---

## 🔄 How It Works

### Frontend Flow
1. User enters symptoms in the Symptom Awareness page
2. User selects age and gender
3. Click "Analyze Symptoms" button
4. Frontend sends POST request to `http://localhost:5000/analyze-symptoms`
5. Shows:
   - Risk Level badge (Red/Yellow/Green)
   - Top 3 predicted conditions with confidence %
   - Safety disclaimer

### Backend Flow
1. Receives symptom text + age + gender
2. Validates input
3. Calls Hugging Face BART-MNLI zero-shot classification model
4. Extracts top 3 labels with scores
5. Determines risk level:
   - **Red**: High confidence (>70%)
   - **Yellow**: Medium confidence (40-70%)
   - **Green**: Low confidence (<40%)
6. Returns structured JSON response

### Hugging Face Model
- **Model**: facebook/bart-large-mnli
- **Task**: Zero-shot classification
- **Candidate Labels**: 9 common conditions
  - viral infection
  - malaria
  - typhoid
  - common cold
  - migraine
  - dengue
  - food poisoning
  - heat stroke
  - allergic reaction

---

## 📡 API Endpoints

### POST /analyze-symptoms

**Request:**
```json
{
  "symptoms": "persistent headache, runny nose",
  "age": 25,
  "gender": "male"
}
```

**Response:**
```json
{
  "riskLevel": "Yellow",
  "topConditions": [
    { "condition": "common cold", "confidence": 62 },
    { "condition": "allergic reaction", "confidence": 28 },
    { "condition": "migraine", "confidence": 10 }
  ],
  "message": "Based on reported symptoms, common cold is possible. Monitor symptoms and consider consulting a healthcare provider.",
  "analysis": {
    "age": 25,
    "gender": "male",
    "topScore": 62
  }
}
```

### GET /health

**Response:**
```json
{
  "status": "Symptom API is running 🏥"
}
```

---

## 🧪 Test the Backend

### Using cURL:
```powershell
$body = @{
    symptoms = "I have a fever, chills, and body aches"
    age = 30
    gender = "female"
} | ConvertTo-Json

curl -X POST http://localhost:5000/analyze-symptoms `
  -H "Content-Type: application/json" `
  -d $body
```

### Using PowerShell:
```powershell
$body = @{
    symptoms = "severe headache with high fever"
    age = 28
    gender = "male"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/analyze-symptoms" `
  -Method POST `
  -Headers @{"Content-Type" = "application/json"} `
  -Body $body

$response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## 🔒 Security Notes

### ✅ Backend (.env)
- HF_API_KEY stored ONLY in `/server/.env`
- Not exposed to frontend
- Not committed to git (add to .gitignore)

### ✅ Frontend
- NO API keys in frontend .env
- Calls backend endpoint only
- Backend proxy handles HF API calls

### ✅ Environment Separation
- Frontend: Uses existing `.env` for Firebase only
- Backend: Uses separate `.env` for HF_API_KEY
- Two different ports: 8080 (frontend) + 5000 (backend)
- CORS enabled for localhost development

---

## 🛠️ Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running: `npm start` in `/server` folder
- Check backend is on port 5000: `http://localhost:5000/health`
- Verify CORS is enabled in server.js

### "Invalid API key" error
- Check `/server/.env` has correct `HF_API_KEY`
- Get token from: https://huggingface.co/settings/tokens
- Token format should start with `hf_`

### "API rate limit exceeded"
- Hugging Face free tier has limits
- Wait a few minutes and try again
- Consider upgrading to Pro for higher limits

### "Model is loading" (503 error)
- First request to inactive model takes 30-60 seconds
- Model automatically loads when needed
- Try again after waiting

### "No error message, just loading forever"
- Check browser console (F12) for errors
- Check backend logs for API responses
- Verify `http://localhost:5000/health` works

---

## 📦 File Structure

```
/hackathon_II
├── /server
│   ├── server.js          (Express server with HF integration)
│   ├── package.json       (Backend dependencies)
│   ├── .env              (HF_API_KEY - DO NOT commit)
│   └── node_modules/     (dependencies)
├── /src
│   ├── /components
│   │   └── SymptomSection.tsx  (UI + frontend logic)
│   └── /...
├── .env                   (Frontend Firebase keys only)
└── package.json          (Frontend dependencies)
```

---

## 🚀 Deployment

### For Production
1. Deploy backend to Heroku/Railway/Vercel
2. Deploy frontend to Vercel/Netlify
3. Update frontend API endpoint:
```typescript
const response = await fetch("https://your-backend.com/analyze-symptoms", {
  // ... rest of code
});
```
4. Ensure HF_API_KEY is set in production env vars

---

## 📊 Example Results

### High Risk (Red)
```json
{
  "riskLevel": "Red",
  "topConditions": [
    { "condition": "malaria", "confidence": 85 },
    { "condition": "dengue", "confidence": 78 },
    { "condition": "typhoid", "confidence": 65 }
  ]
}
```

### Medium Risk (Yellow)
```json
{
  "riskLevel": "Yellow",
  "topConditions": [
    { "condition": "common cold", "confidence": 62 },
    { "condition": "allergic reaction", "confidence": 45 },
    { "condition": "migraine", "confidence": 30 }
  ]
}
```

### Low Risk (Green)
```json
{
  "riskLevel": "Green",
  "topConditions": [
    { "condition": "allergic reaction", "confidence": 38 },
    { "condition": "common cold", "confidence": 25 },
    { "condition": "migraine", "confidence": 15 }
  ]
}
```

---

## 📝 Medical Disclaimer

This is an **AI-assisted informational tool**, not a replacement for professional medical diagnosis. Users should:
- Always consult qualified healthcare professionals
- Never rely solely on this tool for medical decisions
- Seek immediate medical attention for emergencies

---

## ✨ Features

✅ Real-time symptom analysis  
✅ AI-powered classification using Hugging Face  
✅ Risk level assessment (Red/Yellow/Green)  
✅ Confidence percentages  
✅ Separate secure backend  
✅ Loading states and error handling  
✅ Responsive UI  
✅ Console logging for debugging  

---

**Status:** ✅ **FULLY IMPLEMENTED & READY TO USE**

Backend + Frontend fully integrated with Hugging Face API!
