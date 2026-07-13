"use client"

import * as React from "react"
import Link from "next/link"
import { Search, Plus, Filter, RefreshCw, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { queueApi, Queue, QueueStatus } from "@/features/Queue/services/queue.api"
import { cn } from "@/shared/lib/utils"

const STATUS_STYLES: Record<QueueStatus, string> = {
    active: "bg-primary/10 text-primary border-primary/20",
    paused: "bg-accent/10 text-accent border-accent/20",
    closed: "bg-secondary text-muted-foreground border-border/60",
}

function StatusBadge({ status }: { status: QueueStatus }) {
    return (
        <span className={cn("inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", STATUS_STYLES[status])}>
            <span className="h-1 w-1 rounded-full bg-current" />
            {status}
        </span>
    )
}

// Helper to parse description + address + image
function parseQueueDetails(description: string | null): { desc: string; address: string | null; imageUrl: string | null } {
    if (!description) {
        return { desc: 'No description provided.', address: null, imageUrl: null };
    }
    try {
        const parsed = JSON.parse(description);
        if (parsed && typeof parsed === 'object') {
            return {
                desc: parsed.desc || 'No description provided.',
                address: parsed.address || null,
                imageUrl: parsed.image || null
            };
        }
    } catch {
        // Fallback for plain text descriptions
    }
    return { desc: description, address: null, imageUrl: null };
}

export default function QueuesPage() {
    const [queues, setQueues] = React.useState<Queue[]>([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [search, setSearch] = React.useState("")
    const [statusFilter, setStatusFilter] = React.useState<QueueStatus | "all">("all")
    const [updatingId, setUpdatingId] = React.useState<number | null>(null)
    const [deletingId, setDeletingId] = React.useState<number | null>(null)

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

    const handleDeleteQueue = async (queue: Queue) => {
        if (!confirm(`Delete "${queue.name}"? This cannot be undone.`)) return
        setDeletingId(queue.id)
        try {
            await queueApi.deleteQueue(queue.id)
            // Optimistic removal — no need to re-fetch the whole list.
            setQueues((prev) => prev.filter((q) => q.id !== queue.id))
        } catch (err: any) {
            alert(err.message || 'Failed to delete queue.')
        } finally {
            setDeletingId(null)
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
                    <h1 className="text-xl font-display font-bold text-foreground tracking-tight">My Queues</h1>
                    <p className="text-muted-foreground text-xs font-medium mt-0.5">Monitor and manage your active queues in real-time.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search queues…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="h-10 w-full sm:w-48 md:w-56 rounded-md border border-border bg-secondary pl-9 pr-4 text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all"
                        />
                    </div>
                    <button
                        onClick={fetchQueues}
                        className="h-10 w-10 flex items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0"
                        title="Refresh"
                    >
                        <RefreshCw className="h-4 w-4" />
                    </button>
                    <Link href="/dashboard/queues/create" className="shrink-0">
                        <Button className="gap-2 text-xs font-bold whitespace-nowrap">
                            <Plus className="h-4 w-4" />
                            <span className="hidden xs:inline">Create Queue</span>
                            <span className="xs:hidden">Create</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-md border border-border bg-secondary/30 p-3 gap-3">
                <div className="flex items-center flex-wrap gap-2">
                    <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs font-bold tracking-wide uppercase text-muted-foreground/80">Status:</span>
                    {(["all", "active", "paused", "closed"] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={cn(
                                "rounded-md px-3 py-1 text-xs font-semibold transition-colors capitalize cursor-pointer whitespace-nowrap",
                                statusFilter === s
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-background border border-border text-muted-foreground hover:bg-secondary"
                            )}
                        >
                            {s === "all" ? "All" : s}
                        </button>
                    ))}
                </div>
                <span className="text-xs font-semibold text-muted-foreground shrink-0">{filtered.length} queue{filtered.length !== 1 ? "s" : ""}</span>
            </div>

            {/* Main Content Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-background border border-border rounded-md">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
            ) : error ? (
                <div className="rounded-md border border-destructive/20 bg-destructive/5 p-6 text-center">
                    <p className="text-destructive font-semibold text-sm">{error}</p>
                    <button onClick={fetchQueues} className="mt-2 text-xs text-primary font-bold underline cursor-pointer">Try again</button>
                </div>
            ) : filtered.length === 0 ? (
                <div className="rounded-md border border-dashed border-border bg-background p-16 text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-md bg-secondary border border-border/60 flex items-center justify-center text-primary">
                        <Plus className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-display font-bold text-foreground mb-1">No queues yet</h3>
                    <p className="text-muted-foreground text-xs font-medium mb-4">Create your first queue to get started.</p>
                    <Link href="/dashboard/queues/create">
                        <Button className="text-xs font-bold">Create Queue</Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Desktop Table */}
                    <div className="hidden md:block rounded-md border border-border bg-background shadow-xs overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-secondary/40 text-muted-foreground font-display text-[10px] font-bold tracking-wider uppercase border-b border-border/80">
                                <tr>
                                    <th className="px-6 py-3.5">Queue Name</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5">Waiting</th>
                                    <th className="px-6 py-3.5">Total Today</th>
                                    <th className="px-6 py-3.5">Avg. Wait</th>
                                    <th className="px-6 py-3.5">Capacity</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {filtered.map((queue) => {
                                    const waiting = queue.activeParticipants ?? queue.inLine ?? 0
                                    const pct = Math.min((waiting / queue.maxParticipants) * 100, 100)
                                    const { desc, imageUrl } = parseQueueDetails(queue.description)
                                    return (
                                        <tr key={queue.id} className="hover:bg-secondary/35 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-foreground">
                                                <div className="flex items-center gap-3">
                                                    {imageUrl && (
                                                        <div className="h-8 w-8 rounded-sm overflow-hidden bg-secondary shrink-0 border border-border/50">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img 
                                                                src={imageUrl} 
                                                                alt={queue.name} 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <div className="truncate font-bold">{queue.name}</div>
                                                        {desc && (
                                                            <div className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate max-w-xs">{desc}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><StatusBadge status={queue.status} /></td>
                                            <td className="px-6 py-4 text-muted-foreground font-semibold">{waiting}</td>
                                            <td className="px-6 py-4 text-muted-foreground font-semibold">{queue.totalToday ?? "—"}</td>
                                            <td className="px-6 py-4 text-muted-foreground font-semibold">{avgWait(queue)}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="h-1.5 w-20 rounded-full bg-secondary border border-border/20 overflow-hidden">
                                                        <div
                                                            className={cn("h-full rounded-full transition-all", pct > 80 ? "bg-destructive" : "bg-primary")}
                                                            style={{ width: `${pct}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-muted-foreground">{waiting}/{queue.maxParticipants}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {queue.status !== "closed" && (
                                                        <button
                                                            onClick={() => handleStatusToggle(queue)}
                                                            disabled={updatingId === queue.id}
                                                            className="text-xs px-2.5 py-1 rounded-md border border-border text-foreground hover:bg-secondary disabled:opacity-50 transition-colors font-medium cursor-pointer h-7"
                                                        >
                                                            {updatingId === queue.id ? <Loader2 className="h-3 w-3 animate-spin" /> : queue.status === "active" ? "Pause" : "Resume"}
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={`/dashboard/queues/${queue.id}`}
                                                        className="text-xs px-2.5 py-1.5 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-bold uppercase tracking-wider transition-colors h-7 flex items-center"
                                                    >
                                                        Manage
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteQueue(queue)}
                                                        disabled={deletingId === queue.id}
                                                        className="h-7 w-7 flex items-center justify-center rounded-md border border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 disabled:opacity-50 transition-colors cursor-pointer"
                                                        title="Delete queue"
                                                    >
                                                        {deletingId === queue.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden grid gap-3">
                        {filtered.map((queue) => {
                            const waiting = queue.activeParticipants ?? queue.inLine ?? 0
                            const pct = Math.min((waiting / queue.maxParticipants) * 100, 100)
                            const { desc, imageUrl } = parseQueueDetails(queue.description)
                            return (
                                <div key={queue.id} className="bg-background border border-border/80 rounded-md p-4 shadow-xs">
                                    <div className="flex items-start justify-between gap-3 mb-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {imageUrl && (
                                                <div className="h-10 w-10 rounded-sm overflow-hidden bg-secondary shrink-0 border border-border/50">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={queue.name} 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-foreground text-sm truncate">{queue.name}</p>
                                                {desc && (
                                                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate">{desc}</p>
                                                )}
                                            </div>
                                        </div>
                                        <StatusBadge status={queue.status} />
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        <div className="bg-secondary/40 border border-border/50 rounded-md p-2 text-center">
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Waiting</p>
                                            <p className="text-base font-display font-black text-primary">{waiting}</p>
                                        </div>
                                        <div className="bg-secondary/40 border border-border/50 rounded-md p-2 text-center">
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Served</p>
                                            <p className="text-base font-display font-black text-foreground">{queue.totalToday ?? 0}</p>
                                        </div>
                                        <div className="bg-secondary/40 border border-border/50 rounded-md p-2 text-center">
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Avg Wait</p>
                                            <p className="text-base font-display font-black text-accent">{avgWait(queue)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="h-1.5 flex-1 rounded-full bg-secondary border border-border/20 overflow-hidden">
                                            <div
                                                className={cn("h-full rounded-full transition-all", pct > 80 ? "bg-destructive" : "bg-primary")}
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground shrink-0">{waiting}/{queue.maxParticipants}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        {queue.status !== "closed" && (
                                            <button
                                                onClick={() => handleStatusToggle(queue)}
                                                disabled={updatingId === queue.id}
                                                className="flex-1 text-xs py-2 rounded-md border border-border text-foreground hover:bg-secondary disabled:opacity-50 transition-colors font-bold uppercase tracking-wider cursor-pointer"
                                            >
                                                {updatingId === queue.id ? <Loader2 className="h-3.5 w-3.5 animate-spin mx-auto" /> : queue.status === "active" ? "Pause" : "Resume"}
                                            </button>
                                        )}
                                        <Link
                                            href={`/dashboard/queues/${queue.id}`}
                                            className="flex-1 text-center text-xs py-2 rounded-md bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 font-bold uppercase tracking-wider transition-colors"
                                        >
                                            Manage
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteQueue(queue)}
                                            disabled={deletingId === queue.id}
                                            className="h-9 w-9 flex items-center justify-center rounded-md border border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 disabled:opacity-50 transition-colors cursor-pointer shrink-0"
                                            title="Delete queue"
                                        >
                                            {deletingId === queue.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </>
            )}
        </div>
    )
}
