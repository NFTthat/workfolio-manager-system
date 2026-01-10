"use client"

import { useState, useEffect } from "react"
import { Project } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { UpgradeModal } from "./upgrade-modal"
import { Sparkles, Trash2, GripVertical, Briefcase, Plus, X } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface ProjectEditorProps {
  projects: Project[]
  onUpdate: (projects: Project[]) => void
  onSave: () => void
  isPro?: boolean
}

export function ProjectEditor({ projects, onUpdate, onSave, isPro = false }: ProjectEditorProps) {
  const [localProjects, setLocalProjects] = useState<Project[]>(projects)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Sync with props when they change
  useEffect(() => {
    setLocalProjects(projects)
  }, [projects])

  const addProject = () => {
    if (!isPro && localProjects.length >= 3) {
      setShowUpgradeModal(true)
      return
    }

    const newProject: Project = {
      id: uuidv4(),
      title: "",
      description: "",
      link: "",
      tags: [],
      order: localProjects.length,
    }
    const updated = [...localProjects, newProject]
    setLocalProjects(updated)
    onUpdate(updated)
  }

  const removeProject = (id: string) => {
    if (!isPro) {
      setShowUpgradeModal(true)
      return
    }
    const updated = localProjects.filter(project => project.id !== id)
    setLocalProjects(updated)
    onUpdate(updated)
  }

  const updateProject = (id: string, field: keyof Project, value: Project[keyof Project]) => {
    const updated = localProjects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    )
    setLocalProjects(updated)
    onUpdate(updated)
  }

  const addTag = (projectId: string, tag: string) => {
    if (!tag.trim()) return
    const updated = localProjects.map(project => {
      if (project.id === projectId) {
        const tags = [...(project.tags || []), tag.trim()]
        return { ...project, tags }
      }
      return project
    })
    setLocalProjects(updated)
    onUpdate(updated)
  }

  const removeTag = (projectId: string, tagIndex: number) => {
    const updated = localProjects.map(project => {
      if (project.id === projectId) {
        const tags = project.tags?.filter((_, i) => i !== tagIndex) || []
        return { ...project, tags }
      }
      return project
    })
    setLocalProjects(updated)
    onUpdate(updated)
  }

  return (
    <>
      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Projects
            <div className="flex gap-2">
              <Button onClick={addProject} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Project {(!isPro && localProjects.length >= 3) && <Sparkles className="w-3 h-3 ml-1 text-purple-500" />}
              </Button>
              <Button onClick={onSave} size="sm">
                Save
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {localProjects.map((project, index) => (
            <Card key={project.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(project.id!)}
                    className="text-muted-foreground hover:text-destructive group"
                  >
                    {!isPro ? (
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1 text-purple-500 fill-purple-200" />
                        <span className="text-xs text-purple-500">Pro</span>
                      </div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={project.title}
                    onChange={(e) => updateProject(project.id!, "title", e.target.value)}
                    placeholder="Project Name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <ProjectEnhancer
                    currentDescription={project.description || ""}
                    onAccept={(newDesc) => updateProject(project.id!, "description", newDesc)}
                  />
                  <Textarea
                    value={project.description || ""}
                    onChange={(e) => updateProject(project.id!, "description", e.target.value)}
                    placeholder="Brief description of the project (or notes for AI)"
                    className="min-h-[80px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Link</Label>
                  <Input
                    value={project.link || ""}
                    onChange={(e) => updateProject(project.id!, "link", e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.tags?.map((tag, tagIndex) => (
                      <Badge key={tagIndex} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X
                          className="w-3 h-3 cursor-pointer hover:text-destructive"
                          onClick={() => removeTag(project.id!, tagIndex)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addTag(project.id!, (e.target as HTMLInputElement).value)
                            ; (e.target as HTMLInputElement).value = ""
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addTag(project.id!, input.value)
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {localProjects.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No projects added yet. Click "Add Project" to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}

function ProjectEnhancer({ currentDescription, onAccept }: { currentDescription: string, onAccept: (desc: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDesc, setGeneratedDesc] = useState("")

  const handleGenerate = async () => {
    if (!currentDescription) return
    setIsGenerating(true)
    setIsOpen(true)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enhance-project", data: { notes: currentDescription } })
      })
      const data = await res.json()
      if (data.result) setGeneratedDesc(data.result)
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={handleGenerate} className="w-full mb-1 gap-2 text-primary border-primary/20 hover:bg-primary/5">
        <Sparkles className="w-4 h-4" /> Enhance with AI
      </Button>
    )
  }

  return (
    <div className="space-y-4 mb-4 border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> AI Enhancement
        </h4>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></Button>
      </div>

      {isGenerating ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Generating...
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Original Notes</Label>
            <div className="text-sm p-3 border rounded bg-background opacity-70 whitespace-pre-wrap">{currentDescription}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Polished Description</Label>
            <div className="text-sm p-3 border rounded bg-background border-primary/20 whitespace-pre-wrap">{generatedDesc}</div>
          </div>
        </div>
      )}

      {!isGenerating && generatedDesc && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Discard</Button>
          <Button variant="secondary" size="sm" onClick={() => { /* copy to manual edit? */ }}>Edit Manually</Button>
          <Button size="sm" onClick={() => { onAccept(generatedDesc); setIsOpen(false) }}>Use This</Button>
        </div>
      )}
    </div>
  )
}
import { Loader2 } from "lucide-react"