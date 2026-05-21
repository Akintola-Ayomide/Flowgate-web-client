"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Plus, Filter, Download, MoreHorizontal, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { queueApi, Queue, QueueStatus } from "@/features/Queue/services/queue.api"
import { cn } from "@/shared/lib/utils"

const STATUS_STYLES: Record<QueueStatus, string> = {
    active: "bg-green-100 text-green-800",
    paused: "bg-yellow-100 text-yellow-800",
    closed: "bg-gray-100 text-gray-600",
}

const STATUS_DOT: Record<QueueStatus, string> = {
    active: "bg-green-500",
    paused: "bg-yellow-500",
    closed: "bg-gray-400",
}

function StatusBadge({ status }: { status: QueueStatus }) {
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", STATUS_STYLES[status])}>
            <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} />
            {status}
        </span>
    )
}

export default function QueuesPage() {
    const [queues, setQueues] = React.useState<Queue[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<QueueStatus | "all">("all")
    const [updatingId, setUpdatingId] = React.useState<number | null>(null)

    const fetchQueues = React.useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await queueApi.getMyQueues()
            setQueues(data)
        } catch (err: any) {
            setError(err.message ?? "Failed to load queues")
        } finally {
            setIsLoading(false)
        }
    }, [])

    React.useEffect(() => { fetchQueues() }, [fetchQueues])

    const filtered = queues.filter((q) => {
        const matchesSearch = q.name.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "all" || q.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const handleStatusToggle = async (queue: Queue) => {
        const next: QueueStatus = queue.status === "active" ? "paused" : "active"
        setUpdatingId(queue.id)
        try {
            const updated = await queueApi.updateStatus(queue.id, next)
            setQueues((prev) => prev.map((q) => q.id === updated.id ? { ...q, status: updated.status } : q))
        } catch (err: any) {
            alert(err.message)
        } finally {
            setUpdatingId(null)
        }
    }

    const avgWait = (q: Queue) => {
        const mins = (q.activeParticipants ?? q.inLine ?? 0) * q.avgServiceTime
        return mins < 1 ? "< 1m" : `${mins}m`
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">My Queues</h1>
                    <p className="text-gray-500 text-sm mt-0.5">Monitor and manage your queues in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search queues…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-56 rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        onClick={fetchQueues}
                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <Link href="/dashboard/queues/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            Create Queue
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">Status:</span>
                    {(["all", "active", "paused", "closed"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={cn(
                                "rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize",
                                statusFilter === s
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            )}
                        >
                            {s === "all" ? "All" : s}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-gray-400">{filtered.length} queue{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button onClick={fetchQueues} className="mt-3 text-sm text-red-500 underline">Try again</button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-16 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">No queues yet</h3>
                    <p className="text-gray-500 text-sm mb-4">Create your first queue to get started.</p>
                    <Link href="/dashboard/queues/create">
                        <Button>Create Queue</Button>
                    </Link>
                </div>
            ) : (
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-6 py-3">Queue Name</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Waiting</th>
                                <th className="px-6 py-3">Total Today</th>
                                <th className="px-6 py-3">Avg. Wait</th>
                                <th className="px-6 py-3">Capacity</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.map((queue) => {
                                const waiting = queue.activeParticipants ?? queue.inLine ?? 0
                                const pct = Math.min((waiting / queue.maxParticipants) * 100, 100)
                                return (
                                    <tr key={queue.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <div>{queue.name}</div>
                                            {queue.description && (
                                                <div className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{queue.description}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4"><StatusBadge status={queue.status} /></td>
                                        <td className="px-6 py-4 text-gray-600">{waiting}</td>
                                        <td className="px-6 py-4 text-gray-600">{queue.totalToday ?? "—"}</td>
                                        <td className="px-6 py-4 text-gray-600">{avgWait(queue)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-20 rounded-full bg-gray-200 overflow-hidden">
                                                    <div
                                                        className={cn("h-full rounded-full transition-all", pct > 80 ? "bg-red-500" : "bg-blue-600")}
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-400">{waiting}/{queue.maxParticipants}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {queue.status !== "closed" && (
                                                    <button
                                                        onClick={() => handleStatusToggle(queue)}
                                                        disabled={updatingId === queue.id}
                                                        className="text-xs px-2.5 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                                    >
                                                        {updatingId === queue.id ? <Loader2 className="h-3 w-3 animate-spin" /> : queue.status === "active" ? "Pause" : "Resume"}
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/dashboard/queues/${queue.id}`}
                                                    className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium transition-colors"
                                                >
                                                    Manage
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
