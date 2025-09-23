import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CompanyQuestionsPage from './pages/CompanyQuestionsPage';
import RecentUpdatesPage from './pages/RecentUpdatesPage';
import WinningProjectsPage from './pages/WinningProjectsPage';
import MockInterviewPage from './pages/MockInterviewPage';
import AdminPage from './pages/AdminPage';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

// Admin only Route wrapper
function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.isAdmin ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavbarComponent />
        <div className="container my-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/company-questions" element={<CompanyQuestionsPage />} />
            <Route path="/mock-interview" element={<MockInterviewPage/>} />
            <Route path="/AdminPage" element={<AdminPage/>} />
            <Route path="/winning-projects" element={<WinningProjectsPage/>} />
            <Route path="/recent-updates" element={<RecentUpdatesPage/>} />

            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            {/* <Route
              path="/company-questions"
              element={
                <PrivateRoute>
                  <CompanyQuestionsPage />
                </PrivateRoute>
              }
            /> */}
            <Route
              path="/recent-updates"
              element={
                <PrivateRoute>
                  <RecentUpdatesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/winning-projects"
              element={
                <PrivateRoute>
                  <WinningProjectsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/mock-interview"
              element={
                <PrivateRoute>
                  <MockInterviewPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
