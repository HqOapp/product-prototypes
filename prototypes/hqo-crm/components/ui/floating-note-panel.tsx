"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { 
  Plus, 
  X, 
  Minus, 
  Maximize2, 
  GripVertical,
  Send,
  Paperclip,
  Hash
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FloatingNotePanelProps {
  isOpen: boolean
  onClose: () => void
  onSave: (note: NoteFormData) => void
  editingNote?: Note | null
  contacts?: Contact[]
}

interface NoteFormData {
  type: "tenant" | "contact"
  contactId: string
  title: string
  content: string
  priority: "low" | "medium" | "high"
  tags: string[]
}

interface Note {
  id: string
  type: "tenant" | "contact"
  contactId?: string
  title: string
  content: string
  priority: "low" | "medium" | "high"
  tags: string[]
  author: string
  authorRole: string
  createdAt: string
}

interface Contact {
  id: string
  name: string
  role: string
}

export function FloatingNotePanel({ 
  isOpen, 
  onClose, 
  onSave, 
  editingNote, 
  contacts = [] 
}: FloatingNotePanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isInitialized, setIsInitialized] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const dragHandleRef = useRef<HTMLDivElement>(null)

  // Form state
  const [noteForm, setNoteForm] = useState<NoteFormData>({
    type: "tenant",
    contactId: "",
    title: "",
    content: "",
    priority: "medium",
    tags: []
  })

  // Initialize position to bottom-right when first opened
  useEffect(() => {
    if (isOpen && !isInitialized) {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const panelWidth = 400
      const panelHeight = isCollapsed ? 60 : 500
      
      setPosition({
        x: windowWidth - panelWidth - 24,
        y: windowHeight - panelHeight - 24
      })
      setIsInitialized(true)
    }
  }, [isOpen, isInitialized, isCollapsed])

  // Load editing note data
  useEffect(() => {
    if (editingNote) {
      setNoteForm({
        type: editingNote.type,
        contactId: editingNote.contactId || "",
        title: editingNote.title,
        content: editingNote.content,
        priority: editingNote.priority,
        tags: editingNote.tags
      })
    }
  }, [editingNote])

  // Handle drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragHandleRef.current?.contains(e.target as Node)) return
    
    setIsDragging(true)
    const rect = panelRef.current?.getBoundingClientRect()
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      // Keep panel within viewport bounds
      const maxX = window.innerWidth - (panelRef.current?.offsetWidth || 400)
      const maxY = window.innerHeight - (panelRef.current?.offsetHeight || 500)
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  const handleSave = () => {
    if (!noteForm.title || !noteForm.content) return
    
    onSave(noteForm)
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setNoteForm({
      type: "tenant",
      contactId: "",
      title: "",
      content: "",
      priority: "medium",
      tags: []
    })
  }

  const handleClose = () => {
    resetForm()
    onClose()
    setIsInitialized(false)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (!isOpen) return null

  return (
    <div 
      ref={panelRef}
      className={cn(
        "fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-80 h-16" : "w-96 h-[500px]",
        isDragging ? "cursor-grabbing" : ""
      )}
      style={{
        left: position.x,
        top: position.y,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Header - Always Visible */}
      <div 
        ref={dragHandleRef}
        className={cn(
          "flex items-center justify-between p-4 border-b border-gray-200 cursor-grab active:cursor-grabbing rounded-t-lg",
          isCollapsed && "border-b-0 rounded-b-lg"
        )}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="font-medium text-gray-900">
            {isCollapsed 
              ? (editingNote ? "Edit Note" : "Add Note") 
              : (editingNote ? "Edit Note" : "Create New Note")
            }
          </span>
          {isCollapsed && noteForm.title && (
            <span className="text-sm text-gray-500">- {noteForm.title}</span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            {isCollapsed ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content - Hidden when collapsed */}
      {!isCollapsed && (
        <div className="flex flex-col h-[calc(100%-65px)]">
          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            {/* Note Type and Priority */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="note-type" className="text-sm font-medium">Type</Label>
                <Select 
                  value={noteForm.type} 
                  onValueChange={(value: "tenant" | "contact") => 
                    setNoteForm({...noteForm, type: value, contactId: ""})
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tenant">Tenant note</SelectItem>
                    <SelectItem value="contact">Contact note</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                <Select 
                  value={noteForm.priority} 
                  onValueChange={(value: "low" | "medium" | "high") => 
                    setNoteForm({...noteForm, priority: value})
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Low
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        Medium
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        High
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Contact Selection - Only for contact notes */}
            {noteForm.type === "contact" && (
              <div>
                <Label htmlFor="contact" className="text-sm font-medium">Contact</Label>
                <Select 
                  value={noteForm.contactId} 
                  onValueChange={(value) => setNoteForm({...noteForm, contactId: value})}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{contact.name}</span>
                          <span className="text-xs text-gray-500">{contact.role}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                value={noteForm.title}
                onChange={(e) => setNoteForm({...noteForm, title: e.target.value})}
                placeholder="Enter note title"
                className="h-9"
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content" className="text-sm font-medium">Content</Label>
              <Textarea
                id="content"
                value={noteForm.content}
                onChange={(e) => setNoteForm({...noteForm, content: e.target.value})}
                placeholder="Write your note here..."
                className="min-h-[120px] resize-none"
                rows={5}
              />
            </div>

            {/* Tags */}
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {noteForm.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    <Hash className="h-3 w-3 mr-1" />
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-gray-200"
                      onClick={() => {
                        const newTags = noteForm.tags.filter((_, i) => i !== index)
                        setNoteForm({...noteForm, tags: newTags})
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <Input
                  placeholder="Add tag..."
                  className="h-6 text-xs max-w-[100px] border-dashed"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value.trim()
                      if (value && !noteForm.tags.includes(value)) {
                        setNoteForm({...noteForm, tags: [...noteForm.tags, value]})
                        e.currentTarget.value = ""
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-600">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleClose}
                  className="h-8 px-3"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={!noteForm.title || !noteForm.content || (noteForm.type === "contact" && !noteForm.contactId)}
                  className="h-8 px-3 bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {editingNote ? "Update" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 