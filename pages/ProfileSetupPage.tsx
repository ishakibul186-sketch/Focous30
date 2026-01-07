
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { ref, set } from 'firebase/database';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import toast from 'react-hot-toast';

const ProfileSetupPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name || !goal) {
      toast.error('Name and Goal are required.');
      return;
    }
    setIsLoading(true);
    const profileData = {
      name,
      goal,
      age: age ? parseInt(age, 10) : null,
      startDate: new Date().toISOString().split('T')[0],
    };

    try {
      const profileRef = ref(db, `users_LifeRoutineAnalyzer/${user.uid}/profile`);
      await set(profileRef, profileData);
      toast.success('Profile created successfully! Welcome.');
      // The app will automatically navigate due to the state change in AuthContext
    } catch (error) {
      console.error(error);
      toast.error('Failed to set up profile.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-2">Welcome to Focus30!</h2>
        <p className="text-center text-gray-400 mb-6">Let's set up your profile to get started.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Name"
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Alex Doe"
            required
          />
          <Input
            label="Your Primary Goal"
            id="goal"
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g., Better focus, study discipline"
            required
          />
          <Input
            label="Age (Optional)"
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="e.g., 25"
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Start My 30-Day Journey'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfileSetupPage;
