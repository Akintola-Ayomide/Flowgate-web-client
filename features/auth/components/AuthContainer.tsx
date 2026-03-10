'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthLayout } from './AuthLayout';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { AuthMode } from '../types';

export function AuthContainer() {
    const [mode, setMode] = React.useState<AuthMode>('login');

    return (
        <AuthLayout>
            <div className="w-full">
                <AnimatePresence mode="wait">
                    {mode === 'login' ? (
                        <motion.div
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <LoginForm onSwitchToSignup={() => setMode('signup')} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <SignupForm onSwitchToLogin={() => setMode('login')} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AuthLayout>
    );
}
