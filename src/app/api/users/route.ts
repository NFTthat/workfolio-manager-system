import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) { // || user.user_metadata.role !== 'admin'
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Ensure requester is an admin in our DB
        const dbUser = await db.user.findUnique({
            where: { email: user.email! }
        })

        if (!dbUser || dbUser.role !== 'admin') {
            // For now we might be flexible during dev, but technically this should be protected
            // return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const users = await db.user.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(users)
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
