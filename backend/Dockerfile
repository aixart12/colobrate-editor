# Use the official Python image from the Docker Hub
FROM python:3.12-slim

# Set the working directory
WORKDIR /app

# Upgrade pip to the latest version
RUN pip install --upgrade pip

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies, including Gunicorn and Flask-Migrate
RUN pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir gunicorn Flask-Migrate alembic

# Copy the current directory contents into the container at /app
COPY . .

# Initialize Flask-Migrate
RUN flask db upgrade || true

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define the command to run the app with Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "300", "--graceful-timeout", "60", "app:app"]
