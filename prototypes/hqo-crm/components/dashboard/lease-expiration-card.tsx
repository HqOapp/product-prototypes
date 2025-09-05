"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { 
  piedmontLocationPerformance, 
  getRegionalTotals, 
  getCityData,
  cityNameMapping 
} from "@/lib/financialPerformanceByLocation"

interface LeaseExpirationCardProps {
  filters: {
    region: string
    building: string
  }
}

// Piedmont lease expiration data from 10-K (national view)
const baseLeaseExpirationData = [
  { year: "2025", rsf: 1206000 },
  { year: "2026", rsf: 1018000 },
  { year: "2027", rsf: 1170000 },
  { year: "2028", rsf: 1305000 },
  { year: "2029", rsf: 1123000 },
  { year: "2030", rsf: 790000 },
  { year: "2031", rsf: 480000 },
  { year: "2032", rsf: 210000 },
  { year: "Thereafter", rsf: 3950000 }
]

export function LeaseExpirationCard({ filters }: LeaseExpirationCardProps) {
  const { currentMode } = useCustomerMode()
  const [viewMode, setViewMode] = useState<"rsf" | "percentage">("rsf")
  
  // Calculate regional proportions and filtered data
  const { expirationData, scopeTitle, totalPortfolioRSF } = useMemo(() => {
    if (currentMode === "piedmont") {
      // Get total portfolio RSF for percentage calculations
      const portfolioTotal = piedmontLocationPerformance.find(loc => loc.location === "Total")
      const totalRSF = portfolioTotal?.rentableSquareFeet || 15323000
      
      // Check if we're filtering by a specific city
      const cityFilterMatch = Object.entries(cityNameMapping).find(([key, value]) => 
        key === filters.region || value === filters.region
      )
      
      if (cityFilterMatch) {
        // City-level filtering
        const cityData = getCityData(filters.region)
        if (cityData && cityData.location !== "Total") {
          const cityProportion = cityData.rentableSquareFeet / totalRSF
          const scaledData = baseLeaseExpirationData.map(item => ({
            ...item,
            rsf: Math.round(item.rsf * cityProportion)
          }))
          
          return {
            expirationData: scaledData,
            scopeTitle: cityData.location,
            totalPortfolioRSF: cityData.rentableSquareFeet
          }
        }
      }
      
      // Check if we're filtering by region
      if (filters.region && filters.region !== "all") {
        const regionalData = getRegionalTotals(filters.region)
        if (regionalData.locations.length > 0) {
          const regionProportion = regionalData.totalSquareFeet / totalRSF
          const scaledData = baseLeaseExpirationData.map(item => ({
            ...item,
            rsf: Math.round(item.rsf * regionProportion)
          }))
          
          return {
            expirationData: scaledData,
            scopeTitle: filters.region,
            totalPortfolioRSF: regionalData.totalSquareFeet
          }
        }
      }
      
      // Portfolio-wide (all regions)
      return {
        expirationData: baseLeaseExpirationData,
        scopeTitle: "Portfolio",
        totalPortfolioRSF: totalRSF
      }
    }

    // Non-Piedmont mode: use scaled mock data
    const mockData = baseLeaseExpirationData.map(item => ({
      ...item,
      rsf: Math.round(item.rsf * 0.6) // Scale down for mock data
    }))
    
    return {
      expirationData: mockData,
      scopeTitle: "Portfolio",
      totalPortfolioRSF: 9200000 // Mock portfolio total
    }
  }, [filters, currentMode])

  // Calculate display data based on view mode
  const displayData = useMemo(() => {
    if (viewMode === "percentage") {
      return expirationData.map(item => ({
        ...item,
        value: totalPortfolioRSF > 0 ? (item.rsf / totalPortfolioRSF) * 100 : 0,
        displayValue: totalPortfolioRSF > 0 ? `${((item.rsf / totalPortfolioRSF) * 100).toFixed(1)}%` : "0%"
      }))
    } else {
      return expirationData.map(item => ({
        ...item,
        value: item.rsf,
        displayValue: `${(item.rsf / 1000).toFixed(0)}K`
      }))
    }
  }, [expirationData, viewMode, totalPortfolioRSF])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <p className="text-blue-600">
            {viewMode === "percentage" 
              ? `${data.value.toFixed(1)}% of Portfolio`
              : `${(data.rsf / 1000000).toFixed(2)}M SF`
            }
          </p>
        </div>
      )
    }
    return null
  }

  // Determine chart title based on scope
  const getChartTitle = () => {
    if (scopeTitle === "Portfolio") {
      return "Lease Expiration Schedule"
    } else {
      return `Lease Expiration Schedule - ${scopeTitle}`
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          {getChartTitle()}
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={viewMode} onValueChange={(value: "rsf" | "percentage") => setViewMode(value)}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rsf">Total RSF Expiring</SelectItem>
              <SelectItem value="percentage">% of Portfolio Expiring</SelectItem>
            </SelectContent>
          </Select>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => 
                  viewMode === "percentage" ? `${value.toFixed(0)}%` : `${(value / 1000).toFixed(0)}K`
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary stats */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {viewMode === "percentage" 
                ? `${((expirationData.slice(0, 3).reduce((sum, item) => sum + item.rsf, 0) / totalPortfolioRSF) * 100).toFixed(1)}%`
                : `${(expirationData.slice(0, 3).reduce((sum, item) => sum + item.rsf, 0) / 1000000).toFixed(1)}M`
              }
            </div>
            <div className="text-sm text-gray-500">
              2025-2027 {viewMode === "percentage" ? "of Portfolio" : "SF"}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {viewMode === "percentage" 
                ? `${((expirationData.reduce((sum, item) => sum + item.rsf, 0) / totalPortfolioRSF) * 100).toFixed(1)}%`
                : `${(expirationData.reduce((sum, item) => sum + item.rsf, 0) / 1000000).toFixed(1)}M`
              }
            </div>
            <div className="text-sm text-gray-500">
              Total {viewMode === "percentage" ? "Portfolio" : "SF"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 