
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
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };
  
  const navLinkClasses = "px-3 py-2 rounded-md text-sm font-medium transition";
  const activeLinkClasses = "bg-gray-700 text-white";
  const inactiveLinkClasses = "text-gray-300 hover:bg-gray-700 hover:text-white";

  return (
    <header className="bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-white">Focus<span className="text-teal-400">30</span></span>
            <nav className="hidden md:block ml-10 space-x-4">
              <NavLink to="/" className={`${navLinkClasses} ${location.pathname === '/' ? activeLinkClasses : inactiveLinkClasses}`}>Daily Log</NavLink>
              <NavLink to="/dashboard" className={`${navLinkClasses} ${location.pathname === '/dashboard' ? activeLinkClasses : inactiveLinkClasses}`}>Dashboard</NavLink>
            </nav>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 mr-4 hidden sm:block">Welcome, {profile?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="md:hidden flex justify-around py-2 border-t border-gray-700">
             <NavLink to="/" className={`${navLinkClasses} ${location.pathname === '/' ? activeLinkClasses : inactiveLinkClasses}`}>Daily Log</NavLink>
              <NavLink to="/dashboard" className={`${navLinkClasses} ${location.pathname === '/dashboard' ? activeLinkClasses : inactiveLinkClasses}`}>Dashboard</NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
