"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InlineEdit, InlineImageEdit } from "@/components/ui/inline-edit"
import { FloatingNotePanel } from "@/components/ui/floating-note-panel"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Edit, 
  MapPin, 
  Award, 
  Building2, 
  Users, 
  DollarSign, 
  Calendar,
  Gauge,
  FileText,
  Settings,
  Activity,
  ChevronDown,
  Mail,
  Phone,
  Download,
  Eye,
  TrendingUp,
  Home
} from "lucide-react"
import Link from "next/link"
import { createHqoCrmRoute } from "@/lib/hqo-crm-routes"
import { mockBuildings } from "@/lib/mockData"
import { StackingPlanTab } from "./tabs/stacking-plan-tab"

const tabs = [
  { id: "overview", name: "Overview" },
  { id: "stacking-plan", name: "Stacking Plan" },
  { id: "space", name: "Space" },
  { id: "amenities", name: "Amenities" },
  { id: "tenants", name: "Tenants" },
  { id: "systems", name: "Systems" },
  { id: "financials", name: "Financials" },
  { id: "compliance", name: "Compliance & Documents" },
  { id: "activity", name: "Activity & Timeline" },
]

interface BuildingDetailProps {
  buildingId: string
}

// Placeholder tab component
function PlaceholderTab({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  )
}

