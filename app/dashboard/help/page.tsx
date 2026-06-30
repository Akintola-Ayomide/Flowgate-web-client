"use client"

import * as React from "react"
import { Sparkles, HelpCircle } from "lucide-react"

const FAQS = [
    { 
        category: "Queues",
        q: "How do I create a new queue?", 
        a: "Navigate to the Queues page using the sidebar, then click the 'Create Queue' button in the top right corner. Configure the queue capacity and average service time, then click Create." 
    },
    { 
        category: "Queues",
        q: "Can I customize the information collected from customers?", 
        a: "Yes, when creating a queue, you can define 'Custom Fields' (e.g. Phone Number, Reason for Visit). Customers must fill in these fields when joining your waitlist." 
    },
    { 
        category: "Queues",
        q: "How do customers join a queue?", 
        a: "Customers can join a queue by scanning the QR code provided on your queue's management page, or by clicking 'Join Queue' from your public queue link on the browse page." 
    },
    { 
        category: "Operations",
        q: "What happens when a queue is paused?", 
        a: "When a queue is paused, no new customers can join the waitlist. However, any existing customers currently in line can still be served, allowing you to wrap up operations smoothly." 
    },
    { 
        category: "Operations",
        q: "How do I verify a customer when they arrive?", 
        a: "Go to your queue's Manage page, click 'Verify QR Ticket', and use your device's camera to scan the QR code on the customer's virtual ticket. Alternatively, you can verify their ticket code manually." 
    },
    { 
        category: "Branding",
        q: "How do I add a physical address and logo to my queue?", 
        a: "During queue creation, you can specify your business address and choose from a curated set of industry preset images (or provide a custom image URL). These details will be displayed to customers browsing queues." 
    }
];

export default function HelpPage() {
    const [selectedCategory, setSelectedCategory] = React.useState<string | "all">("all")

    const filteredFaqs = FAQS.filter(faq => {
        return selectedCategory === "all" || faq.category === selectedCategory
    })

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-display font-bold text-foreground tracking-tight">Help & Support</h1>
                    <p className="text-muted-foreground text-xs font-medium mt-0.5">Learn how to configure virtual lines and manage customer flow.</p>
                </div>
            </div>

            {/* FAQs Accordion / Filter Card */}
            <div className="rounded-md border border-border/80 bg-background p-6 md:p-8 shadow-xs relative overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-[0.08] pointer-events-none" />
                
                {/* FAQs Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
                    <h2 className="font-display text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4 text-primary" />
                        Frequently Asked Questions
                    </h2>
                    
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-2">
                        {["all", "Queues", "Operations", "Branding"].map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap ${
                                    selectedCategory === category
                                        ? "bg-primary border-primary text-primary-foreground"
                                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FAQ Results */}
                <div className="space-y-5 relative z-10">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, i) => (
                            <div key={i} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                                <span className="text-[8px] bg-secondary border border-border/60 text-muted-foreground font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider mb-2 inline-block">
                                    {faq.category}
                                </span>
                                <h4 className="font-semibold text-foreground text-sm mb-1">{faq.q}</h4>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{faq.a}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-muted-foreground text-xs font-medium">
                            No FAQs found matching your search criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* About Flowgate Info Card */}
            <div className="rounded-md border border-primary/20 bg-primary/5 p-6 md:p-8 shadow-xs relative overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-[0.06] pointer-events-none" />
                <div className="relative z-10 flex gap-4 items-start">
                    <div className="p-3 bg-primary/10 rounded-md border border-primary/20 text-primary shrink-0 hidden sm:block">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-display font-bold text-sm text-foreground uppercase tracking-wide">About the Flowgate Platform</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            Flowgate is an enterprise-grade virtual queuing and service optimization engine. Designed with the "Warm Industrial Precision" philosophy, it aims to deliver maximum operational transparency, minimize client waiting friction, and optimize walk-in traffic using high-precision digital ticketing.
                        </p>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                            Flowgate utilizes standard HTML5 APIs to handle live camera QR scans, instant virtual registration, real-time wait-list notifications, and secure cookie-based token authentication to keep your business running smoothly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
