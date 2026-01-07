
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfileSetupPage from './pages/ProfileSetupPage';
import LoadingPage from './pages/LoadingPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#2d2d2d',
              color: '#f3f4f6',
            },
          }}
        />
        <Router />
      </div>
    </AuthProvider>
  );
};

const Router: React.FC = () => {
  const { user, loading, profile, profileLoading } = useAuth();

  if (loading || (user && profileLoading)) {
    return <LoadingPage />;
  }

  return (
    <BrowserRouter>
      {user && profile && <Header />}
      <main className="p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route
            path="/login"
            element={!user ? <AuthPage /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              <ProtectedRoute user={user} profile={profile}>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute user={user} profile={profile}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/setup-profile"
            element={user && !profile ? <ProfileSetupPage /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
        </Routes>
      </main>
      {user && profile && <Footer />}
    </BrowserRouter>
  );
};

interface ProtectedRouteProps {
  user: any;
  profile: any;
  // FIX: Replaced JSX.Element with React.ReactElement to resolve namespace error
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ user, profile, children }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!profile) {
    return <Navigate to="/setup-profile" />;
  }
  return children;
};

export default App;