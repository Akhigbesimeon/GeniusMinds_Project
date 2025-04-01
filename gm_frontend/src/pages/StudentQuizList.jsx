import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/SideBar';
import { TopBar } from '../components/TopBar';

export const StudentQuizList = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/quizzes`, { headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }});
                setQuizzes(response.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load quizzes. Please try again later.');
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const handleStartQuiz = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };

    if (loading) return <div className="text-center p-6">Loading quizzes...</div>;
    if (error) return <div className="text-red-500 p-6">{error}</div>;

    return (
    <div className="flex h-screen bg-gray-50">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        
              {/* Main Content */}
    <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Available Quizzes</h1>
            
            {quizzes.length === 0 ? (
                <p>No quizzes available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <div 
                            key={quiz.id} 
                            className="border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
                        >
                            <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                            <p className="text-gray-600 mb-4">{quiz.description}</p>
                            <div className="flex justify-between mb-4">
                                <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                                    {quiz.difficulty_level}
                                </span>
                                <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">
                                    {quiz.points} points
                                </span>
                            </div>
                            <button
                                onClick={() => handleStartQuiz(quiz.id)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                            >
                                Start Quiz
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        </div>
        </div>
    );
};

export const StudentQuizPage = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const [quizResults, setQuizResults] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false)


    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/quiz/${quizId}`, { headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                }});
                console.log(response.data)
                setQuiz(response.data);
                // Initialize selectedAnswers with empty values for each question
                const initialAnswers = {};
                response.data.questions.forEach(question => {
                    initialAnswers[question.id] = '';
                });
                setSelectedAnswers(initialAnswers);
                setLoading(false);
            } catch (err) {
                setError('Failed to load quiz. Please try again later.');
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleOptionSelect = (questionId, optionText) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: optionText
        });
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}/submit`, {
                answers: selectedAnswers
            }, { headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            }});
            setQuizResults(response.data);
            setQuizSubmitted(true);
        } catch (err) {
            setError('Failed to submit quiz. Please try again.');
        }
    };

    const handleReturnToQuizzes = () => {
        navigate('/quizzes');
    };

    if (loading) return <div className="text-center p-6">Loading quiz...</div>;
    if (error) return <div className="text-red-500 p-6">{error}</div>;
    if (!quiz) return <div className="text-center p-6">Quiz not found.</div>;

    if (quizSubmitted && quizResults) {
        return (
            <div className="flex h-screen bg-gray-50">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            
                  {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top Navigation */}
            <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                    
    
            <div className="container mx-auto p-6 max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">{quiz.title}</h2>
                    <div className="mb-4">
                        <p className="text-lg font-medium">Your Score: <span className="text-blue-600">{quizResults.score} / {quiz.points}</span></p>
                        <p className="text-lg font-medium">Percentage: <span className="text-blue-600">{quizResults.percentage}%</span></p>
                    </div>
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Feedback:</h3>
                        <p>{quizResults.feedback || "No feedback available."}</p>
                    </div>
                    <button
                        onClick={handleReturnToQuizzes}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
                    >
                        Return to Quizzes
                    </button>
                </div>
            </div>
            </div>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex][0];

    return (
        <div className="flex h-screen bg-gray-50">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        
              {/* Main Content */}
    <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
                

        <div className="container mx-auto p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between mb-4">
                    <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                        {quiz.difficulty_level}
                    </span>
                    <span className="text-sm bg-green-100 text-green-800 py-1 px-2 rounded">
                        {quiz.points} points
                    </span>
                </div>
                <div className="mb-4">
                    <p className="text-gray-600">{quiz.description}</p>
                </div>
                <div className="mb-4">
                    <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-4">{currentQuestion.question_text}</h2>
                    <div className="space-y-3">
                        {currentQuestion?.options?.map((option, idx) => (
                            <div 
                                key={idx}
                                className={`p-3 border rounded-md cursor-pointer ${
                                    selectedAnswers[currentQuestion.question_id] === option.option_text
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'hover:bg-gray-50'
                                }`}
                                onClick={() => handleOptionSelect(currentQuestion.question_id, option.option_text)}
                            >
                                {option.option_text}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className={`px-4 py-2 rounded-md ${
                            currentQuestionIndex === 0
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        Previous
                    </button>
                    {currentQuestionIndex < quiz.questions.length - 1 ? (
                        <button
                            onClick={handleNextQuestion}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmitQuiz}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                        >
                            Submit Quiz
                        </button>
                    )}
                </div>
            </div>
        </div>
        </div>
        </div>
    );
};