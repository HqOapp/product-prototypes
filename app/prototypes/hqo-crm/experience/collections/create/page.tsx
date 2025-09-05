"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ExperienceSidebar } from "@/components/experience/experience-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Search, 
  ChevronRight, 
  Upload, 
  X, 
  Calendar, 
  FileText, 
  MapPin, 
  Users,
  GripVertical,
  ArrowUpDown,
  SortAsc,
  Clock,
  Eye,
  Smartphone,
  Zap,
  Plus
} from "lucide-react"
import Link from "next/link"

// Mock data for available content
const mockAvailableContent = [
  { id: "1", name: "Yoga Classes", type: "event", description: "Weekly yoga sessions", date: "2024-01-15", category: "Wellness" },
  { id: "2", name: "Gym Membership Info", type: "resource", description: "Access to building gym", date: "2024-01-10", category: "Wellness" },
  { id: "3", name: "Wellness Tips", type: "content", description: "Health and wellness articles", date: "2024-01-20", category: "Wellness" },
  { id: "4", name: "Health Guidelines", type: "document", description: "Building health policies", date: "2024-01-05", category: "Wellness" },
  { id: "5", name: "Happy Hour", type: "event", description: "Monthly social gathering", date: "2024-01-25", category: "Social" },
  { id: "6", name: "Community Room", type: "resource", description: "Bookable community space", date: "2024-01-12", category: "Social" },
  { id: "7", name: "Conference Room A", type: "resource", description: "Professional meeting space", date: "2024-01-18", category: "Professional" },
  { id: "8", name: "Networking Tips", type: "content", description: "Professional networking guide", date: "2024-01-22", category: "Professional" },
  { id: "9", name: "Food Truck Schedule", type: "document", description: "Weekly food truck calendar", date: "2024-01-30", category: "Food" },
  { id: "10", name: "Recycling Guide", type: "document", description: "Building recycling instructions", date: "2024-01-08", category: "Environmental" },
  // Services
  { id: "11", name: "CleanCo", type: "service", description: "Dry cleaning pickup & delivery", date: "2024-01-12", category: "Personal", logo: "cleanco" },
  { id: "12", name: "PetPals", type: "service", description: "Dog walking & pet sitting", date: "2024-01-14", category: "Personal", logo: "petpals" },
  { id: "13", name: "ZenSpa", type: "service", description: "In-home massage therapy", date: "2024-01-16", category: "Wellness", logo: "zenspa" },
  { id: "14", name: "FitPro", type: "service", description: "Personal training sessions", date: "2024-01-18", category: "Wellness", logo: "fitpro" },
  { id: "15", name: "FreshCart", type: "service", description: "Grocery delivery service", date: "2024-01-20", category: "Convenience", logo: "freshcart" },
  { id: "16", name: "FixIt Pro", type: "service", description: "Home repair & maintenance", date: "2024-01-22", category: "Home", logo: "fixitpro" },
  { id: "17", name: "MealPrep+", type: "service", description: "Healthy meal preparation", date: "2024-01-24", category: "Food", logo: "mealprep" },
  { id: "18", name: "AutoShine", type: "service", description: "Mobile car detailing", date: "2024-01-26", category: "Automotive", logo: "autoshine" },
]

const collectionTypes = [
  "Health & Wellness",
  "Social & Community", 
  "Professional",
  "Environmental",
  "Food & Beverage",
  "Technology",
  "Entertainment",
  "Education",
  "Other"
]

const availableTags = [
  "Popular", "New", "Seasonal", "Premium", "Featured", "Limited Time", 
  "Beginner Friendly", "Advanced", "Free", "Paid", "Indoor", "Outdoor"
]

