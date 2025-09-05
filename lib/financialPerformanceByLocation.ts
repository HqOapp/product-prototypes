// Piedmont Real Estate Trust - Financial Performance by Location (End of 2024)
// Source: Official Piedmont financial data

export interface LocationPerformance {
  location: string
  annualizedLeaseRevenue: number
  rentableSquareFeet: number
  percentOfALR: number
  percentLeased: number
}

export const piedmontLocationPerformance: LocationPerformance[] = [
  {
    "location": "Atlanta",
    "annualizedLeaseRevenue": 173668000,
    "rentableSquareFeet": 4712000,
    "percentOfALR": 30.6,
    "percentLeased": 92.7
  },
  {
    "location": "Dallas",
    "annualizedLeaseRevenue": 106736000,
    "rentableSquareFeet": 2917000,
    "percentOfALR": 18.8,
    "percentLeased": 85.8
  },
  {
    "location": "Orlando",
    "annualizedLeaseRevenue": 63988000,
    "rentableSquareFeet": 1754000,
    "percentOfALR": 11.3,
    "percentLeased": 93.2
  },
  {
    "location": "Northern Virginia / Washington, D.C.",
    "annualizedLeaseRevenue": 59224000,
    "rentableSquareFeet": 1579000,
    "percentOfALR": 10.4,
    "percentLeased": 69.7
  },
  {
    "location": "New York",
    "annualizedLeaseRevenue": 55379000,
    "rentableSquareFeet": 1045000,
    "percentOfALR": 9.8,
    "percentLeased": 95.5
  },
  {
    "location": "Minneapolis",
    "annualizedLeaseRevenue": 47811000,
    "rentableSquareFeet": 1434000,
    "percentOfALR": 8.4,
    "percentLeased": 88.9
  },
  {
    "location": "Boston",
    "annualizedLeaseRevenue": 40524000,
    "rentableSquareFeet": 1268000,
    "percentOfALR": 7.2,
    "percentLeased": 86.7
  },
  {
    "location": "Other (includes Houston)",
    "annualizedLeaseRevenue": 20014000,
    "rentableSquareFeet": 614000,
    "percentOfALR": 3.5,
    "percentLeased": 91.2
  },
  {
    "location": "Total",
    "annualizedLeaseRevenue": 567344000,
    "rentableSquareFeet": 15323000,
    "percentOfALR": 100.0,
    "percentLeased": 88.4
  }
]

// Regional groupings for Piedmont
export const piedmontRegionalGroupings = {
  "Southeast": ["Atlanta", "Orlando"],
  "Central Region": ["Dallas", "Minneapolis"], 
  "Northeast": ["Northern Virginia / Washington, D.C.", "New York", "Boston"]
}

// City mapping for easier lookup (handles variations in naming)
export const cityNameMapping = {
  "Dallas": "Dallas",
  "Minnesota": "Minneapolis", // Handle the variation
  "Minneapolis": "Minneapolis",
  "Atlanta": "Atlanta",
  "Orlando": "Orlando", 
  "NY": "New York",
  "New York": "New York",
  "Boston": "Boston",
  "DC/NoVA": "Northern Virginia / Washington, D.C.",
  "Northern Virginia / Washington, D.C.": "Northern Virginia / Washington, D.C."
}

// Helper function to calculate ALR per square foot
export const calculateALRPerSF = (location: LocationPerformance): number => {
  return location.rentableSquareFeet > 0 ? location.annualizedLeaseRevenue / location.rentableSquareFeet : 0
}

// Helper function to get regional totals with weighted occupancy
export const getRegionalTotals = (regionName: string): { 
  totalALR: number, 
  totalSquareFeet: number, 
  weightedOccupancy: number,
  locations: LocationPerformance[]
} => {
  const locations = piedmontRegionalGroupings[regionName as keyof typeof piedmontRegionalGroupings] || []
  const locationData = piedmontLocationPerformance.filter(loc => 
    locations.includes(loc.location) && loc.location !== "Total"
  )
  
  const totalALR = locationData.reduce((sum, loc) => sum + loc.annualizedLeaseRevenue, 0)
  const totalSquareFeet = locationData.reduce((sum, loc) => sum + loc.rentableSquareFeet, 0)
  
  // Calculate weighted occupancy percentage
  const weightedOccupancy = locationData.length > 0 
    ? locationData.reduce((sum, loc) => sum + (loc.percentLeased * loc.rentableSquareFeet), 0) / totalSquareFeet
    : 0
  
  return {
    totalALR,
    totalSquareFeet,
    weightedOccupancy,
    locations: locationData
  }
}

// Helper function to get data for a specific city
export const getCityData = (cityName: string): LocationPerformance | null => {
  const mappedName = cityNameMapping[cityName as keyof typeof cityNameMapping] || cityName
  return piedmontLocationPerformance.find(loc => loc.location === mappedName) || null
} 