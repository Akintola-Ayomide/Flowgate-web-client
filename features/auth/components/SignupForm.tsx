import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useAuth } from '../context/auth-context';
import { SignupDTO } from '../types';
import { GoogleLoginButton } from './GoogleLoginButton';

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
    const { signup, isLoading: isAuthLoading, loginWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState<SignupDTO>({
        username: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await signup(formData);
            alert('Account created! Please log in.');
            onSwitchToLogin();
        } catch (err: any) {
            setError(err.message || 'Could not create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="space-y-2 text-left">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                    Create an account
                </h2>
                <p className="text-sm text-gray-500">
                    Start your journey with Qline today.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Username"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    disabled={isLoading}
                />

                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isLoading}
                />

                <div className="relative">
                    <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
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
                    Sign Up
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
                    <GoogleLoginButton
                        text="Sign up with Google"
                        onClick={loginWithGoogle}
                        isLoading={isLoading || isAuthLoading}
                    />
                </div>
            </form>

            <div className="text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <button
                    onClick={onSwitchToLogin}
                    className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition-all"
                >
                    Log In
                </button>
            </div>
        </div>
    );
}
