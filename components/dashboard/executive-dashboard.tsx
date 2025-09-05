"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, DollarSign, Users, Wrench, BarChart3, TrendingUp } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { mockBuildings, mockLeases, mockTenants } from "@/lib/mockData"
import { piedmontBuildings, piedmontLeases } from "@/lib/piedmontBuildings"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { LeasingActivityCard } from "./leasing-activity-card"
import { RegionSelector } from "../region-selector"
import { PortfolioSummaryCard } from "./portfolio-summary-card"
import { OccupancyGaugeCard } from "./occupancy-gauge-card"
import { NOITrendCard } from "./noi-trend-card"
import { LeaseExpirationCard } from "./lease-expiration-card"
import { AvgLeaseTermCard } from "./avg-lease-term-card"
import { TenantConcentrationCard } from "./tenant-concentration-card"
import { LeaseTermDistributionCard } from "./lease-term-distribution-card"
import { RegionalFinancialHeatMapCard } from "./regional-financial-heatmap-card"

interface FilterState {
  region: string
  building: string
}

interface RegionSelection {
  selectedRegions: Set<string>
  selectedCities: Set<string>
}

interface ExecutiveDashboardProps {
  filters?: FilterState
  regionSelection?: RegionSelection
}

// Piedmont regions with nested cities
const piedmontRegions = {
  "Central Region": ["Dallas", "Minneapolis"],
  "Southeast": ["Atlanta", "Orlando"],
  "Northeast": ["New York", "Boston", "Arlington"]
}

