"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Download, ChevronDown, Calendar, Package, MapPin, Users, X, Star, TrendingUp, Info, Building2, FileText, CalendarDays, Settings, UtensilsCrossed, CreditCard, GraduationCap, Wrench } from "lucide-react"
import Link from "next/link"

const mockProducts = [
  {
    id: "1",
    name: "Conference Room A",
    description: "Modern conference room with video conferencing capabilities",
    type: "Space",
    status: "active",
    price: "Free",
    rating: 4.8,
    reviews: 156,
    lastUpdated: "2 hours ago",
    features: [
      { type: "feature", name: "Video Conferencing" },
      { type: "feature", name: "Whiteboard" },
      { type: "feature", name: "Projector" },
      { type: "feature", name: "WiFi" },
    ],
    totalFeatures: 12,
    imageUrl: "/placeholder.jpg",
    vendor: null,
  },
  {
    id: "2",
    name: "Office Supplies Kit",
    description: "Essential office supplies for daily work needs",
    type: "Resource",
    status: "active",
    price: "$25",
    rating: 4.6,
    reviews: 89,
    lastUpdated: "1 day ago",
    features: [
      { type: "feature", name: "Pens & Pencils" },
      { type: "feature", name: "Notebooks" },
      { type: "feature", name: "Sticky Notes" },
      { type: "feature", name: "Paper Clips" },
    ],
    totalFeatures: 8,
    imageUrl: "/placeholder.jpg",
    vendor: "Office Supply Co",
  },
  {
    id: "3",
    name: "Monthly Networking Event",
    description: "Professional networking event for building connections",
    type: "Event",
    status: "draft",
    price: "Free",
    rating: 4.9,
    reviews: 234,
    lastUpdated: "3 days ago",
    features: [
      { type: "feature", name: "Guest Speakers" },
      { type: "feature", name: "Catering" },
      { type: "feature", name: "Business Cards" },
      { type: "feature", name: "Door Prizes" },
    ],
    totalFeatures: 15,
    imageUrl: "/placeholder.jpg",
    vendor: null,
  },
  {
    id: "4",
    name: "IT Support Service",
    description: "24/7 technical support for all your IT needs",
    type: "Service",
    status: "active",
    price: "$150/month",
    rating: 4.7,
    reviews: 67,
    lastUpdated: "1 week ago",
    features: [
      { type: "feature", name: "24/7 Support" },
      { type: "feature", name: "Remote Access" },
      { type: "feature", name: "Hardware Repair" },
      { type: "feature", name: "Software Updates" },
    ],
    totalFeatures: 6,
    imageUrl: "/placeholder.jpg",
    vendor: "TechSupport Pro",
  },
  {
    id: "5",
    name: "Daily Lunch Delivery",
    description: "Fresh, healthy meals delivered daily to your office",
    type: "Food and Beverage",
    status: "active",
    price: "$12/meal",
    rating: 4.5,
    reviews: 123,
    lastUpdated: "5 days ago",
    features: [
      { type: "feature", name: "Healthy Options" },
      { type: "feature", name: "Dietary Restrictions" },
      { type: "feature", name: "Fresh Ingredients" },
      { type: "feature", name: "Quick Delivery" },
    ],
    totalFeatures: 10,
    imageUrl: "/placeholder.jpg",
    vendor: "Fresh Eats Co",
  },
  {
    id: "6",
    name: "Gym Membership",
    description: "Full access to building fitness center and classes",
    type: "Membership",
    status: "active",
    price: "$50/month",
    rating: 4.4,
    reviews: 89,
    lastUpdated: "2 days ago",
    features: [
      { type: "feature", name: "24/7 Access" },
      { type: "feature", name: "Personal Trainers" },
      { type: "feature", name: "Group Classes" },
      { type: "feature", name: "Modern Equipment" },
    ],
    totalFeatures: 7,
    imageUrl: "/placeholder.jpg",
    vendor: null,
  },
  {
    id: "7",
    name: "Excel Fundamentals Workshop",
    description: "Learn essential Excel skills for business productivity",
    type: "Class",
    status: "active",
    price: "Free",
    rating: 4.8,
    reviews: 45,
    lastUpdated: "1 day ago",
    features: [
      { type: "feature", name: "Beginner Friendly" },
      { type: "feature", name: "Hands-on Practice" },
      { type: "feature", name: "Certificate" },
      { type: "feature", name: "Take-home Materials" },
    ],
    totalFeatures: 5,
    imageUrl: "/placeholder.jpg",
    vendor: "Learning Hub",
  },
]

// Templates removed; replaced by onboarding flow


