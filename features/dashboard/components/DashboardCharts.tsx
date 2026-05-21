import { BarChart3, Clock } from "lucide-react"

export function DashboardCharts() {
    return (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <BarChart3 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard Charts Coming Soon</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
                Visualizations for customer distribution and hourly volume are currently in development.
            </p>
            <div className="inline-flex items-center justify-center px-4 py-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <Clock className="w-4 h-4 mr-2" />
                In Development
            </div>
        </div>
    )
}
