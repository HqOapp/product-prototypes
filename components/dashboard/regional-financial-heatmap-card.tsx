"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Map, Download } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"

// Lazy load the map component to avoid SSR issues
const LeafletMap = dynamic(() => import("./leaflet-map").then(mod => ({ default: mod.default })), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Map className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    </div>
  )
}) as React.ComponentType<{
  mapData: (Region & { aggregatedValue?: number })[]
  selectedMetric: keyof BuildingMetrics
  mapBounds: { north: number; south: number; east: number; west: number } | null
  onBuildingClick: (buildingId: string | undefined) => void
}>

interface RegionalFinancialHeatMapCardProps {
  filters: {
    region: string
    building: string
  }
}

// Data interfaces
interface BuildingMetrics {
  NOI: number
  ALR: number
  vacancyRate: number
  occupancy: number
  rentPerSqFt: number
}

interface Building {
  name: string
  latitude: number
  longitude: number
  metrics: BuildingMetrics
  buildingId?: string
}

interface City {
  name: string
  buildings: Building[]
}

interface Region {
  region: string
  cities: City[]
  color?: string
}

// Piedmont real data with all buildings
const piedmontMapData: Region[] = [
  {
    region: "Southeast",
    color: "#10b981", // emerald-500
    cities: [
      {
        name: "Atlanta",
        buildings: [
          {
            name: "999 Peachtree",
            latitude: 33.7717,
            longitude: -84.3844,
            buildingId: "piedmont-atlanta-001",
            metrics: { NOI: 18.6, ALR: 21.2, vacancyRate: 5.9, occupancy: 94.1, rentPerSqFt: 32.50 }
          },
          {
            name: "Galleria 400",
            latitude: 33.8832,
            longitude: -84.4655,
            buildingId: "piedmont-atlanta-002",
            metrics: { NOI: 15.2, ALR: 18.1, vacancyRate: 7.2, occupancy: 92.8, rentPerSqFt: 29.75 }
          },
          {
            name: "Galleria 600",
            latitude: 33.8825,
            longitude: -84.4640,
            buildingId: "piedmont-atlanta-003",
            metrics: { NOI: 16.8, ALR: 19.5, vacancyRate: 6.1, occupancy: 93.9, rentPerSqFt: 31.25 }
          },
          {
            name: "Glenridge Highlands I",
            latitude: 33.8507,
            longitude: -84.2277,
            buildingId: "piedmont-atlanta-004",
            metrics: { NOI: 12.3, ALR: 14.8, vacancyRate: 8.5, occupancy: 91.5, rentPerSqFt: 27.50 }
          },
          {
            name: "Glenridge Highlands II",
            latitude: 33.8515,
            longitude: -84.2285,
            buildingId: "piedmont-atlanta-005",
            metrics: { NOI: 13.1, ALR: 15.6, vacancyRate: 7.8, occupancy: 92.2, rentPerSqFt: 28.00 }
          }
        ]
      },
      {
        name: "Orlando",
        buildings: [
          {
            name: "CNL Center I",
            latitude: 28.5417,
            longitude: -81.3812,
            buildingId: "piedmont-orlando-001",
            metrics: { NOI: 14.5, ALR: 17.2, vacancyRate: 6.8, occupancy: 93.2, rentPerSqFt: 26.75 }
          },
          {
            name: "CNL Center II",
            latitude: 28.5422,
            longitude: -81.3805,
            buildingId: "piedmont-orlando-002",
            metrics: { NOI: 13.8, ALR: 16.4, vacancyRate: 7.5, occupancy: 92.5, rentPerSqFt: 25.50 }
          },
          {
            name: "200 South Orange",
            latitude: 28.5383,
            longitude: -81.3792,
            buildingId: "piedmont-orlando-003",
            metrics: { NOI: 16.2, ALR: 19.1, vacancyRate: 5.2, occupancy: 94.8, rentPerSqFt: 28.25 }
          },
          {
            name: "SunTrust Plaza",
            latitude: 28.5456,
            longitude: -81.3763,
            buildingId: "piedmont-orlando-004",
            metrics: { NOI: 18.9, ALR: 22.3, vacancyRate: 4.1, occupancy: 95.9, rentPerSqFt: 32.00 }
          }
        ]
      }
    ]
  },
  {
    region: "Central",
    color: "#3b82f6", // blue-500
    cities: [
      {
        name: "Dallas",
        buildings: [
          {
            name: "500 Dallas Parkway",
            latitude: 32.7767,
            longitude: -96.7970,
            buildingId: "piedmont-dallas-001",
            metrics: { NOI: 22.1, ALR: 24.8, vacancyRate: 12.3, occupancy: 87.7, rentPerSqFt: 28.75 }
          },
          {
            name: "6565 N MacArthur Boulevard",
            latitude: 32.8207,
            longitude: -96.8567,
            buildingId: "piedmont-dallas-002",
            metrics: { NOI: 18.3, ALR: 21.7, vacancyRate: 9.8, occupancy: 90.2, rentPerSqFt: 26.50 }
          },
          {
            name: "Las Colinas Corporate Center I",
            latitude: 32.8456,
            longitude: -96.9426,
            buildingId: "piedmont-dallas-003",
            metrics: { NOI: 15.7, ALR: 18.9, vacancyRate: 11.2, occupancy: 88.8, rentPerSqFt: 24.75 }
          },
          {
            name: "Las Colinas Corporate Center II",
            latitude: 32.8465,
            longitude: -96.9435,
            buildingId: "piedmont-dallas-004",
            metrics: { NOI: 16.8, ALR: 20.1, vacancyRate: 10.5, occupancy: 89.5, rentPerSqFt: 25.25 }
          }
        ]
      },
      {
        name: "Minneapolis",
        buildings: [
          {
            name: "US Bancorp Center",
            latitude: 44.9778,
            longitude: -93.2650,
            buildingId: "piedmont-minneapolis-001",
            metrics: { NOI: 24.2, ALR: 27.9, vacancyRate: 6.3, occupancy: 93.7, rentPerSqFt: 34.50 }
          }
        ]
      }
    ]
  },
  {
    region: "Northeast", 
    color: "#8b5cf6", // violet-500
    cities: [
      {
        name: "New York",
        buildings: [
          {
            name: "60 Broad Street",
            latitude: 40.7058,
            longitude: -74.0111,
            buildingId: "piedmont-ny-001",
            metrics: { NOI: 45.8, ALR: 52.3, vacancyRate: 3.2, occupancy: 96.8, rentPerSqFt: 65.00 }
          }
        ]
      },
      {
        name: "Boston",
        buildings: [
          {
            name: "1200 Crown Colony",
            latitude: 42.2506,
            longitude: -71.0275,
            buildingId: "piedmont-boston-001",
            metrics: { NOI: 28.7, ALR: 33.1, vacancyRate: 4.8, occupancy: 95.2, rentPerSqFt: 42.25 }
          }
        ]
      },
      {
        name: "Arlington",
        buildings: [
          {
            name: "4250 North Fairfax",
            latitude: 38.8816,
            longitude: -77.1364,
            buildingId: "piedmont-arlington-001",
            metrics: { NOI: 32.4, ALR: 37.6, vacancyRate: 5.5, occupancy: 94.5, rentPerSqFt: 48.75 }
          }
        ]
      }
    ]
  }
]

