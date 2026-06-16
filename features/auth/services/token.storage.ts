/**
 * @file token.storage.ts
 * @description Centralised JWT token storage for the web frontend.
 *
 * Strategy
 * --------
 * The backend issues an HttpOnly cookie when the client is on the SAME domain.
 * In production (frontend on app.example.com, backend on api.example.com) the
 * cookie is set on the BACKEND domain and is therefore invisible to the
 * frontend. To fix this cross-domain problem without requiring a shared domain,
 * we:
 *
 *  1. Store the JWT in `localStorage` (client-side, persists across tabs/reloads).
 *  2. Keep a lightweight non-HttpOnly cookie called `session` that mirrors the
 *     PRESENCE of the token — Next.js middleware can read this server-side to
 *     decide whether to gate a protected route.  It never contains the real token.
 *  3. Every API request sends the token via `Authorization: Bearer <token>` so
 *     it works regardless of the cookie domain.
 *
 * NOTE: All functions are no-ops on the server (SSR) because `localStorage` and
 * `document.cookie` are browser-only APIs.
 */

const TOKEN_KEY = 'qline_auth_token';
const SESSION_COOKIE = 'session';

/** Returns true when running in a browser context. */
const isBrowser = () => typeof window !== 'undefined';

/**
 * Persists the JWT access token in localStorage and sets the session flag cookie.
 */
export function setToken(token: string): void {
    if (!isBrowser()) return;
    localStorage.setItem(TOKEN_KEY, token);
    // Session flag cookie — not HttpOnly so JS can manage it.
    // Expires in 7 days, matching the JWT lifetime.
    const maxAge = 7 * 24 * 60 * 60;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${SESSION_COOKIE}=1; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

/**
 * Retrieves the JWT access token from localStorage.
 * Returns null if not found or running on the server.
 */
export function getToken(): string | null {
    if (!isBrowser()) return null;
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Removes the JWT from localStorage and clears the session flag cookie.
 */
export function clearToken(): void {
    if (!isBrowser()) return;
    localStorage.removeItem(TOKEN_KEY);
    document.cookie = `${SESSION_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

/**
 * Returns true if a token currently exists in storage.
 */
export function hasToken(): boolean {
    return getToken() !== null;
}
