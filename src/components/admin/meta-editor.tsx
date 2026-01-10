"use client"

import Image from "next/image"

import { useState, useEffect } from "react"
import { Meta } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Upload, Sparkles, Loader2, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface MetaEditorProps {
  meta: Meta
  onUpdate: (meta: Meta) => void
  onSave: () => void
}

export function MetaEditor({ meta, onUpdate, onSave }: MetaEditorProps) {
  const [localMeta, setLocalMeta] = useState<Meta>(meta)
  const [isUploading, setIsUploading] = useState(false)

  // Sync with props when they change
  useEffect(() => {
    setLocalMeta(meta)
  }, [meta])

  const handleChange = (field: keyof Meta, value: string) => {
    const updated = { ...localMeta, [field]: value }
    setLocalMeta(updated)
    onUpdate(updated)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const { url } = await response.json()
        handleChange("heroImage", url)
      }
    } catch (error) {
      console.error("Failed to upload image:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Meta Information
          <Button onClick={onSave} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={localMeta.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={localMeta.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Your professional title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={localMeta.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              value={localMeta.twitter}
              onChange={(e) => handleChange("twitter", e.target.value)}
              placeholder="https://twitter.com/username"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={localMeta.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="City, Country"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroImage">Hero Image</Label>
          <div className="flex gap-2">
            <Input
              id="heroImage"
              value={localMeta.heroImage || ""}
              onChange={(e) => handleChange("heroImage", e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1"
            />
            <div className="relative">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <Button variant="outline" size="sm" disabled={isUploading}>
                {isUploading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
          {localMeta.heroImage && (
            <div className="mt-2">
              <Image
                src={localMeta.heroImage}
                alt="Hero preview"
                width={128}
                height={128}
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <MetaWriter
            currentSummary={localMeta.summary || ""}
            onAccept={(summary) => handleChange("summary", summary)}
          />
          <Textarea
            id="summary"
            value={localMeta.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="A brief professional summary for your hero section..."
            className="min-h-[100px]"
          />
        </div>

      </CardContent>
    </Card>
  )
}

function MetaWriter({ currentSummary, onAccept }: { currentSummary: string, onAccept: (summary: string) => void }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSummary, setGeneratedSummary] = useState("")

  const handleGenerate = async () => {
    setIsGenerating(true)
    setIsOpen(true)
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-summary", data: { existing: currentSummary } })
      })
      const data = await res.json()
      if (data.result) setGeneratedSummary(data.result)
    } catch (e) {
      console.error(e)
    } finally {
      setIsGenerating(false)
    }
  }

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={handleGenerate} className="w-full mb-1 gap-2 text-primary border-primary/20 hover:bg-primary/5">
        <Sparkles className="w-4 h-4" /> Generate Professional Summary with AI
      </Button>
    )
  }

  return (
    <div className="space-y-4 mb-4 border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" /> AI Summary
        </h4>
        <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}><X className="w-4 h-4" /></Button>
      </div>

      {isGenerating ? (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" /> Generating...
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-sm p-3 border rounded bg-background border-primary/20 whitespace-pre-wrap">{generatedSummary}</div>
        </div>
      )}

      {!isGenerating && generatedSummary && (
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Discard</Button>
          <Button size="sm" onClick={() => { onAccept(generatedSummary); setIsOpen(false) }}>Use This</Button>
        </div>
      )}
    </div>
  )
}