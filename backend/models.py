from init import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(50), unique=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(70), unique=True)
    password = db.Column(db.String(80))
    team_id = db.Column(db.String(36), nullable=False)  # Use UUID for team_id

    def __repr__(self):
        return f'<User {self.name}>'

class Invite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.String(36), nullable=False)
    email = db.Column(db.String(70), nullable=False)
    token = db.Column(db.String(36), unique=True, nullable=False)
    expiration_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), default="pending")

    def __repr__(self):
        return f'<Invite {self.email}>'
