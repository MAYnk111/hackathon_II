/**
 * Sanskritic Terms Used in Arogya Platform
 * 
 * This guide explains the Sanskrit terms integrated throughout SafeCare
 * to provide cultural and Vedic context while maintaining medical responsibility.
 */

export const vedic_terminology = {
  // Core Wellness Concepts
  arogya: {
    term: "Arogya",
    pronunciation: "uh-RO-jya",
    meaning: "Health, wellness, freedom from disease",
    context:
      "The foundation concept of the platform. Arogya is not just absence of illness but a state of balanced vitality.",
    usage: "Arogya Foods, Arogya Support",
  },

  prana: {
    term: "Prana",
    pronunciation: "PRAH-nah",
    meaning: "Vital life force, cosmic energy, breath",
    context: "Represents the animating energy in all living things. Quality of Prana affects overall vitality.",
    usage: "Supporting Prana circulation, Prana-rich foods",
  },

  agni: {
    term: "Agni",
    pronunciation: "AHG-nee",
    meaning: "Digestive fire, metabolic transformation, internal heat",
    context:
      "The metabolic fire that processes food and experiences. Strong Agni = good digestion; weak Agni = accumulation of toxins.",
    usage: "Kindling Agni, Agni-supporting spices (cumin, ginger)",
  },

  ojas: {
    term: "Ojas",
    pronunciation: "OH-jas",
    meaning: "Vital essence, immunity, radiance, inner strength",
    context:
      "The finest product of digestion. Ojas nourishes resilience, immunity, and glow. Depleted Ojas = fatigue and weakness.",
    usage: "Building Ojas, Ojas-depleting habits",
  },

  // Qualities (Gunas)
  satvik: {
    term: "Satvik",
    pronunciation: "SAHT-vik",
    meaning: "Pure, natural, wholesome, balanced (quality)",
    context: "Foods that are Satvik support clarity, peace, and health. Opposite of Rajasik (stimulating) and Tamasik (heavy).",
    usage:
      "Satvik foods (simple, natural), Satvik lifestyle (routine, meditation)",
  },

  ushna: {
    term: "Ushna",
    pronunciation: "OOH-shna",
    meaning: "Warm, heating, hot (quality)",
    context: "A quality that increases body heat and movement. Useful for cold, sluggish conditions but excess can cause inflammation.",
    usage: "Ushna herbs (ginger, pepper), Ushna therapies (oil massage)",
  },

  sheetal: {
    term: "Sheetal",
    pronunciation: "SHEE-tal",
    meaning: "Cool, cooling, cold (quality)",
    context:
      "A quality that reduces heat and activity. Useful for inflammation but excess creates sluggishness and slowed metabolism.",
    usage: "Sheetal herbs (mint, coconut), Sheetal foods (cucumber, watermelon)",
  },

  // The Three Doshas (Body Types/Imbalances)
  vata: {
    term: "Vata",
    pronunciation: "VAH-ta",
    meaning: "Air and ether elements; movement, change, dryness",
    context:
      "Governs movement, circulation, nervous system. Imbalanced Vata = anxiety, dry skin, irregular digestion, joint issues.",
    usage: "Vata-balancing foods (warm, grounding)", foods_to_use: ["sesame", "ghee", "warm milk", "cooked vegetables"]
  },

  pitta: {
    term: "Pitta",
    pronunciation: "PIT-ta",
    meaning: "Fire and water elements; heat, transformation, intensity",
    context: "Governs digestion, metabolism, intelligence. Imbalanced Pitta = inflammation, acidity, irritability, skin heat.",
    usage: "Pitta-cooling foods (cooling, sweet)", foods_to_use: ["coconut", "mint", "ghee", "cucumber"]
  },

  kapha: {
    term: "Kapha",
    pronunciation: "KAH-fa",
    meaning: "Water and earth elements; structure, lubricant, stability",
    context:
      "Governs structure, immunity, lubrication. Imbalanced Kapha = sluggishness, heaviness, excess mucus, weight gain.",
    usage: "Kapha-stimulating foods (warming, light)", foods_to_use: ["ginger", "black pepper", "leafy greens", "legumes"]
  },

  // Therapies & Practices
  abhyanga: {
    term: "Abhyanga",
    pronunciation: "uh-bee-AHN-ga",
    meaning: "Oil massage, anointment, loving touch",
    context: "Daily self-massage with warm oil. Considered a cornerstone of Vedic wellness, grounding and nourishing.",
    usage: "Abhyanga with sesame oil, daily routine",
  },

  rasayana: {
    term: "Rasayana",
    pronunciation: "rah-SY-ah-na",
    meaning: "Rejuvenation therapy, path of essence",
    context: "Therapies and substances that rejuvenate tissues and restore vitality. Ashwagandha is a classic Rasayana.",
    usage:
      "Rasayana herbs (ashwagandha, shilajit), rejuvenation practices",
  },

  sneha: {
    term: "Sneha",
    pronunciation: "SNAY-ha",
    meaning: "Oil, lubricant, anointing substance, affection",
    context: "Both physical (oils) and emotional (loving-kindness). Sneha lubricates joints and softens tissues.",
    usage: "Sneha therapies (oil massage)", medicinal_oils: ["sesame oil", "coconut oil", "ghee"]
  },

  // Food Concepts
  dravya: {
    term: "Dravya",
    pronunciation: "DRAH-vya",
    meaning: "Substance, material ingredient, herb/food",
    context: "Any herb, food, or substance used therapeutically. Foundation of Vedic medicine.",
    usage: "Medicinal dravyas, therapeutic foods",
  },

  rasa: {
    term: "Rasa",
    pronunciation: "RAH-sa",
    meaning: "Taste, essence, flavor (6 tastes: sweet, sour, salty, bitter, pungent, astringent)",
    context:
      "Each taste has specific effects on doshas and digestion. Balanced taste intake supports health.",
    usage:
      "Rasa combinations, balancing the six tastes in meals",
  },

  // Additional Useful Terms
  dhatu: {
    term: "Dhatu",
    pronunciation: "DAH-too",
    meaning: "Tissue layer, elemental components",
    context: "Seven tissue layers in the body (plasma, blood, muscle, fat, bone, marrow, reproductive). Poor digestion impairs all.",
    usage: "Supporting all seven dhatus through nutrition",
  },

  ama: {
    term: "Ama",
    pronunciation: "AH-ma",
    meaning: "Undigested food residue, toxins, metabolic waste",
    context: "Accumulation of Ama from weak Agni is considered root of disease. Ama creates sluggishness and health issues.",
    usage: "Ama-reducing practices (spices, digestive rest periods)",
  },

  kapha_dosha: {
    term: "Ama-vata",
    pronunciation: "AH-ma VAH-ta",
    meaning: "Ama (toxins) + Vata (movement) combination causing joint issues",
    context: "When undigested food combines with air element, creating joint pain and stiffness.",
    usage: "Addressing Ama-vata through diet and warmth",
  },

  prakruti: {
    term: "Prakruti",
    pronunciation: "prak-AH-tee",
    meaning: "Your original/natural constitution, genetic template",
    context: "Your innate dosha balance. Unlike Vikriti (current imbalance), Prakruti doesn't change.",
    usage:
      "Understanding your Prakruti for personalized wellness",
  },

  vikriti: {
    term: "Vikriti",
    pronunciation: "vik-AH-tee",
    meaning: "Current imbalance, present condition deviating from Prakruti",
    context: "How your doshas are currently imbalanced. This CAN change through diet, lifestyle, and therapy.",
    usage: "Identifying Vikriti to correct imbalances",
  },
};

