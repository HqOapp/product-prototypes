"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type CustomerMode = "generic" | "piedmont" | "ocvibe" | "cousins"

interface CustomerModeContextType {
  currentMode: CustomerMode
  setMode: (mode: CustomerMode) => void
}

const CustomerModeContext = createContext<CustomerModeContextType | undefined>(undefined)

interface CustomerModeProviderProps {
  children: ReactNode
}

export function CustomerModeProvider({ children }: CustomerModeProviderProps) {
  const [currentMode, setCurrentMode] = useState<CustomerMode>("piedmont")

  const setMode = (mode: CustomerMode) => {
    setCurrentMode(mode)
  }

  return (
    <CustomerModeContext.Provider value={{ currentMode, setMode }}>
      {children}
    </CustomerModeContext.Provider>
  )
}

export function useCustomerMode() {
  const context = useContext(CustomerModeContext)
  if (context === undefined) {
    throw new Error("useCustomerMode must be used within a CustomerModeProvider")
  }
  return context
}

/* 
🎯 MODE-AWARE CONDITIONAL RENDERING EXAMPLES:

1. COMPONENT-LEVEL CONDITIONAL RENDERING:
```tsx
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"

function Dashboard() {
  const { currentMode } = useCustomerMode()
  
  if (currentMode === "piedmont") {
    return <PiedmontDashboard />
  } else if (currentMode === "ocvibe") {
    return <OCVibeDashboard />
  } else if (currentMode === "cousins") {
    return <CousinsDashboard />
  }
  
  return <GenericDashboard />
}
```

2. DATA FILTERING BY MODE:
```tsx
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { mockLeases } from "@/lib/leasesData"

function LeasesList() {
  const { currentMode } = useCustomerMode()
  
  // Filter leases based on customer mode
  const filteredLeases = mockLeases.filter(lease => {
    if (currentMode === "piedmont") {
      return lease.region === "Southeast" // Show only Southeast for Piedmont
    } else if (currentMode === "ocvibe") {
      return lease.building_type === "Office" // Show only offices for OCVibe
    } else if (currentMode === "cousins") {
      return lease.tenant_name.includes("Tech") // Show only tech tenants for Cousins
    }
    return true // Show all for generic mode
  })
  
  return <LeasesTable leases={filteredLeases} />
}
```

3. BRANDING/UI CONDITIONAL RENDERING:
```tsx
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"

function Header() {
  const { currentMode } = useCustomerMode()
  
  const getBrandingConfig = () => {
    switch (currentMode) {
      case "piedmont":
        return { 
          logo: "/piedmont-logo.svg", 
          primaryColor: "#0066CC",
          greeting: "Welcome to Piedmont Realty Trust" 
        }
      case "ocvibe":
        return { 
          logo: "/ocvibe-logo.svg", 
          primaryColor: "#FF6B35",
          greeting: "Welcome to OCVibe Properties" 
        }
      case "cousins":
        return { 
          logo: "/cousins-logo.svg", 
          primaryColor: "#2D5A27",
          greeting: "Welcome to Cousins Properties" 
        }
      default:
        return { 
          logo: "/red-hqo-logo.svg", 
          primaryColor: "#EF4444",
          greeting: "Welcome to HqO CRM" 
        }
    }
  }
  
  const branding = getBrandingConfig()
  
  return (
    <header style={{ backgroundColor: branding.primaryColor }}>
      <img src={branding.logo} alt="Logo" />
      <h1>{branding.greeting}</h1>
    </header>
  )
}
```

4. DEFAULT FILTER SETTINGS BY MODE:
```tsx
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"

function BuildingsPage() {
  const { currentMode } = useCustomerMode()
  
  // Set default filters based on mode
  const getDefaultFilters = () => {
    switch (currentMode) {
      case "piedmont":
        return { region: "Southeast", type: "all" }
      case "ocvibe":
        return { region: "all", type: "Office" }
      case "cousins":
        return { region: "Atlanta", type: "all" }
      default:
        return { region: "all", type: "all" }
    }
  }
  
  const [filters, setFilters] = useState(getDefaultFilters())
  
  return <BuildingsTable filters={filters} onFiltersChange={setFilters} />
}
```

⚠️ IMPORTANT RULES:
- ALL features must remain accessible in ALL modes
- Mode should only influence CONTENT and PRESENTATION, never FUNCTIONALITY
- Always provide fallbacks for generic mode
- Never remove or disable routes/features based on mode
*/ 