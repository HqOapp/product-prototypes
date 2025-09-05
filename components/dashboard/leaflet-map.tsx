"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix for default markers in Leaflet with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

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
  aggregatedValue?: number
}

interface LeafletMapProps {
  mapData: Region[]
  selectedMetric: keyof BuildingMetrics
  mapBounds: {
    north: number
    south: number
    east: number
    west: number
  } | null
  onBuildingClick: (buildingId: string | undefined) => void
}

// Real US state boundaries and regional groupings
const getRegionGeoJSON = (regionName: string) => {
  // Define state groupings by region
  const statesByRegion: { [key: string]: string[] } = {
    Northeast: ["Maine", "New Hampshire", "Vermont", "Massachusetts", "Rhode Island", "Connecticut", "New York", "New Jersey", "Pennsylvania"],
    Southeast: ["Delaware", "Maryland", "Virginia", "West Virginia", "Kentucky", "Tennessee", "North Carolina", "South Carolina", "Georgia", "Florida", "Alabama", "Mississippi", "Arkansas", "Louisiana"],
    Central: ["Ohio", "Indiana", "Illinois", "Michigan", "Wisconsin", "Minnesota", "Iowa", "Missouri", "North Dakota", "South Dakota", "Nebraska", "Kansas", "Oklahoma", "Texas"],
    West: ["Montana", "Wyoming", "Colorado", "New Mexico", "Idaho", "Utah", "Arizona", "Nevada", "Washington", "Oregon", "California", "Alaska", "Hawaii"]
  }

  // Simplified state boundary coordinates (key major states for each region)
  const stateCoordinates: { [key: string]: number[][][] } = {
    // Northeast - approximate boundaries
    "Pennsylvania": [
      [
        [-80.519, 39.722], [-80.519, 42.269], [-74.689, 42.269], [-74.689, 45.013], 
        [-71.777, 45.013], [-71.777, 41.319], [-73.344, 41.319], [-73.344, 40.955], 
        [-74.027, 40.955], [-74.027, 39.722], [-80.519, 39.722]
      ]
    ],
    "New York": [
      [
        [-79.762, 40.496], [-79.762, 45.015], [-71.777, 45.015], [-71.777, 40.496], [-79.762, 40.496]
      ]
    ],
    
    // Southeast - approximate boundaries  
    "Georgia": [
      [
        [-85.605, 30.355], [-85.605, 35.001], [-80.751, 35.001], [-80.751, 30.355], [-85.605, 30.355]
      ]
    ],
    "Florida": [
      [
        [-87.635, 24.396], [-87.635, 31.001], [-80.031, 31.001], [-80.031, 24.396], [-87.635, 24.396]
      ]
    ],
    "North Carolina": [
      [
        [-84.322, 33.842], [-84.322, 36.588], [-75.460, 36.588], [-75.460, 33.842], [-84.322, 33.842]
      ]
    ],
    
    // Central - approximate boundaries
    "Texas": [
      [
        [-106.646, 25.837], [-106.646, 36.501], [-93.508, 36.501], [-93.508, 25.837], [-106.646, 25.837]
      ]
    ],
    "Illinois": [
      [
        [-91.513, 36.970], [-91.513, 42.508], [-87.495, 42.508], [-87.495, 36.970], [-91.513, 36.970]
      ]
    ],
    
    // West - approximate boundaries
    "California": [
      [
        [-124.482, 32.534], [-124.482, 42.009], [-114.131, 42.009], [-114.131, 32.534], [-124.482, 32.534]
      ]
    ],
    "Colorado": [
      [
        [-109.060, 36.993], [-109.060, 41.003], [-102.042, 41.003], [-102.042, 36.993], [-109.060, 36.993]
      ]
    ]
  }

  // Get states for this region and create combined boundaries
  const regionStates = statesByRegion[regionName] || []
  
  // For now, create a simplified combined boundary that encompasses the region's key states
  let combinedCoordinates: number[][][] = []
  
  if (regionName === "Northeast") {
    // Combined Northeast boundary (roughly ME to PA)
    combinedCoordinates = [
      [
        [-80.519, 39.722], [-80.519, 47.459], [-66.885, 47.459], [-66.885, 39.722], [-80.519, 39.722]
      ]
    ]
  } else if (regionName === "Southeast") {
    // Combined Southeast boundary (roughly DE to FL to TX)
    combinedCoordinates = [
      [
        [-84.322, 24.396], [-94.043, 24.396], [-94.043, 39.466], [-75.460, 39.466], [-75.460, 24.396], [-84.322, 24.396]
      ]
    ]
  } else if (regionName === "Central") {
    // Combined Central boundary (roughly OH to TX to ND)
    combinedCoordinates = [
      [
        [-106.646, 25.837], [-106.646, 49.001], [-80.519, 49.001], [-80.519, 36.970], [-93.508, 36.970], [-93.508, 25.837], [-106.646, 25.837]
      ]
    ]
  } else if (regionName === "West") {
    // Combined West boundary (roughly MT to CA to AK)
    combinedCoordinates = [
      [
        [-125.000, 32.534], [-125.000, 49.001], [-104.000, 49.001], [-104.000, 32.534], [-125.000, 32.534]
      ]
    ]
  }

  return {
    type: "Feature" as const,
    properties: { 
      name: regionName,
      states: regionStates
    },
    geometry: {
      type: "Polygon" as const,
      coordinates: combinedCoordinates
    }
  }
}

