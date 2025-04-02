from .. import db
from datetime import datetime

class UserActivity(db.Model):
    __tablename__ = 'user_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    activity = db.Column(db.String(200), nullable=False)
    subject = db.Column(db.String(100))
    activity_type = db.Column(db.String(50))
    reference_id = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<UserActivity {self.id}: {self.activity[:20]}...>'
        
    def to_dict(self):
        # Calculate time difference for frontend display
        now = datetime.utcnow()
        delta = now - self.created_at
        
        if delta.days >= 1:
            if delta.days == 1:
                time_display = "Yesterday"
            else:
                time_display = f"{delta.days} days ago"
        elif delta.seconds >= 3600:
            hours = delta.seconds // 3600
            time_display = f"{hours} hour{'s' if hours > 1 else ''} ago"
        else:
            minutes = delta.seconds // 60
            time_display = f"{minutes} minute{'s' if minutes > 1 else ''} ago"
            
        return {
            'id': self.id,
            'activity': self.activity,
            'subject': self.subject,
            'activity_type': self.activity_type,
            'time': time_display,
            'created_at': self.created_at.isoformat()
        }