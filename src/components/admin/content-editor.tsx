"use client"

import { useState } from "react"
import { PortfolioContent, DEFAULT_PORTFOLIO_CONTENT } from "@/lib/types/portfolio"
import { MetaEditor } from "./meta-editor"
import { AboutEditor } from "./about-editor"
import { ExperienceEditor } from "./experience-editor"
import { ProjectEditor } from "./project-editor"
import { SkillsEditor } from "./skills-editor"
import { ContactEditor } from "./contact-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  FileText,
  Briefcase,
  FolderOpen,
  Wrench,
  Mail,
  Eye
} from "lucide-react"
import { toast } from "sonner"
import { useSocket } from "@/hooks/use-socket"

interface ContentEditorProps {
  initialContent?: PortfolioContent
  defaultTab?: string
  isPro?: boolean
}

export function ContentEditor({ initialContent = DEFAULT_PORTFOLIO_CONTENT, defaultTab, isPro = false }: ContentEditorProps) {
  const [content, setContent] = useState<PortfolioContent>(initialContent)
  const [activeTab, setActiveTab] = useState(defaultTab || "meta")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { emitPortfolioUpdate } = useSocket({ enablePortfolioUpdates: true })

  const updateContent = async (newContent: PortfolioContent, section: string) => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/portfolio/admin/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContent),
      })

      if (response.ok) {
        setContent(newContent)
        setLastSaved(new Date())

        // Emit socket event for real-time updates
        emitPortfolioUpdate({
          type: "update",
          section,
          content: newContent
        })

        toast.success("Content saved successfully!")
      } else {
        throw new Error("Failed to save content")
      }
    } catch (error) {
      console.error("Error saving content:", error)
      toast.error("Failed to save content. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveMeta = async (meta: PortfolioContent["meta"]) => {
    await updateContent({ ...content, meta }, "meta")
  }

  const handleSaveAbout = async (about: PortfolioContent["about"]) => {
    await updateContent({ ...content, about }, "about")
  }

  const handleSaveExperiences = async (experiences: PortfolioContent["experiences"]) => {
    // Standard save
    await updateContent({ ...content, experiences }, "experiences")
  }

  const handleUpdateSections = (sections: PortfolioContent["experienceSections"]) => {
    // Local update
    setContent(prev => ({ ...prev, experienceSections: sections }))
  }

  const handleSaveExperiencesAndSections = async () => {
    // Save full content to capture both experiences and sections updates
    await updateContent({ ...content }, "experiences")
  }

  const handleSaveProjects = async (projects: PortfolioContent["projects"]) => {
    await updateContent({ ...content, projects }, "projects")
  }

  const handleSaveSkills = async (skills: PortfolioContent["skills"]) => {
    await updateContent({ ...content, skills }, "skills")
  }

  const handleSaveContact = async (contact: PortfolioContent["contact"]) => {
    await updateContent({ ...content, contact }, "contact")
  }

  const handlePreview = () => {
    window.open("/portfolio", "_blank")
  }

  const handleCancel = () => {
    setContent(initialContent)
    toast.info("Changes reverted to last saved version")
  }

  const tabs = [
    { id: "meta", label: "Meta", icon: User, component: MetaEditor, props: { meta: content.meta, onSave: handleSaveMeta, isSaving, isPro } },
    { id: "about", label: "About", icon: FileText, component: AboutEditor, props: { about: content.about, onSave: handleSaveAbout, isSaving, isPro } },
    {
      id: "experiences", label: "Experience", icon: Briefcase, component: ExperienceEditor, props: {
        experiences: content.experiences,
        sections: content.experienceSections,
        onUpdateSections: handleUpdateSections,
        onSave: handleSaveExperiencesAndSections,
        isSaving,
        isPro
      }
    },
    { id: "projects", label: "Projects", icon: FolderOpen, component: ProjectEditor, props: { projects: content.projects, onSave: handleSaveProjects, isSaving, isPro } },
    { id: "skills", label: "Skills", icon: Wrench, component: SkillsEditor, props: { skills: content.skills, onSave: handleSaveSkills, isSaving, isPro } },
    { id: "contact", label: "Contact", icon: Mail, component: ContactEditor, props: { contact: content.contact, onSave: handleSaveContact, isSaving, isPro } },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Content Editor</CardTitle>
              <p className="text-muted-foreground mt-1">
                Edit your portfolio content in real-time
              </p>
            </div>
            <div className="flex items-center gap-4">
              {lastSaved && (
                <div className="text-sm text-muted-foreground">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </div>
              )}
              <Button variant="outline" onClick={handlePreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => {
          const Component = tab.component
          // @ts-ignore - dynamic component props
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Component {...tab.props} onCancel={handleCancel} />
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Content Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{content.experiences.length}</div>
              <div className="text-sm text-muted-foreground">Experiences</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{content.projects.length}</div>
              <div className="text-sm text-muted-foreground">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{content.skills.length}</div>
              <div className="text-sm text-muted-foreground">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{content.about.hobbies ? content.about.hobbies.length : 0}</div>
              <div className="text-sm text-muted-foreground">Hobbies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {content.skills.filter(s => s.level && s.level >= 4).length}
              </div>
              <div className="text-sm text-muted-foreground">Expert Skills</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Real-time Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connected to real-time updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Changes will be reflected immediately on the live site</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Visitors will see update notifications when content changes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}