from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config
import pymysql

# Replace MySQLdb with PyMySQL
pymysql.install_as_MySQLdb()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize CORS
    CORS(app)

    # Initialize Flask extensions
    db.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.api import api_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(api_bp, url_prefix='/api')

    # Register root route
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Welcome to GeniusMinds API',
            'documentation': '/api/docs',
            'health_check': '/api/health',
            'current_user': 'Miranics',
            'server_time': '2025-03-15 14:48:57'
        })

    # Create database tables
    with app.app_context():
        db.create_all()

    return app