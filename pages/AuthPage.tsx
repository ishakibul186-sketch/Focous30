
import React, { useState, useEffect } from 'react';
import Login from '../components/auth/Login.tsx';
import Signup from '../components/auth/Signup.tsx';
import Card from '../components/ui/Card.tsx';

const AuthPage: React.FC = () => {
  const [view, setView] = useState<'welcome' | 'login' | 'signup'>('welcome');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        setView('login');
      } else if (hash === '#signup') {
        setView('signup');
      } else {
        setView('welcome');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Check on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (newHash: string) => {
    window.location.hash = newHash;
  };

  const handleBack = () => {
    // Uses the browser history stack to go back, maintaining the '#' system integrity.
    // If there's a hash, we go back. If not, we stay at welcome.
    if (window.location.hash) {
      window.history.back();
    } else {
      navigateTo('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-teal-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]"></div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10 transform transition-all duration-700">
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Focus<span className="text-teal-400">30</span>
          </h1>
          <p className="text-gray-500 mt-3 font-medium tracking-wide">Transform Your Discipline</p>
        </div>

        <div className="relative min-h-[400px]">
          {/* Welcome Screen */}
          {view === 'welcome' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-800 p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 mb-8">Ready to track your daily progress?</p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => navigateTo('login')}
                    className="w-full bg-teal-500 hover:bg-teal-400 text-black font-bold py-4 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-teal-500/20"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigateTo('signup')}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-2xl border border-gray-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Create Account
                  </button>
                </div>
                
                <p className="mt-8 text-xs text-gray-500 uppercase tracking-widest font-semibold">
                  Powered by prohor
                </p>
              </Card>
            </div>
          )}

          {/* Login Screen */}
          {view === 'login' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <Login onBack={handleBack} />
            </div>
          )}

          {/* Signup Screen */}
          {view === 'signup' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <Signup onBack={handleBack} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
