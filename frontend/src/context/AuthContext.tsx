'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  signInWithEmail: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithGithub: async () => {},
  signInWithGoogle: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    isLoading,
    signIn: async () => {
      // Implement your sign in logic
    },
    signOut: async () => {
      await supabase.auth.signOut();
      router.push('/login');
    },
    signInWithEmail: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error };
      } catch (error) {
        return { error: error as Error };
      }
    },
    signUpWithEmail: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        return { error };
      } catch (error) {
        return { error: error as Error };
      }
    },
    signInWithGithub: async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'github',
      });
    },
    signInWithGoogle: async () => {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
