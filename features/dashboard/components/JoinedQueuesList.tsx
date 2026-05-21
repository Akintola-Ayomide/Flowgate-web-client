"use client"

import React, { useEffect, useState } from "react"
import { queueApi, Queue, QueueEntry } from "@/features/Queue/services/queue.api"
import { Loader2, ArrowRight, QrCode } from "lucide-react"
import { useRouter } from "next/navigation"

export function JoinedQueuesList() {
    const router = useRouter()
    const [joined, setJoined] = useState<{entry: QueueEntry, queue: Queue}[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        queueApi.getJoinedQueues()
            .then(data => setJoined(data))
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32 bg-white rounded-xl border border-gray-200">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
        )
    }

    if (joined.length === 0) {
        return null; // Don't show the section if no joined queues
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Your Active Tickets</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {joined.map(({ entry, queue }) => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 transition-colors flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-gray-900">{queue.name}</h3>
                                <div className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-md">
                                    #{entry.position}
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">Joined at {new Date(entry.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <button
                            onClick={() => router.push(`/ticket/${entry.id}`)}
                            className="w-full flex items-center justify-center py-2 px-4 border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <QrCode className="h-4 w-4 mr-2 text-gray-400" />
                            View Ticket
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
