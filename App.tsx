
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import AuthPage from './pages/AuthPage.tsx';
import HomePage from './pages/HomePage.tsx';
import DashboardPage from './pages/DashboardPage.tsx';
import ProfileSetupPage from './pages/ProfileSetupPage.tsx';
import LoadingPage from './pages/LoadingPage.tsx';
import Header from './components/layout/Header.tsx';
import Footer from './components/layout/Footer.tsx';
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
