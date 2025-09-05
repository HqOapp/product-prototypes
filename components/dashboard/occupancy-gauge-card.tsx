"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { mockBuildings, mockLeases } from "@/lib/mockData"
import { piedmontBuildings, piedmontLeases } from "@/lib/piedmontBuildings"
import { 
  piedmontLocationPerformance, 
  getRegionalTotals, 
  getCityData,
  cityNameMapping 
} from "@/lib/financialPerformanceByLocation"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

interface OccupancyGaugeCardProps {
  filters: {
    region: string
    building: string
  }
}

export function OccupancyGaugeCard({ filters }: OccupancyGaugeCardProps) {
  const { currentMode } = useCustomerMode()
  
  // Get data based on customer mode
  const { buildings, leases } = useMemo(() => {
    if (currentMode === "piedmont") {
      return {
        buildings: piedmontBuildings as any[],
        leases: piedmontLeases as any[]
      }
    } else {
      return {
        buildings: mockBuildings as any[],
        leases: mockLeases as any[]
      }
    }
  }, [currentMode])

  // Calculate occupancy data based on filters
  const occupancyData = useMemo(() => {
    const target = 95

    if (currentMode === "piedmont") {
      // Use real Piedmont financial performance data
      
      // Check if we're filtering by a specific city
      const cityFilterMatch = Object.entries(cityNameMapping).find(([key, value]) => 
        key === filters.region || value === filters.region
      )
      
      if (cityFilterMatch) {
        // City-level filtering
        const cityData = getCityData(filters.region)
        if (cityData && cityData.location !== "Total") {
          const occupancyPercentage = cityData.percentLeased
          const delta = occupancyPercentage - target
          
          return {
            occupancyPercentage: Math.round(occupancyPercentage * 10) / 10,
            target,
            delta: Math.round(delta * 10) / 10,
            totalSquareFeet: cityData.rentableSquareFeet,
            leasedSquareFeet: Math.round(cityData.rentableSquareFeet * cityData.percentLeased / 100),
            isAboveTarget: delta >= 0
          }
        }
      }
      
      // Check if we're filtering by region
      if (filters.region && filters.region !== "all") {
        const regionalData = getRegionalTotals(filters.region)
        if (regionalData.locations.length > 0) {
          const occupancyPercentage = regionalData.weightedOccupancy
          const delta = occupancyPercentage - target
          
          return {
            occupancyPercentage: Math.round(occupancyPercentage * 10) / 10,
            target,
            delta: Math.round(delta * 10) / 10,
            totalSquareFeet: regionalData.totalSquareFeet,
            leasedSquareFeet: Math.round(regionalData.totalSquareFeet * regionalData.weightedOccupancy / 100),
            isAboveTarget: delta >= 0
          }
        }
      }
      
      // Portfolio-wide (all regions)
      const portfolioData = piedmontLocationPerformance.find(loc => loc.location === "Total")
      if (portfolioData) {
        const occupancyPercentage = portfolioData.percentLeased
        const delta = occupancyPercentage - target
        
        return {
          occupancyPercentage: Math.round(occupancyPercentage * 10) / 10,
          target,
          delta: Math.round(delta * 10) / 10,
          totalSquareFeet: portfolioData.rentableSquareFeet,
          leasedSquareFeet: Math.round(portfolioData.rentableSquareFeet * portfolioData.percentLeased / 100),
          isAboveTarget: delta >= 0
        }
      }
    }

    // Non-Piedmont mode: use existing building/lease calculation logic
    let filteredBuildings = buildings
    
    if (filters.region && filters.region !== "all") {
      filteredBuildings = buildings.filter(building => building.region === filters.region)
    }
    
    if (filters.building && filters.building !== "all") {
      filteredBuildings = buildings.filter(building => building.uuid === filters.building)
    }

    // Calculate total and leased square footage
    const totalSquareFeet = filteredBuildings.reduce((sum, building) => {
      return sum + (building.total_square_feet || building.totalSquareFeet || 0)
    }, 0)

    // Calculate leased square footage from active leases
    const leasedSquareFeet = leases
      .filter(lease => {
        // Filter leases for the selected buildings
        const buildingIds = filteredBuildings.map(b => b.uuid || b.building_id)
        return buildingIds.includes(lease.building_id || lease.buildingId) && 
               lease.status === "active"
      })
      .reduce((sum, lease) => {
        return sum + (lease.square_feet || lease.squareFeet || 0)
      }, 0)

    const occupancyPercentage = totalSquareFeet > 0 ? (leasedSquareFeet / totalSquareFeet) * 100 : 0
    const delta = occupancyPercentage - target
    
    return {
      occupancyPercentage: Math.round(occupancyPercentage * 10) / 10,
      target,
      delta: Math.round(delta * 10) / 10,
      totalSquareFeet,
      leasedSquareFeet,
      isAboveTarget: delta >= 0
    }
  }, [buildings, leases, filters, currentMode])

  // Determine display title based on filters
  const getTitle = () => {
    if (filters.building && filters.building !== "all") {
      const building = buildings.find(b => b.uuid === filters.building)
      return `Occupancy – ${building?.name || 'Building'}`
    } else if (filters.region && filters.region !== "all") {
      // Check if this is a city name for Piedmont mode
      if (currentMode === "piedmont") {
        const cityData = getCityData(filters.region)
        if (cityData && cityData.location !== "Total") {
          return `Occupancy – ${cityData.location}`
        }
      }
      return `Occupancy – ${filters.region}`
    } else {
      return "Portfolio Occupancy"
    }
  }

  // Gauge chart data for Recharts
  const gaugeData = [
    { 
      name: "occupied", 
      value: occupancyData.occupancyPercentage,
      color: occupancyData.isAboveTarget ? "#10B981" : "#EF4444"
    },
    { 
      name: "vacant", 
      value: 100 - occupancyData.occupancyPercentage,
      color: "#F3F4F6"
    }
  ]

  // Target indicator data
  const targetData = [
    { name: "target", value: occupancyData.target, color: "#6366F1" },
    { name: "remaining", value: 100 - occupancyData.target, color: "transparent" }
  ]

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{getTitle()}</CardTitle>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative">
            <ResponsiveContainer width={300} height={300}>
              <PieChart>
                {/* Background ring */}
                <Pie
                  data={[{ name: "bg", value: 100 }]}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={80}
                  outerRadius={90}
                  fill="#F3F4F6"
                  dataKey="value"
                  stroke="none"
                />
                
                {/* Target indicator ring */}
                <Pie
                  data={targetData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={75}
                  outerRadius={78}
                  fill="#6366F1"
                  dataKey="value"
                  stroke="none"
                >
                  {targetData.map((entry, index) => (
                    <Cell key={`target-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                
                {/* Main occupancy gauge */}
                <Pie
                  data={gaugeData}
                  cx="50%"
                  cy="50%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={85}
                  outerRadius={110}
                  dataKey="value"
                  stroke="none"
                >
                  {gaugeData.map((entry, index) => (
                    <Cell key={`gauge-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-900">
                {occupancyData.occupancyPercentage}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Leased
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats below gauge */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {occupancyData.target}%
            </div>
            <div className="text-sm text-gray-500">
              Target
            </div>
          </div>
          
          <div className="text-center">
            <div className={`text-2xl font-semibold flex items-center justify-center gap-1 ${
              occupancyData.isAboveTarget ? 'text-green-600' : 'text-red-600'
            }`}>
              {occupancyData.isAboveTarget ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {occupancyData.isAboveTarget ? '+' : ''}{occupancyData.delta}%
            </div>
            <div className="text-sm text-gray-500">
              vs Target
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {(occupancyData.leasedSquareFeet / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-500">
              SF Leased
            </div>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="mt-4 flex justify-center">
          <Badge 
            variant={occupancyData.isAboveTarget ? "default" : "destructive"}
            className={occupancyData.isAboveTarget ? "bg-green-100 text-green-800 border-green-200" : ""}
          >
            {occupancyData.isAboveTarget 
              ? `${occupancyData.delta}% above target` 
              : `${Math.abs(occupancyData.delta)}% below target`
            }
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
} 