from flask import  jsonify , request
from init import app
from auth import token_required, login, signup 
from team_invite import invite_user , accept_invite
from scrape import scrape_and_save_data , get_scraped_data , get_scraped_data_by_id , update_scraped_data_by_id
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


@app.route('/api/invite', methods=['POST'])
@token_required
def invite(current_user):
    return invite_user(current_user)

@app.route('/api/accept-invite', methods=['POST'])
def accept_invite_route():
    return accept_invite()

@app.route('/api/scrape/save', methods=['POST'])
@token_required
def scape_and_save_route(current_user):
    return scrape_and_save_data(current_user)


@app.route('/api/scrape/get', methods=['GET'])
@token_required
def get_scraped_data_route(current_user):
    return get_scraped_data(current_user)

@app.route('/api/scraped-data/<int:scraped_data_id>', methods=['GET'])
@token_required
def get_scraped_data_by_id_route(current_user  , scraped_data_id):
    return get_scraped_data_by_id(current_user, scraped_data_id)


@app.route('/api/scraped-data/<int:scraped_data_id>', methods=['PUT'])
def update_scraped_data_route(current_user , scraped_data_id):
    return update_scraped_data_by_id(current_user, scraped_data_id)

if __name__ == "__main__":
    app.run(debug=True)
