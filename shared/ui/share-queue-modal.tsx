"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import QRCode from "qrcode"
import { X, Share2, Copy, Check, Download, Loader2 } from "lucide-react"
import { Button } from "./button"

interface ShareQueueModalProps {
    queueId: number
    queueName: string
    onClose: () => void
}

export function ShareQueueModal({ queueId, queueName, onClose }: ShareQueueModalProps) {
    const [copied, setCopied] = useState(false)
    const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
    const shareUrl = typeof window !== "undefined"
        ? `${window.location.origin}/join/${queueId}`
        : ""

    useEffect(() => {
        if (!shareUrl) return
        let cancelled = false
        QRCode.toDataURL(shareUrl, {
            width: 280,
            margin: 2,
            color: { dark: "#1C1C1A", light: "#FAFAF8" },
            errorCorrectionLevel: "H",
        }).then((url) => {
            if (!cancelled) setQrDataUrl(url)
        }).catch(() => {
            if (!cancelled) setQrDataUrl(null)
        })
        return () => { cancelled = true }
    }, [shareUrl])

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }, [shareUrl])

    const handleDownloadQr = useCallback(() => {
        if (!qrDataUrl) return
        const link = document.createElement("a")
        link.href = qrDataUrl
        link.download = `qline-queue-${queueId}-share.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }, [qrDataUrl, queueId])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-background border border-border rounded-md shadow-lg max-w-sm w-full overflow-hidden flex flex-col relative animate-scale-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
                    <div className="flex items-center gap-2 min-w-0">
                        <Share2 className="h-5 w-5 text-primary shrink-0" />
                        <h3 className="font-display font-bold text-sm text-foreground truncate">
                            Share {queueName}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0 ml-2"
                        aria-label="Close"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    {/* Share Link Input + Copy */}
                    <div className="space-y-1.5">
                        <label className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none">
                            Share Link
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                readOnly
                                value={shareUrl}
                                className="flex-1 h-11 rounded-md border border-border bg-secondary px-4 py-2 text-xs text-foreground font-mono select-all outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all"
                            />
                            <button
                                onClick={handleCopy}
                                className="h-11 w-11 flex items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer shrink-0"
                                title="Copy link"
                            >
                                {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                            </button>
                        </div>
                        {copied && (
                            <p className="text-[10px] text-primary font-semibold animate-fade-in">Link copied to clipboard!</p>
                        )}
                    </div>

                    {/* QR Code */}
                    <div className="space-y-1.5">
                        <label className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none">
                            QR Code
                        </label>
                        <div className="flex flex-col items-center gap-3 bg-secondary/30 border border-border/60 rounded-md p-5">
                            <div className="w-44 h-44 bg-[#FAFAF8] border border-border rounded-md flex items-center justify-center overflow-hidden">
                                {qrDataUrl ? (
                                    <img
                                        src={qrDataUrl}
                                        alt={`QR Code for ${queueName}`}
                                        className="w-full h-full object-contain p-1"
                                        draggable={false}
                                    />
                                ) : (
                                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
                                )}
                            </div>
                            {qrDataUrl && (
                                <button
                                    onClick={handleDownloadQr}
                                    className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
                                >
                                    <Download className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
                                    Download QR
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end px-6 py-3 border-t border-border bg-secondary/35">
                    <Button onClick={onClose} variant="secondary" className="text-xs font-bold uppercase">
                        Close
                    </Button>
                </div>
            </div>
        </div>
    )
}
