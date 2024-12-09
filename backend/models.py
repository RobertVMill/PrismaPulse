from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin):
    def __init__(self, id, username, password_hash):
        self.id = id
        self.username = username
        self.password_hash = password_hash

    @staticmethod
    def create(username, password):
        # In a real app, you'd want to check if username already exists
        # and store in a database instead of memory
        password_hash = generate_password_hash(password)
        return User(username, username, password_hash)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# For demo purposes, store users in memory
# In a real app, you'd use a database
users = {}