/**
 * Simplified Dosha Quick Reference
 */
export const dosha_quick_guide = {
  vata: {
    element: "Air + Ether",
    body_systems: "Nervous, circulation, movement",
    imbalance_signs: "Anxiety, dry skin, constipation, joint pain, insomnia",
    balancing_approach: "Warm, grounding, nourishing foods. Routine. Oil massage.",
    example_meal: "Warm rice with ghee, steamed vegetables, sesame oil",
  },
  pitta: {
    element: "Fire + Water",
    body_systems: "Digestion, metabolism, intelligence, vision",
    imbalance_signs: "Inflammation, acidity, irritability, skin rashes, excess hunger",
    balancing_approach: "Cooling, hydrating, soothing foods. Calm routines.",
    example_meal: "Coconut rice, cucumber raita, mint lassi",
  },
  kapha: {
    element: "Water + Earth",
    body_systems: "Structure, stability, immunity, lubrication",
    imbalance_signs: "Sluggishness, weight gain, excess mucus, lethargy, congestion",
    balancing_approach: "Light, warming, stimulating spices. Active routine.",
    example_meal: "Moong dal with warming spices, leafy greens, ginger tea",
  },
};

/**
 * Common Vedic Food Categories
 */
export const vedic_food_categories = {
  cooling_herbs: [
    { name: "Neem", benefit: "Purifying, blood cleanser", use: "Leaf tea, topical paste" },
    { name: "Mint", benefit: "Cooling, soothing digestion", use: "Tea, fresh in meals" },
    { name: "Cilantro", benefit: "Cooling, heavy metal free", use: "Fresh herb, juice" },
    { name: "Coconut", benefit: "Deep cooling, hydrating", use: "Oil, water, meat" },
  ],
  warming_spices: [
    { name: "Ginger (fresh)", benefit: "Digestive fire, circulation", use: "Fresh tea, in cooking" },
    { name: "Black Pepper", benefit: "Agni booster, absorption", use: "Ground in food" },
    { name: "Turmeric", benefit: "Anti-inflammatory, purifying", use: "Golden milk, cooking" },
    { name: "Cumin (jeera)", benefit: "Digestive support", use: "Seed water, in food" },
  ],
  grounding_foods: [
    { name: "Ghee", benefit: "Nourishing, Ojas builder", use: "Cooking, with warm milk" },
    { name: "Sesame", benefit: "Warming, oil massage", use: "Paste, oil, seeds" },
    { name: "Dates/Jaggery", benefit: "Energy, strength", use: "With milk, raw" },
    { name: "Whole grains", benefit: "Stability, sustained energy", use: "Rice, wheat, oats" },
  ],
};

export default vedic_terminology;
