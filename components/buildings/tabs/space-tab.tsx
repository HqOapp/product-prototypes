"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Building2,
  Layers,
  Grid,
  Users,
  FileText,
  Download,
  Upload,
  Maximize2,
  ChevronRight,
  Coffee,
  Briefcase,
  Package,
  Home,
  ShoppingBag,
  Utensils,
  Wifi,
  Printer,
  Zap,
  ChevronLeft,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SpaceTabProps {
  building: any
}

// Mock data for floors
const floors = [
  {
    id: "12",
    number: 12,
    rsf: 37500,
    occupiedRsf: 37500,
    occupancyRate: 100,
    suites: 3,
    tenants: 3,
    type: "Office",
  },
  {
    id: "11",
    number: 11,
    rsf: 37500,
    occupiedRsf: 37500,
    occupancyRate: 100,
    suites: 2,
    tenants: 2,
    type: "Office",
  },
  {
    id: "10",
    number: 10,
    rsf: 37500,
    occupiedRsf: 37500,
    occupancyRate: 100,
    suites: 1,
    tenants: 1,
    type: "Office",
  },
  {
    id: "9",
    number: 9,
    rsf: 37500,
    occupiedRsf: 37500,
    occupancyRate: 100,
    suites: 1,
    tenants: 1,
    type: "Office",
  },
  {
    id: "8",
    number: 8,
    rsf: 37500,
    occupiedRsf: 37500,
    occupancyRate: 100,
    suites: 2,
    tenants: 2,
    type: "Office",
  },
  {
    id: "7",
    number: 7,
    rsf: 37500,
    occupiedRsf: 30000,
    occupancyRate: 80,
    suites: 3,
    tenants: 2,
    type: "Office",
  },
  {
    id: "6",
    number: 6,
    rsf: 37500,
    occupiedRsf: 37500,
    occupancyRate: 100,
    suites: 1,
    tenants: 1,
    type: "Office",
  },
  {
    id: "5",
    number: 5,
    rsf: 37500,
    occupiedRsf: 37500,
    occupancyRate: 100,
    suites: 2,
    tenants: 2,
    type: "Office",
  },
  {
    id: "4",
    number: 4,
    rsf: 37500,
    occupiedRsf: 37500,
    occupancyRate: 100,
    suites: 1,
    tenants: 1,
    type: "Office",
  },
  {
    id: "3",
    number: 3,
    rsf: 37500,
    occupiedRsf: 37500,
    occupancyRate: 100,
    suites: 1,
    tenants: 1,
    type: "Office",
  },
  {
    id: "2",
    number: 2,
    rsf: 37500,
    occupiedRsf: 18750,
    occupancyRate: 50,
    suites: 4,
    tenants: 2,
    type: "Office",
  },
  {
    id: "1",
    number: 1,
    rsf: 37500,
    occupiedRsf: 30000,
    occupancyRate: 80,
    suites: 5,
    tenants: 4,
    type: "Mixed",
  },
]

// Mock data for suites on a specific floor
const floorSuites = [
  {
    id: "701",
    number: "701",
    rsf: 15000,
    type: "Office",
    tenant: "EcoVolt Energy Solutions",
    leaseStart: "2023-01-15",
    leaseEnd: "2026-01-14",
    monthlyRent: 48750,
    status: "occupied",
  },
  {
    id: "702",
    number: "702",
    rsf: 15000,
    type: "Office",
    tenant: "Quantum Analytics",
    leaseStart: "2022-05-01",
    leaseEnd: "2025-04-30",
    monthlyRent: 48000,
    status: "occupied",
  },
  {
    id: "703",
    number: "703",
    rsf: 7500,
    type: "Office",
    tenant: null,
    leaseStart: null,
    leaseEnd: null,
    monthlyRent: null,
    status: "available",
  },
]

// Mock data for space types
const spaceTypes = [
  { value: "all", label: "All Space Types" },
  { value: "office", label: "Office" },
  { value: "retail", label: "Retail" },
  { value: "storage", label: "Storage" },
  { value: "amenity", label: "Amenity" },
  { value: "common", label: "Common Area" },
]

// Mock data for space status
const spaceStatuses = [
  { value: "all", label: "All Statuses" },
  { value: "occupied", label: "Occupied" },
  { value: "available", label: "Available" },
  { value: "upcoming", label: "Upcoming Availability" },
]

