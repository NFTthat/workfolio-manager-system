"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface SettingsTabProps {
    user: any
}

export function SettingsTab({ user }: SettingsTabProps) {
    const [profile, setProfile] = useState({
        fullName: user.user_metadata.full_name || "",
        avatarUrl: user.user_metadata.avatar_url || "",
        // We would need to persist bio/socials in user_metadata or separate table
        bio: user.user_metadata.bio || "",
    })
    const [isSaving, setIsSaving] = useState(false)

    const handleSave = async () => {
        setIsSaving(true)
        try {
            // Logic to update user metadata via Supabase API (client side) or our API
            // Since we need to update 'user_metadata', we might need to use supabase.auth.updateUser()
            // But we generally want server side validation. 
            // For now we'll assume we hit an API endpoint that handles this.

            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile)
            })

            if (response.ok) {
                toast.success("Profile updated successfully")
            } else {
                throw new Error("Failed to update profile")
            }
        } catch (error) {
            toast.error("Error saving settings")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Profile Settings</CardTitle>
                            <CardDescription>
                                Manage your public profile information
                            </CardDescription>
                        </div>
                        <Badge variant="outline">
                            {user.email}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                            id="fullName"
                            value={profile.fullName}
                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                            placeholder="Your Name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="Tell us about yourself"
                            className="resize-none min-h-[100px]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar URL</Label>
                        <Input
                            id="avatar"
                            value={profile.avatarUrl}
                            onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Plan & Billing</CardTitle>
                    <CardDescription>
                        Manage your subscription and billing details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                            <p className="font-medium">Current Plan</p>
                            <p className="text-sm text-muted-foreground">You are currently on the <span className="font-semibold text-primary">{user?.plan === 'pro' ? 'Pro Plan 💎' : 'Free Plan'}</span></p>
                        </div>
                        {user?.plan !== 'pro' && (
                            <Button variant="default" className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white border-0">
                                Upgrade to Pro 💎
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>


            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                        Irreversible actions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently remove your account and all data.</p>
                        </div>
                        <DeleteAccountButton isPro={true} />
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

function DeleteAccountButton({ isPro }: { isPro: boolean }) {
    // In a real app check `user.plan === 'pro'`
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Are you sure? This cannot be undone.")) return

        setIsLoading(true)
        try {
            const res = await fetch("/api/user/profile", { method: "DELETE" })
            if (!res.ok) {
                if (res.status === 403) toast.error("Upgrade to Pro to delete account")
                else toast.error("Failed to delete account")
                return
            }
            toast.success("Account deleted")
            window.location.href = "/"
        } catch (e) {
            toast.error("Error deleting account")
        } finally {
            setIsLoading(false)
        }
    }

    if (!isPro) {
        return (
            <Button variant="destructive" disabled title="Upgrade to Pro to delete">
                Delete Account (Pro Only)
            </Button>
        )
    }

    return (
        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Account
        </Button>
    )
}
