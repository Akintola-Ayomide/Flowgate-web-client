'use client';

import { AuthContainer } from '@/features/auth/components/AuthContainer';
import { useAuth } from '@/features/auth/context/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

function AuthPageInner() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (user && !isLoading) {
            const redirect = searchParams.get('redirect');
            router.replace(redirect && redirect.startsWith('/') ? redirect : '/dashboard');
        }
    }, [user, isLoading, router, searchParams]);

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-500">Loading…</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white">
            <AuthContainer />
        </main>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </main>
        }>
            <AuthPageInner />
        </Suspense>
    );
}
