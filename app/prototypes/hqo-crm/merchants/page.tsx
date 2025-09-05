"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { GlobalSearch } from "@/components/global-search"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Download, ChevronDown, Clock, MapPin } from "lucide-react"

const mockMerchants = [
  {
    id: "1",
    name: "Starbucks Coffee",
    website: "starbucks.com",
    type: "Coffee Shop",
    building: "One Liberty Plaza",
    floor: "Ground Floor",
    unit: "G-101",
    hours: "6:00 AM - 9:00 PM",
    phone: "(555) 123-4567",
    leaseExpires: "12/31/2025",
    monthlyRent: "$8,500",
    squareFootage: "1,200 sq ft",
    status: "Active",
    contactPerson: "Sarah Johnson",
    email: "sarah.johnson@starbucks.com",
    logo: "/placeholder.svg?height=40&width=40&text=SB",
  },
  {
    id: "2",
    name: "Metro Deli & Grill",
    website: "metrodeli.com",
    type: "Restaurant",
    building: "Empire State Building",
    floor: "2nd Floor",
    unit: "2-205",
    hours: "11:00 AM - 10:00 PM",
    phone: "(555) 234-5678",
    leaseExpires: "06/30/2024",
    monthlyRent: "$12,000",
    squareFootage: "2,500 sq ft",
    status: "Active",
    contactPerson: "Mike Chen",
    email: "mike@metrodeli.com",
    logo: "/placeholder.svg?height=40&width=40&text=MD",
  },
  {
    id: "3",
    name: "TechStop Electronics",
    website: "techstop.com",
    type: "Electronics Store",
    building: "Willis Tower",
    floor: "Ground Floor",
    unit: "G-150",
    hours: "9:00 AM - 8:00 PM",
    phone: "(555) 345-6789",
    leaseExpires: "03/15/2026",
    monthlyRent: "$15,000",
    squareFootage: "3,000 sq ft",
    status: "Active",
    contactPerson: "David Kim",
    email: "david@techstop.com",
    logo: "/placeholder.svg?height=40&width=40&text=TS",
  },
  {
    id: "4",
    name: "Fresh Market Express",
    website: "freshmarket.com",
    type: "Convenience Store",
    building: "One Liberty Plaza",
    floor: "Ground Floor",
    unit: "G-120",
    hours: "24/7",
    phone: "(555) 456-7890",
    leaseExpires: "09/30/2024",
    monthlyRent: "$6,800",
    squareFootage: "800 sq ft",
    status: "Lease Expiring Soon",
    contactPerson: "Maria Rodriguez",
    email: "maria@freshmarket.com",
    logo: "/placeholder.svg?height=40&width=40&text=FM",
  },
  {
    id: "5",
    name: "Zen Wellness Spa",
    website: "zenwellness.com",
    type: "Health & Wellness",
    building: "Salesforce Tower",
    floor: "5th Floor",
    unit: "5-501",
    hours: "8:00 AM - 8:00 PM",
    phone: "(555) 567-8901",
    leaseExpires: "12/31/2027",
    monthlyRent: "$18,500",
    squareFootage: "4,500 sq ft",
    status: "Active",
    contactPerson: "Lisa Wang",
    email: "lisa@zenwellness.com",
    logo: "/placeholder.svg?height=40&width=40&text=ZW",
  },
  {
    id: "6",
    name: "BookNook Cafe",
    website: "booknook.com",
    type: "Bookstore & Cafe",
    building: "Empire State Building",
    floor: "3rd Floor",
    unit: "3-301",
    hours: "7:00 AM - 9:00 PM",
    phone: "(555) 678-9012",
    leaseExpires: "08/15/2025",
    monthlyRent: "$9,200",
    squareFootage: "1,800 sq ft",
    status: "Active",
    contactPerson: "James Thompson",
    email: "james@booknook.com",
    logo: "/placeholder.svg?height=40&width=40&text=BN",
  },
  {
    id: "7",
    name: "QuickBite Food Court",
    website: "quickbite.com",
    type: "Food Court",
    building: "Willis Tower",
    floor: "Basement Level",
    unit: "B-100",
    hours: "6:00 AM - 11:00 PM",
    phone: "(555) 789-0123",
    leaseExpires: "01/31/2025",
    monthlyRent: "$22,000",
    squareFootage: "5,000 sq ft",
    status: "Under Renovation",
    contactPerson: "Alex Rivera",
    email: "alex@quickbite.com",
    logo: "/placeholder.svg?height=40&width=40&text=QB",
  },
]

export default function MerchantsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [buildingFilter, setBuildingFilter] = useState("all")

  const filteredMerchants = mockMerchants.filter((merchant) => {
    const matchesSearch =
      merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
      merchant.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || merchant.status === statusFilter
    const matchesType = typeFilter === "all" || merchant.type === typeFilter
    const matchesBuilding = buildingFilter === "all" || merchant.building === buildingFilter

    return matchesSearch && matchesStatus && matchesType && matchesBuilding
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-100 text-green-800">• Active</Badge>
      case "Lease Expiring Soon":
        return <Badge className="bg-orange-100 text-orange-800">• Lease Expiring Soon</Badge>
      case "Under Renovation":
        return <Badge className="bg-blue-100 text-blue-800">• Under Renovation</Badge>
      case "Inactive":
        return <Badge className="bg-gray-100 text-gray-800">• Inactive</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">• {status}</Badge>
    }
  }

  const uniqueTypes = [...new Set(mockMerchants.map(m => m.type))]
  const uniqueBuildings = [...new Set(mockMerchants.map(m => m.building))]
  const uniqueStatuses = [...new Set(mockMerchants.map(m => m.status))]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Merchants</h1>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Browse Directory
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Add merchant
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Title and Filters on Background */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">All merchants ({filteredMerchants.length})</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search merchants..."
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={buildingFilter} onValueChange={setBuildingFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All buildings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All buildings</SelectItem>
                      {uniqueBuildings.map(building => (
                        <SelectItem key={building} value={building}>{building}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {uniqueTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      {uniqueStatuses.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                      <TableHead className="text-left font-medium text-gray-500">Merchant</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Type</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">
                        <div className="flex items-center">
                          Building & Location
                          <ChevronDown className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-left font-medium text-gray-500">
                        <div className="flex items-center">
                          <Clock className="mr-1 h-4 w-4" />
                          Hours
                        </div>
                      </TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Lease Info</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Contact</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMerchants.map((merchant) => (
                      <TableRow key={merchant.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={merchant.logo} />
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                                {merchant.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{merchant.name}</div>
                              <div className="text-sm text-gray-500">{merchant.website}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-gray-900">{merchant.type}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <div className="flex items-center text-gray-900">
                              <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                              {merchant.building}
                            </div>
                            <div className="text-sm text-gray-500">
                              {merchant.floor} • Unit {merchant.unit}
                            </div>
                            <div className="text-sm text-gray-500">
                              {merchant.squareFootage}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="text-gray-900 text-sm">
                            {merchant.hours}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <div className="text-gray-900 font-medium">{merchant.monthlyRent}/mo</div>
                            <div className="text-sm text-gray-500">Expires {merchant.leaseExpires}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div>
                            <div className="text-gray-900 text-sm">{merchant.contactPerson}</div>
                            <div className="text-sm text-gray-500">{merchant.phone}</div>
                            <div className="text-sm text-gray-500">{merchant.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(merchant.status)}
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