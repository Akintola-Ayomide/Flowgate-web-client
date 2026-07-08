"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/context/auth-context"
import { Sidebar } from "@/shared/ui/layout/Sidebar"
import { Header } from "@/shared/ui/layout/Header"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    React.useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/auth?error=session_expired')
        }
    }, [isLoading, user, router])

    // Block rendering while auth state is resolving
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Don't render dashboard UI at all if unauthenticated (redirect is in-flight)
    if (!user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Ambient Background for entire dashboard */}
            <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="md:pl-64 flex flex-col min-h-screen relative z-10">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
