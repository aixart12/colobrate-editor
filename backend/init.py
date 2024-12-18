from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail
from flask_cors import CORS
from flask_migrate import Migrate
from config import app_config
from flask_socketio import SocketIO
from flask_session import Session
import redis , os


# Initialize Flask app and SQLAlchemy
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable CORS
CORS(app, support_credentials=True)
app.config.from_object(app_config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
mail = Mail(app)
# Initialize session
Session(app)

cache = redis.StrictRedis(host=os.getenv('HOST'), port=6379, db=0)