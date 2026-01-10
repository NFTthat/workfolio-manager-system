"use client"

import { useState, useEffect } from "react"
import { Skill } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical, Star } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface SkillEditorProps {
  skills: Skill[]
  onUpdate: (skills: Skill[]) => void
  onSave: () => void
}

export function SkillEditor({ skills, onUpdate, onSave }: SkillEditorProps) {
  const [localSkills, setLocalSkills] = useState<Skill[]>(skills)

  // Sync with props when they change
  useEffect(() => {
    setLocalSkills(skills)
  }, [skills])

  const addSkill = () => {
    const newSkill: Skill = {
      id: uuidv4(),
      name: "",
      category: "",
      level: 3,
      order: localSkills.length,
    }
    const updated = [...localSkills, newSkill]
    setLocalSkills(updated)
    onUpdate(updated)
  }

  const removeSkill = (id: string) => {
    const updated = localSkills.filter(skill => skill.id !== id)
    setLocalSkills(updated)
    onUpdate(updated)
  }

  const updateSkill = (id: string, field: keyof Skill, value: Skill[keyof Skill]) => {
    const updated = localSkills.map(skill =>
      skill.id === id ? { ...skill, [field]: value } : skill
    )
    setLocalSkills(updated)
    onUpdate(updated)
  }

  const categories = Array.from(new Set(localSkills.map(skill => skill.category).filter(Boolean))) as string[]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Skills
          <div className="flex gap-2">
            <Button onClick={addSkill} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
            <Button onClick={onSave} size="sm">
              Save
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {localSkills.map((skill, index) => (
          <Card key={skill.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSkill(skill.id!)}
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
                    onChange={(e) => updateSkill(skill.id!, "name", e.target.value)}
                    placeholder="JavaScript"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={skill.category || ""}
                    onValueChange={(value) => updateSkill(skill.id!, "category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="Cloud">Cloud</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      {categories.map(category => (
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
                    onValueChange={(value) => updateSkill(skill.id!, "level", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Beginner (1/5)</SelectItem>
                      <SelectItem value="2">Elementary (2/5)</SelectItem>
                      <SelectItem value="3">Intermediate (3/5)</SelectItem>
                      <SelectItem value="4">Advanced (4/5)</SelectItem>
                      <SelectItem value="5">Expert (5/5)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {skill.level && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Proficiency:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= skill.level!
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {localSkills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No skills added yet. Click "Add Skill" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}