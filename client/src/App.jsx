import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateAssessment from './pages/CreateAssessment';
import AssessmentDetail from './pages/AssessmentDetail';
import TeacherClasses from './pages/TeacherClasses';
import TeacherClassDetails from './pages/TeacherClassDetails';
import TeacherProfile from './pages/TeacherProfile';
import AssessmentPreview from './pages/AssessmentPreview';
import StudentDashboard from './pages/StudentDashboard';
import StudentJoinClass from './pages/StudentJoinClass';
import StudentClasses from './pages/StudentClasses';
import StudentAssessments from './pages/StudentAssessments';
import Leaderboard from './pages/Leaderboard';
import TakeAssessment from './pages/TakeAssessment';
import AssessmentResult from './pages/AssessmentResult';
import StudentResults from './pages/StudentResults';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Teacher Routes */}
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/create" element={<CreateAssessment />} />
          <Route path="/teacher/assessment/:id" element={<AssessmentDetail />} />
          <Route path="/teacher/classes" element={<TeacherClasses />} />
          <Route path="/teacher/class/:classId" element={<TeacherClassDetails />} />
          <Route path="/teacher/profile" element={<TeacherProfile />} />
          <Route path="/teacher/assessment-preview" element={<AssessmentPreview />} />

          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/join" element={<StudentJoinClass />} />
          <Route path="/student/classes" element={<StudentClasses />} />
          <Route path="/student/assessments" element={<StudentAssessments />} />
          <Route path="/student/leaderboard" element={<Leaderboard />} />
          <Route path="/student/take/:id" element={<TakeAssessment />} />
          <Route path="/student/results" element={<StudentResults />} />
          <Route path="/student/result/:id" element={<AssessmentResult />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
