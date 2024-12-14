from flask import  jsonify
from init import app, db
from auth import token_required, login, signup 
from team_invite import invite_user , accept_invite
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


# Invite route
@app.route('/invite', methods=['POST'])
@token_required
def invite(current_user):
    return invite_user(current_user)

# Accept invite route
@app.route('/accept-invite/<token>', methods=['GET'])
def accept_invite_route(token):
    return accept_invite(token)

if __name__ == "__main__":
    app.run(debug=True)
