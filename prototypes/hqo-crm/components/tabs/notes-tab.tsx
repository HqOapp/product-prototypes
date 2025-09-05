"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FloatingNotePanel } from "@/components/ui/floating-note-panel"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare, 
  User, 
  Clock, 
  Filter,
  Search
} from "lucide-react"

interface NotesTabProps {
  selectedBuildings: string[]
}

type Priority = "low" | "medium" | "high"

interface BaseNote {
  id: string
  title: string
  content: string
  author: string
  authorRole: string
  createdAt: string
  updatedAt: string
  priority: Priority
  tags: string[]
}

interface TenantNote extends BaseNote {
  type: "tenant"
}

interface ContactNote extends BaseNote {
  type: "contact"
  contactId: string
  contactName: string
}

type Note = TenantNote | ContactNote

// Mock data for notes
const mockTenantNotes: Note[] = [
  {
    id: "1",
    type: "tenant",
    title: "Lease Renewal Discussion",
    content: "Had a productive meeting with Sarah Martinez about lease renewal options. They're interested in expanding to an additional 5,000 SF in the same building. Need to follow up with space availability.",
    author: "John Smith",
    authorRole: "Property Manager",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    priority: "high",
    tags: ["lease", "expansion", "renewal"]
  },
  {
    id: "2",
    type: "tenant",
    title: "Payment History Note",
    content: "Tenant has consistently paid rent 2-3 days early for the past 12 months. Excellent payment history and communication.",
    author: "Mary Johnson",
    authorRole: "Finance Manager", 
    createdAt: "2024-01-10T14:20:00Z",
    updatedAt: "2024-01-10T14:20:00Z",
    priority: "low",
    tags: ["payment", "positive"]
  },
  {
    id: "3",
    type: "contact",
    contactId: "sarah-martinez",
    contactName: "Sarah Martinez",
    title: "CEO Preferences",
    content: "Prefers communication via email rather than phone calls. Available for meetings typically Tuesday-Thursday 2-4 PM. Very responsive and professional.",
    author: "John Smith",
    authorRole: "Property Manager",
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-08T09:15:00Z",
    priority: "medium",
    tags: ["communication", "preferences"]
  },
  {
    id: "4", 
    type: "contact",
    contactId: "michael-chen",
    contactName: "Michael Chen",
    title: "Financial Decision Maker",
    content: "Michael handles all financial decisions and lease negotiations. Has expressed interest in energy efficiency improvements that could reduce operating costs.",
    author: "Mary Johnson",
    authorRole: "Finance Manager",
    createdAt: "2024-01-05T16:45:00Z",
    updatedAt: "2024-01-05T16:45:00Z",
    priority: "medium",
    tags: ["finance", "decision-maker", "energy-efficiency"]
  }
]

// Mock contacts data
const mockContacts = [
  { id: "sarah-martinez", name: "Sarah Martinez", role: "CEO" },
  { id: "michael-chen", name: "Michael Chen", role: "CFO" },
  { id: "jennifer-davis", name: "Jennifer Davis", role: "Operations Manager" }
]

