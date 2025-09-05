"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { GlobalSearch } from "./global-search"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronLeft, Plus, Copy, Calendar, Users, FileText, MapPin, CreditCard, Shield, MessageSquare, X, Tag } from "lucide-react"
import Link from "next/link"

// Mock data - in real app this would come from API
const mockPersons = [
  {
    id: "1",
    name: "Eddie Edwards",
    email: "e.edwards@acme.com",
    company: "ACME Company",
    building: "Building A",
    type: "Tenant",
    tags: ["Point of contact", "VIP"],
    channels: ["App", "Email", "Text"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    initials: "EE",
    phone: "+1 (570) 419 5321",
    lastActive: "April, 2025 at 1:02 PM",
    signupDate: "March 7, 2022 at 11:02 AM",
    deviceType: "Android",
    isInternal: true,
    uuid: "12345-67890-abcdef",
  },
]

const mockActivities = [
  {
    id: "1",
    type: "admin_note",
    title: "Admin note",
    date: "March 25th, 2025 at 01:23 PM",
    author: "Brigid G.",
    content: "Eddie was locked out of the conference room and needed to be let back in by security.",
    icon: MessageSquare,
    color: "bg-blue-500",
  },
  {
    id: "2",
    type: "event_registration",
    title: "Event registration",
    date: "March 25th, 2025 at 01:23 PM",
    content: "Eddie registered for Cocktail Hour happening April 5th, 2025 at 10:00 PM.",
    link: "View registrants",
    icon: Calendar,
    color: "bg-purple-500",
  },
  {
    id: "3",
    type: "survey_completed",
    title: "Survey completed",
    date: "March 25th, 2025 at 01:23 PM",
    content: "Eddie completed the survey Valentine's Day Survey.",
    link: "View responses",
    icon: FileText,
    color: "bg-green-500",
  },
  {
    id: "4",
    type: "visitor_invited",
    title: "Visitor invited",
    date: "March 25th, 2025 at 01:23 PM",
    content: "Eddie registered James Johnson to visit on January 5th, 2025 at 10:00 PM.",
    link: "View visitors",
    icon: Users,
    color: "bg-orange-500",
  },
  {
    id: "5",
    type: "access_granted",
    title: "Access granted",
    date: "March 25th, 2025 at 01:23 PM",
    content: "Accessed Elevator 12.",
    link: "View activity",
    icon: Shield,
    color: "bg-indigo-500",
  },
  {
    id: "6",
    type: "resource_booked",
    title: "Resource booked",
    date: "March 25th, 2025 at 01:23 PM",
    content: "Eddie booked The Perch on January 5th, 2025 starting at 10:00 PM for 2 hours.",
    link: "View bookings",
    icon: MapPin,
    color: "bg-teal-500",
  },
  {
    id: "7",
    type: "admin_note",
    title: "Admin note",
    date: "March 25th, 2025 at 01:23 PM",
    author: "Brigid G.",
    content: "Eddie loves Dogs!",
    icon: MessageSquare,
    color: "bg-blue-500",
  },
]

const tabs = [
  { id: "overview", name: "Overview" },
  { id: "buildings-roles", name: "Buildings & roles" },
]

const activityTabs = [
  { id: "all", name: "All" },
  { id: "access", name: "Access" },
  { id: "bookings", name: "Bookings" },
  { id: "rsvps", name: "RSVPs" },
  { id: "notes", name: "Notes" },
]

// Predefined tag options
const PREDEFINED_TAGS = [
  "Point of contact",
  "VIP", 
  "Decision maker",
  "Executive",
  "Key stakeholder",
  "Primary contact",
  "Finance contact",
  "IT contact",
  "HR contact",
  "Facilities contact",
  "Security contact",
  "Emergency contact"
]

interface PersonDetailProps {
  personId: string
}

export function PersonDetail({ personId }: PersonDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [activeActivityTab, setActiveActivityTab] = useState("all")
  const [newTagInput, setNewTagInput] = useState("")
  const [personTags, setPersonTags] = useState<string[]>(["Point of contact", "VIP"])

  // Find person by ID - in real app this would be an API call
  // For demo purposes, we'll use the mock data from the main people page
  const person = mockPersons.find(p => p.id === personId) || {
    id: personId,
    name: "Eddie Edwards",
    email: "e.edwards@acme.com",
    company: "ACME Company",
    building: "Building A",
    type: "Tenant",
    tags: personTags,
    channels: ["App", "Email", "Text"],
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    initials: "EE",
    phone: "+1 (570) 419 5321",
    lastActive: "April, 2025 at 1:02 PM",
    signupDate: "March 7, 2022 at 11:02 AM",
    deviceType: "Android",
    isInternal: true,
    uuid: "12345-67890-abcdef",
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !personTags.includes(tag.trim())) {
      setPersonTags(prev => [...prev, tag.trim()])
      setNewTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setPersonTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleAddCustomTag = () => {
    if (newTagInput.trim()) {
      addTag(newTagInput)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCustomTag()
    }
  }

  const getTagBadge = (tag: string, isEditing = false) => {
    const colors = {
      "VIP": "bg-purple-100 text-purple-800 border-purple-200",
      "Decision maker": "bg-blue-100 text-blue-800 border-blue-200",
      "Point of contact": "bg-emerald-100 text-emerald-800 border-emerald-200",
      "Executive": "bg-rose-100 text-rose-800 border-rose-200",
      "Key stakeholder": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Primary contact": "bg-green-100 text-green-800 border-green-200",
      "Finance contact": "bg-amber-100 text-amber-800 border-amber-200",
      "IT contact": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "HR contact": "bg-pink-100 text-pink-800 border-pink-200",
      "Facilities contact": "bg-orange-100 text-orange-800 border-orange-200",
      "Security contact": "bg-slate-100 text-slate-800 border-slate-200",
      "Emergency contact": "bg-red-100 text-red-800 border-red-200",
    }
    
    return (
      <Badge className={`${colors[tag as keyof typeof colors] || "bg-slate-100 text-slate-800 border-slate-200"} border font-medium px-3 py-1 ${isEditing ? "pr-1" : ""}`}>
        {tag}
        {isEditing && (
          <button
            onClick={() => removeTag(tag)}
            className="ml-2 hover:bg-black/10 rounded-full p-0.5"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </Badge>
    )
  }

  const renderTagsSection = () => {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          {personTags.map((tag, index) => (
            <span key={index}>{getTagBadge(tag)}</span>
          ))}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
            >
              <Tag className="h-3 w-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Manage Tags</h4>
                <p className="text-xs text-gray-500">Add or remove tags for this person</p>
              </div>

              {/* Current Tags */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Current Tags</label>
                <div className="flex flex-wrap gap-1">
                  {personTags.map((tag, index) => (
                    <span key={index}>{getTagBadge(tag, true)}</span>
                  ))}
                  {personTags.length === 0 && (
                    <span className="text-xs text-gray-500 italic">No tags assigned</span>
                  )}
                </div>
              </div>

              {/* Available Tags */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Available Tags</label>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {PREDEFINED_TAGS.filter(tag => !personTags.includes(tag)).map((tag) => (
                    <Button
                      key={tag}
                      variant="outline"
                      size="sm"
                      onClick={() => addTag(tag)}
                      className="text-xs h-6 border-dashed hover:border-solid hover:bg-blue-50 hover:text-blue-700"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Tag Input */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700">Add Custom Tag</label>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Enter custom tag..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-sm h-8 flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleAddCustomTag}
                    disabled={!newTagInput.trim()}
                    className="h-8 px-3"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  const renderActivityIcon = (activity: any) => {
    const Icon = activity.icon
    return (
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activity.color} text-white shadow-sm`}>
        <Icon className="h-5 w-5" />
      </div>
    )
  }

  const renderActivityContent = (activity: any) => {
    return (
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <h4 className="text-base font-semibold text-slate-900">{activity.title}</h4>
            <span className="text-sm text-slate-500 font-medium">{activity.date}</span>
          </div>
        </div>
        {activity.author && (
          <p className="text-sm text-slate-600 font-medium mb-2">{activity.author}</p>
        )}
        <p className="text-slate-700 leading-relaxed">{activity.content}</p>
        {activity.link && (
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-3 hover:underline">
            {activity.link}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center text-sm text-slate-500 mb-6" aria-label="Breadcrumb">
            <Link href="/people" className="hover:underline text-blue-600 font-medium">People</Link>
          </nav>

          {/* Profile Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-semibold">
                  {person.initials}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{person.name}</h1>
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-slate-600 font-medium">{person.email}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-blue-600 font-semibold">{person.company}</span>
                </div>
                {renderTagsSection()}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 font-medium px-6">
                Resend invite
              </Button>
              <div className="flex items-center space-x-3 bg-orange-50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium text-orange-700">Pending</span>
                <span className="text-xs text-orange-600">Last invite sent 3 hours ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-200 px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="h-auto p-0 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-6 py-4 font-medium"
                >
                  {tab.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50">
          <div className="flex h-full">
            {/* Left Column - Activity Feed */}
            <div className="flex-1 p-8">
              <div className="max-w-4xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Activity</h2>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-sm font-medium">
                    <Plus className="h-4 w-4 mr-2" />
                    Add note
                  </Button>
                </div>

                {/* Activity Tabs */}
                <div className="flex space-x-2 mb-8">
                  {activityTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveActivityTab(tab.id)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeActivityTab === tab.id
                          ? "bg-blue-100 text-blue-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* Activity List */}
                <div className="space-y-6">
                  {mockActivities.map((activity) => (
                    <div key={activity.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4">
                        {renderActivityIcon(activity)}
                        {renderActivityContent(activity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Person Details */}
            <div className="w-96 p-8 pr-8">
              <Card className="h-fit">
                <CardContent className="p-6">
                  <div className="space-y-8">
                    <div className="bg-slate-50 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-6">{person.name}</h3>
                      <div className="text-sm text-slate-500 font-medium">User name</div>
                    </div>

                    <div className="space-y-6">
                      <div className="border-b border-slate-100 pb-4">
                        <div className="text-sm font-semibold text-blue-600 mb-1">{person.company}</div>
                        <div className="text-sm text-slate-500">Company</div>
                      </div>

                      <div className="border-b border-slate-100 pb-4">
                        <div className="text-sm font-medium text-slate-900 mb-1">{person.email}</div>
                        <div className="text-sm text-slate-500">Email</div>
                      </div>

                      <div className="border-b border-slate-100 pb-4">
                        <div className="text-sm font-medium text-slate-900 mb-1">{person.phone}</div>
                        <div className="text-sm text-slate-500">Phone number</div>
                      </div>

                      <div className="border-b border-slate-100 pb-4">
                        <div className="text-sm font-medium text-slate-900 mb-1">{person.lastActive}</div>
                        <div className="text-sm text-slate-500">Last active</div>
                      </div>

                      <div className="border-b border-slate-100 pb-4">
                        <div className="text-sm font-medium text-slate-900 mb-1">{person.signupDate}</div>
                        <div className="text-sm text-slate-500">Signup date</div>
                      </div>

                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-amber-700">T</span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-amber-900">Test user</div>
                            <div className="text-xs text-amber-700">Test users and their actions are not shown in analytics</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-bold text-slate-900">Internal</h4>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                          <Copy className="h-4 w-4 mr-2" />
                          Copy UUID
                        </Button>
                      </div>

                      <div className="space-y-6">
                        <div className="border-b border-slate-200 pb-4">
                          <div className="text-sm font-medium text-slate-900 mb-1">{person.deviceType}</div>
                          <div className="text-sm text-slate-500">Device type</div>
                        </div>

                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-blue-700">I</span>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-blue-900">Internal user</div>
                              <div className="text-xs text-blue-700">An internal HqO user, all features and roles are enabled</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 