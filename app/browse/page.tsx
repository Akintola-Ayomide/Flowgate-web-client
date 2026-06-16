"use client"

import React, { useEffect, useState } from "react"
import { queueApi, Queue } from "@/features/Queue/services/queue.api"
import { Loader2, Search, ArrowRight, Clock, Users, MapPin, Map, X } from "lucide-react"
import { useRouter } from "next/navigation"

// Helper to parse description + address + image
function parseQueueDetails(description: string | null): { desc: string; address: string | null; imageUrl: string | null } {
    if (!description) {
        return { desc: 'No description provided.', address: null, imageUrl: null };
    }
    try {
        const parsed = JSON.parse(description);
        if (parsed && typeof parsed === 'object') {
            return {
                desc: parsed.desc || 'No description provided.',
                address: parsed.address || null,
                imageUrl: parsed.image || null
            };
        }
    } catch {
        // Fallback for plain text descriptions
    }
    return { desc: description, address: null, imageUrl: null };
}

// Default premium image fallback
const DEFAULT_BUSINESS_IMAGE = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80";

export default function BrowseQueuesPage() {
    const router = useRouter()
    const [queues, setQueues] = useState<Queue[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    
    // Map Modal States
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null)

    useEffect(() => {
        queueApi.getAllActiveQueues()
            .then(data => setQueues(data))
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [])

    const filteredQueues = queues.filter(q => {
        const { desc, address } = parseQueueDetails(q.description);
        const search = searchQuery.toLowerCase();
        return (
            q.name.toLowerCase().includes(search) || 
            desc.toLowerCase().includes(search) ||
            (address || "").toLowerCase().includes(search)
        );
    })

    return (
        <div className="space-y-6 relative pb-10">
            {/* Header Description */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-display font-bold text-foreground tracking-tight">Browse Active Queues</h2>
                    <p className="text-muted-foreground text-xs font-medium mt-0.5">Find and join available services near you in real-time.</p>
                </div>

                {/* Search input wrapper */}
                <div className="relative w-full sm:w-72">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-9 pr-4 py-2 border border-border bg-secondary rounded-md text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all shadow-xs"
                        placeholder="Search name, description, address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64 border border-border bg-background/50 rounded-md">
                    <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
            ) : filteredQueues.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredQueues.map(queue => {
                        const { desc, address, imageUrl } = parseQueueDetails(queue.description);
                        const finalImage = imageUrl || DEFAULT_BUSINESS_IMAGE;

                        return (
                            <div 
                                key={queue.id} 
                                className="bg-background rounded-md shadow-xs border border-border/80 overflow-hidden hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col justify-between group"
                            >
                                {/* Top Banner Image */}
                                <div className="h-36 w-full overflow-hidden relative bg-secondary">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img 
                                        src={finalImage} 
                                        alt={queue.name} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                                    <div className="absolute bottom-3 left-4 right-4">
                                        <span className="bg-primary/95 text-primary-foreground border border-primary/20 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                                            Active
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div className="space-y-3">
                                        <div>
                                            <h3 className="text-base font-display font-bold text-foreground group-hover:text-primary transition-colors truncate">
                                                {queue.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground font-medium line-clamp-2 leading-relaxed mt-1">
                                                {desc}
                                            </p>
                                        </div>

                                        {/* Address section */}
                                        {address && (
                                            <div className="flex items-start gap-2 text-xs text-muted-foreground font-semibold bg-secondary/45 border border-border/40 p-2.5 rounded-md">
                                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <p className="truncate text-foreground/80">{address}</p>
                                                    <button 
                                                        onClick={() => setSelectedAddress(address)}
                                                        className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer font-bold uppercase tracking-wider"
                                                    >
                                                        <Map className="w-3 h-3" />
                                                        <span>Locate on Map</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Queue status metrics */}
                                        <div className="flex space-x-4 border-t border-border/50 pt-3 text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80">
                                            <div className="flex items-center">
                                                <Users className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/60" />
                                                <span>{queue.inLine ?? 0} waiting</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground/60" />
                                                <span>~{queue.waitTime ?? 0} min wait</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/join/${queue.id}`)}
                                        className="mt-5 w-full flex items-center justify-center px-4 py-2.5 border border-primary/10 text-xs font-bold uppercase tracking-wider rounded-md text-primary-foreground bg-primary hover:bg-primary/95 transition-all shadow-xs cursor-pointer gap-1.5"
                                    >
                                        <span>Join Queue</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center bg-background rounded-md border border-border/80 p-16 max-w-xl mx-auto shadow-xs relative overflow-hidden">
                    <div className="absolute inset-0 dot-grid opacity-[0.1] pointer-events-none" />
                    <div className="relative z-10">
                        <Search className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
                        <h3 className="text-base font-display font-bold text-foreground mb-1">No queues found</h3>
                        <p className="text-xs text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">
                            {searchQuery ? 'Try adjusting your search query terms.' : 'There are currently no active queues available.'}
                        </p>
                    </div>
                </div>
            )}

            {/* Google Maps Embed Modal */}
            {selectedAddress && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                    <div className="bg-background border border-border rounded-md shadow-lg max-w-2xl w-full overflow-hidden flex flex-col relative animate-scale-up">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <div>
                                    <h3 className="font-display font-bold text-sm text-foreground">Business Location Map</h3>
                                    <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5 truncate max-w-sm sm:max-w-md">{selectedAddress}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedAddress(null)}
                                className="h-8 w-8 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                        <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-secondary/35 gap-3">
                            <a 
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-md bg-secondary hover:bg-background border border-border text-xs font-bold uppercase tracking-wider text-foreground transition-all cursor-pointer"
                            >
                                Open in Google Maps
                            </a>
                            <button
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
