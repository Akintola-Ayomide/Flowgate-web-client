"use client"

import React, { useEffect, useState } from "react"
import { StatsCards } from "@/features/dashboard/components/StatsCards"
import { ActiveQueuesTable } from "@/features/dashboard/components/ActiveQueuesTable"
import { DashboardCharts } from "@/features/dashboard/components/DashboardCharts"
import { JoinedQueuesList } from "@/features/dashboard/components/JoinedQueuesList"
import { queueApi, Queue } from "@/features/Queue/services/queue.api"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
    const [queues, setQueues] = useState<Queue[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        queueApi.getMyQueues()
            .then(data => setQueues(data))
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <JoinedQueuesList />
            <StatsCards queues={queues} />
            <ActiveQueuesTable queues={queues} />
            <DashboardCharts />
        </div>
    )
}
