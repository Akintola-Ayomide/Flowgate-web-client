"use client";

import { io } from "socket.io-client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { queueApi, QueueStatusResponse } from "@/features/Queue/services/queue.api";
import { Loader2, ArrowLeft, Bell, AlertTriangle, Timer, Download, CheckCircle2, Clock, Hash } from "lucide-react";
import { Button } from "@/shared/ui/button";
import QRCode from "qrcode";

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
// QR Code Image Hook
// ──────────────────────────────────────────────

/**
 * Generates a QR code data URL from a token string.
 * Returns null while loading or if the token is empty.
 */
function useQrCodeDataUrl(token: string): string | null {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setDataUrl(null);
            return;
        }

        let cancelled = false;
        QRCode.toDataURL(token, {
            width: 280,
            margin: 2,
            color: {
                dark: '#1C1C1A',
                light: '#FAFAF8',
            },
            errorCorrectionLevel: 'H',
        }).then((url) => {
            if (!cancelled) setDataUrl(url);
        }).catch(() => {
            if (!cancelled) setDataUrl(null);
        });

        return () => { cancelled = true; };
    }, [token]);

    return dataUrl;
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
    const qrDataUrl = useQrCodeDataUrl(qrToken);

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

    /** Download the QR code as a PNG file */
    const handleDownloadQr = useCallback(() => {
        if (!qrDataUrl) return;
        const link = document.createElement('a');
        link.href = qrDataUrl;
        link.download = `qline-ticket-${statusData?.entry?.position ?? entryId}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [qrDataUrl, statusData?.entry?.position, entryId]);

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

    const isReady = countdown.secondsLeft === 0 && estimatedWaitTime !== undefined;

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

                {/* ── Ticket Card ── */}
                <div className="bg-background rounded-md shadow-xs border border-border/80 overflow-hidden">
                    {/* Ticket header strip */}
                    <div className="bg-primary/8 border-b border-border/60 px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-md bg-primary/15 border border-primary/20 flex items-center justify-center">
                                <Hash className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">Your Ticket</p>
                                <p className="text-lg font-display font-black text-primary tracking-tight leading-none">{ticketNumber}</p>
                            </div>
                        </div>
                        {isReady && (
                            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-sm">
                                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Your Turn!</span>
                            </div>
                        )}
                    </div>

                    {/* QR Code area */}
                    <div className="flex flex-col items-center px-6 py-8">
                        <div className="relative">
                            {/* QR frame */}
                            <div className="w-52 h-52 bg-[#FAFAF8] border-2 border-border rounded-md flex items-center justify-center shadow-xs overflow-hidden relative">
                                {qrDataUrl ? (
                                    <img
                                        src={qrDataUrl}
                                        alt={`QR Code for ticket ${ticketNumber}`}
                                        className="w-full h-full object-contain p-2"
                                        draggable={false}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
                                        <span className="text-[9px] text-muted-foreground/60 font-mono">Generating...</span>
                                    </div>
                                )}
                                {/* Corner brackets overlay */}
                                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/40 rounded-tl-sm pointer-events-none" />
                                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/40 rounded-tr-sm pointer-events-none" />
                                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/40 rounded-bl-sm pointer-events-none" />
                                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/40 rounded-br-sm pointer-events-none" />
                            </div>
                        </div>

                        <p className="mt-3 text-[9px] text-muted-foreground/70 font-mono text-center max-w-[200px] break-all leading-relaxed">
                            {qrToken ? qrToken.slice(0, 32) + '…' : '—'}
                        </p>

                        {/* Download button */}
                        {qrDataUrl && (
                            <button
                                onClick={handleDownloadQr}
                                className="mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
                            >
                                <Download className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
                                Download QR
                            </button>
                        )}
                    </div>

                    {/* Ticket details */}
                    <div className="border-t border-dashed border-border/60 mx-4 mb-4" />
                    <div className="px-6 pb-6 space-y-0">
                        {queue && (
                            <div className="flex justify-between items-center py-2.5 border-b border-border/40 text-sm">
                                <span className="text-muted-foreground font-medium text-xs">Queue</span>
                                <span className="text-foreground font-bold text-xs">{queue.name}</span>
                            </div>
                        )}
                        {queue?.owner && (
                            <div className="flex justify-between items-center py-2.5 border-b border-border/40 text-sm">
                                <span className="text-muted-foreground font-medium text-xs">Organiser</span>
                                <span className="text-foreground font-bold text-xs">{queue.owner.name}</span>
                            </div>
                        )}
                        {entry?.joinedAt && (
                            <div className="flex justify-between items-center py-2.5 text-sm">
                                <span className="text-muted-foreground font-medium text-xs flex items-center gap-1"><Clock className="h-3 w-3" /> Joined At</span>
                                <span className="text-foreground font-bold text-xs">
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
