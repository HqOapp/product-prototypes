"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Filter, MapPin, Building2, Users, DollarSign, Download } from "lucide-react"
import Link from "next/link"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { mockBuildings } from "@/lib/mockData"

const buildingTypes = [
  { value: "all", label: "All Asset Types" },
  { value: "office", label: "Office" },
  { value: "multifamily", label: "Multifamily" },
  { value: "retail", label: "Retail" },
  { value: "industrial", label: "Industrial" },
  { value: "warehouse", label: "Warehouse" },
  { value: "data-center", label: "Data Center" },
  { value: "medical", label: "Medical" },
  { value: "lab", label: "Lab/R&D" },
  { value: "hospitality", label: "Hospitality" },
  { value: "mixed-use", label: "Mixed Use" },
  { value: "land", label: "Land" },
  { value: "specialty", label: "Specialty" },
]

const buildingClasses = [
  { value: "all", label: "All Classes" },
  { value: "class-a", label: "Class A" },
  { value: "class-b", label: "Class B" },
  { value: "class-c", label: "Class C" },
]

const statuses = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "under-construction", label: "Under Construction" },
  { value: "renovation", label: "Renovation" },
  { value: "disposition", label: "Disposition" },
  { value: "inactive", label: "Inactive" },
]

// Calculate rent per square foot for each building
const getRentPerSqft = (building: any) => {
  // Use rent_per_sf field if available
  if ((building as any).rent_per_sf) {
    return (building as any).rent_per_sf;
  }
  
  // Calculate for buildings without rent_per_sf from monthly rent roll
  const monthlyRent = building.monthly_rent_roll || 0;
  const squareFeet = building.square_foot || 1;
  const annualRent = monthlyRent * 12;
  return parseFloat((annualRent / squareFeet).toFixed(2));
}

// Transform mockBuildings data for table compatibility
const transformBuildingData = (buildings: any[], currentMode: string) => {
  return buildings
    .filter(building => {
      // Only show Piedmont buildings when in Piedmont mode
      if ((building as any).customer_mode === 'piedmont') {
        return currentMode.toLowerCase() === 'piedmont';
      }
      // Show generic buildings in all modes except when they have a specific customer_mode
      return !(building as any).customer_mode || currentMode.toLowerCase() !== 'piedmont';
    })
    .map(building => ({
      id: building.uuid,
      name: building.name,
      address: building.formatted_address,
      type: building.asset_type?.toLowerCase().replace(' ', '-') || 'office',
      class: building.building_class?.toLowerCase().replace(' ', '-') || 'class-a',
      yearBuilt: building.year_built,
      rsf: building.square_foot,
      floors: building.floors,
      occupancyRate: Math.round(building.occupancy_rate || 90),
      tenantCount: (building as any).tenant_count || Math.round((building.square_foot || 100000) / 5000), // Estimate
      rentPerSqft: getRentPerSqft(building),
      noi: building.noi || 0,
      capRate: ((building.noi || 0) / (building.current_valuation || 1000000) * 100).toFixed(1),
      status: "active",
      portfolio: (building as any).customer_mode === 'piedmont' ? "Piedmont Portfolio" : "Core Portfolio",
      owner: building.owner_name || "Quantum City Investments",
      image: (building as any)?.primary_photo_url || `/placeholder.svg?height=40&width=40&text=${building.name.substring(0, 2).toUpperCase()}`,
      region: (building as any).region,
      region_city: (building as any).region_city,
      certifications: (building as any).certifications || []
    }));
}

export function BuildingsTable() {
  const { currentMode } = useCustomerMode()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  
  // Get buildings based on current mode
  const buildingsData = transformBuildingData(mockBuildings, currentMode)
  
  // Get unique regions from current buildings for filter
  const availableRegions = Array.from(new Set(buildingsData.map(b => b.region).filter(Boolean)))

  const filteredBuildings = buildingsData.filter((building) => {
    const matchesSearch =
      building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      building.owner.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "all" || building.type === selectedType
    const matchesClass = selectedClass === "all" || building.class === selectedClass
    const matchesStatus = selectedStatus === "all" || building.status === selectedStatus
    const matchesRegion = selectedRegion === "all" || building.region === selectedRegion

    return matchesSearch && matchesType && matchesClass && matchesStatus && matchesRegion
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">• Active</Badge>
      case "under-construction":
        return <Badge className="bg-blue-100 text-blue-800">• Under Construction</Badge>
      case "renovation":
        return <Badge className="bg-yellow-100 text-yellow-800">• Renovation</Badge>
      case "disposition":
        return <Badge className="bg-orange-100 text-orange-800">• Disposition</Badge>
      case "inactive":
        return <Badge variant="secondary">• Inactive</Badge>
      default:
        return <Badge variant="secondary">• {status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      office: "Office",
      multifamily: "Multifamily",
      retail: "Retail",
      industrial: "Industrial",
      warehouse: "Warehouse",
      "data-center": "Data Center",
      medical: "Medical",
      lab: "Lab/R&D",
      hospitality: "Hospitality",
      "mixed-use": "Mixed Use",
      land: "Land",
      specialty: "Specialty",
    }
    return <Badge variant="outline">{typeLabels[type] || type}</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Buildings</h1>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Browse Portfolio
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Create building
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Building2 className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Buildings</p>
                      <p className="text-2xl font-bold">{filteredBuildings.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <MapPin className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total RSF</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(filteredBuildings.reduce((sum, b) => sum + b.rsf, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Avg Occupancy</p>
                      <p className="text-2xl font-bold">
                        {Math.round(
                          filteredBuildings.reduce((sum, b) => sum + b.occupancyRate, 0) / filteredBuildings.length,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total NOI</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(filteredBuildings.reduce((sum, b) => sum + b.noi, 0))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Table with White Background */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">All buildings ({filteredBuildings.length})</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search buildings..."
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All asset types" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All classes" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildingClasses.map((cls) => (
                        <SelectItem key={cls.value} value={cls.value}>
                          {cls.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {availableRegions.length > 0 && (
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="All regions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All regions</SelectItem>
                        {availableRegions.map((region) => (
                          <SelectItem key={region} value={region}>
                            {region}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            {/* Data Table with White Background */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="text-left font-medium text-gray-500">Building</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Type</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Class</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">RSF</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Occupancy</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Tenants</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Mean $ / Sq. Ft.</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">NOI</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Cap Rate</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBuildings.map((building) => (
                      <TableRow key={building.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="py-4">
                          <Link href={`/buildings/${building.id}`} className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={building.image} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                {building.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{building.name}</div>
                              <div className="text-sm text-gray-500">{building.address}</div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="py-4">
                          {getTypeBadge(building.type)}
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900 capitalize">{building.class.replace('-', ' ')}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{formatNumber(building.rsf)}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{building.occupancyRate}%</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{building.tenantCount}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">${building.rentPerSqft}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{formatCurrency(building.noi)}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{building.capRate}%</span>
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(building.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
