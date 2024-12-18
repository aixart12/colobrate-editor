import requests ,json
from flask import  request, jsonify
from bs4 import BeautifulSoup
from models import User, ScrapedData
from urllib.parse import urlparse
from slugify import slugify
from init import db , cache 

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

        # Try to extract the title of the page
        title = soup.title.get_text(strip=True) if soup.title else None

        # If no title is found, fallback to the last part of the URL
        if not title:
            parsed_url = urlparse(url)
            title = parsed_url.path.strip('/').split('/')[-1]

        # Ensure the title is in slug format (lowercase, hyphenated)
        title = slugify(title)

        # Extract specific content from the website (e.g., headings and paragraphs)
        content = {
            "headings": [h.get_text(strip=True) for h in soup.find_all(['h1', 'h2', 'h3'])],
            "paragraphs": [p.get_text(strip=True) for p in soup.find_all('p')],
        }

        # Convert the content to a string for storage in the database
        content_str = str(content)

        # Save the scraped data associated with the user's team
        scraped_data = ScrapedData(
            team_id=team_id,
            url=url,
            title=title,  # Save the slugified title
            content=content_str
        )
        db.session.add(scraped_data)
        db.session.commit()

        # Return the scraped data in the response
        return jsonify({
            "status": "success",
            "message": "Scraped data saved successfully",
            "data": {
                "id": scraped_data.id,
                "team_id": scraped_data.team_id,
                "url": scraped_data.url,
                "title": scraped_data.title,
                "content": scraped_data.content
            }
        }), 201

    except requests.exceptions.RequestException as e:
        return jsonify({"status": "error", "message": f"Failed to scrape the website: {str(e)}"}), 500

def get_scraped_data(current_user):
    try:
        user_id = current_user.id

        if not user_id:
            return jsonify({"status": "error", "message": "user_id is required"}), 400

       # Decode and parse JSON data from cache
        cached_data = cache.get(f"scraped_data_{user_id}")
        if cached_data:
            print("Cache hit for scraped data.")
            return jsonify({"status": "success", "data": json.loads(cached_data)}), 200

        # If not in cache, fetch from the database
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
                "title": item.title,
                "created_at": item.created_at.strftime("%Y-%m-%d %H:%M:%S")
            }
            for item in scraped_data
        ]

        # Cache the result for future use (e.g., cache for 10 minutes)
        cache.setex(f"scraped_data_{user_id}", 600, json.dumps(data))  # 600 seconds = 10 minutes

        print("Cache miss for scraped data.")
        return jsonify({"status": "success", "data": data}), 200
    except Exception as e:
        # Log the exception (use logging in production)
        print(f"Error in get_scraped_data: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred while retrieving the scraped data', 'details': str(e)}), 500


def get_scraped_data_by_id(current_user, scraped_data_id):
    try:
        user_id = current_user.id

        if not user_id:
            return jsonify({"status": "error", "message": "user_id is required"}), 400

        # Fetch the user and their team ID
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404

        # Fetch the scraped data by ID and ensure the team ID matches
        scraped_data = ScrapedData.query.filter_by(id=scraped_data_id, team_id=user.team_id).first()
        if not scraped_data:
            return jsonify({"status": "error", "message": "Scraped data not found or access denied"}), 404

        # Prepare the response
        data = {
            "id": scraped_data.id,
            "url": scraped_data.url,
            "content": scraped_data.content,
            "title": scraped_data.title,
            "created_at": scraped_data.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

        return jsonify({"status": "success", "data": data}), 200

    except Exception as e:
        # Log the exception (use logging in production)
        print(f"Error in get_scraped_data_by_id: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred', 'details': str(e)}), 500

def update_scraped_data_by_id(current_user, scraped_data_id):
    try:
        user_id = current_user.id

        if not user_id:
            return jsonify({"status": "error", "message": "user_id is required"}), 400

        # Fetch the user and their team ID
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"status": "error", "message": "User not found"}), 404

        # Fetch the scraped data by ID and ensure the team ID matches
        scraped_data = ScrapedData.query.filter_by(id=scraped_data_id, team_id=user.team_id).first()
        if not scraped_data:
            return jsonify({"status": "error", "message": "Scraped data not found or access denied"}), 404

        # Extract the updated content from the request
        data = request.json
        updated_content = data.get("content")
        if not updated_content:
            return jsonify({"status": "error", "message": "Updated content is required"}), 400

        # Update the scraped data
        scraped_data.content = updated_content
        db.session.commit()

        return jsonify({"status": "success", "message": "Scraped data updated successfully"}), 200

    except Exception as e:
        # Log the exception (use logging in production)
        print(f"Error in update_scraped_data_by_id: {e}")
        return jsonify({'status': 'error', 'message': 'An error occurred', 'details': str(e)}), 500