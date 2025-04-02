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
  Search
} from 'lucide-react';
import React from 'react';
import Sidebar from '../components/SideBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [user, setUser] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [dailyGoals, setDailyGoals] = useState([]);
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

  // Check authentication and fetch user data
  useEffect(() => {
    if(!localStorage.getItem('access_token')) {
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
        
        // Fetch subjects progress
        const subjectsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/subjects/progress`, 
          getAuthHeader()
        );
        setSubjects(subjectsResponse.data);
        
        // Fetch achievements
        const achievementsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/achievements`, 
          getAuthHeader()
        );
        setAchievements(achievementsResponse.data);
        
        // Fetch recent activities
        const activitiesResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/recent-activities`, 
          getAuthHeader()
        );
        setRecentActivities(activitiesResponse.data);
        
        // Fetch daily goals
        const goalsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/daily-goals`, 
          getAuthHeader()
        );
        setDailyGoals(goalsResponse.data);
        
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [goTo]);

  // Toggle goal completion status
  const toggleGoalCompletion = async (goalId, isCompleted) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/daily-goals/${goalId}`,
        { completed: !isCompleted },
        getAuthHeader()
      );
      
      // Update local state
      setDailyGoals(dailyGoals.map(goal => 
        goal.id === goalId ? { ...goal, completed: !isCompleted } : goal
      ));
    } catch (err) {
      console.error("Error updating goal:", err);
    }
  };
  
  const continueLearing = () => {
    if(recentActivities.length < 1) goTo('/flashcards')
    else {
      if(recentActivities[0].activity_type.includes("flashcard")) {
        goTo('/flashcards')
      }
      else {
        goTo('/quizzes')
      }
    }
  }

  // Add new goal
  const addNewGoal = async () => {
    const goalText = prompt("Enter new goal:");
    if (!goalText) return;
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/daily-goals`,
        { text: goalText, completed: false },
        getAuthHeader()
      );
      
      // Add new goal to state
      setDailyGoals([...dailyGoals, response.data]);
    } catch (err) {
      console.error("Error adding goal:", err);
    }
  };

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

  // Return the main dashboard
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
                    Hello {user.username}
                  </div>
                  <h1 className="mt-2 text-white text-3xl font-bold">
                    Welcome back to your learning journey
                  </h1>
                  <p className="mt-3 text-indigo-100">
                    Continue where you left off or explore new subjects
                  </p>
                  <div className="mt-6">
                    <button onClick={continueLearing} className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors">
                      {recentActivities.length > 0 ? "Resume Learning" : "Start Your Learning"}
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
              {/* Subjects Progress */}
              <div className="lg:col-span-2">
                
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivities.length == 0 && "No recent activities"}
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-start border-b border-gray-100 pb-4">
                        <div className="bg-indigo-100 rounded-full p-2 mr-4">
                          <BarChart className="h-5 w-5 text-indigo-500" />
                        </div>
                        <div>
                          <p className="text-gray-800 font-medium">{activity.activity}</p>
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
              
              {/* Sidebar */}
              <div className="space-y-8">
                {/* Today's Goals */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Goals</h2>
                  <div className="space-y-3">
                    {dailyGoals.map(goal => (
                      <div key={goal.id} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="h-4 w-4 text-indigo-600 rounded"
                          checked={goal.completed}
                          onChange={() => toggleGoalCompletion(goal.id, goal.completed)}
                        />
                        <span className={`ml-3 ${goal.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                          {goal.text}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={addNewGoal}
                    className="mt-4 text-sm text-indigo-600 font-medium flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    <span>Add new goal</span>
                  </button>
                </div>
                
                {/* Achievements */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <img src="https://cdn1.byjus.com/wp-content/uploads/blog/2023/01/24171123/Wallpaper-for-the-quote-Reading-is-to-the-mind-what-exercise-is-to-the-body.-%E2%80%93-Joseph-Addison--2048x1443.jpg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;