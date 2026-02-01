import { GoogleGenerativeAI } from "@google/generative-ai"

// Robust API Key check
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

// FIX: Use the older, safer 'gemini-pro' model which works on v1beta
// We use a getter to ensure we don't crash if API key is missing
function getModel() {
    if (!genAI) return null;
    return genAI.getGenerativeModel({ model: "gemini-pro" }); 
}

export async function rewriteBio(currentBio: string) {
    // FIX: Combine system and user prompt manually (Old School method)
    // This bypasses the "systemInstruction" compatibility issues
    const combinedPrompt = `
    ROLE: You are a professional technical recruiter and career coach.
    TASK: Rewrite the following developer bio to be concise (max 120 words), confident, and impact-focused.
    INPUT BIO: "${currentBio}"
    `;

    try {
        const model = getModel();
        if (!model) return `[MOCK BIO] ${currentBio.substring(0, 50)}... (AI Unavailable)`;

        const result = await model.generateContent(combinedPrompt)
        return result.response.text()
    } catch (error: any) {
        console.error("AI Error generating bio:", error.message)
        return `[MOCK BIO] ${currentBio.substring(0, 50)}... (AI Error)`;
    }
}

export async function enhanceProjectDescription(notes: string) {
    const combinedPrompt = `
    ROLE: Senior software engineer.
    TASK: Turn these notes into a polished portfolio project description. Mention problem, solution, tech stack, and impact.
    NOTES: "${notes}"
    `;

    try {
        const model = getModel();
        if (!model) return "Enhanced description unavailable (AI Config Missing)";
        
        const result = await model.generateContent(combinedPrompt)
        return result.response.text()
    } catch (error: any) {
        console.error("AI Error in enhanceProjectDescription:", error.message)
        return "Enhanced description unavailable (AI Error)";
    }
}

export async function organizeExperience(experiencesList: string) {
    const combinedPrompt = `
    ROLE: Career organizer.
    TASK: Group these experiences into logical sections (e.g. Engineering, Design).
    FORMAT: Return ONLY valid JSON. No markdown. Structure: { sections: [{ name: "...", intro: "...", experienceIds: ["..."] }] }
    EXPERIENCES: ${experiencesList}
    `;

    try {
        const model = getModel();
        if (!model) return null;

        const result = await model.generateContent(combinedPrompt)
        const text = result.response.text()
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim()
        return JSON.parse(jsonStr)
    } catch (error: any) {
        console.error("AI Error organizeExperience:", error.message)
        return null;
    }
}

export async function summarizePortfolio(portfolioJson: string) {
    const combinedPrompt = `
    ROLE: Recruiter.
    TASK: Create a short professional summary based on this portfolio data. Highlight strengths.
    DATA: ${portfolioJson}
    `;

    try {
        const model = getModel();
        if (!model) return "Summary unavailable";
        
        const result = await model.generateContent(combinedPrompt)
        return result.response.text()
    } catch (error: any) {
        console.error("AI Error in summarizePortfolio:", error.message)
        return "Summary unavailable (AI Error)";
    }
}

export async function createProfessionalSummary(existing: string) {
    const combinedPrompt = `
    ROLE: Career Consultant.
    TASK: Write a compelling 2-3 sentence professional summary for a developer portfolio hero section. Focus on tech stack and level.
    CONTEXT: "${existing}"
    `;

    try {
        const model = getModel();
        if (!model) return "Summary unavailable";

        const result = await model.generateContent(combinedPrompt)
        return result.response.text()
    } catch (error: any) {
        console.error("AI Error in createProfessionalSummary:", error.message)
        return "Professional summary unavailable (AI Error)";
    }
}