from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.String(50), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=True) # Nullable for Google Auth users
    name = db.Column(db.String(100), nullable=False)
    auth_provider = db.Column(db.String(50), default='email') # 'email' or 'google'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    history = db.relationship('UserHistory', backref='user', lazy=True, cascade='all, delete-orphan')
    otps = db.relationship('OTP', backref='user', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'auth_provider': self.auth_provider,
            'created_at': self.created_at.isoformat()
        }

class OTP(db.Model):
    __tablename__ = 'otps'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    otp_code = db.Column(db.String(6), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, default=False)

class UserHistory(db.Model):
    __tablename__ = 'user_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), db.ForeignKey('users.id'), nullable=False)
    plant_id = db.Column(db.String(50), db.ForeignKey('plants.id'), nullable=True) # Can be null if plant was deleted
    disease_id = db.Column(db.Integer, db.ForeignKey('diseases.id'), nullable=True) # Can be null if disease was deleted or healthy
    diagnosis_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Store string snapshots in case linked plant/disease is deleted
    plant_name_snapshot = db.Column(db.String(100), nullable=True)
    disease_name_snapshot = db.Column(db.String(100), nullable=True)
    symptoms_snapshot = db.Column(db.Text, nullable=True) # JSON string of selected symptoms

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'plant_id': self.plant_id,
            'plant_name': self.plant_name_snapshot,
            'disease_id': self.disease_id,
            'disease_name': self.disease_name_snapshot,
            'symptoms_snapshot': self.symptoms_snapshot,
            'diagnosis_date': self.diagnosis_date.isoformat()
        }