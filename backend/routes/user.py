import os
import jwt
import requests
import random
import smtplib
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from werkzeug.security import generate_password_hash, check_password_hash
from flask import Blueprint, request, jsonify, current_app
from models.user import db, User, OTP, UserHistory
from models.plant import Plant, Disease

user_bp = Blueprint('user', __name__)

def generate_token(user_id):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, current_app.config.get('SECRET_KEY', 'default-secret-key'), algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, current_app.config.get('SECRET_KEY', 'default-secret-key'), algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None # Token expired
    except jwt.InvalidTokenError:
        return None # Invalid token

def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'error': 'Token is invalid or expired'}), 401
            
        return f(user_id, *args, **kwargs)
    return decorated

@user_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'PlantCare Pro API is running'
    })

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not all([name, email, password]):
        return jsonify({'error': 'Missing data'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 409

    hashed_password = generate_password_hash(password)
    new_user = User(name=name, email=email, password_hash=hashed_password, auth_provider='email')
    db.session.add(new_user)
    db.session.commit()

    token = generate_token(new_user.id)
    return jsonify({'message': 'User created successfully', 'token': token, 'user': new_user.to_dict()}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing credentials'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.password_hash:
        return jsonify({'error': 'Invalid credentials'}), 401
        
    if not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401

    token = generate_token(user.id)
    return jsonify({'message': 'Logged in successfully', 'token': token, 'user': user.to_dict()}), 200

@user_bp.route('/google-login', methods=['POST'])
def google_login():
    data = request.json
    token = data.get('tokenId')
    
    if not token:
        return jsonify({'error': 'Missing token'}), 400
        
    # Verify with Google
    try:
        response = requests.get(f'https://oauth2.googleapis.com/tokeninfo?id_token={token}')
        if response.status_code != 200:
            return jsonify({'error': 'Invalid Google token'}), 401
            
        google_data = response.json()
        email = google_data.get('email')
        name = google_data.get('name')
        
        user = User.query.filter_by(email=email).first()
        if not user:
            # Create user if doesn't exist
            user = User(name=name, email=email, auth_provider='google')
            db.session.add(user)
            db.session.commit()
            
        app_token = generate_token(user.id)
        return jsonify({'message': 'Logged in successfully', 'token': app_token, 'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@user_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    # Generate 6-digit OTP
    otp_code = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    
    # Invalidate previous un-used OTPs
    OTP.query.filter_by(user_id=user.id, is_used=False).update({'is_used': True})
    
    new_otp = OTP(user_id=user.id, otp_code=otp_code, expires_at=expires_at)
    db.session.add(new_otp)
    db.session.commit()
    
    # Simulate sending email (in a real app, integrate SMTP)
    print(f"DEBUG: OTP for {email} is {otp_code}")
    # In a real scenario you would do:
    # send_email(email, otp_code)
    
    return jsonify({'message': 'OTP sent to your email (check server console in dev)'}), 200

@user_bp.route('/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    otp_code = data.get('otp')
    
    if not email or not otp_code:
        return jsonify({'error': 'Email and OTP required'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    otp_record = OTP.query.filter_by(user_id=user.id, otp_code=otp_code, is_used=False).order_by(OTP.created_at.desc()).first()
    
    if not otp_record or otp_record.expires_at < datetime.utcnow():
        return jsonify({'error': 'Invalid or expired OTP'}), 400
        
    # Valid OTP
    otp_record.is_used = True
    db.session.commit()
    
    return jsonify({'message': 'OTP verified successfully. You can now reset your password.', 'reset_token': otp_code}), 200

@user_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    reset_token = data.get('reset_token')
    new_password = data.get('new_password')
    
    if not all([email, reset_token, new_password]):
        return jsonify({'error': 'Missing required fields'}), 400
        
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    # Since we used the valid OTP as the reset token (for simplicity)
    recent_otp = OTP.query.filter_by(user_id=user.id, otp_code=reset_token, is_used=True).order_by(OTP.created_at.desc()).first()
    
    if not recent_otp:
        return jsonify({'error': 'Invalid reset token'}), 400
        
    user.password_hash = generate_password_hash(new_password)
    user.auth_provider = 'email' # In case they were purely Google before
    db.session.commit()
    
    return jsonify({'message': 'Password reset successfully'}), 200

@user_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict()), 200

@user_bp.route('/history', methods=['GET'])
@token_required
def get_history(user_id):
    history = UserHistory.query.filter_by(user_id=user_id).order_by(UserHistory.diagnosis_date.desc()).all()
    return jsonify([h.to_dict() for h in history]), 200