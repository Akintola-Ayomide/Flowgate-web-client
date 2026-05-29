"use client";

import { io } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { queueApi, QueueStatusResponse } from "@/features/Queue/services/queue.api";
import { Loader2, ArrowLeft, QrCode, Bell, BellOff, AlertTriangle } from "lucide-react";

export default function TicketPage() {
    const params = useParams()
    const router = useRouter()
    const entryId = params.id as string

    const [isLoading, setIsLoading] = useState(true)
    const [statusData, setStatusData] = useState<QueueStatusResponse | null>(null)
    const [queueId, setQueueId] = useState<number | null>(null)
    const [qrToken, setQrToken] = useState<string>("")
    const [notifyOnTurn, setNotifyOnTurn] = useState(false)
    const socketRef = useRef<any>(null);

    useEffect(() => {
        const initialize = async () => {
            try {
                const joinedQueues = await queueApi.getJoinedQueues()
                const match = joinedQueues.find(j => String(j.entry.id) === entryId)

                if (match) {
                    setQueueId(match.queue.id)
                    setQrToken(match.entry.qrCodeToken)
                    const status = await queueApi.getQueueStatus(match.queue.id)
                    setStatusData(status)
                } else {
                    // Fallback assuming the ID passed was actually a queue ID
                    const numId = Number(entryId)
                    if (!isNaN(numId)) {
                        const status = await queueApi.getQueueStatus(numId)
                        setStatusData(status)
                        setQueueId(numId)
                        if (status.entry) {
                            setQrToken(status.entry.qrCodeToken)
                        }
                    }
                }
            } catch (err) {
                console.warn("Failed to load ticket:", err)
            } finally {
                setIsLoading(false)
            }
        }
        if (entryId) initialize()
    }, [entryId])

    useEffect(() => {
        if (!queueId) return;
        // Initialize socket connection
        const socket = io();
        socketRef.current = socket;
        // Join the specific queue room for real-time updates
        socket.emit('joinQueueRoom', { queueId });
        const fetchStatus = async () => {
            try {
                const status = await queueApi.getQueueStatus(queueId);
                setStatusData(status);
            } catch (err) {
                console.warn('Failed to fetch queue status via socket update:', err);
            }
        };
        // Listen for relevant events and refresh status
        socket.on('queueShifted', fetchStatus);
        socket.on('nextServed', fetchStatus);
        socket.on('userPrioritized', fetchStatus);
        socket.on('userJoined', fetchStatus);
        socket.on('userLeft', fetchStatus);
        // Initial fetch
        fetchStatus();
        return () => {
            socket.disconnect();
        };
    }, [queueId]);

    const handleLeaveQueue = async () => {
        if (!confirm("Are you sure you want to leave this queue? You will lose your spot.")) return
        
        if (queueId) {
            try {
                await queueApi.leaveQueue(queueId)
                router.replace('/dashboard')
            } catch (err) {
                alert("Failed to leave queue")
            }
        } else {
            router.back()
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        )
    }

    if (!statusData || statusData.status === 'not_joined') {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 text-center">
                <AlertTriangle className="h-16 w-16 text-amber-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">No Active Ticket</h1>
                <p className="text-gray-500 mb-8">You don't have an active entry in this queue.</p>
                <button 
                    onClick={() => router.replace('/dashboard')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                >
                    Go Home
                </button>
            </div>
        )
    }

    const { position, peopleAhead, estimatedWaitTime, entry, queue } = statusData
    const ticketNumber = entry ? `#${entry.position}` : `#${position ?? '?'}`

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto space-y-6">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center text-gray-500 hover:text-gray-900 transition mb-4"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Back
                </button>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 flex flex-col items-center">
                    <div className="bg-blue-50 text-blue-700 px-6 py-2 rounded-2xl text-4xl font-bold tracking-wider mb-2">
                        {ticketNumber}
                    </div>
                    <div className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
                        Your Position
                    </div>

                    <div className="w-48 h-48 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center justify-center mb-8 p-4">
                        <QrCode className="h-24 w-24 text-gray-400 mb-4" />
                        <span className="text-xs font-mono text-gray-400 break-all text-center leading-tight">
                            {qrToken || 'N/A'}
                        </span>
                    </div>

                    <div className="w-full space-y-4">
                        {queue && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Queue</span>
                                <span className="text-gray-900 font-bold">{queue.name}</span>
                            </div>
                        )}
                        {queue?.owner && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Owner</span>
                                <span className="text-gray-900 font-bold">{queue.owner.name}</span>
                            </div>
                        )}
                        {entry?.joinedAt && (
                            <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                <span className="text-gray-500 font-medium">Joined At</span>
                                <span className="text-gray-900 font-bold">
                                    {new Date(entry.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 bg-blue-50 rounded-2xl p-6 text-center">
                        <div className="text-4xl font-bold text-blue-700 mb-1">{peopleAhead ?? 0}</div>
                        <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">People Ahead</div>
                    </div>
                    <div className="flex-1 bg-blue-50 rounded-2xl p-6 text-center">
                        <div className="text-4xl font-bold text-blue-700 mb-1">~{estimatedWaitTime ?? 0}<span className="text-lg text-blue-600">m</span></div>
                        <div className="text-xs font-medium text-blue-600 uppercase tracking-wider">Est. Wait</div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
                    <div className="flex items-center text-gray-700">
                        {notifyOnTurn ? <Bell className="h-5 w-5 mr-3 text-blue-500" /> : <BellOff className="h-5 w-5 mr-3 text-gray-400" />}
                        <span className="font-semibold">Get notified on your turn</span>
                    </div>
                    <button 
                        onClick={() => setNotifyOnTurn(!notifyOnTurn)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${notifyOnTurn ? 'bg-blue-600' : 'bg-gray-200'}`}
                        role="switch"
                        aria-checked={notifyOnTurn}
                    >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${notifyOnTurn ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                <button
                    onClick={handleLeaveQueue}
                    className="w-full flex items-center justify-center px-4 py-4 border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-bold transition-colors"
                >
                    Leave Queue
                </button>
            </div>
        </div>
    )
}
