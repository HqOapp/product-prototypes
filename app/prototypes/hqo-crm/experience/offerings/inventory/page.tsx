"use client"

import { useState } from "react"
// Sidebar is provided by app/experience/layout.tsx
import { Card, CardContent } from "@/components/ui/card"
import { AlertBanner } from "@/components/ui/alert-banner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Download, Filter, Plus } from "lucide-react"

// Inventory dataset aligned with the new table structure
const mockInventoryData = [
  {
    id: "1",
    name: "Conference Room – 3rd Floor",
    type: "Space",
    subtype: "Conference Room",
    inventoryUnit: "15-min block",
    unitCapacityPerDay: 40,
    totalUnits30Days: 1200,
    unitsBooked: 320,
    unitsAvailable: 880,
    utilizationPercent: "26.7%",
    bookingWindowDays: 30,
    minBookingDuration: "15 min",
    price: "$50/hr",
    linkedServices: "Catering – Meeting Package",
    linkedVendors: "CATERCO"
  },
  {
    id: "2",
    name: "Event Hall",
    type: "Space",
    subtype: "Event Space",
    inventoryUnit: "1 booking/day",
    unitCapacityPerDay: 1,
    totalUnits30Days: 30,
    unitsBooked: 8,
    unitsAvailable: 22,
    utilizationPercent: "26.7%",
    bookingWindowDays: 90,
    minBookingDuration: "4 hrs",
    price: "$2,000",
    linkedServices: "Catering – Premium, AV Support",
    linkedVendors: "CATERCO, AVCO"
  },
  {
    id: "3",
    name: "Wet Lab – Building C",
    type: "Space",
    subtype: "Specialty Space",
    inventoryUnit: "1-hour block",
    unitCapacityPerDay: 8,
    totalUnits30Days: 240,
    unitsBooked: 30,
    unitsAvailable: 210,
    utilizationPercent: "12.5%",
    bookingWindowDays: 60,
    minBookingDuration: "1 hr",
    price: "$400/day",
    linkedServices: "None",
    linkedVendors: "None"
  },
  {
    id: "4",
    name: "Catering – Meeting Package",
    type: "Service",
    subtype: "Catering",
    inventoryUnit: "Service Order",
    unitCapacityPerDay: 3,
    totalUnits30Days: 90,
    unitsBooked: 45,
    unitsAvailable: 45,
    utilizationPercent: "50%",
    bookingWindowDays: 14,
    minBookingDuration: "N/A",
    price: "$25/person",
    linkedServices: "N/A",
    linkedVendors: "CATERCO"
  },
  {
    id: "5",
    name: "Daily Office Cleaning",
    type: "Service",
    subtype: "Maintenance",
    inventoryUnit: "Job Slot",
    unitCapacityPerDay: 1,
    totalUnits30Days: 30,
    unitsBooked: 25,
    unitsAvailable: 5,
    utilizationPercent: "83.3%",
    bookingWindowDays: 30,
    minBookingDuration: "N/A",
    price: "$0.25/sq ft",
    linkedServices: "N/A",
    linkedVendors: "CLEANCO"
  },
  {
    id: "6",
    name: "Gym Membership",
    type: "Amenity",
    subtype: "Membership",
    inventoryUnit: "Membership",
    unitCapacityPerDay: "Unlimited",
    totalUnits30Days: "Unlimited",
    unitsBooked: 200,
    unitsAvailable: "Unlimited",
    utilizationPercent: "N/A",
    bookingWindowDays: 365,
    minBookingDuration: "N/A",
    price: "$50/mo",
    linkedServices: "N/A",
    linkedVendors: "None"
  },
  {
    id: "7",
    name: "Lounge Day Pass",
    type: "Amenity",
    subtype: "Day Pass",
    inventoryUnit: "Day Pass",
    unitCapacityPerDay: 20,
    totalUnits30Days: 600,
    unitsBooked: 250,
    unitsAvailable: 350,
    utilizationPercent: "41.7%",
    bookingWindowDays: 30,
    minBookingDuration: "N/A",
    price: "$20/day",
    linkedServices: "N/A",
    linkedVendors: "None"
  },
  {
    id: "8",
    name: "Weekly Yoga Class",
    type: "Event",
    subtype: "Recurring Program",
    inventoryUnit: "Seat/Ticket",
    unitCapacityPerDay: "20 (2x/wk)",
    totalUnits30Days: 160,
    unitsBooked: 120,
    unitsAvailable: 40,
    utilizationPercent: "75%",
    bookingWindowDays: 30,
    minBookingDuration: "N/A",
    price: "$10/session",
    linkedServices: "N/A",
    linkedVendors: "YOGACO"
  },
  {
    id: "9",
    name: "Networking Night",
    type: "Event",
    subtype: "One-time Event",
    inventoryUnit: "Seat/Ticket",
    unitCapacityPerDay: 100,
    totalUnits30Days: 100,
    unitsBooked: 90,
    unitsAvailable: 10,
    utilizationPercent: "90%",
    bookingWindowDays: 60,
    minBookingDuration: "N/A",
    price: "$20/ticket",
    linkedServices: "Catering – Premium",
    linkedVendors: "CATERCO"
  },
  {
    id: "10",
    name: "Move-In Package",
    type: "Vendor Bundle",
    subtype: "Space + Service + Vendor",
    inventoryUnit: "Bundle Fulfillment",
    unitCapacityPerDay: 1,
    totalUnits30Days: 30,
    unitsBooked: 12,
    unitsAvailable: 18,
    utilizationPercent: "40%",
    bookingWindowDays: 60,
    minBookingDuration: "N/A",
    price: "$5,000",
    linkedServices: "IT Setup, Furniture Delivery",
    linkedVendors: "ITCO, FURNCO"
  }
]

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const filteredInventory = mockInventoryData.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.subtype && item.subtype.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (item.linkedVendors && item.linkedVendors.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredInventory.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, itemId])
    } else {
      setSelectedItems(selectedItems.filter(id => id !== itemId))
    }
  }

  // Sorting removed per request; headers are no longer interactive

  return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
            <div className="flex items-center space-x-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>

          {/* Description Banner */}
          <AlertBanner 
            title="About Inventory"
            description="Track and manage your offering inventory levels. Monitor availability, commitments, and stock levels across all your offerings."
          />

          {/* Search and Filters */}
          <div className="hidden flex items-center space-x-4 mt-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by offering name, type, or vendor"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="space">Space</SelectItem>
                <SelectItem value="resource">Resource</SelectItem>
                <SelectItem value="event">Event</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                <SelectItem value="membership">Membership</SelectItem>
                <SelectItem value="class">Class</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More filters
            </Button>
          </div>

          {selectedItems.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-blue-900">
                  {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Bulk edit quantities
                </Button>
                <Button variant="outline" size="sm">
                  Export selected
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6 space-y-6">
            {/* Title and Filters on Background */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">All inventory ({filteredInventory.length})</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by offering name, type, or vendor"
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      <SelectItem value="space">Space</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="next-30-days">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Next 30 Days" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="next-30-days">Next 30 days</SelectItem>
                      <SelectItem value="next-7-days">Next 7 days</SelectItem>
                      <SelectItem value="next-90-days">Next 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="mt-4 flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-900">
                      {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Bulk edit quantities
                    </Button>
                    <Button variant="outline" size="sm">
                      Export selected
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Data Table with White Background */}
            <Card>
              <CardContent className="p-0">
                {/* Table */}
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-gray-200">
                      <TableHead className="w-12 text-left font-medium text-gray-500">
                        <Checkbox
                          checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Offering name</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Type</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Subtype</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Units</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Total units</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Utilization</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Price</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Linked services</TableHead>
                      <TableHead className="text-left font-medium text-gray-500">Linked vendors</TableHead>
                    </TableRow>
                  </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="py-4">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="font-medium text-gray-900 truncate">{item.name}</div>
                    </TableCell>
                    <TableCell className="py-4">{item.type}</TableCell>
                    <TableCell className="py-4">{item.subtype}</TableCell>
                    <TableCell className="py-4">{item.inventoryUnit}</TableCell>
                    <TableCell className="py-4">{item.totalUnits30Days}</TableCell>
                    <TableCell className="py-4">{typeof item.utilizationPercent === 'string' ? item.utilizationPercent.replace('%', '') : item.utilizationPercent}</TableCell>
                    <TableCell className="py-4">{item.price}</TableCell>
                    <TableCell className="py-4">{item.linkedServices}</TableCell>
                    <TableCell className="py-4">{item.linkedVendors}</TableCell>
                  </TableRow>
                ))}
                              </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}