from flask import  jsonify
from init import app, db
from auth import token_required, login, signup
from models import User


@app.route('/user', methods=['GET'])
@token_required
def get_all_users(current_user):
    users = User.query.all()
    output = [{'public_id': user.public_id, 'name': user.name, 'email': user.email} for user in users]
    return jsonify({'users': output})


@app.route('/login', methods=['POST'])
def log_in():
    return login()


@app.route('/signup', methods=['POST'])
def sing_up():
    return signup()


if __name__ == "__main__":
    app.run(debug=True)
