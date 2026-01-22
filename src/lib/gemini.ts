import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || ""

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null
const model = genAI ? genAI.getGenerativeModel({ model: "gemini-1.5-flash" }) : null

export async function rewriteBio(currentBio: string) {
    const systemPrompt = `You are a professional technical recruiter and career coach.
You write concise, confident developer bios that highlight impact, clarity, and growth.`

    const userPrompt = `Rewrite the following developer bio to be:
- Clear and confident
- Recruiter-friendly
- Focused on impact, not buzzwords
- Written in first person
- Maximum 120 words

Bio:
${currentBio}`

    try {
        if (!model) {
            console.warn("AI Model not available, returning mock bio.");
            return `[MOCK BIO] ${currentBio.substring(0, 50)}... (AI Unavailable)`;
        }
        const result = await model.generateContent([systemPrompt, userPrompt])
        return result.response.text()
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("AI Error generating bio:", error)
        // If 400 (Bad Request) usually API key issue or quota
        if (error.response?.status === 400 || error.message?.includes("400")) {
            console.warn("AI Bad Request (400) - Invalid Key? Returning mock.")
            return `[MOCK BIO] ${currentBio.substring(0, 50)}... (AI Request Failed)`;
        }
        // Fallback for other errors
        return `[MOCK BIO] ${currentBio.substring(0, 50)}... (AI Error)`;
    }
}

export async function enhanceProjectDescription(notes: string) {
    const systemPrompt = `You are a senior software engineer helping developers present projects clearly and professionally.`

    const userPrompt = `Turn the notes below into a polished portfolio project description.

Requirements:
- Explain the problem
- Explain the solution
- Mention the tech stack
- Describe the outcome or impact
- Keep it concise and skimmable

Notes:
${notes}`

    try {
        if (!model) return "Enhanced description unavailable (AI Config Missing)";
        const result = await model.generateContent([systemPrompt, userPrompt])
        return result.response.text()
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("AI Error in enhanceProjectDescription:", error)
        return "Enhanced description unavailable (AI Error)";
    }
}

export async function organizeExperience(experiencesList: string) {
    // experiencesList is a string representation of the experiences
    const systemPrompt = `You help developers organize their professional experience into clear, meaningful categories.`

    const userPrompt = `Group the experiences below into logical sections (e.g. Design, Engineering, Marketing).

For each section:
- Give it a clear name
- Write a 1–2 sentence intro
- Return the result as a valid JSON object with detailed structure: { sections: [{ name: "...", intro: "...", experienceIds: ["..."] }] }

Experiences (with IDs):
${experiencesList}`

    // We need structured output here. 
    // For simplicity, we'll ask for JSON in the prompt and parse it, 
    // or use the responseSchema if we were using 1.5 Pro.
    // Let's force JSON mode in the prompt for now.
    const jsonPrompt = `${userPrompt}

IMPORTANT: valid JSON only, no markdown formatting.`

    try {
        if (!model) return null;
        const result = await model.generateContent([systemPrompt, jsonPrompt])
        const text = result.response.text()
        // naive cleanup
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim()
        return JSON.parse(jsonStr)
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("AI Error:", error)
        return null
    }
}

export async function summarizePortfolio(portfolioJson: string) {
    const systemPrompt = `You summarize developer profiles for recruiters.`

    const userPrompt = `Create a short professional summary based on this portfolio.
Highlight strengths, focus areas, and unique value.

Portfolio data:
${portfolioJson}`

    try {
        if (!model) return "Enhanced description unavailable (AI Config Missing)";
        const result = await model.generateContent([systemPrompt, userPrompt])
        return result.response.text()
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("AI Error in summarizePortfolio:", error)
        return "Enhanced description unavailable (AI Error)";
    }
}

export async function createProfessionalSummary(existing: string) {
    const systemPrompt = `You are a career consultant specialized in writing impactful professional summaries for developer portfolios.
Structure the summary to immediately grab attention in a hero section.`

    const userPrompt = `Write a compelling 2-3 sentence professional summary based on the following (or improve the existing one if provided).
Focus on:
- Core tech stack expertise
- Years of experience or level (Senior, Lead, etc.)
- Unique value proposition

Existing input/context:
${existing}`

    try {
        if (!model) return "Enhanced description unavailable (AI Config Missing)";
        const result = await model.generateContent([systemPrompt, userPrompt])
        return result.response.text()
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error("AI Error in createProfessionalSummary:", error)
        return "Enhanced description unavailable (AI Error)";
    }
}
