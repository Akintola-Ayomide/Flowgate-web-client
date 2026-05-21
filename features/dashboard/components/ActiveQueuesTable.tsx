import { MoreHorizontal } from "lucide-react"
import { Queue } from "@/features/Queue/services/queue.api"
import Link from "next/link"

export function ActiveQueuesTable({ queues }: { queues: Queue[] }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Live Queue Status</h2>
            </div>
            {queues.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    No active queues found. Create one to get started.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">QUEUE NAME</th>
                                <th className="px-6 py-3">STATUS</th>
                                <th className="px-6 py-3">WAITING</th>
                                <th className="px-6 py-3">SERVED TODAY</th>
                                <th className="px-6 py-3">CAPACITY</th>
                                <th className="px-6 py-3 text-right">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {queues.map((queue) => {
                                const statusColor = queue.status === 'active' ? "bg-green-100 text-green-800" :
                                                  queue.status === 'paused' ? "bg-yellow-100 text-yellow-800" :
                                                  "bg-red-100 text-red-800";
                                const capacityRatio = Math.min((queue.activeParticipants || 0) / queue.maxParticipants, 1);
                                const capacityColor = capacityRatio > 0.8 ? "bg-red-500" : capacityRatio > 0.5 ? "bg-yellow-500" : "bg-green-500";
                                
                                return (
                                    <tr key={queue.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">{queue.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                                                <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${statusColor.replace("bg-", "bg-opacity-50 bg-")}`} />
                                                {queue.status.charAt(0).toUpperCase() + queue.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{queue.activeParticipants || 0}</td>
                                        <td className="px-6 py-4 text-gray-500">{queue.totalToday || 0}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-24 rounded-full bg-gray-200 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${capacityColor}`}
                                                        style={{ width: `${capacityRatio * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-gray-500">{queue.activeParticipants || 0}/{queue.maxParticipants}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/dashboard/queues/${queue.id}`} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
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