const LeafletMap = ({ mapData, selectedMetric, mapBounds, onBuildingClick }: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Initialize map
    mapRef.current = L.map(mapContainerRef.current, {
      center: [39.8283, -98.5795], // Center of US
      zoom: 4,
      zoomControl: true,
      attributionControl: true
    })

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapRef.current)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return

    // Clear existing layers except base tile layer
    mapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.TileLayer) return
      mapRef.current?.removeLayer(layer)
    })

    // Get all buildings across all regions to calculate metric ranges for sizing
    const allBuildings = mapData.flatMap(region => 
      region.cities.flatMap(city => city.buildings)
    )
    
    if (allBuildings.length === 0) return

    // Calculate the range of metric values for sizing dots
    const metricValues = allBuildings.map(building => building.metrics[selectedMetric])
    const minMetricValue = Math.min(...metricValues)
    const maxMetricValue = Math.max(...metricValues)
    
    // Debug logging for metric range
    console.log(`Selected Metric: ${selectedMetric}`)
    console.log(`Metric Values:`, metricValues)
    console.log(`Min Value: ${minMetricValue}, Max Value: ${maxMetricValue}`)
    
    // Size range for dots (minimum 6px, maximum 25px radius)
    const minDotSize = 6
    const maxDotSize = 25

    // Add building markers (no region borders)
    mapData.forEach((region) => {
      region.cities.forEach((city) => {
        city.buildings.forEach((building) => {
          const metricValue = building.metrics[selectedMetric]
          
          // Calculate dot size based on metric value
          let dotSize = minDotSize
          if (maxMetricValue > minMetricValue) {
            const normalizedValue = (metricValue - minMetricValue) / (maxMetricValue - minMetricValue)
            dotSize = minDotSize + (normalizedValue * (maxDotSize - minDotSize))
          }
          
          // Debug logging for first few buildings
          if (Math.random() < 0.1) { // Log ~10% of buildings to avoid spam
            console.log(`Building: ${building.name}, Metric: ${selectedMetric}, Value: ${metricValue}, Dot Size: ${dotSize}`)
          }

          // Create custom marker with dynamic sizing and region-based coloring
          const marker = L.circleMarker([building.latitude, building.longitude], {
            radius: dotSize,
            fillColor: region.color || '#3b82f6',
            color: '#ffffff', // White border for better visibility
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
          })

          // Add hover effect with size increase
          marker.on('mouseover', function(this: L.CircleMarker) {
            this.setStyle({
              color: '#000000',
              weight: 3,
              radius: dotSize + 5, // Increase size on hover
              fillOpacity: 1
            })
          })

          marker.on('mouseout', function(this: L.CircleMarker) {
            this.setStyle({
              color: '#ffffff',
              weight: 2,
              radius: dotSize,
              fillOpacity: 0.8
            })
          })

          // Add click handler
          marker.on('click', () => {
            onBuildingClick(building.buildingId)
          })

          // Add tooltip with enhanced formatting
          const formattedValue = selectedMetric === 'ALR' || selectedMetric === 'NOI' 
            ? `$${metricValue.toFixed(1)}M`
            : selectedMetric.includes('Rate') || selectedMetric === 'occupancy'
            ? `${metricValue.toFixed(1)}%`
            : `$${metricValue.toFixed(2)}`

          marker.bindTooltip(`
            <div class="text-xs p-1">
              <div class="font-semibold text-gray-900">${building.name}</div>
              <div class="text-gray-600">${city.name}, ${region.region}</div>
              <div class="mt-1 font-medium" style="color: ${region.color}">
                ${selectedMetric}: ${formattedValue}
              </div>
            </div>
          `, {
            permanent: false,
            direction: 'top',
            offset: [0, -10],
            className: 'custom-tooltip'
          })

          marker.addTo(mapRef.current!)
        })
      })
    })

    // Fit map to bounds if provided
    if (mapBounds && mapRef.current) {
      const bounds = L.latLngBounds(
        [mapBounds.south, mapBounds.west],
        [mapBounds.north, mapBounds.east]
      )
      mapRef.current.fitBounds(bounds, { padding: [20, 20] })
    }

  }, [mapData, selectedMetric, mapBounds, onBuildingClick])

  return <div ref={mapContainerRef} className="w-full h-full" />
}

export default LeafletMap 