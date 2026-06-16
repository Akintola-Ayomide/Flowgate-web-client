"use client"

import React, { useEffect, useState } from "react"
import { queueApi, Queue, QueueEntry } from "@/features/Queue/services/queue.api"
import { Loader2, QrCode } from "lucide-react"
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
            <div className="flex justify-center items-center h-32 bg-background border border-border/80 rounded-md shadow-xs">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        )
    }

    if (joined.length === 0) {
        return null;
    }

    return (
        <div className="bg-background border border-border/80 rounded-md p-6 mb-6 shadow-xs relative overflow-hidden">
            <div className="absolute inset-0 dot-grid opacity-[0.1] pointer-events-none" />
            <h2 className="font-display text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4 relative z-10">Your Active Tickets</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 relative z-10">
                {joined.map(({ entry, queue }) => (
                    <div key={entry.id} className="border border-border/80 bg-secondary/30 rounded-md p-4 hover:border-primary/40 transition-colors duration-200 flex flex-col justify-between group">
                        <div className="mb-4">
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm truncate">{queue.name}</h3>
                                <div className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-2 py-0.5 rounded-sm shrink-0">
                                    #{entry.position}
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">Joined at {new Date(entry.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <button
                            onClick={() => router.push(`/ticket/${entry.id}`)}
                            className="w-full flex items-center justify-center py-2 px-4 border border-border rounded-md text-xs font-bold text-foreground bg-background hover:bg-secondary transition-colors cursor-pointer"
                        >
                            <QrCode className="h-3.5 w-3.5 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span>View Ticket</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
