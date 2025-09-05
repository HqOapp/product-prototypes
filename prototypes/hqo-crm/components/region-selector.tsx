"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MapPin, ChevronDown, X } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"

// Piedmont regions with nested cities
const piedmontRegions = {
  "Central Region": ["Dallas", "Minneapolis"],
  "Southeast": ["Atlanta", "Orlando"],
  "Northeast": ["New York", "Boston", "Arlington"]
}

interface RegionSelection {
  selectedRegions: Set<string>
  selectedCities: Set<string>
}

interface RegionSelectorProps {
  selectedRegions: Set<string>
  selectedCities: Set<string>
  onSelectionChange: (selection: RegionSelection) => void
}

export function RegionSelector({ 
  selectedRegions, 
  selectedCities, 
  onSelectionChange 
}: RegionSelectorProps) {
  const { currentMode } = useCustomerMode()
  
  // Use props instead of local state
  const selection = { selectedRegions, selectedCities }

  // Check if current mode is Piedmont
  const isPiedmont = currentMode.toLowerCase() === 'piedmont'

  // Get all cities for a region
  const getCitiesForRegion = (region: string): string[] => {
    return piedmontRegions[region as keyof typeof piedmontRegions] || []
  }

  // Check if all cities in a region are selected
  const areAllCitiesSelected = (region: string): boolean => {
    const cities = getCitiesForRegion(region)
    return cities.every(city => selection.selectedCities.has(city))
  }

  // Check if some (but not all) cities in a region are selected
  const areSomeCitiesSelected = (region: string): boolean => {
    const cities = getCitiesForRegion(region)
    return cities.some(city => selection.selectedCities.has(city)) && !areAllCitiesSelected(region)
  }

  // Handle region checkbox toggle
  const handleRegionToggle = (region: string, checked: boolean) => {
    const cities = getCitiesForRegion(region)
    const newSelection = { ...selection }

    if (checked) {
      // Select region and all its cities
      newSelection.selectedRegions.add(region)
      cities.forEach(city => newSelection.selectedCities.add(city))
    } else {
      // Deselect region and all its cities
      newSelection.selectedRegions.delete(region)
      cities.forEach(city => newSelection.selectedCities.delete(city))
    }

    onSelectionChange({
      selectedRegions: newSelection.selectedRegions,
      selectedCities: newSelection.selectedCities
    })
  }

  // Handle city checkbox toggle
  const handleCityToggle = (city: string, checked: boolean) => {
    const newSelection = { ...selection }

    if (checked) {
      newSelection.selectedCities.add(city)
    } else {
      newSelection.selectedCities.delete(city)
    }

    // Update region selection based on city selection
    Object.keys(piedmontRegions).forEach(region => {
      const cities = getCitiesForRegion(region)
      const allSelected = cities.every(c => newSelection.selectedCities.has(c))
      
      if (allSelected) {
        newSelection.selectedRegions.add(region)
      } else {
        newSelection.selectedRegions.delete(region)
      }
    })

    onSelectionChange({
      selectedRegions: newSelection.selectedRegions,
      selectedCities: newSelection.selectedCities
    })
  }

  // Clear all selections
  const handleClearAll = () => {
    onSelectionChange({
      selectedRegions: new Set(),
      selectedCities: new Set()
    })
  }

  // Generate display text for the button
  const getDisplayText = (): string => {
    if (!isPiedmont) return "No regions available"
    
    const totalSelected = selection.selectedCities.size
    const totalCities = Object.values(piedmontRegions).flat().length // 7 total cities
    
    if (totalSelected === 0) return "Select regions"
    
    // Show "All Regions" when all cities are selected
    if (totalSelected === totalCities) return "All Regions"
    
    const regionsSelected = selection.selectedRegions.size
    if (regionsSelected > 0 && totalSelected <= 3) {
      return Array.from(selection.selectedRegions).join(", ")
    }
    
    return `${totalSelected} location${totalSelected === 1 ? '' : 's'} selected`
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-[180px] justify-between h-10 pl-3 pr-3"
          disabled={!isPiedmont}
        >
          <div className="flex items-center min-w-0 flex-1">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{getDisplayText()}</span>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-3" align="start">
        {isPiedmont ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Select Regions</h4>
              {selection.selectedCities.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="space-y-3">
              {Object.entries(piedmontRegions).map(([region, cities]) => (
                <div key={region} className="space-y-2">
                  {/* Region Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`region-${region}`}
                      checked={areAllCitiesSelected(region)}
                      onCheckedChange={(checked) => handleRegionToggle(region, checked === true)}
                      className={areSomeCitiesSelected(region) ? "data-[state=checked]:bg-blue-200" : ""}
                    />
                    <label
                      htmlFor={`region-${region}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {region}
                    </label>
                  </div>
                  
                  {/* City Checkboxes */}
                  <div className="ml-6 space-y-1.5">
                    {cities.map((city) => (
                      <div key={city} className="flex items-center space-x-2">
                        <Checkbox
                          id={`city-${city}`}
                          checked={selection.selectedCities.has(city)}
                          onCheckedChange={(checked) => handleCityToggle(city, checked === true)}
                        />
                        <label
                          htmlFor={`city-${city}`}
                          className="text-sm cursor-pointer text-muted-foreground"
                        >
                          {city}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-2">
            No regions available
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
} 