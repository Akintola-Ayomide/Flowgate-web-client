'use client';

import { Logo } from '@/shared/ui/logo';

export function Footer() {
    return (
        <footer className="bg-secondary text-muted-foreground py-16 px-6 border-t border-border relative overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-12 flex flex-col items-center text-center">
                    {/* Brand Section */}
                    <div className="space-y-4 max-w-sm mx-auto flex flex-col items-center">
                        <Logo />
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            The intelligent, high-precision platform for seamless customer flow and queue management.
                        </p>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border/80 flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                    <p className="text-xs font-semibold">
                        © {new Date().getFullYear()} Flowgate Inc. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold">
                        Created by <span className="text-primary hover:underline cursor-pointer">Ayothega</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
