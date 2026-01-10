import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { db } from "@/lib/db"
import { validatePortfolioContent } from "@/lib/types/portfolio"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) { // || user.user_metadata.role !== 'admin'
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate the portfolio content
    const validationResult = validatePortfolioContent(body)
    if (!validationResult.success) {
      console.error("Validation error:", JSON.stringify(validationResult.error.errors, null, 2))
      return NextResponse.json({
        error: "Invalid portfolio data",
        details: validationResult.error.errors
      }, { status: 400 })
    }

    const portfolioContent = validationResult.data

    // Get the current portfolio or create a new one for THIS user
    let portfolio = await db.portfolio.findFirst({
      where: {
        authorId: user.id
      },
      orderBy: { updatedAt: "desc" }
    })

    if (portfolio) {
      // Update existing portfolio
      portfolio = await db.portfolio.update({
        where: { id: portfolio.id },
        data: {
          content: portfolioContent,
          version: portfolio.version + 1,
          updatedAt: new Date(),
          publishedAt: portfolio.isPublished ? new Date() : portfolio.publishedAt
        }
      })
    } else {
      // Need to find Prisma User ID to create portfolio
      const prismaUser = await db.user.findUnique({ where: { email: user.email! } })

      if (!prismaUser) {
        return NextResponse.json({ error: "Prisma user not found" }, { status: 404 })
      }

      // Create new portfolio
      portfolio = await db.portfolio.create({
        data: {
          title: portfolioContent.meta.name,
          description: portfolioContent.meta.title,
          content: portfolioContent,
          isPublished: true,
          version: 1,
          authorId: prismaUser.id, // Use Prisma user ID
          publishedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      portfolio: {
        id: portfolio.id,
        version: portfolio.version,
        updatedAt: portfolio.updatedAt
      }
    })
  } catch (error) {
    console.error("Error updating portfolio:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}