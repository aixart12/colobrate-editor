from flask import  jsonify
from init import app, db
from auth import token_required, login, signup 
from team_invite import invite_user , accept_invite
from models import User


@app.route('/api/user', methods=['GET'])
@token_required
def get_all_users(current_user):
    users = User.query.all()
    output = [{'public_id': user.public_id, 'name': user.name, 'email': user.email} for user in users]
    return jsonify({'users': output})


@app.route('/api/login', methods=['POST'])
def log_in():
    return login()


@app.route('/api/signup', methods=['POST'])
def sing_up():
    return signup()


# Invite route
@app.route('/api/invite', methods=['POST'])
@token_required
def invite(current_user):
    return invite_user(current_user)

# Accept invite route
@app.route('/api/accept-invite', methods=['POST'])
def accept_invite_route():
    return accept_invite()

if __name__ == "__main__":
    app.run(debug=True)
