"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Plus, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { queueApi, CreateQueueDto } from "@/features/Queue/services/queue.api"

const MAX_PARTICIPANTS = 1000;

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

    const [newFieldLabel, setNewFieldLabel] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) return
        setIsLoading(true)
        setError(null)
        try {
            await queueApi.createQueue(form)
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
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Link href="/dashboard" className="hover:text-gray-700 transition-colors">Dashboard</Link>
                <span>/</span>
                <Link href="/dashboard/queues" className="hover:text-gray-700 transition-colors">Queues</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Create</span>
            </div>

            <div className="flex items-center gap-3">
                <Link href="/dashboard/queues">
                    <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create a New Queue</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Configure your queue settings and start managing customers.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Information */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">General Information</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Provide the basic details for this queue.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Queue Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., General Inquiries"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Description <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <textarea
                            placeholder="Provide a brief summary of this queue."
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={4}
                            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                        />
                    </div>
                </div>

                {/* Queue Configuration */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Queue Configuration</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Configure how the queue will operate.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Participants</label>
                            <input
                                type="number"
                                min={1}
                                max={MAX_PARTICIPANTS}
                                value={form.maxParticipants}
                                onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) || 50 })}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Average Service Time <span className="text-gray-400 font-normal">(minutes)</span>
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={form.avgServiceTime}
                                onChange={(e) => setForm({ ...form, avgServiceTime: parseInt(e.target.value) || 5 })}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                        </div>

                    </div>
                </div>

                {/* Custom Fields */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-5">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Custom Fields</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Collect extra information from participants when they join.</p>
                    </div>

                    {(form.customFields ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {(form.customFields ?? []).map((field, idx) => (
                                <span
                                    key={idx}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-sm font-medium"
                                >
                                    {field.label}
                                    <button
                                        type="button"
                                        onClick={() => removeCustomField(idx)}
                                        className="text-blue-400 hover:text-blue-600 transition-colors"
                                    >
                                        <X className="h-3.5 w-3.5" />
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
                            className="flex-1 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        />
                        <button
                            type="button"
                            onClick={addCustomField}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Field
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Footer actions */}
                <div className="flex items-center justify-end gap-3 pt-2 pb-8">
                    <Link href="/dashboard/queues">
                        <Button variant="secondary" type="button">Cancel</Button>
                    </Link>
                    <Button type="submit" isLoading={isLoading} className="gap-2 min-w-[140px]">
                        {!isLoading && <Plus className="h-4 w-4" />}
                        Create Queue
                    </Button>
                </div>
            </form>
        </div>
    )
}
