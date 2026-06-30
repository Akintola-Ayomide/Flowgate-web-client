"use client";

import { io } from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { queueApi, QueueStatusResponse } from "@/features/Queue/services/queue.api";
import { Loader2, ArrowLeft, QrCode, Bell, AlertTriangle, Timer } from "lucide-react";
import { Button } from "@/shared/ui/button";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ──────────────────────────────────────────────
// Persistent Countdown Timer Hook
// ──────────────────────────────────────────────

/**
 * Storage key for persisting the countdown end-time for a specific queue entry.
 * Keyed by entryId so multiple queues don't overwrite each other.
 */
const timerKey = (entryId: string) => `qline_timer_end_${entryId}`;

/**
 * usePersistedCountdown — a localStorage-backed countdown timer.
 *
 * Strategy:
 * - Stores an absolute `endTime` (Unix ms) in localStorage keyed by entryId.
 * - On every mount (including reloads), reads the stored endTime and computes
 *   remaining seconds from `endTime - Date.now()` — so the timer always
 *   resumes exactly where it left off.
 * - When the server sends a new `estimatedMinutes` (e.g. position shifts via
 *   WebSocket), we compare it to what the stored endTime implies. If the
 *   difference is significant (>90 seconds drift), we sync to the new
 *   server value and update the stored endTime.
 * - The interval reads from Date.now() each tick rather than decrementing
 *   state, so it stays accurate across tab suspensions and CPU throttling.
 *
 * @param estimatedMinutes - Estimated wait time in minutes from the server.
 * @param entryId          - Unique ID for this queue entry (used as storage key).
 */
