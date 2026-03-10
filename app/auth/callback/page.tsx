'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth-context';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait for connection to verify auth state
        if (!isLoading) {
            if (user) {
                // Successful login
                router.push('/');
            } else {
                // Failed to verify user after callback
                // This could happen if cookie setting failed or backend returned 401
                router.push('/?error=AuthenticationFailed');
            }
        }
    }, [user, isLoading, router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Completing login...</p>
            </div>
        </div>
    );
}
