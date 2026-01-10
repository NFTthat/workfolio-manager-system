import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { SettingsTab } from "@/components/admin/settings-tab"

export default async function SettingsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/sign-in")
    }

    // Fetch additional user data from our User table to get plan status
    // Assuming 'id' matches supabase user id
    // Note: we might need to handle the case where user exists in Auth but not in our DB
    // For now, pass the auth user, and SettingsTab can fetch more or we fetch here if possible.
    // Ideally, valid user should be in DB.

    return (
        <div className="container max-w-4xl py-6 space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>

            <SettingsTab user={user} />
        </div>
    )
}
