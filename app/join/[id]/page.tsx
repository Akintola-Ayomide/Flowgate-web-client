"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { queueApi, Queue } from "@/features/Queue/services/queue.api"
import { Loader2, ArrowLeft, Users, Clock, Info, AlertTriangle } from "lucide-react";
import { useAuth } from "@/features/auth/context/auth-context"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

export default function JoinQueuePage() {
    const params = useParams()
    const router = useRouter()
    const queueId = Number(params.id)
    const { isAuthenticated, loginGuest } = useAuth();
    
    const [queue, setQueue] = useState<Queue | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isJoining, setIsJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [guestName, setGuestName] = useState<string>('');
    const [guestPhone, setGuestPhone] = useState<string>('');
    const [customData, setCustomData] = useState<Record<string, any>>({});

    useEffect(() => {
        queueApi.getQueue(queueId)
            .then(data => setQueue(data))
            .catch(err => setError(err.message || "Failed to load queue details."))
            .finally(() => setIsLoading(false))
    }, [queueId])

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!queue) return;
        setIsJoining(true);
        try {
            // If user is not authenticated, perform guest login first
            if (!isAuthenticated) {
                if (!guestName.trim()) {
                    alert("Please provide a name to join as guest.");
                    setIsJoining(false);
                    return;
                }
                await loginGuest(guestName, guestPhone);
            }
            
            // Prepare custom data for joining queue
            const data = { ...customData };
            const result = await queueApi.joinQueue(queue.id, data);
            router.replace(`/ticket/${result.entry.id}`);
        } catch (err: any) {
            alert(err.message || "Failed to join queue.");
        } finally {
            setIsJoining(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex justify-center items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !queue) {
        return (
            <div className="min-h-screen bg-background flex flex-col justify-center items-center px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-[0.1] pointer-events-none" />
                <div className="relative z-10 space-y-4 max-w-sm">
                    <AlertTriangle className="h-12 w-12 text-accent mx-auto" />
                    <h1 className="text-xl font-display font-bold text-foreground">Queue Not Available</h1>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">{error || "This queue may have been closed, paused, or deleted."}</p>
                    <Button onClick={() => router.back()} variant="secondary" size="default" className="w-full">
                        Go Back
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full warm-glow pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full warm-glow pointer-events-none" />

            <div className="max-w-xl mx-auto relative z-10">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition mb-6 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Browse
                </button>

                <div className="bg-background rounded-md shadow-xs border border-border/80 overflow-hidden">
                    <form onSubmit={handleJoin} className="p-6 md:p-8 space-y-6">
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
                            <div>
                                <h1 className="text-xl font-display font-bold text-foreground tracking-tight">{queue.name}</h1>
                                {queue.owner && (
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mt-1">Managed by {queue.owner.name}</p>
                                )}
                            </div>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border ${
                                queue.status === 'active' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary text-muted-foreground border-border/60'
                            }`}>
                                {queue.status}
                            </span>
                        </div>

                        {queue.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                                {queue.description}
                            </p>
                        )}

                        {/* Status Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary/40 border border-border/50 rounded-md p-4 text-center">
                                <Users className="h-4.5 w-4.5 text-muted-foreground/60 mx-auto mb-2" />
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Capacity Limit</div>
                                <div className="text-lg font-display font-black text-foreground">{queue.maxParticipants}</div>
                            </div>
                            <div className="bg-secondary/40 border border-border/50 rounded-md p-4 text-center">
                                <Clock className="h-4.5 w-4.5 text-muted-foreground/60 mx-auto mb-2" />
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Service Interval</div>
                                <div className="text-lg font-display font-black text-foreground">{queue.avgServiceTime}m</div>
                            </div>
                        </div>

                        {/* Guest signup inputs if they're anonymous */}
                        {!isAuthenticated && (
                            <div className="space-y-4 border-t border-border/60 pt-5">
                                <h3 className="font-display text-xs font-bold tracking-wider text-muted-foreground uppercase">Guest Information</h3>
                                <Input
                                    label="Your Name *"
                                    placeholder="Enter your name"
                                    value={guestName}
                                    onChange={(e) => setGuestName(e.target.value)}
                                    required
                                    disabled={isJoining}
                                />
                                <Input
                                    label="Phone Number"
                                    placeholder="e.g., +1 555 123 4567"
                                    value={guestPhone}
                                    onChange={(e) => setGuestPhone(e.target.value)}
                                    disabled={isJoining}
                                />
                            </div>
                        )}

                        {/* Dynamic Custom Fields Inputs */}
                        {queue.customFields && queue.customFields.length > 0 && (
                            <div className="space-y-4 border-t border-border/60 pt-5">
                                <h3 className="font-display text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                    Queue Entry Details
                                </h3>
                                <div className="space-y-4">
                                    {queue.customFields.map((field: any, idx: number) => {
                                        const label = field.label || field.name || `Field ${idx + 1}`;
                                        return (
                                            <Input
                                                key={idx}
                                                label={label + (field.required ? " *" : "")}
                                                placeholder={`Enter your ${label.toLowerCase()}`}
                                                required={field.required}
                                                value={customData[label] || ''}
                                                onChange={(e) => setCustomData({ ...customData, [label]: e.target.value })}
                                                disabled={isJoining}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                disabled={isJoining || queue.status !== 'active'}
                                className="w-full h-12 text-sm font-bold uppercase tracking-wider gap-2 shadow-glow"
                                size="lg"
                                isLoading={isJoining}
                            >
                                Get Queue Ticket
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
