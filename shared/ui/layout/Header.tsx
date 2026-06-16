"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell } from "lucide-react"
import { useAuth } from "@/features/auth/context/auth-context"
import { ThemeToggle } from "@/features/landing/components/Header"

/** Map route segments to human-readable titles */
const ROUTE_TITLES: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/browse": "Browse Queues",
    "/dashboard/queues": "Queues",
    "/dashboard/queues/create": "Create Queue",
    "/dashboard/analytics": "Analytics",
    "/dashboard/settings": "Settings",
    "/dashboard/help": "Help & Support",
}

export function Header() {
    const { user } = useAuth()
    const pathname = usePathname()

    const title = ROUTE_TITLES[pathname] ?? "Dashboard"

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?"

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/80 backdrop-blur-md px-8">
            <h1 className="text-lg font-display font-bold text-foreground tracking-tight">{title}</h1>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                
                {/* User avatar */}
                <Link href="/dashboard/settings">
                    <div
                        className="h-8.5 w-8.5 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all ring-1 ring-primary/20"
                        title={user?.name ?? ""}
                    >
                        {user?.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                </Link>
            </div>
        </header>
    )
}
