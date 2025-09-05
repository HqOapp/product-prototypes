"use client"

import { useState } from "react"
import { Clock, Filter, Grid, List, MapPin, Plus, Search, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

// Mock data for amenities
const amenities = [
  {
    id: "1",
    name: "Conference Room A",
    type: "Meeting Space",
    location: "Floor 3",
    capacity: 12,
    features: ["Video Conferencing", "Whiteboard", "Display Screen"],
    isReservable: true,
    image: "/placeholder.svg?height=200&width=300",
    availability: "Available",
    description: "Large conference room with state-of-the-art video conferencing equipment.",
    bookings: [
      { id: "b1", date: "2025-06-08", startTime: "10:00", endTime: "11:30", bookedBy: "Acme Corp" },
      { id: "b2", date: "2025-06-08", startTime: "14:00", endTime: "15:30", bookedBy: "Globex Inc" },
    ],
  },
  {
    id: "2",
    name: "Fitness Center",
    type: "Wellness",
    location: "Floor 1",
    capacity: 30,
    features: ["Cardio Equipment", "Free Weights", "Locker Rooms"],
    isReservable: false,
    image: "/placeholder.svg?height=200&width=300",
    availability: "24/7 Access",
    description: "Fully equipped fitness center with cardio machines, weights, and locker rooms.",
    accessControl: "Key Card Required",
  },
  {
    id: "3",
    name: "Rooftop Terrace",
    type: "Common Area",
    location: "Floor 12",
    capacity: 75,
    features: ["Outdoor Seating", "BBQ Area", "Panoramic Views"],
    isReservable: true,
    image: "/placeholder.svg?height=200&width=300",
    availability: "Available",
    description: "Spacious rooftop terrace with panoramic city views, perfect for events and gatherings.",
    bookings: [{ id: "b3", date: "2025-06-10", startTime: "17:00", endTime: "20:00", bookedBy: "Initech" }],
  },
  {
    id: "4",
    name: "Café & Lounge",
    type: "Food & Beverage",
    location: "Floor 1",
    capacity: 50,
    features: ["Coffee Bar", "Casual Seating", "Grab-and-Go Food"],
    isReservable: false,
    image: "/placeholder.svg?height=200&width=300",
    availability: "Mon-Fri, 7am-5pm",
    description: "On-site café offering coffee, snacks, and light meals with comfortable seating areas.",
  },
  {
    id: "5",
    name: "Wellness Room",
    type: "Wellness",
    location: "Floor 2",
    capacity: 4,
    features: ["Privacy", "Comfortable Seating", "Dimmable Lighting"],
    isReservable: true,
    image: "/placeholder.svg?height=200&width=300",
    availability: "Available",
    description: "Private room for nursing mothers, meditation, or short rest periods.",
    bookings: [],
  },
  {
    id: "6",
    name: "Boardroom",
    type: "Meeting Space",
    location: "Floor 10",
    capacity: 20,
    features: ["Executive Seating", "Presentation System", "Catering Available"],
    isReservable: true,
    image: "/placeholder.svg?height=200&width=300",
    availability: "Available",
    description: "Executive boardroom with premium furnishings and advanced presentation technology.",
    bookings: [{ id: "b4", date: "2025-06-09", startTime: "09:00", endTime: "12:00", bookedBy: "Wayne Enterprises" }],
  },
  {
    id: "7",
    name: "Bike Storage",
    type: "Transportation",
    location: "Basement",
    capacity: 40,
    features: ["Secure Access", "Repair Station", "Changing Room"],
    isReservable: false,
    image: "/placeholder.svg?height=200&width=300",
    availability: "24/7 Access",
    description: "Secure bicycle storage with repair tools and changing facilities.",
    accessControl: "Key Card Required",
  },
  {
    id: "8",
    name: "EV Charging Stations",
    type: "Transportation",
    location: "Parking Garage",
    capacity: 8,
    features: ["Level 2 Chargers", "Reserved Parking", "Usage Monitoring"],
    isReservable: true,
    image: "/placeholder.svg?height=200&width=300",
    availability: "4 Available",
    description: "Electric vehicle charging stations with dedicated parking spaces.",
    bookings: [
      { id: "b5", date: "2025-06-08", startTime: "08:00", endTime: "17:00", bookedBy: "Tenant Vehicle #1234" },
      { id: "b6", date: "2025-06-08", startTime: "08:00", endTime: "17:00", bookedBy: "Tenant Vehicle #5678" },
      { id: "b7", date: "2025-06-08", startTime: "08:00", endTime: "17:00", bookedBy: "Tenant Vehicle #9012" },
      { id: "b8", date: "2025-06-08", startTime: "08:00", endTime: "17:00", bookedBy: "Tenant Vehicle #3456" },
    ],
  },
]

// Amenity type options for filtering
const amenityTypes = [
  { value: "all", label: "All Types" },
  { value: "Meeting Space", label: "Meeting Space" },
  { value: "Wellness", label: "Wellness" },
  { value: "Common Area", label: "Common Area" },
  { value: "Food & Beverage", label: "Food & Beverage" },
  { value: "Transportation", label: "Transportation" },
]

interface AmenitiesTabProps {
  building: any
}

export function AmenitiesTab({ building }: AmenitiesTabProps) {
  const [selectedView, setSelectedView] = useState("grid")
  const [selectedAmenity, setSelectedAmenity] = useState<any>(null)
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showBookingDialog, setShowBookingDialog] = useState(false)

  // Filter amenities based on type and search query
  const filteredAmenities = amenities.filter((amenity) => {
    const matchesType = filterType === "all" || amenity.type === filterType
    const matchesSearch =
      amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amenity.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  // Function to handle amenity selection
  const handleAmenitySelect = (amenity: any) => {
    setSelectedAmenity(amenity)
  }

  return (
    <div className="p-6">
      {/* Header with summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{amenities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Reservable Spaces</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{amenities.filter((a) => a.isReservable).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Now</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{amenities.filter((a) => a.availability === "Available").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Bookings Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and view options */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search amenities..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {amenityTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2 w-full md:w-auto justify-between md:justify-end">
          <Button variant="outline" size="sm" className="h-9">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
          <Tabs value={selectedView} onValueChange={setSelectedView} className="w-auto">
            <TabsList className="grid w-24 grid-cols-2">
              <TabsTrigger value="grid">
                <Grid className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Amenity
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Amenities list/grid */}
        <div className={`${selectedAmenity ? "hidden md:block md:col-span-2" : "col-span-3"}`}>
          {selectedView === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAmenities.map((amenity) => (
                <Card
                  key={amenity.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleAmenitySelect(amenity)}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={amenity.image || "/placeholder.svg"}
                      alt={amenity.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{amenity.name}</CardTitle>
                      <Badge variant={amenity.isReservable ? "default" : "secondary"}>
                        {amenity.isReservable ? "Reservable" : "Open Access"}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {amenity.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      Capacity: {amenity.capacity}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="text-sm font-medium">{amenity.availability}</div>
                    {amenity.isReservable && (
                      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
                        <DialogTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="outline">
                            Book
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-md border">
              <div className="grid grid-cols-12 p-4 border-b font-medium text-sm text-muted-foreground">
                <div className="col-span-4">Name</div>
                <div className="col-span-2">Type</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-2">Capacity</div>
                <div className="col-span-2">Status</div>
              </div>
              {filteredAmenities.map((amenity) => (
                <div
                  key={amenity.id}
                  className="grid grid-cols-12 p-4 border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleAmenitySelect(amenity)}
                >
                  <div className="col-span-4 font-medium">{amenity.name}</div>
                  <div className="col-span-2">{amenity.type}</div>
                  <div className="col-span-2">{amenity.location}</div>
                  <div className="col-span-2">{amenity.capacity}</div>
                  <div className="col-span-2 flex items-center">
                    <Badge
                      variant={amenity.availability === "Available" ? "outline" : "secondary"}
                      className="font-normal"
                    >
                      {amenity.availability}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Amenity details */}
        {selectedAmenity && (
          <div className="col-span-3 md:col-span-1">
            <Card>
              <CardHeader className="relative pb-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-4 top-4 h-8 w-8 p-0 md:hidden"
                  onClick={() => setSelectedAmenity(null)}
                >
                  ✕
                </Button>
                <div className="aspect-video w-full overflow-hidden rounded-md mb-4">
                  <img
                    src={selectedAmenity.image || "/placeholder.svg"}
                    alt={selectedAmenity.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardTitle>{selectedAmenity.name}</CardTitle>
                <CardDescription className="flex items-center mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {selectedAmenity.location}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedAmenity.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>Capacity: {selectedAmenity.capacity}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      <span>{selectedAmenity.availability}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-1">Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedAmenity.features.map((feature: string, index: number) => (
                      <Badge key={index} variant="outline" className="font-normal">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedAmenity.isReservable && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Upcoming Bookings</h4>
                    {selectedAmenity.bookings && selectedAmenity.bookings.length > 0 ? (
                      <div className="space-y-2">
                        {selectedAmenity.bookings.slice(0, 3).map((booking: any) => (
                          <div key={booking.id} className="text-sm p-2 bg-muted rounded-md">
                            <div className="font-medium">{booking.date}</div>
                            <div className="text-muted-foreground">
                              {booking.startTime} - {booking.endTime}
                            </div>
                            <div className="text-xs">{booking.bookedBy}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No upcoming bookings</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                {selectedAmenity.isReservable && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Book Now</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Book {selectedAmenity.name}</DialogTitle>
                        <DialogDescription>Select date and time to reserve this amenity.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="date" className="text-right">
                            Date
                          </Label>
                          <Input id="date" type="date" className="col-span-3" defaultValue="2025-06-08" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="start-time" className="text-right">
                            Start Time
                          </Label>
                          <Input id="start-time" type="time" className="col-span-3" defaultValue="09:00" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="end-time" className="text-right">
                            End Time
                          </Label>
                          <Input id="end-time" type="time" className="col-span-3" defaultValue="10:00" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="attendees" className="text-right">
                            Attendees
                          </Label>
                          <Input
                            id="attendees"
                            type="number"
                            className="col-span-3"
                            defaultValue="1"
                            min="1"
                            max={selectedAmenity.capacity}
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="notes" className="text-right">
                            Notes
                          </Label>
                          <Input id="notes" className="col-span-3" placeholder="Any special requirements" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                          Confirm Booking
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="outline" className="w-full">
                  View Full Details
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
