import { NextRequest, NextResponse } from 'next/server';

/**
 * Routes that require authentication.
 * Any path starting with these prefixes will trigger a redirect to /auth if no cookie is present.
 */
const PROTECTED_PREFIXES = ['/dashboard'];

/**
 * Routes that authenticated users should NOT be able to visit.
 * (e.g. login/signup when already logged in)
 */
const AUTH_PREFIXES = ['/auth'];

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Check if the JWT cookie is present (set by the backend on login/register).
    // We only check presence here — actual validity is enforced by the backend on every API call.
    const hasToken = req.cookies.has('token');

    const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
    const isAuthRoute = AUTH_PREFIXES.some((p) => pathname.startsWith(p));

    // Unauthenticated user trying to access a protected page → redirect to auth
    if (isProtected && !hasToken) {
        const loginUrl = req.nextUrl.clone();
        loginUrl.pathname = '/auth';
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Authenticated user trying to visit auth pages → redirect to dashboard
    if (isAuthRoute && hasToken && pathname !== '/auth/callback') {
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
         * - api routes
         * - _next static files
         * - _next image files
         * - favicon.ico
         * - public files
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
