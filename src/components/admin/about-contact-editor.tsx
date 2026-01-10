"use client"

import { useState, useEffect } from "react"
import { About, Contact } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Heart, MessageCircle, Sparkles, Loader2 } from "lucide-react"

interface AboutContactEditorProps {
  about: About
  contact: Contact
  onUpdateAbout: (about: About) => void
  onUpdateContact: (contact: Contact) => void
  onSave: () => void
}

export function AboutContactEditor({
  about,
  contact,
  onUpdateAbout,
  onUpdateContact,
  onSave
}: AboutContactEditorProps) {
  const [localAbout, setLocalAbout] = useState<About>(about)
  const [localContact, setLocalContact] = useState<Contact>(contact)
  const [newHobby, setNewHobby] = useState("")

  // Sync with props when they change
  useEffect(() => {
    setLocalAbout(about)
  }, [about])

  useEffect(() => {
    setLocalContact(contact)
  }, [contact])

  const updateAbout = (field: keyof About, value: string | string[]) => {
    const updated = { ...localAbout, [field]: value }
    setLocalAbout(updated)
    onUpdateAbout(updated)
  }

  const updateContact = (field: keyof Contact, value: string) => {
    const updated = { ...localContact, [field]: value }
    setLocalContact(updated)
    onUpdateContact(updated)
  }

  const addHobby = () => {
    if (!newHobby.trim()) return
    const hobbies = [...(localAbout.hobbies || []), newHobby.trim()]
    updateAbout("hobbies", hobbies)
    setNewHobby("")
  }

  const removeHobby = (index: number) => {
    const hobbies = (localAbout.hobbies || []).filter((_, i) => i !== index)
    updateAbout("hobbies", hobbies)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* About Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            About Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>About Paragraph</Label>
            <BioRewriter
              currentBio={localAbout.paragraph}
              onAccept={(newBio) => updateAbout("paragraph", newBio)}
            />
            <Textarea
              value={localAbout.paragraph}
              onChange={(e) => updateAbout("paragraph", e.target.value)}
              placeholder="Tell us about yourself..."
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Hobbies & Interests</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {(localAbout.hobbies || []).map((hobby, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {hobby}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-destructive"
                    onClick={() => removeHobby(index)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a hobby..."
                value={newHobby}
                onChange={(e) => setNewHobby(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addHobby()
                  }
                }}
              />
              <Button variant="outline" size="sm" onClick={addHobby}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Contact Section
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Contact Note</Label>
            <Textarea
              value={localContact.note}
              onChange={(e) => updateContact("note", e.target.value)}
              placeholder="Your contact message..."
              className="min-h-[120px]"
            />
          </div>

          <div className="pt-4">
            <Button onClick={onSave} className="w-full">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BioRewriter({ currentBio, onAccept }: { currentBio: string, onAccept: (bio: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedBio, setGeneratedBio] = useState("")

  const handleGenerate = async () => {
    if (!currentBio) return
    setIsGenerating(true)
    setIsOpen(true)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rewrite-bio", data: { bio: currentBio } })
      })
      const data = await res.json()
      if (data.result) setGeneratedBio(data.result)
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={handleGenerate} className="w-full mb-2 gap-2 text-primary border-primary/20 hover:bg-primary/5">
        <Sparkles className="w-4 h-4" /> Rewrite with AI
      </Button>
    )
  }

  return (
    <div className="space-y-4 mb-4 border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> AI Suggestion
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
            <Label className="text-xs text-muted-foreground">Original</Label>
            <div className="text-sm p-3 border rounded bg-background opacity-70">{currentBio}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">AI Version</Label>
            <div className="text-sm p-3 border rounded bg-background border-primary/20">{generatedBio}</div>
          </div>
        </div>
      )}

      {!isGenerating && generatedBio && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Discard</Button>
          <Button variant="secondary" size="sm" onClick={() => { /* copy to manual edit? */ }}>Edit Manually</Button>
          <Button size="sm" onClick={() => { onAccept(generatedBio); setIsOpen(false) }}>Use This</Button>
        </div>
      )}
    </div>
  )
}