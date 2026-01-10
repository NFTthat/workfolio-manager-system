import { NextResponse } from "next/server"
import { rewriteBio, enhanceProjectDescription, organizeExperience, summarizePortfolio, createProfessionalSummary } from "@/lib/gemini"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const body = await request.json()
        const { action, data } = body

        let result

        switch (action) {
            case "rewrite-bio":
                result = await rewriteBio(data.bio)
                break
            case "enhance-project":
                result = await enhanceProjectDescription(data.notes)
                break
            case "organize-experience":
                // Check for Pro plan? 
                // For now, let UI handle gating or assume server checks user plan db.
                result = await organizeExperience(data.experiences)
                break
            case "summarize-portfolio":
                result = await summarizePortfolio(data.portfolio)
                break
            case "generate-summary":
                result = await createProfessionalSummary(data.existing)
                break
            default:
                return new NextResponse("Invalid action", { status: 400 })
        }

        if (!result) {
            return new NextResponse("AI Generation Failed", { status: 500 })
        }

        return NextResponse.json({ result })
    } catch (error) {
        console.error("AI API Error:", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
