from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.quiz import Quiz, Question, QuestionOption
from ..models.progress import UserProgress, Achievement, UserAchievement
from .. import db

api_bp = Blueprint('api', __name__)

@api_bp.route('/quizzes', methods=['GET'])
@jwt_required()
def get_quizzes():
    quizzes = Quiz.query.all()
    return jsonify([{
        'id': quiz.id,
        'title': quiz.title,
        'description': quiz.description,
        'difficulty_level': quiz.difficulty_level,
        'points': quiz.points
    } for quiz in quizzes]), 200

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