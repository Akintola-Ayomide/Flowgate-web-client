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

    // Only show the full-screen spinner while auth state is actively resolving.
    // This has a 10-second maximum (matching the checkAuth timeout in auth-context).
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    // Auth resolved but no user — redirect is in-flight.
    // Return null rather than another spinner so the router can complete
    // the navigation without a persistent loading screen blocking it.
    if (!user) {
        return null
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
