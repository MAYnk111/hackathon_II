# Firebase Backend Setup & Deployment Guide

## 📁 Project Structure

```
calm-care-hub/
├── src/                   # Frontend code
│   ├── lib/
│   │   └── firebase.ts    # Firebase client config
│   ├── hooks/
│   │   └── useAuth.tsx    # Auth context & hook
│   ├── components/
│   │   └── RequireAuth.tsx
│   ├── pages/
│   │   ├── Auth.tsx       # Login/Signup
│   │   └── Dashboard.tsx  # Protected route with scan UI
│   └── App.tsx
├── functions/             # Cloud Functions (Node.js 18)
│   ├── index.js           # predict endpoint + ML placeholder
│   └── package.json
├── firebase.json
├── firestore.rules
├── storage.rules
└── .env.example
```

---

## 🚀 Step 1: Setup Firebase Project

The project is configured for **`hackathon2-d8f48`**.

1. Go to https://console.firebase.google.com/
2. Open your project: **hackathon2-d8f48**
3. Go to **Project Settings** (gear icon)
4. Scroll to **Your apps** → **Web app**
5. Copy credentials (API Key, Auth Domain, etc.)

---

## 🔐 Step 2: Configure Environment

1. Create `.env` file in `calm-care-hub/`:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=hackathon2-d8f48.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=hackathon2-d8f48
VITE_FIREBASE_STORAGE_BUCKET=hackathon2-d8f48.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Restart dev server after adding `.env`:

```bash
npm run dev
```

---

## ☁️ Step 3: Deploy Cloud Functions

### Install Firebase CLI globally:

```bash
npm install -g firebase-tools
```

### Login and select project:

```bash
firebase login
firebase use hackathon2-d8f48
```

### Install function dependencies:

```bash
cd functions
npm install
cd ..
```

### Deploy function:

```bash
firebase deploy --only functions
```

After deployment, you'll see the function URL:

```
https://us-central1-hackathon2-d8f48.cloudfunctions.net/predict
```

---

## 🗄️ Step 4: Deploy Firestore & Storage Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

This sets security rules so:

- Users can only read/write their own scan data
- Image uploads restricted per user

---

## ✅ Step 5: Enable Firebase Services

In Firebase Console:

1. **Authentication**:
   - Go to **Authentication** → Sign-in method
   - Enable **Email/Password**

2. **Firestore**:
   - Go to **Firestore Database**
   - Click "Create database" (Start in production mode)

3. **Storage**:
   - Go to **Storage**
   - Click "Get started" (Use default rules)

---

## 🧪 Step 6: Test Frontend Locally

Run the frontend:

```bash
npm run dev
```

1. Navigate to `http://localhost:8080/auth`
2. Create an account
3. Go to Dashboard
4. Upload an image and run scan
5. Check the backend receives request and stores result

---

## 🔌 Step 7: Connect Real ML Model

Replace the `mockInference()` function in `functions/index.js` with:

```javascript
const { getModelPrediction } = require("./model");

// ... inside predict handler ...
const prediction = await getModelPrediction(buffer);
```

Create `functions/model.js` with your PyTorch integration (e.g., via Python child process or REST API).

---

## 📊 Firestore Data Structure

```
users/
  {uid}/
    scans/
      {scanId}:
        imageUrl: "https://..."
        prediction: "fake"
        confidence: 0.91
        timestamp: Firestore Timestamp
```

---

## 🧯 Troubleshooting

| Issue | Solution |
|-------|---------|
| 401 Unauthorized | Check Firebase ID token is sent in `Authorization: Bearer <token>` |
| CORS error | Cloud Function uses `cors({origin: true})` for all origins |
| Image not saved | Verify Storage is enabled & rules deployed |
| Firestore permission denied | Verify Firestore rules deployed |

---

## 🎉 Done!

Your app now has:

✅ Firebase Authentication (Email/Password)  
✅ Protected Dashboard route  
✅ Cloud Function for ML prediction  
✅ Firestore for scan history  
✅ Firebase Storage for images  
✅ Security rules enforced  

For production:
- Build frontend: `npm run build`
- Deploy hosting: `firebase deploy --only hosting` (after adding hosting config)
- Add production API keys and environment variables
