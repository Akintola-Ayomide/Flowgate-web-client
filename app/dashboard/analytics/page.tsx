"use client"

import * as React from "react"
import { Clock, Calendar, Download, BarChart3 } from "lucide-react"
import { Button } from "@/shared/ui/button"

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Gain insights into your queue performance and customer behavior.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Last 30 Days</span>
                    </div>
                    <Button variant="secondary" className="gap-2 bg-white">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Coming Soon Placeholder */}
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-gray-300 rounded-2xl bg-gray-50/50">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <BarChart3 className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Advanced Analytics Coming Soon</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                    We are currently building comprehensive analytics and reporting tools to help you gain deeper insights into your queue performance and customer flow.
                </p>
                <div className="inline-flex items-center justify-center px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    In Development
                </div>
            </div>
        </div>
    )
}