export function NotesTab({ selectedBuildings }: NotesTabProps) {
  const [activeTab, setActiveTab] = useState("all")
  const [notes, setNotes] = useState<Note[]>(mockTenantNotes)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<string>("all")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  // Filter notes based on active tab and filters
  const filteredNotes = notes.filter(note => {
    if (activeTab === "tenant" && note.type !== "tenant") return false
    if (activeTab === "contacts" && note.type !== "contact") return false
    if (selectedContact !== "all" && note.type === "contact" && note.contactId !== selectedContact) return false
    if (selectedContact !== "all" && note.type === "tenant") return false
    if (selectedPriority !== "all" && note.priority !== selectedPriority) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }
    return true
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    })
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
    }
  }

  const handleSaveNote = (noteData: any) => {
    const baseNote = {
      id: editingNote?.id || Date.now().toString(),
      title: noteData.title,
      content: noteData.content,
      author: "Current User", // In real app, get from auth
      authorRole: "Property Manager", // In real app, get from auth
      createdAt: editingNote?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: noteData.priority,
      tags: noteData.tags
    }

    const newNote: Note = noteData.type === "contact" 
      ? {
          ...baseNote,
          type: "contact" as const,
          contactId: noteData.contactId,
          contactName: mockContacts.find(c => c.id === noteData.contactId)?.name || ""
        }
      : {
          ...baseNote,
          type: "tenant" as const
        }

    if (editingNote) {
      // Update existing note
      setNotes(notes.map(note => note.id === editingNote.id ? newNote : note))
    } else {
      // Add new note
      setNotes([newNote, ...notes])
    }
    
    setEditingNote(null)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setIsAddNoteOpen(true)
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId))
  }

  const getTabCounts = () => {
    const tenantCount = notes.filter(n => n.type === "tenant").length
    const contactCount = notes.filter(n => n.type === "contact").length
    return { tenant: tenantCount, contact: contactCount, all: notes.length }
  }

  const tabCounts = getTabCounts()

  return (
    <div className="page-container">
      <div className="card-grid-3">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 content-section">
          {/* Header with filters and add button */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <CardTitle className="text-xl font-normal">Notes</CardTitle>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsAddNoteOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add note
              </Button>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedContact} onValueChange={setSelectedContact}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All contacts</SelectItem>
                    {mockContacts.map(contact => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">
                    All notes ({tabCounts.all})
                  </TabsTrigger>
                  <TabsTrigger value="tenant">
                    Tenant notes ({tabCounts.tenant})
                  </TabsTrigger>
                  <TabsTrigger value="contacts">
                    Contact notes ({tabCounts.contact})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredNotes.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
                      <p className="text-gray-500">
                        {searchQuery || selectedContact !== "all" || selectedPriority !== "all"
                          ? "Try adjusting your filters or search terms."
                          : "Get started by adding your first note."}
                      </p>
                    </div>
                  ) : (
                    <div className="content-group">
                      {filteredNotes.map((note) => (
                        <Card key={note.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${note.type === 'tenant' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                                  {note.type === 'tenant' ? (
                                    <MessageSquare className={`h-4 w-4 ${note.type === 'tenant' ? 'text-blue-600' : 'text-purple-600'}`} />
                                  ) : (
                                    <User className="h-4 w-4 text-purple-600" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h3 className="font-medium text-gray-900">{note.title}</h3>
                                    <Badge className={getPriorityColor(note.priority)}>
                                      {note.priority}
                                    </Badge>
                                    {note.type === 'contact' && (
                                      <Badge variant="outline">
                                        {note.contactName}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-600 mb-3">{note.content}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{formatDate(note.createdAt)}</span>
                                    </div>
                                    <span>by {note.author}</span>
                                    {note.updatedAt !== note.createdAt && (
                                      <span>(edited)</span>
                                    )}
                                  </div>
                                  {note.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {note.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary" className="text-xs">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditNote(note)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteNote(note.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="content-section">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Notes Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="content-items">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total notes</span>
                  <span className="font-medium">{notes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tenant notes</span>
                  <span className="font-medium">{tabCounts.tenant}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Contact notes</span>
                  <span className="font-medium">{tabCounts.contact}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">High priority</span>
                  <span className="font-medium text-red-600">
                    {notes.filter(n => n.priority === 'high').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="content-items">
                {notes.slice(0, 3).map((note) => (
                  <div key={note.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-1 rounded ${note.type === 'tenant' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                      {note.type === 'tenant' ? (
                        <MessageSquare className="h-3 w-3 text-blue-600" />
                      ) : (
                        <User className="h-3 w-3 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {note.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Contacts Quick Reference */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Key Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="content-items">
                                 {mockContacts.map((contact) => {
                   const contactNotes = notes.filter(n => n.type === "contact" && n.contactId === contact.id)
                  return (
                    <div key={contact.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{contact.name}</p>
                          <p className="text-xs text-gray-500">{contact.role}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {contactNotes.length} notes
                      </Badge>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating Note Panel */}
      <FloatingNotePanel
        isOpen={isAddNoteOpen}
        onClose={() => {
          setIsAddNoteOpen(false)
          setEditingNote(null)
        }}
        onSave={handleSaveNote}
        editingNote={editingNote}
        contacts={mockContacts}
      />
    </div>
  )
} 