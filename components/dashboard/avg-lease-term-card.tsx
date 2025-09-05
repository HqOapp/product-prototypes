"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { 
  piedmontLocationPerformance, 
  getRegionalTotals, 
  getCityData,
  cityNameMapping,
  piedmontRegionalGroupings
} from "@/lib/financialPerformanceByLocation"

interface AvgLeaseTermCardProps {
  filters: {
    region: string
    building: string
  }
}

// Average lease term data by location (in years)
const avgLeaseTermByLocation = {
  // Portfolio default
  "Total": 5.6,
  
  // Cities - newer/larger buildings have longer terms
  "Atlanta": 6.2,
  "Dallas": 5.9,
  "Orlando": 4.8,
  "Northern Virginia / Washington, D.C.": 5.3,
  "New York": 4.8,
  "Minneapolis": 5.4,
  "Boston": 5.1,
  "Other (includes Houston)": 5.7
}

// Regional averages (weighted by major cities)
const avgLeaseTermByRegion = {
  "Southeast": 5.8, // Atlanta (6.2) + Orlando (4.8) weighted by size
  "Central Region": 5.7, // Dallas (5.9) + Minneapolis (5.4) weighted
  "Northeast": 5.0 // DC/NoVA (5.3) + NY (4.8) + Boston (5.1) weighted
}

export function AvgLeaseTermCard({ filters }: AvgLeaseTermCardProps) {
  const { currentMode } = useCustomerMode()
  
  // Calculate lease term data based on filters
  const { avgTerm, scopeTitle, leasedSF, cityLeaderboard } = useMemo(() => {
    if (currentMode === "piedmont") {
      // Check if we're filtering by a specific city
      const cityFilterMatch = Object.entries(cityNameMapping).find(([key, value]) => 
        key === filters.region || value === filters.region
      )
      
      if (cityFilterMatch) {
        // City-level filtering
        const cityData = getCityData(filters.region)
        if (cityData && cityData.location !== "Total") {
          const cityTerm = avgLeaseTermByLocation[cityData.location as keyof typeof avgLeaseTermByLocation] || 5.6
          const cityLeasedSF = Math.round(cityData.rentableSquareFeet * (cityData.percentLeased / 100))
          
          // For single city, show comparison with 2 other nearby cities
          const otherCities = Object.entries(avgLeaseTermByLocation)
            .filter(([name, _]) => name !== cityData.location && name !== "Total")
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([name, value]) => ({ name, value }))
          
          return {
            avgTerm: cityTerm,
            scopeTitle: cityData.location,
            leasedSF: cityLeasedSF,
            cityLeaderboard: [
              { name: cityData.location, value: cityTerm },
              ...otherCities
            ]
          }
        }
      }
      
      // Check if we're filtering by region
      if (filters.region && filters.region !== "all") {
        const regionalData = getRegionalTotals(filters.region)
        if (regionalData.locations.length > 0) {
          const regionTerm = avgLeaseTermByRegion[filters.region as keyof typeof avgLeaseTermByRegion] || 5.6
          const regionLeasedSF = Math.round(regionalData.totalSquareFeet * (regionalData.weightedOccupancy / 100))
          
          // Show cities in this region
          const citiesInRegion = piedmontRegionalGroupings[filters.region as keyof typeof piedmontRegionalGroupings] || []
          const regionCityLeaderboard = citiesInRegion
            .map(cityName => ({
              name: cityName,
              value: avgLeaseTermByLocation[cityName as keyof typeof avgLeaseTermByLocation] || 5.6
            }))
            .sort((a, b) => b.value - a.value)
          
          return {
            avgTerm: regionTerm,
            scopeTitle: filters.region,
            leasedSF: regionLeasedSF,
            cityLeaderboard: regionCityLeaderboard.slice(0, 3)
          }
        }
      }
      
      // Portfolio-wide (all regions) - show top 3 cities
      const portfolioTotal = piedmontLocationPerformance.find(loc => loc.location === "Total")
      const portfolioLeasedSF = portfolioTotal ? Math.round(portfolioTotal.rentableSquareFeet * (portfolioTotal.percentLeased / 100)) : 16100000
      
      const topCities = Object.entries(avgLeaseTermByLocation)
        .filter(([name, _]) => name !== "Total")
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([name, value]) => ({ name, value }))
      
      return {
        avgTerm: avgLeaseTermByLocation.Total,
        scopeTitle: "Portfolio",
        leasedSF: portfolioLeasedSF,
        cityLeaderboard: topCities
      }
    }

    // Non-Piedmont mode: use mock data
    const mockCityLeaderboard = [
      { name: "Dallas", value: 5.9 },
      { name: "Atlanta", value: 6.2 },
      { name: "Orlando", value: 4.8 }
    ]
    
    return {
      avgTerm: 4.8, // Slightly lower for mock portfolio
      scopeTitle: "Portfolio",
      leasedSF: 8500000, // Mock leased SF
      cityLeaderboard: mockCityLeaderboard
    }
  }, [filters, currentMode])

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          Average Lease Term Remaining
        </CardTitle>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-[280px]">
          {/* Main KPI Number */}
          <div className="text-center pt-6 pb-4">
            <div className="text-6xl font-bold text-gray-900 mb-2">
              {avgTerm.toFixed(1)}
            </div>
            <div className="text-2xl font-semibold text-gray-600">
              Years
            </div>
          </div>
          
          {/* Subtle Divider */}
          <div className="border-t border-gray-100 my-4"></div>
          
          {/* City Leaderboard */}
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-500 mb-3">
              {scopeTitle === "Portfolio" ? "Top Markets" : 
               filters.region && filters.region !== "all" ? `${scopeTitle} Markets` : 
               "Comparison"}
            </div>
            <div className="space-y-2 font-mono text-sm">
              {cityLeaderboard.map((city, index) => (
                <div key={city.name} className="flex justify-between items-center">
                  <span className="text-gray-700 truncate pr-2" title={city.name}>
                    {city.name.length > 20 ? `${city.name.substring(0, 17)}...` : city.name}
                  </span>
                  <span className="text-gray-900 font-semibold tabular-nums">
                    {city.value.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Caption */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              Weighted average across {(leasedSF / 1000000).toFixed(1)}M leased SF
              {scopeTitle !== "Portfolio" && ` in ${scopeTitle}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 