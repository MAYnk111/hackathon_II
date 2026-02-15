# Production Deployment Quick Reference

## ⚡ 5-Minute Setup

### Step 1: Deploy Backend to Render
```
1. Go to render.com → New Web Service
2. Connect GitHub repo
3. Start Command: cd server && npm start
4. Environment Variables:
   GEMINI_API_KEY=[your_key]
   FRONTEND_URL=https://your-app.vercel.app
5. Deploy ✓
```

### Step 2: Deploy Frontend to Vercel
```
1. Go to vercel.com → New Project
2. Import GitHub repo
3. Environment Variables:
   VITE_API_URL=https://arogya-backend.onrender.com
4. Deploy ✓
```

### Step 3: Update Backend CORS
```
Go back to Render → Environment
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🔧 Configuration

### Backend (.env on Render)
```
GEMINI_API_KEY=sk-...
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (.env on Vercel)
```
VITE_API_URL=https://arogya-backend.onrender.com
```

---

## ✅ Verification

**Backend:**
```bash
curl https://arogya-backend.onrender.com/health
# Should return: {"status":"Symptom Triage API is running 🏥",...}
```

**Frontend:**
1. Open https://your-app.vercel.app
2. Go to Symptoms section
3. Submit a symptom → Should work
4. Browser console → No errors

---

## 📋 Key Changes Made

✅ Dynamic PORT from env variable
✅ Production CORS configuration  
✅ Centralized API URL config (apiConfig.ts)
✅ No hardcoded localhost references
✅ 5MB file upload limit
✅ Environment variables for all secrets

---

## 🚀 All Features Included

- Symptom Analysis (Hybrid ML + Rules)
- AI Chatbot (Healthcare Assistant)
- Medicine Verification (Image-based)
- Multilingual (English/Hindi/Marathi)
- Medicine Reminders
- Vedic Guidance
- SOS Features

---

## 📚 Documentation

- **Full Guide:** `PRODUCTION_DEPLOYMENT.md`
- **Summary:** `PRODUCTION_REFACTOR_SUMMARY.md`
- **API Config:** `src/config/apiConfig.ts`

---

## ⚠️ Important Notes

1. **GEMINI_API_KEY** - Keep it secret, only on backend
2. **FRONTEND_URL** - Update in Render CORS after Vercel deployment
3. **VITE_API_URL** - Set in Vercel after Render deployment
4. **Development** - Still uses localhost:5000 by default

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Cannot connect to backend" | Check `VITE_API_URL` in Vercel |
| CORS error | Update `FRONTEND_URL` in Render |
| Gemini not responding | Verify `GEMINI_API_KEY` has billing |
| File upload fails | Check file < 5MB |

---

## 🎯 Status

✅ Code refactored and committed
✅ Ready for Render + Vercel deployment
✅ No core logic changed
✅ All endpoints functional
✅ Production-safe configuration

**You're ready to deploy!** 🚀
