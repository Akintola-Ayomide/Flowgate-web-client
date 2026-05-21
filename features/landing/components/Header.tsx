'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/features/auth/context/auth-context';

export function Header() {
    const { user, isLoading } = useAuth();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo - matching auth design */}
                    <Link href="/" className="flex items-baseline group">
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 font-momo text-4xl italic font-extrabold leading-none select-none mr-0.5 md:mr-1 drop-shadow-sm group-hover:scale-105 transition-transform">
                            Q
                        </span>
                        <span className="text-xl font-bold tracking-tight text-slate-900">line</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            How it works
                        </Link>
                        <Link href="#download" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                            Download App
                        </Link>
                    </nav>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {user && !isLoading ? (
                            <Link href="/dashboard">
                                <Button variant="primary" size="default">
                                    Go to Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth">
                                    <Button variant="ghost" size="default">
                                        Log in
                                    </Button>
                                </Link>
                                <Link href="/auth">
                                    <Button variant="primary" size="default">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
