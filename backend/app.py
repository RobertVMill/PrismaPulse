from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from openai import OpenAI
import logging
import requests
from datetime import datetime, timedelta
from models import BigTechUpdate

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
NEWS_API_KEY = os.getenv('NEWS_API_KEY')

if not OPENAI_API_KEY:
    raise ValueError("Missing OpenAI API key. Please set OPENAI_API_KEY in .env file")

if not NEWS_API_KEY:
    raise ValueError("Missing News API key. Please set NEWS_API_KEY in .env file")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Flask
app = Flask(__name__)

# Configure CORS with credentials support
CORS(app, 
     resources={
         r"/*": {
             "origins": ["http://localhost:3000", "https://prisma-pulse.vercel.app"],
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True
         }
     })

# Enable debug mode and auto-reloading
app.debug = True

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({
        "message": "API connection successful!",
        "status": "ok"
    })

@app.route('/api/news')
def get_news():
    try:
        logger.info("Fetching news from NewsAPI...")
        
        # Get news from NewsAPI - using v2/everything for more comprehensive results
        url = 'https://newsapi.org/v2/everything'
        params = {
            'apiKey': NEWS_API_KEY,
            'q': 'technology OR artificial intelligence OR startup OR programming',  # Search terms
            'language': 'en',
            'sortBy': 'publishedAt',
            'pageSize': 20,
            'domains': 'techcrunch.com,theverge.com,wired.com,arstechnica.com'  # Reliable tech sources
        }
        
        logger.info(f"Making request to NewsAPI with params: {params}")
        response = requests.get(url, params=params)
        logger.info(f"NewsAPI response status: {response.status_code}")
        
        if response.status_code != 200:
            error_message = f"NewsAPI error: {response.status_code}"
            logger.error(error_message)
            if response.status_code == 401:
                error_message = "Invalid News API key. Please check your API key configuration."
            elif response.status_code == 429:
                error_message = "Too many requests to News API. Please try again later."
            return jsonify({"error": error_message}), 500
            
        data = response.json()
        logger.info(f"Received {len(data.get('articles', []))} articles from NewsAPI")
        
        if 'status' in data and data['status'] != 'ok':
            error_message = data.get('message', 'Unknown error from NewsAPI')
            logger.error(f"NewsAPI returned error: {error_message}")
            return jsonify({"error": error_message}), 500
        
        # Transform the articles to match our expected format
        articles = []
        for article in data.get('articles', []):
            try:
                # Skip articles with missing required fields
                if not article.get('title') or not article.get('url'):
                    continue
                    
                # Safely get text fields with fallbacks
                title = article.get('title', '').lower() if article.get('title') else ''
                description = article.get('description', '').lower() if article.get('description') else ''
                content = title + ' ' + description
                
                # Simple categorization logic
                category = 'Other Tech'
                if any(word in content for word in ['ai', 'machine learning', 'artificial intelligence', 'gpt', 'openai']):
                    category = 'AI & Machine Learning'
                elif any(word in content for word in ['startup', 'funding', 'business', 'venture', 'acquisition']):
                    category = 'Startups & Business'
                elif any(word in content for word in ['security', 'hack', 'breach', 'cyber', 'privacy']):
                    category = 'Cybersecurity'
                elif any(word in content for word in ['app', 'ios', 'android', 'mobile']):
                    category = 'Mobile & Apps'
                elif any(word in content for word in ['cloud', 'web', 'api', 'aws', 'azure']):
                    category = 'Web & Cloud'
                
                articles.append({
                    'title': article.get('title', 'Untitled Article'),
                    'link': article.get('url', '#'),
                    'published': article.get('publishedAt', ''),
                    'summary': article.get('description') or 'No description available',
                    'full_content': article.get('content') or article.get('description') or 'No content available',
                    'source': article.get('source', {}).get('name', 'Unknown Source'),
                    'category': category
                })
            except Exception as article_error:
                logger.error(f"Error processing article: {str(article_error)}")
                continue
        
        if not articles:
            logger.warning("No articles were successfully processed")
            return jsonify([{
                'title': 'No articles available',
                'link': '#',
                'published': '',
                'summary': 'Unable to fetch articles at this time. Please try again later.',
                'full_content': '',
                'source': 'System',
                'category': 'Other Tech'
            }])
        
        logger.info(f"Successfully processed and returning {len(articles)} articles")
        return jsonify(articles)
        
    except requests.exceptions.RequestException as e:
        error_message = f"Network error while fetching news: {str(e)}"
        logger.error(error_message)
        return jsonify({"error": error_message}), 500
    except Exception as e:
        error_message = f"Error fetching news: {str(e)}"
        logger.error(error_message, exc_info=True)
        return jsonify({"error": error_message}), 500

@app.route('/api/generate-article', methods=['POST'])
def generate_article():
    try:
        data = request.json
        logger.info(f"Received request with data: {data}")
        
        # Simple validation
        if not data or not data.get('topic'):
            return jsonify({"error": "Missing topic"}), 400

        logger.info("Making request to OpenAI API...")
        # Generate article using OpenAI
        completion = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful article writer."},
                {"role": "user", "content": f"Write a short article about: {data['topic']}"}
            ]
        )
        logger.info("Received response from OpenAI")

        return jsonify({
            "article": completion.choices[0].message.content,
            "status": "success"
        })

    except Exception as e:
        logger.error(f"Error in generate_article: {str(e)}", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route('/api/big-tech-matrix', methods=['GET'])
def get_big_tech_matrix():
    try:
        matrix = BigTechUpdate.get_company_matrix()
        return jsonify(matrix)
    except Exception as e:
        logger.error(f"Error fetching big tech matrix: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
