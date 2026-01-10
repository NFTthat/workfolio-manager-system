"use client"

import { useState } from "react"
import { About } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Save, X, Plus, Trash2 } from "lucide-react"

interface AboutEditorProps {
  about: About
  onSave: (about: About) => void
  onCancel: () => void
}

export function AboutEditor({ about, onSave, onCancel }: AboutEditorProps) {
  const [formData, setFormData] = useState<About>(about)
  const [newHobby, setNewHobby] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const handleParagraphChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      paragraph: value
    }))
  }

  const addHobby = () => {
    const currentHobbies = formData.hobbies || []
    if (newHobby.trim() && !currentHobbies.includes(newHobby.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...(prev.hobbies || []), newHobby.trim()]
      }))
      setNewHobby("")
    }
  }

  const removeHobby = (index: number) => {
    setFormData(prev => ({
      ...prev,
      hobbies: (prev.hobbies || []).filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(formData)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="paragraph">About Paragraph</Label>
          <Textarea
            id="paragraph"
            value={formData.paragraph}
            onChange={(e) => handleParagraphChange(e.target.value)}
            placeholder="Tell us about yourself..."
            rows={4}
          />
        </div>

        <div className="space-y-3">
          <Label>Hobbies & Interests</Label>
          <div className="flex gap-2">
            <Input
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              placeholder="Add a hobby..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addHobby()
                }
              }}
            />
            <Button type="button" onClick={addHobby} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(formData.hobbies || []).map((hobby, index) => (
              <Badge key={index} variant="secondary" className="gap-2">
                {hobby}
                <button
                  onClick={() => removeHobby(index)}
                  className="ml-1 hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
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