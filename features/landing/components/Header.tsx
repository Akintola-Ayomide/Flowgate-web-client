'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { useAuth } from '@/features/auth/context/auth-context';
import { Logo } from '@/shared/ui/logo';
import { useTheme } from '@/shared/context/theme-context';
import { Sun, Moon, Menu, X } from 'lucide-react';
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

const NAV_LINKS = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#download', label: 'Download App' },
];

export function Header() {
    const { user, isLoading } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route-equivalent scroll (anchor click)
    const closeMenu = () => setMenuOpen(false);

    return (
        <>
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
            scrolled || menuOpen
                ? 'bg-background/95 backdrop-blur-md border-border/80 shadow-xs py-3' 
                : 'bg-transparent border-transparent py-4'
        }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="hover:opacity-90 transition-opacity" onClick={closeMenu}>
                        <Logo />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side: Auth buttons + Theme Toggle + Mobile Hamburger */}
                    <div className="flex items-center gap-2 sm:gap-3">
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
                                <Link href="/auth" className="hidden sm:block">
                                    <Button variant="primary" size="default">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* Mobile Hamburger — only visible below md */}
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md border border-border/60 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {menuOpen ? (
                                    <motion.div
                                        key="close"
                                        initial={{ rotate: -45, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 45, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <X className="h-4.5 w-4.5" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="menu"
                                        initial={{ rotate: 45, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -45, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Menu className="h-4.5 w-4.5" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>
            </div>
        </header>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
            {menuOpen && (
                <motion.div
                    key="mobile-menu"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="fixed inset-x-0 top-[57px] z-40 md:hidden bg-background/98 backdrop-blur-xl border-b border-border/80 shadow-lg"
                >
                    <nav className="max-w-7xl mx-auto px-4 py-5 flex flex-col gap-1">
                        {NAV_LINKS.map((link, i) => (
                            <motion.div
                                key={link.href}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05, duration: 0.2 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={closeMenu}
                                    className="block px-3 py-3 rounded-md text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}

                        {/* Auth buttons in mobile menu */}
                        <div className="mt-4 pt-4 border-t border-border/60 flex flex-col gap-2">
                            {user && !isLoading ? (
                                <Link href="/dashboard" onClick={closeMenu}>
                                    <Button variant="primary" className="w-full">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/auth" onClick={closeMenu}>
                                        <Button variant="ghost" className="w-full">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/auth" onClick={closeMenu}>
                                        <Button variant="primary" className="w-full">
                                            Sign Up
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
}
