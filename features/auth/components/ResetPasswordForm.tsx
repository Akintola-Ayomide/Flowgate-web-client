'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { authApi, ApiError } from '../services/auth.api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import Link from 'next/link';

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
                <div className="text-left space-y-1">
                    <h1 className="text-2xl font-display font-bold text-foreground">Reset Password</h1>
                </div>
                <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-md">
                    <p className="text-destructive text-xs font-medium">{error}</p>
                </div>
                <div className="text-center">
                    <Link
                        href="/auth/forgot-password"
                        className="text-xs text-primary hover:text-primary/80 font-bold uppercase tracking-wider transition-colors"
                    >
                        Request New Reset Link →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-left space-y-1">
                <h1 className="text-2xl font-display font-bold text-foreground">Set New Password</h1>
                <p className="text-sm text-muted-foreground font-medium">
                    Please enter your new password below.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-md">
                        <p className="text-destructive text-xs font-medium">{error}</p>
                    </div>
                )}

                <Input
                    id="password"
                    label="New Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                    minLength={6}
                />

                <Input
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                    disabled={isLoading}
                    minLength={6}
                />

                <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isLoading || !password || !confirmPassword}
                >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </Button>
            </form>

            <div className="text-center">
                <Link
                    href="/auth"
                    className="text-xs text-primary hover:text-primary/80 font-bold uppercase tracking-wider transition-colors"
                >
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}
