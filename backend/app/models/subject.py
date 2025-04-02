# models/subject.py
from .. import db

class Subject(db.Model):
    __tablename__ = 'subjects'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(50))  # Icon identifier (e.g., 'Brain', 'Plus')
    color = db.Column(db.String(50))  # Color identifier for the UI
    
    # Relationships
    user_progress = db.relationship('UserProgress', backref='subject', lazy=True)
    
    def __repr__(self):
        return f'<Subject {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'color': self.color
        }