export function ExecutiveDashboard({ filters: externalFilters, regionSelection: externalRegionSelection }: ExecutiveDashboardProps) {
  const { currentMode } = useCustomerMode()
  const [internalFilters, setInternalFilters] = useState<FilterState>({
    region: "all",
    building: "all"
  })

  // Use external filters if provided, otherwise use internal state
  const filters = externalFilters || internalFilters
  const setFilters = externalFilters ? () => {} : setInternalFilters

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

  // Convert region selection to filter string (stable function)
  const updateFiltersFromSelection = useCallback((selection: RegionSelection) => {
    const isPiedmont = currentMode.toLowerCase() === 'piedmont'
    
    if (isPiedmont) {
      // For Piedmont, determine which regions are fully selected
      const fullySelectedRegions = Object.keys(piedmontRegions).filter(region => {
        const cities = piedmontRegions[region as keyof typeof piedmontRegions] || []
        return cities.every(city => selection.selectedCities.has(city))
      })
      
      if (fullySelectedRegions.length === Object.keys(piedmontRegions).length) {
        // All regions selected
        setFilters(prev => ({ ...prev, region: "all" }))
      } else if (fullySelectedRegions.length === 1) {
        // Single region selected
        setFilters(prev => ({ ...prev, region: fullySelectedRegions[0] }))
      } else if (fullySelectedRegions.length > 1) {
        // Multiple regions - for now treat as "all" but could be enhanced
        setFilters(prev => ({ ...prev, region: "all" }))
      } else {
        // No complete regions - check for partial selection
        const hasAnySelection = Array.from(selection.selectedCities).length > 0
        setFilters(prev => ({ ...prev, region: hasAnySelection ? "partial" : "all" }))
      }
    } else {
      // For mock data, simpler logic
      if (selection.selectedRegions.size === 0) {
        setFilters(prev => ({ ...prev, region: "all" }))
      } else if (selection.selectedRegions.size === 1) {
        const selectedRegion = Array.from(selection.selectedRegions)[0]
        setFilters(prev => ({ ...prev, region: selectedRegion }))
      } else {
        setFilters(prev => ({ ...prev, region: "all" }))
      }
    }
  }, [currentMode])

  // Handle region selection change
  const handleRegionSelectionChange = useCallback((newSelection: RegionSelection) => {
    setRegionSelection(newSelection)
    updateFiltersFromSelection(newSelection)
  }, [updateFiltersFromSelection])

  // Get filtered data based on customer mode and filters
  const { buildings, leases, tenants, regions } = useMemo(() => {
    let buildingsData: any[]
    let leasesData: any[]
    let tenantsData = mockTenants

    // Apply customer mode filtering - Use real Piedmont data or mock data
    if (currentMode === "piedmont") {
      buildingsData = piedmontBuildings
      leasesData = piedmontLeases
    } else {
      buildingsData = mockBuildings
      leasesData = mockLeases
    }

    // Apply user filters
    if (filters.region !== "all") {
      buildingsData = buildingsData.filter(b => b.region === filters.region)
      
      // Filter leases to match buildings in the selected region
      const regionBuildingIds = buildingsData.map(b => b.uuid)
      if (currentMode === "piedmont") {
        leasesData = leasesData.filter(l => regionBuildingIds.includes(l.building_id))
      } else {
        // For mock data, filter by matching property types in selected region
        const regionAssetTypes = buildingsData.map(b => b.asset_type)
        leasesData = leasesData.filter(l => regionAssetTypes.includes(l.property_type))
      }
    }

    if (filters.building !== "all") {
      buildingsData = buildingsData.filter(b => b.uuid === filters.building)
      
      // Filter leases for the specific building
      if (currentMode === "piedmont") {
        leasesData = leasesData.filter(l => l.building_id === filters.building)
      } else {
        // For mock data, filter by the building's asset type
        const selectedBuilding = buildingsData[0]
        if (selectedBuilding) {
          leasesData = leasesData.filter(l => l.property_type === selectedBuilding.asset_type)
        }
      }
    }

    // Get unique regions for filter dropdown from the appropriate data source
    const sourceBuildings = currentMode === "piedmont" ? piedmontBuildings : mockBuildings
    const regionsSet = new Set(sourceBuildings.map(b => b.region).filter(Boolean))
    const regions = Array.from(regionsSet).filter((region): region is string => region !== undefined)

    return {
      buildings: buildingsData,
      leases: leasesData,
      tenants: tenantsData,
      regions
    }
  }, [currentMode, filters])

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalProperties = buildings.length
    const totalLeases = leases.length
    
    // Calculate active leases based on dates
    const currentDate = new Date()
    const activeLeases = leases.filter(l => {
      const commenceDate = new Date(l.commencement_date)
      const expireDate = new Date(l.expiration_date)
      return commenceDate <= currentDate && currentDate <= expireDate
    })
    
    const occupancyRate = totalLeases > 0 ? (activeLeases.length / totalLeases) * 100 : 0
    
    const totalAnnualRent = activeLeases
      .reduce((sum, l) => sum + (l.base_rent_annual || 0), 0)
    
    // Calculate total square footage across all buildings
    const totalSquareFeet = buildings.reduce((sum, b) => sum + (b.square_foot || 0), 0)
    
    // Calculate average rent per square foot (annual)
    const avgRentPerSqft = totalSquareFeet > 0 ? totalAnnualRent / totalSquareFeet : 0

    // Experience metrics
    const totalTenants = new Set(leases.map(l => l.tenant_id)).size
    const renewalRate = leases.filter(l => l.renewal_option).length / totalLeases * 100
    
    // Operations metrics
    const workOrders = Math.floor(totalProperties * 3.2) // Mock calculation
    const maintenanceScore = 87 // Mock score

    return {
      totalProperties,
      totalLeases,
      occupancyRate,
      totalAnnualRent,
      avgRentPerSqft,
      totalTenants,
      renewalRate,
      workOrders,
      maintenanceScore
    }
  }, [buildings, leases])

  // Chart data
  const occupancyTrendData = [
    { month: 'Jan', occupancy: 85 },
    { month: 'Feb', occupancy: 87 },
    { month: 'Mar', occupancy: 89 },
    { month: 'Apr', occupancy: 91 },
    { month: 'May', occupancy: metrics.occupancyRate },
    { month: 'Jun', occupancy: 94 }
  ]

  const revenueByPropertyType = buildings.reduce((acc, building) => {
    const buildingLeases = leases.filter(l => l.property_type === building.asset_type)
    const revenue = buildingLeases.reduce((sum, l) => sum + (l.base_rent_annual || 0), 0)
    
    const existing = acc.find((item: { type: string; revenue: number }) => item.type === building.asset_type)
    if (existing) {
      existing.revenue += revenue
          } else {
        acc.push({ type: building.asset_type ?? "Unknown", revenue })
      }
    return acc
  }, [] as Array<{ type: string; revenue: number }>)

  const expenseBreakdown = [
    { category: 'Maintenance', amount: metrics.totalAnnualRent * 0.15, color: '#3b82f6' },
    { category: 'Utilities', amount: metrics.totalAnnualRent * 0.08, color: '#10b981' },
    { category: 'Insurance', amount: metrics.totalAnnualRent * 0.05, color: '#f59e0b' },
    { category: 'Management', amount: metrics.totalAnnualRent * 0.07, color: '#ef4444' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Portfolio Summary Hero Card */}
      <PortfolioSummaryCard filters={filters} regionSelection={externalRegionSelection || regionSelection} />

      {/* Occupancy and NOI Trend Cards */}
      <div className="grid grid-cols-2 gap-6">
        <OccupancyGaugeCard filters={filters} />
        <NOITrendCard filters={filters} />
      </div>

      {/* Lease Expiration and Avg Lease Term Cards */}
      <div className="grid grid-cols-2 gap-6">
        <LeaseExpirationCard filters={filters} />
        <AvgLeaseTermCard filters={filters} />
      </div>

      {/* Tenant Concentration and Lease Term Distribution Cards */}
      <div className="grid grid-cols-2 gap-6">
        <TenantConcentrationCard filters={filters} />
        <LeaseTermDistributionCard filters={filters} />
      </div>

      {/* Regional Financial Performance Map */}
      <RegionalFinancialHeatMapCard filters={filters} />

      {/* Leasing Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Leasing Performance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                Across {regions.length} regions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.occupancyRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {metrics.totalLeases} active leases
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Rent/SqFt</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.avgRentPerSqft.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Per square foot annually
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.renewalRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Tenant retention
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={occupancyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Occupancy']} />
                  <Line type="monotone" dataKey="occupancy" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Property Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueByPropertyType}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Leasing Activity Section */}
      <LeasingActivityCard filters={filters} />

      {/* Financial Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-semibold">Financial Performance</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annual Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(metrics.totalAnnualRent / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">NOI Margin</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">64.5%</div>
              <p className="text-xs text-muted-foreground">
                Above industry average
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cap Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6.8%</div>
              <p className="text-xs text-muted-foreground">
                Portfolio average
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Operating Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ category, amount }) => `${category}: $${(amount / 1000000).toFixed(1)}M`}
                >
                  {expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${(Number(value) / 1000000).toFixed(1)}M`]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Experience Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-purple-600" />
          <h2 className="text-xl font-semibold">Tenant Experience</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalTenants}</div>
              <p className="text-xs text-muted-foreground">
                Active accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Satisfaction Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2</div>
              <p className="text-xs text-muted-foreground">
                Out of 5.0 stars
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">App Engagement</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78%</div>
              <p className="text-xs text-muted-foreground">
                Monthly active users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Requests</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Operations Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-orange-600" />
          <h2 className="text-xl font-semibold">Operations</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Work Orders</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.workOrders}</div>
              <p className="text-xs text-muted-foreground">
                12 pending, 8 in progress
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maintenance Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.maintenanceScore}</div>
              <p className="text-xs text-muted-foreground">
                Performance index
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">B+</div>
              <p className="text-xs text-muted-foreground">
                Portfolio average rating
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 