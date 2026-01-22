import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Check for existing portfolio (One per user logic)
    const existing = await db.portfolio.findFirst({
      where: { authorId: user.id }
    })

    let result

    if (existing) {
      result = await db.portfolio.update({
        where: { id: existing.id },
        data: {
          content: data,
          version: { increment: 1 },
          title: (data.meta?.name || "My Workfolio") + " Portfolio",
          description: data.meta?.title,
        }
      })
    } else {
      result = await db.portfolio.create({
        data: {
          authorId: user.id,
          title: (data.meta?.name || "My Workfolio") + " Portfolio",
          description: data.meta?.title || "Workfolio Description",
          content: data,
          isPublished: true,
        }
      })
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error("Error updating portfolio:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}