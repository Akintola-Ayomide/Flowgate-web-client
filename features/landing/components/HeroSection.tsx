'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { motion, Variants } from 'framer-motion';
import { useAuth } from '@/features/auth/context/auth-context';
import { ArrowRight } from 'lucide-react';

export function HeroSection() {
    const { user, isLoading } = useAuth();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        },
    };

    return (
        <section className="relative min-h-[90vh] flex flex-col justify-between pt-32 overflow-hidden bg-background">
            {/* Background patterns */}
            <div className="absolute inset-0 dot-grid opacity-[0.2] pointer-events-none" />
            
            {/* Floating Warm Gradient Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full warm-glow animate-orb-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-accent/10 rounded-full warm-glow animate-orb-delayed" />
            
            {/* Main content */}
            <div className="max-w-7xl mx-auto px-6 w-full z-10 flex-1 flex items-center justify-center">
                <motion.div
                    className="flex flex-col items-center text-center space-y-8 max-w-4xl"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Badge */}
                    <motion.div 
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold tracking-wider text-primary uppercase font-display"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                        Next-Gen Queue & Flow Control
                    </motion.div>

                    {/* Headline */}
                    <motion.h1
                        className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-foreground leading-[1.05]"
                        variants={itemVariants}
                    >
                        Seamless <span className="text-gradient">Workflow</span> &<br /> 
                        Queue Management
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        className="text-base md:text-lg text-muted-foreground max-w-2xl text-balance font-medium"
                        variants={itemVariants}
                    >
                        Eliminate wait times, optimize customer flow, and scale operations with Flowgate's warm industrial, high-precision queue management platform.
                    </motion.p>

                    {/* Actions */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full sm:w-auto"
                        variants={itemVariants}
                    >
                        <Link href={user && !isLoading ? "/dashboard" : "/auth"} className="w-full sm:w-auto">
                            <Button variant="primary" size="lg" className="w-full h-12 px-6 rounded-md group text-sm font-semibold shadow-glow">
                                {user && !isLoading ? "Go to Dashboard" : "Start For Free"}
                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </Button>
                        </Link>
                        <Link href="#how-it-works" className="w-full sm:w-auto">
                            <Button variant="secondary" size="lg" className="w-full h-12 px-6 rounded-md text-sm font-semibold">
                                Learn How it Works
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
