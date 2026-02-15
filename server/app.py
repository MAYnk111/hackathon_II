from flask import Flask, request, jsonify
from transformers import pipeline
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# Initialize zero-shot classification pipeline
print("🔄 Loading zero-shot classification model...")
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
print("✅ Model loaded successfully!")

CANDIDATE_LABELS = [
    "viral infection",
    "malaria",
    "typhoid",
    "common cold",
    "migraine",
    "dengue",
    "food poisoning",
    "heat stroke",
    "allergic reaction"
]

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "Symptom API is running 🏥"})

@app.route('/analyze-symptoms', methods=['POST'])
def analyze_symptoms():
    try:
        data = request.json
        symptoms = data.get('symptoms')
        age = data.get('age')
        gender = data.get('gender')
        
        # Validate input
        if not symptoms or not age or not gender:
            return jsonify({
                "error": "Missing required fields: symptoms, age, gender",
                "riskLevel": None,
                "topConditions": []
            }), 400
        
        print(f"\n📋 Analyzing symptoms:")
        print(f"   Symptoms: {symptoms}")
        print(f"   Age: {age}")
        print(f"   Gender: {gender}")
        
        # Perform zero-shot classification
        print(f"\n🔄 Running zero-shot classification...")
        result = classifier(symptoms, CANDIDATE_LABELS, multi_class=True)
        
        # Extract labels and scores
        labels = result['labels']
        scores = result['scores']
        
        if not labels or not scores or len(labels) == 0:
            return jsonify({
                "riskLevel": "Unknown",
                "message": "Invalid response from classification model",
                "topConditions": []
            }), 500
        
        # Get top 3 conditions
        top_conditions = []
        for i in range(min(3, len(labels))):
            top_conditions.append({
                "condition": labels[i],
                "confidence": int(scores[i] * 100)
            })
        
        # Determine risk level based on top score
        top_score = scores[0]
        if top_score > 0.7:
            risk_level = "Red"
        elif top_score > 0.4:
            risk_level = "Yellow"
        else:
            risk_level = "Green"
        
        print(f"⚠️  Risk Level: {risk_level}")
        print(f"🎯 Top Conditions: {top_conditions}")
        
        # Build response message
        message = f"Based on reported symptoms, "
        if risk_level == "Red":
            message += f"there is a high likelihood of {top_conditions[0]['condition']}. Medical attention is recommended."
        elif risk_level == "Yellow":
            message += f"{top_conditions[0]['condition']} is possible. Monitor symptoms and consider consulting a healthcare provider."
        else:
            message += f"symptoms suggest mild conditions. Home care and monitoring are appropriate at this time."
        
        return jsonify({
            "riskLevel": risk_level,
            "topConditions": top_conditions,
            "message": message,
            "analysis": {
                "age": age,
                "gender": gender,
                "topScore": int(top_score * 100)
            }
        }), 200
        
    except Exception as error:
        print(f"❌ Error analyzing symptoms:")
        print(f"   Error message: {str(error)}")
        
        return jsonify({
            "riskLevel": "Unknown",
            "message": f"Server error: {str(error)}",
            "topConditions": []
        }), 500

if __name__ == '__main__':
    print(f"\n🏥 Symptom API running on http://localhost:5000")
    print(f"\nEndpoints:")
    print(f"  POST /analyze-symptoms - Analyze health symptoms")
    print(f"  GET  /health - Health check\n")
    app.run(debug=False, port=5000, host='0.0.0.0')
