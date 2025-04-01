import { useState } from "react";
import { 
    BookOpen, 
    Brain, 
    Award, 
    BarChart, 
    Clock, 
    Star, 
    Trophy, 
    LogOut,
    Search,
    Bell,
    MessageSquare,
    Home,
    BookText,
    Layers,
    Settings,
    HelpCircle,
    Menu,
    X
  } from 'lucide-react';
  import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import axios from "axios";

  

const Sidebar = ({sidebarOpen, setSidebarOpen}) => {
    const [user, setUser] = useState({});
    const goTo = useNavigate()

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/user-info`, { headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        }})
        .then((response) => setUser(response.data));
    }, [])

    if(user.role == 'student') {
      var navigation = [
          { name: 'Dashboard', href: '/', icon: Home, current: window.location.href == '/' },
          { name: 'Quizzes', href: '/quizzes', icon: BookText, current: window.location.href.includes('quiz') },
          { name: 'Flashcards', href: '/flashcards', icon: Layers, current: window.location.href.includes('flashcards') },
          { name: 'Settings', href: '/settings', icon: Settings, current: false },
          { name: 'Help', href: '/help', icon: HelpCircle, current: false },
      ];
    }
    else {
      navigation = [
        { name: 'Dashboard', href: '/', icon: Home, current: window.location.href == '/' },
        { name: 'Manage Quizzes', href: '/manage/quiz', icon: BookText, current: window.location.href.includes('quiz') },
        { name: 'Manage Flashcards', href: '/manage/flashcards', icon: Layers, current: window.location.href.includes('flashcards') },
      ]
    }

    function handleLogout() {
      localStorage.clear();
      goTo('/login')
    }
  
    return (
      <>
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
  
        {/* Sidebar */}
        <div 
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <BookOpen className="text-indigo-600 h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-indigo-600">GeniusMinds</span>
            </div>
            <button 
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          <div className="flex flex-col flex-1 overflow-y-auto">
            <div className="px-3 py-6">
              <div className="flex flex-col items-center py-6 px-4 bg-indigo-50 rounded-lg">
                <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xl font-medium">
                  {user?.username ? user.username[0].toUpperCase() : null}
                </div>
                <h3 className="mt-3 text-xl font-medium text-gray-900">{user.username}</h3>
                <p className="text-sm font-medium text-gray-900 text-indigo-600">{user?.role?.toUpperCase()}</p>
                <div className="mt-3 text-sm text-indigo-600 font-medium">View Profile</div>
              </div>
            </div>
            
            <nav className="px-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
                    item.current
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      item.current ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div onClick={handleLogout} className="mt-auto px-3 py-4">
              <button className="flex items-center px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg w-full">
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
  
  export default Sidebar;
  