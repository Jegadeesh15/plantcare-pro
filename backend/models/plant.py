from flask_sqlalchemy import SQLAlchemy
from models.user import db

class Plant(db.Model):
    __tablename__ = 'plants'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    scientific_name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    category_label = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_path = db.Column(db.String(200), nullable=True)
    
    # Relationship with diseases
    diseases = db.relationship('Disease', backref='plant', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'scientific_name': self.scientific_name,
            'category': self.category,
            'category_label': self.category_label,
            'description': self.description,
            'image_path': self.image_path,
            'diseases': [disease.name for disease in self.diseases]
        }

class Disease(db.Model):
    __tablename__ = 'diseases'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    pathogen = db.Column(db.String(100), nullable=False)
    pathogen_type = db.Column(db.String(50), nullable=False)  # Fungal, Bacterial, Viral, etc.
    plant_id = db.Column(db.String(50), db.ForeignKey('plants.id'), nullable=False)
    description = db.Column(db.Text, nullable=True)
    severity = db.Column(db.String(20), nullable=True)  # Low, Medium, High
    
    # Symptoms and treatments
    symptoms = db.relationship('Symptom', backref='disease', lazy=True, cascade='all, delete-orphan')
    treatments = db.relationship('Treatment', backref='disease', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description or '',
            'severity': self.severity or 'Medium',
            'plant_name': self.plant.name if self.plant else 'Unknown',
            'pathogen': self.pathogen,
            'pathogen_type': self.pathogen_type,
            'plant_id': self.plant_id,
            'symptoms': [symptom.to_dict() for symptom in self.symptoms],
            'treatments': [treatment.to_dict() for treatment in self.treatments]
        }

class Symptom(db.Model):
    __tablename__ = 'symptoms'
    
    id = db.Column(db.Integer, primary_key=True)
    disease_id = db.Column(db.Integer, db.ForeignKey('diseases.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)  # leaf, stem, root, fruit, etc.
    description = db.Column(db.Text, nullable=False)
    severity = db.Column(db.String(20), nullable=False)  # mild, moderate, severe
    stage = db.Column(db.String(20), nullable=False)  # early, middle, late
    
    def to_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'description': self.description,
            'severity': self.severity,
            'stage': self.stage
        }

class Treatment(db.Model):
    __tablename__ = 'treatments'
    
    id = db.Column(db.Integer, primary_key=True)
    disease_id = db.Column(db.Integer, db.ForeignKey('diseases.id'), nullable=False)
    treatment_type = db.Column(db.String(50), nullable=False)  # chemical, organic, cultural
    method = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    effectiveness = db.Column(db.String(20), nullable=False)  # high, medium, low
    application_timing = db.Column(db.String(100), nullable=True)
    precautions = db.Column(db.Text, nullable=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'treatment_type': self.treatment_type,
            'method': self.method,
            'description': self.description,
            'effectiveness': self.effectiveness,
            'application_timing': self.application_timing,
            'precautions': self.precautions
        }

