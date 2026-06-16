import React from 'react';
import { motion } from 'framer-motion';

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <motion.svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ rotate: -10, opacity: 0, scale: 0.8 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Warm secondary background container */}
        <rect width="32" height="32" rx="6" fill="var(--secondary)" strokeWidth="1" />

        {/* Gate pillars — left and right vertical bars */}
        <motion.rect
          x="6" y="7" width="4" height="18" rx="2"
          fill="var(--primary)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ transformOrigin: "center" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <motion.rect
          x="22" y="7" width="4" height="18" rx="2"
          fill="var(--primary)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          style={{ transformOrigin: "center" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        />

        {/* Flow wave passing through the gate */}
        <motion.path
          d="M10 13 Q13 10 16 13 Q19 16 22 13"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.3 }}
        />
        <motion.path
          d="M10 19 Q13 16 16 19 Q19 22 22 19"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.5 }}
        />
      </motion.svg>
      <span className="font-display font-bold text-lg tracking-tight text-foreground">
        Flow<span className="text-primary">gate</span>
      </span>
    </div>
  );
}
