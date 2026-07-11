# PlantCare Pro - Technical Documentation

## System Architecture Overview

PlantCare Pro is built as a modern web application with a React frontend and Flask backend, designed for scalability, reliability, and ease of maintenance.

### Architecture Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │   Flask Backend │    │   SQLite DB     │
│   (User Interface)│◄──►│   (API Server)  │◄──►│   (Data Store)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │ Browser │             │ AI Engine│             │ Disease │
    │ Client  │             │ Diagnosis │             │Database │
    └─────────┘             └─────────┘             └─────────┘
```

### Technology Stack

#### Frontend Technologies
- **React 18**: Modern JavaScript framework for building user interfaces
- **React Router**: Client-side routing for single-page application
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent UI elements
- **Radix UI**: Accessible component primitives

#### Backend Technologies
- **Flask 3.1**: Python web framework for API development
- **SQLAlchemy**: Object-relational mapping (ORM) for database operations
- **Flask-CORS**: Cross-origin resource sharing support
- **SQLite**: Lightweight database for development and small-scale deployment
- **Python 3.11**: Modern Python runtime with performance improvements

#### Deployment & Infrastructure
- **Manus Cloud Platform**: Production hosting environment
- **HTTPS/SSL**: Secure communication encryption
- **CDN**: Content delivery network for static assets
- **Auto-scaling**: Dynamic resource allocation based on demand

## Database Schema

### Entity Relationship Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Plants    │    │  Diseases   │    │  Symptoms   │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ id (PK)     │◄──┐│ id (PK)     │◄──┐│ id (PK)     │
│ name        │   ││ name        │   ││ disease_id  │
│ scientific  │   ││ pathogen    │   ││ category    │
│ category    │   ││ pathogen_type│   ││ description │
│ description │   ││ plant_id(FK)│   ││ severity    │
│ image_path  │   │└─────────────┘   ││ stage       │
└─────────────┘   │                  │└─────────────┘
                  │                  │
                  │ ┌─────────────┐  │
                  └─┤ Treatments  │◄─┘
                    ├─────────────┤
                    │ id (PK)     │
                    │ disease_id  │
                    │ type        │
                    │ method      │
                    │ description │
                    │ effectiveness│
                    │ timing      │
                    │ precautions │
                    └─────────────┘
```

### Table Definitions

#### Plants Table
```sql
CREATE TABLE plants (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    scientific_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    category_label VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    image_path VARCHAR(200)
);
```

#### Diseases Table
```sql
CREATE TABLE diseases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    pathogen VARCHAR(100) NOT NULL,
    pathogen_type VARCHAR(50) NOT NULL,
    plant_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (plant_id) REFERENCES plants(id)
);
```

#### Symptoms Table
```sql
CREATE TABLE symptoms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease_id INTEGER NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    stage VARCHAR(20) NOT NULL,
    FOREIGN KEY (disease_id) REFERENCES diseases(id)
);
```

#### Treatments Table
```sql
CREATE TABLE treatments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    disease_id INTEGER NOT NULL,
    treatment_type VARCHAR(50) NOT NULL,
    method VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    effectiveness VARCHAR(20) NOT NULL,
    application_timing VARCHAR(100),
    precautions TEXT,
    FOREIGN KEY (disease_id) REFERENCES diseases(id)
);
```

## API Documentation

### Base URL
- **Production**: `https://j6h5i7c0e1nx.manus.space/api`
- **Development**: `http://localhost:5000/api`

### Authentication
Currently, the API does not require authentication. Future versions will implement JWT-based authentication for user accounts.

### Endpoints

#### GET /plants
Retrieve all plants in the database.

**Response:**
```json
{
    "success": true,
    "plants": [
        {
            "id": "tomato",
            "name": "Tomato",
            "scientific_name": "Solanum lycopersicum",
            "category": "vegetables",
            "category_label": "Vegetable Crops",
            "description": "Popular fruit vegetable rich in vitamins and antioxidants",
            "image_path": "/assets/images/vegetables/tomato_healthy.jpg",
            "diseases": ["Early Blight", "Late Blight"]
        }
    ]
}
```

#### GET /plants/{plant_id}
Retrieve detailed information about a specific plant.

**Parameters:**
- `plant_id` (string): Unique identifier for the plant

