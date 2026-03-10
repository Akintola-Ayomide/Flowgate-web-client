import { LoginDTO, SignupDTO, AuthResponse, User } from '../types';

const getApiBaseUrl = (): string => {
    if (process.env.NEXT_PUBLIC_API_URL) {
        return process.env.NEXT_PUBLIC_API_URL;
    }
    if (process.env.NODE_ENV === 'production') {
        throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables');
    }
    return 'http://localhost:8000';
};

const API_BASE = getApiBaseUrl();

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public code?: string,
        public fieldErrors?: Record<string, string[]>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

class AuthService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include', // Ensure cookies are sent/received
        });

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
            } catch {
                errorData = { message: 'An unexpected error occurred' };
            }

            throw new ApiError(
                response.status,
                errorData.message || 'API request failed',
                errorData.code,
                errorData.errors // Assuming backend might send validation errors here
            );
        }

        return response.json();
    }

    async login(data: LoginDTO): Promise<AuthResponse> {
        return this.request<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async signup(data: SignupDTO): Promise<AuthResponse> {
        // Map frontend DTO (username) to backend DTO (name)
        const payload = {
            ...data,
            name: data.username,
        };
        return this.request<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    async getProfile(): Promise<User> {
        return this.request<User>('/auth/profile');
    }

    async logout(): Promise<void> {
        // Best effort logout. Even if it fails, client clears state.
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } catch (e) {
            console.warn('Logout failed on server', e);
        }
    }

    initiateGoogleLogin() {
        window.location.href = `${API_BASE}/auth/google`;
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
}

export const authApi = new AuthService();

