"use client"

import * as React from "react"
import { Search, Plus, Filter, Download, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/shared/ui/button"

const QUEUES = [
    { id: 1, name: "General Inquiries", status: "Active", waiting: 12, avgWait: "5m 30s", location: "Main Lobby", statusColor: "bg-green-100 text-green-800" },
    { id: 2, name: "Pharmacy Pickup", status: "Active", waiting: 8, avgWait: "8m 15s", location: "Level 2 Pharmacy", statusColor: "bg-green-100 text-green-800" },
    { id: 3, name: "Technical Support", status: "Paused", waiting: 0, avgWait: "12m 00s", location: "Virtual Queue", statusColor: "bg-yellow-100 text-yellow-800" },
    { id: 4, name: "New Accounts", status: "Active", waiting: 5, avgWait: "10m 45s", location: "Branch Office A", statusColor: "bg-green-100 text-green-800" },
    { id: 5, name: "Returns & Exchanges", status: "Closed", waiting: 0, avgWait: "6m 20s", location: "Customer Service Desk", statusColor: "bg-gray-100 text-gray-800" },
]

export default function QueuesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Active Queues</h1>
                    <p className="text-gray-500">Monitor and manage all active customer queues in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search queues..."
                            className="h-10 w-64 rounded-lg border border-gray-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create New Queue
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Filter className="h-4 w-4" />
                        All Statuses
                    </button>
                    <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <Filter className="h-4 w-4" />
                        All Locations
                    </button>
                </div>
                <button className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                </button>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 w-10">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            </th>
                            <th className="px-6 py-4">QUEUE NAME</th>
                            <th className="px-6 py-4">STATUS</th>
                            <th className="px-6 py-4">WAITING</th>
                            <th className="px-6 py-4">AVG. WAIT TIME</th>
                            <th className="px-6 py-4">LOCATION</th>
                            <th className="px-6 py-4 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {QUEUES.map((queue) => (
                            <tr key={queue.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900">{queue.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${queue.statusColor}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${queue.statusColor.split(' ')[0].replace('bg-', 'bg-current opacity-50 ')}`} />
                                        {/* Hack to get darker dot color from bg class? No, bg-current uses text color. */}
                                        <span className={`h-1.5 w-1.5 rounded-full bg-current opacity-60`} />
                                        {queue.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">{queue.waiting}</td>
                                <td className="px-6 py-4 text-gray-500">{queue.avgWait}</td>
                                <td className="px-6 py-4 text-gray-500">{queue.location}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
                    <div className="text-sm text-gray-500">
                        Showing 1 to 5 of 20 results
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" className="gap-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50" disabled>
                            Previous
                        </Button>
                        <Button variant="secondary" size="sm" className="gap-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50">
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
