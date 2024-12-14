from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')  # Use default if not found
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///default.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', 'False').lower() == 'true'

app_config = Config
