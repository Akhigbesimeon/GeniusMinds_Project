from .. import db
from datetime import datetime

class FlashcardSet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)
    is_public = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    flashcards = db.relationship('FlashCard', backref='flashcardset', lazy=True)

class FlashCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    flashcardset_id = db.Column(db.Integer, db.ForeignKey('flashcard_set.id', ondelete='SET NULL'), nullable=False)
    front_text = db.Column(db.Text, nullable=False)
    back_text = db.Column(db.Text, nullable=False)
    tags = db.Column(db.Text, nullable=False)

