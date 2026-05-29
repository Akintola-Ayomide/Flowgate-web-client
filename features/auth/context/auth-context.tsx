// Auth Context with Guest Login Support
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginDTO, SignupDTO } from '../types';
import { authApi } from '../services/auth.api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginDTO) => Promise<void>;
  signup: (data: SignupDTO) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
  loginGuest: (name: string, phone?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (data: LoginDTO) => {
    const response = await authApi.login(data);
    setUser(response.user);
  };

  const signup = async (data: SignupDTO) => {
    const response = await authApi.signup(data);
    setUser(response.user);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    window.location.href = '/';
  };

  const loginWithGoogle = () => {
    authApi.initiateGoogleLogin();
  };

  const loginGuest = async (name: string, phone?: string) => {
    const response = await authApi.loginGuest(name, phone);
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        loginWithGoogle,
        loginGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
