"use client"

import * as React from "react"
import { Clock, Calendar, Download, BarChart3 } from "lucide-react"
import { Button } from "@/shared/ui/button"

export default function AnalyticsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-display font-bold text-foreground tracking-tight">Analytics & Reports</h1>
                    <p className="text-muted-foreground text-xs font-medium mt-0.5">Gain insights into your queue performance and customer behavior.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-xs font-bold text-foreground uppercase tracking-wide">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Last 30 Days</span>
                    </div>
                    <Button variant="secondary" className="gap-2 text-xs font-bold uppercase">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Coming Soon Placeholder */}
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center border border-border/80 rounded-md bg-background relative overflow-hidden shadow-xs">
                <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-secondary border border-border/60 text-primary rounded-md flex items-center justify-center mx-auto mb-5 shadow-xs">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-display font-bold text-foreground mb-1 tracking-tight">Advanced Analytics Coming Soon</h2>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-5 font-medium leading-relaxed">
                        We are currently building comprehensive analytics and reporting tools to help you gain deeper insights into your queue metrics and customer flow.
                    </p>
                    <div className="inline-flex items-center justify-center px-3 py-1 border border-primary/20 bg-primary/5 text-primary rounded-full text-[10px] font-bold tracking-wider uppercase">
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        In Development
                    </div>
                </div>
            </div>
        </div>
    )
}
