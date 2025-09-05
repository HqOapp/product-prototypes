"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { mockBuildings, mockLeases, mockTenants } from "@/lib/mockData"
import { piedmontBuildings, piedmontLeases } from "@/lib/piedmontBuildings"
import { 
  piedmontLocationPerformance, 
  getRegionalTotals, 
  getCityData,
  cityNameMapping 
} from "@/lib/financialPerformanceByLocation"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface LeaseTermDistributionCardProps {
  filters: {
    region: string
    building: string
  }
}

interface TermBucketData {
  bucket: string
  rsf: number
  percent: number
  urlParam: string
  leaseCount: number
}

export function LeaseTermDistributionCard({ filters }: LeaseTermDistributionCardProps) {
  const router = useRouter()
  const { currentMode } = useCustomerMode()

  // Get appropriate data based on customer mode
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

  // Calculate lease term distribution based on filters
  const { termDistributionData, totalRSF, scopeTitle } = useMemo(() => {
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
            scopeDesc = filters.region
          }
        }
      } else {
        // For demo mode, filter by region
        const regionBuildings = buildings.filter(b => 
          b.city?.toLowerCase().includes(filters.region.toLowerCase()) ||
          b.state?.toLowerCase().includes(filters.region.toLowerCase())
        )
        const regionBuildingIds = regionBuildings.map(b => b.uuid)
        filteredLeases = leases.filter(lease => regionBuildingIds.includes(lease.building_id))
        scopeDesc = filters.region
      }
    }

    // Calculate remaining lease terms and RSF by bucket
    const now = new Date()
    const termBuckets = {
      "<1": { rsf: 0, count: 0, urlParam: "0-1" },
      "1-3": { rsf: 0, count: 0, urlParam: "1-3" },
      "3-5": { rsf: 0, count: 0, urlParam: "3-5" },
      "5-10": { rsf: 0, count: 0, urlParam: "5-10" },
      "10+": { rsf: 0, count: 0, urlParam: "10-plus" }
    }

    filteredLeases.forEach(lease => {
      if (!lease.expiration_date) return
      
      const expirationDate = new Date(lease.expiration_date)
      const yearsRemaining = (expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      
      // Get building to find RSF data
      const building = buildings.find(b => b.uuid === lease.building_id)
      const leaseRSF = building?.total_rentable_area || 50000 // Default RSF if not found
      
      // Categorize into buckets
      if (yearsRemaining < 1) {
        termBuckets["<1"].rsf += leaseRSF
        termBuckets["<1"].count++
      } else if (yearsRemaining < 3) {
        termBuckets["1-3"].rsf += leaseRSF
        termBuckets["1-3"].count++
      } else if (yearsRemaining < 5) {
        termBuckets["3-5"].rsf += leaseRSF
        termBuckets["3-5"].count++
      } else if (yearsRemaining < 10) {
        termBuckets["5-10"].rsf += leaseRSF
        termBuckets["5-10"].count++
      } else {
        termBuckets["10+"].rsf += leaseRSF
        termBuckets["10+"].count++
      }
    })

    // Calculate total RSF
    const totalSquareFeet = Object.values(termBuckets).reduce((sum, bucket) => sum + bucket.rsf, 0)

    // Convert to display format
    const termDistribution: TermBucketData[] = [
      {
        bucket: "<1 Year",
        rsf: termBuckets["<1"].rsf / 1000000, // Convert to millions
        percent: totalSquareFeet > 0 ? (termBuckets["<1"].rsf / totalSquareFeet) * 100 : 0,
        urlParam: termBuckets["<1"].urlParam,
        leaseCount: termBuckets["<1"].count
      },
      {
        bucket: "1–3 Years",
        rsf: termBuckets["1-3"].rsf / 1000000,
        percent: totalSquareFeet > 0 ? (termBuckets["1-3"].rsf / totalSquareFeet) * 100 : 0,
        urlParam: termBuckets["1-3"].urlParam,
        leaseCount: termBuckets["1-3"].count
      },
      {
        bucket: "3–5 Years",
        rsf: termBuckets["3-5"].rsf / 1000000,
        percent: totalSquareFeet > 0 ? (termBuckets["3-5"].rsf / totalSquareFeet) * 100 : 0,
        urlParam: termBuckets["3-5"].urlParam,
        leaseCount: termBuckets["3-5"].count
      },
      {
        bucket: "5–10 Years",
        rsf: termBuckets["5-10"].rsf / 1000000,
        percent: totalSquareFeet > 0 ? (termBuckets["5-10"].rsf / totalSquareFeet) * 100 : 0,
        urlParam: termBuckets["5-10"].urlParam,
        leaseCount: termBuckets["5-10"].count
      },
      {
        bucket: "10+ Years",
        rsf: termBuckets["10+"].rsf / 1000000,
        percent: totalSquareFeet > 0 ? (termBuckets["10+"].rsf / totalSquareFeet) * 100 : 0,
        urlParam: termBuckets["10+"].urlParam,
        leaseCount: termBuckets["10+"].count
      }
    ]

    // Fallback data if no real data
    if (totalSquareFeet === 0) {
      const fallbackData: TermBucketData[] = [
        { bucket: "<1 Year", rsf: 1.2, percent: 8.1, urlParam: "0-1", leaseCount: 3 },
        { bucket: "1–3 Years", rsf: 3.9, percent: 25.5, urlParam: "1-3", leaseCount: 12 },
        { bucket: "3–5 Years", rsf: 4.2, percent: 27.4, urlParam: "3-5", leaseCount: 15 },
        { bucket: "5–10 Years", rsf: 4.8, percent: 31.4, urlParam: "5-10", leaseCount: 18 },
        { bucket: "10+ Years", rsf: 1.2, percent: 7.6, urlParam: "10-plus", leaseCount: 6 }
      ]
      
      return {
        termDistributionData: fallbackData,
        totalRSF: 15.3,
        scopeTitle: scopeDesc
      }
    }

    return {
      termDistributionData: termDistribution,
      totalRSF: totalSquareFeet / 1000000,
      scopeTitle: scopeDesc
    }
  }, [filters, leases, buildings, currentMode])

  // Handle bar click navigation
  const handleBarClick = (data: TermBucketData) => {
    router.push(`/leases?term=${data.urlParam}`)
  }

  // Handle view leases button click
  const handleViewLeases = () => {
    router.push("/leases")
  }

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TermBucketData
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-900">{data.bucket}</p>
          <p className="text-blue-600">
            {data.rsf.toFixed(1)}M SF – {data.percent.toFixed(1)}% of portfolio
          </p>
          <p className="text-gray-600 text-sm">
            {data.leaseCount} {data.leaseCount === 1 ? 'lease' : 'leases'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Click to view leases</p>
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
            Lease Term Remaining
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Distribution of total RSF by remaining lease term
            {scopeTitle !== "Portfolio" && ` in ${scopeTitle}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewLeases}
            className="gap-1 text-xs"
          >
            View Leases
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={termDistributionData}
              margin={{ top: 20, right: 20, left: 40, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="bucket" 
                tick={{ fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => `${value.toFixed(1)}M`}
                label={{ value: 'SF (M)', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="rsf" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                onClick={(data) => handleBarClick(data)}
                style={{ cursor: "pointer" }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Bottom summary */}
        <div className="text-center pt-3 border-t">
          <p className="text-xs text-gray-500">
            Total Portfolio: {totalRSF.toFixed(1)}M RSF
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Click any bar to view filtered lease list
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 