import * as React from "react"
import { Sidebar } from "@/shared/ui/layout/Sidebar"
import { Header } from "@/shared/ui/layout/Header"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="pl-64">
                <Header />
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
