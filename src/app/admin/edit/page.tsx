"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PortfolioContent, DEFAULT_PORTFOLIO_CONTENT } from "@/lib/types/portfolio" // Updated import to combine
import { MetaEditor } from "@/components/admin/meta-editor"
import { DndExperienceEditor } from "@/components/admin/dnd-experience-editor"
import { DndProjectEditor } from "@/components/admin/dnd-project-editor"
import { SkillEditor } from "@/components/admin/skill-editor"
import { AboutContactEditor } from "@/components/admin/about-contact-editor"
import { Button } from "@/components/ui/button"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"

export default function AdminEditPage() {
  const router = useRouter()
  const [portfolioData, setPortfolioData] = useState<PortfolioContent>(DEFAULT_PORTFOLIO_CONTENT)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkAuthAndFetch()
  }, [])

  const checkAuthAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/sign-in")
      return
    }
    // Check role from user_metadata if needed
    fetchPortfolioData()
  }

  const fetchPortfolioData = async () => {
    try {
      console.log("Fetching portfolio data...")
      const response = await fetch("/api/portfolio/admin")
      console.log("Response status:", response.status)
      if (response.ok) {
        const data = await response.json()
        setPortfolioData(data)
      } else {
        console.error("Failed to fetch portfolio data:", response.statusText)
        toast.error("Failed to load portfolio data")
      }
    } catch (error) {
      console.error("Failed to fetch portfolio data:", error)
      toast.error("Failed to load portfolio data")
    } finally {
      setIsLoading(false)
    }
  }

  const savePortfolioData = async () => {
    setIsSaving(true)
    try {
      console.log("Saving portfolio data:", portfolioData)
      const response = await fetch("/api/portfolio/admin/update", { // Updated to point to correct update route if needed. 
        // Wait, current file POSTs to /api/portfolio/admin with PUT?
        // Step 262 shows `src/app/api/portfolio/admin/update/route.ts` handles POST.
        // `src/app/admin/edit/page.tsx` (Step 263) was fetching `/api/portfolio/admin` with PUT.
        // `src/app/api/portfolio/admin/route.ts` (Step 243) handled PUT.
        // It seems there are TWO ways to update?
        // `api/portfolio/admin/route.ts` has GET and PUT.
        // `api/portfolio/admin/update/route.ts` has POST.
        // I should probably stick to one or fix the edit page to match.
        // The edit page used PUT to `/api/portfolio/admin`.
        // I updated `api/portfolio/admin/route.ts` in step 247 with GET and PUT.
        // So I can keep using that. I don't need `api/portfolio/admin/update/route.ts`?
        // Or maybe I should check if `update/route.ts` is legacy?
        // "src/app/api/portfolio/admin/update/route.ts" exists.
        // I should consolidate.
        // If I decide to keep `api/portfolio/admin/route.ts` handling PUT, then `update/route.ts` is redundant.
        // But `edit/page.tsx` code I just read (Step 263) used `/api/portfolio/admin` with PUT.
        // So I will stick to that.
        // And I can delete `src/app/api/portfolio/admin/update/route.ts` to be cleaner?
        // Or keep it.
        // I'll keep the fetch pointing to `/api/portfolio/admin` (PUT).

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(portfolioData),
      })

      if (response.ok) {
        toast.success("Portfolio saved successfully!")
      } else {
        const errorText = await response.text()
        console.error("Save failed:", errorText)
        toast.error("Failed to save portfolio")
      }
    } catch (error) {
      console.error("Failed to save portfolio:", error)
      toast.error("Failed to save portfolio")
    } finally {
      setIsSaving(false)
    }
  }

  const updateMeta = (meta: PortfolioContent["meta"]) => {
    setPortfolioData(prev => ({ ...prev, meta }))
  }

  const updateAbout = (about: PortfolioContent["about"]) => {
    setPortfolioData(prev => ({ ...prev, about }))
  }

  const updateContact = (contact: PortfolioContent["contact"]) => {
    setPortfolioData(prev => ({ ...prev, contact }))
  }

  const updateExperiences = (experiences: PortfolioContent["experiences"]) => {
    setPortfolioData(prev => ({ ...prev, experiences }))
  }

  const updateProjects = (projects: PortfolioContent["projects"]) => {
    setPortfolioData(prev => ({ ...prev, projects }))
  }

  const updateSkills = (skills: PortfolioContent["skills"]) => {
    setPortfolioData(prev => ({ ...prev, skills }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/admin")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold">Edit Portfolio</h1>
              <Badge variant="secondary">Admin</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.open("/portfolio", "_blank")}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button onClick={savePortfolioData} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="meta" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="meta">Meta</TabsTrigger>
            <TabsTrigger value="about">About & Contact</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="meta" className="space-y-6">
            <MetaEditor
              meta={portfolioData.meta}
              onUpdate={updateMeta}
              onSave={savePortfolioData}
            />
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <AboutContactEditor
              about={portfolioData.about}
              contact={portfolioData.contact || {}}
              onUpdateAbout={updateAbout}
              onUpdateContact={updateContact}
              onSave={savePortfolioData}
            />
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <DndExperienceEditor
              experiences={portfolioData.experiences}
              onUpdate={updateExperiences}
              onSave={savePortfolioData}
            />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <DndProjectEditor
              projects={portfolioData.projects}
              onUpdate={updateProjects}
              onSave={savePortfolioData}
            />
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <SkillEditor
              skills={portfolioData.skills}
              onUpdate={updateSkills}
              onSave={savePortfolioData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}