// Building Overview Tab Component
function BuildingOverviewTab({ buildingData }: { buildingData: any }) {
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

  return (
    <div className="p-6 space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total RSF</p>
                <p className="text-2xl font-bold">{formatNumber(buildingData.square_foot)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Gauge className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                <p className="text-2xl font-bold">{buildingData.occupancy_rate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Rent Roll</p>
                <p className="text-2xl font-bold">{formatCurrency(buildingData.monthly_rent_roll)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">NOI</p>
                <p className="text-2xl font-bold">{formatCurrency(buildingData.noi)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Property Information */}
        <Card>
          <CardHeader>
            <CardTitle>Property Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Asset Type</p>
                <p className="text-gray-900">{buildingData.asset_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Building Class</p>
                <p className="text-gray-900">{buildingData.building_class}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Year Built</p>
                <p className="text-gray-900">{buildingData.year_built}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Floors</p>
                <p className="text-gray-900">{buildingData.floors}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Parking Spaces</p>
                <p className="text-gray-900">{buildingData.parking_spaces}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Elevators</p>
                <p className="text-gray-900">{buildingData.elevators}</p>
              </div>
            </div>
            
            {buildingData.leed_certification_level && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-gray-500 mb-2">Certifications</p>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    LEED Level {buildingData.leed_certification_level}
                  </Badge>
                  {buildingData.energy_rating && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {buildingData.energy_rating}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Annual Revenue</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(buildingData.revenue)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Annual Expenses</p>
                <p className="text-xl font-bold text-gray-900">{formatCurrency(buildingData.expenses)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Net Operating Income</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(buildingData.noi)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Building Score</p>
                <div className="flex items-center space-x-2">
                  <p className="text-xl font-bold text-gray-900">{buildingData.building_score}/100</p>
                  <Badge variant={buildingData.building_score >= 80 ? "default" : "secondary"}>
                    {buildingData.building_score >= 80 ? "Excellent" : "Good"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Management Information */}
        <Card>
          <CardHeader>
            <CardTitle>Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Management Company</p>
              <p className="text-gray-900">{buildingData.management_company}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Property Manager</p>
              <p className="text-gray-900">{buildingData.property_manager}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Owner</p>
              <p className="text-gray-900">{buildingData.owner_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Inspection</p>
              <p className="text-gray-900">{new Date(buildingData.last_inspection).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Systems Information */}
        <Card>
          <CardHeader>
            <CardTitle>Building Systems</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">HVAC System</p>
              <p className="text-gray-900">{buildingData.hvac_type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Security System</p>
              <p className="text-gray-900">{buildingData.security_system}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fire Safety</p>
              <p className="text-gray-900">{buildingData.fire_system}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Roof Type</p>
              <p className="text-gray-900">{buildingData.roof_type}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function BuildingDetail({ buildingId }: BuildingDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  
  // Find building data from mockBuildings
  const buildingData = mockBuildings.find(b => b.uuid === buildingId) || mockBuildings.find(b => b.name === "Cobblestone Collaborative")
  
  // State for editable building information
  const [buildingInfo, setBuildingInfo] = useState({
    name: buildingData?.name || "Unknown Building",
    image: (buildingData as any)?.primary_photo_url || `/placeholder.svg?height=64&width=64&text=${(buildingData?.name || "UB").substring(0, 2).toUpperCase()}`
  })

  // State for floating note panel
  const [isNotePanelOpen, setIsNotePanelOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<any>(null)

  // Mock contacts data for building management
  const mockContacts = [
    { id: "sarah-chen", name: "Sarah Chen", role: "Property Manager" },
    { id: "michael-torres", name: "Michael Torres", role: "Facilities Manager" },
    { id: "jennifer-kim", name: "Jennifer Kim", role: "Leasing Manager" }
  ]

  // If no building found, show error
  if (!buildingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Building not found</h2>
          <p className="text-gray-600">Building with ID "{buildingId}" does not exist.</p>
        </div>
      </div>
    )
  }

  const handleBuildingNameUpdate = (newName: string) => {
    setBuildingInfo(prev => ({
      ...prev,
      name: newName
    }))
    console.log('Updated building name:', newName)
  }
  
  // Update building data when building data changes
  useEffect(() => {
    if (buildingData) {
      setBuildingInfo({
        name: buildingData.name,
        image: (buildingData as any)?.primary_photo_url || `/placeholder.svg?height=64&width=64&text=${buildingData.name.substring(0, 2).toUpperCase()}`
      })
    }
  }, [buildingData])

  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file)
    setBuildingInfo(prev => ({
      ...prev,
      image: url
    }))
    console.log('Uploaded new building image:', file.name)
  }

  const handleSaveNote = (noteData: any) => {
    console.log('Saving note:', noteData)
    setEditingNote(null)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <BuildingOverviewTab buildingData={buildingData} />
      case "stacking-plan":
        return <StackingPlanTab buildingData={buildingData} />
      case "space":
        return <PlaceholderTab title="Space Management" description="Floor plans, available spaces, and space allocation coming soon." />
      case "amenities":
        return <PlaceholderTab title="Amenities" description="Building amenities and features coming soon." />
      case "tenants":
        return <PlaceholderTab title="Tenant Directory" description="Tenant information and lease details coming soon." />
      case "systems":
        return <PlaceholderTab title="Building Systems" description="HVAC, electrical, and mechanical systems coming soon." />
      case "financials":
        return <PlaceholderTab title="Financial Details" description="Detailed financial reports and analytics coming soon." />
      case "compliance":
        return <PlaceholderTab title="Compliance & Documents" description="Compliance reports and document management coming soon." />
      case "activity":
        return <PlaceholderTab title="Activity Timeline" description="Building activity and maintenance history coming soon." />
      default:
        return <BuildingOverviewTab buildingData={buildingData} />
    }
  }

  const getStatusBadge = (rate: number) => {
    if (rate >= 95) return <Badge className="bg-green-100 text-green-800">• Fully Leased</Badge>
    if (rate >= 85) return <Badge className="bg-blue-100 text-blue-800">• Well Occupied</Badge>
    if (rate >= 70) return <Badge className="bg-yellow-100 text-yellow-800">• Moderate Vacancy</Badge>
    return <Badge className="bg-red-100 text-red-800">• High Vacancy</Badge>
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4">
          <nav className="flex items-center text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link href={createHqoCrmRoute("/buildings")} className="hover:underline text-gray-500">Buildings</Link>
          </nav>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-start space-x-0">
              <div className="flex items-center space-x-3">
                <div className="h-16 w-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                  <InlineImageEdit
                    src={buildingInfo.image}
                    alt={`${buildingInfo.name} image`}
                    onUpload={handleImageUpload}
                    className="h-16 w-16 rounded-lg"
                    fallback={
                      <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {buildingInfo.name.split(' ').map(word => word[0]).join('').toUpperCase()}
                        </span>
                      </div>
                    }
                  />
                </div>

                <div>
                  <div className="mb-1">
                    <InlineEdit
                      value={buildingInfo.name}
                      onSave={handleBuildingNameUpdate}
                      placeholder="Enter building name..."
                      displayClassName="text-xl font-bold text-gray-900"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{buildingData.formatted_address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{buildingData.asset_type} • {buildingData.building_class}</span>
                    </div>
                    {getStatusBadge(buildingData.occupancy_rate)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsNotePanelOpen(true)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Add note
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Contact team
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    {mockContacts.map((contact) => (
                      <DropdownMenuItem key={contact.id} className="cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{contact.name}</div>
                              <div className="text-xs text-gray-500">{contact.role}</div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log(`Email ${contact.name}`)
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Building Detail Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">{renderTabContent()}</div>
      </div>

      {/* Floating Note Panel */}
      <FloatingNotePanel
        isOpen={isNotePanelOpen}
        onClose={() => {
          setIsNotePanelOpen(false)
          setEditingNote(null)
        }}
        onSave={handleSaveNote}
        editingNote={editingNote}
        contacts={mockContacts}
      />
    </div>
  )
}
