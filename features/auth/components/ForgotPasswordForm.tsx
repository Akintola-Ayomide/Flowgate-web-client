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
            const response = await authApi.requestPasswordReset(email);
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
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900">Forgot Password?</h1>
                <p className="text-slate-600">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            {success ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                        If an account with that email exists, a password reset link has been sent. Please check your inbox.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email Address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
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
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    ← Back to Login
                </Link>
            </div>
        </div>
    );
}
