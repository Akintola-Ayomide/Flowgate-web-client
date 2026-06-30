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
            <div className="space-y-1 text-left">
                <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">
                    Sign in to your account
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                    Welcome back! Please enter your credentials.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                    <Input
                        label="Email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={isLoading}
                    />

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label htmlFor="password-field" className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none">
                                Password
                            </label>
                            <Link href="/auth/forgot-password" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
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
                                        className="text-muted-foreground hover:text-foreground focus:outline-none transition-colors mr-1 cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
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
                    <div className="p-3 bg-destructive/5 text-destructive text-xs rounded-md border border-destructive/10 font-medium">
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

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                        <span className="bg-background lg:bg-secondary/15 px-2.5 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="grid gap-2">
                    <GoogleLoginButton onClick={loginWithGoogle} isLoading={isLoading || isAuthLoading} />
                </div>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground font-medium">Don't have an account? </span>
                <button
                    onClick={onSwitchToSignup}
                    className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all cursor-pointer"
                >
                    Sign Up
                </button>
            </div>
        </div>
    );
}
