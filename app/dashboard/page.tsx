import { StatsCards } from "@/features/dashboard/components/StatsCards"
import { ActiveQueuesTable } from "@/features/dashboard/components/ActiveQueuesTable"
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts"

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <StatsCards />
            <ActiveQueuesTable />
            <DashboardCharts />
        </div>
    )
}
