'use client';

import { useState } from 'react';
import { authApi, ApiError } from '../services/auth.api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import Link from 'next/link';

export function ForgotPasswordForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            await authApi.requestPasswordReset(email);
            setSuccess(true);
            setEmail('');
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

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-left space-y-1">
                <h1 className="text-2xl font-display font-bold text-foreground">Forgot Password?</h1>
                <p className="text-sm text-muted-foreground font-medium">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            {success ? (
                <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-md">
                    <p className="text-green-500 text-xs font-semibold">
                        If an account with that email exists, a password reset link has been sent. Please check your inbox.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-md">
                            <p className="text-destructive text-xs font-medium">{error}</p>
                        </div>
                    )}

                    <Input
                        id="email"
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        required
                        disabled={isLoading}
                    />

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={isLoading || !email}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                </form>
            )}

            <div className="text-center">
                <Link
                    href="/auth"
                    className="text-xs text-primary hover:text-primary/80 font-bold transition-colors"
                >
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}
