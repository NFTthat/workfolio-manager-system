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

        // Get the latest portfolio (including drafts) for THIS user
        const portfolio = await db.portfolio.findFirst({
            where: {
                authorId: user.id
            },
            orderBy: { updatedAt: "desc" },
            include: {
                experiences: {
                    orderBy: { order: "asc" }
                },
                projects: {
                    orderBy: { order: "asc" }
                },
                skills: {
                    orderBy: { order: "asc" }
                }
            }
        })

        if (portfolio && portfolio.content) {
            return NextResponse.json({ portfolio: portfolio.content })
        }

        // Return null portfolio with 200 OK instead of 404
        return NextResponse.json({ portfolio: null }, { status: 200 })
    } catch (error) {
        console.error("Error fetching admin portfolio data:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user: supabaseUser } } = await supabase.auth.getUser()

        if (!supabaseUser) { // || supabaseUser.user_metadata.role !== 'admin'
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await request.json()

        // Sync/Get Prisma User
        let user = await db.user.findUnique({
            where: { email: supabaseUser.email! }
        })

        if (!user) {
            // Create user if not exists
            user = await db.user.create({
                data: {
                    id: supabaseUser.id, // Try to use Supabase ID
                    email: supabaseUser.email!,
                    name: supabaseUser.user_metadata.full_name || supabaseUser.email!.split('@')[0],
                    role: 'admin', // Default to admin for now
                }
            })
        }

        // Update or create portfolio
        const existingPortfolio = await db.portfolio.findFirst({
            where: {
                authorId: user.id
            },
            orderBy: { updatedAt: "desc" }
        })

        if (existingPortfolio) {
            // Update existing portfolio
            const updatedPortfolio = await db.portfolio.update({
                where: { id: existingPortfolio.id },
                data: {
                    content: data,
                    version: existingPortfolio.version + 1,
                    updatedAt: new Date(),
                }
            })
            return NextResponse.json(updatedPortfolio)
        } else {
            // Create new portfolio
            const newPortfolio = await db.portfolio.create({
                data: {
                    title: data.meta.name + " Portfolio",
                    description: data.meta.title,
                    content: data,
                    isPublished: true,
                    authorId: user.id, // Use Prisma user ID
                    version: 1,
                }
            })
            return NextResponse.json(newPortfolio)
        }
    } catch (error) {
        console.error("Error updating portfolio:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
