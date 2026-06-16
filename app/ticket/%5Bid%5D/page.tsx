"use client";

import { io } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { queueApi, QueueStatusResponse } from "@/features/Queue/services/queue.api";
import { Loader2, ArrowLeft, QrCode, Bell, BellOff, AlertTriangle } from "lucide-react";
import { Button } from "@/shared/ui/button";

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
        // Join the room for real-time updates
        socket.emit('joinQueueRoom', { queueId });
        const fetchStatus = async () => {
            try {
                const status = await queueApi.getQueueStatus(queueId);
                setStatusData(status);
            } catch (err) {
                console.warn('Failed to fetch queue status via socket update:', err);
            }
        };
        // Listen for updates and refresh
        socket.on('queueShifted', fetchStatus);
        socket.on('nextServed', fetchStatus);
        socket.on('userPrioritized', fetchStatus);
        socket.on('userJoined', fetchStatus);
        socket.on('userLeft', fetchStatus);
        
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
            <div className="min-h-screen bg-background flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!statusData || statusData.status === 'not_joined') {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-[0.1] pointer-events-none" />
                <div className="relative z-10 max-w-sm space-y-4">
                    <AlertTriangle className="h-12 w-12 text-accent mx-auto" />
                    <h1 className="text-xl font-display font-bold text-foreground">No Active Ticket</h1>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">You do not have an active entry or ticket in this queue.</p>
                    <Button 
                        onClick={() => router.replace('/dashboard')}
                        variant="primary"
                        size="default"
                        className="w-full text-xs font-bold uppercase"
                    >
                        Go Home
                    </Button>
                </div>
            </div>
        )
    }

    const { position, peopleAhead, estimatedWaitTime, entry, queue } = statusData
    const ticketNumber = entry ? `#${entry.position}` : `#${position ?? '?'}`

    return (
        <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full warm-glow pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full warm-glow pointer-events-none" />

            <div className="max-w-md mx-auto space-y-5 relative z-10">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition mb-4 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back
                </button>

                {/* Ticket Card */}
                <div className="bg-background rounded-md shadow-xs border border-border/80 p-6 md:p-8 flex flex-col items-center">
                    <div className="bg-primary/10 text-primary border border-primary/20 px-5 py-2 rounded-sm text-4xl font-display font-black tracking-wider mb-2">
                        {ticketNumber}
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-8">
                        Your Ticket Code
                    </div>

                    <div className="w-44 h-44 bg-secondary border border-border/80 rounded-md flex flex-col items-center justify-center mb-8 p-4 shadow-xs">
                        <QrCode className="h-20 w-20 text-muted-foreground/60 mb-3" />
                        <span className="text-[9px] font-mono text-muted-foreground/75 break-all text-center leading-normal max-w-full">
                            {qrToken || 'TOKEN_PENDING'}
                        </span>
                    </div>

                    <div className="w-full space-y-3 border-t border-border/60 pt-4">
                        {queue && (
                            <div className="flex justify-between items-center py-2 text-sm">
                                <span className="text-muted-foreground font-medium">Queue</span>
                                <span className="text-foreground font-bold">{queue.name}</span>
                            </div>
                        )}
                        {queue?.owner && (
                            <div className="flex justify-between items-center py-2 text-sm border-t border-border/40">
                                <span className="text-muted-foreground font-medium">Owner</span>
                                <span className="text-foreground font-bold">{queue.owner.name}</span>
                            </div>
                        )}
                        {entry?.joinedAt && (
                            <div className="flex justify-between items-center py-2 text-sm border-t border-border/40">
                                <span className="text-muted-foreground font-medium">Joined At</span>
                                <span className="text-foreground font-bold">
                                    {new Date(entry.joinedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Panel */}
                <div className="bg-background rounded-md shadow-xs border border-border/80 p-4 flex gap-4">
                    <div className="flex-1 bg-secondary/40 border border-border/50 rounded-md p-4 text-center">
                        <div className="text-3xl font-display font-black text-primary mb-0.5">{peopleAhead ?? 0}</div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">People Ahead</div>
                    </div>
                    <div className="flex-1 bg-secondary/40 border border-border/50 rounded-md p-4 text-center">
                        <div className="text-3xl font-display font-black text-accent mb-0.5">~{estimatedWaitTime ?? 0}<span className="text-base text-accent/70 ml-0.5 font-bold">m</span></div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Est. Wait</div>
                    </div>
                </div>

                {/* Notifications Alert Toggle */}
                <div className="bg-background rounded-md shadow-xs border border-border/80 p-4 flex justify-between items-center">
                    <div className="flex items-center text-foreground gap-3">
                        <div className="w-8 h-8 rounded-md bg-secondary border border-border/60 flex items-center justify-center shrink-0">
                            {notifyOnTurn ? <Bell className="h-4.5 w-4.5 text-primary" /> : <BellOff className="h-4.5 w-4.5 text-muted-foreground" />}
                        </div>
                        <div>
                            <span className="font-semibold text-sm">Notifications Alert</span>
                            <p className="text-[10px] text-muted-foreground font-medium">Notify me when my turn approaches</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setNotifyOnTurn(!notifyOnTurn)}
                        className={`focus:outline-none relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            notifyOnTurn ? "bg-primary" : "bg-secondary border border-border"
                        }`}
                        role="switch"
                        aria-checked={notifyOnTurn}
                    >
                        <span 
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-foreground shadow-xs transition duration-200 ease-in-out ${
                                notifyOnTurn ? "translate-x-5 bg-background" : "translate-x-0 bg-muted-foreground"
                            }`} 
                        />
                    </button>
                </div>

                {/* Leave Queue Button */}
                <button
                    onClick={handleLeaveQueue}
                    className="w-full flex items-center justify-center px-4 py-3 border border-destructive/20 bg-destructive/5 text-destructive hover:bg-destructive/10 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                    Leave Queue waitlist
                </button>
            </div>
        </div>
    )
}
