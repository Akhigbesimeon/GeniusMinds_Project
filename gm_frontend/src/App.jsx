import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import React from 'react';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizManagementPage from './pages/QuizManagementPage';
import FlashcardManagementPage from './pages/FlashcardManagementPage';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<DashboardPage />} />
      <Route path='/quizzes' element={<QuizPage />}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/register' element={<RegisterPage />}/>
      <Route path='/manage/quiz' element={<QuizManagementPage />}/>
      <Route path='/manage/flashcards' element={<FlashcardManagementPage />}/>

      </Routes>
    </Router>
  )
}

export default App
