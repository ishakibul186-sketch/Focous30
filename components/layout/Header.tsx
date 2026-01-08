import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { auth } from '../../firebase.ts';
import { signOut } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext.tsx';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const { profile } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Session closed');
    } catch (error) {
      toast.error('Exit failed');
    }
  };
  
  const navLinkClasses = "px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300";
  const activeLinkClasses = "bg-teal-500 text-black shadow-[0_0_15px_rgba(20,184,166,0.3)]";
  const inactiveLinkClasses = "text-gray-400 hover:text-white hover:bg-white/5";

  return (
    <header className="bg-black/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center group">
              <span className="text-2xl font-black text-white tracking-tighter">
                FOCUS<span className="text-teal-400">30</span>
              </span>
            </NavLink>
            <nav className="hidden md:flex ml-12 space-x-2">
              <NavLink to="/" className={`${navLinkClasses} ${location.pathname === '/' ? activeLinkClasses : inactiveLinkClasses}`}>Daily Log</NavLink>
              <NavLink to="/dashboard" className={`${navLinkClasses} ${location.pathname === '/dashboard' ? activeLinkClasses : inactiveLinkClasses}`}>Analytics</NavLink>
            </nav>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
               <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
               <span className="text-xs font-bold text-gray-300 uppercase tracking-tighter">{profile?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center justify-center p-3 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex justify-around py-4 border-t border-white/5">
             <NavLink to="/" className={`${navLinkClasses} ${location.pathname === '/' ? activeLinkClasses : inactiveLinkClasses}`}>Log</NavLink>
             <NavLink to="/dashboard" className={`${navLinkClasses} ${location.pathname === '/dashboard' ? activeLinkClasses : inactiveLinkClasses}`}>Stats</NavLink>
             <a href="/docs" className={`${navLinkClasses} ${inactiveLinkClasses}`}>Help</a>
        </div>
      </div>
    </header>
  );
};

export default Header;