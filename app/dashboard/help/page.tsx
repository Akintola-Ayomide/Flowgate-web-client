"use client"

import * as React from "react"
import { Mail, MessageCircle, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/shared/ui/button"

export default function HelpPage() {
    return (
        <div className="max-w-4xl space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
                <p className="text-gray-500 mt-0.5 text-sm">Get assistance with using Qline and managing your queues.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                        <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Documentation</h3>
                    <p className="text-sm text-gray-500 mb-4">Read our detailed guides on how to setup and use features.</p>
                    <Button variant="secondary" className="w-full gap-2">
                        Browse Docs
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4">
                        <MessageCircle className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
                    <p className="text-sm text-gray-500 mb-4">Chat directly with our support team during business hours.</p>
                    <Button variant="secondary" className="w-full">Start Chat</Button>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 mb-4">
                        <Mail className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
                    <p className="text-sm text-gray-500 mb-4">Send us an email and we'll get back to you within 24 hours.</p>
                    <Button variant="secondary" className="w-full">Contact Us</Button>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                    {[
                        { q: "How do I create a new queue?", a: "Navigate to the Queues page using the sidebar, then click the 'Create Queue' button in the top right corner. Fill in the required details and click Save." },
                        { q: "Can I customize the information collected from customers?", a: "Yes, when creating or editing a queue, you can add custom fields such as Phone Number or Order ID that customers must fill out before joining." },
                        { q: "How do customers join a queue?", a: "Customers can join a queue by scanning the QR code provided on your queue's management page, or by visiting your public queue link." },
                        { q: "What happens when a queue is paused?", a: "When a queue is paused, no new customers can join, but existing customers in the line can still be served. This is useful for clearing out a backlog before closing." }
                    ].map((faq, i) => (
                        <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <h4 className="font-medium text-gray-900 mb-2">{faq.q}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