// Mock data for other customers
const mockMapData: Region[] = [
  {
    region: "Northeast",
    color: "#8b5cf6", // violet-500
    cities: [
      {
        name: "New York",
        buildings: [
          {
            name: "Empire Center",
            latitude: 40.7128,
            longitude: -74.0060,
            buildingId: "mock-ny-001",
            metrics: {
              NOI: 45.2,
              ALR: 52.1,
              vacancyRate: 8.2,
              occupancy: 91.8,
              rentPerSqFt: 42.00
            }
          }
        ]
      },
      {
        name: "Boston",
        buildings: [
          {
            name: "Harbor Plaza",
            latitude: 42.3601,
            longitude: -71.0589,
            buildingId: "mock-boston-001",
            metrics: {
              NOI: 28.7,
              ALR: 33.4,
              vacancyRate: 6.1,
              occupancy: 93.9,
              rentPerSqFt: 38.50
            }
          }
        ]
      }
    ]
  },
  {
    region: "Southeast",
    color: "#10b981", // emerald-500
    cities: [
      {
        name: "Miami",
        buildings: [
          {
            name: "Biscayne Tower",
            latitude: 25.7617,
            longitude: -80.1918,
            buildingId: "mock-miami-001",
            metrics: {
              NOI: 31.5,
              ALR: 36.8,
              vacancyRate: 9.4,
              occupancy: 90.6,
              rentPerSqFt: 35.75
            }
          }
        ]
      },
      {
        name: "Orlando",
        buildings: [
          {
            name: "Central Plaza",
            latitude: 28.5383,
            longitude: -81.3792,
            buildingId: "mock-orlando-001",
            metrics: {
              NOI: 19.8,
              ALR: 23.2,
              vacancyRate: 11.7,
              occupancy: 88.3,
              rentPerSqFt: 28.25
            }
          }
        ]
      }
    ]
  },
  {
    region: "Central",
    color: "#3b82f6", // blue-500
    cities: [
      {
        name: "Chicago",
        buildings: [
          {
            name: "Millennium Center",
            latitude: 41.8781,
            longitude: -87.6298,
            buildingId: "mock-chicago-001",
            metrics: {
              NOI: 38.9,
              ALR: 44.6,
              vacancyRate: 7.8,
              occupancy: 92.2,
              rentPerSqFt: 33.50
            }
          }
        ]
      }
    ]
  },
  {
    region: "West",
    color: "#f59e0b", // amber-500
    cities: [
      {
        name: "Los Angeles",
        buildings: [
          {
            name: "Sunset Boulevard Tower",
            latitude: 34.0522,
            longitude: -118.2437,
            buildingId: "mock-la-001",
            metrics: {
              NOI: 52.3,
              ALR: 58.7,
              vacancyRate: 5.2,
              occupancy: 94.8,
              rentPerSqFt: 48.00
            }
          }
        ]
      },
      {
        name: "San Francisco",
        buildings: [
          {
            name: "Golden Gate Center",
            latitude: 37.7749,
            longitude: -122.4194,
            buildingId: "mock-sf-001",
            metrics: {
              NOI: 67.8,
              ALR: 74.2,
              vacancyRate: 4.1,
              occupancy: 95.9,
              rentPerSqFt: 62.50
            }
          }
        ]
      }
    ]
  }
]

