import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import React from 'react';
import QuizPage from './pages/QuizPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import QuizManagementPage from './pages/QuizManagementPage';
import FlashcardManagementPage from './pages/FlashcardManagementPage';
import { StudentQuizList, StudentQuizPage } from './pages/StudentQuizList';
import FlashcardBrowsePage from './pages/FlashcardBrowsePage';
import FlashcardStudyPage from './pages/FlashcardStudyPage';
import EducatorDashboardPage from './pages/EducatorDashboard';

function App() {
  return (
    <Router>
      <Routes>
      <Route path='/' element={<DashboardPage />} />
      <Route path='/dashboard' element={<EducatorDashboardPage />} />
      <Route path='/quizzes' element={<StudentQuizList />}/>
      <Route path='/flashcards' element={<FlashcardBrowsePage />}/>
      <Route path='/flashcards/study/:setId' element={<FlashcardStudyPage />}/>
      <Route path='/quiz/:quizId' element={<StudentQuizPage />}/>
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/register' element={<RegisterPage />}/>
      <Route path='/manage/quiz' element={<QuizManagementPage />}/>
      <Route path='/manage/flashcards' element={<FlashcardManagementPage />}/>

      </Routes>
    </Router>
  )
}

export default App