export function SpaceTab({ building }: SpaceTabProps) {
  const [selectedFloor, setSelectedFloor] = useState<string | null>("7")
  const [selectedView, setSelectedView] = useState("list")
  const [selectedSpaceType, setSelectedSpaceType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "-"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "occupied":
        return <Badge className="bg-green-100 text-green-800">Occupied</Badge>
      case "available":
        return <Badge className="bg-blue-100 text-blue-800">Available</Badge>
      case "upcoming":
        return <Badge className="bg-yellow-100 text-yellow-800">Upcoming</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSpaceTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "office":
        return <Briefcase className="h-4 w-4 text-blue-600" />
      case "retail":
        return <ShoppingBag className="h-4 w-4 text-purple-600" />
      case "storage":
        return <Package className="h-4 w-4 text-orange-600" />
      case "amenity":
        return <Coffee className="h-4 w-4 text-green-600" />
      case "common":
        return <Users className="h-4 w-4 text-gray-600" />
      case "mixed":
        return <Home className="h-4 w-4 text-indigo-600" />
      default:
        return <Building2 className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Space Management</h2>
          <p className="text-gray-500">Manage floors, suites, and space utilization</p>
        </div>
        <div className="flex items-center space-x-4">
          <Tabs value={selectedView} onValueChange={setSelectedView} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="list">
                <Grid className="h-4 w-4 mr-2" />
                List View
              </TabsTrigger>
              <TabsTrigger value="stacking">
                <Layers className="h-4 w-4 mr-2" />
                Stacking Plan
              </TabsTrigger>
              <TabsTrigger value="floorplan">
                <FileText className="h-4 w-4 mr-2" />
                Floor Plans
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Space Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total RSF</p>
                <p className="text-2xl font-bold">{formatNumber(building.rsf)}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Occupied Space</p>
                <p className="text-2xl font-bold">{formatNumber(414000)} SF</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Available Space</p>
                <p className="text-2xl font-bold">{formatNumber(36000)} SF</p>
              </div>
              <Grid className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Occupancy Rate</p>
                <p className="text-2xl font-bold">92%</p>
              </div>
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Floor List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Floors
                </CardTitle>
                <CardDescription>Select a floor to view details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                  {floors.map((floor) => (
                    <div
                      key={floor.id}
                      className={`p-3 border rounded-md cursor-pointer transition-colors ${
                        selectedFloor === floor.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedFloor(floor.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedFloor === floor.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {floor.number}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">Floor {floor.number}</div>
                            <div className="text-xs text-gray-500 flex items-center">
                              {getSpaceTypeIcon(floor.type)}
                              <span className="ml-1">{floor.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{formatNumber(floor.rsf)} SF</div>
                          <div className="flex items-center text-xs">
                            <div
                              className={`w-2 h-2 rounded-full mr-1 ${
                                floor.occupancyRate === 100
                                  ? "bg-green-500"
                                  : floor.occupancyRate >= 80
                                    ? "bg-green-400"
                                    : floor.occupancyRate >= 50
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                              }`}
                            ></div>
                            <span>{floor.occupancyRate}% occupied</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <Progress value={floor.occupancyRate} className="h-1" />
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>{floor.suites} suites</span>
                        <span>{floor.tenants} tenants</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Floor Details */}
          <div className="lg:col-span-2">
            <TabsContent value="list" className="m-0">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Floor {selectedFloor} Suites</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Select value={selectedSpaceType} onValueChange={setSelectedSpaceType}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Space Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {spaceTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {spaceStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Suite</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>RSF</TableHead>
                        <TableHead>Tenant</TableHead>
                        <TableHead>Lease Period</TableHead>
                        <TableHead>Monthly Rent</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {floorSuites.map((suite) => (
                        <TableRow key={suite.id} className="cursor-pointer hover:bg-gray-50">
                          <TableCell className="font-medium">{suite.number}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getSpaceTypeIcon(suite.type)}
                              <span className="ml-1">{suite.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatNumber(suite.rsf)} SF</TableCell>
                          <TableCell>
                            {suite.tenant ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {suite.tenant.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{suite.tenant}</span>
                              </div>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {suite.leaseStart ? (
                              <span>
                                {formatDate(suite.leaseStart)} - {formatDate(suite.leaseEnd)}
                              </span>
                            ) : (
                              <span className="text-gray-500">-</span>
                            )}
                          </TableCell>
                          <TableCell>{formatCurrency(suite.monthlyRent)}</TableCell>
                          <TableCell>{getStatusBadge(suite.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Suite Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-4">Suite 701</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Suite Type</span>
                            <span className="font-medium">Office</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">RSF</span>
                            <span className="font-medium">15,000 SF</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">USF</span>
                            <span className="font-medium">13,500 SF</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Load Factor</span>
                            <span className="font-medium">11.1%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Tenant</span>
                            <span className="font-medium">EcoVolt Energy Solutions</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Lease Start</span>
                            <span className="font-medium">Jan 15, 2023</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Lease End</span>
                            <span className="font-medium">Jan 14, 2026</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-4">Systems & Amenities</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Wifi className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm">High-Speed Internet</span>
                          </div>
                          <div className="flex items-center">
                            <Zap className="h-4 w-4 text-yellow-600 mr-2" />
                            <span className="text-sm">Dedicated Power</span>
                          </div>
                          <div className="flex items-center">
                            <Printer className="h-4 w-4 text-purple-600 mr-2" />
                            <span className="text-sm">Print Station</span>
                          </div>
                          <div className="flex items-center">
                            <Coffee className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm">Kitchenette</span>
                          </div>
                          <div className="flex items-center">
                            <Utensils className="h-4 w-4 text-orange-600 mr-2" />
                            <span className="text-sm">Access to Building Cafeteria</span>
                          </div>
                        </div>

                        <div className="mt-6">
                          <Button variant="outline" className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            View Floor Plan
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stacking" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Stacking Plan</CardTitle>
                  <CardDescription>Visual representation of space allocation across floors</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {floors.map((floor) => (
                      <div
                        key={floor.id}
                        className={`p-3 border rounded-md ${selectedFloor === floor.id ? "border-blue-500" : ""}`}
                        onClick={() => setSelectedFloor(floor.id)}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              selectedFloor === floor.id ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {floor.number}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium">Floor {floor.number}</span>
                              <span className="text-sm">{formatNumber(floor.rsf)} SF</span>
                            </div>
                            <div className="w-full h-6 bg-gray-100 rounded-md flex overflow-hidden">
                              {floor.occupancyRate > 0 && (
                                <div
                                  className="bg-green-500 h-full flex items-center justify-center text-xs text-white"
                                  style={{ width: `${floor.occupancyRate}%` }}
                                >
                                  {floor.occupancyRate}%
                                </div>
                              )}
                              {floor.occupancyRate < 100 && (
                                <div
                                  className="bg-blue-300 h-full flex items-center justify-center text-xs text-white"
                                  style={{ width: `${100 - floor.occupancyRate}%` }}
                                >
                                  {100 - floor.occupancyRate}%
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center mt-6 space-x-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-500 rounded-sm mr-2"></div>
                      <span className="text-sm">Occupied</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-300 rounded-sm mr-2"></div>
                      <span className="text-sm">Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="floorplan" className="m-0">
              <Card>
                <CardHeader>
                  <CardTitle>Floor Plans</CardTitle>
                  <CardDescription>Interactive floor plans and CAD drawings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous Floor
                      </Button>
                      <Select value={selectedFloor || ""} onValueChange={setSelectedFloor}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                        <SelectContent>
                          {floors.map((floor) => (
                            <SelectItem key={floor.id} value={floor.id}>
                              Floor {floor.number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        Next Floor
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Upload Plan
                      </Button>
                      <Button variant="outline" size="sm">
                        <Maximize2 className="h-4 w-4 mr-1" />
                        Full Screen
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-md h-[400px] flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Floor {selectedFloor} Plan</p>
                      <p className="text-sm text-gray-400">Interactive floor plan viewer</p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-sm mr-1"></div>
                        <span className="text-xs">Occupied</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-300 rounded-sm mr-1"></div>
                        <span className="text-xs">Available</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-300 rounded-sm mr-1"></div>
                        <span className="text-xs">Upcoming</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">Last updated: May 15, 2024</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  )
}
