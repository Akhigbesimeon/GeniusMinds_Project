from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config
import pymysql
from datetime import datetime

# Replace MySQLdb with PyMySQL
pymysql.install_as_MySQLdb()

# Initialize extensions
jwt = JWTManager()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://sql7770662:9yyBpNVgHZ@sql7.freesqldatabase.com:3306/sql7770662'

db = SQLAlchemy(app)

def create_app(config_class=Config):
    app.config.from_object(Config)


    # Initialize CORS with settings
    CORS(app, resources={
        r"/*": {
            "origins": config_class.CORS_ORIGINS,
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    # Initialize Flask extensions
    jwt.init_app(app)
    app.config['JWT_VERIFY_SUB'] = False

    # Registering blueprints
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
            'server_time': datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
        })

    # Create database tables
    with app.app_context():
        db.create_all()

    return app