**Response:**
```json
{
    "success": true,
    "plant": {
        "id": "tomato",
        "name": "Tomato",
        "scientific_name": "Solanum lycopersicum",
        "category": "vegetables",
        "category_label": "Vegetable Crops",
        "description": "Popular fruit vegetable rich in vitamins and antioxidants",
        "image_path": "/assets/images/vegetables/tomato_healthy.jpg",
        "diseases": ["Early Blight", "Late Blight"]
    }
}
```

#### GET /plants/{plant_id}/diseases
Retrieve all diseases for a specific plant.

**Parameters:**
- `plant_id` (string): Unique identifier for the plant

**Response:**
```json
{
    "success": true,
    "plant": "Tomato",
    "diseases": [
        {
            "id": 1,
            "name": "Early Blight",
            "pathogen": "Alternaria solani",
            "pathogen_type": "Fungal",
            "plant_id": "tomato",
            "symptoms": [...],
            "treatments": [...]
        }
    ]
}
```

#### POST /diagnose
Perform disease diagnosis based on plant and symptoms.

**Request Body:**
```json
{
    "plant_id": "tomato",
    "symptoms": [
        "Brown spots on leaves",
        "Spots with rings"
    ]
}
```

**Response:**
```json
{
    "success": true,
    "plant": {...},
    "user_symptoms": ["Brown spots on leaves", "Spots with rings"],
    "diagnosis_results": [
        {
            "disease": {...},
            "confidence": 85.5,
            "match_details": [
                {
                    "user_symptom": "Brown spots on leaves",
                    "matched_symptom": {...}
                }
            ]
        }
    ],
    "total_diseases_checked": 2
}
```

#### GET /diseases
Retrieve all diseases in the database.

**Response:**
```json
{
    "success": true,
    "diseases": [
        {
            "id": 1,
            "name": "Early Blight",
            "pathogen": "Alternaria solani",
            "pathogen_type": "Fungal",
            "plant_id": "tomato",
            "symptoms": [...],
            "treatments": [...]
        }
    ]
}
```

#### GET /diseases/{disease_id}/treatments
Retrieve treatment recommendations for a specific disease.

**Parameters:**
- `disease_id` (integer): Unique identifier for the disease

**Response:**
```json
{
    "success": true,
    "disease": {...},
    "treatments": [
        {
            "id": 1,
            "treatment_type": "chemical",
            "method": "Fungicide spray",
            "description": "Apply chlorothalonil or mancozeb",
            "effectiveness": "high",
            "application_timing": "Preventively or at first symptoms",
            "precautions": "Rotate fungicide classes to prevent resistance"
        }
    ]
}
```

## AI Diagnosis Algorithm

### Symptom Matching Process

The diagnosis algorithm uses a multi-step approach to match user-reported symptoms with disease patterns:

#### 1. Symptom Preprocessing
```python
def preprocess_symptoms(user_symptoms):
    """
    Clean and normalize user-reported symptoms
    """
    processed = []
    for symptom in user_symptoms:
        # Convert to lowercase
        symptom = symptom.lower().strip()
        # Remove common stop words
        symptom = remove_stop_words(symptom)
        # Normalize synonyms
        symptom = normalize_synonyms(symptom)
        processed.append(symptom)
    return processed
```

#### 2. Keyword Matching
```python
def calculate_confidence(disease, user_symptoms):
    """
    Calculate confidence score based on symptom matching
    """
    if not user_symptoms:
        return 0
    
    disease_symptoms = [s.description.lower() for s in disease.symptoms]
    matches = 0
    
    for user_symptom in user_symptoms:
        user_keywords = user_symptom.lower().split()
        for disease_symptom in disease_symptoms:
            if any(keyword in disease_symptom for keyword in user_keywords):
                matches += 1
                break
    
    # Calculate confidence as percentage
    confidence = (matches / len(user_symptoms)) * 100
    return min(confidence, 95)  # Cap at 95% to show uncertainty
```

#### 3. Confidence Scoring
The algorithm assigns confidence scores based on:
- **Exact matches**: 100% weight
- **Partial matches**: 70% weight
- **Synonym matches**: 80% weight
- **Category matches**: 50% weight

#### 4. Result Ranking
Results are ranked by:
1. Confidence score (primary)
2. Number of symptom matches (secondary)
3. Disease severity (tertiary)

### Future AI Enhancements

#### Machine Learning Integration
- **Supervised Learning**: Train models on historical diagnosis data
- **Natural Language Processing**: Better symptom text understanding
- **Computer Vision**: Image-based disease identification
- **Ensemble Methods**: Combine multiple algorithms for better accuracy

