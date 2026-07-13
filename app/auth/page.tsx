'use client';

import { AuthContainer } from '@/features/auth/components/AuthContainer';
import { useAuth } from '@/features/auth/context/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
    google_failed: 'Google sign-in failed. Please try again or use email & password.',
    session_expired: 'Your session has expired. Please sign in again.',
    AuthenticationFailed: 'Authentication failed. Please sign in again.',
};

function AuthPageInner() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'An error occurred. Please try again.') : null;

    // Show a "taking longer than expected" hint after 6s of loading.
    // This prevents the user from thinking the app is frozen if the
    // backend is slow to respond (e.g. cold-start on free tier hosting).
    const [isSlowLoad, setIsSlowLoad] = useState(false);
    useEffect(() => {
        if (!isLoading) {
            setIsSlowLoad(false);
            return;
        }
        const timer = setTimeout(() => setIsSlowLoad(true), 6000);
        return () => clearTimeout(timer);
    }, [isLoading]);

    useEffect(() => {
        if (user && !isLoading) {
            const redirect = searchParams.get('redirect');
            router.replace(redirect && redirect.startsWith('/') ? redirect : '/dashboard');
        }
    }, [user, isLoading, router, searchParams]);

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4 max-w-xs text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Loading…
                    </p>
                    {isSlowLoad && (
                        <div className="mt-2 space-y-3">
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Taking longer than expected. The server may be waking up.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:underline cursor-pointer"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Try again
                            </button>
                        </div>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background">
            {errorMessage && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive shadow-md max-w-sm w-full">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}
            <AuthContainer />
        </main>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </main>
        }>
            <AuthPageInner />
        </Suspense>
    );
}
