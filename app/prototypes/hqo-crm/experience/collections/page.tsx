"use client"

import { useState } from "react"
// Sidebar is provided by app/experience/layout.tsx
import { Card, CardContent } from "@/components/ui/card"
import { AlertBanner } from "@/components/ui/alert-banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Download, ChevronDown, Calendar, FileText, MapPin, Users, X, Info, Heart, PartyPopper, Briefcase, Leaf, UtensilsCrossed, Laptop, Building2 } from "lucide-react"
import Link from "next/link"

const mockCollections = [
  {
    id: "1",
    name: "Wellness",
    description: "Health and wellness resources for tenants",
    type: "Health & Wellness",
    status: "active",
    itemCount: 12,
    lastUpdated: "2 hours ago",
    items: [
      { type: "event", name: "Yoga Classes" },
      { type: "resource", name: "Gym Membership" },
      { type: "content", name: "Wellness Tips" },
      { type: "document", name: "Health Guidelines" },
    ],
    totalItems: 12,
    icon: Heart,
  },
  {
    id: "2",
    name: "Community Events",
    description: "Building community and social activities",
    type: "Social & Community",
    status: "active",
    itemCount: 8,
    lastUpdated: "1 day ago",
    items: [
      { type: "event", name: "Happy Hour" },
      { type: "event", name: "Book Club" },
      { type: "resource", name: "Community Room" },
      { type: "content", name: "Event Calendar" },
    ],
    totalItems: 8,
    icon: PartyPopper,
  },
  {
    id: "3",
    name: "Professional Services",
    description: "Business and professional development resources",
    type: "Professional",
    status: "draft",
    itemCount: 15,
    lastUpdated: "3 days ago",
    items: [
      { type: "resource", name: "Conference Rooms" },
      { type: "content", name: "Networking Tips" },
      { type: "document", name: "Business Directory" },
      { type: "event", name: "Lunch & Learn" },
    ],
    totalItems: 15,
    icon: Briefcase,
  },
  {
    id: "4",
    name: "Sustainability",
    description: "Environmental and sustainability initiatives",
    type: "Environmental",
    status: "active",
    itemCount: 6,
    lastUpdated: "1 week ago",
    items: [
      { type: "content", name: "Green Living Tips" },
      { type: "event", name: "Earth Day Cleanup" },
      { type: "document", name: "Recycling Guide" },
      { type: "resource", name: "Bike Storage" },
    ],
    totalItems: 6,
    icon: Leaf,
  },
  {
    id: "5",
    name: "Food & Dining",
    description: "Culinary experiences and dining options",
    type: "Food & Beverage",
    status: "active",
    itemCount: 10,
    lastUpdated: "5 days ago",
    items: [
      { type: "event", name: "Food Truck Friday" },
      { type: "resource", name: "Kitchen Facilities" },
      { type: "content", name: "Local Restaurant Guide" },
      { type: "document", name: "Catering Menu" },
    ],
    totalItems: 10,
    icon: UtensilsCrossed,
  },
  {
    id: "6",
    name: "Technology & Innovation",
    description: "Tech resources and innovation initiatives",
    type: "Technology",
    status: "draft",
    itemCount: 4,
    lastUpdated: "2 weeks ago",
    items: [
      { type: "resource", name: "Innovation Lab" },
      { type: "content", name: "Tech Trends" },
      { type: "event", name: "Tech Meetup" },
      { type: "document", name: "WiFi Guidelines" },
    ],
    totalItems: 4,
    icon: Laptop,
  },
  {
    id: "7",
    name: "Services",
    description: "Comprehensive building and personal services for tenants",
    type: "Services",
    status: "active",
    itemCount: 24,
    lastUpdated: "1 hour ago",
    items: [
      { type: "service", name: "Business Services" },
      { type: "service", name: "Personal Services" },
      { type: "service", name: "Convenience Services" },
      { type: "service", name: "Building Services" },
    ],
    totalItems: 24,
    icon: Building2,
  },
]

