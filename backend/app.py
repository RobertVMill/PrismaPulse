from flask import Flask, jsonify, request
from flask_cors import CORS
import feedparser
from datetime import datetime
import os
from dotenv import load_dotenv
import logging
import requests
from openai import OpenAI

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
NEWS_API_KEY = os.getenv('NEWS_API_KEY')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)
CORS(app)
client = OpenAI(api_key=OPENAI_API_KEY)

def generate_key_takeaway(title, summary):
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates one-line key takeaways from news articles. Keep it brief and focused on the main point."},
                {"role": "user", "content": f"Title: {title}\n\nSummary: {summary}\n\nProvide a one-line key takeaway from this article."}
            ],
            max_tokens=60,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.error(f"Error generating takeaway: {str(e)}")
        return None

def fetch_tech_news_rss():
    logger.info("Fetching news from TechCrunch RSS feed...")
    try:
        feed = feedparser.parse('https://techcrunch.com/feed/')
        if feed.bozo:
            logger.error(f"Error parsing RSS feed: {feed.bozo_exception}")
            return []
            
        articles = []
        logger.info(f"Found {len(feed.entries)} articles")
        
        for entry in feed.entries[:10]:
            takeaway = generate_key_takeaway(entry.title, entry.summary)
            article = {
                'title': entry.title,
                'link': entry.link,
                'published': entry.published,
                'summary': entry.summary,
                'source': 'TechCrunch RSS',
                'key_takeaway': takeaway
            }
            articles.append(article)
        
        logger.info(f"Returning {len(articles)} RSS articles")
        return articles
    except Exception as e:
        logger.error(f"Error fetching RSS news: {str(e)}")
        return []

def fetch_news_api():
    logger.info("Fetching news from News API...")
    try:
        url = 'https://newsapi.org/v2/top-headlines'
        params = {
            'apiKey': NEWS_API_KEY,
            'category': 'technology',
            'language': 'en',
            'pageSize': 10
        }
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        articles = []
        for item in data.get('articles', []):
            takeaway = generate_key_takeaway(item.get('title'), item.get('description'))
            article = {
                'title': item.get('title'),
                'link': item.get('url'),
                'published': item.get('publishedAt'),
                'summary': item.get('description'),
                'source': f"News API - {item.get('source', {}).get('name', 'Unknown')}",
                'key_takeaway': takeaway
            }
            articles.append(article)
            
        logger.info(f"Returning {len(articles)} News API articles")
        return articles
    except Exception as e:
        logger.error(f"Error fetching News API: {str(e)}")
        return []

@app.route('/api/health')
def health_check():
    logger.info("Health check endpoint called")
    return jsonify({"status": "healthy"})

@app.route('/api/news')
def get_news():
    logger.info("News endpoint called")
    source = request.args.get('source', 'all')
    
    if source == 'rss':
        articles = fetch_tech_news_rss()
    elif source == 'newsapi':
        articles = fetch_news_api()
    else:
        # Fetch from both sources
        articles = fetch_tech_news_rss() + fetch_news_api()
    
    if not articles:
        logger.warning("No articles fetched")
        return jsonify({"error": "Failed to fetch articles"}), 500
        
    return jsonify(articles)

@app.route('/api/ask', methods=['POST'])
def ask_about_article():
    data = request.json
    question = data.get('question')
    article_title = data.get('title')
    article_summary = data.get('summary')
    
    if not all([question, article_title, article_summary]):
        return jsonify({"error": "Missing required fields"}), 400
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that answers questions about news articles. Keep responses concise and informative."},
                {"role": "user", "content": f"""
Article Title: {article_title}
Article Summary: {article_summary}

Question: {question}

Please answer this question about the article."""}
            ],
            max_tokens=150,
            temperature=0.7
        )
        answer = response.choices[0].message.content.strip()
        return jsonify({"answer": answer})
    except Exception as e:
        logger.error(f"Error generating answer: {str(e)}")
        return jsonify({"error": "Failed to generate answer"}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    logger.info(f"Starting server on port {port}")
    app.run(host='0.0.0.0', port=port)
