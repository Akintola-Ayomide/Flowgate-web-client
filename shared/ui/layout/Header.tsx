"use client"

import * as React from "react"
import { Bell, Search, Plus } from "lucide-react"
import { Button } from "@/shared/ui/button"

export function Header() {
    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="h-10 w-64 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create New Queue
                </Button>

                <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                </button>

                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                    JD
                </div>
            </div>
        </header>
    )
}
