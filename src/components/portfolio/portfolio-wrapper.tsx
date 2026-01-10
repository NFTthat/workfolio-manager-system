"use client"

import { useState, useEffect, useCallback } from "react"
import { PortfolioContent } from "@/lib/types/portfolio"
import { DEFAULT_PORTFOLIO_CONTENT } from "@/lib/types/portfolio"
import { HeroSection } from "./hero-section"
import { AboutSection } from "./about-section"
import { ExperienceSection } from "./experience-section"
import { ProjectsSection } from "./projects-section"
import { SkillsSection } from "./skills-section"
import { ContactSection } from "./contact-section"
import { PortfolioNav } from "./portfolio-nav"


// ⛔ Removed socket.io (since no server exists)
// import { useSocket } from "@/hooks/use-socket"

interface PortfolioWrapperProps {
  initialContent?: PortfolioContent
}

export function PortfolioWrapper({ initialContent }: PortfolioWrapperProps) {
  const [content, setContent] = useState<PortfolioContent>(
    initialContent || DEFAULT_PORTFOLIO_CONTENT
  )

  const [isLoading, setIsLoading] = useState(!initialContent)

  // -------------------------------
  // FIX 1: Safe portfolio fetching
  // -------------------------------
  const refreshContent = useCallback(async () => {
    try {
      const response = await fetch("/api/portfolio")
      if (response.ok) {
        const data = await response.json()

        // FIX 2 — ensure meta always exists
        setContent({
          ...DEFAULT_PORTFOLIO_CONTENT,
          ...data,
          meta: {
            ...(data.meta || {})
          }
        })
      } else if (response.status === 404) {
        // If 404, it means we might be a new user (or just no portfolio exists)
        // We SHOULD NOT fall back to default content if we want strict privacy,
        // but for now, we might want to show an empty state or just rely on the component to handle 'initialContent' being null.
        console.log("No workfolio found");
      }
    } catch (error) {
      console.error("Failed to fetch portfolio content:", error)
      setContent(DEFAULT_PORTFOLIO_CONTENT)
    }
  }, [])

  // -------------------------------
  // Initial fetch
  // -------------------------------
  useEffect(() => {
    if (!initialContent) {
      refreshContent().finally(() => setIsLoading(false))
    }
  }, [initialContent, refreshContent])

  // ----------------------------------------
  // FIX 3: prevent hydration mismatch footer
  // ----------------------------------------
  const [clientDate, setClientDate] = useState("")
  useEffect(() => {
    setClientDate(new Date().toLocaleString())
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">

      {/* Update notification */}


      <PortfolioNav sections={navigationSections} />

      <section id="hero">
        <HeroSection meta={content.meta} />
      </section>

      <section id="about">
        <AboutSection about={content.about} />
      </section>

      <section id="experience">
        <ExperienceSection experiences={content.experiences} />
      </section>

      <section id="projects">
        <ProjectsSection projects={content.projects} />
      </section>

      <section id="skills">
        <SkillsSection skills={content.skills} />
      </section>

      <section id="contact">
        <ContactSection contact={content.contact} meta={content.meta} />
      </section>

      {/* FIX 3: No dynamic timestamp during SSR */}
      <footer className="bg-background border-t py-8 px-4 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {content.meta?.name ?? "Workfolio User"}. All rights reserved.</p>
        {clientDate && (
          <p className="text-sm mt-1">Last updated: {clientDate}</p>
        )}
      </footer>
    </div>
  )
}

const navigationSections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
]
