from flask import Flask, request, jsonify
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)
