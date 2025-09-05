"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { getRegionalTotals, getCityData, cityNameMapping } from "@/lib/financialPerformanceByLocation"

interface NOITrendCardProps {
  filters: {
    region: string
    building: string
  }
}

// Realistic Piedmont-style NOI trend data
const portfolioNOITrendData = [
  { year: 2019, noi: 301.2 },
  { year: 2020, noi: 289.7 },
  { year: 2021, noi: 312.4 },
  { year: 2022, noi: 324.1 },
  { year: 2023, noi: 321.7 },
  { year: 2024, noi: 335.5 },
  { year: 2025, noi: 341.8 } // projected
]

// Regional NOI data (scaled appropriately from portfolio)
const regionalNOIData = {
  "Southeast": [
    { year: 2019, noi: 123.5 },
    { year: 2020, noi: 118.8 },
    { year: 2021, noi: 128.1 },
    { year: 2022, noi: 132.9 },
    { year: 2023, noi: 131.9 },
    { year: 2024, noi: 137.6 },
    { year: 2025, noi: 140.2 }
  ],
  "Central Region": [
    { year: 2019, noi: 92.4 },
    { year: 2020, noi: 88.9 },
    { year: 2021, noi: 95.8 },
    { year: 2022, noi: 99.4 },
    { year: 2023, noi: 98.7 },
    { year: 2024, noi: 102.9 },
    { year: 2025, noi: 104.8 }
  ],
  "Northeast": [
    { year: 2019, noi: 85.3 },
    { year: 2020, noi: 82.0 },
    { year: 2021, noi: 88.5 },
    { year: 2022, noi: 91.8 },
    { year: 2023, noi: 91.1 },
    { year: 2024, noi: 95.0 },
    { year: 2025, noi: 96.8 }
  ]
}

// City-level NOI data (scaled from regional data)
const cityNOIData = {
  "Atlanta": [
    { year: 2019, noi: 78.2 },
    { year: 2020, noi: 75.3 },
    { year: 2021, noi: 81.1 },
    { year: 2022, noi: 84.2 },
    { year: 2023, noi: 83.6 },
    { year: 2024, noi: 87.2 },
    { year: 2025, noi: 88.9 }
  ],
  "Dallas": [
    { year: 2019, noi: 55.8 },
    { year: 2020, noi: 53.7 },
    { year: 2021, noi: 57.9 },
    { year: 2022, noi: 60.1 },
    { year: 2023, noi: 59.6 },
    { year: 2024, noi: 62.1 },
    { year: 2025, noi: 63.3 }
  ],
  "Orlando": [
    { year: 2019, noi: 45.3 },
    { year: 2020, noi: 43.5 },
    { year: 2021, noi: 47.0 },
    { year: 2022, noi: 48.7 },
    { year: 2023, noi: 48.3 },
    { year: 2024, noi: 50.4 },
    { year: 2025, noi: 51.3 }
  ],
  "Northern Virginia / Washington, D.C.": [
    { year: 2019, noi: 42.1 },
    { year: 2020, noi: 40.5 },
    { year: 2021, noi: 43.7 },
    { year: 2022, noi: 45.3 },
    { year: 2023, noi: 44.9 },
    { year: 2024, noi: 46.8 },
    { year: 2025, noi: 47.7 }
  ],
  "New York": [
    { year: 2019, noi: 28.4 },
    { year: 2020, noi: 27.3 },
    { year: 2021, noi: 29.5 },
    { year: 2022, noi: 30.6 },
    { year: 2023, noi: 30.3 },
    { year: 2024, noi: 31.6 },
    { year: 2025, noi: 32.2 }
  ],
  "Minneapolis": [
    { year: 2019, noi: 36.6 },
    { year: 2020, noi: 35.2 },
    { year: 2021, noi: 37.9 },
    { year: 2022, noi: 39.3 },
    { year: 2023, noi: 39.1 },
    { year: 2024, noi: 40.8 },
    { year: 2025, noi: 41.5 }
  ],
  "Boston": [
    { year: 2019, noi: 14.8 },
    { year: 2020, noi: 14.2 },
    { year: 2021, noi: 15.3 },
    { year: 2022, noi: 15.9 },
    { year: 2023, noi: 15.9 },
    { year: 2024, noi: 16.6 },
    { year: 2025, noi: 16.9 }
  ]
}

export function NOITrendCard({ filters }: NOITrendCardProps) {
  const { currentMode } = useCustomerMode()
  
  // Get appropriate NOI trend data based on filters
  const { noiData, scopeTitle } = useMemo(() => {
    if (currentMode === "piedmont") {
      // Check if we're filtering by a specific city
      const cityFilterMatch = Object.entries(cityNameMapping).find(([key, value]) => 
        key === filters.region || value === filters.region
      )
      
      if (cityFilterMatch) {
        // City-level filtering
        const cityData = getCityData(filters.region)
        if (cityData && cityData.location !== "Total") {
          const cityNOI = cityNOIData[cityData.location as keyof typeof cityNOIData]
          if (cityNOI) {
            return {
              noiData: cityNOI,
              scopeTitle: cityData.location
            }
          }
        }
      }
      
      // Check if we're filtering by region
      if (filters.region && filters.region !== "all") {
        const regionalNOI = regionalNOIData[filters.region as keyof typeof regionalNOIData]
        if (regionalNOI) {
          return {
            noiData: regionalNOI,
            scopeTitle: filters.region
          }
        }
      }
      
      // Portfolio-wide (all regions)
      return {
        noiData: portfolioNOITrendData,
        scopeTitle: "Portfolio"
      }
    }

    // Non-Piedmont mode: use mock data
    return {
      noiData: portfolioNOITrendData.map(item => ({
        ...item,
        noi: item.noi * 0.6 // Scale down for mock data
      })),
      scopeTitle: "Portfolio"
    }
  }, [filters, currentMode])

  // Calculate year-over-year delta
  const currentYearData = noiData.find(item => item.year === 2024)
  const previousYearData = noiData.find(item => item.year === 2023)
  
  const currentYearNOI = currentYearData?.noi || 0
  const previousYearNOI = previousYearData?.noi || 0
  const yoyDelta = previousYearNOI > 0 ? ((currentYearNOI - previousYearNOI) / previousYearNOI) * 100 : 0
  const isPositive = yoyDelta >= 0

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`Year: ${label}`}</p>
          <p className="text-blue-600">
            {`NOI: $${payload[0].value.toFixed(1)}M`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          NOI Trend (Year-over-Year)
        </CardTitle>
        <BarChart3 className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={noiData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="year" 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}M`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="noi" 
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Current year stats */}
        <div className="mt-6 text-center space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            2024 NOI: ${currentYearNOI.toFixed(1)}M
          </div>
          <div className={`text-lg font-semibold flex items-center justify-center gap-1 ${
            isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {isPositive ? '+' : ''}{yoyDelta.toFixed(1)}% vs 2023
          </div>
          {scopeTitle !== "Portfolio" && (
            <div className="text-sm text-gray-500">
              {scopeTitle} Region
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 