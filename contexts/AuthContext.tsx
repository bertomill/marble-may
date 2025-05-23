'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  Auth,
  UserCredential 
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Setting up auth state listener with auth instance:', auth);
    
    if (!auth) {
      console.error('Auth instance is null');
      setLoading(false);
      return () => {};
    }
    
    try {
      // Set up auth state change listener
      const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
        console.log('Auth state changed:', user ? 'User signed in' : 'No user');
        setUser(user);
        setLoading(false);
      }, (error) => {
        console.error('Auth state change error:', error);
        setLoading(false);
      });

      // Clean up subscription
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      setLoading(false);
      return () => {};
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    if (!auth) throw new Error('Auth not initialized');
    
    console.log('Login attempt:', { email });
    try {
      const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
      console.log('Login successful:', userCredential.user.uid);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string): Promise<void> => {
    if (!auth) throw new Error('Auth not initialized');
    
    console.log('Registration attempt:', { email });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
      console.log('Registration successful:', userCredential.user.uid);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    if (!auth) throw new Error('Auth not initialized');
    
    console.log('Logout attempt');
    try {
      await signOut(auth as Auth);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (!auth) throw new Error('Auth not initialized');
    
    console.log('Password reset attempt:', { email });
    try {
      await sendPasswordResetEmail(auth as Auth, email);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 