"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Filter, Users, Building2, DollarSign, Calendar, LayoutGrid, TableIcon, CalendarIcon, MoreHorizontal, GripVertical, Download } from "lucide-react"
import Link from "next/link"

const tenantTypes = [
  { value: "all", label: "All Tenant Types" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "legal", label: "Legal" },
  { value: "consulting", label: "Consulting" },
  { value: "marketing", label: "Marketing" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "other", label: "Other" },
]

const leaseStatuses = [
  { value: "all", label: "All Lease Statuses" },
  { value: "active", label: "Active" },
  { value: "expiring-soon", label: "Expiring Soon" },
  { value: "expired", label: "Expired" },
  { value: "pending", label: "Pending" },
  { value: "terminated", label: "Terminated" },
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

// Opportunity stages from admin tenant settings
const opportunityStages = [
  {
    id: "pre-lease",
    name: "Pre-Lease",
    color: "blue"
  },
  {
    id: "negotiation", 
    name: "Negotiation",
    color: "purple"
  },
  {
    id: "sign-off",
    name: "Sign Off", 
    color: "orange"
  },
  {
    id: "fit-out",
    name: "Fit Out",
    color: "green"
  }
]

// Import tenant data from leasesData
import { getTenants } from "@/lib/leasesData"

// Get real tenant data
const mockTenants = getTenants().map(tenant => ({
  ...tenant,
  // Add any additional fields needed for the UI
  isOpportunity: false,
  // Map fields to match UI expectations
  name: tenant.tenant_name || tenant.name,
  image: tenant.logo_url || tenant.logo || "/placeholder.svg?height=40&width=40",
  contactName: tenant.primary_contact_name || tenant.contactName,
  contactEmail: tenant.primary_contact_email || tenant.contactEmail,
  contactPhone: tenant.primary_contact_phone || tenant.contactPhone,
  }));

// Example opportunity tenants
const opportunityTenants = [
  {
    tenant_id: "opportunity-1",
    tenant_name: "Quantum Analytics",
    industry: "finance",
    building: "Metro Tower",
    buildingId: "metro-tower",
    suite: "Suite 1205",
    floor: "Floor 12",
    rsf: 8500,
    leaseStart: "2023-03-01",
    leaseEnd: "2028-02-29",
    monthlyRent: 42500,
    annualRent: 510000,
    leaseStatus: "active",
    employeeCount: 45,
    primary_contact_name: "Michael Rodriguez",
    primary_contact_email: "m.rodriguez@quantumanalytics.com",
    primary_contact_phone: "(555) 234-5678",
    logo_url: "/placeholder.svg?height=40&width=40",
    daysUntilExpiry: 1460,
    isOpportunity: true,
    stage: "negotiation"
  }
];

// Enhanced opportunity tenants with stages
const opportunityList = [
  {
    id: "7",
    name: "GreenTech Renewal",
    industry: "technology",
    building: "Eco Building",
    buildingId: "eco-building",
    suite: "TBD",
    floor: "TBD",
    rsf: 12000,
    leaseStart: "",
    leaseEnd: "",
    monthlyRent: 0,
    annualRent: 420000,
    leaseStatus: "opportunity",
    employeeCount: 50,
    contactName: "GreenTech Innovations",
    contactEmail: "contact@greentech.com",
    contactPhone: "(555) 789-0123",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
    daysUntilExpiry: 0,
    isOpportunity: true,
    stage: "pre-lease",
    competition: "Low Competition",
    targetClose: "2/29/2024"
  },
  {
    id: "8",
    name: "EcoVolt Multi-Location Expansion",
    industry: "technology", 
    building: "Cobblestone Collaborative",
    buildingId: "cobblestone",
    suite: "TBD",
    floor: "TBD",
    rsf: 27475,
    leaseStart: "",
    leaseEnd: "",
    monthlyRent: 0,
    annualRent: 1250000,
    leaseStatus: "opportunity",
    employeeCount: 85,
    contactName: "EcoVolt Energy Solutions",
    contactEmail: "expansion@ecovolt.com",
    contactPhone: "(555) 890-1234",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
    daysUntilExpiry: 0,
    isOpportunity: true,
    stage: "negotiation",
    competition: "Competition",
    targetClose: "2/14/2024"
  },
  {
    id: "9",
    name: "TechFlow HQ Consolidation",
    industry: "technology",
    building: "Innovation Tower", 
    buildingId: "innovation-tower",
    suite: "TBD",
    floor: "TBD",
    rsf: 18200,
    leaseStart: "",
    leaseEnd: "",
    monthlyRent: 0,
    annualRent: 650000,
    leaseStatus: "opportunity",
    employeeCount: 75,
    contactName: "TechFlow Solutions",
    contactEmail: "hq@techflow.com",
    contactPhone: "(555) 901-2345",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    daysUntilExpiry: 0,
    isOpportunity: true,
    stage: "sign-off",
    competition: "High Competition",
    targetClose: "1/27/2024"
  }
];

// Add DataCore Systems to opportunity list
opportunityList.push({
  id: "10",
  name: "DataCore Systems Expansion",
  industry: "technology",
  building: "Metro Business Center",
  buildingId: "metro-business",
  suite: "TBD", 
  floor: "TBD",
  rsf: 25000,
  leaseStart: "",
  leaseEnd: "",
  monthlyRent: 0,
  annualRent: 825000,
  leaseStatus: "opportunity",
  employeeCount: 100,
  contactName: "DataCore Systems",
  contactEmail: "expansion@datacore.com",
  contactPhone: "(555) 012-3456",
  image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop",
  daysUntilExpiry: 0,
  isOpportunity: true,
  stage: "fit-out",
  competition: "Legal Review",
  targetClose: "1/24/2024"
});

const allTenants = [...mockTenants, ...opportunityList];

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedBuilding, setSelectedBuilding] = useState("all")
  const [activeTab, setActiveTab] = useState("active")
  const [opportunityView, setOpportunityView] = useState("stages") // New state for opportunity view
  const [tenants, setTenants] = useState(mockTenants) // State for managing tenant data

  const filteredTenants = tenants.filter((tenant) => {
    const matchesSearch =
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.suite.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "all" || tenant.industry === selectedType
    const matchesStatus = selectedStatus === "all" || tenant.leaseStatus === selectedStatus
    const matchesBuilding = selectedBuilding === "all" || tenant.buildingId === selectedBuilding

    const matchesTab = activeTab === "active" ? !tenant.isOpportunity : tenant.isOpportunity

    return matchesSearch && matchesType && matchesStatus && matchesBuilding && matchesTab
  })

  // Get opportunities by stage for Kanban view
  const getOpportunitiesByStage = (stageId: string) => {
    return filteredTenants.filter(tenant => tenant.stage === stageId)
  }

  // Handle drag and drop
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result

    // If dropped outside a droppable area
    if (!destination) {
      return
    }

    // If dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return
    }

    // Update tenant stage
    const newTenants = tenants.map(tenant => {
      if (tenant.id === draggableId) {
        return {
          ...tenant,
          stage: destination.droppableId
        }
      }
      return tenant
    })

    setTenants(newTenants)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">• Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">• Inactive</Badge>
      case "pending":
        return <Badge className="bg-blue-100 text-blue-800">• Pending</Badge>
      case "expired":
        return <Badge className="bg-red-100 text-red-800">• Expired</Badge>
      case "expiring-soon":
        return <Badge className="bg-orange-100 text-orange-800">• Expiring Soon</Badge>
      case "opportunity":
        return <Badge className="bg-purple-100 text-purple-800">• Opportunity</Badge>
      default:
        return <Badge variant="secondary">• {status}</Badge>
    }
  }

  const getIndustryBadge = (industry: string) => {
    const industryLabels: { [key: string]: string } = {
      technology: "Technology",
      finance: "Finance",
      healthcare: "Healthcare",
      legal: "Legal",
      consulting: "Consulting",
      marketing: "Marketing",
      manufacturing: "Manufacturing",
      retail: "Retail",
      other: "Other",
    }
    return <Badge variant="outline">{industryLabels[industry] || industry}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "TBD"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Calculate summary statistics
  const activeTenants = mockTenants.filter(t => !t.isOpportunity)
  const opportunityTenants = mockTenants.filter(t => t.isOpportunity)
  
  const totalRSF = activeTenants.reduce((sum, tenant) => sum + tenant.rsf, 0)
  const totalAnnualRent = activeTenants.reduce((sum, tenant) => sum + tenant.annualRent, 0)
  const expiringTenants = activeTenants.filter((tenant) => tenant.leaseStatus === "expiring-soon").length

  const tabs = [
    { id: "active", label: "Active", count: activeTenants.length },
    { id: "opportunities", label: "Opportunities", count: opportunityTenants.length },
  ]

  // Kanban Card Component
  const OpportunityCard = ({ tenant, index }: { tenant: any, index: number }) => (
    <Draggable draggableId={tenant.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-3 ${snapshot.isDragging ? 'rotate-3 shadow-lg' : ''}`}
        >
          <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div 
                  {...provided.dragHandleProps}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              
              <h3 className="font-semibold text-sm mb-2 text-gray-900">{tenant.name}</h3>
              <p className="text-xs text-gray-600 mb-3">{tenant.contactName}</p>
              
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Building2 className="h-3 w-3" />
                  <span>{tenant.building}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium">{formatNumber(tenant.rsf)} SF</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-3 w-3" />
                  <span>{tenant.employeeCount} employees</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-xs">
                  <div className="font-semibold text-gray-900 mb-1">{formatCurrency(tenant.annualRent)}</div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{tenant.targetClose}</span>
                  </div>
                </div>
              </div>

              {tenant.competition && (
                <div className="mt-3">
                  <Badge 
                    variant={tenant.competition === "High Competition" ? "destructive" : 
                           tenant.competition === "Competition" ? "secondary" : 
                           "outline"}
                    className="text-xs"
                  >
                    {tenant.competition}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Tenants</h1>
            <div className="flex items-center space-x-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Add tenant
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Tenants</p>
                      <p className="text-2xl font-bold">{activeTenants.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Leased RSF</p>
                      <p className="text-2xl font-bold">{formatNumber(totalRSF)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Annual Rent</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalAnnualRent)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                      <p className="text-2xl font-bold">{expiringTenants}</p>
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

            {/* Content based on active tab */}
            {activeTab === "active" && (
              <div className="mt-8">
                {/* Data Table with White Background */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Active tenants ({filteredTenants.length})</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search tenants..."
                          className="pl-9 w-64"
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
                          <SelectValue placeholder="All industries" />
                        </SelectTrigger>
                        <SelectContent>
                          {tenantTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="All lease statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          {leaseStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
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
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-gray-200">
                          <TableHead className="text-left font-medium text-gray-500">Tenant</TableHead>
                          <TableHead className="text-left font-medium text-gray-500">Industry</TableHead>
                          <TableHead className="text-left font-medium text-gray-500">Building & Suite</TableHead>
                          <TableHead className="text-left font-medium text-gray-500">RSF</TableHead>
                          <TableHead className="text-left font-medium text-gray-500">Lease Period</TableHead>
                          <TableHead className="text-left font-medium text-gray-500">$/SF</TableHead>
                          <TableHead className="text-left font-medium text-gray-500">Employees</TableHead>
                          <TableHead className="text-left font-medium text-gray-500">Contact</TableHead>
                          <TableHead className="text-left font-medium text-gray-500">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTenants.map((tenant) => (
                          <TableRow key={tenant.tenant_id} className="border-b border-gray-100 hover:bg-gray-50">
                            <TableCell className="py-4">
                              <Link href={`/tenants/${tenant.tenant_id}`} className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={tenant.image || "/placeholder.svg"} />
                                  <AvatarFallback className="bg-green-100 text-green-700 font-medium">
                                    {tenant.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-gray-900">{tenant.name}</div>
                                </div>
                              </Link>
                            </TableCell>
                            <TableCell className="py-4">
                              {getIndustryBadge(tenant.industry)}
                            </TableCell>
                            <TableCell className="py-4">
                              <div>
                                <div className="text-gray-900">{tenant.building}</div>
                                <div className="text-sm text-gray-500">{tenant.suite}</div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <span className="text-gray-900">{formatNumber(tenant.rsf)}</span>
                            </TableCell>
                            <TableCell className="py-4">
                              <div>
                                <div className="text-gray-900">{formatDate(tenant.leaseStart)} - {formatDate(tenant.leaseEnd)}</div>
                                <div className="text-sm text-gray-500">
                                  {tenant.daysUntilExpiry > 365 
                                    ? `${Math.round(tenant.daysUntilExpiry / 365)} years left`
                                    : `${tenant.daysUntilExpiry} days left`
                                  }
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              <span className="text-gray-900">{formatCurrency((tenant.monthlyRent * 12) / tenant.rsf)}</span>
                            </TableCell>
                            <TableCell className="py-4">
                              <span className="text-gray-900">{tenant.employeeCount}</span>
                            </TableCell>
                            <TableCell className="py-4">
                              <div>
                                <div className="text-gray-900 text-sm">{tenant.contactName}</div>
                                <div className="text-sm text-gray-500">{tenant.contactPhone}</div>
                                <div className="text-sm text-gray-500">{tenant.contactEmail}</div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4">
                              {getStatusBadge(tenant.leaseStatus)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "opportunities" && (
              <>
                {/* Kanban Board */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Opportunities ({opportunityTenants.length})</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search opportunities..."
                          className="pl-9 w-64"
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
                          <SelectValue placeholder="All industries" />
                        </SelectTrigger>
                        <SelectContent>
                          {tenantTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Kanban Board */}
                <DragDropContext onDragEnd={handleDragEnd}>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {opportunityStages.map((stage) => (
                      <div key={stage.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">{stage.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {getOpportunitiesByStage(stage.id).length}
                          </Badge>
                        </div>
                        
                        <Droppable droppableId={stage.id}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`min-h-[400px] p-3 rounded-lg border-2 border-dashed transition-colors ${
                                snapshot.isDraggingOver 
                                  ? 'bg-blue-50 border-blue-300' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="space-y-3">
                                {getOpportunitiesByStage(stage.id).map((tenant, index) => (
                                  <OpportunityCard key={tenant.id} tenant={tenant} index={index} />
                                ))}
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    ))}
                  </div>
                </DragDropContext>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
