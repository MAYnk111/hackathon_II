# Production Deployment Guide

## Overview
This guide covers production deployment of the Arogya Health application to Render (backend) and Vercel (frontend).

---

## PART 1: Backend Deployment (Render)

### Prerequisites
- Render account (https://render.com)
- GitHub repository with code

### Step 1: Prepare Backend for Production
✅ **Already Done:**
- Dynamic `PORT` from environment variable
- Production-safe CORS configuration
- 5MB file size limit for uploads
- Environment variables loaded at startup
- Gemini API key from `process.env.GEMINI_API_KEY`

### Step 2: Create Render Service
1. Go to Render dashboard → New → Web Service
2. Connect your GitHub repository
3. Set configuration:
   - **Name:** `arogya-backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `cd server && npm start`
   - **Server Instance Type:** Free or Starter

### Step 3: Set Environment Variables in Render
Go to Environment → Add environment variable:

```
GEMINI_API_KEY=your_actual_gemini_api_key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Step 4: Deploy
- Render will auto-deploy on push to main branch
- Verify deployment in Render dashboard
- Note your backend URL: `https://arogya-backend.onrender.com`

### API Endpoints Available:
- `POST /analyze-symptoms`
- `POST /chat`
- `POST /verify-medicine`
- `GET /health`

---

## PART 2: Frontend Deployment (Vercel)

### Prerequisites
- Vercel account (https://vercel.com)
- GitHub repository connected

### Step 1: Prepare Frontend for Production
✅ **Already Done:**
- `apiConfig.ts` created for centralized API URL
- All hardcoded `localhost:5000` removed
- Environment variable `VITE_API_URL` configured
- Development fallback to `http://localhost:5000`

### Step 2: Deploy to Vercel
1. Go to Vercel dashboard → New Project
2. Import your GitHub repository
3. Framework: **Vite**
4. Build Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Step 3: Set Environment Variables in Vercel
Project Settings → Environment Variables:

```
VITE_API_URL=https://arogya-backend.onrender.com
```

### Step 4: Deploy
- Vercel auto-deploys on push to main
- Verify all API calls work in production
- Note your frontend URL: `https://your-frontend.vercel.app`

### Step 5: Update Backend CORS
Go back to Render → Environment Variables:
- Update `FRONTEND_URL` to your Vercel URL if needed

---

## PART 3: Production Testing Checklist

### Backend Tests
```bash
# Test health endpoint
curl https://arogya-backend.onrender.com/health

# Test chat endpoint
curl -X POST https://arogya-backend.onrender.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"I have a headache","language":"en"}'

# Test medicine verification (with image)
curl -X POST https://arogya-backend.onrender.com/verify-medicine \
  -F "image=@medicine.jpg"
```

### Frontend Tests
1. Open https://your-frontend.vercel.app
2. Test symptom analysis → verify API call succeeds
3. Test chat → verify connection to backend
4. Test medicine verification → upload image and verify
5. Check browser console → no localhost errors

### Security Checks
- ✅ No API keys exposed in frontend code
- ✅ CORS properly configured
- ✅ No hardcoded localhost references
- ✅ Environment variables used for all sensitive data
- ✅ File uploads limited to 5MB

---

## PART 4: Troubleshooting

### "Cannot connect to backend" Error
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify Render backend is running: `curl https://arogya-backend.onrender.com/health`
3. Check CORS configuration in `server/server.js`
4. Ensure `FRONTEND_URL` matches your Vercel domain

### Gemini API Not Working
1. Verify `GEMINI_API_KEY` is set in Render
2. Check API key is valid: https://console.cloud.google.com
3. Ensure billing is enabled

### Image Upload Shows 413 Error
1. File size exceeds 5MB limit
2. Use smaller images (< 5MB)

### CORS Errors
1. Update `server/server.js` origin array with correct frontend URL
2. Ensure `FRONTEND_URL` environment variable is set

---

## PART 5: Rollback & Monitoring

### Vercel Rollback
- Deployments → Select previous version → Revert

### Render Rollback
- Deploys → Cancel active build or revert to previous version

### Monitoring
- **Vercel:** Analytics → Web Vitals
- **Render:** Logs → View build & runtime logs

---

## Environment Variables Summary

### Frontend (.env in Vercel)
```
VITE_API_URL=https://arogya-backend.onrender.com
```

### Backend (.env in Render)
```
GEMINI_API_KEY=your_key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

---

## Final Checklist

- [ ] Backend deployed on Render with PORT env var
- [ ] Frontend deployed on Vercel with VITE_API_URL
- [ ] CORS configured in both services
- [ ] Gemini API key set on backend
- [ ] No localhost references in production code
- [ ] All API endpoints tested in production
- [ ] Medicine verification working with images
- [ ] Chat responding to messages
- [ ] Symptom analysis functioning
- [ ] Error messages don't leak sensitive info

---

## Additional Resources
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Express CORS Guide](https://expressjs.com/en/resources/middleware/cors.html)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)
