"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart3, Settings, LogOut, HelpCircle, Search } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { useAuth } from "@/features/auth/context/auth-context"
import { Logo } from "@/shared/ui/logo"

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

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?"

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-secondary flex flex-col justify-between">
            <div className="flex flex-col flex-1 min-h-0">
                {/* Logo Header */}
                <div className="flex h-16 items-center border-b border-border px-6 shrink-0">
                    <Link href="/dashboard" className="block w-full">
                        <Logo />
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 no-scrollbar">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group border",
                                    isActive
                                        ? "bg-background border-border text-foreground shadow-xs relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primary before:rounded-r"
                                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground border-transparent"
                                )}
                            >
                                <item.icon className={cn("h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground/80")} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Bottom Footer Section */}
            <div className="shrink-0 border-t border-border bg-secondary/80 relative">
                {/* Dot Grid background pattern inside bottom panel for industrial texture */}
                <div className="absolute inset-0 dot-grid opacity-[0.25] pointer-events-none" />

                <div className="relative px-4 py-4 space-y-1.5">
                    {BOTTOM_ITEMS.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-all duration-200 group border",
                                    isActive
                                        ? "bg-background border-border text-foreground shadow-xs relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-primary before:rounded-r"
                                        : "text-muted-foreground hover:bg-background/50 hover:text-foreground border-transparent"
                                )}
                            >
                                <item.icon className={cn("h-4.5 w-4.5 shrink-0 transition-transform group-hover:scale-105", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground/80")} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}

                    <button
                        onClick={() => logout()}
                        className="flex w-full items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium text-destructive/80 transition-all duration-200 hover:bg-destructive/5 hover:text-destructive group border border-transparent hover:border-destructive/10"
                    >
                        <LogOut className="h-4.5 w-4.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        <span>Sign Out</span>
                    </button>

                    {/* User Profile Info Card */}
                    {user && (
                        <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-3 rounded-md p-2 mt-3 bg-background/50 hover:bg-background transition-colors border border-border/60 hover:border-border"
                        >
                            <div className="h-8.5 w-8.5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 ring-1 ring-primary/20">
                                {initials}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </aside>
    )
}
