const { onRequest } = require("firebase-functions/v2/https");
const cors = require("cors");
const admin = require("firebase-admin");
const crypto = require("crypto");

admin.initializeApp();

const db = admin.firestore();
const bucket = admin.storage().bucket();
const corsHandler = cors({ origin: true });

const mockInference = () => ({
  prediction: "fake",
  confidence: 0.91,
});

exports.predict = onRequest({ region: "us-central1" }, (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      res.status(401).json({ error: "Missing auth token" });
      return;
    }

    try {
      const decoded = await admin.auth().verifyIdToken(token);
      const { imageBase64, fileName } = req.body || {};

      if (!imageBase64) {
        res.status(400).json({ error: "Missing imageBase64" });
        return;
      }

      const buffer = Buffer.from(imageBase64, "base64");
      const scanId = crypto.randomUUID();
      const safeName = String(fileName || "upload.jpg").replace(/[^a-zA-Z0-9_.-]/g, "_");
      const filePath = `uploads/${decoded.uid}/${scanId}-${safeName}`;

      const file = bucket.file(filePath);
      await file.save(buffer, {
        contentType: "image/jpeg",
        resumable: false,
      });

      const [imageUrl] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 30,
      });

      const prediction = mockInference();

      await db.collection("users").doc(decoded.uid).collection("scans").doc(scanId).set({
        imageUrl,
        prediction: prediction.prediction,
        confidence: prediction.confidence,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json(prediction);
    } catch (error) {
      console.error("Prediction error", error);
      res.status(500).json({ error: "Prediction failed" });
    }
  });
});
