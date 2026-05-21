"use client"

import * as React from "react"
import { useAuth } from "@/features/auth/context/auth-context"
import { UserCircle, Shield, Bell, Palette, Upload, Loader2, CheckCircle2 } from "lucide-react"
import { Button } from "@/shared/ui/button"

export default function SettingsPage() {
    const { user, isLoading } = useAuth()
    const [activeTab, setActiveTab] = React.useState("profile")
    const [isSaving, setIsSaving] = React.useState(false)
    const [saved, setSaved] = React.useState(false)

    // Form state mock (in real app, this would be updated via API)
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        currentPassword: "",
        newPassword: "",
    })

    React.useEffect(() => {
        if (user) {
            setFormData(f => ({ ...f, name: user.name, email: user.email }))
        }
    }, [user])

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setSaved(false)
        // Mock save delay
        await new Promise(r => setTimeout(r, 1000))
        setIsSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
    }

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        )
    }

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?"

    return (
        <div className="max-w-5xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 mt-0.5 text-sm">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 shrink-0">
                    <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
                        {[
                            { id: "profile", label: "Profile", icon: UserCircle },
                            { id: "security", label: "Security", icon: Shield },
                            { id: "notifications", label: "Notifications", icon: Bell },
                            { id: "appearance", label: "Appearance", icon: Palette },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? "text-blue-600" : "text-gray-400"}`} />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 max-w-2xl">
                    {activeTab === "profile" && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Information</h2>
                            
                            <form onSubmit={handleSave} className="space-y-6">
                                {/* Avatar */}
                                <div className="flex items-center gap-5">
                                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl border-4 border-white shadow-sm">
                                        {user?.avatar ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    <div className="flex gap-3">
                                        <Button type="button" variant="secondary" size="sm" className="gap-2">
                                            <Upload className="h-4 w-4" />
                                            Upload new
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                            Remove
                                        </Button>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                <div className="grid gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled // Usually cannot change email easily
                                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                                    {saved && (
                                        <span className="text-sm text-green-600 flex items-center gap-1">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Saved successfully
                                        </span>
                                    )}
                                    <Button type="submit" isLoading={isSaving}>Save Changes</Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6">Password & Security</h2>
                            <form onSubmit={handleSave} className="space-y-6">
                                <div className="grid gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
                                        <input
                                            type="password"
                                            value={formData.currentPassword}
                                            onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                                        <input
                                            type="password"
                                            value={formData.newPassword}
                                            onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                                    {saved && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Updated</span>}
                                    <Button type="submit" isLoading={isSaving}>Update Password</Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {(activeTab === "notifications" || activeTab === "appearance") && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 md:p-8 text-center">
                            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Coming Soon</h3>
                            <p className="text-gray-500 mt-1 text-sm">This settings section is under development.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
