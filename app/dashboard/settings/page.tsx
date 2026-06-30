"use client"

import * as React from "react"
import { useAuth } from "@/features/auth/context/auth-context"
import { authApi } from "@/features/auth/services/auth.api"
import { UserCircle, Shield, Bell, Palette, Upload, Loader2, CheckCircle2, LogOut, AlertTriangle } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

export default function SettingsPage() {
    const { user, isLoading, logout, updateProfile } = useAuth()
    const [activeTab, setActiveTab] = React.useState("profile")
    const [isSigningOut, setIsSigningOut] = React.useState(false)
    const [isSaving, setIsSaving] = React.useState(false)
    const [saved, setSaved] = React.useState(false)
    const [isUploading, setIsUploading] = React.useState(false)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    // Form state mock
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
        if (!formData.name.trim()) return
        setIsSaving(true)
        setSaved(false)
        try {
            await updateProfile({ name: formData.name.trim() })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (err: any) {
            alert(err.message || "Failed to update profile name")
        } finally {
            setIsSaving(false)
        }
    }

    const handleUploadClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            const { url } = await authApi.uploadImage(file)
            await updateProfile({ avatar: url })
        } catch (err: any) {
            alert(err.message || "Failed to upload image")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = "" // Reset
            }
        }
    }

    const handleRemoveAvatar = async () => {
        if (!user?.avatar) return
        if (!confirm("Are you sure you want to remove your profile picture?")) return

        setIsUploading(true)
        try {
            await updateProfile({ avatar: null })
        } catch (err: any) {
            alert(err.message || "Failed to remove profile picture")
        } finally {
            setIsUploading(false)
        }
    }

    const handleSignOut = async () => {
        setIsSigningOut(true)
        try {
            await logout()
        } finally {
            setIsSigningOut(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const initials = user?.name
        ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?"

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-display font-bold text-foreground tracking-tight">Settings</h1>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Manage your account settings and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-56 shrink-0">
                    <nav className="flex md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {[
                            { id: "profile", label: "Profile", icon: UserCircle },
                            { id: "security", label: "Security", icon: Shield },
                            { id: "notifications", label: "Notifications", icon: Bell },
                            { id: "appearance", label: "Appearance", icon: Palette },
                        ].map(tab => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors border whitespace-nowrap cursor-pointer ${
                                        isActive
                                            ? "bg-primary/10 text-primary border-primary/20"
                                            : "text-muted-foreground hover:bg-secondary border-transparent hover:text-foreground"
                                    }`}
                                >
                                    <tab.icon className={`h-4.5 w-4.5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                                    <span>{tab.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content Area */}
                <div className="flex-1 max-w-xl">
                    {activeTab === "profile" && (
                        <div className="rounded-md border border-border/80 bg-background p-6 shadow-xs">
                            <h2 className="font-display text-sm font-bold text-foreground mb-6">Profile Information</h2>
                            
                            <form onSubmit={handleSave} className="space-y-5">
                                {/* Avatar */}
                                <div className="flex items-center gap-5">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl border border-primary/25 shadow-xs relative overflow-hidden">
                                        {isUploading ? (
                                            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                            </div>
                                        ) : null}
                                        {user?.avatar ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={user.avatar} alt={user.name} className="h-full w-full rounded-full object-cover" />
                                        ) : (
                                            initials
                                        )}
                                    </div>
                                    <div className="flex gap-2.5">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/jpeg,image/png,image/gif,image/webp"
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={handleUploadClick}
                                            disabled={isUploading}
                                            className="gap-2 text-xs font-bold uppercase"
                                        >
                                            <Upload className="h-3.5 w-3.5" />
                                            Upload
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleRemoveAvatar}
                                            disabled={isUploading || !user?.avatar}
                                            className="text-xs font-bold uppercase text-destructive hover:bg-destructive/5 hover:text-destructive border border-transparent hover:border-destructive/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>

                                <hr className="border-border/60" />

                                <div className="space-y-4">
                                    <Input
                                        label="Full Name"
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                    <div className="space-y-1.5">
                                        <label className="font-display text-xs font-medium tracking-wide text-muted-foreground uppercase leading-none">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            disabled
                                            className="flex h-11 w-full rounded-md border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground cursor-not-allowed"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/60">
                                    {saved && (
                                        <span className="text-xs font-semibold text-green-500 flex items-center gap-1.5 uppercase tracking-wide">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Saved successfully
                                        </span>
                                    )}
                                    <Button type="submit" isLoading={isSaving} className="text-xs font-bold uppercase">Save Changes</Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="rounded-md border border-border/80 bg-background p-6 shadow-xs">
                            <h2 className="font-display text-sm font-bold text-foreground mb-6">Password & Security</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <Input
                                    label="Current Password"
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={e => setFormData({ ...formData, currentPassword: e.target.value })}
                                />
                                <Input
                                    label="New Password"
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                />
                                <div className="pt-4 flex items-center justify-end gap-3 border-t border-border/60">
                                    {saved && (
                                        <span className="text-xs font-semibold text-green-500 flex items-center gap-1.5 uppercase tracking-wide">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Updated
                                        </span>
                                    )}
                                    <Button type="submit" isLoading={isSaving} className="text-xs font-bold uppercase">Update Password</Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {(activeTab === "notifications" || activeTab === "appearance") && (
                        <div className="rounded-md border border-border/80 bg-background p-10 text-center shadow-xs relative overflow-hidden">
                            <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
                            <div className="relative z-10">
                                <div className="mx-auto w-10 h-10 rounded-md bg-secondary border border-border/60 flex items-center justify-center mb-4">
                                    <Shield className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <h3 className="text-base font-display font-bold text-foreground mb-1">Coming Soon</h3>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-xs mx-auto">This settings section is currently under active development.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Danger Zone ─────────────────────────────────────────── */}
            <div className="rounded-md border border-destructive/20 bg-destructive/5 p-5 shadow-xs relative overflow-hidden">
                <div className="absolute inset-0 dot-grid opacity-[0.08] pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                            <h3 className="text-sm font-display font-bold text-destructive tracking-tight">Sign Out</h3>
                        </div>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            You will be logged out of your current session on this device.
                        </p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider border border-destructive/30 bg-background text-destructive hover:bg-destructive/10 hover:border-destructive/50 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSigningOut ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                            <LogOut className="h-3.5 w-3.5" />
                        )}
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
