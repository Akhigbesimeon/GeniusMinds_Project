import { 
  BookOpen, 
  Brain, 
  Award, 
  BarChart, 
  Clock, 
  Star, 
  Trophy, 
} from 'lucide-react';
import React from 'react';
import Sidebar from '../components/SideBar';
import { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {

  const [user, setUser] = useState({});
  const goTo = useNavigate();

  useEffect(() => {
    if(!localStorage.getItem('access_token')) {
      goTo('/login');
    }
      axios.get(`${import.meta.env.VITE_API_URL}/api/user-info`, { headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }})
      .then((response) => setUser(response.data));
  }, [])
  // Mock data for subjects
  const subjects = [
    { id: 1, name: 'Math', progress: 65, color: 'bg-blue-500', icon: () => <div className="bg-blue-100 p-2 rounded-lg"><span className="text-blue-500 text-xl font-bold">+</span></div> },
    { id: 2, name: 'Science', progress: 40, color: 'bg-green-500', icon: () => <div className="bg-green-100 p-2 rounded-lg"><Brain className="text-green-500 h-5 w-5" /></div> },
    { id: 3, name: 'Reading', progress: 85, color: 'bg-purple-500', icon: () => <div className="bg-purple-100 p-2 rounded-lg"><BookOpen className="text-purple-500 h-5 w-5" /></div> },
    { id: 4, name: 'History', progress: 30, color: 'bg-amber-500', icon: () => <div className="bg-amber-100 p-2 rounded-lg"><Clock className="text-amber-500 h-5 w-5" /></div> },
  ];

  // Mock data for achievements
  const achievements = [
    { id: 1, name: 'Math Whiz', description: 'Complete 10 math quizzes', icon: <Trophy className="text-yellow-500 h-6 w-6" />, completed: true },
    { id: 2, name: 'Science Explorer', description: 'Finish the science course', icon: <Star className="text-indigo-500 h-6 w-6" />, completed: false },
    { id: 3, name: 'Bookworm', description: 'Read 5 stories', icon: <Award className="text-green-500 h-6 w-6" />, completed: true },
  ];

  // Mock data for recent activities
  const recentActivities = [
    { id: 1, activity: 'Completed "Addition Quiz"', time: '2 hours ago', subject: 'Math' },
    { id: 2, activity: 'Read "The Solar System"', time: 'Yesterday', subject: 'Science' },
    { id: 3, activity: 'Started "US History" course', time: '2 days ago', subject: 'History' },
  ];
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
          <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
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
                    <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium shadow-sm hover:bg-indigo-50 transition-colors">
                      Resume Learning
                    </button>
                  </div>
                </div>
                <div className="md:flex-shrink-0 p-6 flex items-center justify-center">
                  <img 
                    className="h-56 w-auto object-contain" 
                    src="/api/placeholder/300/200" 
                    alt="Learning illustration" 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Subjects Progress */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Your Learning Progress</h2>
                    <button className="text-sm text-indigo-600 font-medium">View All</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subjects.map(subject => (
                      <div key={subject.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          {subject.icon()}
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-800">{subject.name}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <span>{subject.progress}% complete</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${subject.color}`} 
                            style={{ width: `${subject.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-sm p-6 mt-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
                    <button className="text-sm text-indigo-600 font-medium">View All</button>
                  </div>
                  
                  <div className="space-y-4">
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
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded" />
                      <span className="ml-3 text-gray-700">Complete Math Quiz</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded" defaultChecked />
                      <span className="ml-3 text-gray-500 line-through">Read Science Article</span>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-indigo-600 rounded" />
                      <span className="ml-3 text-gray-700">Practice Spelling</span>
                    </div>
                  </div>
                  <button className="mt-4 text-sm text-indigo-600 font-medium flex items-center">
                    <span>Add new goal</span>
                  </button>
                </div>
                
                {/* Achievements */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Achievements</h2>
                  <div className="space-y-4">
                    {achievements.map(achievement => (
                      <div key={achievement.id} className="flex items-start">
                        <div className={`p-2 rounded-lg ${achievement.completed ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                          {achievement.icon}
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-gray-800">{achievement.name}</h3>
                          <p className="text-sm text-gray-500">{achievement.description}</p>
                          {achievement.completed ? (
                            <span className="inline-block mt-1 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              Completed
                            </span>
                          ) : (
                            <span className="inline-block mt-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                              In Progress
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium">
                    View All Achievements
                  </button>
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