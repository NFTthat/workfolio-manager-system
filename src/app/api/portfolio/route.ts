import { NextResponse } from "next/server"
import { getPortfolioContent } from "@/lib/portfolio-service"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const content = await getPortfolioContent(user.id)

  if (!content) {
    return new NextResponse("Not Found", { status: 404 })
  }

  return NextResponse.json(content)
}