export interface User {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    provider?: 'local' | 'google';
}

export interface LoginDTO {
    email: string;
    password?: string; // Optional because in the UI "Email / Username" is one field
}

export interface SignupDTO {
    username: string;
    email: string;
    password?: string;
}

export interface AuthResponse {
    user: User;
    token?: string;
}

export type AuthMode = 'login' | 'signup';
