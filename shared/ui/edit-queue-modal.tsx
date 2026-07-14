"use client"

import React, { useState } from "react"
import { X, Edit3, Loader2, Upload } from "lucide-react"
import { Button } from "./button"
import { Input } from "./input"
import { queueApi, Queue, UpdateQueueDto } from "@/features/Queue/services/queue.api"
import { authApi } from "@/features/auth/services/auth.api"
import { useToast } from "@/shared/context/toast-context"

function parseQueueDetails(description: string | null, imageFallback?: string | null): { desc: string; address: string | null; imageUrl: string | null } {
    if (!description) return { desc: "", address: null, imageUrl: imageFallback || null }
    try {
        const parsed = JSON.parse(description)
        if (parsed && typeof parsed === "object") {
            return {
                desc: parsed.desc || "",
                address: parsed.address || null,
                imageUrl: imageFallback || parsed.image || null,
            }
        }
    } catch {}
    return { desc: description || "", address: null, imageUrl: imageFallback || null }
}

interface EditQueueModalProps {
    queue: Queue
    onClose: () => void
    onSaved: (updated: Queue) => void
}

export function EditQueueModal({ queue, onClose, onSaved }: EditQueueModalProps) {
    const toast = useToast()
    const initial = parseQueueDetails(queue.description)

    const [name, setName] = useState(queue.name)
    const [desc, setDesc] = useState(initial.desc)
    const [address, setAddress] = useState(initial.address || "")
    const [imageUrl, setImageUrl] = useState(queue.image || initial.imageUrl || "")
    const [isUploadingImage, setIsUploadingImage] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const imageFileInputRef = React.useRef<HTMLInputElement>(null)

    const handleUploadClick = () => imageFileInputRef.current?.click()

    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploadingImage(true)
        try {
            const { url } = await authApi.uploadImage(file)
            setImageUrl(url)
            toast.success("Image uploaded")
        } catch (err: any) {
            toast.error("Failed to upload image", err.message)
        } finally {
            setIsUploadingImage(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) {
            toast.error("Name is required", "Please enter a queue name.")
            return
        }
        setIsSaving(true)
        try {
            const serializedDescription = JSON.stringify({
                desc: desc.trim(),
                address: address.trim(),
                image: imageUrl,
            })
            const dto: UpdateQueueDto = {
                name: name.trim(),
                description: serializedDescription,
                image: imageUrl || undefined,
            }
            const updated = await queueApi.updateQueue(queue.id, dto)
            toast.success("Queue updated", `"${updated.name}" has been saved.`)
            onSaved(updated)
            onClose()
        } catch (err: any) {
            toast.error("Failed to update queue", err.message)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="bg-background border border-border rounded-md shadow-lg max-w-lg w-full overflow-hidden flex flex-col relative animate-scale-up">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/50">
                    <div className="flex items-center gap-2 min-w-0">
                        <Edit3 className="h-5 w-5 text-primary shrink-0" />
                        <h3 className="font-display font-bold text-sm text-foreground truncate">
                            Edit Queue
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

                <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
                    {/* Queue Name */}
                    <Input
                        label="Queue Name *"
                        placeholder="e.g., General Inquiries"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isSaving}
                    />

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none">
                            Description
                        </label>
                        <textarea
                            placeholder="Describe this queue..."
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            rows={3}
                            disabled={isSaving}
                            className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all resize-none"
                        />
                    </div>

                    {/* Business Address */}
                    <Input
                        label="Business Address"
                        placeholder="e.g., 123 Main St, New York, NY"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={isSaving}
                    />

                    {/* Image */}
                    <div className="space-y-2.5">
                        <label className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none">
                            Business Image or Logo
                        </label>
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="flex-1 w-full sm:w-auto">
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    disabled={isSaving}
                                    className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all"
                                />
                            </div>
                            <input
                                type="file"
                                ref={imageFileInputRef}
                                onChange={handleImageFileChange}
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={handleUploadClick}
                                disabled={isUploadingImage || isSaving}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                            >
                                {isUploadingImage ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Upload className="h-3.5 w-3.5" />
                                )}
                                Upload
                            </button>
                        </div>
                        {imageUrl && (
                            <div className="relative h-24 w-full rounded-md overflow-hidden border border-border/60 bg-secondary">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageUrl}
                                    alt="Queue image"
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl("")}
                                    className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
                        <Button type="button" variant="secondary" onClick={onClose} className="text-xs font-bold uppercase">
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSaving} className="text-xs font-bold uppercase gap-1.5">
                            {!isSaving && <Edit3 className="h-3.5 w-3.5" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