const collectionTemplates = [
  {
    id: "wellness-template",
    name: "Wellness & Fitness",
    description: "Comprehensive health and wellness resources including fitness classes, mental health support, and healthy living tips for your tenants.",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    icon: Heart,
    type: "Health & Wellness",
    tags: ["Popular", "Featured", "Beginner Friendly"],
    items: [
      { type: "event", name: "Yoga Classes", description: "Weekly yoga sessions in the community room" },
      { type: "event", name: "Meditation Sessions", description: "Guided meditation every Tuesday and Thursday" },
      { type: "resource", name: "Gym Membership", description: "Access to building fitness center" },
      { type: "resource", name: "Mental Health Support", description: "Counseling services and resources" },
      { type: "content", name: "Wellness Tips", description: "Daily health and wellness articles" },
      { type: "content", name: "Healthy Recipes", description: "Nutritious meal ideas and cooking tips" },
      { type: "document", name: "Health Guidelines", description: "Building health and safety policies" },
      { type: "document", name: "Fitness Program Guide", description: "Complete guide to available fitness programs" }
    ]
  },
  {
    id: "community-template", 
    name: "Community & Social",
    description: "Foster connections and build community through social events, networking opportunities, and shared spaces.",
    image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
    icon: PartyPopper,
    type: "Social & Community",
    tags: ["Popular", "New", "Featured"],
    items: [
      { type: "event", name: "Happy Hour", description: "Monthly social gathering in the lobby" },
      { type: "event", name: "Book Club", description: "Weekly book discussions and literary events" },
      { type: "event", name: "Game Night", description: "Board games and video game tournaments" },
      { type: "resource", name: "Community Room", description: "Bookable space for private events" },
      { type: "resource", name: "Rooftop Terrace", description: "Outdoor space for gatherings and relaxation" },
      { type: "content", name: "Event Calendar", description: "Upcoming community events and activities" },
      { type: "content", name: "Neighbor Spotlight", description: "Get to know your fellow residents" },
      { type: "document", name: "Community Guidelines", description: "Rules and etiquette for shared spaces" }
    ]
  },
  {
    id: "professional-template",
    name: "Professional Services", 
    description: "Business and professional development resources to help tenants succeed in their careers and networking.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    icon: Briefcase,
    type: "Professional",
    tags: ["Premium", "Advanced"],
    items: [
      { type: "event", name: "Lunch & Learn", description: "Professional development workshops" },
      { type: "event", name: "Networking Mixer", description: "Connect with other professionals" },
      { type: "resource", name: "Conference Rooms", description: "Professional meeting spaces" },
      { type: "resource", name: "Business Center", description: "Printing, copying, and office supplies" },
      { type: "content", name: "Career Tips", description: "Professional development articles" },
      { type: "content", name: "Industry News", description: "Latest business and industry updates" },
      { type: "document", name: "Business Directory", description: "Directory of tenant businesses and services" },
      { type: "document", name: "Meeting Room Policies", description: "Guidelines for booking and using meeting spaces" }
    ]
  },
  {
    id: "sustainability-template",
    name: "Sustainability & Green Living",
    description: "Environmental initiatives and sustainable living resources to help create an eco-friendly community.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop", 
    icon: Leaf,
    type: "Environmental",
    tags: ["Seasonal", "Featured"],
    items: [
      { type: "event", name: "Earth Day Cleanup", description: "Community environmental cleanup event" },
      { type: "event", name: "Sustainability Workshop", description: "Learn about eco-friendly living practices" },
      { type: "resource", name: "Recycling Center", description: "Comprehensive recycling and composting" },
      { type: "resource", name: "Bike Storage", description: "Secure bicycle parking and maintenance" },
      { type: "content", name: "Green Living Tips", description: "Daily sustainability tips and tricks" },
      { type: "content", name: "Environmental News", description: "Latest environmental news and updates" },
      { type: "document", name: "Recycling Guide", description: "Complete guide to building recycling programs" },
      { type: "document", name: "Sustainability Report", description: "Building's environmental impact and goals" }
    ]
  },
  {
    id: "food-template",
    name: "Food & Dining",
    description: "Culinary experiences and dining options including food events, local restaurant guides, and cooking resources.",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
    icon: UtensilsCrossed, 
    type: "Food & Beverage",
    tags: ["Popular", "Limited Time"],
    items: [
      { type: "event", name: "Food Truck Friday", description: "Weekly food truck visits to the building" },
      { type: "event", name: "Cooking Classes", description: "Learn new culinary skills with neighbors" },
      { type: "resource", name: "Community Kitchen", description: "Shared cooking space with professional equipment" },
      { type: "resource", name: "Herb Garden", description: "Rooftop garden with fresh herbs and vegetables" },
      { type: "content", name: "Restaurant Guide", description: "Local dining recommendations and reviews" },
      { type: "content", name: "Recipe Collection", description: "Favorite recipes from residents" },
      { type: "document", name: "Catering Menu", description: "Approved caterers for building events" },
      { type: "document", name: "Kitchen Policies", description: "Guidelines for using shared kitchen spaces" }
    ]
  },
  {
    id: "tech-template",
    name: "Technology & Innovation",
    description: "Tech resources and innovation initiatives for the modern, connected community.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
    icon: Laptop,
    type: "Technology", 
    tags: ["New", "Advanced"],
    items: [
      { type: "event", name: "Tech Meetup", description: "Monthly technology networking and learning" },
      { type: "event", name: "Digital Literacy Workshop", description: "Learn new digital skills and tools" },
      { type: "resource", name: "Innovation Lab", description: "Collaborative workspace with tech tools" },
      { type: "resource", name: "High-Speed WiFi", description: "Building-wide fiber internet access" },
      { type: "content", name: "Tech Trends", description: "Latest technology news and innovations" },
      { type: "content", name: "Digital Security Tips", description: "Stay safe online with security best practices" },
      { type: "document", name: "WiFi Guidelines", description: "Network access and usage policies" },
      { type: "document", name: "Tech Support", description: "IT support resources and contact information" }
    ]
  }
]

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false)

  const filteredCollections = mockCollections.filter((collection) => {
    const matchesSearch =
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || collection.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return <Badge className="bg-green-100 text-green-800">• Active</Badge>
    }
    
    if (status === "draft") {
      return <Badge className="bg-gray-100 text-gray-800">• Draft</Badge>
    }
    
    return <Badge className="bg-blue-100 text-blue-800">• {status}</Badge>
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

  const renderCollectionItems = (items: any[], totalItems: number) => {
    const displayItems = items.slice(0, 3)
    const remaining = totalItems - 3

    const getItemIcon = (type: string) => {
      switch (type) {
        case 'event':
          return <Calendar className="h-3 w-3" />
        case 'resource':
          return <MapPin className="h-3 w-3" />
        case 'content':
          return <FileText className="h-3 w-3" />
        case 'document':
          return <FileText className="h-3 w-3" />
        default:
          return <FileText className="h-3 w-3" />
      }
    }

    return (
      <div className="flex items-center -space-x-1">
        {displayItems.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 border border-white text-gray-600"
            title={`${item.type}: ${item.name}`}
          >
            {getItemIcon(item.type)}
          </div>
        ))}
        {remaining > 0 && (
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 border border-white text-xs font-medium text-gray-600">
            +{remaining}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Collections</h1>
            <div className="flex items-center space-x-3">
              <Dialog open={isTemplatesOpen} onOpenChange={setIsTemplatesOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    Browse templates
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Collection Templates</DialogTitle>
                    <p className="text-muted-foreground">Choose from pre-built collection templates to get started quickly</p>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 gap-8 mt-8">
                    {collectionTemplates.map((template) => (
                      <div key={template.id} className="group bg-white border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-gray-300 hover:shadow-sm">
                        <div className="flex h-72">
                          {/* Image Section */}
                          <div className="w-1/3 relative bg-gradient-to-br from-gray-50 to-gray-100">
                            <img 
                              src={template.image} 
                              alt={template.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Content Section */}
                          <div className="w-2/3 p-6 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1 pr-4">
                                <h3 className="font-semibold text-xl text-gray-900 mb-2">{template.name}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                  {template.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {template.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <Button 
                                size="sm" 
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 whitespace-nowrap"
                                onClick={() => {
                                  const params = new URLSearchParams({
                                    template: template.id,
                                    name: template.name,
                                    type: template.type,
                                    description: template.description,
                                    icon: template.icon,
                                    tags: template.tags.join(','),
                                    items: JSON.stringify(template.items)
                                  })
                                  window.location.href = `/experience/collections/create?${params.toString()}`
                                }}
                              >
                                Add and edit
                              </Button>
                            </div>
                            
                            {/* Content Items Grid */}
                            <div className="flex-1 mt-2">
                              <div className="flex flex-wrap gap-2">
                                {template.items.slice(0, 3).map((item, index) => (
                                  <div key={index} className="flex items-center space-x-2 px-3 py-2 bg-gray-50/70 rounded-lg border border-gray-100 flex-shrink-0">
                                    <div className="flex items-center justify-center h-4 w-4 rounded bg-white shadow-sm">
                                      {getContentIcon(item.type)}
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                      <p className="font-medium text-xs text-gray-900 truncate max-w-24">{item.name}</p>
                                      <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                                    </div>
                                  </div>
                                ))}
                                {template.items.length > 3 && (
                                  <div className="flex items-center justify-center px-3 py-2 bg-gray-50/70 rounded-lg border border-gray-100 flex-shrink-0">
                                    <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                      +{template.items.length - 3} more
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link href="/experience/collections/create">Create collection</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Description Banner */}
        <div className="mx-6">
          <AlertBanner
            title="About Collections"
            description="Collections help you organize related offerings—like services, events, or spaces—into curated groups. Use them to highlight seasonal offerings, promote experiences, or tailor what's shown to specific tenants."
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Title and Filters on Background */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">All collections ({filteredCollections.length})</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by collection name"
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Data Table with White Background */}
            <Card>
              <CardContent className="p-0">
                {/* Table */}
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-left font-medium text-gray-500">Collection</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Type</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">
                        <div className="flex items-center">
                          Items
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-left font-medium text-gray-500">
                        <div className="flex items-center">
                          Last updated
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Status</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">
                        <div className="flex items-center">
                          Content preview
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                                      {filteredCollections.map((collection) => (
                    <TableRow 
                      key={collection.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        if (collection.name === "Wellness") {
                          window.location.href = "/experience/collections/create?demo=wellness"
                        }
                      }}
                    >
                      <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-100">
                              <collection.icon className="w-5 h-5 text-gray-700" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{collection.name}</div>
                              <div className="text-sm text-gray-500">{collection.description}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{collection.type}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-gray-900 font-medium">{collection.itemCount}</span>
                            <span className="text-gray-500 text-sm">items</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{collection.lastUpdated}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(collection.status)}
                        </TableCell>
                        <TableCell className="py-4">
                          {renderCollectionItems(collection.items, collection.totalItems)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
} 