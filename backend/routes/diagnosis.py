from flask import Blueprint, request, jsonify
from models.plant import Plant, Disease, Symptom, Treatment
from models.user import db, UserHistory
from routes.user import verify_token
import json
import re

diagnosis_bp = Blueprint('diagnosis', __name__)

# Synonym mapping for symptom normalization
SYMPTOM_SYNONYMS = {
    'spots': ['lesions', 'patches', 'marks', 'blotches'],
    'yellowing': ['chlorosis', 'yellow', 'pale'],
    'wilting': ['drooping', 'wilt', 'limp', 'withering'],
    'brown': ['necrotic', 'dead', 'dried', 'tan'],
    'rot': ['decay', 'decomposition', 'rotting'],
    'curling': ['curl', 'rolling', 'twisted'],
    'growth': ['fungal', 'mold', 'mildew', 'fuzzy'],
    'dropping': ['falling', 'drop', 'shedding', 'abscission'],
    'stunted': ['dwarf', 'small', 'reduced', 'poor growth'],
    'discoloration': ['color change', 'off-color', 'abnormal color'],
    'holes': ['perforation', 'eaten', 'chewed'],
    'white': ['powdery', 'chalky', 'pale'],
    'black': ['dark', 'charred', 'sooty'],
    'orange': ['rust', 'rusty', 'pustules'],
    'rings': ['concentric', 'bullseye', 'target'],
    'mosaic': ['mottling', 'pattern', 'variegation'],
    'canker': ['ulcer', 'sore', 'wound'],
    'blight': ['scorch', 'burn', 'die-back'],
}

STOP_WORDS = {'the', 'a', 'an', 'is', 'are', 'was', 'were', 'on', 'in', 'at', 'of', 'for', 'to', 'and', 'or', 'my', 'has', 'have', 'with', 'some', 'very', 'too', 'also', 'i', 'see', 'there'}


def normalize_text(text):
    """Normalize text: lowercase, remove punctuation, remove stop words"""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s]', '', text)
    words = text.split()
    words = [w for w in words if w not in STOP_WORDS]
    return ' '.join(words)


def get_synonyms(word):
    """Get all synonyms for a word"""
    word = word.lower()
    synonyms = {word}
    for key, values in SYMPTOM_SYNONYMS.items():
        if word == key or word in values:
            synonyms.add(key)
            synonyms.update(values)
    return synonyms


def extract_keywords(text):
    """Extract meaningful keywords from text"""
    normalized = normalize_text(text)
    return normalized.split()


