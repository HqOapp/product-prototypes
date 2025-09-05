"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, TrendingUp, Calendar, Bell, FileText, BarChart3, MapPin, Plus, X, Info, Key, Eye, DollarSign } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { PersonaSelector } from "@/components/persona-selector"
import { RegionSelector } from "@/components/region-selector"
import { usePersona } from "@/lib/providers/persona-provider"
import { ComingSoonView } from "@/components/coming-soon-view"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { useUser } from "@/lib/providers/user-provider"
import { ExecutiveDashboard } from "@/components/dashboard/executive-dashboard"
import { mockBuildings, mockLeases } from "@/lib/mockData"
import { piedmontBuildings, piedmontLeases } from "@/lib/piedmontBuildings"

interface FilterState {
  region: string
  building: string
}

interface RegionSelection {
  selectedRegions: Set<string>
  selectedCities: Set<string>
}

// Piedmont regions with nested cities
const piedmontRegions = {
  "Central Region": ["Dallas", "Minneapolis"],
  "Southeast": ["Atlanta", "Orlando"],
  "Northeast": ["New York", "Boston", "Arlington"]
}

export default function HomePage() {
  const { currentPersona } = usePersona()
  const { currentMode } = useCustomerMode()
  const { selectedUser } = useUser()
  
  // Extract first name from selected user
  const firstName = selectedUser.name.split(' ')[0]

  // Executive Dashboard State (only needed when persona is Executive)
  const [filters, setFilters] = useState<FilterState>({
    region: "all",
    building: "all"
  })

  // Region selection state - initialize with all regions selected for Piedmont mode
  const [regionSelection, setRegionSelection] = useState<RegionSelection>(() => {
    const allRegions = new Set<string>()
    const allCities = new Set<string>()
    
    if (currentMode.toLowerCase() === 'piedmont') {
      // Add all Piedmont regions and cities
      Object.entries(piedmontRegions).forEach(([region, cities]) => {
        allRegions.add(region)
        cities.forEach(city => allCities.add(city))
      })
    }
    
    return {
      selectedRegions: allRegions,
      selectedCities: allCities
    }
  })

  // Handle region selection change
  const handleRegionSelectionChange = useCallback((newSelection: RegionSelection) => {
    setRegionSelection(newSelection)
    
    // Convert region selection to filter value
    const totalCities = Object.values(piedmontRegions).flat().length
    let regionFilter = "all"
    
    if (newSelection.selectedCities.size === 0) {
      regionFilter = "all"
    } else if (newSelection.selectedCities.size === totalCities) {
      regionFilter = "all" // All regions selected
    } else {
      // Check if a complete region is selected
      const fullySelectedRegions = Object.keys(piedmontRegions).filter(region => {
        const cities = piedmontRegions[region as keyof typeof piedmontRegions] || []
        return cities.every(city => newSelection.selectedCities.has(city))
      })
      
      if (fullySelectedRegions.length === 1) {
        regionFilter = fullySelectedRegions[0]
      } else if (newSelection.selectedCities.size === 1) {
        // Single city selected
        regionFilter = Array.from(newSelection.selectedCities)[0]
      } else {
        // Multiple cities/regions - pass the selection to be calculated
        regionFilter = "multi-selection"
      }
    }
    
    // Update filters with the determined region
    setFilters(prev => ({ ...prev, region: regionFilter, building: "all" }))
  }, [])

  // Get buildings data based on customer mode and region selection
  const buildings = useMemo(() => {
    const allBuildings = currentMode === "piedmont" ? piedmontBuildings : mockBuildings
    
    // If Piedmont mode and has partial region selection, filter buildings by selected cities
    if (currentMode === "piedmont" && regionSelection.selectedCities.size > 0) {
      const totalCities = Object.values(piedmontRegions).flat().length
      
      // If all cities are selected, show all buildings (All Regions case)
      if (regionSelection.selectedCities.size === totalCities) {
        return allBuildings
      }
      
      // Otherwise, filter by selected cities
      return allBuildings.filter(building => {
        return regionSelection.selectedCities.has(building.city)
      })
    }
    
    return allBuildings
  }, [currentMode, regionSelection])
  
  // Conditional rendering based on persona
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4">
          <div className="page-header">
            <div>
              <h1 className="page-title">Welcome back, {firstName}</h1>
              <p className="page-subtitle">
                {currentPersona === "Executive" 
                  ? `Here is your executive dashboard for ${currentMode === "piedmont" ? "Piedmont Realty Trust Portfolio" : "Portfolio Overview"}`
                  : "Stay informed and manage your building's activity with real-time updates"
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <GlobalSearch />
              <div className="flex items-center gap-2">
                  {currentPersona === "Executive" && (
                    <>
                      <RegionSelector 
                        selectedRegions={regionSelection.selectedRegions}
                        selectedCities={regionSelection.selectedCities}
                        onSelectionChange={handleRegionSelectionChange}
                      />
                                             <Select value={filters.building} onValueChange={(value) => setFilters(prev => ({ ...prev, building: value }))}>
                         <SelectTrigger className="w-48 h-10">
                           <div className="flex items-center">
                             <Building2 className="h-4 w-4 mr-2" />
                             <SelectValue placeholder="Select Building" />
                           </div>
                         </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Buildings</SelectItem>
                          {buildings.map(building => (
                            <SelectItem key={building.uuid} value={building.uuid}>{building.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </>
                  )}
                  {currentPersona !== "Executive" && (
                    <Select value={filters.building} onValueChange={(value) => setFilters(prev => ({ ...prev, building: value }))}>
                      <SelectTrigger className="w-48 h-10">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Select Building" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Buildings</SelectItem>
                        {buildings.map(building => (
                          <SelectItem key={building.uuid} value={building.uuid}>
                            {building.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <PersonaSelector />
                </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Debug: Current Persona: {currentPersona} */}
          {currentPersona === "Property Experience Manager (PXM)" ? (
            // PXM Dashboard Content
            <div className="page-container max-w-7xl mx-auto">
            {/* PXM Dashboard content remains the same */}
            {/* Top Row - Users and Communication Performance */}
            <div className="card-grid-2">
              {/* Users Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-medium">Users</CardTitle>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">View</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">44,116</div>
                      <p className="text-sm text-gray-500">Total users</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">982</div>
                      <p className="text-sm text-blue-600">New</p>
                      <p className="text-xs text-gray-500">In last 30 days</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">42,579</div>
                      <p className="text-sm text-green-600">Active</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-orange-600">1,537</div>
                      <p className="text-sm text-orange-600">Pending</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Communication Performance Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-medium">30-day Communication Performance</CardTitle>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">View</Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-3xl font-bold text-gray-900">11</div>
                      <p className="text-sm text-gray-500">Total sent</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-purple-600">29%</div>
                      <p className="text-sm text-purple-600">Reach rate</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">3%</div>
                      <p className="text-sm text-blue-600">Open rate</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">0.0%</div>
                      <p className="text-sm text-green-600">Email CTR</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Row - Traffic Report and Today's Summary */}
            <div className="card-grid-2">
              {/* Today's Traffic Report */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-medium">Today's Traffic Report</CardTitle>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">View activity</Button>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Key className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Unlock smarter building security</h3>
                  <p className="text-sm text-gray-500 text-center mb-6">Centralize your access control and say goodbye to key chaos</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">Get started</Button>
                </CardContent>
              </Card>

              {/* Today's Summary */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-medium">Today's Summary</CardTitle>
                    <Info className="h-4 w-4 text-gray-400" />
                  </div>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">Manage visitors</Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="visitors" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="visitors">Visitors</TabsTrigger>
                      <TabsTrigger value="bookings">Bookings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="visitors" className="mt-6">
                      <div className="text-center py-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Your visitor summary is ready for action</h3>
                        <p className="text-sm text-gray-500 mb-6">Data will appear here once people start checking in</p>
                        <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                          Create visit
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="bookings" className="mt-6">
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No bookings for today</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row - Events and Outreach */}
            <div className="card-grid-2">
              {/* Events */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-medium">Events</CardTitle>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">View all</Button>
                </CardHeader>
                <CardContent className="content-group">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-xs text-blue-600 font-medium">JUN</div>
                        <div className="text-lg font-bold text-blue-600">12</div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">Tenant Appreciation Party</p>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700">• Scheduled</Badge>
                        </div>
                        <p className="text-sm text-gray-500">4–7 PM</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">687 registered</p>
                      <p className="text-xs text-gray-500">Unlimited capacity</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Add event</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Outreach */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg font-medium">Outreach</CardTitle>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">View all</Button>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="communications" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="communications" className="text-xs">
                        Communications
                        <Badge variant="secondary" className="ml-1 text-xs">1</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="surveys" className="text-xs">
                        Surveys
                        <Badge variant="secondary" className="ml-1 text-xs">0</Badge>
                      </TabsTrigger>
                      <TabsTrigger value="trending" className="text-xs">
                        Trending content
                        <Badge variant="secondary" className="ml-1 text-xs">4</Badge>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="communications" className="mt-6">
                      <div className="content-group">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Bell className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="font-medium">Drag Me Downtown ICA San Francisco</p>
                              <p className="text-sm text-gray-500">Scheduled for 06/16/2025, 12:00 PM • Push, In app</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">• Scheduled</Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Eye className="h-4 w-4 mr-1" />
                              4 days
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="surveys" className="mt-6">
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">No surveys available</p>
                      </div>
                    </TabsContent>
                    <TabsContent value="trending" className="mt-6">
                      <div className="text-center py-8">
                        <p className="text-sm text-gray-500">4 trending content items</p>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex items-center justify-center py-8 border-2 border-dashed border-gray-200 rounded-lg mt-4">
                    <div className="text-center">
                      <Plus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Add communications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Info Cards */}
            <div className="card-grid-2">
              {/* Planning Event Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full flex-shrink-0 mt-0.5">
                        <Info className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Planning an event for your tenants?</p>
                        <p className="text-sm text-gray-600 mb-3">Explore the all new Events section! Create paid or free events - then access detailed reports on registrations and engagement.</p>
                        <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">Watch webinar</Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Did You Know Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-blue-600 rounded-full flex-shrink-0 mt-0.5">
                        <Info className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Did you know?</p>
                        <p className="text-sm text-gray-600 mb-3">Your users are most active between 8 and 10 AM. Try sending notifications during this time!</p>
                        <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">Schedule communication</Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          ) : currentPersona === "Executive" ? (
            <ExecutiveDashboard filters={filters} regionSelection={regionSelection} />
          ) : currentPersona === "Asset Manager" ? (
            // Asset Manager Dashboard Content
            <div className="page-container max-w-7xl mx-auto">
              <div className="card-grid-4">
                {/* NOI */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Net Operating Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$156M</div>
                    <p className="text-xs text-muted-foreground">+8.4% YoY</p>
                  </CardContent>
                </Card>

                {/* Cap Rate */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Cap Rate</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">6.8%</div>
                    <p className="text-xs text-muted-foreground">Market: 6.2%</p>
                  </CardContent>
                </Card>

                {/* Renewal Rate */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89.2%</div>
                    <p className="text-xs text-muted-foreground">Target: 85%</p>
                  </CardContent>
                </Card>

                {/* Avg Rent */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Avg Rent/SF</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$42.50</div>
                    <p className="text-xs text-muted-foreground">+3.2% from last year</p>
                  </CardContent>
                </Card>
              </div>

              <div className="card-grid-2 mt-6">
                {/* Asset Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cobblestone Collaborative</span>
                        <span className="text-sm font-medium">95.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Metro Tower</span>
                        <span className="text-sm font-medium">93.1%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Innovation Hub</span>
                        <span className="text-sm font-medium">88.7%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lease Expirations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upcoming Lease Expirations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">BioTech Innovations</span>
                          <p className="text-xs text-muted-foreground">Lab Suite 300</p>
                        </div>
                        <Badge variant="destructive">45 days</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">CloudFirst Technologies</span>
                          <p className="text-xs text-muted-foreground">Suite 1000</p>
                        </div>
                        <Badge variant="secondary">120 days</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : currentPersona === "Investment Officer" ? (
            // Investment Officer Dashboard Content
            <div className="page-container max-w-7xl mx-auto">
              <div className="card-grid-3">
                {/* Total Investments */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1.2B</div>
                    <p className="text-xs text-muted-foreground">Across 89 properties</p>
                  </CardContent>
                </Card>

                {/* IRR */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolio IRR</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12.4%</div>
                    <p className="text-xs text-muted-foreground">Target: 11.0%</p>
                  </CardContent>
                </Card>

                {/* Cash Yield */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cash Yield</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7.2%</div>
                    <p className="text-xs text-muted-foreground">+0.8% vs benchmark</p>
                  </CardContent>
                </Card>
              </div>

              <div className="card-grid-2 mt-6">
                {/* Investment Pipeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Investment Pipeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">Downtown Office Complex</span>
                          <p className="text-xs text-muted-foreground">San Francisco, CA</p>
                        </div>
                        <Badge variant="secondary">Due Diligence</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">Tech Campus</span>
                          <p className="text-xs text-muted-foreground">Austin, TX</p>
                        </div>
                        <Badge variant="secondary">LOI Submitted</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Market Opportunities */}
                <Card>
                  <CardHeader>
                    <CardTitle>Market Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Life Sciences - Boston</span>
                        <Badge variant="default">Hot</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Data Centers - Phoenix</span>
                        <Badge variant="secondary">Emerging</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Logistics - Atlanta</span>
                        <Badge variant="secondary">Watch</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : currentPersona === "Finance Controller" ? (
            // Finance Controller Dashboard Content
            <div className="page-container max-w-7xl mx-auto">
              <div className="card-grid-4">
                {/* Revenue */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$234M</div>
                    <p className="text-xs text-muted-foreground">+6.2% YoY</p>
                  </CardContent>
                </Card>

                {/* Operating Expenses */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Operating Expenses</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$78M</div>
                    <p className="text-xs text-muted-foreground">Budget: $82M</p>
                  </CardContent>
                </Card>

                {/* Collections Rate */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Collections Rate</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">98.7%</div>
                    <p className="text-xs text-muted-foreground">Target: 96%</p>
                  </CardContent>
                </Card>

                {/* EBITDA Margin */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">EBITDA Margin</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">66.7%</div>
                    <p className="text-xs text-muted-foreground">Industry avg: 62%</p>
                  </CardContent>
                </Card>
              </div>

              <div className="card-grid-2 mt-6">
                {/* Budget vs Actual */}
                <Card>
                  <CardHeader>
                    <CardTitle>Budget vs Actual (YTD)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Property Management</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">95% of budget</span>
                          <Badge variant="default">Under</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Maintenance & Repairs</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">102% of budget</span>
                          <Badge variant="destructive">Over</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Utilities</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">98% of budget</span>
                          <Badge variant="default">On Track</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Outstanding Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Outstanding Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">Overdue Receivables</span>
                          <p className="text-xs text-muted-foreground">3 tenants</p>
                        </div>
                        <Badge variant="destructive">$45K</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium">Pending Invoices</span>
                          <p className="text-xs text-muted-foreground">Awaiting approval</p>
                        </div>
                        <Badge variant="secondary">$127K</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <ComingSoonView />
          )}
        </div>
      </div>
    </div>
  )
}
