import { NextRequest, NextResponse } from 'next/server';

/**
 * Routes that require authentication.
 * Any path starting with these prefixes will redirect to /auth if not authenticated.
 */
const PROTECTED_PREFIXES = ['/dashboard'];

/**
 * Routes that authenticated users should NOT visit (e.g. login when already logged in).
 */
const AUTH_PREFIXES = ['/auth'];

/**
 * The auth callback page must always be accessible — even for authenticated users —
 * because it is where the Google OAuth flow lands to set up the session.
 */
const AUTH_CALLBACK = '/auth/callback';

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    /**
     * Detect authentication via two cookie mechanisms:
     *
     * 1. `token`   — HttpOnly cookie set by the backend (works in same-domain / dev proxy).
     * 2. `session` — Non-HttpOnly cookie set by the frontend JS after storing the JWT in
     *                localStorage (works in cross-domain production deployments).
     *
     * The middleware only needs to know IF the user is authenticated, not verify the JWT
     * (that is enforced by the backend on every API call).
     */
    const hasToken = req.cookies.has('token') || req.cookies.has('session');

    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
    const isAuthRoute = AUTH_PREFIXES.some((p) => pathname.startsWith(p));
    const isCallbackPage = pathname === AUTH_CALLBACK || pathname.startsWith(AUTH_CALLBACK);

    // Unauthenticated user → redirect to /auth (preserving the intended destination)
    if (isProtected && !hasToken) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/auth';
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Authenticated user trying to visit auth pages → send to dashboard
    // Exception: always allow the /auth/callback page so the OAuth flow can complete.
    if (isAuthRoute && hasToken && !isCallbackPage) {
        const dashboardUrl = req.nextUrl.clone();
        dashboardUrl.pathname = '/dashboard';
        dashboardUrl.search = '';
        return NextResponse.redirect(dashboardUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - api routes (Next.js rewrites / route handlers)
         * - _next static files
         * - _next image optimisation
         * - favicon.ico
         * - public static assets
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