export default function ProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isOnboardOpen, setIsOnboardOpen] = useState(false)
  const [isCreateProductOpen, setIsCreateProductOpen] = useState(false)
  const [selectedProductType, setSelectedProductType] = useState("")
  const [selectedSubtype, setSelectedSubtype] = useState("")
  const [onboardStep, setOnboardStep] = useState(1)
  const [selectedOnboardTypes, setSelectedOnboardTypes] = useState<string[]>([])
  const [typeCounts, setTypeCounts] = useState<Record<string, number>>({})

  const productTypes = [
    {
      id: "space",
      name: "Space",
      description: "A bookable room or area (e.g., conference room, event hall, lab).",
      icon: Building2,
      color: "bg-blue-50 border-blue-200 text-blue-900"
    },
    {
      id: "service",
      name: "Service",
      description: "A fulfillable service (e.g., catering, cleaning, IT setup, AV support).",
      icon: Settings,
      color: "bg-orange-50 border-orange-200 text-orange-900"
    },
    {
      id: "amenity",
      name: "Amenity",
      description: "Access-based benefits or passes (e.g., gym, lounge, rooftop).",
      icon: MapPin,
      color: "bg-indigo-50 border-indigo-200 text-indigo-900"
    },
    {
      id: "event-program",
      name: "Event / Program",
      description: "A scheduled session with registrations (e.g., yoga class, networking night).",
      icon: CalendarDays,
      color: "bg-purple-50 border-purple-200 text-purple-900"
    },
    {
      id: "vendor-bundle",
      name: "Vendor Bundle",
      description: "A packaged combination of space and/or services fulfilled by vendors.",
      icon: Package,
      color: "bg-green-50 border-green-200 text-green-900"
    },
    {
      id: "other",
      name: "Other",
      description: "Offerings that don't fit into standard categories",
      icon: Wrench,
      color: "bg-gray-50 border-gray-200 text-gray-900"
    }
  ]

  const handleProductTypeSelect = (typeId: string) => {
    setSelectedProductType(typeId)
    setSelectedSubtype("")
  }

  const handleSubtypeSelect = (subtypeId: string) => {
    setSelectedSubtype(subtypeId)
  }

  const toggleOnboardType = (typeId: string) => {
    setSelectedOnboardTypes(prev =>
      prev.includes(typeId) ? prev.filter(id => id !== typeId) : [...prev, typeId]
    )
  }

  const setCount = (typeId: string, value: string) => {
    const num = Math.max(0, parseInt(value || "0", 10) || 0)
    setTypeCounts(prev => ({ ...prev, [typeId]: num }))
  }

  const subtypeOptions: Record<string, { id: string; name: string; description: string }[]> = {
    "space": [
      { id: "conference-room", name: "Conference Room", description: "Bookable meeting room; time-slot inventory." },
      { id: "team-room", name: "Team Room", description: "Larger collaboration room; time-slot inventory." },
      { id: "private-office-suite", name: "Private Office / Suite", description: "Dedicated workspace; day or month inventory." },
      { id: "event-space-hall", name: "Event Space / Hall", description: "Large venue; single booking blocks." },
      { id: "specialty-wet-lab", name: "Specialty: Wet Lab", description: "Lab space with safety pre-reqs; hourly/day inventory." },
      { id: "specialty-podcast-studio", name: "Specialty: Podcast Studio", description: "Media studio with equipment; hourly inventory." },
      { id: "specialty-kitchen-maker", name: "Specialty: Kitchen / Maker Space", description: "Special-use room; hourly/day inventory." },
      { id: "retail-unit", name: "Retail Unit", description: "Tenantable retail space; day/month inventory." },
      { id: "hot-desk-flex", name: "Hot Desk / Flex", description: "Shared desk capacity; session/hour inventory." },
      { id: "custom", name: "Custom", description: "Define your own space subtype." },
    ],
    "service": [
      { id: "catering-meeting", name: "Catering — Meeting Package", description: "Food & beverage for meetings; order-based capacity." },
      { id: "catering-premium", name: "Catering — Premium", description: "Upgraded menu & staffing; order-based capacity." },
      { id: "cleaning-maintenance", name: "Cleaning / Maintenance", description: "Facilities jobs; job-slot capacity." },
      { id: "it-setup-workstation", name: "IT Setup / Workstation", description: "Device/desk setup; job-slot capacity." },
      { id: "av-support", name: "AV Support", description: "Onsite technician & gear; job-slot capacity." },
      { id: "security", name: "Security", description: "Event or building coverage; job-slot capacity." },
      { id: "move-in-relocation", name: "Move-in / Relocation", description: "Turnkey move services; job-slot capacity." },
      { id: "lifestyle-wellness-concierge", name: "Lifestyle / Wellness / Concierge", description: "Tenant experience services; job-slot capacity." },
      { id: "custom", name: "Custom", description: "Define your own service subtype." },
    ],
    "amenity": [
      { id: "gym-membership", name: "Gym Membership", description: "Recurring access; membership inventory." },
      { id: "lounge-day-pass", name: "Lounge Day Pass", description: "Single-day access; daily pass capacity." },
      { id: "rooftop-access-seasonal", name: "Rooftop Access (Seasonal)", description: "Seasonal access; pass capacity." },
      { id: "wellness-room-access", name: "Wellness Room Access", description: "Bookable wellness space; session/pass." },
      { id: "locker-access", name: "Locker Access", description: "Storage access; pass capacity." },
      { id: "parking-ev", name: "Parking / EV Charging", description: "Parking or charging access; pass/session." },
      { id: "custom", name: "Custom", description: "Define your own amenity subtype." },
    ],
    "event-program": [
      { id: "one-time-event", name: "One-time Event", description: "Single session; ticket inventory." },
      { id: "recurring-program", name: "Recurring Program", description: "Multi-session series; per-session tickets." },
      { id: "workshop-training", name: "Workshop / Training", description: "Instructor-led session; ticket inventory." },
      { id: "fitness-class", name: "Fitness Class", description: "Class with capacity; ticket inventory." },
      { id: "networking-event", name: "Networking Event", description: "Community event; ticket inventory." },
      { id: "seasonal-activation", name: "Seasonal Activation", description: "Limited-run activation; ticket inventory." },
      { id: "custom", name: "Custom", description: "Define your own event subtype." },
    ],
    "vendor-bundle": [
      { id: "move-in-package", name: "Move-In Package (Furniture + IT + AV)", description: "Turnkey setup; bundle capacity = lowest component." },
      { id: "pop-up-retail-marketing", name: "Pop-Up Retail + Marketing", description: "Space + promo services; bundle capacity applies." },
      { id: "event-hall-catering-av", name: "Event Hall + Catering + AV", description: "Pre-packaged event bundle; bundle capacity applies." },
      { id: "amenity-service-package", name: "Amenity + Service Package", description: "Access plus services; bundle capacity applies." },
      { id: "space-vendor-service", name: "Space + Vendor Service", description: "Room with pre-attached service; bundle capacity applies." },
      { id: "custom", name: "Custom", description: "Define your own bundle subtype." },
    ],
    "other": [
      { id: "custom", name: "Custom", description: "Define your own subtype." },
    ],
  }

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || product.status === statusFilter
    const matchesType = typeFilter === "all" || product.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }



  return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Offerings</h1>
            <div className="flex items-center space-x-3">
              <Dialog open={isOnboardOpen} onOpenChange={(open) => { setIsOnboardOpen(open); if (!open) { setOnboardStep(1); setSelectedOnboardTypes([]); setTypeCounts({}) } }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" onClick={() => setIsOnboardOpen(true)}>
                    Onboard
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Set up your building</DialogTitle>
                    <p className="text-muted-foreground">Tell us what types of offerings you have and how many. We’ll help you create them faster.</p>
                  </DialogHeader>

                  {onboardStep === 1 && (
                    <div className="mt-4">
                      <h3 className="text-md font-medium mb-4">Which types of offerings do you have?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {productTypes.map((type) => (
                          <Card key={type.id} className={`cursor-pointer border-2 ${selectedOnboardTypes.includes(type.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => toggleOnboardType(type.id)}>
                            <CardContent className="p-4 flex items-center gap-3">
                              <Checkbox checked={selectedOnboardTypes.includes(type.id)} onCheckedChange={() => toggleOnboardType(type.id)} />
                              <div className="flex items-center gap-2">
                                <type.icon className="w-5 h-5 text-gray-600" />
                                <span className="font-medium">{type.name}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsOnboardOpen(false)}>Cancel</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setOnboardStep(2)} disabled={selectedOnboardTypes.length === 0}>Continue</Button>
                      </div>
                    </div>
                  )}

                  {onboardStep === 2 && (
                    <div className="mt-4">
                      <h3 className="text-md font-medium mb-4">How many of each do you have?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedOnboardTypes.map((typeId) => {
                          const t = productTypes.find(pt => pt.id === typeId)!
                          return (
                            <div key={typeId}>
                              <label className="text-sm text-gray-700">{t.name}</label>
                              <Input type="number" className="mt-1" placeholder="0" value={(typeCounts[typeId] ?? 0).toString()} onChange={(e) => setCount(typeId, e.target.value)} />
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-6 flex justify-between">
                        <Button variant="outline" onClick={() => setOnboardStep(1)}>Back</Button>
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsOnboardOpen(false)}>Skip</Button>
                          <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setOnboardStep(3)}>Continue</Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {onboardStep === 3 && (
                    <div className="mt-4">
                      <h3 className="text-md font-medium mb-4">Summary</h3>
                      <div className="space-y-2">
                        {selectedOnboardTypes.map((typeId) => {
                          const t = productTypes.find(pt => pt.id === typeId)!
                          return (
                            <div key={typeId} className="flex justify-between border rounded-md p-3">
                              <span className="font-medium">{t.name}</span>
                              <span className="text-gray-700">{typeCounts[typeId] ?? 0}</span>
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-6 flex justify-between">
                        <Button variant="outline" onClick={() => setOnboardStep(2)}>Back</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsOnboardOpen(false)}>Finish onboarding</Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsCreateProductOpen(true)}
              >
                Create offering
              </Button>
            </div>
          </div>

          <AlertBanner 
            title="About Offerings" 
            description="Offerings are anything you provide to tenants—like spaces, services, events, or classes—that can be booked, purchased, or accessed. Use this section to create and manage offerings that drive engagement, unlock value, or generate revenue." 
          />

          {/* Search and Filters */}
          <div className="hidden flex items-center space-x-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or description"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">• Active</SelectItem>
                <SelectItem value="draft">• Draft</SelectItem>
                <SelectItem value="inactive">• Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="Space">Space</SelectItem>
                <SelectItem value="Resource">Resource</SelectItem>
                <SelectItem value="Event">Event</SelectItem>
                <SelectItem value="Service">Service</SelectItem>
                <SelectItem value="Food and Beverage">Food and Beverage</SelectItem>
                <SelectItem value="Membership">Membership</SelectItem>
                <SelectItem value="Class">Class</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Title and Filters on Background */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">All offerings ({filteredProducts.length})</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by offering name"
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="Space">Space</SelectItem>
                      <SelectItem value="Resource">Resource</SelectItem>
                      <SelectItem value="Event">Event</SelectItem>
                      <SelectItem value="Service">Service</SelectItem>
                      <SelectItem value="Food and Beverage">Food and Beverage</SelectItem>
                      <SelectItem value="Membership">Membership</SelectItem>
                      <SelectItem value="Class">Class</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
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
                      <TableHead className="text-left font-medium text-gray-500">Offering</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Type</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Price</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Rating</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Vendor</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Last updated</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Status</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/experience/offerings/${product.id}`)}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={product.imageUrl} alt={product.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {product.name.split(' ').map(word => word[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="text-xs px-3 py-1 rounded-md">
                        {product.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`font-semibold ${product.price === "Free" ? "text-green-600" : "text-gray-900"}`}>
                        {product.price}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-sm text-gray-500">({product.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      {product.vendor ? (
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-600">
                              {product.vendor.split(' ').map(word => word[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-600">{product.vendor}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-gray-900">{product.lastUpdated}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`${getStatusColor(product.status)} whitespace-nowrap`}>
                        • {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                              </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Offering Modal */}
        <Dialog open={isCreateProductOpen} onOpenChange={setIsCreateProductOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold">Create new offering</DialogTitle>
              <p className="text-muted-foreground mt-2">
                Choose the type of offering you want to create. This will help us customize the creation form for your specific needs.
              </p>
            </DialogHeader>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Select offering type</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {productTypes.map((type) => (
                  <Card 
                    key={type.id} 
                    className={`relative cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                      selectedProductType === type.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleProductTypeSelect(type.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 flex items-center justify-center">
                          <type.icon className="w-8 h-8 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{type.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                        </div>
                      </div>
                      {selectedProductType === type.id && (
                        <div className="absolute top-3 right-3">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedProductType && (
                <div className="mt-10">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Select subtype</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(subtypeOptions[selectedProductType] || []).map((sub) => (
                      <Card
                        key={sub.id}
                        className={`relative cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                          selectedSubtype === sub.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleSubtypeSelect(sub.id)}
                      >
                        <CardContent className="p-5">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-gray-900">{sub.name}</h4>
                            <p className="text-sm text-gray-600">{sub.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedProductType("")
                        setSelectedSubtype("")
                        setIsCreateProductOpen(false)
                      }}
                    >
                      Cancel
                    </Button>
                    <Link href={`/experience/offerings/create?type=${selectedProductType}${selectedSubtype ? `&subtype=${selectedSubtype}` : ''}`}>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        disabled={!selectedSubtype}
                        onClick={() => {
                          setIsCreateProductOpen(false)
                          setSelectedProductType("")
                          setSelectedSubtype("")
                        }}
                      >
                        Continue{selectedSubtype ? ` with ${subtypeOptions[selectedProductType]?.find(s => s.id === selectedSubtype)?.name}` : ''}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
  )
}