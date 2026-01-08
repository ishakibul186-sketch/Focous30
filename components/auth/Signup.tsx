
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.ts';
import Button from '../ui/Button.tsx';
import Input from '../ui/Input.tsx';
import Card from '../ui/Card.tsx';
import toast from 'react-hot-toast';

interface SignupProps {
  onBack: () => void;
}

const Signup: React.FC<SignupProps> = ({ onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      toast.error('Please choose a user ID.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match.");
      return;
    }

    setIsLoading(true);
    const fullEmail = `${username.toLowerCase()}@focous30.com`;

    try {
      await createUserWithEmailAndPassword(auth, fullEmail, password);
      toast.success('Account Created! Welcome.');
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use'
        ? 'This User ID is already taken.'
        : error.message || 'Failed to sign up.';
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
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        <Input
          label="Choose User ID"
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="john.doe"
          suffix="@focous30.com"
          required
        />
        <Input
          label="Set Password"
          id="signup-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 6 characters"
          required
        />
        <Input
          label="Confirm Password"
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repeat password"
          required
        />
        
        <div className="pt-2">
          <Button type="submit" className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 shadow-xl shadow-teal-900/10" disabled={isLoading}>
            {isLoading ? 'Creating Your Profile...' : 'Begin Journey'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Signup;
