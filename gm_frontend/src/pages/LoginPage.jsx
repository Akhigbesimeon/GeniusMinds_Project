import React, { useState } from 'react';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import axios from 'axios';
import { data, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const goTo = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleLogin(event) {
    event.preventDefault();
    try {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/auth/login`,
            {
                email: email,
                password: password
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        if(response.status == 200) {
            localStorage.setItem('access_token', response.data.access_token);
            localStorage.setItem('role', response.data.role);
            goTo('/');
        }
    }
    catch (e) {
        console.log(`Error: ${e}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-md w-full">
        <div className="bg-indigo-600 p-6 text-center">
          <div className="flex justify-center mb-2">
            <BookOpen className="text-white h-12 w-12" />
          </div>
          <h1 className="text-white text-3xl font-bold">GeniusMinds</h1>
          <p className="text-indigo-200 mt-1">Learn, explore, grow!</p>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome back!</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
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
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-1 text-right">
                <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg"
            >
              Log In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;