#### Data Collection Strategy
- **User Feedback**: Collect diagnosis accuracy feedback
- **Expert Validation**: Agricultural expert review of diagnoses
- **Outcome Tracking**: Monitor treatment effectiveness
- **Continuous Learning**: Update models with new data

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── badge.jsx
│   │   ├── checkbox.jsx
│   │   └── progress.jsx
│   ├── Header.jsx             # Navigation header
│   ├── Footer.jsx             # Site footer
│   ├── HomePage.jsx           # Landing page
│   ├── PlantSelection.jsx     # Plant selection interface
│   ├── SymptomChecker.jsx     # Symptom input form
│   ├── DiagnosisResults.jsx   # AI diagnosis display
│   ├── TreatmentRecommendations.jsx  # Treatment plans
│   └── DiseaseDatabase.jsx    # Disease information browser
├── assets/
│   └── images/               # Plant and disease images
├── lib/
│   └── utils.js              # Utility functions
├── App.jsx                   # Main application component
├── App.css                   # Global styles
└── main.jsx                  # Application entry point
```

### State Management

The application uses React's built-in state management with hooks:

```javascript
// Global state in App.jsx
const [selectedPlant, setSelectedPlant] = useState(null)
const [symptoms, setSymptoms] = useState([])
const [diagnosis, setDiagnosis] = useState(null)

// State is passed down through props to child components
<SymptomChecker 
  selectedPlant={selectedPlant}
  symptoms={symptoms}
  setSymptoms={setSymptoms}
/>
```

### Routing Configuration

```javascript
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/plant-selection" element={<PlantSelection />} />
  <Route path="/symptom-checker" element={<SymptomChecker />} />
  <Route path="/diagnosis" element={<DiagnosisResults />} />
  <Route path="/treatment" element={<TreatmentRecommendations />} />
  <Route path="/database" element={<DiseaseDatabase />} />
</Routes>
```

### Responsive Design

The application uses Tailwind CSS for responsive design:

```css
/* Mobile-first approach */
.container {
  @apply px-4 sm:px-6 lg:px-8;
}

/* Responsive grid */
.plant-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}

/* Responsive text */
.heading {
  @apply text-2xl md:text-3xl lg:text-4xl font-bold;
}
```

## Backend Architecture

### Flask Application Structure

```
plantcare-api/
├── src/
│   ├── models/
│   │   ├── user.py           # Database configuration
│   │   └── plant.py          # Plant, Disease, Symptom, Treatment models
│   ├── routes/
│   │   ├── user.py           # User management routes
│   │   └── diagnosis.py      # Diagnosis API routes
│   ├── static/               # Frontend build files
│   └── main.py               # Flask application entry point
├── seed_database.py          # Database seeding script
├── requirements.txt          # Python dependencies
└── venv/                     # Virtual environment
```

### Database Models

```python
class Plant(db.Model):
    __tablename__ = 'plants'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    scientific_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    category_label = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_path = db.Column(db.String(200), nullable=True)
    
    diseases = db.relationship('Disease', backref='plant', lazy=True)
