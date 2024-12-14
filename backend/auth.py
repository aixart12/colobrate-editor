from flask import request, jsonify, make_response
from functools import wraps
import jwt
import uuid  # For public ID
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from init import app, db  # Import from init
from models import User


# JWT token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')  # Get token from headers
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except Exception as e:
            print(e)
            return jsonify({'message': 'Token is invalid!'}), 401

        return f(current_user, *args, **kwargs)
    return decorated


def login():
    auth = request.json
    if not auth or not auth.get('email') or not auth.get('password'):
        return make_response('Could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!"'})

    user = User.query.filter_by(email=auth.get('email')).first()
    if not user:
        return make_response('User does not exist!', 401, {'WWW-Authenticate': 'Basic realm="User does not exist!"'})

    if check_password_hash(user.password, auth.get('password')):
        token = jwt.encode({'public_id': user.public_id, 'exp': datetime.utcnow() + timedelta(minutes=30)},
                           app.config['SECRET_KEY'])
        return make_response(jsonify({'token': token}), 201)

    return make_response('Wrong password!', 403, {'WWW-Authenticate': 'Basic realm="Wrong password!"'})


# Signup function
def signup():
    data = request.json
    name, email = data.get('name'), data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user:
        team_id = str(uuid.uuid4())  # Generate unique team_id
        user = User(
            public_id=str(uuid.uuid4()),
            name=name,
            email=email,
            password=generate_password_hash(password),
            team_id=team_id  # Assign the generated team_id
        )
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'Successfully registered.'}), 201
    else:
        return jsonify({'message': 'User already exists. Please log in.'}), 202
