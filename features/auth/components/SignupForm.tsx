import * as React from 'react';
import { Eye, EyeOff, Mail, ArrowLeft, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { useAuth } from '../context/auth-context';
import { SignupDTO } from '../types';
import { GoogleLoginButton } from './GoogleLoginButton';
import { authApi } from '../services/auth.api';
import { setToken } from '../services/token.storage';

interface SignupFormProps {
    onSwitchToLogin: () => void;
}

/** How long (in seconds) the user must wait before resending the code. */
const RESEND_COOLDOWN_SECONDS = 30;

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
    const { loginWithGoogle } = useAuth();
    const router = useRouter();

    // ── Form state ───────────────────────────────────────────────
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [formData, setFormData] = React.useState<SignupDTO>({
        username: '',
        email: '',
        password: '',
    });

    // ── OTP / verification state ─────────────────────────────────
    const [isVerifying, setIsVerifying] = React.useState(false);
    const [verificationCode, setVerificationCode] = React.useState('');
    const [verificationError, setVerificationError] = React.useState<string | null>(null);

    // Resend cooldown
    const [resendCooldown, setResendCooldown] = React.useState(0);
    const cooldownRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const startCooldown = React.useCallback(() => {
        setResendCooldown(RESEND_COOLDOWN_SECONDS);
        if (cooldownRef.current) clearInterval(cooldownRef.current);
        cooldownRef.current = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current!);
                    cooldownRef.current = null;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    React.useEffect(() => {
        return () => {
            if (cooldownRef.current) clearInterval(cooldownRef.current);
        };
    }, []);

    // ── Step 1: send verification code ──────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.username.trim() || !formData.email.trim() || !formData.password) {
            setError('Please fill in all fields.');
            return;
        }

        setIsLoading(true);
        try {
            await authApi.sendVerificationCode(formData.email);
            setIsVerifying(true);
            startCooldown();
        } catch (err: any) {
            setError(err.message || 'Could not send verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Step 1b: resend code ──────────────────────────────────────
    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setVerificationError(null);
        setIsLoading(true);
        try {
            await authApi.sendVerificationCode(formData.email);
            setVerificationCode('');
            startCooldown();
        } catch (err: any) {
            setVerificationError(err.message || 'Could not resend code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ── Step 2: verify code & create account ─────────────────────
    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerificationError(null);

        if (verificationCode.trim().length !== 6) {
            setVerificationError('Please enter the 6-digit code from your email.');
            return;
        }

        setIsLoading(true);
        try {
            const result = await authApi.verifyAndSignup({
                email: formData.email,
                code: verificationCode.trim(),
                name: formData.username,
                password: formData.password!,
            });

            // Store token and hydrate auth state, then redirect
            setToken(result.accessToken);
            router.push('/dashboard');
        } catch (err: any) {
            setVerificationError(err.message || 'Verification failed. Please check the code and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ── OTP screen ───────────────────────────────────────────────
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
                        We sent a 6-digit code to{' '}
                        <span className="text-foreground font-bold">{formData.email}</span>.
                        Check your inbox (and spam folder).
                    </p>
                </div>

                <form onSubmit={handleVerifySubmit} className="space-y-4">
                    <Input
                        label="6-Digit Verification Code"
                        placeholder="e.g. 482910"
                        maxLength={6}
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        required
                        disabled={isLoading}
                    />

                    {/* Resend button */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendCooldown > 0 || isLoading}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <RotateCcw className="h-3 w-3" />
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                        </button>
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
                        Verify &amp; Complete Signup
                    </Button>
                </form>
            </div>
        );
    }

    // ── Signup form ──────────────────────────────────────────────
    return (
        <div className="space-y-6">
            <div className="space-y-1 text-left">
                <h2 className="text-2xl font-display font-bold tracking-tight text-foreground">
                    Create an account
                </h2>
                <p className="text-sm text-muted-foreground font-medium">
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
                        placeholder="Create a password (min. 8 characters)"
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
                    <Mail className="h-4 w-4 mr-2" />
                    Sign Up with Email
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
                        isLoading={isLoading}
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
