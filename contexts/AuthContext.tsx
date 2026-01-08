
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, off } from 'firebase/database';
import { auth, db } from '../firebase.ts';
import { UserProfile } from '../types.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: UserProfile | null;
  profileLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (!currentUser) {
        setProfile(null);
        setProfileLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      setProfileLoading(true);
      const profileRef = ref(db, `users_LifeRoutineAnalyzer/${user.uid}/profile`);
      const listener = onValue(profileRef, (snapshot) => {
        if (snapshot.exists()) {
          setProfile(snapshot.val());
        } else {
          setProfile(null);
        }
        setProfileLoading(false);
      });
      
      return () => off(profileRef, 'value', listener);
    }
  }, [user]);

  const value = { user, loading, profile, profileLoading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
