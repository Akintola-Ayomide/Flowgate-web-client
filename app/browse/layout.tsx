import * as React from "react"
import { Sidebar } from "@/shared/ui/layout/Sidebar"
import { Header } from "@/shared/ui/layout/Header"

export default function BrowseLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
            <Sidebar />
            <div className="pl-64 flex flex-col min-h-screen relative z-10">
                <Header />
                <main className="flex-1 p-6 overflow-y-auto animate-fade-in">
                    {children}
                </main>
            </div>
        </div>
    )
}
