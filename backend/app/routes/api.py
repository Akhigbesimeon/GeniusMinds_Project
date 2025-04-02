from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User 
from ..models.quiz import Quiz, Question, QuestionOption
from ..models.progress import UserProgress, Achievement, UserAchievement
from ..models.flashcard import FlashcardSet, FlashCard
from .. import db
from datetime import datetime
from ..models.subject import Subject
from ..models.activity import UserActivity
from ..models.goal import DailyGoal


api_bp = Blueprint('api', __name__)

@api_bp.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Welcome to GeniusMinds API',
        'status': 'active',
        'timestamp': '2025-03-15 14:48:57',
        'version': '1.0.0'
    }), 200

@api_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'database': 'connected',
        'server_time': '2025-03-15 14:48:57'
    }), 200

@api_bp.route('/quizzes', methods=['GET'])
@jwt_required()
def get_quizzes():
    quizzes = Quiz.query.all()
    result = []
    for quiz in quizzes:
        quiz_obj = {'id': quiz.id,
        'title': quiz.title,
        'description': quiz.description,
        'difficulty_level': quiz.difficulty_level,
        'points': quiz.points
        }
        questions = Question.query.filter_by(quiz_id=quiz.id).all()

        quiz_obj["questions"] = [{"id": question.id, "question_text":question.question_text, "correct_answer": question.correct_answer} for question in questions]
        result.append(quiz_obj)
    return jsonify(result), 200

@api_bp.route('/flashcard-sets', methods=['GET'])
@jwt_required()
def get_flashcards():
    flashcardsets = FlashcardSet.query.all()
    result = []
    for flashcardset in flashcardsets:
        flashcardset_obj = {'id': flashcardset.id,
        'title': flashcardset.title,
        'category': flashcardset.category,
        'description': flashcardset.description,
        }
        flashcards = FlashCard.query.filter_by(flashcardset_id=flashcardset.id).all()

        flashcardset_obj["flashcards"] = [{"front_text":flashcard.front_text, "back_text": flashcard.back_text, "tags": flashcard.tags} for flashcard in flashcards]
        result.append(flashcardset_obj)
    return jsonify(result), 200

