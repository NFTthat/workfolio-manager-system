import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        // Fetch portfolio from Prisma (Local SQLite)
        const portfolio = await db.portfolio.findFirst({
            where: {
                authorId: user.id
            },
            include: {
                experiences: { orderBy: { order: 'asc' } },
                projects: { orderBy: { order: 'asc' } },
                skills: { orderBy: { order: 'asc' } }
            },
            orderBy: { updatedAt: "desc" }
        })

        if (!portfolio) {
            return NextResponse.json({ portfolio: null }, { status: 200 })
        }

        // Transform relational data back to JSON structure expected by frontend
        // Or if 'content' JSON is stored and authoritative, prefer that.
        // The schema has 'content' JSON field.

        if (portfolio.content) {
            return NextResponse.json({ portfolio: portfolio.content })
        }

        // Fallback: construct content from relations if JSON is missing
        // (Reusing logic from portfolio-service roughly, or just returning null if we enforce JSON usage)
        // For Admin Editor, we want the structured data.

        // Let's rely on the 'content' field as the source of truth for the Editor state
        // as the editor saves the whole blob.

        return NextResponse.json({ portfolio: null }, { status: 200 })

    } catch (error) {
        console.error("Error fetching admin portfolio data:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await request.json()

        // Check if portfolio exists
        // We need to support both column naming conventions for safety during migration transition if any
        // But since we are "migrated to Supabase only", we should stick to what the schema probably is.
        // Prisma schema said @map("portfolios") and fields authorId.
        // Usually Prisma maps camelCase fields to database columns. If no @map on field, it uses the field name.
        // So 'authorId' is likely 'authorId' in DB if using Prisma defaults on Postgres, OR 'authorId' is the client name.
        // Typically Postgres uses snake_case.
        // I will assume Prisma default behavior which preserves casing if not mapped? No, strictly typed.
        // To be safe, I'll try to find the existing portfolio first using the most likely column name 'authorId' (quoted in SQL) or 'author_id'.
        // Actually, since I can't check DB, I will assume 'authorId' based on Prisma schema, but 'author_id' is standard.
        // The previous GET tried both. I'll do the same logic here or just upsert?

        // Let's simplified assumption: The table is 'portfolios'.
        // We will try to SELECT first to get the ID.

        let { data: existing, error: fetchError } = await supabase
            .from('portfolios')
            .select('id, version')
            .eq('authorId', user.id) // Try CamelCase first as per Prisma
            .limit(1)
            .maybeSingle()

        if (fetchError && fetchError.code === '42703') {
            const res = await supabase
                .from('portfolios')
                .select('id, version')
                .eq('author_id', user.id)
                .limit(1)
                .maybeSingle()
            existing = res.data;
        }

        const now = new Date().toISOString();

        if (existing) {
            // Update
            const { data: updated, error: updateError } = await supabase
                .from('portfolios')
                .update({
                    content: data,
                    version: (existing.version || 0) + 1,
                    updatedAt: now, // or updated_at
                })
                .eq('id', existing.id)
                .select()
                .single()

            if (updateError) {
                // Retry with snake_case
                if (updateError.code === '42703') {
                    await supabase.from('portfolios').update({
                        content: data,
                        version: (existing.version || 0) + 1,
                        updated_at: now
                    }).eq('id', existing.id)
                } else {
                    throw updateError
                }
            }

            return NextResponse.json(updated || { success: true })
        } else {
            // Create
            const newPortfolio = {
                title: (data.meta?.name || "My Portfolio") + " Portfolio",
                description: data.meta?.title || "Portfolio Description",
                content: data,
                isPublished: true,
                authorId: user.id, // Try camelCase
                version: 1,
                updatedAt: now,
                createdAt: now
            }

            // We might need to adjust keys for snake_case if insert fails
            // But let's try strict camelCase first as per Prisma schema which usually implies column names match if no @map

            const { data: created, error: createError } = await supabase
                .from('portfolios')
                .insert(newPortfolio)
                .select()
                .single()

            if (createError) {
                if (createError.code === '42703') {
                    // fallback to snake_case
                    const snakePortfolio = {
                        title: newPortfolio.title,
                        description: newPortfolio.description,
                        content: newPortfolio.content,
                        is_published: true,
                        author_id: user.id,
                        version: 1,
                        updated_at: now,
                        created_at: now
                    }
                    const { data: createdSnake, error: snakeError } = await supabase
                        .from('portfolios')
                        .insert(snakePortfolio)
                        .select()
                        .single()

                    if (snakeError) throw snakeError;
                    return NextResponse.json(createdSnake)
                }
                throw createError
            }

            return NextResponse.json(created)
        }

    } catch (error) {
        console.error("Error updating portfolio:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
