from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS, cross_origin
from config import app_config

# Initialize Flask app and SQLAlchemy
app = Flask(__name__)
CORS(app, support_credentials=True)
app.config.from_object(app_config)
db = SQLAlchemy(app)
mail = Mail(app)