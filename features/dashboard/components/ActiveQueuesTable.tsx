import { Queue } from "@/features/Queue/services/queue.api"
import Link from "next/link"

export function ActiveQueuesTable({ queues }: { queues: Queue[] }) {
    return (
        <div className="bg-background border border-border/80 rounded-md shadow-xs overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-border/60 bg-secondary/10">
                <h2 className="font-display text-sm font-bold text-foreground tracking-tight">Live Queue Status</h2>
            </div>
            {queues.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground font-medium text-sm">
                    No active queues found. Create one to get started.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-secondary/40 font-display text-[10px] font-bold tracking-wider text-muted-foreground border-b border-border/80 uppercase">
                            <tr>
                                <th className="px-6 py-3.5">Queue Name</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-center">Waiting</th>
                                <th className="px-6 py-3.5 text-center">Served Today</th>
                                <th className="px-6 py-3.5">Capacity</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {queues.map((queue) => {
                                const statusColor = queue.status === 'active' 
                                    ? "bg-primary/10 text-primary border-primary/20" 
                                    : queue.status === 'paused' 
                                    ? "bg-accent/10 text-accent border-accent/20" 
                                    : "bg-destructive/10 text-destructive border-destructive/20";
                                    
                                const capacityRatio = Math.min((queue.activeParticipants || 0) / queue.maxParticipants, 1);
                                const capacityColor = capacityRatio > 0.8 
                                    ? "bg-destructive" 
                                    : capacityRatio > 0.5 
                                    ? "bg-accent" 
                                    : "bg-primary";
                                
                                return (
                                    <tr key={queue.id} className="hover:bg-secondary/35 transition-colors group">
                                        <td className="px-6 py-4 font-semibold text-foreground">{queue.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${statusColor}`}>
                                                <span className="mr-1.5 h-1 w-1 rounded-full bg-current" />
                                                {queue.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-muted-foreground font-semibold">{queue.activeParticipants || 0}</td>
                                        <td className="px-6 py-4 text-center text-muted-foreground font-semibold">{queue.totalToday || 0}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden border border-border/20">
                                                    <div
                                                        className={`h-full rounded-full ${capacityColor}`}
                                                        style={{ width: `${capacityRatio * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-muted-foreground">{queue.activeParticipants || 0}/{queue.maxParticipants}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/dashboard/queues/${queue.id}`} className="text-primary hover:text-primary/80 font-bold text-xs uppercase tracking-wide transition-colors">
                                                Manage
                                            </Link>
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
