import { MoreHorizontal } from "lucide-react"

const QUEUES = [
    {
        name: "Reception Desk",
        status: "High Volume",
        statusColor: "bg-yellow-100 text-yellow-800",
        waiting: 25,
        serving: 5,
        avgWait: "15m 45s",
        capacity: 75,
        maxCapacity: 100,
        capacityColor: "bg-blue-600",
    },
    {
        name: "Lab Services",
        status: "Active",
        statusColor: "bg-green-100 text-green-800",
        waiting: 12,
        serving: 8,
        avgWait: "8m 10s",
        capacity: 50,
        maxCapacity: 100,
        capacityColor: "bg-blue-600",
    },
    {
        name: "Billing Department",
        status: "Alert",
        statusColor: "bg-red-100 text-red-800",
        waiting: 49,
        serving: 2,
        avgWait: "25m 30s",
        capacity: 90,
        maxCapacity: 90,
        capacityColor: "bg-blue-600",
    },
]

export function ActiveQueuesTable() {
    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Live Queue Status</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">QUEUE NAME</th>
                            <th className="px-6 py-3">STATUS</th>
                            <th className="px-6 py-3">WAITING</th>
                            <th className="px-6 py-3">SERVING</th>
                            <th className="px-6 py-3">AVG. WAIT TIME</th>
                            <th className="px-6 py-3">CAPACITY</th>
                            <th className="px-6 py-3 text-right">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {QUEUES.map((queue, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{queue.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${queue.statusColor}`}>
                                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${queue.statusColor.replace("bg-", "bg-opacity-50 bg-")}`} />
                                        {/* Simplified badge dot */}
                                        {queue.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{queue.waiting}</td>
                                <td className="px-6 py-4 text-gray-500">{queue.serving}</td>
                                <td className="px-6 py-4 text-gray-500">{queue.avgWait}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-24 rounded-full bg-gray-200 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${queue.capacityColor}`}
                                                style={{ width: `${(queue.capacity / queue.maxCapacity) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">{queue.capacity}/{queue.maxCapacity}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
