'use client';

/**
 * @file app/auth/callback/page.tsx
 * @description Handles the redirect from the backend after a Google OAuth flow.
 *
 * Flow
 * ────
 * 1. Backend authenticates the user via Google.
 * 2. Backend sets an HttpOnly cookie AND redirects to:
 *      `FRONTEND_URL/auth/callback?token=<jwt>`
 *    The query param is the fallback for cross-domain production deployments
 *    where the backend cookie won't be visible to the frontend domain.
 * 3. This page reads the token from the URL, stores it via `handleGoogleCallback`,
 *    clears it from the URL (so it's not left in history), then redirects to
 *    the dashboard.
 * 4. If no token is found in the URL, the context's `checkAuth` may still
 *    succeed via the HttpOnly cookie (same-domain / dev scenarios).
 */

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth-context';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

function AuthCallbackInner() {
    const { user, isLoading, handleGoogleCallback } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const handled = useRef(false);

    useEffect(() => {
        // Guard against running twice in React StrictMode
        if (handled.current) return;

        const token = searchParams.get('token');

        if (token) {
            // Cross-domain flow: token was passed in the URL by the backend.
            handled.current = true;

            // Remove the token from the URL immediately (don't leave it in browser history).
            window.history.replaceState({}, '', '/auth/callback');

            handleGoogleCallback(token)
                .then(() => {
                    router.replace('/dashboard');
                })
                .catch(() => {
                    router.replace('/auth?error=google_failed');
                });
        }
        // If no token in URL, wait for the context's own checkAuth to complete
        // (it will succeed if the HttpOnly cookie was set by the backend on the same domain).
    }, [searchParams, handleGoogleCallback, router]);

    // Once the context has resolved without a URL token, check the result.
    useEffect(() => {
        if (handled.current) return;  // Already handled via URL token above
        const token = searchParams.get('token');
        if (token) return;            // Will be handled by the effect above

        if (!isLoading) {
            if (user) {
                router.replace('/dashboard');
            } else {
                // Neither cookie nor token worked — auth genuinely failed.
                router.replace('/auth?error=google_failed');
            }
        }
    }, [user, isLoading, router, searchParams]);

    return (
        <main className="flex h-screen w-full items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-medium text-muted-foreground">
                    Completing sign-in…
                </p>
            </div>
        </main>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <main className="flex h-screen w-full items-center justify-center bg-background">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </main>
            }
        >
            <AuthCallbackInner />
        </Suspense>
    );
}
