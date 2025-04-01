from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User 
from ..models.quiz import Quiz, Question, QuestionOption
from ..models.progress import UserProgress, Achievement, UserAchievement
# from ..models.flashcard import FlashcardSet
from .. import db

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

        quiz_obj["questions"] = [{"question_text":question.question_text, "correct_answer": question.correct_answer} for question in questions]
        result.append(quiz_obj)
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
    
    feedback = "Great job!" if percentage >= 80 else "Keep practicing!"
    
    return jsonify({
        'score': (quiz.points * percentage) / 100,
        'total': total_questions,
        'percentage': percentage,
        'feedback': feedback
    })


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

# @api_bp.route('/flashcard-sets', methods=['POST'])
# @jwt_required()
# def add_flashcard_set():
#     current_user_id = get_jwt_identity()
#     user = User.query.get(current_user_id)
#     data = request.get_json()

#     if user.role != 'educator':
#         return "Not allowed", 400
    
#     flashcard_set = FlashcardSet(title=data['title'], description=data['description'], category=data['category'], is_public=data['is_public'])
#     db.session.add(flashcard_set)
#     db.session.commit()

#     return "Flashcard Set created successfully", 200

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

    return "Quiz created successfully", 200



@api_bp.route('/user-info', methods=['GET'])
@jwt_required()
def get_user_info():
    current_user_id = get_jwt_identity()


    user = User.query.get(current_user_id)

    if user is None:
        return jsonify({"msg": "User not found"}), 404

    user_info = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role
    }

    return jsonify(user_info), 200

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