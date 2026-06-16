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
            accent: "primary",
        },
        {
            label: "Today's Served",
            value: totalServed.toString(),
            change: "Across all queues",
            trend: "up",
            icon: UserCheck,
            accent: "primary",
        },
        {
            label: "Average Wait Time",
            value: "N/A",
            change: "Analytics API Coming Soon",
            trend: "down",
            icon: Clock,
            accent: "accent",
        },
        {
            label: "Today's Missed",
            value: "N/A",
            change: "Analytics API Coming Soon",
            trend: "down",
            icon: UserX,
            accent: "accent",
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {STATS.map((stat, index) => {
                const isPositive = stat.trend === "up"
                const TrendIcon = isPositive ? TrendingUp : TrendingDown
                const isPrimary = stat.accent === "primary"
                const borderAccentClass = isPrimary ? "border-t-primary" : "border-t-accent"
                const iconColorClass = isPrimary ? "text-primary" : "text-accent"

                return (
                    <div key={index} className={`bg-background border-x border-b border-t-2 ${borderAccentClass} border-border/80 rounded-md p-5 transition-all duration-200 hover:-translate-y-[1px] hover:shadow-sm group`}>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-display text-xs font-semibold tracking-wide text-muted-foreground uppercase">{stat.label}</h3>
                            <div className="p-1.5 bg-secondary border border-border/60 rounded-md transition-colors group-hover:bg-background">
                                <stat.icon className={`h-4.5 w-4.5 ${iconColorClass}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-display font-bold text-foreground mb-1.5 tracking-tight">{stat.value}</div>
                        <div className="flex items-center text-[10px] font-semibold text-muted-foreground tracking-wide uppercase">
                            <TrendIcon className="h-3 w-3 mr-1 text-muted-foreground/60" />
                            {stat.change}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
