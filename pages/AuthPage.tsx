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
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (newHash: string) => {
    window.location.hash = newHash;
  };

  const handleBack = () => {
    if (window.location.hash) {
      window.history.back();
    } else {
      navigateTo('');
    }
  };

  const footerLinkClass = "hover:text-teal-400 transition-all duration-300 px-3 py-1 rounded-lg hover:bg-white/5";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] px-4 overflow-hidden relative selection:bg-teal-500/30">
      {/* Ultra-Modern Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-teal-600/10 rounded-full blur-[160px] animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[180px] animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md z-10 flex-grow flex flex-col justify-center py-12">
        <div className="text-center mb-12 animate-in fade-in zoom-in-95 duration-1000">
          <div className="inline-block p-4 mb-6 rounded-3xl bg-white/[0.03] border border-white/5 shadow-2xl backdrop-blur-md">
             <h1 className="text-6xl font-black text-white tracking-tighter leading-none">
              Focus<span className="text-teal-400">30</span>
            </h1>
          </div>
          <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] opacity-70">
            Evolution Protocol v2.0
          </p>
        </div>

        <div className="relative min-h-[460px]">
          {/* Welcome Screen */}
          {view === 'welcome' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Card className="text-center">
                <h2 className="text-3xl font-black text-white mb-3">Initiate Journey</h2>
                <p className="text-gray-400 mb-10 text-sm leading-relaxed">System ready for daily logging and performance analytics. Please authenticate to proceed.</p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => navigateTo('login')}
                    className="w-full bg-teal-500 hover:bg-teal-400 text-black font-black py-5 rounded-2xl transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_20px_40px_-10px_rgba(20,184,166,0.4)]"
                  >
                    SIGN IN
                  </button>
                  <button
                    onClick={() => navigateTo('signup')}
                    className="w-full bg-white/[0.03] hover:bg-white/[0.08] text-white font-black py-5 rounded-2xl border border-white/10 transition-all duration-500 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    CREATE IDENTITY
                  </button>
                </div>
                
                <div className="mt-12 flex items-center justify-center space-x-4 opacity-40">
                  <div className="h-px w-8 bg-white/20"></div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                    Powered by prohor
                  </p>
                  <div className="h-px w-8 bg-white/20"></div>
                </div>
              </Card>
            </div>
          )}

          {/* Login Screen */}
          {view === 'login' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <Login onBack={handleBack} />
            </div>
          )}

          {/* Signup Screen */}
          {view === 'signup' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <Signup onBack={handleBack} />
            </div>
          )}
        </div>
      </div>

      <footer className="w-full py-8 z-10 text-gray-500 text-[10px] uppercase tracking-[0.2em] font-black text-center">
        <div className="flex justify-center items-center space-x-4 opacity-50 hover:opacity-100 transition-opacity duration-500">
          <a href="/about" className={footerLinkClass}>About</a>
          <span className="text-white/10">•</span>
          <a href="/docs" className={footerLinkClass}>Docs</a>
          <span className="text-white/10">•</span>
          <a href="/terms" className={footerLinkClass}>Terms</a>
          <span className="text-white/10">•</span>
          <a href="/privacy-policy" className={footerLinkClass}>Privacy</a>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;