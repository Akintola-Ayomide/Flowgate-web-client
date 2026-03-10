"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart3, Settings, UserCircle, LogOut, Users2 } from "lucide-react"
import { cn } from "@/shared/lib/utils"

const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Queues", href: "/dashboard/queues", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Staff Management", href: "/dashboard/staff", icon: Users2 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
            <div className="flex h-16 items-center border-b border-gray-200 px-6">
                <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-blue-600">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                        Q
                    </div>
                    <span>Qline</span>
                </Link>
            </div>

            <div className="flex h-[calc(100vh-64px)] flex-col justify-between px-3 py-4">
                <nav className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <item.icon className={cn("h-5 w-5", isActive ? "text-blue-700" : "text-gray-400")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="border-t border-gray-200 pt-4 space-y-1">
                    <Link
                        href="/dashboard/profile"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                            pathname === "/dashboard/profile" && "bg-blue-50 text-blue-700"
                        )}
                    >
                        <UserCircle className="h-5 w-5 text-gray-400" />
                        User Profile
                    </Link>
                    <button
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                        onClick={() => {
                            // TODO: Add sign out logic
                            console.log("Sign out")
                        }}
                    >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>
        </aside>
    )
}
