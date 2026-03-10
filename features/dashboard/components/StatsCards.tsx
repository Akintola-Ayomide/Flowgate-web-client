import { TrendingUp, TrendingDown, Users, Clock, UserCheck, UserX } from "lucide-react"

const STATS = [
    {
        label: "Total Waiting",
        value: "86",
        change: "+5% vs last hour",
        trend: "up",
        icon: Users,
    },
    {
        label: "Average Wait Time",
        value: "12m 30s",
        change: "-2% vs last hour",
        trend: "down",
        icon: Clock,
    },
    {
        label: "Today's Served",
        value: "215",
        change: "+10% vs yesterday",
        trend: "up",
        icon: UserCheck,
    },
    {
        label: "Today's Missed",
        value: "14",
        change: "+1% vs yesterday",
        trend: "up", // Actually +1% missed is bad, so maybe down color? But typically "up" arrow. Let's stick to up green for "more" or red for "bad"? The image shows green for +5%, red for -2%. For missed +1% is green in image? Wait.
        // Image for missed says "+1% vs yesterday" in green. Usually bad but let's follow image.
        icon: UserX,
    },
]

export function StatsCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {STATS.map((stat, index) => {
                const isPositive = stat.trend === "up"
                const TrendIcon = isPositive ? TrendingUp : TrendingDown
                const trendColor = index === 1 ? "text-red-500" : "text-green-500" // Hardcoded to match image: Wait time down is good (red in image? No usually wait time down is good green). 
                // Image: 
                // Waiting: +5% (Green)
                // Wait Time: -2% (Red) -> Wait, usually lower wait time is good. But image shows Red arrow down. Maybe it means it decreased? 
                // Served: +10% (Green)
                // Missed: +1% (Green)

                // Let's mimic the image colors directly.
                const colorClass = index === 1 ? "text-red-500" : "text-green-500"

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
