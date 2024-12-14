from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import app_config
from dotenv import load_dotenv

# Initialize Flask app and SQLAlchemy
app = Flask(__name__)
app.config.from_object(app_config)
db = SQLAlchemy(app)

load_dotenv()
