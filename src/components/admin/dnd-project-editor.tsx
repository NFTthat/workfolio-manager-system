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
import { Project } from "@/lib/types/portfolio"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical, X, Sparkles, Loader2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

interface SortableProjectItemProps {
  project: Project
  index: number
  onUpdate: (id: string, field: keyof Project, value: Project[keyof Project]) => void
  onRemove: (id: string) => void
  onAddTag: (id: string, tag: string) => void
  onRemoveTag: (id: string, tagIndex: number) => void
}

function SortableProjectItem({
  project,
  index,
  onUpdate,
  onRemove,
  onAddTag,
  onRemoveTag,
}: SortableProjectItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id || index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const [newTag, setNewTag] = useState("")

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(project.id!, newTag)
      setNewTag("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTag()
    }
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
            onClick={() => onRemove(project.id!)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={project.title}
            onChange={(e) => onUpdate(project.id!, "title", e.target.value)}
            placeholder="Project Name"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <ProjectEnhancer
            currentDescription={project.description || ""}
            onAccept={(newDesc) => onUpdate(project.id!, "description", newDesc)}
          />
          <Textarea
            value={project.description || ""}
            onChange={(e) => onUpdate(project.id!, "description", e.target.value)}
            placeholder="Brief description of the project"
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label>Project Link</Label>
          <Input
            value={project.link || ""}
            onChange={(e) => onUpdate(project.id!, "link", e.target.value)}
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
                  onClick={() => onRemoveTag(project.id!, tagIndex)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddTag}
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DndProjectEditorProps {
  projects: Project[]
  onUpdate: (projects: Project[]) => void
  onSave: () => void
}

export function DndProjectEditor({ projects, onUpdate, onSave }: DndProjectEditorProps) {
  const [localProjects, setLocalProjects] = useState<Project[]>(projects)

  // Sync with props when they change
  useEffect(() => {
    setLocalProjects(projects)
  }, [projects])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = localProjects.findIndex(project => project.id === active.id)
      const newIndex = localProjects.findIndex(project => project.id === over?.id)

      const reordered = arrayMove(localProjects, oldIndex, newIndex)
        .map((project, index) => ({ ...project, order: index }))

      setLocalProjects(reordered)
      onUpdate(reordered)
    }
  }

  const addProject = () => {
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
    const updated = localProjects.filter(project => project.id !== id)
      .map((project, index) => ({ ...project, order: index }))
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Projects (Drag to reorder)
          <div className="flex gap-2">
            <Button onClick={addProject} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
            <Button onClick={onSave} size="sm">
              Save
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={localProjects.map(project => project.id!)} strategy={verticalListSortingStrategy}>
            {localProjects.map((project, index) => (
              <SortableProjectItem
                key={project.id}
                project={project}
                index={index}
                onUpdate={updateProject}
                onRemove={removeProject}
                onAddTag={addTag}
                onRemoveTag={removeTag}
              />
            ))}
          </SortableContext>
        </DndContext>

        {localProjects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No projects added yet. Click "Add Project" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  )
}