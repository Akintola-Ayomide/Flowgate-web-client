"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus, X, Image as ImageIcon, Upload } from "lucide-react"
import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { queueApi, CreateQueueDto } from "@/features/Queue/services/queue.api"
import { authApi } from "@/features/auth/services/auth.api"
import { cn } from "@/shared/lib/utils"

const MAX_PARTICIPANTS = 1000;

const PRESET_IMAGES = {
    retail: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80",
    medical: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80",
    cafe: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    tech: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    salon: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80",
}

type PresetKey = keyof typeof PRESET_IMAGES;

export default function CreateQueuePage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const [form, setForm] = React.useState<CreateQueueDto>({
        name: "",
        description: "",
        maxParticipants: 50,
        avgServiceTime: 5,
        customFields: [],
    })

    // Business address and image options
    const [address, setAddress] = React.useState("")
    const [imageOption, setImageOption] = React.useState<PresetKey | "custom" | "upload" | "none">("none")
    const [customImageUrl, setCustomImageUrl] = React.useState("")
    const [uploadedImageUrl, setUploadedImageUrl] = React.useState("")
    const [isUploadingImage, setIsUploadingImage] = React.useState(false)
    const imageFileInputRef = React.useRef<HTMLInputElement>(null)

    const [newFieldLabel, setNewFieldLabel] = React.useState("")

    const handleUploadClick = () => {
        imageFileInputRef.current?.click()
    }

    const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploadingImage(true)
        try {
            const { url } = await authApi.uploadImage(file)
            setUploadedImageUrl(url)
        } catch (err: any) {
            alert(err.message || "Failed to upload image")
        } finally {
            setIsUploadingImage(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return
        setIsLoading(true)
        setError(null)

        // Select the final image URL
        const finalImage = imageOption === "custom" 
            ? customImageUrl 
            : imageOption === "upload"
                ? uploadedImageUrl
                : imageOption !== "none" 
                    ? PRESET_IMAGES[imageOption] 
                    : "";

        // Package metadata inside the description field as JSON string
        const serializedDescription = JSON.stringify({
            desc: form.description || "",
            address: address.trim(),
            image: finalImage
        })

        const payload: CreateQueueDto = {
            ...form,
            description: serializedDescription
        }

        try {
            await queueApi.createQueue(payload)
            router.push("/dashboard/queues")
        } catch (err: any) {
            setError(err.message ?? "Failed to create queue")
        } finally {
            setIsLoading(false)
        }
    }

    const addCustomField = () => {
        if (!newFieldLabel.trim()) return
        setForm((f) => ({
            ...f,
            customFields: [...(f.customFields ?? []), { label: newFieldLabel.trim(), type: "text", required: false }],
        }))
        setNewFieldLabel("")
    }

    const removeCustomField = (idx: number) => {
        setForm((f) => ({
            ...f,
            customFields: (f.customFields ?? []).filter((_, i) => i !== idx),
        }))
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/dashboard/queues" className="hover:text-foreground transition-colors">Queues</Link>
                <span>/</span>
                <span className="text-foreground">Create</span>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3">
                <Link href="/dashboard/queues">
                    <button 
                        type="button" 
                        className="h-9 w-9 flex items-center justify-center rounded-md border border-border bg-secondary text-muted-foreground hover:bg-background transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="h-4.5 w-4.5" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-lg font-display font-bold text-foreground tracking-tight">Create a New Queue</h1>
                    <p className="text-xs text-muted-foreground font-medium mt-0.5">Configure your queue settings and start managing customers.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Information */}
                <div className="rounded-md border border-border/80 bg-background p-6 space-y-5 shadow-xs">
                    <div>
                        <h2 className="font-display text-sm font-bold text-foreground">General Information</h2>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">Provide the basic details for this queue.</p>
                    </div>

                    <Input
                        label="Queue Name *"
                        placeholder="e.g., General Inquiries"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        disabled={isLoading}
                    />

                    <div className="space-y-1.5">
                        <label className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none">
                            Description <span className="text-muted-foreground/60 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            placeholder="Provide a brief summary of this queue."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={3}
                            disabled={isLoading}
                            className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all resize-none"
                        />
                    </div>
                </div>

                {/* Business Location & Branding */}
                <div className="rounded-md border border-border/80 bg-background p-6 space-y-5 shadow-xs">
                    <div>
                        <h2 className="font-display text-sm font-bold text-foreground">Business Details</h2>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">Help customers find and recognize your location.</p>
                    </div>

                    <Input
                        label="Business Address (Optional)"
                        placeholder="e.g., 123 Main St, New York, NY"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        disabled={isLoading}
                    />

                    <div className="space-y-2.5">
                        <label className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none">
                            Business Image or Logo
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            <button
                                type="button"
                                onClick={() => setImageOption("none")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold cursor-pointer transition-all",
                                    imageOption === "none"
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <X className="h-5 w-5 mb-1.5" />
                                <span>No Image</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageOption("retail")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold cursor-pointer transition-all",
                                    imageOption === "retail"
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <ImageIcon className="h-5 w-5 mb-1.5" />
                                <span>Retail Presets</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageOption("medical")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold cursor-pointer transition-all",
                                    imageOption === "medical"
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <ImageIcon className="h-5 w-5 mb-1.5" />
                                <span>Clinic / Medical</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageOption("cafe")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold cursor-pointer transition-all",
                                    imageOption === "cafe"
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <ImageIcon className="h-5 w-5 mb-1.5" />
                                <span>Cafe / Resto</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageOption("tech")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold cursor-pointer transition-all",
                                    imageOption === "tech"
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <ImageIcon className="h-5 w-5 mb-1.5" />
                                <span>Tech Support</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageOption("salon")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold cursor-pointer transition-all",
                                    imageOption === "salon"
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <ImageIcon className="h-5 w-5 mb-1.5" />
                                <span>Salon / Spa</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageOption("upload")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold cursor-pointer transition-all",
                                    imageOption === "upload"
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Upload className="h-5 w-5 mb-1.5" />
                                <span>Upload Image</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setImageOption("custom")}
                                className={cn(
                                    "flex flex-col items-center justify-center p-3 rounded-md border text-xs font-semibold cursor-pointer transition-all",
                                    imageOption === "custom"
                                        ? "bg-primary/10 border-primary text-primary"
                                        : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <ImageIcon className="h-5 w-5 mb-1.5" />
                                <span>Custom URL</span>
                            </button>
                        </div>

                        {imageOption === "upload" && (
                            <div className="pt-1.5 space-y-3">
                                <input
                                    type="file"
                                    ref={imageFileInputRef}
                                    onChange={handleImageFileChange}
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    className="hidden"
                                />
                                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-md border border-dashed border-border/80 bg-secondary/35">
                                    <button
                                        type="button"
                                        onClick={handleUploadClick}
                                        disabled={isUploadingImage || isLoading}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-md border border-border bg-background text-xs font-bold uppercase tracking-wider text-foreground hover:bg-secondary transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                                    >
                                        {isUploadingImage ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <Upload className="h-3.5 w-3.5" />
                                        )}
                                        {uploadedImageUrl ? "Change Image" : "Choose File"}
                                    </button>
                                    
                                    {uploadedImageUrl && (
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={uploadedImageUrl}
                                                alt="Uploaded logo"
                                                className="h-12 w-12 rounded-md object-cover border border-border/60 shrink-0"
                                            />
                                            <div className="text-left">
                                                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider leading-none mb-1">Uploaded Successfully</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setUploadedImageUrl("")}
                                                    className="text-xs text-destructive font-semibold hover:underline leading-none cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {imageOption === "custom" && (
                            <div className="pt-1.5">
                                <Input
                                    label="Custom Image URL"
                                    placeholder="https://example.com/image.jpg"
                                    value={customImageUrl}
                                    onChange={(e) => setCustomImageUrl(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Queue Configuration */}
                <div className="rounded-md border border-border/80 bg-background p-6 space-y-5 shadow-xs">
                    <div>
                        <h2 className="font-display text-sm font-bold text-foreground">Queue Configuration</h2>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">Configure how the queue will operate.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <Input
                            label="Max Participants"
                            type="number"
                            min={1}
                            max={MAX_PARTICIPANTS}
                            value={form.maxParticipants}
                            onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) || 50 })}
                            disabled={isLoading}
                        />

                        <Input
                            label="Average Service Time (mins)"
                            type="number"
                            min={1}
                            value={form.avgServiceTime}
                            onChange={(e) => setForm({ ...form, avgServiceTime: parseInt(e.target.value) || 5 })}
                            disabled={isLoading}
                        />
                    </div>
                </div>

                {/* Custom Fields */}
                <div className="rounded-md border border-border/80 bg-background p-6 space-y-5 shadow-xs">
                    <div>
                        <h2 className="font-display text-sm font-bold text-foreground">Custom Fields</h2>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">Collect extra information from participants when they join.</p>
                    </div>

                    {(form.customFields ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {(form.customFields ?? []).map((field, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 rounded-sm bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 text-xs font-bold uppercase tracking-wide"
                                >
                                    {field.label}
                                    <button
                                        type="button"
                                        onClick={() => removeCustomField(idx)}
                                        className="text-primary hover:text-accent transition-colors cursor-pointer"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="e.g., Phone Number"
                            value={newFieldLabel}
                            onChange={(e) => setNewFieldLabel(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomField() } }}
                            className="flex-1 rounded-md border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:bg-background transition-all"
                        />
                        <button
                            type="button"
                            onClick={addCustomField}
                            className="flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-secondary transition-colors cursor-pointer shrink-0 uppercase tracking-wider"
                        >
                            <Plus className="h-4 w-4 text-muted-foreground" />
                            Add Field
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-xs font-semibold text-destructive">
                        {error}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2 pb-8">
                    <Link href="/dashboard/queues" className="w-full sm:w-auto">
                        <Button variant="secondary" type="button" className="w-full text-xs font-bold uppercase">Cancel</Button>
                    </Link>
                    <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto gap-2 min-w-[140px] text-xs font-bold uppercase">
                        {!isLoading && <Plus className="h-4 w-4" />}
                        Create Queue
                    </Button>
                </div>
            </form>
        </div>
    )
}
