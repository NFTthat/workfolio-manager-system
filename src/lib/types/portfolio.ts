// src/lib/types/portfolio.ts
import { z } from "zod";

export interface Meta {
  name: string;
  title: string;
  email: string;
  twitter?: string;
  location?: string;
  heroImage?: string | null;
  summary?: string;
}

export interface About {
  paragraph: string;
  hobbies?: string[];
  image?: string | null;
}

export interface Contact {
  note?: string;
}

export interface ExperienceSection {
  id: string
  title: string
  order: number
}

export interface Experience {
  id: string;
  role: string;
  org: string;
  period: string;
  bullets: string[];
  order: number;
  sectionId?: string; // Link to ExperienceSection
}

export interface Project {
  id: string;
  title: string;
  description?: string | null;
  link?: string | null;
  tags: string[];
  order: number;
  image?: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category?: string | null;
  level?: number | null;
  order: number;
}

// ... (other interfaces unchanged)

// Zod schema for the portfolio content (matching the interfaces above)
export const PortfolioContentSchema = z.object({
  meta: z.object({
    name: z.string(),
    title: z.string(),
    email: z.string().email(),
    twitter: z.string().optional(),
    location: z.string().optional(),
    heroImage: z.string().nullable().optional(),
    summary: z.string().optional(),
  }),
  about: z.object({
    paragraph: z.string(),
    hobbies: z.array(z.string()).optional(),
    image: z.string().nullable().optional()
  }),
  experienceSections: z.array( // New field
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number()
    })
  ).optional(),
  experiences: z.array(
    z.object({
      id: z.string(),
      role: z.string(),
      org: z.string(),
      period: z.string(),
      bullets: z.array(z.string()),
      order: z.number(),
      sectionId: z.string().optional() // New field
    })
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().nullable().optional(),
      link: z.string().nullable().optional(),
      tags: z.array(z.string()),
      order: z.number(),
      image: z.string().nullable().optional()
    })
  ),
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      category: z.string().nullable().optional(),
      level: z.number().nullable().optional(),
      order: z.number()
    })
  ),
  contact: z.object({
    note: z.string().optional()
  }).optional()
});

export type PortfolioContent = z.infer<typeof PortfolioContentSchema>;

// Default content used by the editor for first-time admin
export const DEFAULT_PORTFOLIO_CONTENT: PortfolioContent = {
  meta: {
    name: "Your Name",
    title: "Full Stack Developer",
    email: "hello@example.com",
    twitter: "https://twitter.com/",
    location: "San Francisco, CA",
    heroImage: null
  },
  about: {
    paragraph: "I am a passionate developer...",
    hobbies: ["Coding", "Reading", "Hiking"],
    image: null
  },
  experiences: [
    {
      id: "exp-1",
      role: "Senior Developer",
      org: "Tech Corp",
      period: "2020 - Present",
      bullets: ["Led team of 5 developers", "Improved performance by 50%"],
      order: 1
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Portfolio Site",
      description: "A personal portfolio website built with Next.js",
      link: "https://github.com/",
      tags: ["Next.js", "TypeScript", "Tailwind"],
      order: 1,
      image: null
    }
  ],
  skills: [
    {
      id: "skill-1",
      name: "React",
      category: "Frontend",
      level: 5,
      order: 1
    }
  ],
  contact: {
    note: "I am available for freelance work."
  }
};

export function validatePortfolioContent(data: unknown): { success: true; data: PortfolioContent } | { success: false; error: z.ZodError } {
  const result = PortfolioContentSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
