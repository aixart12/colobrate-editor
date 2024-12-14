import requests
from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
from models import User, ScrapedData
from init import db

def scrape_and_save_data(current_user):
    # Extract the user ID and URL from the request
    data = request.json
    user_id = current_user.id
    url = data.get('url')

    if not user_id or not url:
        return jsonify({"status": "error", "message": "user_id and url are required"}), 400


    # Get the team_id of the logged-in user
    team_id = current_user.team_id
    if not team_id:
        return jsonify({'message': 'No team associated with your account'}), 400
    
    # Perform web scraping
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract specific content from the website (e.g., headings and paragraphs)
        content = {
            "headings": [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3'])],
            "paragraphs": [p.get_text(strip=True) for p in soup.find_all('p')],
        }

        # Convert the content to a string for storage in the database
        content_str = str(content)

        # Save the scraped data associated with the user's team
        scraped_data = ScrapedData(team_id=team_id, url=url, content=content_str)
        db.session.add(scraped_data)
        db.session.commit()

        return jsonify({"status": "success", "message": "Scraped data saved successfully"}), 201

    except requests.exceptions.RequestException as e:
        return jsonify({"status": "error", "message": f"Failed to scrape the website: {str(e)}"}), 500


def get_scraped_data(current_user):
    try:

        print('current user data',current_user.id )
        user_id = current_user.id

        if not user_id:
            return jsonify({"status": "error", "message": "user_id is required"}), 400

        # Fetch the user and their team ID
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404

        # Retrieve all scraped data for the team
        scraped_data = ScrapedData.query.filter_by(team_id=user.team_id).all()

        # Convert the data to a list of dictionaries
        data = [
            {
                "id": item.id,
                "url": item.url,
                "content": item.content,
                "created_at": item.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
            for item in scraped_data
        ]

        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        # Log the exception (use logging in production)
        print(f"Error in get_scraped_data: {e}")
        return jsonify({'error': 'An error while getting the scapped data ', 'details': str(e)}), 500