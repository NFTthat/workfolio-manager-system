import { PortfolioWrapper } from "@/components/portfolio/portfolio-wrapper"
import { getPortfolioContent } from "@/lib/portfolio-service"
import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
    title: "Workfolio",
    description: "My Professional Workfolio",
}

export default async function PortfolioPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/sign-in")
    }

    const content = await getPortfolioContent(user.id)

    // Note: PortfolioWrapper handles null content by showing loading or empty state. 
    // We pass whatever we get (null or content).
    // If null, PortfolioWrapper (as verified earlier) might show a spinner or "No workfolio found".
    // We updated PortfolioWrapper to log "No workfolio found" on 404, but here we generate static prop?
    // Wait, PortfolioWrapper takes `initialContent`.

    return <PortfolioWrapper initialContent={content || undefined} /> // content can be null
}
