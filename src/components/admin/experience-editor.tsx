"use client"

import { useState, useEffect } from "react"
import { Experience } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { UpgradeModal } from "./upgrade-modal"
import { Sparkles, Trash2, GripVertical, Briefcase } from "lucide-react"

interface ExperienceEditorProps {
  experiences: Experience[]
  onUpdate: (experiences: Experience[]) => void
  onSave: () => void
  isPro?: boolean
}

export function ExperienceEditor({ experiences, onUpdate, onSave, isPro = false }: ExperienceEditorProps) {
  const [localExperiences, setLocalExperiences] = useState<Experience[]>(experiences)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Sync with props when they change
  useEffect(() => {
    setLocalExperiences(experiences)
  }, [experiences])

  const addExperience = () => {
    // Check limits if needed, for now just allow add?
    // Prompt says: "Free: Limited projects". "Pro: Unlimited".
    // Let's enforce limit of 3 for Free?
    if (!isPro && localExperiences.length >= 3) {
      setShowUpgradeModal(true)
      return
    }

    const newExperience: Experience = {
      id: uuidv4(),
      role: "",
      org: "",
      period: "",
      bullets: [""],
      order: localExperiences.length,
    }
    const updated = [...localExperiences, newExperience]
    setLocalExperiences(updated)
    onUpdate(updated)
  }

  const removeExperience = (id: string) => {
    if (!isPro) {
      setShowUpgradeModal(true)
      return
    }
    const updated = localExperiences.filter(exp => exp.id !== id)
    setLocalExperiences(updated)
    onUpdate(updated)
  }

  // ... update functions ...

  return (
    <>
      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Experiences
            <div className="flex gap-2">
              <Button onClick={addExperience} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience {(!isPro && localExperiences.length >= 3) && <Sparkles className="w-3 h-3 ml-1 text-purple-500" />}
              </Button>
              <Button onClick={onSave} size="sm">
                Save
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {localExperiences.map((experience, index) => (
            <Card key={experience.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <Badge variant="outline">#{index + 1}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(experience.id!)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input
                      value={experience.role}
                      onChange={(e) => updateExperience(experience.id!, "role", e.target.value)}
                      placeholder="Senior Frontend Developer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Input
                      value={experience.org}
                      onChange={(e) => updateExperience(experience.id!, "org", e.target.value)}
                      placeholder="Company Name"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Period</Label>
                    <Input
                      value={experience.period}
                      onChange={(e) => updateExperience(experience.id!, "period", e.target.value)}
                      placeholder="2022 - Present"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Key Achievements</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addBullet(experience.id!)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add Bullet
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {experience.bullets?.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2">
                        <Textarea
                          value={bullet}
                          onChange={(e) => updateBullet(experience.id!, bulletIndex, e.target.value)}
                          placeholder="Describe your achievement..."
                          className="min-h-[60px]"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeBullet(experience.id!, bulletIndex)}
                          className="text-destructive hover:text-destructive mt-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {localExperiences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No experiences added yet. Click "Add Experience" to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}