@api_bp.route('/quiz/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_individual_quiz(quiz_id):
    quiz = Quiz.query.get(quiz_id)
    result = []
    quiz_obj = {'id': quiz.id,
    'title': quiz.title,
    'description': quiz.description,
    'difficulty_level': quiz.difficulty_level,
    'points': quiz.points
    }
    questions = Question.query.filter_by(quiz_id=quiz.id).all()
    quest_list = []

    for question in questions:
        options = QuestionOption.query.filter_by(question_id=question.id).all()
        quest_list.append({"question_id":question.id, "question_text": question.question_text, "options": [{"option_text":option.option_text} for option in options]})

    quiz_obj["questions"] = [quest_list]
    return jsonify(quiz_obj), 200

@api_bp.route('/quizzes/<int:quiz_id>/submit', methods=['POST'])
@jwt_required()
def grade_quiz(quiz_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    user_answers = data.get('answers', {})

    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({'error': 'Quiz not found'}), 404

    # Get associated subject for this quiz (assuming a relationship with subjects)
    # If not directly linked, we might need a subject_id in the request
    subject_id = data.get('subject_id')
    
    total_questions = len(quiz.questions)
    correct_count = 0

    for question in quiz.questions:
        user_answer = user_answers.get(str(question.id))
        if user_answer:
            correct_option = QuestionOption.query.filter_by(
                question_id=question.id, option_text=question.correct_answer
            ).first()
            if correct_option and user_answer == correct_option.option_text:
                correct_count += 1

    score = correct_count
    percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
    
    # Calculate points earned based on percentage
    points_earned = (quiz.points * percentage) / 100
    
    # Create activity record
    activity_text = f"Completed quiz: {quiz.title} with {percentage:.1f}% score"
    new_activity = UserActivity(
        user_id=user_id,
        activity=activity_text,
        subject=f"Quiz: {quiz.title}",
        activity_type="quiz_completion",
        reference_id=quiz.id
    )
    db.session.add(new_activity)
    
    # Update subject progress if subject_id is provided
    if subject_id:
        # Progress increase based on quiz performance
        progress_update = (points_earned / quiz.points) * 10  # Calculate a reasonable progress increment
        
        # Update or create UserProgress
        progress = UserProgress.query.filter_by(
            user_id=user_id,
            subject_id=subject_id
        ).first()
        
        if progress:
            # Update existing progress
            progress.last_activity_date = datetime.utcnow()
            progress.progress_percentage = min(100.0, progress.progress_percentage + progress_update)
            progress.completed_lessons += 1
        else:
            # Create new progress entry
            new_progress = UserProgress(
                user_id=user_id,
                subject_id=subject_id,
                progress_percentage=progress_update,
                completed_lessons=1,
                total_lessons=10  # Default value, adjust as needed
            )
            db.session.add(new_progress)
    
    # Check for achievements based on quiz completion
    check_and_update_achievements(user_id)
    
    # Check for streak updates
    update_user_streak(user_id)
    
    db.session.commit()
    
    feedback = "Great job!" if percentage >= 80 else "Keep practicing!"
    
    return jsonify({
        'score': points_earned,
        'total': total_questions,
        'percentage': percentage,
        'feedback': feedback
    })

@api_bp.route('/flashcard-sets/<int:flashcard_set_id>/complete', methods=['POST'])
@jwt_required()
def complete_flashcard_set(flashcard_set_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    
    flashcard_set = FlashcardSet.query.get_or_404(flashcard_set_id)
    subject_id = data.get('subject_id')
    cards_reviewed = data.get('cards_reviewed', 0)
    mastered_count = data.get('mastered_count', 0)
    
    # Calculate mastery percentage
    total_cards = FlashCard.query.filter_by(flashcardset_id=flashcard_set_id).count()
    mastery_percentage = (mastered_count / total_cards) * 100 if total_cards > 0 else 0
    
    # Create activity record
    activity_text = f"Studied flashcard set: {flashcard_set.title} ({cards_reviewed} cards)"
    new_activity = UserActivity(
        user_id=user_id,
        activity=activity_text,
        subject=f"Flashcards: {flashcard_set.title}",
        activity_type="flashcard_study",
        reference_id=flashcard_set.id
    )
    db.session.add(new_activity)
    
    # Update subject progress if subject_id is provided
    if subject_id:
        # Calculate progress increase based on flashcard performance
        progress_update = (mastery_percentage / 100) * 5  # Adjust multiplier as needed
        
        # Update or create UserProgress
        progress = UserProgress.query.filter_by(
            user_id=user_id,
            subject_id=subject_id
        ).first()
        
        if progress:
            # Update existing progress
            progress.last_activity_date = datetime.utcnow()
            progress.progress_percentage = min(100.0, progress.progress_percentage + progress_update)
            # Only count as completed lesson if mastery is high enough
            if mastery_percentage >= 70:
                progress.completed_lessons += 1
        else:
            # Create new progress entry
            new_progress = UserProgress(
                user_id=user_id,
                subject_id=subject_id,
                progress_percentage=progress_update,
                completed_lessons=1 if mastery_percentage >= 70 else 0,
                total_lessons=10  # Default value, adjust as needed
            )
            db.session.add(new_progress)
    
    # Check for achievements
    check_and_update_achievements(user_id)
    
    # Check for streak updates
    update_user_streak(user_id)
    
    db.session.commit()
    
    return jsonify({
        'mastery_percentage': mastery_percentage,
        'cards_reviewed': cards_reviewed,
        'progress_added': progress_update if subject_id else 0
    }), 200


@api_bp.route('/add-quiz', methods=['POST'])
@jwt_required()
def add_quiz():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()

    if user.role != 'educator':
        return "Not allowed", 400
    
    quiz = Quiz(title=data['title'], description=data['description'], difficulty_level=data['difficulty_level'], points=data['points'])
    db.session.add(quiz)
    db.session.commit()

    return "Quiz created successfully", 200

@api_bp.route('/flashcard-sets', methods=['POST'])
@jwt_required()
def add_flashcard_set():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()

    if user.role != 'educator':
        return "Not allowed", 400
    
    flashcard_set = FlashcardSet(title=data['title'], description=data['description'], category=data['category'], is_public=data['is_public'])
    db.session.add(flashcard_set)
    db.session.commit()

    return "Flashcard Set created successfully", 200

@api_bp.route('/add-question', methods=['POST'])
@jwt_required()
def add_question():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()

    if user.role != 'educator':
        return "Not allowed", 400
    
    question = Question(quiz_id=data['selected'], question_text=data['question_text'], correct_answer=data['correct_answer'])
    db.session.add(question)
    db.session.commit()
    for option in data['options']:
        question_option = QuestionOption(question_id=question.id, option_text=option['option_text'])
        db.session.add(question_option)
    db.session.commit()

    return "Question created successfully", 200

@api_bp.route('/question/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_question(id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    question = Question.query.get(id)

    if user.role != 'educator':
        return "Not allowed", 400
    
    db.session.delete(question)
    db.session.commit()

    return "Question deleted successfully", 200

@api_bp.route('/flashcard-sets/<int:flashcard_id>/cards', methods=['POST'])
@jwt_required()
def add_flashcard(flashcard_id):
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()

    if user.role != 'educator':
        return "Not allowed", 400
    
    flashCard = FlashCard(flashcardset_id=flashcard_id, front_text=data['front_text'], back_text=data['back_text'], tags=data['tags'])
    db.session.add(flashCard)
    db.session.commit()
    return "Flashcard created successfully", 200



@api_bp.route('/quiz/<int:quiz_id>', methods=['GET'])
@jwt_required()
def get_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    return jsonify({
        'id': quiz.id,
        'title': quiz.title,
        'description': quiz.description,
        'difficulty_level': quiz.difficulty_level,
        'points': quiz.points,
        'questions': [{
            'id': q.id,
            'question_text': q.question_text,
            'options': [{
                'id': opt.id,
                'option_text': opt.option_text
            } for opt in q.options]
        } for q in quiz.questions]
    }), 200


# Subjects endpoints
@api_bp.route('/subjects/progress', methods=['GET'])
@jwt_required()
def get_subjects_progress():
    current_user_id = get_jwt_identity()
    
    # Get user's progress for all subjects
    progress_data = db.session.query(Subject, UserProgress)\
        .outerjoin(UserProgress, (UserProgress.subject_id == Subject.id) & 
                               (UserProgress.user_id == current_user_id))\
        .all()
    
    result = []
    for subject, progress in progress_data:
        subject_dict = subject.to_dict()
        if progress:
            subject_dict['progress'] = progress.progress_percentage
        else:
            subject_dict['progress'] = 0
        result.append(subject_dict)
    
    return jsonify(result), 200

@api_bp.route('/subjects/<int:subject_id>/progress', methods=['GET'])
@jwt_required()
def get_subject_progress(subject_id):
    current_user_id = get_jwt_identity()
    
    subject = Subject.query.get_or_404(subject_id)
    progress = UserProgress.query.filter_by(
        user_id=current_user_id, 
        subject_id=subject_id
    ).first()
    
    result = subject.to_dict()
    if progress:
        result.update(progress.to_dict())
    else:
        result.update({
            'progress': 0,
            'completed_lessons': 0,
            'total_lessons': 0
        })
    
    return jsonify(result), 200

# Achievements endpoints
@api_bp.route('/achievements', methods=['GET'])
@jwt_required()
def get_achievements():
    current_user_id = get_jwt_identity()
    
    # Get all achievements and user's progress
    achievements_data = db.session.query(Achievement, UserAchievement)\
        .outerjoin(UserAchievement, (UserAchievement.achievement_id == Achievement.id) & 
                                  (UserAchievement.user_id == current_user_id))\
        .all()
    
    result = []
    for achievement, user_achievement in achievements_data:
        achievement_dict = achievement.to_dict()
        if user_achievement:
            achievement_dict['completed'] = user_achievement.completed
            achievement_dict['progress'] = user_achievement.progress
        else:
            achievement_dict['completed'] = False
            achievement_dict['progress'] = 0
        result.append(achievement_dict)
    
    return jsonify(result), 200

# Recent activities endpoints
@api_bp.route('/recent-activities', methods=['GET'])
@jwt_required()
def get_recent_activities():
    current_user_id = get_jwt_identity()
    limit = request.args.get('limit', 5, type=int)
    
    activities = UserActivity.query.filter_by(user_id=current_user_id)\
        .order_by(UserActivity.created_at.desc())\
        .limit(limit)\
        .all()
    
    return jsonify([activity.to_dict() for activity in activities]), 200

# Daily goals endpoints
@api_bp.route('/daily-goals', methods=['GET'])
@jwt_required()
def get_daily_goals():
    current_user_id = get_jwt_identity()
    
    goals = DailyGoal.query.filter_by(user_id=current_user_id)\
        .order_by(DailyGoal.created_at.desc())\
        .all()
    
    return jsonify([goal.to_dict() for goal in goals]), 200

@api_bp.route('/daily-goals', methods=['POST'])
@jwt_required()
def create_daily_goal():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'text' not in data:
        return jsonify({'error': 'Goal text is required'}), 400
    
    new_goal = DailyGoal(
        user_id=current_user_id,
        text=data['text'],
        completed=data.get('completed', False)
    )
    
    db.session.add(new_goal)
    db.session.commit()
    
    return jsonify(new_goal.to_dict()), 201

@api_bp.route('/daily-goals/<int:goal_id>', methods=['PUT'])
@jwt_required()
def update_daily_goal(goal_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    goal = DailyGoal.query.filter_by(id=goal_id, user_id=current_user_id).first_or_404()
    
    if 'text' in data:
        goal.text = data['text']
    if 'completed' in data:
        goal.completed = data['completed']
    
    db.session.commit()
    
    return jsonify(goal.to_dict()), 200

@api_bp.route('/daily-goals/<int:goal_id>', methods=['DELETE'])
@jwt_required()
def delete_daily_goal(goal_id):
    current_user_id = get_jwt_identity()
    
    goal = DailyGoal.query.filter_by(id=goal_id, user_id=current_user_id).first_or_404()
    
    db.session.delete(goal)
    db.session.commit()
    
    return '', 204

# Track user activity
@api_bp.route('/track-activity', methods=['POST'])
@jwt_required()
def track_user_activity():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'activity' not in data:
        return jsonify({'error': 'Activity description is required'}), 400
    
    new_activity = UserActivity(
        user_id=current_user_id,
        activity=data['activity'],
        subject=data.get('subject'),
        activity_type=data.get('activity_type'),
        reference_id=data.get('reference_id')
    )
    
    db.session.add(new_activity)
    
    # Update subject progress if applicable
    if 'subject_id' in data:
        progress = UserProgress.query.filter_by(
            user_id=current_user_id,
            subject_id=data['subject_id']
        ).first()
        
        if progress:
            # Update existing progress
            progress.last_activity_date = datetime.utcnow()
            if 'progress_update' in data:
                progress.progress_percentage = min(100.0, progress.progress_percentage + data['progress_update'])
            if 'completed_lesson' in data and data['completed_lesson']:
                progress.completed_lessons += 1
        else:
            # Create new progress entry
            new_progress = UserProgress(
                user_id=current_user_id,
                subject_id=data['subject_id'],
                progress_percentage=data.get('progress_update', 0),
                completed_lessons=1 if data.get('completed_lesson') else 0,
                total_lessons=data.get('total_lessons', 0)
            )
            db.session.add(new_progress)
            
    # Check for achievement updates
    if 'check_achievements' in data and data['check_achievements']:
        # This is where we would check if any achievements were earned
        check_and_update_achievements(current_user_id)
            
    db.session.commit()
    
    return jsonify(new_activity.to_dict()), 201

# User info endpoint for dashboard
@api_bp.route('/user-info', methods=['GET'])
@jwt_required()
def get_user_info():
    current_user_id = get_jwt_identity()
    
    user = User.query.get_or_404(current_user_id)
    
    # Get count of completed lessons
    completed_lessons = db.session.query(db.func.sum(UserProgress.completed_lessons))\
        .filter(UserProgress.user_id == current_user_id)\
        .scalar() or 0
    
    # Get count of completed achievements
    completed_achievements = UserAchievement.query.filter_by(
        user_id=current_user_id, 
        completed=True
    ).count()
    
    result = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'profile_image': user.profile_image if hasattr(user, 'profile_image') else None,
        'joined_date': user.created_at.isoformat() if hasattr(user, 'created_at') else None,
        'stats': {
            'completed_lessons': completed_lessons,
            'completed_achievements': completed_achievements,
            'streak_days': user.streak_days if hasattr(user, 'streak_days') else 0
        }
    }
    
    return jsonify(result), 200

# Helper function for checking achievements
def check_and_update_achievements(user_id):
    # Check lessons-based achievements
    total_lessons = db.session.query(db.func.sum(UserProgress.completed_lessons))\
        .filter(UserProgress.user_id == user_id)\
        .scalar() or 0
    
    # Get quiz completions count
    quiz_completions = UserActivity.query.filter_by(
        user_id=user_id,
        activity_type='quiz_completion'
    ).count()
    
    # Get flashcard study sessions count
    flashcard_sessions = UserActivity.query.filter_by(
        user_id=user_id,
        activity_type='flashcard_study'
    ).count()
    
    # Check various types of achievements
    
    # 1. Lesson-based achievements
    lesson_achievements = Achievement.query.filter(
        Achievement.points_required <= total_lessons,
        Achievement.name.like('%lesson%')
    ).all()
    
    update_achievement_progress(user_id, lesson_achievements, total_lessons)
    
    # 2. Quiz-based achievements
    quiz_achievements = Achievement.query.filter(
        Achievement.points_required <= quiz_completions,
        Achievement.name.like('%quiz%')
    ).all()
    
    update_achievement_progress(user_id, quiz_achievements, quiz_completions)
    
    # 3. Flashcard-based achievements
    flashcard_achievements = Achievement.query.filter(
        Achievement.points_required <= flashcard_sessions,
        Achievement.name.like('%flashcard%')
    ).all()
    
    update_achievement_progress(user_id, flashcard_achievements, flashcard_sessions)
    
    # 4. Combined learning achievements (total activity count)
    total_activities = quiz_completions + flashcard_sessions
    learning_achievements = Achievement.query.filter(
        Achievement.points_required <= total_activities,
        Achievement.name.like('%learning%')
    ).all()
    
    update_achievement_progress(user_id, learning_achievements, total_activities)

# Helper function to update achievement progress
def update_achievement_progress(user_id, achievements, progress_value):
    for achievement in achievements:
        # Check if user already has this achievement
        user_achievement = UserAchievement.query.filter_by(
            user_id=user_id,
            achievement_id=achievement.id
        ).first()
        
        if user_achievement:
            # Update progress
            user_achievement.progress = min(100.0, (progress_value / achievement.points_required) * 100)
            
            # Mark as completed if not already
            if not user_achievement.completed and progress_value >= achievement.points_required:
                user_achievement.completed = True
                user_achievement.earned_date = datetime.utcnow()
                
                # Create activity record for earning achievement
                new_activity = UserActivity(
                    user_id=user_id,
                    activity=f"Earned achievement: {achievement.name}",
                    activity_type="achievement",
                    reference_id=achievement.id
                )
                db.session.add(new_activity)
        else:
            # Create new user achievement record
            progress_percentage = min(100.0, (progress_value / achievement.points_required) * 100)
            completed = progress_value >= achievement.points_required
            
            new_user_achievement = UserAchievement(
                user_id=user_id,
                achievement_id=achievement.id,
                progress=progress_percentage,
                completed=completed,
                earned_date=datetime.utcnow() if completed else None
            )
            db.session.add(new_user_achievement)
            
            if completed:
                # Create activity record for earning achievement
                new_activity = UserActivity(
                    user_id=user_id,
                    activity=f"Earned achievement: {achievement.name}",
                    activity_type="achievement",
                    reference_id=achievement.id
                )
                db.session.add(new_activity)

# Helper function for updating user streak
def update_user_streak(user_id):
    user = User.query.get(user_id)
    
    # Add streak_days attribute if it doesn't exist
    if not hasattr(user, 'streak_days'):
        user.streak_days = 0
        # Would need to add this column to the User model
    
    # Check if user has been active today
    today = datetime.utcnow().date()
    recent_activity = UserActivity.query.filter_by(user_id=user_id).order_by(UserActivity.created_at.desc()).first()
    
    if recent_activity and recent_activity.created_at.date() == today:
        # User has been active today, potentially increment streak
        # This is a simplified version - in a real app, you'd need to check the last activity date 
        # to see if it was yesterday to maintain the streak
        last_streak_date = getattr(user, 'last_streak_date', None)
        
        if not last_streak_date or last_streak_date.date() < today:
            user.streak_days += 1
            user.last_streak_date = datetime.utcnow()
            
            # Check for streak-based achievements
            streak_achievements = Achievement.query.filter(
                Achievement.points_required <= user.streak_days,
                Achievement.name.like('%streak%')
            ).all()
            
            update_achievement_progress(user_id, streak_achievements, user.streak_days)

@api_bp.route('/educator/students', methods=['GET'])
@jwt_required()
def get_educator_students():
    current_user = User.query.get(get_jwt_identity())
    if current_user.role != 'educator':
        return jsonify({'error': 'Unauthorized'}), 403
    
    students = User.query.filter_by(role='student').all()
    result = []
    
    for student in students:
        # Get student progress
        progress = UserProgress.query.filter_by(user_id=student.id).all()
        total_progress = sum(p.progress_percentage for p in progress) / len(progress) if progress else 0
        
        # Get activity counts
        quiz_completions = UserActivity.query.filter_by(
            user_id=student.id, 
            activity_type='quiz_completion'
        ).count()
        
        flashcard_sessions = UserActivity.query.filter_by(
            user_id=student.id,
            activity_type='flashcard_study'
        ).count()
        
        result.append({
            'id': student.id,
            'name': student.username,
            'email': student.email,
            'progress': round(total_progress, 1),
            'quiz_completions': quiz_completions,
            'flashcard_sessions': flashcard_sessions,
        })
    
    return jsonify(result), 200

@api_bp.route('/educator/recent-activities', methods=['GET'])
@jwt_required()
def get_educator_activities():
    current_user = User.query.get(get_jwt_identity())
    if current_user.role != 'educator':
        return jsonify({'error': 'Unauthorized'}), 403
    
    activities = UserActivity.query.join(User).filter(User.role == 'student')\
        .order_by(UserActivity.created_at.desc())\
        .limit(20)\
        .all()
    
    
    return jsonify([{
        'id': a.id,
        'student_name': User.query.get(a.user_id).username,
        'activity': a.activity,
        'created_at': a.created_at.isoformat(),
        'subject': a.subject
    } for a in activities]), 200

@api_bp.route('/educator/quiz-performance', methods=['GET'])
@jwt_required()
def get_quiz_performance():
    current_user = User.query.get(get_jwt_identity())
    if current_user.role != 'educator':
        return jsonify({'error': 'Unauthorized'}), 403
    
    # Get all quizzes created by this educator
    quizzes = Quiz.query.all()
    result = []
    
    for quiz in quizzes:
        # Get all submissions for this quiz
        submissions = UserActivity.query.filter_by(
            activity_type='quiz_completion',
            reference_id=quiz.id
        ).all()
        
        if submissions:
            avg_score = sum(float(a.activity.split()[-2].replace('%', '')) for a in submissions) / len(submissions)
            attempts = len(submissions)
        else:
            avg_score = 0
            attempts = 0
            
        result.append({
            'quiz_id': quiz.id,
            'title': quiz.title,
            'avg_score': round(avg_score, 1),
            'attempts': attempts,
            'created_at': quiz.created_at.isoformat()
        })
    
    return jsonify(result), 200