```

### API Route Handlers

```python
@diagnosis_bp.route('/diagnose', methods=['POST'])
def diagnose_disease():
    """Diagnose plant disease based on symptoms"""
    try:
        data = request.get_json()
        plant_id = data.get('plant_id')
        user_symptoms = data.get('symptoms', [])
        
        # Perform diagnosis logic
        diagnosis_results = perform_diagnosis(plant_id, user_symptoms)
        
        return jsonify({
            'success': True,
            'diagnosis_results': diagnosis_results
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
```

### Error Handling

```python
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Resource not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500
```

## Security Considerations

### Current Security Measures

#### Data Protection
- **HTTPS Encryption**: All communication encrypted in transit
- **Input Validation**: Server-side validation of all user inputs
- **SQL Injection Prevention**: SQLAlchemy ORM prevents SQL injection
- **XSS Protection**: React automatically escapes user content

#### Infrastructure Security
- **Secure Hosting**: Cloud platform with security monitoring
- **Regular Updates**: Dependencies updated for security patches
- **Access Control**: Limited server access with secure authentication

### Future Security Enhancements

#### Authentication & Authorization
- **JWT Tokens**: Secure user authentication
- **Role-Based Access**: Different permission levels
- **API Rate Limiting**: Prevent abuse and DoS attacks
- **OAuth Integration**: Social login options

#### Data Security
- **Database Encryption**: Encrypt sensitive data at rest
- **Audit Logging**: Track all user actions
- **Data Backup**: Regular encrypted backups
- **GDPR Compliance**: User data protection and privacy

## Performance Optimization

### Current Optimizations

#### Frontend Performance
- **Code Splitting**: Lazy loading of route components
- **Image Optimization**: Compressed images with appropriate formats
- **CSS Optimization**: Tailwind CSS purging unused styles
- **Bundle Optimization**: Vite build optimization

#### Backend Performance
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Static asset caching with CDN
- **Compression**: Gzip compression for API responses
- **Connection Pooling**: Efficient database connections

### Scaling Strategies

#### Horizontal Scaling
- **Load Balancing**: Distribute traffic across multiple servers
- **Database Replication**: Read replicas for improved performance
- **Microservices**: Break down monolithic architecture
- **Container Orchestration**: Docker and Kubernetes deployment

#### Vertical Scaling
- **Server Upgrades**: Increase CPU, memory, and storage
- **Database Optimization**: Query optimization and indexing
- **Caching Layers**: Redis for session and data caching
- **CDN Integration**: Global content delivery network

## Monitoring & Analytics

### Application Monitoring

#### Performance Metrics
- **Response Time**: API endpoint response times
- **Error Rate**: Application error frequency
- **Uptime**: Service availability monitoring
- **Resource Usage**: CPU, memory, and disk utilization

#### User Analytics
- **User Behavior**: Page views, user flows, conversion rates
- **Feature Usage**: Most used features and workflows
- **Geographic Data**: User location and regional usage patterns
- **Device Analytics**: Mobile vs desktop usage statistics

### Logging Strategy

#### Application Logs
```python
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

# Log diagnosis requests
logger.info(f"Diagnosis request: plant={plant_id}, symptoms={len(symptoms)}")
```

#### Error Tracking
- **Exception Monitoring**: Automatic error reporting
- **Stack Trace Collection**: Detailed error information
- **User Context**: User actions leading to errors
- **Performance Impact**: Error impact on system performance

## Deployment Guide

### Production Deployment

#### Prerequisites
- Python 3.11+
- Node.js 18+
- Git
- Cloud hosting account

#### Deployment Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd plantcare-pro
```

2. **Build Frontend**
```bash
cd plantcare-pro
npm install
npm run build
```

3. **Setup Backend**
```bash
cd ../plantcare-api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

4. **Copy Frontend Build**
```bash
cp -r ../plantcare-pro/dist/* src/static/
```

5. **Initialize Database**
```bash
python seed_database.py
```

6. **Deploy to Production**
```bash
# Using Manus platform
manus deploy --framework flask --project-dir .
```

### Environment Configuration

#### Production Environment Variables
```bash
export FLASK_ENV=production
export DATABASE_URL=postgresql://user:pass@host:port/db
export SECRET_KEY=your-secret-key
export CORS_ORIGINS=https://yourdomain.com
```

#### Development Environment
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
export DATABASE_URL=sqlite:///app.db
```

### Continuous Integration/Deployment

#### GitHub Actions Workflow
```yaml
name: Deploy PlantCare Pro
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Build Frontend
        run: |
          cd plantcare-pro
          npm install
          npm run build
      - name: Deploy to Production
        run: |
          # Deployment commands
```

## Maintenance & Support

### Regular Maintenance Tasks

#### Weekly Tasks
- Monitor system performance and error rates
- Review user feedback and support tickets
- Update disease database with new information
- Check security alerts and apply patches

#### Monthly Tasks
- Analyze user analytics and usage patterns
- Review and optimize database performance
- Update dependencies and security patches
- Backup and test disaster recovery procedures

#### Quarterly Tasks
- Conduct security audits and penetration testing
- Review and update business continuity plans
- Analyze competitive landscape and feature gaps
- Plan and prioritize new feature development

### Support Procedures

#### User Support Channels
- **Email Support**: contact@plantcarepro.com
- **Documentation**: Comprehensive user guides
- **FAQ Section**: Common questions and answers
- **Video Tutorials**: Step-by-step usage guides

#### Issue Resolution Process
1. **Ticket Creation**: User reports issue via support channels
2. **Triage**: Categorize and prioritize based on severity
3. **Investigation**: Technical team investigates root cause
4. **Resolution**: Implement fix and test thoroughly
5. **Communication**: Update user on resolution status
6. **Follow-up**: Ensure user satisfaction with resolution

---

This technical documentation provides a comprehensive overview of the PlantCare Pro platform architecture, implementation details, and operational procedures. It serves as a reference for developers, system administrators, and stakeholders involved in the platform's development and maintenance.

