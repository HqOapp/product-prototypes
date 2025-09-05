"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Building2, Users, AlertTriangle, DollarSign, Target, Clock, Square } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { mockBuildings, mockLeases, mockTenants } from "@/lib/mockData"
import { piedmontBuildings, piedmontLeases } from "@/lib/piedmontBuildings"
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Tooltip
} from "recharts"

interface FilterState {
  region: string
  building: string
}

interface RegionSelection {
  selectedRegions: Set<string>
  selectedCities: Set<string>
}

interface PortfolioSummaryCardProps {
  filters: FilterState
  regionSelection?: RegionSelection
}

// Real Piedmont regional data
const piedmontRegionalData = {
  regions: {
    "Central Region": { noi: 85.9, alr: 154.5, percentage: 27.2 },
    "Southeast": { noi: 144.6, alr: 237.7, percentage: 41.9 },
    "Northeast": { noi: 92.6, alr: 155.1, percentage: 27.4 }
  },
  cities: {
    "Dallas": { noi: 62.3, alr: 106.7, percentage: 18.8, occupancy: 85.8 },
    "Minneapolis": { noi: 23.6, alr: 47.8, percentage: 8.4, occupancy: 86.9 },
    "Atlanta": { noi: 110.7, alr: 173.7, percentage: 30.6, occupancy: 92.7 },
    "Orlando": { noi: 33.9, alr: 64.0, percentage: 11.3, occupancy: 93.2 },
    "New York": { noi: 30.2, alr: 55.4, percentage: 9.8, occupancy: 95.5 },
    "Boston": { noi: 28.3, alr: 40.5, percentage: 7.2, occupancy: 86.7 },
    "Arlington": { noi: 34.1, alr: 59.2, percentage: 10.4, occupancy: 69.7 }
  },
  portfolio: { noi: 323.1, alr: 547.3, totalSF: 9400000 } // Total portfolio
}

