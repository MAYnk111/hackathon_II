# AI Chatbot - Quick Reference

## 🚀 Quick Start

### Access Chatbot
```
1. Open: http://localhost:8080
2. Login if needed
3. Click "AI Assistant" in navigation
4. Start chatting!
```

### Test API Directly
```bash
# PowerShell
$body = @{ message = "What should I do if I have a fever?"; userContext = @{} } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:5000/chat" -Method Post -Body $body -ContentType "application/json" -UseBasicParsing
```

---

## 🎯 Features

### ✅ What It Does
- Answers general health questions
- Provides educational guidance
- Detects emergencies (RED flags)
- Redirects to SOS/doctors when needed
- Uses context (age, gender, symptoms)
- Works WITHOUT OpenAI API key

### ❌ What It Doesn't Do
- Diagnose medical conditions
- Prescribe medications
- Provide emergency instructions
- Replace healthcare professionals

---

## 🔑 OpenAI Setup (Optional)

### Without API Key
- Uses intelligent fallback responses
- Context-aware replies
- Fully functional

### With API Key
1. Get key: https://platform.openai.com/api-keys
2. Edit: `server/.env`
3. Add: `OPENAI_API_KEY=sk-your-key-here`
4. Restart: `npm start`

---

## 🧪 Test Examples

### Normal Question
```json
{
  "message": "What are symptoms of fever?",
  "userContext": {}
}
```
**Response**: Educational info about fever

### Emergency Detection
```json
{
  "message": "I have severe chest pain",
  "userContext": {}
}
```
**Response**: ⚠️ EMERGENCY ALERT → Call 108 / Use SOS

### Medicine Question
```json
{
  "message": "How much paracetamol should I take?",
  "userContext": {}
}
```
**Response**: Safety warning → Consult professional

---

## 📊 Safety Guardrails

| Scenario | System Response |
|----------|----------------|
| Emergency keywords (chest pain, seizure, etc.) | Immediate alert → SOS/108 |
| Dosage questions | "Consult doctor/pharmacist" |
| Diagnosis requests | "I cannot diagnose, see provider" |
| General health info | Educational guidance + resources |

---

## 🐛 Troubleshooting

### Chat not loading?
```bash
# Check backend
curl http://localhost:5000/health

# Should return: { "chatbotEnabled": true, "version": "2.1" }
```

### "Failed to get response"?
1. Backend running? `npm start` in `/server`
2. Port 5000 available?
3. Check browser console (F12)

### No OpenAI responses?
- System automatically uses fallback
- Check `server/.env` for `OPENAI_API_KEY`
- Verify API key is valid

---

## 📁 File Locations

| File | Purpose |
|------|---------|
| `server/server.js` | Backend `/chat` endpoint (line ~367) |
| `src/components/Chatbot.tsx` | Main chat UI component |
| `src/pages/Chat.tsx` | Chat page wrapper |
| `src/App.tsx` | Route: `/chat` |
| `src/components/Navbar.tsx` | Navigation link: "AI Assistant" |
| `server/.env` | API keys config |
| `CHATBOT_IMPLEMENTATION.md` | Full documentation |

---

## 🎨 UI Features

- ✅ Auto-scroll to bottom
- ✅ Loading spinner ("Typing...")
- ✅ Send on Enter key
- ✅ Clear chat button
- ✅ Suggested questions
- ✅ Quick action buttons
- ✅ Safety disclaimer
- ✅ Mobile responsive
- ✅ User (blue) + Assistant (gray) bubbles
- ✅ Timestamps on messages

---

## 📞 Support

**Documentation**: [CHATBOT_IMPLEMENTATION.md](CHATBOT_IMPLEMENTATION.md)

**Backend Logs**: Check terminal where `npm start` runs

**Frontend Errors**: Browser console (F12 → Console)

**Health Check**: `http://localhost:5000/health`

---

**Status**: ✅ Production Ready  
**Version**: 1.0  
**Last Updated**: February 15, 2026
