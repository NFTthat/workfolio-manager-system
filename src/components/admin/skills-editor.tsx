"use client"

import { useState } from "react"
import { Skill } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Save, X, Plus, Trash2, GripVertical, Star } from "lucide-react"

interface SkillsEditorProps {
  skills: Skill[]
  onSave: (skills: Skill[]) => void
  onCancel: () => void
}

const CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "Cloud",
  "DevOps",
  "Mobile",
  "Design",
  "Other"
]

export function SkillsEditor({ skills, onSave, onCancel }: SkillsEditorProps) {
  const [formData, setFormData] = useState<Skill[]>(skills)
  const [isSaving, setIsSaving] = useState(false)

  const addSkill = () => {
    const newSkill: Skill = {
      name: "",
      category: "Other",
      level: 3,
      order: formData.length
    }
    setFormData(prev => [...prev, newSkill])
  }

  const removeSkill = (index: number) => {
    setFormData(prev => prev.filter((_, i) => i !== index))
  }

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    setFormData(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Update order based on array position
      const orderedData = formData.map((skill, index) => ({
        ...skill,
        order: index
      }))
      await onSave(orderedData)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Skills
          <Button onClick={addSkill} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.map((skill, skillIndex) => (
          <Card key={skillIndex} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Skill {skillIndex + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(skillIndex)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Skill Name</Label>
                  <Input
                    value={skill.name}
                    onChange={(e) => updateSkill(skillIndex, "name", e.target.value)}
                    placeholder="e.g. React"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={skill.category || "Other"}
                    onValueChange={(value) => updateSkill(skillIndex, "category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Proficiency Level</Label>
                  <Select
                    value={skill.level?.toString() || "3"}
                    onValueChange={(value) => updateSkill(skillIndex, "level", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Beginner</SelectItem>
                      <SelectItem value="2">2 - Basic</SelectItem>
                      <SelectItem value="3">3 - Intermediate</SelectItem>
                      <SelectItem value="4">4 - Advanced</SelectItem>
                      <SelectItem value="5">5 - Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {skill.level && (
                <div className="space-y-2">
                  <Label>Proficiency Display</Label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < skill.level!
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                          }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({skill.level}/5)
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {formData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No skills added yet. Click &quot;Add Skill&quot; to get started.
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save All"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}