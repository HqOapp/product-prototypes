"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Users, Building2, Calendar, Clock, Download, User } from "lucide-react"
import { AddTourModal } from "@/components/tours/add-tour-modal"
import { Sidebar } from "@/components/sidebar"
import Link from "next/link"

const tourTypes = [
  { value: "all", label: "All Tour Types" },
  { value: "prospective-tenant", label: "Prospective Tenant" },
  { value: "client-visit", label: "Client Visit" },
  { value: "broker-showing", label: "Broker Showing" },
  { value: "building-tour", label: "Building Tour" },
  { value: "space-inspection", label: "Space Inspection" },
  { value: "maintenance", label: "Maintenance" },
  { value: "other", label: "Other" },
]

const tourStatuses = [
  { value: "all", label: "All Statuses" },
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no-show", label: "No Show" },
]

const buildings = [
  { value: "all", label: "All Buildings" },
  { value: "cobblestone", label: "Cobblestone Collaborative" },
  { value: "metro-tower", label: "Metro Tower" },
  { value: "innovation-hub", label: "Innovation Hub" },
  { value: "bay-area-data", label: "Bay Area Data Center" },
  { value: "sunset-apartments", label: "Sunset Apartments" },
  { value: "industrial-park", label: "Industrial Park West" },
]

// Mock tours data
const mockTours = [
  {
    tour_id: "tour-001",
    company_name: "TechFlow Solutions",
    contact_name: "Sarah Johnson",
    contact_email: "sarah.johnson@techflow.com",
    contact_phone: "(555) 123-4567",
    tour_type: "prospective-tenant",
    building: "Cobblestone Collaborative",
    buildingId: "cobblestone",
    spaces_viewing: ["Suite 801", "Suite 802"],
    scheduled_date: "2024-02-15",
    scheduled_time: "10:00 AM",
    duration: 60,
    tour_guide: "Michael Chen",
    status: "scheduled",
    requirements: "Looking for 15,000 RSF for tech startup",
    notes: "Interested in flexible lease terms and modern amenities",
    created_at: "2024-02-01T10:00:00Z",
    image: "/placeholder.svg?height=40&width=40"
  },
  {
    tour_id: "tour-002",
    company_name: "Global Finance Corp",
    contact_name: "David Rodriguez",
    contact_email: "d.rodriguez@globalfinance.com",
    contact_phone: "(555) 234-5678",
    tour_type: "broker-showing",
    building: "Metro Tower",
    buildingId: "metro-tower",
    spaces_viewing: ["Floor 12", "Floor 13"],
    scheduled_date: "2024-02-16",
    scheduled_time: "2:00 PM",
    duration: 90,
    tour_guide: "Jennifer Lee",
    status: "completed",
    requirements: "Executive offices, 25,000 RSF minimum",
    notes: "Very interested, requesting proposal",
    created_at: "2024-01-28T14:00:00Z",
    image: "/placeholder.svg?height=40&width=40"
  },
  {
    tour_id: "tour-003",
    company_name: "Creative Studios Inc",
    contact_name: "Lisa Wang",
    contact_email: "lisa@creativestudios.com",
    contact_phone: "(555) 345-6789",
    tour_type: "prospective-tenant",
    building: "Innovation Hub",
    buildingId: "innovation-hub",
    spaces_viewing: ["Studio A", "Studio B"],
    scheduled_date: "2024-02-17",
    scheduled_time: "11:30 AM",
    duration: 45,
    tour_guide: "Amanda Foster",
    status: "scheduled",
    requirements: "Creative space with high ceilings",
    notes: "First-time visitor, needs basic building overview",
    created_at: "2024-02-05T09:30:00Z",
    image: "/placeholder.svg?height=40&width=40"
  },
  {
    tour_id: "tour-004",
    company_name: "MedTech Innovations",
    contact_name: "Dr. Robert Kim",
    contact_email: "r.kim@medtech.com",
    contact_phone: "(555) 456-7890",
    tour_type: "space-inspection",
    building: "Bay Area Data Center",
    buildingId: "bay-area-data",
    spaces_viewing: ["Lab Space 1", "Clean Room"],
    scheduled_date: "2024-02-14",
    scheduled_time: "9:00 AM",
    duration: 120,
    tour_guide: "Mark Thompson",
    status: "in-progress",
    requirements: "Specialized lab facilities with clean room access",
    notes: "Current tenant expanding operations",
    created_at: "2024-02-10T16:00:00Z",
    image: "/placeholder.svg?height=40&width=40"
  },
  {
    tour_id: "tour-005",
    company_name: "Retail Partners LLC",
    contact_name: "Emma Davis",
    contact_email: "emma@retailpartners.com",
    contact_phone: "(555) 567-8901",
    tour_type: "client-visit",
    building: "Sunset Apartments",
    buildingId: "sunset-apartments",
    spaces_viewing: ["Ground Floor Retail"],
    scheduled_date: "2024-02-13",
    scheduled_time: "3:30 PM",
    duration: 60,
    tour_guide: "Sarah Chen",
    status: "completed",
    requirements: "Street-level retail with high foot traffic",
    notes: "Signed LOI after tour",
    created_at: "2024-02-08T11:00:00Z",
    image: "/placeholder.svg?height=40&width=40"
  }
]

