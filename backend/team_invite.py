
import uuid , os
from werkzeug.security import generate_password_hash
from flask import request, jsonify
from init import db, mail
from models import User, Invite
from flask_mail import Message
from datetime import datetime, timedelta

# Send invite email
def send_invite_email(email, team_id, token):
    msg = Message(
        'Team Invitation',
        sender="dhruv@geekonomy.in",
        recipients=[email],
        body=f"You're invited to join a team. Click the link to accept: {os.getenv('APP_URL')}/accept-invite/{token}"
    )
    mail.send(msg)

def invite_user(current_user):
    try:
        # Parse the incoming JSON request
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({'message': 'Email is required'}), 400
        
        email = data['email']  # The invited user's email

        # Get the team_id of the logged-in user
        team_id = current_user.team_id
        if not team_id:
            return jsonify({'message': 'No team associated with your account'}), 400

        # Check if an invite already exists for this email and team
        existing_invite = Invite.query.filter_by(team_id=team_id, email=email).first()
        if existing_invite:
            return jsonify({'message': 'An invite already exists for this email'}), 400

        # Generate a unique token for the invite
        token = str(uuid.uuid4())  # Unique token for the invite
        expiration_date = datetime.utcnow() + timedelta(hours=1)

        # Create and save the invite to the database
        invite = Invite(
            team_id=team_id,
            email=email,
            token=token,
            expiration_date=expiration_date
        )
        db.session.add(invite)
        db.session.commit()

        # Send the invitation email to the invited user
        send_invite_email(email, team_id, token)

        return jsonify({'message': f'Invite sent successfully to {email}'}), 200

    except Exception as e:
        # Log the exception (use logging in production)
        print(f"Error in invite_user: {e}")
        return jsonify({'error': 'An error occurred while sending the invite', 'details': str(e)}), 500


# Accept invite function
def accept_invite():
    try : 
        data = request.get_json()
        if not data or 'token' not in data:
            return jsonify({'message': 'Email is required'}), 400
        
        token = data['token']  
        name  = data['name']

        invite = Invite.query.filter_by(token=token).first()
        if not invite:
            return jsonify({'message': 'Invalid invite token'}), 400

        # Check if the invite is expired
        if invite.expiration_date < datetime.utcnow():
            invite.status = 'expired'
            db.session.commit()
            return jsonify({'message': 'Invite has expired'}), 400

        # Create the new user and add them to the team
        user = User.query.filter_by(email=invite.email).first()

        if user:
            return jsonify({'message': 'User already exists'}), 400

        # Create the new user with the same team_id as the inviter
        new_user = User(
            public_id=str(uuid.uuid4()),
            email=invite.email,
            name=name,
            team_id=invite.team_id,  # Assign the same team_id as the inviter
            password=generate_password_hash("password123")  # Default password
        )

        db.session.add(new_user)
        db.session.commit()

        invite.status = 'accepted'
        db.session.commit()

        return jsonify({'message': 'You have successfully joined the team'}), 200
    
    except Exception as e:
        # Log the exception (use logging in production)
        print(f"Error in accept_invite: {e}")
        return jsonify({'error': 'An error occurred while accepting', 'details': str(e)}), 500