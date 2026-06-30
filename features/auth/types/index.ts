export interface User {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    provider?: 'local' | 'google' | 'guest';
}

export interface LoginDTO {
    email: string;
    password: string;
}

export interface SignupDTO {
    username: string;
    email: string;
    password?: string;
}

/** Matches the exact shape returned by the NestJS backend */
export interface AuthResponse {
    user: User;
    accessToken: string;
}

export type AuthMode = 'login' | 'signup';
