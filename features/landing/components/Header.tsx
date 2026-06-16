'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/features/auth/context/auth-context';
import { Logo } from '@/shared/ui/logo';
import { useTheme } from '@/shared/context/theme-context';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-8.5 h-8.5 rounded-md border border-border bg-secondary/50" />;
    }

    return (
        <button 
            onClick={toggleTheme} 
            className="relative p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border/60 overflow-hidden w-8.5 h-8.5 flex items-center justify-center cursor-pointer"
            aria-label="Toggle Theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                    <motion.div
                        key="sun"
                        initial={{ y: 15, opacity: 0, rotate: -40 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -15, opacity: 0, rotate: 40 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Sun className="h-4.5 w-4.5 text-accent" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ y: 15, opacity: 0, rotate: 40 }}
                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                        exit={{ y: -15, opacity: 0, rotate: -40 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Moon className="h-4.5 w-4.5 text-primary" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
}

export function Header() {
    const { user, isLoading } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
            scrolled 
                ? 'bg-background/85 backdrop-blur-md border-border/80 shadow-xs py-3' 
                : 'bg-transparent border-transparent py-4'
        }`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="hover:opacity-90 transition-opacity">
                        <Logo />
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            How it works
                        </Link>
                        <Link href="#download" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Download App
                        </Link>
                    </nav>

                    {/* Auth & Theme Toggle */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        
                        {user && !isLoading ? (
                            <Link href="/dashboard">
                                <Button variant="primary" size="default">
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/auth" className="hidden sm:block">
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
