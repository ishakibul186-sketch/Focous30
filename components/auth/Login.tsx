
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.ts';
import Button from '../ui/Button.tsx';
import Input from '../ui/Input.tsx';
import Card from '../ui/Card.tsx';
import toast from 'react-hot-toast';

interface LoginProps {
  onBack: () => void;
}

const Login: React.FC<LoginProps> = ({ onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please enter your username.');
      return;
    }
    
    setIsLoading(true);
    const fullEmail = `${username.toLowerCase()}@focous30.com`;

    try {
      await signInWithEmailAndPassword(auth, fullEmail, password);
      toast.success('Access Granted!');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' 
        ? 'User ID not found.' 
        : error.message || 'Failed to log in.';
      toast.error(errorMessage);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900/40 backdrop-blur-xl border-gray-800 p-8">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white">Sign In</h2>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <Input
          label="User ID"
          id="login-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your.name"
          suffix="@focous30.com"
          required
        />
        <Input
          label="Password"
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        
        <div className="pt-2">
          <Button type="submit" className="w-full py-4 rounded-2xl shadow-xl shadow-teal-500/10" disabled={isLoading}>
            {isLoading ? 'Authenticating...' : 'Sign In Now'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
