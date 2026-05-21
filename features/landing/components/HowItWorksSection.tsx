'use client';

import { motion, Variants } from 'framer-motion';

export function HowItWorksSection() {
    const steps = [
        {
            number: 1,
            title: 'Customer Joins via App or Web',
            description: 'Customers access queues directly through the Qline website or mobile application. No complex setup required, they can browse available queues and join instantly.',
        },
        {
            number: 2,
            title: 'Get QR Code & Virtual Ticket',
            description: 'After joining, they receive a unique QR code and virtual ticket. This code is scanned by staff when it is their turn to be served.',
        },
        {
            number: 3,
            title: 'Receives Notification',
            description: "Qline automatically sends an SMS or browser notification when it's their turn to be served, reducing perceived wait times and eliminating physical lines.",
        },
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <section id="how-it-works" className="py-20 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16 space-y-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="inline-block px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-4"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <span className="text-sm font-semibold text-blue-700">How It Works</span>
                    </motion.div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-slate-900">
                        How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Qline</span> Works
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        A simple, contactless, and efficient queueing experience for your customers in three easy steps.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left - Image */}
                    <motion.div
                        className="relative order-2 lg:order-1"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    >
                        <motion.div
                            className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 rounded-2xl p-8 shadow-xl border border-blue-100"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            {/* QR Scanner Mockup */}
                            <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-100 to-indigo-50 rounded-xl overflow-hidden flex items-center justify-center">
                                <motion.div
                                    className="bg-slate-800 rounded-lg p-8 shadow-2xl"
                                    animate={{
                                        y: [0, -5, 0],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="bg-white p-4 rounded-lg mb-3">
                                        <div className="w-32 h-32 bg-slate-900 rounded-lg flex items-center justify-center">
                                            <motion.div
                                                className="grid grid-cols-3 gap-1"
                                                animate={{
                                                    rotate: [0, 5, -5, 0],
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                {[...Array(9)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        className="w-2 h-2 bg-white rounded-sm"
                                                        animate={{
                                                            opacity: [1, 0.5, 1],
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            delay: i * 0.1,
                                                        }}
                                                    />
                                                ))}
                                            </motion.div>
                                        </div>
                                    </div>
                                    <p className="text-white text-center font-semibold text-sm">QUEUING</p>
                                </motion.div>
                            </div>

                            {/* Scan to Join Badge */}
                            <motion.div
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-3 shadow-lg border border-blue-100 flex items-center gap-3"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">Login to Join</p>
                                    <p className="text-xs text-slate-500">No app needed</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Right - Steps */}
                    <motion.div
                        className="space-y-8 order-1 lg:order-2"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {steps.map((step) => (
                            <motion.div
                                key={step.number}
                                className="flex gap-6 group"
                                variants={itemVariants}
                                whileHover={{ x: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="flex-shrink-0">
                                    <motion.div
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                        whileHover={{ scale: 1.2, rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {step.number}
                                    </motion.div>
                                </div>
                                <div className="space-y-2 pt-1">
                                    <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
