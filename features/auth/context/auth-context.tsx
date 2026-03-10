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
        } catch (error) {
            // 401/403 means not authenticated, which is fine for initial check
            // Other errors could be logged
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

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            signup,
            logout,
            loginWithGoogle
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
