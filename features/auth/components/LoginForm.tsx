import * as React from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import { useAuth } from '../context/auth-context';
import { LoginDTO } from '../types';
import { GoogleLoginButton } from './GoogleLoginButton';

interface LoginFormProps {
    onSwitchToSignup: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
    const { login, isLoading: isAuthLoading, loginWithGoogle } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);

    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState<LoginDTO>({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(formData);
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-left">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
                <p className="text-sm text-gray-500">
                    Welcome back! Please enter your details.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <Input
                        label="Email / Username"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isLoading}
                    />

                    <div className="space-y-1">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password-field" className="text-sm font-semibold text-gray-700 leading-none">
                                Password
                            </label>
                            <Link href="/auth/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password-field"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                disabled={isLoading}
                                rightItem={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <Checkbox
                        label="Remember me"
                        id="remember-me"
                    />
                </div>

                {error && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                        {error}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                >
                    Log In
                </Button>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="grid gap-2">
                    <GoogleLoginButton onClick={loginWithGoogle} isLoading={isLoading || isAuthLoading} />
                </div>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-500">Don't have an account? </span>
                <button
                    onClick={onSwitchToSignup}
                    className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}
