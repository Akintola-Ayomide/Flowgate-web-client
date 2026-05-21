"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { queueApi, Queue } from "@/features/Queue/services/queue.api"
import { Loader2, ArrowLeft, Users, Clock, Info } from "lucide-react"

export default function JoinQueuePage() {
    const params = useParams()
    const router = useRouter()
    const queueId = Number(params.id)
    
    const [queue, setQueue] = useState<Queue | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isJoining, setIsJoining] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        queueApi.getQueue(queueId)
            .then(data => setQueue(data))
            .catch(err => setError(err.message || "Failed to load queue details."))
            .finally(() => setIsLoading(false))
    }, [queueId])

    const handleJoin = async () => {
        if (!queue) return
        setIsJoining(true)
        try {
            const result = await queueApi.joinQueue(queue.id)
            router.replace(`/ticket/${result.entry.id}`)
        } catch (err: any) {
            alert(err.message || "Failed to join queue.")
        } finally {
            setIsJoining(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        )
    }

    if (error || !queue) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
                <Info className="h-16 w-16 text-amber-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Queue Not Found</h1>
                <p className="text-gray-500 text-center mb-8">{error || "This queue may have been closed or removed."}</p>
                <button 
                    onClick={() => router.back()}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                    Go Back
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-gray-900 transition mb-8"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back to Browse
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-start justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{queue.name}</h1>
                                {queue.owner && (
                                    <p className="text-gray-500 font-medium">Managed by {queue.owner.name}</p>
                                )}
                            </div>
                            <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${
                                queue.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                                {queue.status}
                            </span>
                        </div>

                        {queue.description && (
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                {queue.description}
                            </p>
                        )}

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                <Users className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Capacity</div>
                                <div className="text-2xl font-bold text-gray-900">{queue.maxParticipants}</div>
                            </div>
                            <div className="bg-gray-50 rounded-2xl p-4 text-center">
                                <Clock className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                                <div className="text-sm font-medium text-gray-500 uppercase tracking-wider">Avg Time</div>
                                <div className="text-2xl font-bold text-gray-900">{queue.avgServiceTime}m</div>
                            </div>
                        </div>

                        {queue.customFields && queue.customFields.length > 0 && (
                            <div className="mb-8 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wider mb-3">
                                    Required Information
                                </h3>
                                <ul className="space-y-2">
                                    {queue.customFields.map((field: any, idx: number) => (
                                        <li key={idx} className="flex items-center text-blue-800">
                                            <Info className="h-4 w-4 mr-2 text-blue-500" />
                                            <span className="font-medium">{field.label || field.name || `Field ${idx + 1}`}</span>
                                            {field.required && <span className="ml-2 text-xs bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">Required</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <button
                            onClick={handleJoin}
                            disabled={isJoining || queue.status !== 'active'}
                            className="w-full flex justify-center items-center py-4 px-8 border border-transparent rounded-xl shadow-sm text-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isJoining ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                    Joining...
                                </>
                            ) : (
                                "Get Queue Ticket"
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
