import React, { useState } from 'react';
import { Eye, EyeOff, BookOpen, Rocket, Brain, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [role, setRole] = useState('');
  const goTo = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function _onRegister(event) {
    event.preventDefault();
    try{
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/register`,
            {
                username: username,
                email: email,
                role: role,
                password: password
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if(response?.status == 201) {
            goTo('/login');
        }
    }
    catch (e) {
        console.log(`Error: ${e}`)
    }

  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 flex flex-col md:flex-row p-4">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="flex items-center mb-8">
            <BookOpen className="text-indigo-600 h-10 w-10 mr-2" />
            <h1 className="text-3xl font-bold text-indigo-600">GeniusMinds</h1>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Join our learning adventure!</h2>
          <p className="text-gray-600 text-lg mb-8">Create an account to unlock a world of interactive learning experiences designed for curious minds.</p>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Brain className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">Personalized Learning</h3>
                <p className="text-gray-600">Content adapted to your learning style and pace</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Rocket className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">Interactive Quizzes</h3>
                <p className="text-gray-600">Fun and engaging quizzes that make learning exciting</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <CheckCircle className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="ml-3">
                <h3 className="font-medium text-gray-800">Track Progress</h3>
                <p className="text-gray-600">See your achievements and growth over time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create your account</h2>
            
            <form onSubmit={_onRegister} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Username"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your age"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select 
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full text-gray-700 border border-gray-300 rounded-md px-4 py-2"
                >
                    <option value="" disabled>Select a role</option>
                    <option value="student">Student</option>
                    <option value="educator">Educator</option>
                    <option value="parent">Parent</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
              >
                Sign Up
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link className="text-indigo-600 hover:text-indigo-800 font-medium" to="/login">Log in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;