import { TrendingUp, TrendingDown, Users, Clock, UserCheck, UserX } from "lucide-react"
import { Queue } from "@/features/Queue/services/queue.api"

export function StatsCards({ queues }: { queues: Queue[] }) {
    const totalWaiting = queues.reduce((sum, q) => sum + (q.activeParticipants || 0), 0)
    const totalServed = queues.reduce((sum, q) => sum + (q.totalToday || 0), 0)

    const STATS = [
        {
            label: "Total Waiting",
            value: totalWaiting.toString(),
            change: "Across active queues",
            trend: "up",
            icon: Users,
        },
        {
            label: "Today's Served",
            value: totalServed.toString(),
            change: "Across all queues",
            trend: "up",
            icon: UserCheck,
        },
        {
            label: "Average Wait Time",
            value: "N/A",
            change: "Analytics API Coming Soon",
            trend: "down",
            icon: Clock,
        },
        {
            label: "Today's Missed",
            value: "N/A",
            change: "Analytics API Coming Soon",
            trend: "down",
            icon: UserX,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {STATS.map((stat, index) => {
                const isPositive = stat.trend === "up"
                const TrendIcon = isPositive ? TrendingUp : TrendingDown
                const colorClass = isPositive ? "text-green-500" : "text-gray-400"

                return (
                    <div key={index} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <stat.icon className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className={`flex items-center text-xs font-medium ${colorClass}`}>
                            <TrendIcon className="h-3 w-3 mr-1" />
                            {stat.change}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