function usePersistedCountdown(estimatedMinutes: number | undefined, entryId: string) {
    const [secondsLeft, setSecondsLeft] = useState<number>(0);
    const endTimeRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // ── On mount: restore from localStorage or initialise from server estimate ──
    useEffect(() => {
        if (!entryId || estimatedMinutes === undefined) return;

        const stored = localStorage.getItem(timerKey(entryId));
        const serverEndTime = Date.now() + Math.round(estimatedMinutes * 60 * 1000);

        if (stored) {
            const parsedEndTime = parseInt(stored, 10);
            if (!isNaN(parsedEndTime) && parsedEndTime > Date.now()) {
                // Valid stored endTime — resume from it.
                endTimeRef.current = parsedEndTime;
                setSecondsLeft(Math.max(0, Math.floor((parsedEndTime - Date.now()) / 1000)));
                return;
            }
        }

        // No valid stored value — initialise from server estimate.
        endTimeRef.current = serverEndTime;
        localStorage.setItem(timerKey(entryId), String(serverEndTime));
        setSecondsLeft(Math.max(0, Math.round(estimatedMinutes * 60)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entryId]); // Only runs once on mount per entry

    // ── Sync when server estimate changes meaningfully (position shift) ──
    useEffect(() => {
        if (!entryId || estimatedMinutes === undefined || endTimeRef.current === 0) return;

        const serverEndTime = Date.now() + Math.round(estimatedMinutes * 60 * 1000);
        const currentSecondsLeft = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
        const serverSecondsLeft = Math.round(estimatedMinutes * 60);

        // Sync only when the server's estimate meaningfully diverges (>90s difference).
        // This covers real position advances without resetting for minor drift.
        if (Math.abs(serverSecondsLeft - currentSecondsLeft) > 90) {
            endTimeRef.current = serverEndTime;
            localStorage.setItem(timerKey(entryId), String(serverEndTime));
            setSecondsLeft(Math.max(0, serverSecondsLeft));
        }
    }, [estimatedMinutes, entryId]);

    // ── Tick interval — reads from endTimeRef, not state ──
    useEffect(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (endTimeRef.current === 0) return;
            const remaining = Math.max(0, Math.floor((endTimeRef.current - Date.now()) / 1000));
            setSecondsLeft(remaining);
            if (remaining === 0) {
                clearInterval(intervalRef.current!);
                // Clear storage so it doesn't persist a stale zero
                localStorage.removeItem(timerKey(entryId));
            }
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entryId]); // Start once per entry, interval self-manages via endTimeRef

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const display =
        secondsLeft <= 0
            ? "Ready!"
            : `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    return { minutes, seconds, secondsLeft, display };
}

// ──────────────────────────────────────────────
// Page Component
// ──────────────────────────────────────────────

export default function TicketPage() {
    const params = useParams()
    const router = useRouter()
    const entryId = params.id as string

    const [isLoading, setIsLoading] = useState(true)
    const [statusData, setStatusData] = useState<QueueStatusResponse | null>(null)
    const [queueId, setQueueId] = useState<number | null>(null)
    const [qrToken, setQrToken] = useState<string>("")
    const socketRef = useRef<any>(null);

    const countdown = usePersistedCountdown(statusData?.estimatedWaitTime, (statusData?.entry?.id?.toString() ?? entryId));

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
        // Connect directly to the backend WebSocket server.
        const socket = io(BACKEND_URL, {
            transports: ['websocket', 'polling'],
        });
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
        socket.on('queueStatusChanged', fetchStatus);
        // If the queue is deleted while the user is waiting, send them home.
        socket.on('queueDeleted', () => {
            router.replace('/dashboard?queue_deleted=1');
        });
        
        fetchStatus();
        return () => {
            socket.disconnect();
        };
    }, [queueId]);

    const handleLeaveQueue = async () => {
        if (!confirm("Are you sure you want to leave this queue? You will lose your spot.")) return;
        
        if (queueId) {
            try {
                await queueApi.leaveQueue(queueId);
                // Clear persisted timer for this entry, if any
                if (statusData?.entry?.id) {
                    localStorage.removeItem(timerKey(statusData.entry.id.toString()));
                }
                setStatusData(null);
                router.replace('/dashboard');
            } catch (err) {
                alert("Failed to leave queue. Please try again.");
            }
        } else {
            router.back();
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

    // Derive a color class for the countdown based on urgency.
    const countdownColor =
        countdown.secondsLeft === 0
            ? "text-green-500"
            : countdown.minutes < 2
            ? "text-red-500"
            : countdown.minutes <= 5
            ? "text-accent"
            : "text-primary";

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
                    {/* People Ahead */}
                    <div className="flex-1 bg-secondary/40 border border-border/50 rounded-md p-4 text-center">
                        <div className="text-3xl font-display font-black text-primary mb-0.5">{peopleAhead ?? 0}</div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">People Ahead</div>
                    </div>

                    {/* Live Countdown Timer */}
                    <div className="flex-1 bg-secondary/40 border border-border/50 rounded-md p-4 text-center">
                        <div className={`flex items-end justify-center gap-0.5 font-display font-black mb-0.5 ${countdownColor}`}>
                            <Timer className="h-4 w-4 mb-1 shrink-0 opacity-70" />
                            {countdown.secondsLeft === 0 ? (
                                <span className="text-2xl">Ready!</span>
                            ) : (
                                <span className="text-3xl tabular-nums">{countdown.display}</span>
                            )}
                        </div>
                        <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                            {countdown.secondsLeft === 0
                                ? "Your turn now"
                                : estimatedWaitTime !== undefined
                                ? `~${estimatedWaitTime}m est. · counting down`
                                : "Est. Wait"}
                        </div>
                    </div>
                </div>

                {/* Notifications Alert */}
                <div className="bg-background rounded-md shadow-xs border border-border/80 p-4 flex justify-between items-center">
                    <div className="flex items-center text-foreground gap-3">
                        <div className="w-8 h-8 rounded-md bg-secondary border border-border/60 flex items-center justify-center shrink-0">
                            <Bell className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <div>
                            <span className="font-semibold text-sm">Email Notifications Active</span>
                            <p className="text-[10px] text-muted-foreground font-medium">You'll receive alerts when 3 people are ahead and when ≤5 min remain</p>
                        </div>
                    </div>
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
