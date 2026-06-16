'use client';

import { motion, Variants } from 'framer-motion';

export function HowItWorksSection() {
    const steps = [
        {
            number: 1,
            title: 'Customer Joins via App or Web',
            description: 'Customers access queues directly through the Flowgate website or mobile application. No complex setup required; they can browse available queues and join instantly.',
        },
        {
            number: 2,
            title: 'Get QR Code & Virtual Ticket',
            description: 'After joining, they receive a unique QR code and virtual ticket. This code is scanned by staff when it is their turn to be served.',
        },
        {
            number: 3,
            title: 'Receives Notification',
            description: "Flowgate automatically sends an email or browser notification when it's their turn to be served, reducing perceived wait times and eliminating physical lines.",
        },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <section id="how-it-works" className="py-24 px-6 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-20 space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-bold tracking-wider text-primary uppercase font-display">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        Operation Flow
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-display font-bold text-foreground tracking-tight">
                        How <span className="text-gradient">Flowgate</span> Works
                    </h2>
                    <p className="text-base text-muted-foreground max-w-2xl mx-auto font-medium">
                        A simple, contactless, and efficient queueing experience for your customers in three easy steps.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Visual Scan Mockup */}
                    <motion.div
                        className="relative order-2 lg:order-1"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="relative border border-border bg-secondary/30 rounded-2xl p-6 shadow-sm">
                            <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
                            {/* QR Scanner Mockup */}
                            <div className="relative aspect-[4/3] bg-background/50 rounded-xl overflow-hidden flex items-center justify-center border border-border/60">
                                <motion.div
                                    className="bg-background rounded-xl p-6 shadow-lg border border-border/80 w-64"
                                    animate={{
                                        y: [0, -4, 0],
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="bg-secondary p-3 rounded-lg mb-3 border border-border/60">
                                        <div className="w-full h-32 bg-background rounded-md flex items-center justify-center border border-border/40">
                                            <motion.div
                                                className="grid grid-cols-3 gap-2"
                                                animate={{
                                                    rotate: [0, 2, -2, 0],
                                                }}
                                                transition={{
                                                    duration: 4,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                {[...Array(9)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-3.5 h-3.5 bg-primary rounded-xs"
                                                        animate={{
                                                            opacity: [1, 0.3, 1],
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            delay: i * 0.15,
                                                        }}
                                                    />
                                                ))}
                                            </motion.div>
                                        </div>
                                    </div>
                                    <p className="text-foreground text-center font-display font-bold text-xs tracking-widest uppercase">SCAN TO JOIN</p>
                                </motion.div>
                            </div>

                            {/* Scan to Join Badge */}
                            <motion.div
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-background border border-border/80 rounded-md px-6 py-3 shadow-md flex items-center gap-3 w-[260px]"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="w-8.5 h-8.5 bg-primary/10 rounded-md flex items-center justify-center shrink-0 border border-primary/20">
                                    <svg className="w-4.5 h-4.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-foreground truncate">No App Required</p>
                                    <p className="text-[10px] text-muted-foreground truncate">Instant web ticketing</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right - Steps list */}
                    <motion.div
                        className="space-y-8 order-1 lg:order-2 pl-4 lg:pl-10"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {steps.map((step) => (
                            <motion.div
                                key={step.number}
                                className="flex gap-5 group"
                                variants={itemVariants}
                            >
                                <div className="flex-shrink-0">
                                    <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center text-accent font-display font-bold text-base shadow-xs transition-colors group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent">
                                        {step.number}
                                    </div>
                                </div>
                                <div className="space-y-1 pt-1">
                                    <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm font-medium">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