export default function CreateCollectionPage() {
  const searchParams = useSearchParams()
  const [collectionName, setCollectionName] = useState("")
  const [collectionType, setCollectionType] = useState("")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContent, setSelectedContent] = useState<any[]>([])
  const [contentFilter, setContentFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("custom")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [showRuleBuilder, setShowRuleBuilder] = useState(false)
  const [rules, setRules] = useState<any[]>([])
  const [newRule, setNewRule] = useState({
    contentType: "",
    attribute: "",
    value: ""
  })

  // Demo data for Wellness collection
  const wellnessDemoData = {
    name: "Wellness",
    type: "Health & Wellness",
    tags: ["Popular", "Featured", "Beginner Friendly"],
    description: "Health and wellness resources for tenants including yoga classes, gym membership info, massage therapy events, and wellness tips.",
    icon: "🧘",
    selectedContent: [
      { id: "1", name: "Yoga Classes", type: "event", description: "Weekly yoga sessions", date: "2024-01-15", category: "Wellness" },
      { id: "2", name: "Gym Membership Info", type: "resource", description: "Access to building gym", date: "2024-01-10", category: "Wellness" },
      { id: "3", name: "Wellness Tips", type: "content", description: "Health and wellness articles", date: "2024-01-20", category: "Wellness" },
      { id: "4", name: "Health Guidelines", type: "document", description: "Building health policies", date: "2024-01-05", category: "Wellness" }
    ]
  }

  // Check for demo parameter and pre-fill form
  useEffect(() => {
    const demo = searchParams.get('demo')
    const template = searchParams.get('template')
    
    if (demo === 'wellness') {
      setCollectionName(wellnessDemoData.name)
      setCollectionType(wellnessDemoData.type)
      setDescription(wellnessDemoData.description)
      setSelectedIcon(wellnessDemoData.icon)
      setSelectedContent(wellnessDemoData.selectedContent)
    } else if (template) {
      // Handle template parameters
      const name = searchParams.get('name')
      const type = searchParams.get('type')
      const description = searchParams.get('description')
      const icon = searchParams.get('icon')
      const items = searchParams.get('items')
      
      if (name) setCollectionName(name)
      if (type) setCollectionType(type)
      if (description) setDescription(description)
      if (icon) setSelectedIcon(icon)
      if (items) {
        try {
          const parsedItems = JSON.parse(items)
          // Convert template items to the format expected by selectedContent
          const contentItems = parsedItems.map((item: any, index: number) => ({
            id: `template-${index}`,
            name: item.name,
            type: item.type,
            description: item.description,
            date: new Date().toISOString().split('T')[0],
            category: type?.split(' ')[0] || 'General'
          }))
          setSelectedContent(contentItems)
        } catch (error) {
          console.error('Error parsing template items:', error)
        }
      }
    }
  }, [searchParams])

  const iconOptions = ["🧘", "🎉", "💼", "🌱", "🍽️", "💻", "🎵", "📚", "⭐"]

  const filteredAvailableContent = mockAvailableContent.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = contentFilter === "all" || item.type === contentFilter
    const notSelected = !selectedContent.find(selected => selected.id === item.id)
    
    return matchesSearch && matchesFilter && notSelected
  })



  const handleAddContent = (content: any) => {
    setSelectedContent(prev => [...prev, content])
  }

  const handleRemoveContent = (contentId: string) => {
    setSelectedContent(prev => prev.filter(item => item.id !== contentId))
  }

  const handleSortContent = (type: string) => {
    let sortedContent = [...selectedContent]
    
    switch (type) {
      case "alpha":
        sortedContent.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "newest":
        sortedContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "type":
        sortedContent.sort((a, b) => a.type.localeCompare(b.type))
        break
    }
    
    setSelectedContent(sortedContent)
    setSortOrder(type)
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'event': return <Calendar className="h-4 w-4" />
      case 'resource': return <MapPin className="h-4 w-4" />
      case 'content': return <FileText className="h-4 w-4" />
      case 'document': return <FileText className="h-4 w-4" />
      case 'service': return <Users className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getServiceLogo = (logoId: string) => {
    switch (logoId) {
      case 'cleanco':
        return (
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <circle cx="20" cy="20" r="18" fill="#3B82F6" />
            <path d="M12 20c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8-8-3.6-8-8z" fill="white" />
            <circle cx="20" cy="20" r="4" fill="#3B82F6" />
          </svg>
        )
      case 'petpals':
        return (
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <rect x="2" y="2" width="36" height="36" rx="8" fill="#10B981" />
            <circle cx="16" cy="16" r="3" fill="white" />
            <circle cx="24" cy="16" r="3" fill="white" />
            <path d="M14 24c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        )
      case 'zenspa':
        return (
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <circle cx="20" cy="20" r="18" fill="#8B5CF6" />
            <path d="M20 8c-6.6 0-12 5.4-12 12s5.4 12 12 12 12-5.4 12-12S26.6 8 20 8zm0 20c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" fill="white" />
            <circle cx="20" cy="20" r="3" fill="white" />
          </svg>
        )
      case 'fitpro':
        return (
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <rect x="2" y="2" width="36" height="36" rx="6" fill="#F97316" />
            <path d="M12 20h4v-4h8v4h4v8h-4v4h-8v-4h-4v-8z" fill="white" />
          </svg>
        )
      case 'freshcart':
        return (
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <circle cx="20" cy="20" r="18" fill="#EF4444" />
            <rect x="12" y="14" width="16" height="12" rx="2" fill="white" />
            <circle cx="16" cy="30" r="2" fill="white" />
            <circle cx="24" cy="30" r="2" fill="white" />
            <path d="M10 10h4l2 4h14l-2 8H14l-2-4H10" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        )
      case 'fixitpro':
        return (
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <rect x="2" y="2" width="36" height="36" rx="8" fill="#EAB308" />
            <path d="M16 12l8 8-8 8-4-4 4-4-4-4 4-4z" fill="white" />
            <circle cx="24" cy="16" r="2" fill="white" />
          </svg>
        )
      case 'mealprep':
        return (
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <circle cx="20" cy="20" r="18" fill="#14B8A6" />
            <rect x="12" y="14" width="16" height="12" rx="2" fill="white" />
            <circle cx="16" cy="18" r="1" fill="#14B8A6" />
            <circle cx="20" cy="18" r="1" fill="#14B8A6" />
            <circle cx="24" cy="18" r="1" fill="#14B8A6" />
            <path d="M14 22h12" stroke="#14B8A6" strokeWidth="1" />
          </svg>
        )
      case 'autoshine':
        return (
          <svg viewBox="0 0 40 40" className="h-6 w-6">
            <rect x="2" y="2" width="36" height="36" rx="6" fill="#6366F1" />
            <path d="M10 20c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z" fill="white" />
            <rect x="12" y="16" width="16" height="8" rx="4" fill="#6366F1" />
            <circle cx="16" cy="26" r="2" fill="white" />
            <circle cx="24" cy="26" r="2" fill="white" />
          </svg>
        )
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const handleAddRule = () => {
    if (newRule.contentType && newRule.attribute && newRule.value) {
      setRules(prev => [...prev, { ...newRule }])
      setNewRule({ contentType: "", attribute: "", value: "" })
      setShowRuleBuilder(false)
    }
  }

  const handleRemoveRule = (index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index))
  }

  const handleSaveCollection = () => {
    // Here you would typically save to your backend
    console.log({
      name: collectionName,
      type: collectionType,
      description,
      icon: selectedIcon,
      content: selectedContent,
      rules,
      sortOrder
    })
    // Navigate back to collections page
    window.location.href = "/experience/collections"
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ExperienceSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumbs */}
        <div className="px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/experience/collections" className="text-blue-600 hover:text-blue-800">
              Collections
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {searchParams.get('demo') === 'wellness' || searchParams.get('template') ? 'Edit collection' : 'Create collection'}
            </span>
          </nav>
        </div>

        {/* Header */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {searchParams.get('demo') === 'wellness' || searchParams.get('template') ? 'Edit collection' : 'Create collection'}
              </h1>
              <p className="text-muted-foreground mt-1">Group resources, events, content, and documents for your tenants</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/experience/collections">Cancel</Link>
              </Button>
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    disabled={!collectionName || selectedContent.length === 0}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md mx-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Smartphone className="h-5 w-5" />
                      Mobile App Preview
                    </DialogTitle>
                  </DialogHeader>
                  
                  {/* Mobile App Preview */}
                  <div className="bg-black rounded-2xl p-1 mx-auto" style={{ width: '320px', height: '600px' }}>
                    {/* Phone Status Bar */}
                    <div className="flex justify-between items-center text-xs font-medium text-white px-4 py-2">
                      <span>9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-white rounded-sm"></div>
                        <div className="w-6 h-3 border border-white rounded-sm">
                          <div className="w-4 h-2 bg-white rounded-sm m-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="bg-gradient-to-b from-gray-200 to-gray-300 rounded-xl h-full px-4 py-4 overflow-hidden">
                      {/* Header with notification */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h1 className="text-xl font-semibold text-gray-900">Good afternoon, Chase</h1>
                          <p className="text-sm text-gray-600">Welcome to PENN 1</p>
                        </div>
                        <div className="relative">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <div className="w-4 h-4 bg-gray-400 rounded"></div>
                          </div>
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">12</span>
                          </div>
                        </div>
                      </div>

                      {/* Building Image Placeholder */}
                      <div className="w-20 h-20 bg-gray-300 rounded-lg mx-auto mb-6 flex items-center justify-center">
                        <div className="w-8 h-8 bg-gray-400 rounded"></div>
                      </div>

                      {/* Service Categories */}
                      <div className="space-y-3 overflow-y-auto max-h-80">
                        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <div className="w-4 h-4 bg-gray-600 rounded"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Business Services</h3>
                              <p className="text-sm text-gray-600">Meeting rooms, IT support, printing & more</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <Users className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Personal Services</h3>
                              <p className="text-sm text-gray-600">Dry cleaning, errands, tech support & more</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Health & Wellness</h3>
                              <p className="text-sm text-gray-600">Fitness classes, massage, meditation & more</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <div className="w-4 h-4 bg-gray-600 rounded"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Convenience Services</h3>
                              <p className="text-sm text-gray-600">Package lockers, EV charging, food delivery & more</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <div className="w-4 h-4 bg-gray-600 rounded"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Building Services</h3>
                              <p className="text-sm text-gray-600">HVAC, lighting, maintenance & more</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Food & Beverage</h3>
                              <p className="text-sm text-gray-600">Catering, coffee service, meal delivery & more</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <div className="w-4 h-4 bg-purple-600 rounded"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Events & Programming</h3>
                              <p className="text-sm text-gray-600">Holiday parties, networking, workshops & more</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>

                        <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <div className="w-4 h-4 bg-green-600 rounded"></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">Mobility & Transportation</h3>
                              <p className="text-sm text-gray-600">Parking, shuttles, bike services & more</p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Search Input */}
                      <div className="mt-4 bg-white rounded-full px-4 py-3 flex items-center">
                        <input 
                          type="text" 
                          placeholder="How can I help you today?" 
                          className="flex-1 text-sm text-gray-600 bg-transparent outline-none"
                          readOnly
                        />
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center ml-2">
                          <div className="w-4 h-4 bg-white rounded transform rotate-45"></div>
                        </div>
                      </div>

                      {/* Bottom Navigation */}
                      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-xl px-4 py-2">
                        <div className="flex justify-around">
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-6 h-6 bg-blue-500 rounded"></div>
                            <span className="text-xs text-blue-500">Home</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-6 h-6 bg-gray-300 rounded"></div>
                            <span className="text-xs text-gray-500">Explore</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-6 h-6 bg-gray-300 rounded relative">
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <span className="text-xs text-gray-500">Inbox</span>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-6 h-6 bg-gray-300 rounded"></div>
                            <span className="text-xs text-gray-500">Account</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveCollection}
                disabled={!collectionName || !collectionType || selectedContent.length === 0}
              >
                {searchParams.get('demo') === 'wellness' || searchParams.get('template') ? 'Save changes' : 'Create collection'}
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Collection Details - Full Width */}
            <Card>
              <CardHeader className="pb-6">
                <CardTitle className="text-lg font-semibold">Collection details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Single Row: Name (25%), Type (25%), Icon (25%), Image (25%) */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Name - 25% */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Collection name</Label>
                      <Input
                        id="name"
                        placeholder="Enter collection name"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                      />
                    </div>

                    {/* Type - 25% */}
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select value={collectionType} onValueChange={setCollectionType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select collection type" />
                        </SelectTrigger>
                        <SelectContent>
                          {collectionTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Icon - 25% */}
                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <Select value={selectedIcon} onValueChange={setSelectedIcon}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an icon">
                            {selectedIcon && (
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{selectedIcon}</span>
                                <span className="text-sm text-muted-foreground">Selected</span>
                              </div>
                            )}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{icon}</span>
                                <span className="text-sm text-muted-foreground">Icon</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Image - 25% */}
                    <div className="space-y-2">
                      <Label htmlFor="image">Image</Label>
                      <Button variant="outline" className="w-full justify-start">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload image
                      </Button>
                    </div>
                  </div>

                  {/* Description - Full Width */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe this collection..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Selection - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                             {/* Add Content */}
               <Card className="lg:col-span-2">
                 <CardHeader className="pb-4">
                   <div className="flex items-center justify-between w-full">
                     <CardTitle className="text-lg font-semibold flex-shrink-0">Add</CardTitle>
                     <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                       <div className="relative">
                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                         <Input
                           placeholder="Search"
                           className="pl-9 h-10 w-48"
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                         />
                       </div>
                       <Select value={contentFilter} onValueChange={setContentFilter}>
                         <SelectTrigger className="w-[140px] h-10">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent>
                           <SelectItem value="all">All types</SelectItem>
                           <SelectItem value="content">Content</SelectItem>
                           <SelectItem value="document">Documents</SelectItem>
                           <SelectItem value="event">Events</SelectItem>
                           <SelectItem value="resource">Resources</SelectItem>
                           <SelectItem value="service">Services</SelectItem>
                         </SelectContent>
                       </Select>
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent className="pt-0">
                   <div className="space-y-6">
                     {/* Services Carousel */}
                     <div>
                       <h3 className="text-sm font-semibold text-gray-900 mb-3">Services</h3>
                       <div className="flex gap-3 overflow-x-auto pb-2">
                         {mockAvailableContent.filter(item => item.type === 'service' && (contentFilter === 'all' || contentFilter === 'service') && (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) && !selectedContent.find(selected => selected.id === item.id)).map((item) => (
                           <div
                             key={item.id}
                             className="flex-shrink-0 w-32 h-32 p-3 border rounded-lg hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                             onClick={() => handleAddContent(item)}
                           >
                             <div className="flex flex-col h-full">
                               <div className="flex items-center justify-center h-8 w-8 rounded mb-2">
                                 {item.logo ? getServiceLogo(item.logo) : getContentIcon(item.type)}
                               </div>
                               <div className="flex-1">
                                 <div className="font-medium text-xs truncate mb-1">{item.name}</div>
                                 <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* Content Carousel */}
                     <div>
                       <h3 className="text-sm font-semibold text-gray-900 mb-3">Content</h3>
                       <div className="flex gap-3 overflow-x-auto pb-2">
                         {mockAvailableContent.filter(item => item.type === 'content' && (contentFilter === 'all' || contentFilter === 'content') && (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) && !selectedContent.find(selected => selected.id === item.id)).map((item) => (
                           <div
                             key={item.id}
                             className="flex-shrink-0 w-32 h-32 p-3 border rounded-lg hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                             onClick={() => handleAddContent(item)}
                           >
                             <div className="flex flex-col h-full">
                               <div className="flex items-center justify-center h-8 w-8 rounded bg-gray-100 mb-2">
                                 {getContentIcon(item.type)}
                               </div>
                               <div className="flex-1">
                                 <div className="font-medium text-xs truncate mb-1">{item.name}</div>
                                 <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* Documents Carousel */}
                     <div>
                       <h3 className="text-sm font-semibold text-gray-900 mb-3">Documents</h3>
                       <div className="flex gap-3 overflow-x-auto pb-2">
                         {mockAvailableContent.filter(item => item.type === 'document' && (contentFilter === 'all' || contentFilter === 'document') && (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) && !selectedContent.find(selected => selected.id === item.id)).map((item) => (
                           <div
                             key={item.id}
                             className="flex-shrink-0 w-32 h-32 p-3 border rounded-lg hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                             onClick={() => handleAddContent(item)}
                           >
                             <div className="flex flex-col h-full">
                               <div className="flex items-center justify-center h-8 w-8 rounded bg-gray-100 mb-2">
                                 {getContentIcon(item.type)}
                               </div>
                               <div className="flex-1">
                                 <div className="font-medium text-xs truncate mb-1">{item.name}</div>
                                 <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* Events Carousel */}
                     <div>
                       <h3 className="text-sm font-semibold text-gray-900 mb-3">Events</h3>
                       <div className="flex gap-3 overflow-x-auto pb-2">
                         {mockAvailableContent.filter(item => item.type === 'event' && (contentFilter === 'all' || contentFilter === 'event') && (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) && !selectedContent.find(selected => selected.id === item.id)).map((item) => (
                           <div
                             key={item.id}
                             className="flex-shrink-0 w-32 h-32 p-3 border rounded-lg hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                             onClick={() => handleAddContent(item)}
                           >
                             <div className="flex flex-col h-full">
                               <div className="flex items-center justify-center h-8 w-8 rounded bg-gray-100 mb-2">
                                 {getContentIcon(item.type)}
                               </div>
                               <div className="flex-1">
                                 <div className="font-medium text-xs truncate mb-1">{item.name}</div>
                                 <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>

                     {/* Resources Carousel */}
                     <div>
                       <h3 className="text-sm font-semibold text-gray-900 mb-3">Resources</h3>
                       <div className="flex gap-3 overflow-x-auto pb-2">
                         {mockAvailableContent.filter(item => item.type === 'resource' && (contentFilter === 'all' || contentFilter === 'resource') && (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase())) && !selectedContent.find(selected => selected.id === item.id)).map((item) => (
                           <div
                             key={item.id}
                             className="flex-shrink-0 w-32 h-32 p-3 border rounded-lg hover:border-primary/50 hover:bg-accent/50 cursor-pointer transition-all duration-200 hover:shadow-sm"
                             onClick={() => handleAddContent(item)}
                           >
                             <div className="flex flex-col h-full">
                               <div className="flex items-center justify-center h-8 w-8 rounded bg-gray-100 mb-2">
                                 {getContentIcon(item.type)}
                               </div>
                               <div className="flex-1">
                                 <div className="font-medium text-xs truncate mb-1">{item.name}</div>
                                 <div className="text-xs text-gray-500 line-clamp-2">{item.description}</div>
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>


                   </div>
                 </CardContent>
               </Card>

                             {/* Selected Content */}
               <Card>
                 <CardHeader className="pb-4">
                   <div className="flex flex-col space-y-4">
                     <div className="flex items-center justify-between">
                       <CardTitle className="text-lg font-semibold">
                         Selected ({selectedContent.length + rules.length})
                       </CardTitle>
                       <div className="flex items-center gap-2">
                         <Select value={sortOrder} onValueChange={setSortOrder}>
                           <SelectTrigger className="w-[120px] h-8">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="custom">Custom</SelectItem>
                             <SelectItem value="alpha">A-Z</SelectItem>
                             <SelectItem value="newest">Newest</SelectItem>
                             <SelectItem value="type">By type</SelectItem>
                           </SelectContent>
                         </Select>
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleSortContent(sortOrder)}
                           disabled={sortOrder === "custom"}
                           className="h-8 px-2"
                         >
                           <ArrowUpDown className="h-3 w-3" />
                         </Button>
                       </div>
                     </div>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => setShowRuleBuilder(true)}
                       className="w-full h-8 text-xs"
                     >
                       <Plus className="h-3 w-3 mr-1" />
                       Add rule
                     </Button>
                   </div>
                 </CardHeader>
                                 <CardContent className="pt-0">
                   {selectedContent.length === 0 && rules.length === 0 ? (
                     <div className="text-center py-12 text-muted-foreground">
                       <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                       <p className="font-medium">No content selected yet</p>
                       <p className="text-sm text-muted-foreground/70">Add content from the left or create rules</p>
                     </div>
                   ) : (
                     <div className="space-y-3 max-h-96 overflow-y-auto">
                       {/* Rules */}
                       {rules.map((rule, index) => (
                         <div
                           key={`rule-${index}`}
                           className="flex items-center space-x-3 p-4 bg-blue-50/50 rounded-lg border-2 border-dashed border-blue-200"
                         >
                           <div className="flex items-center justify-center h-8 w-8 rounded bg-blue-100">
                             <Zap className="h-4 w-4 text-blue-600" />
                           </div>
                           <div className="flex-1">
                             <div className="font-medium text-sm text-blue-900">
                               All {rule.contentType}s with {rule.attribute} "{rule.value}"
                             </div>
                             <div className="text-xs text-blue-600">Dynamic rule • Updates automatically</div>
                           </div>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => handleRemoveRule(index)}
                             className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                           >
                             <X className="h-4 w-4" />
                           </Button>
                         </div>
                       ))}

                       {/* Selected Content */}
                       {selectedContent.map((item, index) => (
                         <div
                           key={item.id}
                           className="flex items-center space-x-3 p-4 bg-accent/30 rounded-lg border"
                         >
                           {sortOrder === "custom" && (
                             <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                           )}
                           <div className="flex items-center justify-center h-8 w-8 rounded bg-white">
                             {item.type === 'service' && item.logo ? getServiceLogo(item.logo) : getContentIcon(item.type)}
                           </div>
                           <div className="flex-1">
                             <div className="font-medium text-sm">{item.name}</div>
                             <div className="text-xs text-gray-500">{item.type} • {item.category}</div>
                           </div>
                           <Button
                             variant="ghost"
                             size="sm"
                             onClick={() => handleRemoveContent(item.id)}
                           >
                             <X className="h-4 w-4" />
                           </Button>
                         </div>
                       ))}
                     </div>
                   )}
                 </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Rule Builder Dialog */}
      <Dialog open={showRuleBuilder} onOpenChange={setShowRuleBuilder}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a dynamic rule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Rules automatically include content that matches your criteria. They update dynamically as new content is added.
            </div>
            
            <div className="space-y-4">
              {/* Content Type */}
              <div className="space-y-2">
                <Label>Content type</Label>
                <Select value={newRule.contentType} onValueChange={(value) => setNewRule(prev => ({ ...prev, contentType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resource">Resource</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="content">Content</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Attribute */}
              <div className="space-y-2">
                <Label>Attribute</Label>
                <Select value={newRule.attribute} onValueChange={(value) => setNewRule(prev => ({ ...prev, attribute: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select attribute" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">category</SelectItem>
                    <SelectItem value="type">type</SelectItem>
                    <SelectItem value="tag">tag</SelectItem>
                    <SelectItem value="location">location</SelectItem>
                    <SelectItem value="status">status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Value */}
              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  placeholder="Enter value (e.g., gym, wellness, fitness)"
                  value={newRule.value}
                  onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>

              {/* Preview */}
              {newRule.contentType && newRule.attribute && newRule.value && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-sm font-medium text-blue-900">Preview:</div>
                  <div className="text-sm text-blue-700">
                    All {newRule.contentType}s with {newRule.attribute} "{newRule.value}"
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowRuleBuilder(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddRule}
                disabled={!newRule.contentType || !newRule.attribute || !newRule.value}
              >
                Add rule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 