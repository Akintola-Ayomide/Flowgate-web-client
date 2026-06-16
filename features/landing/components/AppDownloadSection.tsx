'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/shared/ui/logo';
import { AlertCircle } from 'lucide-react';

export function AppDownloadSection() {
    const [showAccordion, setShowAccordion] = useState(false);

    return (
        <section id="download" className="py-24 px-6 relative overflow-hidden bg-background">
            <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold tracking-wider text-primary uppercase font-display">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            Mobile Access
                        </div>

                        <h2 className="text-4xl lg:text-6xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
                            The End of <br/>Waiting in Line.
                        </h2>

                        <p className="text-base text-muted-foreground leading-relaxed max-w-lg font-medium">
                        Get Flowgate on your device to join queues from anywhere, track your live status in real-time, and save precious hours.
                        </p>

                        {/* Store Buttons */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap gap-4 pt-2">
                                <motion.button
                                    onClick={() => setShowAccordion(!showAccordion)}
                                    className="flex items-center gap-4 px-6 py-3 bg-secondary border border-border rounded-md hover:bg-background hover:shadow-sm hover:border-primary/40 transition-all group cursor-pointer"
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    aria-expanded={showAccordion}
                                >
                                    <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Download on the</p>
                                        <p className="text-sm font-bold text-foreground">App Store</p>
                                    </div>
                                </motion.button>

                                <motion.button
                                    onClick={() => setShowAccordion(!showAccordion)}
                                    className="flex items-center gap-4 px-6 py-3 bg-secondary border border-border rounded-md hover:bg-background hover:shadow-sm hover:border-primary/40 transition-all group cursor-pointer"
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    aria-expanded={showAccordion}
                                >
                                    <svg className="w-6 h-6 text-foreground" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    <div className="text-left">
                                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">Get it on</p>
                                        <p className="text-sm font-bold text-foreground">Google Play</p>
                                    </div>
                                </motion.button>
                            </div>

                            {/* Accordion content */}
                            <AnimatePresence>
                                {showAccordion && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-4 p-4 rounded-md border border-accent/20 bg-accent/5 flex items-start gap-3 max-w-lg">
                                            <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Mobile Apps Status</h4>
                                                <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-1">
                                                    Mobile apps are currently in private beta and not available for public download yet. We will notify you by email as soon as they launch!
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Right Content - Phone Mockup */}
                    <motion.div
                        className="relative flex justify-center lg:justify-end"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="relative">
                            {/* Glow */}
                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[80px] warm-glow pointer-events-none" />

                            {/* Phone Frame */}
                            <motion.div
                                className="relative w-[280px] h-[560px] bg-secondary border-4 border-border rounded-[2.5rem] p-2.5 shadow-lg"
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden relative border border-border/60">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-foreground rounded-b-xl z-20"></div>

                                    {/* Screen Content */}
                                    <div className="w-full h-full bg-background p-5 pt-10 flex flex-col justify-between relative z-10">
                                        <div>
                                            <div className="flex justify-center mb-6">
                                                <Logo className="scale-[0.8] origin-top" />
                                            </div>

                                            {/* Queue Items */}
                                            <div className="space-y-3">
                                                {['Waitlist - Central Park', 'DMV - Renewal', 'Coffee Shop - Main St'].map((item, i) => (
                                                    <div
                                                        key={i}
                                                        className="bg-secondary rounded-md p-3 flex items-center justify-between border border-border/80 shadow-xs"
                                                    >
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                                            <span className="text-xs text-foreground font-semibold truncate">{item}</span>
                                                        </div>
                                                        <svg className="w-3.5 h-3.5 text-muted-foreground shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Action Section */}
                                        <div className="space-y-2.5 mt-4">
                                            <p className="text-xs font-bold text-foreground tracking-tight">Quick Actions</p>
                                            <div className="flex gap-2 justify-center">
                                                <button className="flex-1 py-2.5 rounded-md bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/95 transition-colors cursor-pointer">
                                                    Join Queue
                                                </button>
                                                <button className="flex-1 py-2.5 rounded-md bg-secondary text-secondary-foreground text-xs font-bold border border-border hover:bg-muted transition-colors cursor-pointer">
                                                    My Queues
                                                </button>
                                            </div>
                                        </div>
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
