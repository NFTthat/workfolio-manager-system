import { db } from "@/lib/db"
import { PortfolioContent } from "@/lib/types/portfolio"

export async function getPortfolioContent(userId?: string): Promise<PortfolioContent | null> {
    try {
        if (!userId) {
            // If no user ID provided (and we are strict about not showing random data), 
            // we should return null.
            return null;
        }

        // Try to get the published portfolio from the database for THIS user
        const portfolio = await db.portfolio.findFirst({
            where: {
                authorId: userId
            },
            include: {
                experiences: {
                    orderBy: { order: 'asc' }
                },
                projects: {
                    orderBy: { order: 'asc' }
                },
                skills: {
                    orderBy: { order: 'asc' }
                }
            }
        })

        if (portfolio && portfolio.content) {
            // If we have JSON content stored, return it (assuming it matches the schema)
            return portfolio.content as unknown as PortfolioContent
        } else if (portfolio) {
            // If we have relational data, convert it to the expected format
            const content: PortfolioContent = {
                meta: {
                    name: portfolio.title,
                    title: portfolio.description || "",
                    email: "contact@example.com", // Default, should be stored in meta
                    twitter: undefined,
                    location: undefined,
                    heroImage: null
                },
                about: {
                    paragraph: portfolio.description || "",
                    hobbies: [],
                    image: null
                },
                experiences: portfolio.experiences.map(exp => ({
                    id: exp.id,
                    role: exp.role,
                    org: exp.organization,
                    period: exp.period,
                    bullets: (exp.bullets as string[]) || [],
                    order: exp.order
                })),
                projects: portfolio.projects.map(project => ({
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    link: project.link,
                    tags: (project.tags as string[]) || [],
                    order: project.order,
                    image: null
                })),
                skills: portfolio.skills.map(skill => ({
                    id: skill.id,
                    name: skill.name,
                    category: skill.category,
                    level: skill.level,
                    order: skill.order
                })),
                contact: {
                    note: "Let's connect and discuss opportunities!"
                }
            }
            return content
        }

        // If no portfolio found for this user, return null (empty state)
        return null
    } catch (error) {
        console.error("Error fetching portfolio:", error)
        return null
    }
}
