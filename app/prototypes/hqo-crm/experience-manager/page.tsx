"use client"

import { useState, useMemo } from "react"
import { FilterDropdown } from "@/components/filter-tabs"
import { PageTabs } from "@/components/page-tabs"
import { ArrowLeftRightIcon as ArrowsLeftRight, Building2, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { mockBuildings } from "@/lib/mockData"
import { piedmontBuildings } from "@/lib/piedmontBuildings"

interface FilterState {
  building: string
  tenant: string
  industry: string
}

export default function ExperienceManagerPage() {
  const { currentMode } = useCustomerMode()
  const [filters, setFilters] = useState<FilterState>({
    building: "all",
    tenant: "all", 
    industry: "all"
  })

  // Get buildings data based on customer mode
  const buildings = useMemo(() => {
    return currentMode === "piedmont" ? piedmontBuildings : mockBuildings
  }, [currentMode])

  // Page tabs
  const pageTabs = [
    { label: "Overview", href: "/experience-manager" },
    { label: "Experiences", href: "/experience-manager/experiences" },
    { label: "Templates", href: "/experience-manager/templates" },
    { label: "Settings", href: "/experience-manager/settings" },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-0">
        <h1 className="text-2xl font-bold">Experience Manager</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Select value={filters.building} onValueChange={(value) => setFilters(prev => ({ ...prev, building: value }))}>
              <SelectTrigger className="w-48 h-10">
                <div className="flex items-center">
                  <Building2 className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select Building" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Buildings</SelectItem>
                {buildings.map(building => (
                  <SelectItem key={building.uuid} value={building.uuid}>
                    {building.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FilterDropdown label="Tenants" icon={<Filter className="h-4 w-4" />} />
            <FilterDropdown label="Industries" icon={<Filter className="h-4 w-4" />} />
          </div>

          <Button variant="outline" className="gap-2">
            <ArrowsLeftRight className="h-4 w-4" />
            Benchmark
          </Button>
        </div>
      </div>

      <PageTabs tabs={pageTabs} className="px-6 mt-6" />

      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Experience Manager</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is a placeholder for the Experience Manager page.</p>
            <p className="mt-4">
              The Experience Manager would typically allow you to create and manage user experiences across properties.
            </p>
            {filters.building !== "all" && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  <strong>Filtered by:</strong> {buildings.find(b => b.uuid === filters.building)?.name || "Unknown Building"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
