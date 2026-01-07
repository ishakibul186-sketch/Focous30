
import React, { useState } from 'react';
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">Focus<span className="text-teal-400">30</span></h1>
          <p className="text-gray-400 mt-2">Daily Discipline & Life Routine Analyzer</p>
        </div>
        {isLogin ? <Login /> : <Signup />}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-teal-400 hover:text-teal-300 font-medium transition"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
