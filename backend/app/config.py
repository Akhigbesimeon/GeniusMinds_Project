import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'GeniusMinds_App_3e421a9dd62d4b51bf160966f49172eb')
    DEBUG = True
    
    # Database settings - using PyMySQL
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'GeniusMinds_JWT_8f4c16b290fd86c39e190a62c11a8c59')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # CORS settings - Update these according to your frontend URL
    CORS_HEADERS = 'Content-Type'
    CORS_ORIGINS = ["http://127.0.0.1:5500", "http://localhost:5500"]  # Add your frontend URL