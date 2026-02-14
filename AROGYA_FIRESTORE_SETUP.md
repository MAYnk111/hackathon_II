# Firestore Structure: Vedic Arogya Data

This is the recommended structure for the Arogya Food & Remedy collection in Firestore.

## Collection: `arogya_remedies`

Each document should be named by the symptom in lowercase with underscores.

### Document: `common_cold_and_cough`

```json
{
  "symptomName": "Common Cold & Cough",
  "emoji": "🌬️",
  "order": 1,
  "dosha": "Vata - Kapha",
  "arogya_foods": [
    "Warm turmeric milk (Haldi doodh)",
    "Ginger tea with honey",
    "Garlic and onion preparations",
    "Kulanji (carom) water",
    "Steamed vegetables with ghee",
    "Warm broths and soups"
  ],
  "avoid_for_balance": [
    "Cold water and ice cream",
    "Fried & processed foods",
    "Excess dairy (yogurt, paneer)",
    "Refined sugar",
    "Heavy, oily foods"
  ],
  "vedic_support": "Cold season imbalance (Vata & Kapha) requires warming foods. Ushna (warm) herbs like ginger and turmeric support Prana (vital energy) circulation and strengthen immune response through traditional practice.",
  "cultural_context": "In Indian homes, the first remedy for cold is often warm turmeric milk mixed with ghee and black pepper. Grandmothers recommend adding jaggery and sesame oil for sustained warmth and nutrition.",
  "disclaimer": "These foods support general wellness and may complement hydration and rest. Not a replacement for medical advice. Consult a doctor for persistent symptoms lasting over 7 days."
}
```

### Document: `digestive_discomfort`

```json
{
  "symptomName": "Digestive Discomfort",
  "emoji": "🔥",
  "order": 2,
  "dosha": "Pitta",
  "arogya_foods": [
    "Jeera (cumin) water",
    "Ajwain (carom) seeds",
    "Fennel and coriander tea",
    "Ginger root preparation",
    "Rice with ghee",
    "Moong dal soup",
    "Buttermilk with spices"
  ],
  "avoid_for_balance": [
    "Excess chili and spices",
    "Fried & greasy foods",
    "Raw vegetables",
    "Processed foods",
    "Very cold drinks",
    "Heavy meats"
  ],
  "vedic_support": "Agni (digestive fire) thrives with Satvik foods and warming spices. Jeera and ajwain kindle the digestive flame while ghee (clarified butter) lubricates and strengthens the GI tract.",
  "cultural_context": "Indian cuisine uses 'spice blends' (masalas) not just for taste but to support digestion. A simple cumin water is considered a natural digestive aid passed through generations.",
  "disclaimer": "Mild digestive support only. Persistent pain, bleeding, or changes in bowel habits require medical evaluation. Not suitable for diagnosed GI conditions without professional guidance."
}
```

### Document: `fatigue_and_low_energy`

```json
{
  "symptomName": "Fatigue & Low Energy",
  "emoji": "⚡",
  "order": 3,
  "dosha": "Vata - Kapha",
  "arogya_foods": [
    "Sesame seed paste (til ke laddoo)",
    "Ghee with warm milk",
    "Dates and jaggery",
    "Almonds (soaked overnight)",
    "Ashwagandha root (Withania somnifera)",
    "Iron-rich leafy greens",
    "Whole grain preparations"
  ],
  "avoid_for_balance": [
    "Excess caffeine",
    "Refined sugars",
    "Processed soft drinks",
    "Very light foods",
    "Skipping meals",
    "Overeating"
  ],
  "vedic_support": "Depletion of Ojas (vital strength) requires building foods rich in Prana. Sesame, ghee, and grounding herbs like ashwagandha restore energy channels and support sustained vitality.",
  "cultural_context": "Til ke laddoo (sesame balls) are traditionally given to children and evening snacks to boost strength. Ashwagandha, known as 'Rasayana' in Vedic texts, is one of the most revered rejuvenating tonics.",
  "disclaimer": "General energy support through nutrition. Persistent fatigue may indicate anemia, thyroid issues, or other conditions requiring blood tests and medical consultation."
}
```

### Document: `skin_irritation_and_inflammation`

