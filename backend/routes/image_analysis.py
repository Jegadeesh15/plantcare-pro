from flask import Blueprint, request, jsonify
from models.plant import Plant, Disease, Symptom, Treatment
from models.user import db
import random
import base64
import io
import json
from PIL import Image, ImageStat

image_analysis_bp = Blueprint('image_analysis', __name__)

# Simulated AI image analysis patterns
VISUAL_PATTERNS = {
    'brown_spots': {
        'keywords': ['brown', 'spots', 'lesions', 'blight', 'necrotic'],
        'description': 'Brown spots or lesions detected on leaf surface',
        'severity_weight': 0.7
    },
    'yellowing': {
        'keywords': ['yellow', 'chlorosis', 'wilting', 'nutrient', 'deficiency'],
        'description': 'Yellowing or chlorosis pattern detected',
        'severity_weight': 0.5
    },
    'white_growth': {
        'keywords': ['white', 'powdery', 'mildew', 'fungal', 'fuzzy'],
        'description': 'White powdery or fuzzy growth detected',
        'severity_weight': 0.8
    },
    'dark_lesions': {
        'keywords': ['dark', 'black', 'canker', 'rot', 'anthracnose'],
        'description': 'Dark lesions or necrotic areas detected',
        'severity_weight': 0.9
    },
    'wilting': {
        'keywords': ['wilt', 'drooping', 'dehydration', 'vascular'],
        'description': 'Wilting or drooping pattern detected',
        'severity_weight': 0.6
    },
    'spots_with_rings': {
        'keywords': ['rings', 'concentric', 'target', 'bullseye'],
        'description': 'Concentric ring patterns (target spots) detected',
        'severity_weight': 0.8
    },
    'rust_pustules': {
        'keywords': ['rust', 'orange', 'pustules', 'spores'],
        'description': 'Rust-colored pustules detected on surface',
        'severity_weight': 0.7
    },
    'mosaic_pattern': {
        'keywords': ['mosaic', 'mottling', 'viral', 'pattern'],
        'description': 'Mosaic or mottling pattern suggesting viral infection',
        'severity_weight': 0.6
    }
}

def is_plant_image(base64_data):
    """
    Very basic heuristic to check if an image is likely a plant (green/brown dominant)
    vs a document/screen (white/gray/black dominant).
    """
    try:
        if "base64," in base64_data:
            base64_data = base64_data.split("base64,")[1]
            
        image_bytes = base64.b64decode(base64_data)
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert('RGB')
        img.thumbnail((50, 50)) # Fast processing
        
        stat = ImageStat.Stat(img)
        r, g, b = stat.mean
        
        # If it's pure grayscale/document (R, G, B are all very close)
        std_dev = __import__('statistics').stdev([r, g, b])
        if std_dev < 15: # Not colorful enough, likely document or text screen
            return False, "Image appears to be a document or screen. Please upload a clear photo of a plant leaf or stem."
            
        # If it's too dark
        if r < 40 and g < 40 and b < 40:
            return False, "Image is too dark to analyze."
            
        # Give a slight pass if it's somewhat green or colorful (plants are typically dynamic)
        return True, "Valid"
    except Exception as e:
        return False, "Failed to decode or process image."

