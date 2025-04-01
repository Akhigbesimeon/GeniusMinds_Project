from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from ..models.user import User
from .. import db

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print("Registration data received:", data)  # Debug log

        # Check if user already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            role=data['role'].lower()
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()

        print(f"User {user.username} registered successfully")  # Debug log
        return jsonify({'message': 'User created successfully'}), 201

    except Exception as e:
        print(request.__dict__)
        print("Registration error:", str(e))  # Debug log
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Login attempt for user:", data.get('email'))  # Debug log

        user = User.query.filter_by(email=data['email']).first()
        
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity=user.id)
            print(f"Login successful for user {user.email}")  # Debug log
            return jsonify({
                'access_token': access_token,
                'email': user.email,
                'role': user.role
            }), 200
        
        print("Invalid credentials for user:", data.get('email'))  # Debug log
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        print("Login error:", str(e))  # Debug log
        return jsonify({'error': str(e)}), 500