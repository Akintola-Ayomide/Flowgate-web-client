import * as React from 'react';
import { CircleAlert } from 'lucide-react'; // Approximating the "!" icon

interface AuthLayoutProps {
    children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left Branding Section */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-12 text-blue-900 relative overflow-hidden">
                {/* Logo */}
                <div className="flex items-baseline relative z-10">
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 font-momo text-7xl italic font-extrabold leading-none select-none mr-0.5 md:mr-1 drop-shadow-sm">
                        Q
                    </span>
                    <span className="text-3xl font-bold tracking-tight text-slate-900">line</span>
                </div>

                {/* Hero Content */}
                <div className="flex flex-col items-center text-center max-w-lg mx-auto z-10 relative">
                    {/* Decorative Elements behind Q */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="mb-8 relative group">
                        <div className="absolute inset-0 bg-blue-600 rounded-[2rem] rotate-6 opacity-20 blur-xl group-hover:rotate-12 transition-transform duration-500" />
                        <div className="relative flex items-center justify-center w-32 h-32 bg-white/60 backdrop-blur-md rounded-[2rem] border border-white/60 shadow-2xl shadow-blue-900/5 group-hover:-translate-y-2 transition-transform duration-500">
                            <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 font-momo text-7xl italic font-extrabold leading-none select-none">
                                Q
                            </span>
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight mb-6 text-slate-900 drop-shadow-sm">
                        Smart Queue<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Management</span>
                    </h1>

                    <p className="text-lg text-slate-600 leading-relaxed font-medium text-balance">
                        Streamline operations, enhance customer experience, and unlock efficiency with our intelligent queuing solutions.
                    </p>
                </div>

                {/* Copyright */}
                <div className="text-sm text-slate-500 font-medium">
                    © 2024 Qline, Inc. All rights reserved.
                </div>

                {/* Decorative Grid/Glow (Optional for polish) */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            </div>

            {/* Right Form Section */}
            <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white relative">
                <div className="w-full max-w-md space-y-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
