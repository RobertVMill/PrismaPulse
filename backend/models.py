from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from supabase import create_client
import os
from dotenv import load_dotenv
import uuid
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

load_dotenv()

# Initialize Supabase client
supabase_url = os.getenv('SUPABASE_URL')
supabase_key = os.getenv('SUPABASE_KEY')

if not supabase_url or not supabase_key:
    logger.error("Missing Supabase credentials")
    raise ValueError("Missing Supabase credentials")

logger.info(f"Initializing Supabase client with URL: {supabase_url}")
try:
    supabase = create_client(supabase_url, supabase_key)
    logger.info("Supabase client initialized successfully")
except Exception as e:
    logger.error(f"Error initializing Supabase client: {str(e)}")
    raise

class User(UserMixin):
    def __init__(self, id, username, password_hash):
        self.id = str(id)  # Ensure ID is always a string
        self.username = username
        self.password_hash = password_hash

    def get_id(self):
        """Required by Flask-Login"""
        return str(self.id)  # Return ID as string for Flask-Login

    @staticmethod
    def create(username, password):
        logger = logging.getLogger(__name__)
        
        try:
            # Check if username already exists
            existing_user = supabase.table('users').select('*').eq('username', username).execute()
            if existing_user.data:
                raise ValueError("Username already exists")
                
            password_hash = generate_password_hash(password)
            
            # Generate a new UUID for the user
            user_id = str(uuid.uuid4())  # Convert UUID to string immediately
            logger.info(f"Generated new UUID for user: {user_id}")
            
            # Insert new user into Supabase users table
            user_data = {
                'id': user_id,  # Already a string
                'username': username,
                'password_hash': password_hash
            }
            logger.info(f"Attempting to insert user with data: {user_data}")
            
            result = supabase.table('users').insert(user_data).execute()
            logger.info(f"User creation result: {result.data}")
            
            if not result.data:
                raise Exception("Failed to create user")
                
            # Verify the user was created
            check_user = supabase.table('users').select('*').eq('id', user_id).execute()
            logger.info(f"User verification result: {check_user.data}")
            
            if not check_user.data:
                raise Exception("User creation verification failed")
                
            user_data = result.data[0]
            return User(
                id=user_data['id'],
                username=user_data['username'],
                password_hash=user_data['password_hash']
            )
        except Exception as e:
            logger.error(f"Error creating user: {str(e)}")
            import traceback
            logger.error(f"Full error: {traceback.format_exc()}")
            raise

    @staticmethod
    def get_by_username(username):
        result = supabase.table('users').select('*').eq('username', username).execute()
        if not result.data:
            return None
            
        user_data = result.data[0]
        return User(
            id=user_data['id'],  # Will be converted to string in __init__
            username=user_data['username'],
            password_hash=user_data['password_hash']
        )

    @staticmethod
    def get_by_id(user_id):
        try:
            # user_id should already be a string from get_id()
            result = supabase.table('users').select('*').eq('id', user_id).execute()
            if not result.data:
                return None
                
            user_data = result.data[0]
            return User(
                id=user_data['id'],  # Will be converted to string in __init__
                username=user_data['username'],
                password_hash=user_data['password_hash']
            )
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.error(f"Error getting user by ID: {str(e)}")
            return None

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class BigTechUpdate:
    def __init__(self, id, company, category, title, content, date, source_url):
        self.id = str(id)
        self.company = company
        self.category = category
        self.title = title
        self.content = content
        self.date = date
        self.source_url = source_url

    COMPANIES = [
        'NVIDIA',
        'META',
        'APPLE',
        'MICROSOFT',
        'ALPHABET',
        'AMAZON',
        'TESLA'
    ]

    CATEGORIES = [
        'REGULATORY',
        'PRODUCT',
        'INVESTMENT',
        'AI_DEVELOPMENT',
        'PARTNERSHIPS',
        'MARKET_IMPACT'
    ]

    @staticmethod
    def create(company, category, title, content, source_url):
        if company not in BigTechUpdate.COMPANIES:
            raise ValueError(f"Invalid company. Must be one of {BigTechUpdate.COMPANIES}")
        
        if category not in BigTechUpdate.CATEGORIES:
            raise ValueError(f"Invalid category. Must be one of {BigTechUpdate.CATEGORIES}")

        update_data = {
            'id': str(uuid.uuid4()),
            'company': company,
            'category': category,
            'title': title,
            'content': content,
            'date': datetime.utcnow(),
            'source_url': source_url
        }

        result = supabase.table('big_tech_updates').insert(update_data).execute()
        return BigTechUpdate(**result.data[0])

    @staticmethod
    def get_latest_by_company(company, limit=5):
        result = supabase.table('big_tech_updates')\
            .select('*')\
            .eq('company', company)\
            .order('date', desc=True)\
            .limit(limit)\
            .execute()
        
        return [BigTechUpdate(**update) for update in result.data]

    @staticmethod
    def get_by_category(category, limit=10):
        result = supabase.table('big_tech_updates')\
            .select('*')\
            .eq('category', category)\
            .order('date', desc=True)\
            .limit(limit)\
            .execute()
        
        return [BigTechUpdate(**update) for update in result.data]

    @staticmethod
    def get_company_matrix():
        try:
            result = supabase.table('big_tech_updates')\
                .select('*')\
                .order('date', desc=True)\
                .execute()

            # Initialize matrix with empty dictionaries for each company
            matrix = {company: {} for company in BigTechUpdate.COMPANIES}
            
            # Organize updates by company and category
            for update in result.data:
                company = update['company']
                category = update['category']
                if category not in matrix[company]:
                    matrix[company][category] = update

            return matrix
        except Exception as e:
            logger.error(f"Error getting company matrix: {str(e)}")
            raise
