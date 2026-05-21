"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, HelpCircle, Search } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { useAuth } from "@/features/auth/context/auth-context"

const NAV_ITEMS = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Browse Queues", href: "/browse", icon: Search },
    { name: "Queues", href: "/dashboard/queues", icon: Users },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

const BOTTOM_ITEMS = [
    { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
]

export function Sidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()

    // Derive initials for avatar fallback
    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?"

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white flex flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center border-b border-gray-200 px-6 shrink-0">
                <Link href="/dashboard" className="flex items-baseline group">
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-indigo-600 font-momo text-4xl italic font-extrabold leading-none select-none mr-0.5 md:mr-1 drop-shadow-sm group-hover:scale-105 transition-transform">
                        Q
                    </span>
                    <span className="text-xl font-bold tracking-tight text-slate-900">line</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
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
                            <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-600" : "text-gray-400")} />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Bottom section */}
            <div className="shrink-0 border-t border-gray-200 px-3 py-3 space-y-1">
                {BOTTOM_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-600" : "text-gray-400")} />
                            {item.name}
                        </Link>
                    )
                })}

                <button
                    onClick={() => logout()}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    Sign Out
                </button>

                {/* User strip */}
                {user && (
                    <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 mt-1 hover:bg-gray-50 transition-colors"
                    >
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </Link>
                )}
            </div>
        </aside>
    )
}
