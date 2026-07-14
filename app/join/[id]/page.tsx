"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { queueApi, Queue } from "@/features/Queue/services/queue.api"
import { Loader2, ArrowLeft, Users, Clock, Info, AlertTriangle, MapPin, Map, X, Share2, Check } from "lucide-react";
import { useAuth } from "@/features/auth/context/auth-context"
import { useToast } from "@/shared/context/toast-context"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { ShareQueueModal } from "@/shared/ui/share-queue-modal"

// Helper to parse description + address + image
function parseQueueDetails(description: string | null, imageFallback?: string | null): { desc: string; address: string | null; imageUrl: string | null } {
    if (!description) {
        return { desc: 'No description provided.', address: null, imageUrl: imageFallback || null };
    }
    try {
        const parsed = JSON.parse(description);
        if (parsed && typeof parsed === 'object') {
            return {
                desc: parsed.desc || 'No description provided.',
                address: parsed.address || null,
                imageUrl: imageFallback || parsed.image || null
            };
        }
    } catch {
        // Fallback for plain text descriptions
    }
    return { desc: description, address: null, imageUrl: imageFallback || null };
}

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
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const toast = useToast();

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
                    toast.error("Name required", "Please provide a name to join as guest.");
                    setIsJoining(false);
                    return;
                }
                await loginGuest(guestName, guestPhone);
            }
            
            // Prepare custom data for joining queue
            const data = { ...customData };
            const result = await queueApi.joinQueue(queue.id, data);
            toast.success("Joined queue!", `You are position #${result.entry.position}.`);
            router.replace(`/ticket/${result.entry.id}`);
        } catch (err: any) {
            toast.error("Failed to join queue", err.message || "An unexpected error occurred.");
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

    const { desc, address, imageUrl } = parseQueueDetails(queue.description, queue.image);

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
                    {imageUrl && (
                        <div className="h-48 w-full overflow-hidden relative bg-secondary border-b border-border/60">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={imageUrl} 
                                alt={queue.name} 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        </div>
                    )}
                    <form onSubmit={handleJoin} className="p-6 md:p-8 space-y-6">
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-border/60">
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl font-display font-bold text-foreground tracking-tight truncate">{queue.name}</h1>
                                <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mt-1">
                                    {queue.owner && (
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Managed by {queue.owner.name}</p>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => setShowShareModal(true)}
                                        className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider bg-transparent border-0 p-0"
                                    >
                                        <Share2 className="w-3.5 h-3.5" />
                                        <span>Share Queue</span>
                                    </button>
                                </div>
                            </div>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-sm border shrink-0 ${
                                queue.status === 'active' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-secondary text-muted-foreground border-border/60'
                            }`}>
                                {queue.status}
                            </span>
                        </div>

                        {desc && (
                            <p className="text-sm text-muted-foreground leading-relaxed font-medium break-words">
                                {desc}
                            </p>
                        )}

                        {/* Address section */}
                        {address && (
                            <div className="flex items-start gap-2 text-xs text-muted-foreground font-semibold bg-secondary/45 border border-border/40 p-2.5 rounded-md">
                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="truncate text-foreground/80">{address}</p>
                                    <button 
                                        type="button"
                                        onClick={() => setSelectedAddress(address)}
                                        className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider bg-transparent border-0 p-0"
                                    >
                                        <Map className="w-3.5 h-3.5" />
                                        <span>Locate on Map</span>
                                    </button>
                                </div>
                            </div>
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
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-xs font-bold tracking-wider text-muted-foreground uppercase">Guest Information</h3>
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/auth?redirect=/join/${queueId}`)}
                                        className="text-xs font-bold text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
                                    >
                                        Sign in to use account
                                    </button>
                                </div>
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

            {/* Share Queue Modal */}
            {showShareModal && (
                <ShareQueueModal queueId={queueId} queueName={queue?.name || "Queue"} onClose={() => setShowShareModal(false)} />
            )}

            {/* Google Maps Embed Modal */}
            {selectedAddress && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
                    <div className="bg-background border border-border rounded-t-xl sm:rounded-md shadow-lg w-full sm:max-w-2xl overflow-hidden flex flex-col relative animate-scale-up max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-secondary/50 shrink-0">
                            <div className="flex items-center gap-2 min-w-0">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <div className="min-w-0">
                                    <h3 className="font-display font-bold text-sm text-foreground">Business Location</h3>
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5 truncate max-w-[200px] sm:max-w-md">{selectedAddress}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedAddress(null)}
                                className="h-8 w-8 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 ml-2"
                                aria-label="Close Map"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Interactive Map Iframe */}
                        <div className="relative w-full aspect-video bg-secondary">
                            <iframe
                                title="Google Map Location"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedAddress)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            />
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end px-4 sm:px-6 py-3 border-t border-border bg-secondary/35 gap-3 shrink-0">
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-md bg-secondary hover:bg-background border border-border text-xs font-bold uppercase tracking-wider text-foreground transition-all cursor-pointer"
                            >
                                Open in Google Maps
                            </a>
                            <button
                                type="button"
                                onClick={() => setSelectedAddress(null)}
                                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/95 transition-all cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