export function PortfolioSummaryCard({ filters, regionSelection }: PortfolioSummaryCardProps) {
  const { currentMode } = useCustomerMode()
  const [compareRegions, setCompareRegions] = useState(false)

  // Get data based on customer mode
  const { buildings, leases, tenants } = useMemo(() => {
    if (currentMode === "piedmont") {
      return {
        buildings: piedmontBuildings as any[],
        leases: piedmontLeases as any[],
        tenants: mockTenants
      }
    } else {
      return {
        buildings: mockBuildings as any[],
        leases: mockLeases as any[],
        tenants: mockTenants
      }
    }
  }, [currentMode])

  // Apply filters and calculate metrics based on main dashboard filters
  const portfolioData = useMemo(() => {
    if (currentMode === "piedmont") {
      // Use real Piedmont data based on main dashboard region filter
      if (filters.region === "all") {
        // Portfolio-wide data (All Regions)
        const { noi, alr, totalSF } = piedmontRegionalData.portfolio
        return {
          totalALR: alr * 1000000, // Convert to actual dollars
          noi2024: noi * 1000000,
          avgOccupancy: 90.5, // Weighted average across portfolio
          avgLeaseTermRemaining: 6.2,
          totalRentableSF: totalSF,
          avgLeaseSize: totalSF / 16, // 16 buildings
          tenantConcentration: 3,
          buildingCount: 16,
          leaseCount: 16
        }
      } else if (filters.region === "multi-selection" && regionSelection) {
        // Multiple regions/cities selected - calculate combined totals
        const selectedCities = Array.from(regionSelection.selectedCities)
        let combinedALR = 0
        let combinedNOI = 0
        let totalOccupancyWeighted = 0
        let buildingCount = 0
        
        selectedCities.forEach(city => {
          const cityData = piedmontRegionalData.cities[city as keyof typeof piedmontRegionalData.cities]
          if (cityData) {
            combinedALR += cityData.alr
            combinedNOI += cityData.noi
            totalOccupancyWeighted += cityData.occupancy * cityData.alr // Weight by ALR
            
            // Count buildings per city
            buildingCount += city === "Atlanta" ? 5 : city === "Dallas" ? 5 : city === "Orlando" ? 4 : 1
          }
        })
        
        const weightedOccupancy = combinedALR > 0 ? totalOccupancyWeighted / combinedALR : 0
        
        return {
          totalALR: combinedALR * 1000000,
          noi2024: combinedNOI * 1000000,
          avgOccupancy: weightedOccupancy,
          avgLeaseTermRemaining: 6.2,
          totalRentableSF: (combinedALR / 547.3) * 9400000, // Proportional SF
          avgLeaseSize: ((combinedALR / 547.3) * 9400000) / buildingCount,
          tenantConcentration: Math.max(1, Math.floor(buildingCount * 0.2)),
          buildingCount,
          leaseCount: buildingCount
        }
      } else if (["Southeast", "Central Region", "Northeast"].includes(filters.region)) {
        // Region-specific data
        const regionData = piedmontRegionalData.regions[filters.region as keyof typeof piedmontRegionalData.regions]
        if (regionData) {
          // Calculate weighted occupancy for the region
          const regionCities = filters.region === "Southeast" ? ["Atlanta", "Orlando"] :
                              filters.region === "Central Region" ? ["Dallas", "Minneapolis"] :
                              ["New York", "Boston", "Arlington"]
          
          const cityData = regionCities.map(city => piedmontRegionalData.cities[city as keyof typeof piedmontRegionalData.cities])
          const weightedOccupancy = cityData.reduce((sum, city, index) => {
            const weight = city.alr / regionData.alr
            return sum + (city.occupancy * weight)
          }, 0)

          const buildingCount = filters.region === "Southeast" ? 9 : filters.region === "Central Region" ? 6 : 3
          
          return {
            totalALR: regionData.alr * 1000000,
            noi2024: regionData.noi * 1000000,
            avgOccupancy: weightedOccupancy,
            avgLeaseTermRemaining: 6.2,
            totalRentableSF: (regionData.alr / 547.3) * 9400000, // Proportional SF
            avgLeaseSize: ((regionData.alr / 547.3) * 9400000) / buildingCount,
            tenantConcentration: Math.max(1, Math.floor(buildingCount * 0.2)),
            buildingCount,
            leaseCount: buildingCount
          }
        }
      } else {
        // City-specific data (when specific cities are selected)
        const cityData = piedmontRegionalData.cities[filters.region as keyof typeof piedmontRegionalData.cities]
        if (cityData) {
          const buildingCount = filters.region === "Atlanta" ? 5 : filters.region === "Dallas" ? 5 : filters.region === "Orlando" ? 4 : 1
          
          return {
            totalALR: cityData.alr * 1000000,
            noi2024: cityData.noi * 1000000,
            avgOccupancy: cityData.occupancy,
            avgLeaseTermRemaining: 6.2,
            totalRentableSF: (cityData.alr / 547.3) * 9400000, // Proportional SF
            avgLeaseSize: ((cityData.alr / 547.3) * 9400000) / buildingCount,
            tenantConcentration: Math.max(1, Math.floor(buildingCount * 0.2)),
            buildingCount,
            leaseCount: buildingCount
          }
        }
      }
    }

    // Fallback to original calculation for non-Piedmont modes
    let filteredBuildings = buildings
    let filteredLeases = leases

    // Apply region filter from main dashboard
    if (filters.region !== "all") {
      filteredBuildings = buildings.filter(b => {
        const region = (b as any).region || b.city
        return region === filters.region
      })
    }

    // Apply main dashboard filters
    if (filters.region !== "all") {
      if (["Southeast", "Central Region", "Northeast"].includes(filters.region)) {
        // Region filter
        filteredBuildings = filteredBuildings.filter(b => {
          const region = (b as any).region || b.city
          return region === filters.region
        })
      } else {
        // City filter
        filteredBuildings = filteredBuildings.filter(b => b.city === filters.region)
      }
    }

    // Calculate metrics
    const totalALR = filteredLeases.reduce((sum, lease) => sum + (lease.base_rent_annual || 0), 0)
    const totalRentableSF = filteredBuildings.reduce((sum, building) => sum + building.square_foot, 0)
    const avgOccupancy = filteredBuildings.reduce((sum, building) => sum + building.occupancy_rate, 0) / filteredBuildings.length
    
    // Calculate NOI (simplified: ALR * 0.65)
    const noi2024 = totalALR * 0.65

    // Calculate average lease term remaining (mock: 3-8 years)
    const avgLeaseTermRemaining = 6.2

    // Calculate average lease size
    const avgLeaseSize = totalRentableSF / filteredLeases.length

    // Tenant concentration (mock calculation)
    const tenantConcentration = Math.min(Math.floor(filteredLeases.length * 0.15), 5)

    return {
      totalALR,
      noi2024,
      avgOccupancy,
      avgLeaseTermRemaining,
      totalRentableSF,
      avgLeaseSize,
      tenantConcentration,
      buildingCount: filteredBuildings.length,
      leaseCount: filteredLeases.length
    }
  }, [buildings, leases, filters, currentMode, regionSelection])

  // Regional breakdown data
  const regionalData = useMemo(() => {
    if (currentMode === "piedmont") {
      // Use real Piedmont regional data
      return [
        {
          region: "Southeast",
          alr: 237.7 * 1000000,
          sf: (237.7 / 547.3) * 9400000,
          occupancy: 92.9, // Weighted average: (173.7*92.7 + 64.0*93.2) / 237.7
          noi: 144.6 * 1000000,
          avgLeaseTermRemaining: 6.1
        },
        {
          region: "Central", 
          alr: 154.5 * 1000000,
          sf: (154.5 / 547.3) * 9400000,
          occupancy: 86.2, // Weighted average: (106.7*85.8 + 47.8*86.9) / 154.5
          noi: 85.9 * 1000000,
          avgLeaseTermRemaining: 6.3
        },
        {
          region: "Northeast",
          alr: 155.1 * 1000000,
          sf: (155.1 / 547.3) * 9400000,
          occupancy: 84.0, // Weighted average: (55.4*95.5 + 40.5*86.7 + 59.2*69.7) / 155.1
          noi: 92.6 * 1000000,
          avgLeaseTermRemaining: 6.0
        }
      ]
    }

    // Fallback for non-Piedmont modes
    const regions = ["San Francisco", "Palo Alto", "Other"]
    return regions.map(region => {
      const regionBuildings = buildings.filter(b => {
        const buildingRegion = (b as any).region || b.city
        return buildingRegion === region
      })
      
      const regionLeases = leases.filter(lease => {
        const buildingId = (lease as any).building_id
        const building = buildings.find(b => b.uuid === buildingId)
        if (building) {
          const buildingRegion = (building as any).region || building.city
          return buildingRegion === region
        }
        return false
      })

      const alr = regionLeases.reduce((sum, lease) => sum + (lease.base_rent_annual || 0), 0)
      const sf = regionBuildings.reduce((sum, building) => sum + building.square_foot, 0)
      const occupancy = regionBuildings.length > 0 
        ? regionBuildings.reduce((sum, building) => sum + building.occupancy_rate, 0) / regionBuildings.length 
        : 0

      return {
        region,
        alr,
        sf,
        occupancy,
        noi: alr * 0.65,
        avgLeaseTermRemaining: 5.5 + Math.random() * 2 // Mock: 5.5-7.5 years
      }
    })
  }, [buildings, leases, currentMode])

  // Mock NOI trend data (4 years)
  const noiTrend = [
    { year: '2021', noi: portfolioData.noi2024 * 0.82 },
    { year: '2022', noi: portfolioData.noi2024 * 0.89 },
    { year: '2023', noi: portfolioData.noi2024 * 0.94 },
    { year: '2024', noi: portfolioData.noi2024 }
  ]

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  // Format square feet
  const formatSF = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M SF`
    }
    return `${(value / 1000).toFixed(0)}K SF`
  }



  if (compareRegions) {
    // Regional comparison view
    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl text-blue-900">Regional Portfolio Comparison</CardTitle>
            </div>
            <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-lg border border-blue-200/50">
              <span className="text-sm font-medium text-blue-700">Compare Regions</span>
              <Switch 
                checked={compareRegions} 
                onCheckedChange={setCompareRegions}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalData.map((region) => (
              <div key={region.region} className="group space-y-6 p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer">
                <h3 className="font-bold text-xl text-center text-gray-900 pb-2 border-b border-gray-100">
                  {region.region}
                </h3>
                
                <div className="space-y-6">
                  {/* Primary Metrics - Larger and more prominent */}
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-700 mb-1">
                      {formatCurrency(region.alr)}
                    </div>
                    <div className="text-sm font-medium text-blue-600">Total ALR</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-700 mb-1">
                      {formatCurrency(region.noi)}
                    </div>
                    <div className="text-sm font-medium text-green-600">NOI (2024)</div>
                  </div>
                  
                  {/* Secondary Metrics - Smaller but still prominent */}
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-700 mb-1">
                      {region.occupancy.toFixed(1)}%
                    </div>
                    <div className="text-sm font-medium text-purple-600 mb-2">Occupancy</div>
                    <Progress value={region.occupancy} className="h-3 bg-purple-100" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-700 mb-1">
                        {formatSF(region.sf)}
                      </div>
                      <div className="text-xs font-medium text-gray-600">Rentable SF</div>
                    </div>
                    
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-700 mb-1">
                        {region.avgLeaseTermRemaining.toFixed(1)} yrs
                      </div>
                      <div className="text-xs font-medium text-gray-600">Avg Lease Term</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Standard portfolio summary view
  return (
    <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl text-blue-900">Portfolio Performance</CardTitle>
          </div>
          <div className="flex items-center gap-2 bg-white/60 px-3 py-2 rounded-lg border border-blue-200/50">
            <span className="text-sm font-medium text-blue-700">Compare Regions</span>
            <Switch 
              checked={compareRegions} 
              onCheckedChange={setCompareRegions}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Top Row - KPIs with Mini Visuals */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Total ALR with mini bar chart */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">TOTAL ALR</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-600">+8.2%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {formatCurrency(portfolioData.totalALR)}
            </div>
            <div className="h-8 bg-gray-50 rounded-lg overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData}>
                  <Bar dataKey="alr" fill="#10b981" radius={[2, 2, 0, 0]} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NOI with sparkline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">NOI (2024)</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs font-semibold text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {formatCurrency(portfolioData.noi2024)}
            </div>
            <div className="h-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={noiTrend}>
                  <Line type="monotone" dataKey="noi" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Occupancy with progress ring */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">OCCUPANCY</span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                portfolioData.avgOccupancy >= 95 
                  ? 'bg-green-50' 
                  : 'bg-amber-50'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  portfolioData.avgOccupancy >= 95 
                    ? 'bg-green-500' 
                    : 'bg-amber-500'
                }`}></div>
                <span className={`text-xs font-semibold ${
                  portfolioData.avgOccupancy >= 95 
                    ? 'text-green-600' 
                    : 'text-amber-600'
                }`}>
                  {portfolioData.avgOccupancy >= 95 ? 'On Target' : 'Below Goal'}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {portfolioData.avgOccupancy.toFixed(1)}%
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Current</span>
                <span>Goal: 95%</span>
              </div>
              <Progress value={portfolioData.avgOccupancy} className="h-2" />
            </div>
          </div>

          {/* Avg Lease Term with bar */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">AVG LEASE TERM</span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                portfolioData.avgLeaseTermRemaining >= 5 
                  ? 'bg-green-50' 
                  : 'bg-red-50'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  portfolioData.avgLeaseTermRemaining >= 5 
                    ? 'bg-green-500' 
                    : 'bg-red-500'
                }`}></div>
                <span className={`text-xs font-semibold ${
                  portfolioData.avgLeaseTermRemaining >= 5 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {portfolioData.avgLeaseTermRemaining >= 5 ? 'Healthy' : 'Risk'}
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              {portfolioData.avgLeaseTermRemaining.toFixed(1)} <span className="text-lg text-gray-500">yrs</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Current</span>
                <span>Target: 5+ years</span>
              </div>
              <Progress value={(portfolioData.avgLeaseTermRemaining / 8) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rentable Square Feet with stacked bar */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Square className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">RENTABLE SQUARE FEET</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-4">
              {formatSF(portfolioData.totalRentableSF)}
            </div>
            <div className="h-6 bg-gray-50 rounded-lg overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} layout="horizontal">
                  <XAxis type="number" hide />
                  <YAxis type="category" hide />
                  <Bar dataKey="sf" fill="#6b7280" radius={[0, 3, 3, 0]} />
                  <Tooltip formatter={(value) => formatSF(Number(value))} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Lease Size */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">AVG LEASE SIZE</span>
              </div>
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-xs font-semibold text-blue-600">Stable</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {formatSF(portfolioData.avgLeaseSize)}
            </div>
            <div className="text-sm text-gray-500">
              {portfolioData.leaseCount} active leases
            </div>
          </div>

          {/* Tenant Concentration */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-sm font-semibold text-gray-700">TENANT CONCENTRATION</span>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                portfolioData.tenantConcentration > 3 
                  ? 'bg-amber-50' 
                  : 'bg-green-50'
              }`}>
                {portfolioData.tenantConcentration > 3 ? (
                  <>
                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-600">Monitor</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-semibold text-green-600">Healthy</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <div className="text-2xl font-bold text-gray-900">
                {portfolioData.tenantConcentration}
              </div>
              <span className="text-sm text-gray-500">large tenants</span>
            </div>
            <div className="text-sm text-gray-500">
              Tenants &gt;5% of ALR
              {portfolioData.tenantConcentration > 3 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700">
                  Risk
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 