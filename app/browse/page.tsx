"use client"

import React, { useEffect, useState } from "react"
import { queueApi, Queue } from "@/features/Queue/services/queue.api"
import { Loader2, Search, ArrowRight, Clock, Users } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BrowseQueuesPage() {
    const router = useRouter()
    const [queues, setQueues] = useState<Queue[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        queueApi.getAllActiveQueues()
            .then(data => setQueues(data))
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    const filteredQueues = queues.filter(q => 
        q.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (q.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Browse Queues</h1>
                    <p className="text-lg text-gray-500">Find and join available services in your area.</p>
                </div>

                <div className="relative max-w-2xl mx-auto">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-sm"
                        placeholder="Search by name or description..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    </div>
                ) : filteredQueues.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {filteredQueues.map(queue => (
                            <div key={queue.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{queue.name}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                            {queue.description || `Managed by ${queue.owner?.name || 'Owner'}`}
                                        </p>
                                    </div>
                                    <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                        Active
                                    </div>
                                </div>
                                
                                <div className="flex space-x-4 mb-6">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Users className="w-4 h-4 mr-1.5 text-gray-400" />
                                        <span>{queue.inLine ?? 0} in line</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                                        <span>~{queue.waitTime ?? 0} min wait</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push(`/join/${queue.id}`)}
                                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Join Queue
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white rounded-2xl border border-gray-200 p-12">
                        <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No queues found</h3>
                        <p className="mt-2 text-gray-500">
                            {searchQuery ? 'Try adjusting your search terms.' : 'There are currently no active queues available.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
