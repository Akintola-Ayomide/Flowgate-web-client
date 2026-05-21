'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { motion, Variants } from 'framer-motion';
import { useAuth } from '@/features/auth/context/auth-context';

export function HeroSection() {
    const { user, isLoading } = useAuth();

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    const statVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <section className="min-h-screen flex items-center pt-16">
            <div className="flex w-full min-h-screen">
                {/* Left Branding Section - matching auth layout */}
                <motion.div
                    className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-12 text-blue-900 relative overflow-hidden"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    {/* Logo */}
                    <motion.div
                        className="flex items-baseline relative z-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 font-momo text-7xl italic font-extrabold leading-none select-none mr-0.5 md:mr-1 drop-shadow-sm">
                            Q
                        </span>
                        <span className="text-3xl font-bold tracking-tight text-slate-900">line</span>
                    </motion.div>

                    {/* Hero Content */}
                    <div className="flex flex-col items-center text-center max-w-lg mx-auto z-10 relative">
                        {/* Decorative Elements behind Q */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"

                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        <motion.div
                            className="mb-8 relative group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="absolute inset-0 bg-blue-600 rounded-[2rem] rotate-6 opacity-20 blur-xl group-hover:rotate-12 transition-transform duration-500" />
                            <div className="relative flex items-center justify-center w-32 h-32 bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-2xl shadow-blue-900/5 group-hover:-translate-y-2 transition-transform duration-500">
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 font-momo text-7xl italic font-extrabold leading-none select-none">
                                    Q
                                </span>
                            </div>
                        </motion.div>

                        <motion.h1
                            className="text-5xl font-bold tracking-tight mb-6 text-slate-900 drop-shadow-sm"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            AI Powered<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Queue Management</span>
                        </motion.h1>

                        <motion.p
                            className="text-lg text-slate-600 leading-relaxed font-medium text-balance"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            Streamline your waiting lines, enhance customer experience and gain valuable insights with our intelligent queue management system.
                        </motion.p>
                    </div>

                    {/* Copyright */}
                    <motion.div
                        className="text-sm text-slate-500 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.6 }}
                    >
                        © {new Date().getFullYear()} Qline, Inc. All rights reserved.
                    </motion.div>

                    {/* Decorative Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
                </motion.div>

                {/* Right Content Section */}
                <motion.div
                    className="flex-1 flex flex-col justify-center items-center p-8 lg:p-12 bg-white relative"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="w-full max-w-2xl space-y-8">
                        {/* Mobile Logo (shown on small screens) */}
                        <motion.div
                            className="lg:hidden flex items-baseline mb-8"
                            variants={itemVariants}
                        >
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 font-momo text-5xl italic font-extrabold leading-none select-none mr-1 drop-shadow-sm">
                                Q
                            </span>
                            <span className="text-2xl font-bold tracking-tight text-slate-900">line</span>
                        </motion.div>

                        {/* Main Content */}
                        <div className="space-y-6">
                            <motion.div
                                className="inline-block px-4 py-2 bg-blue-50 border border-blue-100 rounded-full"
                                variants={itemVariants}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <span className="text-sm font-semibold text-blue-700">✨ Smart Queue Management</span>
                            </motion.div>

                            <motion.h1
                                className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight"
                                variants={itemVariants}
                            >
                                The End of Waiting in Line.
                            </motion.h1>

                            <motion.p
                                className="text-lg lg:text-xl text-slate-600 leading-relaxed max-w-xl"
                                variants={itemVariants}
                            >
                                Join queues from anywhere, get real-time updates, and save time. For businesses: manage queues intelligently and enhance customer flow.
                            </motion.p>
                        </div>

                        {/* CTA Buttons */}
                        <motion.div
                            className="flex flex-wrap gap-4"
                            variants={itemVariants}
                        >
                            <Link href={user && !isLoading ? "/dashboard" : "/auth"}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button variant="primary" size="lg" className="group">
                                        {user && !isLoading ? "Go to Dashboard" : "Get Started Free"}
                                        <svg
                                            className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>

                        {/* Stats or Features */}
                        <motion.div
                            className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200"
                            variants={itemVariants}
                        >
                            {[
                                { value: '10K+', label: 'Active Users' },
                                { value: '500+', label: 'Businesses' },
                                { value: '99.9%', label: 'Uptime' },
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    variants={statVariants}
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{stat.value}</div>
                                    <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
