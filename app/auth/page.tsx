'use client';

import { AuthContainer } from '@/features/auth/components/AuthContainer';
import { useAuth } from '@/features/auth/context/auth-context';
import { Button } from '@/shared/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();

    // Redirect authenticated users to dashboard (or you can create a dashboard route)
    useEffect(() => {
        if (user && !isLoading) {
            // For now, we'll show a welcome screen, but you can redirect to /dashboard later
            // router.push('/dashboard');
        }
    }, [user, isLoading]);

    if (isLoading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </main>
        );
    }

    if (user) {
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
                <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center space-y-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                        <p className="text-gray-500">You're successfully logged in</p>
                    </div>
                    <div className="space-y-2 py-4 border-y border-gray-100">
                        <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                        <p className="text-gray-600">{user.email}</p>
                    </div>
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/')}
                            variant="secondary"
                            className="w-full"
                        >
                            Back to Home
                        </Button>
                        <Button
                            onClick={() => logout()}
                            variant="ghost"
                            className="w-full text-red-600 hover:bg-red-50"
                        >
                            Sign Out
                        </Button>
                    </div>
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
