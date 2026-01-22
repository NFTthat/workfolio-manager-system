"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import {
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Experience } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical, Sparkles, Loader2, X, Diamond } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { UpgradeModal } from "./upgrade-modal"
import { toast } from "sonner"

interface SortableExperienceItemProps {
  experience: Experience
  index: number
  onUpdate: (id: string, field: keyof Experience, value: Experience[keyof Experience]) => void
  onRemove: (id: string) => void
  onAddBullet: (id: string) => void
  onRemoveBullet: (id: string, bulletIndex: number) => void
  onUpdateBullet: (id: string, bulletIndex: number, value: string) => void
  isPro: boolean
}

function SortableExperienceItem({
  experience,
  index,
  onUpdate,
  onRemove,
  onAddBullet,
  onRemoveBullet,
  onUpdateBullet,
  isPro
}: SortableExperienceItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: experience.id || index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className="relative">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors"
            >
              <GripVertical className="w-4 h-4" />
            </div>
            <Badge variant="outline">#{index + 1}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(experience.id!)}
            className="text-muted-foreground hover:text-destructive group"
          >
            {!isPro ? (
              <div className="flex items-center group-hover:hidden">
                <Diamond className="w-4 h-4 mr-1 text-purple-500 fill-purple-500" />
                <span className="text-xs text-purple-500 font-bold">Pro</span>
              </div>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            {!isPro && <Trash2 className="hidden group-hover:block w-4 h-4 text-purple-500" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Input
              value={experience.role}
              onChange={(e) => onUpdate(experience.id!, "role", e.target.value)}
              placeholder="Senior Frontend Developer"
            />
          </div>
          <div className="space-y-2">
            <Label>Organization</Label>
            <Input
              value={experience.org}
              onChange={(e) => onUpdate(experience.id!, "org", e.target.value)}
              placeholder="Company Name"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Period</Label>
            <Input
              value={experience.period}
              onChange={(e) => onUpdate(experience.id!, "period", e.target.value)}
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
              onClick={() => onAddBullet(experience.id!)}
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
                  onChange={(e) => onUpdateBullet(experience.id!, bulletIndex, e.target.value)}
                  placeholder="Describe your achievement..."
                  className="min-h-[60px]"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveBullet(experience.id!, bulletIndex)}
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
  )
}

interface DndExperienceEditorProps {
  experiences: Experience[]
  onUpdate: (experiences: Experience[]) => void
  onSave: () => void
  isPro?: boolean
  sections?: any[]
  onUpdateSections?: (sections: any[]) => void
}

export function DndExperienceEditor({ experiences, onUpdate, onSave, isPro = false, sections = [], onUpdateSections }: DndExperienceEditorProps) {
  const [localExperiences, setLocalExperiences] = useState<Experience[]>(experiences)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  // Sync with props when they change
  useEffect(() => {
    setLocalExperiences(experiences)
  }, [experiences])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = localExperiences.findIndex(exp => exp.id === active.id)
      const newIndex = localExperiences.findIndex(exp => exp.id === over?.id)

      const reordered = arrayMove(localExperiences, oldIndex, newIndex)
        .map((exp, index) => ({ ...exp, order: index }))

      setLocalExperiences(reordered)
      onUpdate(reordered)
    }
  }

  const addExperience = () => {
    // Pro limit check
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
      .map((exp, index) => ({ ...exp, order: index }))
    setLocalExperiences(updated)
    onUpdate(updated)
  }

  const updateExperience = (id: string, field: keyof Experience, value: Experience[keyof Experience]) => {
    const updated = localExperiences.map(exp =>
      exp.id === id ? { ...exp, [field]: value } : exp
    )
    setLocalExperiences(updated)
    onUpdate(updated)
  }

  const updateBullet = (expId: string, bulletIndex: number, value: string) => {
    const updated = localExperiences.map(exp => {
      if (exp.id === expId) {
        const bullets = [...exp.bullets!]
        bullets[bulletIndex] = value
        return { ...exp, bullets }
      }
      return exp
    })
    setLocalExperiences(updated)
    onUpdate(updated)
  }

  const addBullet = (expId: string) => {
    const updated = localExperiences.map(exp => {
      if (exp.id === expId) {
        return { ...exp, bullets: [...(exp.bullets || []), ""] }
      }
      return exp
    })
    setLocalExperiences(updated)
    onUpdate(updated)
  }

  const removeBullet = (expId: string, bulletIndex: number) => {
    const updated = localExperiences.map(exp => {
      if (exp.id === expId) {
        const bullets = exp.bullets?.filter((_, i) => i !== bulletIndex) || []
        return { ...exp, bullets }
      }
      return exp
    })
    setLocalExperiences(updated)
    onUpdate(updated)
  }

  return (
    <>
      <UpgradeModal open={showUpgradeModal} onOpenChange={setShowUpgradeModal} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Experiences (Drag to reorder)
            <div className="flex gap-2">
              <Button onClick={addExperience} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
              <Button onClick={onSave} size="sm">
                Save
              </Button>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <ExperienceOrganizer
            experiences={localExperiences}
            onOrganize={(sections) => {
              console.log("Organized:", sections)
              toast.success("AI organizing feature needs server integration.")
            }}
            isPro={isPro}
          />

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={localExperiences.map(exp => exp.id!)} strategy={verticalListSortingStrategy}>
              {localExperiences.map((experience, index) => (
                <SortableExperienceItem
                  key={experience.id}
                  experience={experience}
                  index={index}
                  onUpdate={updateExperience}
                  onRemove={removeExperience}
                  onAddBullet={addBullet}
                  onRemoveBullet={removeBullet}
                  onUpdateBullet={updateBullet}
                  isPro={isPro}
                />
              ))}
            </SortableContext>
          </DndContext>

          {localExperiences.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No experiences added yet. Click "Add Experience" to get started.
            </div>
          )}
        </CardContent>
      </Card >
    </>
  )
}

function ExperienceOrganizer({ experiences, onOrganize, isPro }: { experiences: Experience[], onOrganize: (sections: any) => void, isPro: boolean }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleOrganize = async () => {
    if (!isPro) {
      toast.info("Organize with AI is a Pro feature.")
      return
    }
    if (experiences.length === 0) return
    setIsGenerating(true)
    // Simulation
    setTimeout(() => {
      setIsGenerating(false);
      toast.info("AI Organization not fully wired.");
    }, 1000);
  }

  return (
    <Button variant="outline" className="w-full mb-6 border-dashed" onClick={handleOrganize} disabled={isGenerating}>
      {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> :
        (!isPro ? <Diamond className="w-4 h-4 mr-2 text-purple-500 fill-purple-500" /> : <Sparkles className="w-4 h-4 mr-2" />)}
      {isGenerating ? "Organizing..." : "Organize with AI (Pro)"}
    </Button>
  )
}