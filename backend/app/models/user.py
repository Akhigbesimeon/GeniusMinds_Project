from .. import db
import bcrypt
from datetime import datetime

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        if isinstance(password, str):
            password = password.encode('utf-8')
        self.password_hash = bcrypt.hashpw(password, bcrypt.gensalt(12))

    def check_password(self, password):
        if isinstance(password, str):
            password = password.encode('utf-8')
        if isinstance(self.password_hash, str):
            self.password_hash = self.password_hash.encode('utf-8')
        return bcrypt.checkpw(password, self.password_hash)