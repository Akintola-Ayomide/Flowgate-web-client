'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authApi, ApiError } from '../services/auth.api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

export function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        if (!tokenParam) {
            setError('Invalid or missing reset token. Please request a new password reset link.');
        } else {
            setToken(tokenParam);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword(token, password);
            // Success - redirect to login
            router.push('/auth?reset=success');
        } catch (err) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!token && error) {
        return (
            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
                </div>
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                </div>
                <div className="text-center">
                    <a
                        href="/auth/forgot-password"
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Request New Reset Link →
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Set New Password</h1>
                <p className="text-slate-600">
                    Please enter your new password below.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                        New Password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                        disabled={isLoading}
                        minLength={6}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                        Confirm Password
                    </label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        disabled={isLoading}
                        minLength={6}
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isLoading || !password || !confirmPassword}
                >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
            </form>

            <div className="text-center">
                <a
                    href="/auth"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    ← Back to Login
                </a>
            </div>
        </div>
    );
}