export default function ToursPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedBuilding, setSelectedBuilding] = useState("all")
  const [activeTab, setActiveTab] = useState("scheduled")
  const [isAddTourModalOpen, setIsAddTourModalOpen] = useState(false)

  const filteredTours = mockTours.filter((tour) => {
    const matchesSearch =
      tour.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.spaces_viewing.some(space => space.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = selectedType === "all" || tour.tour_type === selectedType
    const matchesStatus = selectedStatus === "all" || tour.status === selectedStatus
    const matchesBuilding = selectedBuilding === "all" || tour.buildingId === selectedBuilding

    const matchesTab = 
      activeTab === "scheduled" ? tour.status === "scheduled" :
      activeTab === "completed" ? tour.status === "completed" :
      activeTab === "all" ? true : tour.status === activeTab

    return matchesSearch && matchesType && matchesStatus && matchesBuilding && matchesTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800">• Scheduled</Badge>
      case "in-progress":
        return <Badge className="bg-orange-100 text-orange-800">• In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800">• Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">• Cancelled</Badge>
      case "no-show":
        return <Badge className="bg-gray-100 text-gray-800">• No Show</Badge>
      default:
        return <Badge variant="secondary">• {status}</Badge>
    }
  }

  const getTourTypeBadge = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      "prospective-tenant": "Prospective Tenant",
      "client-visit": "Client Visit",
      "broker-showing": "Broker Showing",
      "building-tour": "Building Tour",
      "space-inspection": "Space Inspection",
      "maintenance": "Maintenance",
      "other": "Other",
    }
    return <Badge variant="outline">{typeLabels[type] || type}</Badge>
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return "N/A"
    return timeString
  }

  const handleTourCreated = (tourData: any) => {
    // Handle the new tour data - this would typically involve API calls
    console.log("New tour created:", tourData)
    setIsAddTourModalOpen(false)
    // In a real app, you would refresh the tours list or add the new tour to state
  }

  // Calculate summary statistics
  const totalTours = mockTours.length
  const scheduledTours = mockTours.filter(t => t.status === "scheduled").length
  const completedTours = mockTours.filter(t => t.status === "completed").length
  const inProgressTours = mockTours.filter(t => t.status === "in-progress").length

  const tabs = [
    { id: "scheduled", label: "Scheduled", count: scheduledTours },
    { id: "completed", label: "Completed", count: completedTours },
    { id: "all", label: "All Tours", count: totalTours },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tours</h1>
              <p className="text-gray-600">Manage and schedule building tours for prospective tenants</p>
            </div>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsAddTourModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Schedule tour
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Total Tours</p>
                    <p className="text-2xl font-bold">{totalTours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Scheduled</p>
                    <p className="text-2xl font-bold">{scheduledTours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Completed</p>
                    <p className="text-2xl font-bold">{completedTours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">In Progress</p>
                    <p className="text-2xl font-bold">{inProgressTours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="h-auto p-0 bg-transparent">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-4 py-3"
                  >
                    {tab.label}
                    <Badge variant="secondary" className="ml-2 text-xs">{tab.count}</Badge>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search tours..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All buildings" />
              </SelectTrigger>
              <SelectContent>
                {buildings.map((building) => (
                  <SelectItem key={building.value} value={building.value}>
                    {building.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All tour types" />
              </SelectTrigger>
              <SelectContent>
                {tourTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                {tourStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Tours Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-left font-medium text-gray-500">Company</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Contact</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Type</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Building & Spaces</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Date & Time</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Duration</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Tour Guide</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTours.map((tour) => (
                    <TableRow key={tour.tour_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="py-4">
                        <Link href={`/tours/${tour.tour_id}`} className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={tour.image || "/placeholder.svg"} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                              {tour.company_name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{tour.company_name}</div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="py-4">
                        <div>
                          <div className="text-gray-900 text-sm">{tour.contact_name}</div>
                          <div className="text-sm text-gray-500">{tour.contact_phone}</div>
                          <div className="text-sm text-gray-500">{tour.contact_email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getTourTypeBadge(tour.tour_type)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div>
                          <div className="text-gray-900">{tour.building}</div>
                          <div className="text-sm text-gray-500">{tour.spaces_viewing.join(", ")}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div>
                          <div className="text-gray-900">{formatDate(tour.scheduled_date)}</div>
                          <div className="text-sm text-gray-500">{formatTime(tour.scheduled_time)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-gray-900">{tour.duration} min</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-gray-900">{tour.tour_guide}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(tour.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Summary */}
          <div className="text-sm text-gray-500">
            Showing {filteredTours.length} of {mockTours.length} tours
          </div>
        </div>
      </div>

      {/* Add Tour Modal */}
      <AddTourModal
        isOpen={isAddTourModalOpen}
        onClose={() => setIsAddTourModalOpen(false)}
        onTourCreated={handleTourCreated}
      />
    </div>
  )
}