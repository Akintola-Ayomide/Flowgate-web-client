/**
 * @file auth.api.ts
 * @description Frontend API client for all authentication endpoints.
 *
 * Token strategy
 * ──────────────
 * All requests include `credentials: 'include'` so that the HttpOnly cookie
 * sent by the backend works correctly in same-domain (dev proxy) scenarios.
 * Additionally, if a JWT is found in localStorage (stored after Google OAuth
 * or any login), it is forwarded as an `Authorization: Bearer` header. This
 * ensures the auth works in cross-domain production deployments where the
 * backend cookie is not forwarded by the browser.
 */

import { LoginDTO, SignupDTO, AuthResponse, User } from '../types';
import { getToken } from './token.storage';

const API_BASE = '/api';

// ─────────────────────────────────────────────────
// Error class
// ─────────────────────────────────────────────────

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public code?: string,
        public fieldErrors?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// ─────────────────────────────────────────────────
// Auth API service
// ─────────────────────────────────────────────────

class AuthApiService {
    /**
     * Core fetch wrapper.
     * - Always sends cookies (`credentials: 'include'`) for same-domain scenarios.
     * - Attaches `Authorization: Bearer <token>` when a token exists in storage,
     *   making it work in cross-domain production deployments.
     */
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const token = getToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        // Inject Bearer token for cross-domain support
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        if (!response.ok) {
            if (response.status === 401 && token && typeof window !== 'undefined') {
                window.dispatchEvent(new Event('auth-unauthorized'));
            }

            let errorData: { message?: string; code?: string; details?: Record<string, string[]>; errors?: Record<string, string[]> };
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: 'An unexpected error occurred' };
            }

            throw new ApiError(
                response.status,
                errorData.message || 'API request failed',
                errorData.code,
                errorData.details || errorData.errors
            );
        }

        // Handle 204 No Content
        if (response.status === 204) return undefined as T;

        return response.json();
    }

    // ── Auth endpoints ───────────────────────────

    async login(data: LoginDTO): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async signup(data: SignupDTO): Promise<AuthResponse> {
        // Map frontend DTO field name to backend field name
        const payload = { ...data, name: data.username };
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    /**
     * Step 1 of signup: sends a 6-digit OTP to the given email.
     * Returns a generic success message.
     */
    async sendVerificationCode(email: string): Promise<{ message: string }> {
        return this.request<{ message: string }>('/auth/send-verification', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    /**
     * Step 2 of signup: submits the OTP together with the user's name and
     * password. On success the backend creates the account and returns a JWT.
     */
    async verifyAndSignup(data: {
        email: string;
        code: string;
        name: string;
        password: string;
    }): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/verify-email', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async loginGuest(name: string, phone?: string): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/guest', {
            method: 'POST',
            body: JSON.stringify({ name, phone }),
        });
    }

    /**
     * Fetches the current user profile.
     * Uses Bearer token if present; falls back to cookie-based auth for same-domain.
     * Accepts an optional AbortSignal so callers can impose a timeout.
     */
    async getProfile(signal?: AbortSignal): Promise<User> {
        return this.request<User>('/auth/me', { signal });
    }

    async logout(): Promise<void> {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } catch (e) {
            // Best-effort: even if the server call fails, the client will clear state.
            console.warn('Server logout failed (will still clear client state):', e);
        }
    }

    /**
     * Redirects the browser to the backend's Google OAuth initiation endpoint.
     * The backend (via Passport) handles redirecting to Google's consent screen.
     *
     * NOTE: We use the full NEXT_PUBLIC_API_URL for the Google redirect because
     * the browser must follow the redirect chain. The Next.js proxy rewrite does
     * NOT work for OAuth redirects — Google's callback URL must match the backend's
     * registered redirect URI exactly.
     */
    initiateGoogleLogin(): void {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        window.location.href = `${apiUrl}/auth/google`;
    }

    async requestPasswordReset(email: string): Promise<{ message: string }> {
        return this.request<{ message: string }>('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async resetPassword(token: string, password: string): Promise<{ message: string }> {
        return this.request<{ message: string }>('/auth/reset-password', {
            method: 'POST',
            body: JSON.stringify({ token, password }),
        });
    }

    async updateProfile(data: { name?: string; avatar?: string | null }): Promise<User> {
        return this.request<User>('/auth/profile', {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async uploadImage(file: File): Promise<{ url: string }> {
        const token = getToken();
        const formData = new FormData();
        formData.append('image', file);

        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE}/upload/image`, {
            method: 'POST',
            body: formData,
            headers,
            credentials: 'include',
        });

        if (!response.ok) {
            let errorMsg = 'Image upload failed';
            try {
                const errJson = await response.json();
                if (errJson && errJson.message) {
                    errorMsg = errJson.message;
                }
            } catch { }
            throw new Error(errorMsg);
        }

        return response.json();
    }
}

export const authApi = new AuthApiService();
