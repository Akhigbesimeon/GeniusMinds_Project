import { 
    BookOpen, 
    Brain, 
    Award, 
    Plus,
    Edit,
    Trash,
    FileQuestion,
    Search,
    Check,
    X,
    ChevronDown,
    ChevronRight,
    Clock,
    Star,
    Filter
  } from 'lucide-react';
  import React from 'react';
  import Sidebar from '../components/SideBar';
  import { useState, useEffect } from 'react';
  import axios from 'axios';
  
  const QuizManagementPage = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [quizzes, setQuizzes] = useState([]);
    const [showAddQuizModal, setShowAddQuizModal] = useState(false);
    const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [expandedQuiz, setExpandedQuiz] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [difficultyFilter, setDifficultyFilter] = useState('all');
    
    // Form states
    const [newQuiz, setNewQuiz] = useState({
      title: '',
      description: '',
      difficulty_level: 'medium',
      points: 10
    });
    
    const [newQuestion, setNewQuestion] = useState({
      question_text: '',
      correct_answer: '',
      options: [
        { option_text: '' },
        { option_text: '' },
        { option_text: '' },
        { option_text: '' }
      ]
    });
  
    useEffect(() => {
      // Fetch quizzes from API
      fetchQuizzes();
    }, []);
  
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/quizzes`, { 
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          }
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };
  
    const handleAddQuiz = async () => {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/add-quiz`, 
          newQuiz,
          { 
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            }
          }
        );
        setShowAddQuizModal(false);
        setNewQuiz({
          title: '',
          description: '',
          difficulty_level: 'medium',
          points: 10
        });
        fetchQuizzes();
      } catch (error) {
        console.error('Error adding quiz:', error);
      }
    };
  
    const handleAddQuestion = async () => {
      if (!selectedQuiz) return;
      newQuestion["selected"] = selectedQuiz.id;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/add-question`, 
          newQuestion,
          { 
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            }
          }
        );
        setShowAddQuestionModal(false);
        setNewQuestion({
          question_text: '',
          correct_answer: '',
          options: [
            { option_text: '' },
            { option_text: '' },
            { option_text: '' },
            { option_text: '' }
          ]
        });
        fetchQuizzes();
      } catch (error) {
        console.error('Error adding question:', error);
      }
    };
  
    const handleDeleteQuiz = async (quizId) => {
      if (window.confirm('Are you sure you want to delete this quiz?')) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}`, 
            { 
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              }
            }
          );
          fetchQuizzes();
        } catch (error) {
          console.error('Error deleting quiz:', error);
        }
      }
    };
  
    const handleDeleteQuestion = async (quizId, questionId) => {
      if (window.confirm('Are you sure you want to delete this question?')) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/api/quizzes/${quizId}/questions/${questionId}`, 
            { 
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              }
            }
          );
          fetchQuizzes();
        } catch (error) {
          console.error('Error deleting question:', error);
        }
      }
    };
  
    const handleUpdateOptionText = (index, value) => {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[index].option_text = value;
      setNewQuestion({
        ...newQuestion,
        options: updatedOptions
      });
    };
  
    const filteredQuizzes = quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = difficultyFilter === 'all' || quiz.difficulty_level === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  
    const getDifficultyColor = (difficulty) => {
      switch(difficulty) {
        case 'easy': return 'text-green-600 bg-green-100';
        case 'medium': return 'text-amber-600 bg-amber-100';
        case 'hard': return 'text-red-600 bg-red-100';
        default: return 'text-gray-600 bg-gray-100';
      }
    };
  
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Navigation */}
          <nav className="bg-white border-b border-gray-200 shadow-sm">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                  >
                    <FileQuestion className="h-6 w-6" />
                  </button>
                  <h1 className="ml-2 text-xl font-semibold text-gray-800">Quiz Management</h1>
                </div>
                
                <div className="flex items-center ml-4 lg:ml-0">
                  <div className="relative mx-4">
                    <input 
                      type="text" 
                      placeholder="Search quizzes..." 
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <button 
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:bg-indigo-700 transition-colors"
                    onClick={() => setShowAddQuizModal(true)}
                  >
                    <Plus className="h-5 w-5 mr-1" />
                    Add New Quiz
                  </button>
                </div>
              </div>
            </div>
          </nav>
          
          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center">
                <Filter className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700 font-medium mr-4">Difficulty:</span>
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    onClick={() => setDifficultyFilter('all')}
                  >
                    All
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyFilter === 'easy' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    onClick={() => setDifficultyFilter('easy')}
                  >
                    Easy
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyFilter === 'medium' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'}`}
                    onClick={() => setDifficultyFilter('medium')}
                  >
                    Medium
                  </button>
                  <button 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${difficultyFilter === 'hard' ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    onClick={() => setDifficultyFilter('hard')}
                  >
                    Hard
                  </button>
                </div>
              </div>
              
              {/* Quiz List */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Your Quizzes</h2>
                  <p className="text-gray-500 mt-1">Manage your quizzes and questions</p>
                </div>
                
                {filteredQuizzes.length === 0 ? (
                  <div className="p-8 text-center">
                    <FileQuestion className="h-16 w-16 text-gray-300 mx-auto" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No quizzes found</h3>
                    <p className="mt-1 text-gray-500">
                      {searchQuery ? "Try adjusting your search or filter" : "Create your first quiz by clicking the 'Add New Quiz' button"}
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {filteredQuizzes.map((quiz) => (
                      <li key={quiz.id} className="hover:bg-gray-50">
                        <div className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <button
                                onClick={() => setExpandedQuiz(expandedQuiz === quiz.id ? null : quiz.id)}
                                className="mr-2 p-1 rounded-full hover:bg-gray-200"
                              >
                                {expandedQuiz === quiz.id ? (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-gray-500" />
                                )}
                              </button>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">{quiz.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.difficulty_level)}`}>
                                {quiz.difficulty_level.charAt(0).toUpperCase() + quiz.difficulty_level.slice(1)}
                              </span>
                              <span className="text-gray-500 text-sm">
                                {quiz.questions ? quiz.questions.length : 0} questions
                              </span>
                              <span className="flex items-center text-amber-600">
                                <Star className="h-4 w-4 mr-1" />
                                {quiz.points} points
                              </span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => {
                                    setSelectedQuiz(quiz);
                                    setShowAddQuestionModal(true);
                                  }}
                                  className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                                  title="Add Question"
                                >
                                  <Plus className="h-5 w-5" />
                                </button>
                                <button
                                  className="p-2 text-amber-600 hover:bg-amber-50 rounded-full"
                                  title="Edit Quiz"
                                >
                                  <Edit className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuiz(quiz.id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                  title="Delete Quiz"
                                >
                                  <Trash className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Expanded View - Questions */}
                          {expandedQuiz === quiz.id && (
                            <div className="mt-4 pl-8">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Questions:</h4>
                              {quiz.questions && quiz.questions.length > 0 ? (
                                <ul className="space-y-3">
                                  {quiz.questions.map((question, index) => (
                                    <li key={question.id} className="bg-gray-50 p-3 rounded-lg">
                                      <div className="flex justify-between">
                                        <span className="font-medium">Q{index + 1}: {question.question_text}</span>
                                        <div className="flex space-x-1">
                                          <button
                                            className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                                            title="Edit Question"
                                          >
                                            <Edit className="h-4 w-4" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteQuestion(quiz.id, question.id)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                            title="Delete Question"
                                          >
                                            <Trash className="h-4 w-4" />
                                          </button>
                                        </div>
                                      </div>
                                      <div className="mt-2 text-sm">
                                        <span className="text-gray-500">Answer: </span>
                                        <span className="text-green-600">{question.correct_answer}</span>
                                      </div>
                                      {question.options && (
                                        <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm">
                                          {question.options.map((option) => (
                                            <div key={option.id} className="flex items-center">
                                              <div className={`w-4 h-4 rounded-full mr-2 ${option.option_text === question.correct_answer ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                              <span>{option.option_text}</span>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-gray-500 italic">No questions added yet</p>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedQuiz(quiz);
                                  setShowAddQuestionModal(true);
                                }}
                                className="mt-3 flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add new question
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Quiz Modal */}
        {showAddQuizModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
              <div className="fixed inset-0 bg-gray-200 opacity-85 transition-opacity" onClick={() => setShowAddQuizModal(false)}></div>
              
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add New Quiz</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowAddQuizModal(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAddQuiz();
                }}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        id="title"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={newQuiz.title}
                        onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        id="description"
                        rows="3"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={newQuiz.description}
                        onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                      ></textarea>
                    </div>
                    
                    <div>
                      <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
                      <select
                        id="difficulty"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={newQuiz.difficulty_level}
                        onChange={(e) => setNewQuiz({...newQuiz, difficulty_level: e.target.value})}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="points" className="block text-sm font-medium text-gray-700">Points</label>
                      <input
                        type="number"
                        id="points"
                        min="0"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={newQuiz.points}
                        onChange={(e) => setNewQuiz({...newQuiz, points: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                      onClick={() => setShowAddQuizModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Quiz
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
        
        {/* Add Question Modal */}
        {showAddQuestionModal && selectedQuiz && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
              <div className="fixed inset-0 bg-gray-200 opacity-85 transition-opacity" onClick={() => setShowAddQuestionModal(false)}></div>
              
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Add Question to "{selectedQuiz.title}"</h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowAddQuestionModal(false)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleAddQuestion();
                }}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="question_text" className="block text-sm font-medium text-gray-700">Question</label>
                      <textarea
                        id="question_text"
                        rows="2"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={newQuestion.question_text}
                        onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                      <div className="space-y-3">
                        {newQuestion.options.map((option, index) => (
                          <div key={index} className="flex items-center">
                            <input
                              type="radio"
                              id={`correct_answer_${index}`}
                              name="correct_answer"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              checked={newQuestion.correct_answer === option.option_text}
                              onChange={() => setNewQuestion({...newQuestion, correct_answer: option.option_text})}
                            />
                            <label htmlFor={`correct_answer_${index}`} className="ml-2 mr-3 text-sm text-gray-700">
                              Correct
                            </label>
                            <input
                              type="text"
                              placeholder={`Option ${index + 1}`}
                              className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              value={option.option_text}
                              onChange={(e) => handleUpdateOptionText(index, e.target.value)}
                              required
                            />
                          </div>
                        ))}
                      </div>
                      {!newQuestion.correct_answer && (
                        <p className="text-sm text-red-500 mt-1">Please select one option as the correct answer</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                      onClick={() => setShowAddQuestionModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={!newQuestion.correct_answer}
                    >
                      Add Question
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default QuizManagementPage;