@image_analysis_bp.route('/image-analyze', methods=['POST'])
def analyze_image():
    """Analyze an uploaded plant image for disease detection and save history"""
    try:
        data = request.get_json()
        image_data = data.get('image')
        plant_id = data.get('plant_id', None)

        if not image_data:
            return jsonify({'success': False, 'error': 'No image data provided'}), 400

        # Simulate AI image analysis
        analysis_results = simulate_image_analysis(plant_id)
        
        # Check for authentication token to save history
        from routes.user import verify_token
        from models.user import UserHistory
        
        auth_header = request.headers.get('Authorization')
        user_id = None
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
            user_id = verify_token(token)
            
        # Save to UserHistory if authenticated and we found a disease match
        if user_id and analysis_results.get('disease_matches') and len(analysis_results['disease_matches']) > 0:
            top_match = analysis_results['disease_matches'][0]['disease']
            
            # Attempt to fetch plant if not directly provided but attached to disease
            resolved_plant_id = plant_id
            resolved_plant_name = "Unknown Plant"
            if not resolved_plant_id and top_match.get('plant_id'):
                resolved_plant_id = top_match['plant_id']
                resolved_plant_name = top_match.get('plant_name', 'Unknown Plant')
            elif plant_id:
                plant = Plant.query.get(plant_id)
                if plant:
                    resolved_plant_name = plant.name
                    
            history = UserHistory(
                user_id=user_id,
                plant_id=resolved_plant_id,
                disease_id=top_match['id'],
                plant_name_snapshot=resolved_plant_name,
                disease_name_snapshot=top_match['name'],
                symptoms_snapshot='["Image Analysis Upload"]'
            )
            db.session.add(history)
            db.session.commit()

        return jsonify({
            'success': True,
            'analysis': analysis_results
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500


def simulate_image_analysis(plant_id=None, return_keywords=False):
    """Simulate AI-powered image analysis with realistic results"""
    
    # Select random visual patterns detected
    num_patterns = random.randint(2, 4)
    detected_patterns = random.sample(list(VISUAL_PATTERNS.keys()), min(num_patterns, len(VISUAL_PATTERNS)))
    
    visual_findings = []
    all_keywords = []
    for pattern_key in detected_patterns:
        pattern = VISUAL_PATTERNS[pattern_key]
        visual_findings.append({
            'pattern': pattern_key,
            'description': pattern['description'],
            'confidence': round(random.uniform(0.6, 0.95), 2),
            'severity_weight': pattern['severity_weight']
        })
        all_keywords.extend(pattern['keywords'])

    # Match against diseases in database
    query = Disease.query
    if plant_id:
        query = query.filter_by(plant_id=plant_id)
    
    diseases = query.all()
    disease_matches = []

    for disease in diseases:
        score = 0
        matched_symptoms = []
        for symptom in disease.symptoms:
            desc_lower = symptom.description.lower()
            for keyword in all_keywords:
                if keyword in desc_lower:
                    score += 1
                    matched_symptoms.append(symptom.to_dict())
                    break

        if score > 0:
            confidence = min(round((score / max(len(disease.symptoms), 1)) * 100 * random.uniform(0.8, 1.0), 1), 95)
            
            # If the visually detected disease belongs to a different plant
            # than the user specifically selected, we heavily penalize confidence
            # to simulate the AI recognizing a mismatch.
            plant_mismatch = False
            if plant_id and str(disease.plant_id) != str(plant_id):
                plant_mismatch = True
                confidence = max(confidence - 40, 5) # drastically lower confidence
                
            disease_matches.append({
                'disease': disease.to_dict(),
                'confidence': confidence,
                'matched_visual_symptoms': matched_symptoms,
                'match_count': score,
                'plant_mismatch': plant_mismatch
            })

    disease_matches.sort(key=lambda x: x['confidence'], reverse=True)
    
    # Check if the top match is a plant mismatch
    mismatch_warning = None
    if disease_matches and disease_matches[0].get('plant_mismatch'):
        mismatch_warning = "The identified conditions appear to belong to a different plant species than the one selected. Image analysis confidence is low. Please rely on the Symptom Checkboxes for a more accurate diagnosis."

    # Overall health assessment
    avg_severity = sum(VISUAL_PATTERNS[p]['severity_weight'] for p in detected_patterns) / len(detected_patterns)
    if avg_severity > 0.75:
        health_status = 'Critical'
        health_color = 'red'
    elif avg_severity > 0.5:
        health_status = 'Moderate Concern'
        health_color = 'yellow'
    else:
        health_status = 'Mild Concern'
        health_color = 'green'

    results = {
        'health_status': health_status,
        'health_color': health_color,
        'overall_confidence': round(random.uniform(75, 95), 1),
        'visual_findings': visual_findings,
        'disease_matches': disease_matches[:5],
        'mismatch_warning': mismatch_warning,
        'recommendations': [
            'Compare results with physical inspection of the plant',
            'Monitor the plant for symptom progression over 3-5 days',
            'Consider consulting a local agricultural extension officer',
            'Take multiple images at different angles for better accuracy'
        ]
    }
    
    if return_keywords:
        return results, all_keywords
    return results
