"use client";

import * as React from 'react';
import { Logo } from '@/shared/ui/logo';
import { ThemeToggle } from '@/features/landing/components/Header';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
        <div className="flex min-h-screen w-full bg-background relative overflow-hidden">
            {/* Dot Grid Background */}
            <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />

            {/* Left Branding Panel (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-secondary p-12 relative overflow-hidden border-r border-border">
                {/* Visual texture */}
                <div className="absolute inset-0 dot-grid opacity-[0.25] pointer-events-none" />
                <div className="absolute -top-[200px] -left-[200px] w-[500px] h-[500px] bg-primary/10 rounded-full warm-glow animate-orb-slow" />
                
                {/* Top: Logo & Theme Switcher */}
                <div className="relative z-10 flex items-center justify-between">
                    <Logo />
                    <ThemeToggle />
                </div>

                {/* Center: Hero Branding Content */}
                <div className="flex flex-col items-start max-w-lg z-10 relative mt-12">
                    {/* Decorative Abstract geometric widget */}
                    <div className="mb-10 relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-lg rotate-3 opacity-30 blur-md group-hover:rotate-6 transition-transform duration-500" />
                        <div className="relative flex items-center justify-center w-28 h-28 bg-background border border-border rounded-lg shadow-sm group-hover:-translate-y-1 transition-transform duration-300">
                             <div className="w-12 h-12 relative">
                                <div className="absolute inset-0 border-2 border-primary rounded-sm rotate-45 transform origin-center transition-all duration-500 group-hover:rotate-90 group-hover:scale-105" />
                                <div className="absolute inset-1.5 border-2 border-accent rounded-sm -rotate-12 transform origin-center transition-all duration-700 group-hover:rotate-45 group-hover:scale-95" />
                             </div>
                        </div>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-display font-black tracking-tight mb-5 text-foreground leading-[1.05]">
                        Welcome to <br />
                        <span className="text-gradient">Flowgate</span>
                    </h1>

                    <p className="text-base text-muted-foreground leading-relaxed font-medium">
                        Optimizing queue operations, reducing wait times, and building beautiful flow experiences for customers worldwide.
                    </p>
                </div>

                {/* Bottom: Copyright */}
                <div className="text-xs text-muted-foreground font-semibold z-10">
                    © {new Date().getFullYear()} Flowgate, Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side: Form Container */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8 bg-background lg:bg-transparent border border-border/80 lg:border-none shadow-xs lg:shadow-none p-8 lg:p-0 rounded-md">
                    <div className="lg:hidden flex justify-between items-center mb-8 border-b border-border/60 pb-4">
                        <Logo />
                        <ThemeToggle />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
