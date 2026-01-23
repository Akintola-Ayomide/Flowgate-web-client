'use client';

import Link from 'next/link';
import { Button } from '@/shared/ui/button';
import { motion } from 'framer-motion';

export function AppDownloadSection() {
    return (
        <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 relative overflow-hidden">
            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        className="space-y-6"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <motion.div
                            className="inline-block px-4 py-2 bg-white/60 backdrop-blur-sm border border-blue-200 rounded-full mb-4"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <span className="text-sm font-semibold text-blue-700">Download Our App</span>
                        </motion.div>

                        <motion.h2
                            className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            The End of Waiting in Line.
                        </motion.h2>

                        <motion.p
                            className="text-lg text-slate-600 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            For users: Download our app to join queues from anywhere and save time. For institutions: Access the admin portal to manage your queues intelligently and enhance customer flow.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="space-y-4"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                        >
                            <Link href="/auth">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button variant="primary" size="lg" className="w-full sm:w-auto">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                        </svg>
                                        Access Admin Dashboard
                                    </Button>
                                </motion.div>
                            </Link>

                            <div className="flex flex-wrap gap-4">
                                <motion.button
                                    className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-lg hover:bg-white hover:shadow-md transition-all group"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-xs text-slate-600">Download on the</p>
                                        <p className="text-sm font-semibold text-slate-900">App Store</p>
                                    </div>
                                </motion.button>

                                <motion.button
                                    className="flex items-center gap-3 px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-lg hover:bg-white hover:shadow-md transition-all group"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-xs text-slate-600">GET IT ON</p>
                                        <p className="text-sm font-semibold text-slate-900">Google Play</p>
                                    </div>
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - Phone Mockup */}
                    <motion.div
                        className="relative flex justify-center lg:justify-end"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <div className="relative group">
                            {/* Decorative blur behind phone */}
                            <motion.div
                                className="absolute inset-0 bg-blue-400/20 rounded-full blur-[100px] pointer-events-none"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.2, 0.3, 0.2],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />

                            {/* Phone Frame */}
                            <motion.div
                                className="relative w-[280px] h-[560px] bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[3rem] p-3 shadow-2xl"
                                whileHover={{ y: -10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                style={{
                                    transition: "transform 3s ease-in-out infinite"
                                }}
                            >
                                <div className="w-full h-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-10"></div>

                                    {/* Screen Content */}
                                    <div className="w-full h-full bg-white p-6 pt-10">
                                        <div className="text-center mb-6">
                                            <div className="flex items-baseline justify-center">
                                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 font-momo text-3xl italic font-extrabold leading-none select-none">Q</span>
                                                <span className="text-xl font-bold tracking-tight text-slate-900">line</span>
                                            </div>
                                        </div>

                                        {/* Queue Items */}
                                        <div className="space-y-3 mb-8">
                                            {['Waitlist - Central Park', 'DMV - Renewal', 'Waitlist - Central Park'].map((item, i) => (
                                                <motion.div
                                                    key={i}
                                                    className="bg-slate-50 rounded-lg p-3 flex items-center justify-between border border-slate-200"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <motion.div
                                                            className="w-1.5 h-1.5 rounded-full bg-blue-500"
                                                            animate={{
                                                                scale: [1, 1.5, 1],
                                                            }}
                                                            transition={{
                                                                duration: 2,
                                                                repeat: Infinity,
                                                                delay: i * 0.3,
                                                            }}
                                                        />
                                                        <span className="text-xs text-slate-700 font-medium">{item}</span>
                                                    </div>
                                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Action Section */}
                                        <motion.div
                                            className="space-y-3"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.9, duration: 0.4 }}
                                        >
                                            <p className="text-sm font-semibold text-slate-700">Quick Actions</p>
                                            <div className="flex gap-3 justify-center">
                                                <button className="flex-1 py-3 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-medium shadow-lg hover:shadow-xl transition-shadow">
                                                    Join Queue
                                                </button>
                                                <button className="flex-1 py-3 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200 transition-colors">
                                                    My Queues
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
