"use client"

import { useState } from "react"
import { Contact } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, X } from "lucide-react"

interface ContactEditorProps {
  contact: Contact
  onSave: (contact: Contact) => void
  onCancel: () => void
}

export function ContactEditor({ contact, onSave, onCancel }: ContactEditorProps) {
  const [formData, setFormData] = useState<Contact>(contact)
  const [isSaving, setIsSaving] = useState(false)

  const handleNoteChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      note: value
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
        <CardTitle>Contact Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact-note">Contact Message</Label>
          <Textarea
            id="contact-note"
            value={formData.note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder="Enter your contact message or call to action..."
            rows={4}
          />
          <p className="text-sm text-muted-foreground">
            This message will be displayed in the contact section of your portfolio.
          </p>
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