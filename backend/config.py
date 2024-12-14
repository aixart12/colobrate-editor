from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

class Config(object):
    SECRET_KEY = os.getenv('SECRET_KEY', 'default_secret_key')  # Use default if not found
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///default.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', 'False').lower() == 'true'

    # Mail Config
    MAIL_SERVER = os.getenv('MAIL_SERVER')
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME =  os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_USE_TLS = True  
    MAIL_USE_SSL = False   
        


app_config = Config
