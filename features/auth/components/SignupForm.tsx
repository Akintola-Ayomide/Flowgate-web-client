import * as React from 'react';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Simulated email verification states
    const [isVerifying, setIsVerifying] = React.useState(false);
    const [verificationCode, setVerificationCode] = React.useState('');
    const [verificationError, setVerificationError] = React.useState<string | null>(null);

    const [formData, setFormData] = React.useState<SignupDTO>({
        username: '',
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Simple check to make sure fields are populated before proceeding to verify
        if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
            return;
        }

        // Trigger simulated verification screen
        setIsVerifying(true);
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerificationError(null);
        setIsLoading(true);

        if (verificationCode.trim() !== '123456') {
            setVerificationError('Invalid verification code. Enter 123456 to verify.');
            setIsLoading(false);
            return;
        }

        try {
            await signup(formData);
            router.push('/dashboard');
        } catch (err: any) {
            setVerificationError(err.message || 'Could not create account. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isVerifying) {
        return (
            <div className="space-y-6">
                <div className="space-y-1 text-left">
                    <button
                        type="button"
                        onClick={() => {
                            setIsVerifying(false);
                            setVerificationCode('');
                            setVerificationError(null);
                        }}
                        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold mb-2 cursor-pointer transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to signup</span>
                    </button>
                    <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">
                        Verify your email
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">
                        We have sent a verification code to <span className="text-foreground font-bold">{formData.email}</span>.
                    </p>
                </div>

                <form onSubmit={handleVerifySubmit} className="space-y-4">
                    <Input
                        label="6-Digit Verification Code"
                        placeholder="e.g. 123456"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        disabled={isLoading}
                    />

                    <div className="p-3 bg-primary/5 text-primary text-xs rounded-md border border-primary/10 font-semibold flex items-start gap-2.5">
                        <AlertCircle className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <div>
                            <p className="font-bold">Verification Simulation Mode</p>
                            <p className="font-normal text-muted-foreground mt-0.5">Please enter the simulated activation code <span className="text-primary font-bold">123456</span> to complete your verification.</p>
                        </div>
                    </div>

                    {verificationError && (
                        <div className="p-3 bg-destructive/5 text-destructive text-xs rounded-md border border-destructive/10 font-medium">
                            {verificationError}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        isLoading={isLoading}
                    >
                        Verify & Complete Signup
                    </Button>
                </form>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="space-y-1 text-left">
                <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">
                    Create an account
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
                    Start your journey with Flowgate today.
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
                    Sign Up
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
                    <GoogleLoginButton
                        text="Sign up with Google"
                        onClick={loginWithGoogle}
                        isLoading={isLoading || isAuthLoading}
                    />
                </div>
            </form>

            <div className="text-center text-sm">
                <span className="text-muted-foreground font-medium">Already have an account? </span>
                <button
                    onClick={onSwitchToLogin}
                    className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all cursor-pointer"
                >
                    Log In
                </button>
            </div>
        </div>
    );
}
