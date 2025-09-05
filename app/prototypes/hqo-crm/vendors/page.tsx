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
import { Search, Download, ChevronDown } from "lucide-react"

const mockVendors = [
  {
    id: "1",
    name: "FedEx",
    website: "fedex.com",
    type: "Logistics and Shipping",
    lastOnsite: "Onsite now",
    coiStatus: "COI on file",
    coiExpires: "06/03/2025",
    coiStatusType: "active",
    vendorPersonnel: [
      { name: "Person 1", avatar: "/placeholder.svg" },
      { name: "Person 2", avatar: "/placeholder.svg" },
      { name: "Person 3", avatar: "/placeholder.svg" },
    ],
    totalPersonnel: 5,
    logo: "/placeholder.svg?height=40&width=40&text=FX",
  },
  {
    id: "2",
    name: "DoorDash",
    website: "doordash.com",
    type: "Food Delivery",
    lastOnsite: "1 hour ago",
    coiStatus: "COI on file",
    coiExpires: "06/03/2025",
    coiStatusType: "active",
    vendorPersonnel: [
      { name: "Person 1", avatar: "/placeholder.svg" },
      { name: "Person 2", avatar: "/placeholder.svg" },
      { name: "Person 3", avatar: "/placeholder.svg" },
    ],
    totalPersonnel: 5,
    logo: "/placeholder.svg?height=40&width=40&text=DD",
  },
  {
    id: "3",
    name: "UPS",
    website: "ups.com",
    type: "Logistics and Shipping",
    lastOnsite: "1 day ago",
    coiStatus: "No COI",
    coiExpires: null,
    coiStatusType: "none",
    vendorPersonnel: [
      { name: "Person 1", avatar: "/placeholder.svg" },
      { name: "Person 2", avatar: "/placeholder.svg" },
      { name: "Person 3", avatar: "/placeholder.svg" },
    ],
    totalPersonnel: 5,
    logo: "/placeholder.svg?height=40&width=40&text=UPS",
  },
  {
    id: "4",
    name: "Dave's Coffee Bar",
    website: "daves.com",
    type: "Specialized Services",
    lastOnsite: "2 days ago",
    coiStatus: "COI on file",
    coiExpires: "12/10/2024",
    coiStatusType: "expired",
    vendorPersonnel: [
      { name: "Person 1", avatar: "/placeholder.svg" },
      { name: "Person 2", avatar: "/placeholder.svg" },
      { name: "Person 3", avatar: "/placeholder.svg" },
    ],
    totalPersonnel: 5,
    logo: "/placeholder.svg?height=40&width=40&text=DC",
  },
  {
    id: "5",
    name: "Yoda Yoga",
    website: "yodayoga.com",
    type: "Specialized Services",
    lastOnsite: "1 month ago",
    coiStatus: "COI on file",
    coiExpires: "06/03/2025",
    coiStatusType: "active",
    vendorPersonnel: [
      { name: "Person 1", avatar: "/placeholder.svg" },
      { name: "Person 2", avatar: "/placeholder.svg" },
      { name: "Person 3", avatar: "/placeholder.svg" },
    ],
    totalPersonnel: 5,
    logo: "/placeholder.svg?height=40&width=40&text=YY",
  },
  {
    id: "6",
    name: "Convergence",
    website: "convergence.com",
    type: "Construction",
    lastOnsite: "3 months ago",
    coiStatus: "COI on file",
    coiExpires: "06/03/2025",
    coiStatusType: "active",
    vendorPersonnel: [
      { name: "Person 1", avatar: "/placeholder.svg" },
      { name: "Person 2", avatar: "/placeholder.svg" },
      { name: "Person 3", avatar: "/placeholder.svg" },
    ],
    totalPersonnel: 5,
    logo: "/placeholder.svg?height=40&width=40&text=CV",
  },
  {
    id: "7",
    name: "UberEats",
    website: "uber.com",
    type: "Food Delivery",
    lastOnsite: "NA",
    coiStatus: "COI on file",
    coiExpires: "04/03/2025",
    coiStatusType: "expires-soon",
    vendorPersonnel: [
      { name: "Person 1", avatar: "/placeholder.svg" },
      { name: "Person 2", avatar: "/placeholder.svg" },
      { name: "Person 3", avatar: "/placeholder.svg" },
    ],
    totalPersonnel: 5,
    logo: "/placeholder.svg?height=40&width=40&text=UE",
  },
]

export default function VendorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [coiStatusFilter, setCoiStatusFilter] = useState("all")

  const filteredVendors = mockVendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.website.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCoiStatus = coiStatusFilter === "all" || 
      (coiStatusFilter === "active" && vendor.coiStatusType === "active") ||
      (coiStatusFilter === "expired" && vendor.coiStatusType === "expired") ||
      (coiStatusFilter === "expires-soon" && vendor.coiStatusType === "expires-soon") ||
      (coiStatusFilter === "none" && vendor.coiStatusType === "none")

    return matchesSearch && matchesCoiStatus
  })

  const getCoiStatusBadge = (coiStatus: string, coiStatusType: string, coiExpires: string | null) => {
    if (coiStatusType === "none") {
      return <span className="text-red-600 font-medium">No COI</span>
    }
    
    if (coiStatusType === "expired") {
      return <Badge className="bg-red-100 text-red-800">• Expired</Badge>
    }
    
    if (coiStatusType === "expires-soon") {
      return <Badge className="bg-orange-100 text-orange-800">• Expires soon</Badge>
    }
    
    return <Badge className="bg-green-100 text-green-800">• Active</Badge>
  }

  const renderVendorPersonnel = (personnel: any[], totalPersonnel: number) => {
    const displayPersonnel = personnel.slice(0, 3)
    const remaining = totalPersonnel - 3

    return (
      <div className="flex items-center -space-x-2">
        {displayPersonnel.map((person, index) => (
          <Avatar key={index} className="h-8 w-8 border-2 border-white">
            <AvatarImage src={person.avatar} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
              {person.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
        {remaining > 0 && (
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 border-2 border-white text-xs font-medium text-gray-600">
            +{remaining}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Vendors</h1>
            <div className="flex items-center space-x-3">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Browse Marketplace
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Add vendor
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
                <h3 className="text-lg font-medium">All vendors ({filteredVendors.length})</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search vendors..."
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={coiStatusFilter} onValueChange={setCoiStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All COI statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="expires-soon">Expires soon</SelectItem>
                      <SelectItem value="none">No COI</SelectItem>
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
                {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="text-left font-medium text-gray-500">Vendor</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">Type</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">
                      <div className="flex items-center">
                        Last onsite
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-left font-medium text-gray-500">COI</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">COI status</TableHead>
                    <TableHead className="text-left font-medium text-gray-500">
                      <div className="flex items-center">
                        Vendor personnel
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={vendor.logo} />
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
                              {vendor.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">{vendor.name}</div>
                            <div className="text-sm text-gray-500">{vendor.website}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-gray-900">{vendor.type}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-gray-900">{vendor.lastOnsite}</span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div>
                          <div className="text-gray-900">{vendor.coiStatus}</div>
                          {vendor.coiExpires && (
                            <div className="text-sm text-gray-500">Expires {vendor.coiExpires}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getCoiStatusBadge(vendor.coiStatus, vendor.coiStatusType, vendor.coiExpires)}
                      </TableCell>
                      <TableCell className="py-4">
                        {renderVendorPersonnel(vendor.vendorPersonnel, vendor.totalPersonnel)}
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