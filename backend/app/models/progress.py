from .. import db
from datetime import datetime

class UserProgress(db.Model):
    __tablename__ = 'user_progress'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    subject_id = db.Column(db.Integer, db.ForeignKey('subjects.id'), nullable=False)
    progress_percentage = db.Column(db.Float, default=0)
    completed_lessons = db.Column(db.Integer, default=0)
    total_lessons = db.Column(db.Integer, default=0)
    last_activity_date = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<UserProgress {self.user_id} on {self.subject_id}: {self.progress_percentage}%>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'subject_id': self.subject_id,
            'progress': self.progress_percentage,
            'completed_lessons': self.completed_lessons,
            'total_lessons': self.total_lessons,
            'last_activity_date': self.last_activity_date.isoformat() if self.last_activity_date else None,
            'created_at': self.created_at.isoformat()
        }

class Achievement(db.Model):
    __tablename__ = 'achievements'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon_type = db.Column(db.String(50))  # 'Trophy', 'Star', 'Award'
    points_required = db.Column(db.Integer, default=0)
    badge_image_url = db.Column(db.String(200))
    
    def __repr__(self):
        return f'<Achievement {self.name}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon_type': self.icon_type,
            'points_required': self.points_required,
            'badge_image_url': self.badge_image_url
        }

class UserAchievement(db.Model):
    __tablename__ = 'user_achievements'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    achievement_id = db.Column(db.Integer, db.ForeignKey('achievements.id'), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    progress = db.Column(db.Float, default=0)  # Progress percentage toward achievement
    earned_date = db.Column(db.DateTime)
    
    def __repr__(self):
        return f'<UserAchievement {self.user_id} - {self.achievement_id}>'
        
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'achievement_id': self.achievement_id,
            'completed': self.completed,
            'progress': self.progress,
            'earned_date': self.earned_date.isoformat() if self.earned_date else None
        }