const METRIC_OPTIONS = [
  { value: "NOI", label: "NOI ($M)" },
  { value: "ALR", label: "ALR ($M)" },
  { value: "vacancyRate", label: "Vacancy Rate (%)" },
  { value: "occupancy", label: "Occupancy (%)" },
  { value: "rentPerSqFt", label: "Rent Per SqFt ($)" }
]

export function RegionalFinancialHeatMapCard({ filters }: RegionalFinancialHeatMapCardProps) {
  const { currentMode } = useCustomerMode()
  const [selectedMetric, setSelectedMetric] = useState<keyof BuildingMetrics>("NOI")
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["All"])

  // Debug log for metric changes
  useEffect(() => {
    console.log("Selected metric changed to:", selectedMetric)
  }, [selectedMetric])

  // Get appropriate data based on customer mode
  const mapData = useMemo(() => {
    return currentMode === "piedmont" ? piedmontMapData : mockMapData
  }, [currentMode])

  // Get available regions
  const availableRegions = useMemo(() => {
    const regions = ["All", ...mapData.map(r => r.region)]
    return regions
  }, [mapData])

  // Filter data based on selected regions
  const filteredMapData = useMemo(() => {
    if (selectedRegions.includes("All")) {
      return mapData
    }
    return mapData.filter(region => selectedRegions.includes(region.region))
  }, [mapData, selectedRegions])

  // Calculate region aggregated metrics
  const regionMetrics = useMemo(() => {
    return filteredMapData.map(region => {
      const allBuildings = region.cities.flatMap(city => city.buildings)
      const totalBuildings = allBuildings.length
      
      if (totalBuildings === 0) return { ...region, aggregatedValue: 0 }

      let aggregatedValue = 0
      
      if (selectedMetric === "ALR" || selectedMetric === "NOI") {
        // Sum for revenue metrics
        aggregatedValue = allBuildings.reduce((sum, building) => sum + building.metrics[selectedMetric], 0)
      } else {
        // Average for percentage metrics
        aggregatedValue = allBuildings.reduce((sum, building) => sum + building.metrics[selectedMetric], 0) / totalBuildings
      }

      return {
        ...region,
        aggregatedValue
      }
    })
  }, [filteredMapData, selectedMetric])

  // Handle region filter toggle
  const toggleRegion = (region: string) => {
    if (region === "All") {
      setSelectedRegions(["All"])
    } else {
      const newSelected = selectedRegions.includes("All") 
        ? [region]
        : selectedRegions.includes(region)
          ? selectedRegions.filter(r => r !== region)
          : [...selectedRegions.filter(r => r !== "All"), region]
      
      setSelectedRegions(newSelected.length === 0 ? ["All"] : newSelected)
    }
  }

  // Calculate map bounds for auto-fitting
  const mapBounds = useMemo(() => {
    const allBuildings = filteredMapData.flatMap(region => 
      region.cities.flatMap(city => city.buildings)
    )
    
    if (allBuildings.length === 0) return null

    const lats = allBuildings.map(b => b.latitude)
    const lngs = allBuildings.map(b => b.longitude)
    
    return {
      north: Math.max(...lats) + 2,
      south: Math.min(...lats) - 2,
      east: Math.max(...lngs) + 2,
      west: Math.min(...lngs) - 2
    }
  }, [filteredMapData])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-semibold">
            Regional Financial Performance Map
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            Geographic distribution of portfolio metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as keyof BuildingMetrics)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent className="z-[1000]">
              {METRIC_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-3 w-3" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Region Filter Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {availableRegions.map((region) => (
            <Badge
              key={region}
              variant={selectedRegions.includes(region) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20"
              onClick={() => toggleRegion(region)}
            >
              {region}
            </Badge>
          ))}
        </div>

        {/* Map Container */}
        <div className="w-full h-[500px] rounded-lg overflow-hidden border">
          <LeafletMap
            mapData={regionMetrics}
            selectedMetric={selectedMetric}
            mapBounds={mapBounds}
            onBuildingClick={(buildingId: string | undefined) => {
              if (buildingId && buildingId.startsWith("piedmont-")) {
                // Navigate to building detail page when implemented
                console.log("Navigate to building:", buildingId)
              }
            }}
          />
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#10b981" }}></div>
                <span>Southeast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#3b82f6" }}></div>
                <span>Central</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#8b5cf6" }}></div>
                <span>Northeast</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                <span className="text-xs">Small</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-xs">Large</span>
              </div>
              <span className="text-xs text-gray-400">Size = {selectedMetric}</span>
            </div>
          </div>
          <div className="text-right">
            <p>Dot size represents {selectedMetric} • Color represents region • Click buildings for details</p>
            <p className="mt-1">
              Total Buildings: {filteredMapData.reduce((sum, region) => 
                sum + region.cities.reduce((citySum, city) => citySum + city.buildings.length, 0), 0
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 