```json
{
  "symptomName": "Skin Irritation & Inflammation",
  "emoji": "🌿",
  "order": 4,
  "dosha": "Pitta",
  "arogya_foods": [
    "Turmeric paste (haldi)",
    "Neem leaves (bitter, purifying)",
    "Coconut oil",
    "Sesame oil (warm)",
    "Aloe vera gel",
    "Mint leaves",
    "Water-rich fruits"
  ],
  "avoid_for_balance": [
    "Excess heat-generating foods (chili)",
    "Fried & processed items",
    "Excess salt",
    "Very sour foods",
    "Alcohol & smoking",
    "Hot & spicy combinations"
  ],
  "vedic_support": "Excess Pitta (fire element) manifests as skin heat. Sheetal (cooling) herbs like neem and aloe, combined with turmeric's antibacterial Satvik qualities, support natural skin healing.",
  "cultural_context": "Turmeric paste is the oldest Indian remedy for wounds, pimples, and rashes. Neem is considered a 'purifier' and is used in traditional bathing rituals. Coconut oil is revered for cooling and softening skin.",
  "disclaimer": "Supports mild skin concerns through topical application and diet. Severe, spreading, or persistent conditions require dermatological evaluation. Not for infected wounds without professional assessment."
}
```

### Document: `joint_and_muscle_comfort`

```json
{
  "symptomName": "Joint & Muscle Comfort",
  "emoji": "🦵",
  "order": 5,
  "dosha": "Vata",
  "arogya_foods": [
    "Golden milk with turmeric",
    "Sesame oil massage (abhyanga)",
    "Bone broth",
    "Ghee-cooked vegetables",
    "Warming spices (dry ginger)",
    "Milk with nutmeg",
    "Rock salt preparations"
  ],
  "avoid_for_balance": [
    "Too much raw food",
    "Cold & damp environments",
    "Excess sour tastes",
    "Uncooked vegetables",
    "Very light diets",
    "Skipping warm meals"
  ],
  "vedic_support": "Vata imbalance creates movement disorders in joints. Warm oils (Sneha), warm foods, and Ushna spices stabilize mobility. Daily oil massage (abhyanga) is a cornerstone Vedic wellness practice.",
  "cultural_context": "Oil massage with turmeric is recommended for stiff joints, especially in winter. Warm milk with turmeric and nutmeg is given in the evening. Bone broths are traditional joint tonics in Indian cuisine.",
  "disclaimer": "Nutritional and topical support for general comfort. Severe pain, swelling, reduced mobility, or diagnosed arthritis requires medical management. Not a substitute for physical therapy."
}
```

## Setup Steps

1. **Create Collection**: Go to Firestore Console → Create new collection named `arogya_remedies`

2. **Add Documents**: Manually add each symptom document above, or use the provided JSON structure

3. **Field Types**:
   - `symptomName` → String
   - `emoji` → String
   - `order` → Number (for sorting)
   - `dosha` → String
   - `arogya_foods` → Array of Strings
   - `avoid_for_balance` → Array of Strings
   - `vedic_support` → String (longer text)
   - `cultural_context` → String (longer text)
   - `disclaimer` → String (longer text)

4. **Index Creation** (if retrieving from Firestore later):
   - Add a composite index on Collection field + `order` for sorting by symptom sequence

5. **Security Rules** (Update firestore.rules):
```
match /arogya_remedies/{document=**} {
  allow read: if request.auth != null;
  allow write: if request.auth.token.admin == true;
}
```

## Frontend Integration

The `AyurvedicRemedies.tsx` component currently uses hardcoded data. To fetch from Firestore:

```typescript
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

const fetchRemedies = async () => {
  const q = query(collection(db, "arogya_remedies"), orderBy("order", "asc"));
  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map(doc => doc.data());
  setRemedies(data);
};
```

## Sanskrit Terms Used

- **Arogya** - Health, wellness, freedom from disease
- **Prana** - Vital life force, energy
- **Ushna** - Warm, heating quality
- **Sheetal** - Cool, cooling quality
- **Satvik** - Pure, natural, wholesome (foods/qualities)
- **Dosha** - Constitution, imbalance (Vata, Pitta, Kapha)
- **Agni** - Digestive fire, metabolism
- **Ojas** - Vital strength, immunity
- **Rasayana** - Rejuvenation therapy
- **Sneha** - Oil, lubricant
- **Abhyanga** - Oil massage, anointment

---

**Note**: This structure blends traditional knowledge with medical responsibility. Each remedy includes clear disclaimers and encourages consulting healthcare providers.
