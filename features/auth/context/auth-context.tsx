/**
 * @file auth-context.tsx
 * @description React context providing authentication state and actions.
 *
 * Session persistence strategy
 * ─────────────────────────────
 * On mount, the context calls `/auth/me` (with an `Authorization: Bearer`
 * header if a token is in localStorage) to rehydrate the user session.
 * This works across browser reloads and cross-domain deployments where
 * the backend HttpOnly cookie is inaccessible to the frontend domain.
 *
 * After every successful auth action (login, signup, guest, Google callback),
 * the returned `accessToken` is saved via `setToken()` which:
 *   1. Stores the JWT in localStorage (persists across reloads / tabs).
 *   2. Sets a lightweight `session=1` cookie so the Next.js middleware can
 *      gate protected routes server-side without reading the actual token.
 */
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginDTO, SignupDTO } from '../types';
import { authApi } from '../services/auth.api';
import { setToken, clearToken, hasToken, getToken } from '../services/token.storage';

// ─────────────────────────────────────────────────
// Context type
// ─────────────────────────────────────────────────

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginDTO) => Promise<void>;
    signup: (data: SignupDTO) => Promise<void>;
    logout: () => Promise<void>;
    loginWithGoogle: () => void;
    loginGuest: (name: string, phone?: string) => Promise<void>;
    /** Call after a Google OAuth callback to hydrate state from a token in the URL */
    handleGoogleCallback: (token: string) => Promise<void>;
    updateProfile: (data: { name?: string; avatar?: string | null }) => Promise<void>;
}

// ─────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    /**
     * Guards against multiple concurrent 401 responses (e.g. two in-flight API
     * calls both returning 401) from calling router.replace() more than once,
     * which can cause navigation to stall or loop.
     */
    const isHandlingUnauthorized = React.useRef(false);

    /**
     * Verify auth state on mount.
     * Calls `/auth/me` with a 10-second AbortController timeout so that a
     * slow or unreachable backend never leaves isLoading stuck at true.
     */
    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        const tokenAtStart = getToken();

        // 10-second hard timeout — if the backend doesn't respond, we bail out
        // and treat the user as unauthenticated rather than hanging forever.
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10_000);

        try {
            const profile = await authApi.getProfile(controller.signal);
            setUser(profile);
        } catch (err: any) {
            // AbortError means we timed out — not a genuine 401.
            // Only clear state when genuinely unauthenticated.
            // A concurrent flow (e.g. handleGoogleCallback) may have stored a
            // token in localStorage while this request was in-flight — if so,
            // do NOT wipe the user it already set in context.
            if (getToken() === tokenAtStart) {
                clearToken();
                setUser(null);
            }
        } finally {
            clearTimeout(timeoutId);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    // Listen to global 401 unauthorized events to instantly log out the user.
    // The deduplication ref prevents multiple parallel 401 responses from
    // calling router.replace() concurrently, which can stall navigation.
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleUnauthorized = () => {
            if (isHandlingUnauthorized.current) return;
            isHandlingUnauthorized.current = true;

            clearToken();
            setUser(null);
            // Redirect to login page — the token is expired or invalid.
            router.replace('/auth?error=session_expired');

            // Reset the flag after navigation settles so future logouts work.
            setTimeout(() => { isHandlingUnauthorized.current = false; }, 3000);
        };

        window.addEventListener('auth-unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('auth-unauthorized', handleUnauthorized);
        };
    }, [router]);

    // ── Actions ────────────────────────────────────

    const login = async (data: LoginDTO) => {
        const response = await authApi.login(data);
        setToken(response.accessToken);
        setUser(response.user);
    };

    const signup = async (data: SignupDTO) => {
        const response = await authApi.signup(data);
        setToken(response.accessToken);
        setUser(response.user);
    };

    const logout = async () => {
        await authApi.logout();
        clearToken();
        setUser(null);
        window.location.href = '/';
    };

    const loginWithGoogle = () => {
        authApi.initiateGoogleLogin();
    };

    const loginGuest = async (name: string, phone?: string) => {
        const response = await authApi.loginGuest(name, phone);
        setToken(response.accessToken);
        setUser(response.user);
    };

    /**
     * Called by the `/auth/callback` page after a Google OAuth redirect.
     * The backend passes the JWT as a `?token=` query parameter for cross-domain
     * compatibility. This method stores the token and fetches the full profile.
     *
     * We set `isLoading = true` for the duration of the request so that any
     * component watching `isLoading` (e.g. the callback page's second useEffect
     * guard) doesn't mistakenly treat the in-progress state as "auth failed".
     */
    const handleGoogleCallback = async (token: string) => {
        setIsLoading(true);
        setToken(token);
        try {
            const profile = await authApi.getProfile();
            setUser(profile);
        } catch {
            // Token might be invalid — clear it and let the callback page handle the error.
            clearToken();
            setUser(null);
            throw new Error('Failed to fetch profile after Google login');
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (data: { name?: string; avatar?: string | null }) => {
        const updated = await authApi.updateProfile(data);
        setUser(updated);
    };

    // ── Provider value ─────────────────────────────

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
                handleGoogleCallback,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// ─────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
