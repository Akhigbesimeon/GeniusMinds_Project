import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight, 
  Clock,
  CheckCircle,
  XCircle,
  Flag,
  Menu,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/SideBar';

const QuizPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);

  // Mock quiz data
  const quizData = {
    title: "Math Quiz: Addition & Subtraction",
    subject: "Math",
    totalQuestions: 10,
    timeLimit: 15, // in minutes
    questions: [
      {
        id: 1,
        question: "What is 24 + 18?",
        options: ["40", "42", "44", "46"],
        correctAnswer: 1, // Index of the correct answer
        explanation: "24 + 18 = 42 because 24 + 10 = 34, and 34 + 8 = 42"
      },
      {
        id: 2,
        question: "If you have 35 toys and give away 17, how many do you have left?",
        options: ["15", "17", "18", "22"],
        correctAnswer: 2, // Index of the correct answer
        explanation: "35 - 17 = 18 because 35 - 10 = 25, and 25 - 7 = 18"
      },
      {
        id: 3,
        question: "What is the sum of 125 + 275?",
        options: ["300", "350", "400", "425"],
        correctAnswer: 2, // Index of the correct answer
        explanation: "125 + 275 = 400 because 100 + 200 = 300, and 25 + 75 = 100, so 300 + 100 = 400"
      },
      {
        id: 4,
        question: "Calculate 56 - 29.",
        options: ["25", "26", "27", "28"],
        correctAnswer: 2, // Index of the correct answer
        explanation: "56 - 29 = 27 because 56 - 30 = 26, and 26 + 1 = 27"
      },
      {
        id: 5,
        question: "What is 84 + 67?",
        options: ["141", "151", "161", "171"],
        correctAnswer: 1, // Index of the correct answer
        explanation: "84 + 67 = 151 because 80 + 60 = 140, and 4 + 7 = 11, so 140 + 11 = 151"
      },
    ]
  };

  const currentQuestionData = quizData.questions[currentQuestion];
  
  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };
  
  const handleSelectAnswer = (index) => {
    setSelectedAnswer(index);
  };
  
  const handleCheckAnswer = () => {
    setShowFeedback(true);
  };
  
  const handleFlagQuestion = () => {
    if (flaggedQuestions.includes(currentQuestion)) {
      setFlaggedQuestions(flaggedQuestions.filter(q => q !== currentQuestion));
    } else {
      setFlaggedQuestions([...flaggedQuestions, currentQuestion]);
    }
  };
  
  // Progress calculation
  const progress = ((currentQuestion + 1) / quizData.questions.length) * 100;
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {/* {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:w-20 lg:overflow-y-auto ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center lg:justify-center lg:w-full">
            <BookOpen className="text-indigo-600 h-8 w-8" />
            <span className="ml-2 text-xl font-bold text-indigo-600 lg:hidden">GeniusMinds</span>
          </div>
          <button 
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="px-3 space-y-1 mt-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
                  item.current
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                } lg:justify-center`}
              >
                <item.icon
                  className={`h-6 w-6 ${
                    item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'
                  }`}
                />
                <span className="ml-3 lg:hidden">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
       */}
       <Sidebar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-20">
        {/* Top Navigation */}
        <nav className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-4 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div className="flex items-center ml-4">
                <h1 className="text-lg font-bold text-gray-800">{quizData.title}</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{quizData.timeLimit} min</span>
              </div>
              
              <div className="flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">{currentQuestion + 1} / {quizData.questions.length}</span>
              </div>
              
              <Link to="/dashboard" className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </nav>
        
        {/* Progress bar */}
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }}></div>
        </div>
        
        {/* Quiz Content */}
        <div className="flex-1 overflow-auto pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">Question {currentQuestion + 1}</h2>
                <button 
                  onClick={handleFlagQuestion}
                  className={`p-2 rounded-full ${flaggedQuestions.includes(currentQuestion) ? 'text-amber-500' : 'text-gray-400 hover:text-amber-500'}`}
                >
                  <Flag className="h-5 w-5" />
                </button>
              </div>
              
              <p className="text-lg text-gray-800 mb-6">{currentQuestionData.question}</p>
              
              <div className="space-y-3 mb-8">
                {currentQuestionData.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      selectedAnswer === index 
                        ? 'border-indigo-500 bg-indigo-50' 
                        : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                    } ${
                      showFeedback && index === currentQuestionData.correctAnswer
                        ? 'bg-green-50 border-green-500'
                        : showFeedback && selectedAnswer === index
                          ? 'bg-red-50 border-red-500'
                          : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`flex items-center justify-center h-6 w-6 rounded-full mr-3 ${
                        selectedAnswer === index 
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 text-gray-700'
                      } ${
                        showFeedback && index === currentQuestionData.correctAnswer
                          ? 'bg-green-500 text-white'
                          : showFeedback && selectedAnswer === index
                            ? 'bg-red-500 text-white'
                            : ''
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-gray-800">{option}</span>
                      
                      {showFeedback && index === currentQuestionData.correctAnswer && (
                        <CheckCircle className="ml-auto h-5 w-5 text-green-500" />
                      )}
                      
                      {showFeedback && selectedAnswer === index && selectedAnswer !== currentQuestionData.correctAnswer && (
                        <XCircle className="ml-auto h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {showFeedback && (
                <div className={`p-4 rounded-lg ${
                  selectedAnswer === currentQuestionData.correctAnswer 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <h3 className={`font-medium ${
                    selectedAnswer === currentQuestionData.correctAnswer
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}>
                    {selectedAnswer === currentQuestionData.correctAnswer 
                      ? 'Correct!' 
                      : 'Not quite right.'}
                  </h3>
                  <p className="mt-1 text-gray-700">{currentQuestionData.explanation}</p>
                </div>
              )}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center px-4 py-2 rounded-lg font-medium ${
                  currentQuestion === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Previous
              </button>
              
              {selectedAnswer !== null && !showFeedback ? (
                <button
                  onClick={handleCheckAnswer}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
                >
                  Check Answer
                </button>
              ) : showFeedback ? (
                <button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === quizData.questions.length - 1}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium ${
                    currentQuestion === quizData.questions.length - 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  Next
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
        
        {/* Question navigator */}
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 py-4 px-4 lg:ml-20">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Question Navigator</h3>
              <span className="text-sm text-gray-500">{flaggedQuestions.length} flagged</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {quizData.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentQuestion(index);
                    setSelectedAnswer(null);
                    setShowFeedback(false);
                  }}
                  className={`h-8 w-8 flex items-center justify-center rounded-full font-medium text-sm
                    ${currentQuestion === index 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:border-indigo-300'}
                    ${flaggedQuestions.includes(index) ? 'ring-2 ring-amber-500 ring-offset-1' : ''}
                  `}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
