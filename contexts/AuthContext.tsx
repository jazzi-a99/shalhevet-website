import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { auth_sign_in, auth_sign_up, auth_sign_out, profiles_get_me, profiles_update_me, profiles_create_me

 } from '@/lib/queries';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    const { data } = await profiles_get_me();
    if (data) {
      setProfile(data as Profile);
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener BEFORE getting session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Use setTimeout to avoid potential race conditions
          setTimeout(() => fetchProfile(), 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile();
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await auth_sign_in(email, password);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      setUser(data.user);
      await fetchProfile();
      return { success: true };
    }
    
    return { success: false, error: 'Login failed' };
  }, [fetchProfile]);

  const signup = useCallback(async (email: string, password: string, fullName?: string) => {
    const { data, error } = await auth_sign_up(email, password, fullName);
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    if (data.user) {
      // Trigger handle_new_user() creates the profile from auth metadata.
      // Upsert as a safety net in case trigger missed it or user re-signs up.
      await profiles_create_me(data.user.id, email, fullName);
      setUser(data.user);
      await fetchProfile();
      return { success: true };
    }
    
    return { success: false, error: 'Signup failed' };
  }, [fetchProfile]);

  const logout = useCallback(async () => {
    await auth_sign_out();
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        profile,
        isAuthenticated: !!user, 
        isLoading,
        login, 
        signup,
        logout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