@diagnosis_bp.route('/plants', methods=['GET'])
def get_plants():
    try:
        plants = Plant.query.all()
        return jsonify({'success': True, 'plants': [plant.to_dict() for plant in plants]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@diagnosis_bp.route('/plants/<plant_id>', methods=['GET'])
def get_plant(plant_id):
    try:
        plant = Plant.query.get_or_404(plant_id)
        return jsonify({'success': True, 'plant': plant.to_dict()})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@diagnosis_bp.route('/plants/<plant_id>/diseases', methods=['GET'])
def get_plant_diseases(plant_id):
    try:
        plant = Plant.query.get_or_404(plant_id)
        diseases = Disease.query.filter_by(plant_id=plant_id).all()
        return jsonify({'success': True, 'plant': plant.name, 'diseases': [disease.to_dict() for disease in diseases]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@diagnosis_bp.route('/diagnose', methods=['POST'])
def diagnose_disease():
    """Enhanced AI diagnosis with weighted confidence scoring, image analysis, and history saving"""
    try:
        from routes.image_analysis import simulate_image_analysis
        data = request.get_json()
        plant_id = data.get('plant_id')
        user_symptoms = data.get('symptoms', [])
        image_data = data.get('image', None)

        if not plant_id:
            return jsonify({'success': False, 'error': 'Plant ID is required'}), 400

        # Check for authentication token to save history
        auth_header = request.headers.get('Authorization')
        user_id = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            user_id = verify_token(token)

        plant = Plant.query.get_or_404(plant_id)
        diseases = Disease.query.filter_by(plant_id=plant_id).all()

        # Integrate image analysis if image is provided
        image_analysis_results = None
        mismatch_warning = None
        if image_data:
            # Run simulated image analysis
            simulated_results, extracted_keywords = simulate_image_analysis(plant_id, return_keywords=True)
            image_analysis_results = simulated_results
            mismatch_warning = simulated_results.get('mismatch_warning')
            
            # Append AI detected keywords to the user's checklist symptoms for holistic scoring
            if extracted_keywords:
                ai_symptom_string = " ".join(extracted_keywords)
                if ai_symptom_string:
                    user_symptoms.append(f"AI Detected: {ai_symptom_string}")

        diagnosis_results = []
        for disease in diseases:
            confidence_score, match_details = calculate_weighted_confidence(disease, user_symptoms)
            if confidence_score > 0:
                diagnosis_results.append({
                    'disease': disease.to_dict(),
                    'confidence': confidence_score,
                    'match_details': match_details
                })

        # Sort by confidence, then by match count, then by severity
        severity_order = {'High': 3, 'Medium': 2, 'Low': 1}
        diagnosis_results.sort(key=lambda x: (
            x['confidence'],
            len(x['match_details']),
            severity_order.get(x['disease'].get('severity', 'Medium'), 2)
        ), reverse=True)
        
        # Save to UserHistory if authenticated and there are results
        if user_id and len(diagnosis_results) > 0:
            top_result = diagnosis_results[0]
            # Convert user_symptoms to a safe JSON string (handling the synthetic AI symptom)
            symptoms_to_save = [s for s in user_symptoms if not s.startswith("AI Detected: ")]
            if image_data:
                symptoms_to_save.append("Used Image Analysis")
                
            history = UserHistory(
                user_id=user_id,
                plant_id=plant.id,
                disease_id=top_result['disease']['id'],
                plant_name_snapshot=plant.name,
                disease_name_snapshot=top_result['disease']['name'],
                symptoms_snapshot=json.dumps(symptoms_to_save)
            )
            db.session.add(history)
            db.session.commit()

        return jsonify({
            'success': True,
            'plant': plant.to_dict(),
            'user_symptoms': user_symptoms,
            'diagnosis_results': diagnosis_results[:5],
            'total_diseases_checked': len(diseases),
            'image_analysis_used': bool(image_data),
            'mismatch_warning': mismatch_warning
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@diagnosis_bp.route('/diseases', methods=['GET'])
def get_all_diseases():
    try:
        diseases = Disease.query.all()
        return jsonify({'success': True, 'diseases': [disease.to_dict() for disease in diseases]})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@diagnosis_bp.route('/diseases/<int:disease_id>/treatments', methods=['GET'])
def get_disease_treatments(disease_id):
    try:
        disease = Disease.query.get_or_404(disease_id)
        treatments = Treatment.query.filter_by(disease_id=disease_id).all()
        return jsonify({
            'success': True,
            'disease': disease.to_dict(),
            'treatments': [treatment.to_dict() for treatment in treatments]
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


def calculate_weighted_confidence(disease, user_symptoms):
    """
    Weighted confidence scoring per PPT methodology:
    - Exact match: 100% weight
    - Partial match (keyword overlap): 70% weight
    - Synonym match: 80% weight
    - Category match: 50% weight
    """
    if not user_symptoms:
        return 0, []

    disease_symptoms = disease.symptoms
    total_score = 0
    max_possible_score = len(user_symptoms) * 100
    match_details = []

    for user_symptom in user_symptoms:
        user_normalized = normalize_text(user_symptom)
        user_keywords = extract_keywords(user_symptom)
        user_synonym_sets = set()
        for kw in user_keywords:
            user_synonym_sets.update(get_synonyms(kw))

        best_match_score = 0
        best_match = None

        for disease_symptom in disease_symptoms:
            symptom_normalized = normalize_text(disease_symptom.description)
            symptom_keywords = extract_keywords(disease_symptom.description)
            score = 0

            # Exact match check (100%)
            if user_normalized in symptom_normalized or symptom_normalized in user_normalized:
                score = 100
            else:
                # Keyword matching (70%)
                keyword_matches = sum(1 for kw in user_keywords if kw in symptom_normalized)
                if keyword_matches > 0:
                    keyword_score = (keyword_matches / max(len(user_keywords), 1)) * 70
                    score = max(score, keyword_score)

                # Synonym matching (80%)
                synonym_matches = sum(1 for skw in symptom_keywords if skw in user_synonym_sets)
                if synonym_matches > 0:
                    synonym_score = (synonym_matches / max(len(symptom_keywords), 1)) * 80
                    score = max(score, synonym_score)

                # Category matching (50%)
                user_lower = user_symptom.lower()
                if disease_symptom.category in user_lower:
                    score = max(score, 50)

            if score > best_match_score:
                best_match_score = score
                best_match = disease_symptom

        total_score += best_match_score
        if best_match and best_match_score > 0:
            match_details.append({
                'user_symptom': user_symptom,
                'matched_symptom': best_match.to_dict(),
                'match_type': 'exact' if best_match_score >= 90 else 'synonym' if best_match_score >= 70 else 'partial' if best_match_score >= 50 else 'category',
                'match_score': round(best_match_score, 1)
            })

    confidence = (total_score / max(max_possible_score, 1)) * 100
    confidence = min(confidence, 95)  # Cap at 95%
    return round(confidence, 1), match_details
