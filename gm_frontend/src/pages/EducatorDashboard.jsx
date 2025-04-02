import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Brain, 
  Award, 
  BarChart, 
  Clock, 
  Star, 
  Trophy, 
  Plus,
  Menu,
  Search,
  Users,
  Activity,
  BookText,
  Layers,
  Calendar
} from 'lucide-react';
import Sidebar from '../components/SideBar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EducatorDashboardPage = () => {
  const [user, setUser] = useState({});
  const [students, setStudents] = useState([]);
  const [quizPerformance, setQuizPerformance] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const goTo = useNavigate();

  // Get auth token for API requests
  const getAuthHeader = () => ({
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [userRes, studentsRes, activitiesRes, quizzesRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/user-info`, getAuthHeader()),
          axios.get(`${import.meta.env.VITE_API_URL}/api/educator/students`, getAuthHeader()),
          axios.get(`${import.meta.env.VITE_API_URL}/api/educator/recent-activities`, getAuthHeader()),
          axios.get(`${import.meta.env.VITE_API_URL}/api/educator/quiz-performance`, getAuthHeader())
        ]);

        setUser(userRes.data);
        
        // Transform students data
        setStudents(studentsRes.data.map(student => ({
          id: student.id,
          name: student.name,
          progress: student.progress,
          quizzes_completed: student.quiz_completions,
          flashcards_studied: student.flashcard_sessions,
          last_active: formatTimeAgo(student.last_activity)
        })));

        // Transform activities
        setRecentActivities(activitiesRes.data.map(activity => ({
          id: activity.id,
          student_name: activity.student_name,
          activity: activity.activity,
          time: formatTimeAgo(activity.created_at),
          subject: activity.subject
        })));

        // Transform quiz performance
        setQuizPerformance(quizzesRes.data.map(quiz => ({
          quiz_title: quiz.title,
          avg_score: quiz.avg_score,
          attempts: quiz.attempts,
          completion_rate: Math.round((quiz.attempts / studentsRes.data.length) * 100)
        })));

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [goTo]);

  // Helper to format time
  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'N/A';
    const date = new Date(isoString);
    const now = new Date();
    const diffMinutes = Math.round((now - date) / 60000);
    
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes/60)}h ago`;
    return `${Math.floor(diffMinutes/1440)}d ago`;
  };


  // Check authentication and fetch data
  useEffect(() => {
    if(!localStorage.getItem('access_token') || localStorage.getItem('role') !== 'educator') {
      goTo('/login');
      return;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch user info
        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user-info`, 
          getAuthHeader()
        );
        setUser(userResponse.data);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [goTo]);

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
                  <Menu className="h-6 w-6" />
                </button>
              </div>
              

            </div>
          </div>
        </nav>
         
        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-md overflow-hidden mb-8">
              <div className="md:flex">
                <div className="p-8">
                  <div className="uppercase tracking-wide text-indigo-100 text-sm font-semibold">
                    Educator Dashboard
                  </div>
                  <h1 className="mt-2 text-white text-3xl font-bold">
                    Welcome back, {user.username}
                  </h1>
                  <p className="mt-3 text-indigo-100">
                    Keep track of your students' progress and manage learning content
                  </p>
                  <div className="mt-6 flex space-x-4">
                    <button onClick={() => goTo('/manage/quiz')} className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors">
                      Create New Quiz
                    </button>
                    <button onClick={() => goTo('/manage/flashcards')} className="bg-transparent text-white border border-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                      Create Flashcards
                    </button>
                  </div>
                </div>
                <div className="md:flex-shrink-0 ml-auto flex items-center justify-center">
                  <img 
                    className="h-64 rounded-xl w-auto object-contain" 
                    src="https://isharingsoft.com/wp-content/uploads/2024/02/Parenting-Hacks-for-Preteens.png" 
                    alt="Learning illustration" 
                  />
                </div>

              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - 2/3 width */}
              <div className="lg:col-span-2 space-y-8">
                {/* Student Progress */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Student Progress</h2>
                    <button className="text-indigo-600 hover:text-indigo-800">
                      View All
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-left text-gray-500 text-sm border-b">
                        <tr>
                          <th className="pb-3">Student Name</th>
                          <th className="pb-3">Quizzes</th>
                          <th className="pb-3">Flashcards</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {students.map(student => (
                          <tr key={student.id}>
                            <td className="py-4 font-medium">{student.name}</td>
                            <td className="py-4">{student.quizzes_completed}</td>
                            <td className="py-4">{student.flashcards_studied}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Quiz Performance */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Quiz Performance</h2>
                    <button className="text-indigo-600 hover:text-indigo-800">
                      View Details
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-left text-gray-500 text-sm border-b">
                        <tr>
                          <th className="pb-3">Quiz Title</th>
                          <th className="pb-3">Avg. Score</th>
                          <th className="pb-3">Attempts</th>
                          <th className="pb-3">Completion Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {quizPerformance.map((quiz, index) => (
                          <tr key={index}>
                            <td className="py-4 font-medium">{quiz.quiz_title}</td>
                            <td className="py-4">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                quiz.avg_score >= 85 ? 'bg-green-100 text-green-800' :
                                quiz.avg_score >= 70 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {quiz.avg_score}%
                              </span>
                            </td>
                            <td className="py-4">{quiz.attempts}</td>
                            <td className="py-4">{quiz.completion_rate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
              </div>
                              {/* Recent Activity */}
                              <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Recent Student Activity</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-start border-b border-gray-100 pb-4">
                        <div className="bg-indigo-100 rounded-full p-2 mr-4">
                          <Activity className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">{activity.student_name}</p>
                          <p className="text-gray-600">{activity.activity}</p>
                          <div className="flex items-center mt-1 text-sm">
                            <span className="text-gray-500">{activity.time}</span>
                            <span className="mx-2 text-gray-300">•</span>
                            <span className="text-indigo-600">{activity.subject}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducatorDashboardPage;