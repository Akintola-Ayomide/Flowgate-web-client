"use client"

import React from "react"
import { motion } from "framer-motion"
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import type { ToastMessage } from "@/shared/context/toast-context"

export type ToastType = "success" | "error" | "info" | "warning"

const ICON_MAP: Record<ToastType, React.ElementType> = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
}

const STYLE_MAP: Record<ToastType, { border: string; icon: string; bg: string }> = {
    success: {
        border: "border-l-primary",
        icon: "text-primary",
        bg: "bg-primary/5",
    },
    error: {
        border: "border-l-red-500",
        icon: "text-red-500",
        bg: "bg-red-500/5",
    },
    info: {
        border: "border-l-primary",
        icon: "text-primary",
        bg: "bg-primary/5",
    },
    warning: {
        border: "border-l-accent",
        icon: "text-accent",
        bg: "bg-accent/5",
    },
}

interface ToastProps {
    toast: ToastMessage
    onDismiss: () => void
}

export function Toast({ toast, onDismiss }: ToastProps) {
    const Icon = ICON_MAP[toast.type]
    const styles = STYLE_MAP[toast.type]

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
                "pointer-events-auto relative flex items-start gap-3 rounded-md border border-border bg-background p-4 shadow-lg border-l-4",
                styles.border,
                styles.bg,
            )}
        >
            <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", styles.icon)} />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground leading-snug">{toast.title}</p>
                {toast.description && (
                    <p className="text-xs text-muted-foreground font-medium mt-0.5 leading-relaxed">{toast.description}</p>
                )}
            </div>
            <button
                onClick={onDismiss}
                className="h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0 -mr-1 -mt-1"
                aria-label="Dismiss"
            >
                <X className="h-3.5 w-3.5" />
            </button>
        </motion.div>
    )
}
