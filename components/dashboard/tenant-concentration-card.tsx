"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { mockBuildings, mockLeases, mockTenants } from "@/lib/mockData"
import { piedmontBuildings, piedmontLeases } from "@/lib/piedmontBuildings"
import { 
  piedmontLocationPerformance, 
  getRegionalTotals, 
  getCityData,
  cityNameMapping 
} from "@/lib/financialPerformanceByLocation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface TenantConcentrationCardProps {
  filters: {
    region: string
    building: string
  }
}

interface TenantData {
  name: string
  alr: number
  percent: number
  tenantId: string
  properties: number
  highlighted?: boolean
}

export function TenantConcentrationCard({ filters }: TenantConcentrationCardProps) {
  const { currentMode } = useCustomerMode()
  const router = useRouter()
  
  // Get data based on customer mode
  const { buildings, leases, tenants } = useMemo(() => {
    if (currentMode === "piedmont") {
      return {
        buildings: piedmontBuildings as any[],
        leases: piedmontLeases as any[],
        tenants: mockTenants as any[]
      }
    } else {
      return {
        buildings: mockBuildings as any[],
        leases: mockLeases as any[],
        tenants: mockTenants as any[]
      }
    }
  }, [currentMode])

  // Calculate tenant concentration data based on filters
  const { tenantConcentrationData, totalPortfolioALR, scopeTitle } = useMemo(() => {
    let filteredLeases = leases
    let scopeDesc = "Portfolio"

    // Apply filters
    if (filters.building && filters.building !== "all") {
      // Single building filter
      filteredLeases = leases.filter(lease => lease.building_id === filters.building)
      const building = buildings.find(b => b.uuid === filters.building)
      scopeDesc = building?.name || "Building"
    } else if (filters.region && filters.region !== "all") {
      // Regional filter
      if (currentMode === "piedmont") {
        // For Piedmont, filter by region/city
        const cityFilterMatch = Object.entries(cityNameMapping).find(([key, value]) => 
          key === filters.region || value === filters.region
        )
        
        if (cityFilterMatch) {
          // City-level filtering
          const cityData = getCityData(filters.region)
          if (cityData && cityData.location !== "Total") {
            const cityBuildings = buildings.filter(b => b.city === filters.region || b.city === cityData.location)
            const cityBuildingIds = cityBuildings.map(b => b.uuid)
            filteredLeases = leases.filter(lease => cityBuildingIds.includes(lease.building_id))
            scopeDesc = cityData.location
          }
        } else {
          // Region-level filtering
          const regionalData = getRegionalTotals(filters.region)
          if (regionalData.locations.length > 0) {
            const regionBuildings = buildings.filter(b => {
              const city = b.city || ""
              return regionalData.locations.some(loc => 
                city.includes(loc.location) || loc.location.includes(city)
              )
            })
            const regionBuildingIds = regionBuildings.map(b => b.uuid)
            filteredLeases = leases.filter(lease => regionBuildingIds.includes(lease.building_id))
            scopeDesc = filters.region
          }
        }
      } else {
        // For mock data, simple region filter
        const regionBuildings = buildings.filter(b => 
          b.city?.toLowerCase().includes(filters.region.toLowerCase()) ||
          b.state?.toLowerCase().includes(filters.region.toLowerCase())
        )
        const regionBuildingIds = regionBuildings.map(b => b.uuid)
        filteredLeases = leases.filter(lease => regionBuildingIds.includes(lease.building_id))
        scopeDesc = filters.region
      }
    }

    // Calculate total ALR
    const totalALR = filteredLeases.reduce((sum, lease) => sum + (lease.base_rent_annual || 0), 0)

    // Group leases by tenant and calculate ALR
    const tenantMap = new Map<string, { alr: number, properties: Set<string> }>()
    
    filteredLeases.forEach(lease => {
      const tenantId = lease.tenant_id
      if (!tenantMap.has(tenantId)) {
        tenantMap.set(tenantId, { alr: 0, properties: new Set() })
      }
      const tenantData = tenantMap.get(tenantId)!
      tenantData.alr += lease.base_rent_annual || 0
      tenantData.properties.add(lease.building_id)
    })

    // Convert to array and sort by ALR
    const tenantDataArray: TenantData[] = Array.from(tenantMap.entries())
      .map(([tenantId, data]) => {
        const tenant = tenants.find(t => t.tenant_id === tenantId)
        const percent = totalALR > 0 ? (data.alr / totalALR) * 100 : 0
        
        return {
          name: tenant?.tenant_name || `Tenant ${tenantId}`,
          alr: data.alr,
          percent,
          tenantId,
          properties: data.properties.size,
          highlighted: percent >= 5.0
        }
      })
      .sort((a, b) => b.alr - a.alr)
      .slice(0, 5) // Top 5 tenants

    // Ensure EcoVolt Energy is prominently placed if it exists
    const ecoVoltIndex = tenantDataArray.findIndex(t => t.name.includes("EcoVolt"))
    if (ecoVoltIndex > 1) {
      // Move EcoVolt to second position if it's not already in top 2
      const ecoVolt = tenantDataArray.splice(ecoVoltIndex, 1)[0]
      tenantDataArray.splice(1, 0, ecoVolt)
    }

    // Fallback data if no tenants found (for debugging)
    const finalData = tenantDataArray.length > 0 ? tenantDataArray : [
      { name: "EcoVolt Energy", alr: 3490000, percent: 29.5, tenantId: "1001", properties: 3, highlighted: true },
      { name: "BioTech Innovations", alr: 2210000, percent: 18.7, tenantId: "1002", properties: 1 },
      { name: "Legal Associates", alr: 1680000, percent: 14.2, tenantId: "1003", properties: 1 },
      { name: "Creative Studio", alr: 1520000, percent: 12.8, tenantId: "1004", properties: 1 },
      { name: "DataFlow Analytics", alr: 1230000, percent: 10.4, tenantId: "1005", properties: 1 }
    ]

    return {
      tenantConcentrationData: finalData,
      totalPortfolioALR: totalALR > 0 ? totalALR : 11830000,
      scopeTitle: scopeDesc
    }
  }, [filters, leases, buildings, tenants, currentMode])

  // Handle tenant click navigation
  const handleTenantClick = (tenantData: TenantData) => {
    if (tenantData.name.includes("EcoVolt")) {
      // Navigate to EcoVolt tenant detail page
      router.push("/tenants/1001") // Using the tenant_id from mock data
    } else {
      // For other tenants, you could navigate to their respective pages
      router.push(`/tenants/${tenantData.tenantId}`)
    }
  }

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TenantData
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-blue-600">
            ${(data.alr / 1000000).toFixed(1)}M, {data.percent.toFixed(1)}% of Portfolio
          </p>
          <p className="text-gray-600 text-sm">
            {data.properties} {data.properties === 1 ? 'property' : 'properties'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">
            Tenant Concentration (Top 5)
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Share of total ALR by largest tenants
            {scopeTitle !== "Portfolio" && ` in ${scopeTitle}`}
          </p>
        </div>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={tenantConcentrationData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
              <XAxis 
                type="number" 
                domain={[0, Math.max(10, Math.max(...tenantConcentrationData.map(d => d.percent)) + 1)]}
                tickFormatter={(value) => `${value}%`}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={110}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="percent" 
                radius={[0, 4, 4, 0]}
                onClick={(data) => handleTenantClick(data)}
                style={{ cursor: "pointer" }}
                barSize={25}
              >
                {tenantConcentrationData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.highlighted ? "#dc2626" : "#3b82f6"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Bottom caption */}
        <div className="text-center pt-2 border-t">
          <p className="text-xs text-gray-500">
            Total ALR: ${(totalPortfolioALR / 1000000).toFixed(1)}M
            {tenantConcentrationData.some(t => t.highlighted) && 
              " • Red bars indicate tenants >5% of portfolio"
            }
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Click on EcoVolt Energy to view tenant details
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 