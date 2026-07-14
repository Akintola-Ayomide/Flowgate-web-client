"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { Toast, ToastType } from "@/shared/ui/toast"

export interface ToastMessage {
    id: string
    type: ToastType
    title: string
    description?: string
    duration?: number
}

interface ToastContextType {
    toasts: ToastMessage[]
    addToast: (toast: Omit<ToastMessage, "id">) => string
    removeToast: (id: string) => void
    success: (title: string, description?: string) => string
    error: (title: string, description?: string) => string
    info: (title: string, description?: string) => string
    warning: (title: string, description?: string) => string
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

const DEFAULT_DURATIONS: Record<ToastType, number> = {
    success: 3000,
    error: 6000,
    info: 4000,
    warning: 5000,
}

let toastCounter = 0

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([])
    const timersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
        const timer = timersRef.current.get(id)
        if (timer) {
            clearTimeout(timer)
            timersRef.current.delete(id)
        }
    }, [])

    const addToast = useCallback((toast: Omit<ToastMessage, "id">): string => {
        toastCounter += 1
        const id = `toast_${toastCounter}_${Date.now()}`
        const duration = toast.duration ?? DEFAULT_DURATIONS[toast.type]
        const newToast: ToastMessage = { ...toast, id }
        setToasts((prev) => [...prev, newToast])
        if (duration > 0) {
            const timer = setTimeout(() => {
                removeToast(id)
            }, duration)
            timersRef.current.set(id, timer)
        }
        return id
    }, [removeToast])

    const success = useCallback((title: string, description?: string) =>
        addToast({ type: "success", title, description }), [addToast])

    const error = useCallback((title: string, description?: string) =>
        addToast({ type: "error", title, description }), [addToast])

    const info = useCallback((title: string, description?: string) =>
        addToast({ type: "info", title, description }), [addToast])

    const warning = useCallback((title: string, description?: string) =>
        addToast({ type: "warning", title, description }), [addToast])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: "420px" }}>
                <AnimatePresence mode="popLayout">
                    {[...toasts].reverse().map((t) => (
                        <Toast key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
