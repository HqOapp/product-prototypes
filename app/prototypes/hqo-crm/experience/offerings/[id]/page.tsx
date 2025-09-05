"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, Info } from "lucide-react"

// Reuse the mock data from the offerings list for prefill
const offerings = [
  { id: "1", title: "Conference Room A", description: "Modern conference room with video conferencing capabilities", type: "space", vendor: "", price: "50", tags: ["video","whiteboard"], images: [] as string[] },
  { id: "2", title: "Office Supplies Kit", description: "Essential office supplies for daily work needs", type: "resource", vendor: "Office Supply Co", price: "25", tags: ["pens","notebooks"], images: [] as string[] },
  { id: "3", title: "Monthly Networking Event", description: "Professional networking event for building connections", type: "event", vendor: "", price: "0", tags: ["networking"], images: [] as string[] },
  { id: "4", title: "IT Support Service", description: "24/7 technical support for all your IT needs", type: "service", vendor: "TechSupport Pro", price: "150", tags: ["support"], images: [] as string[] },
  { id: "5", title: "Daily Lunch Delivery", description: "Fresh, healthy meals delivered daily to your office", type: "food-beverage", vendor: "Fresh Eats Co", price: "12", tags: ["lunch"], images: [] as string[] },
  { id: "6", title: "Gym Membership", description: "Full access to building fitness center and classes", type: "membership", vendor: "", price: "50", tags: ["fitness"], images: [] as string[] },
  { id: "7", title: "Excel Fundamentals Workshop", description: "Learn essential Excel skills for business productivity", type: "class", vendor: "Learning Hub", price: "0", tags: ["excel"], images: [] as string[] },
]

const productTypes = [
  { value: "space", label: "Space" },
  { value: "service", label: "Service" },
  { value: "amenity", label: "Amenity" },
  { value: "event-program", label: "Event / Program" },
  { value: "vendor-bundle", label: "Vendor Bundle" },
  { value: "other", label: "Other" },
]

const subtypeOptions: Record<string, { value: string; label: string }[]> = {
  space: [
    { value: "conference-room", label: "Conference Room" },
    { value: "team-room", label: "Team Room" },
    { value: "private-office-suite", label: "Private Office / Suite" },
    { value: "event-space-hall", label: "Event Space / Hall" },
    { value: "specialty-wet-lab", label: "Specialty Space – Wet Lab" },
    { value: "specialty-podcast-studio", label: "Specialty Space – Podcast Studio" },
    { value: "specialty-kitchen-maker", label: "Specialty Space – Kitchen / Maker Space" },
    { value: "retail-unit", label: "Retail Unit" },
    { value: "hot-desk-flex", label: "Hot Desk / Flex Space" },
  ],
  service: [
    { value: "catering-meeting", label: "Catering – Meeting Package" },
    { value: "catering-premium", label: "Catering – Premium Package" },
    { value: "cleaning-maintenance", label: "Cleaning / Maintenance Service" },
    { value: "it-setup-workstation", label: "IT Setup / Workstation Service" },
    { value: "av-support", label: "AV Support Service" },
    { value: "security", label: "Security Service" },
    { value: "move-in-relocation", label: "Move-in / Relocation Service" },
    { value: "lifestyle-wellness-concierge", label: "Lifestyle Service (Wellness, Concierge)" },
  ],
  amenity: [
    { value: "gym-membership", label: "Gym Membership" },
    { value: "lounge-day-pass", label: "Lounge Day Pass" },
    { value: "rooftop-access-seasonal", label: "Rooftop Access – Seasonal Membership" },
    { value: "wellness-room-access", label: "Wellness Room Access" },
    { value: "locker-access", label: "Locker Access" },
    { value: "parking-ev", label: "Parking Pass / EV Charging Access" },
  ],
  "event-program": [
    { value: "one-time-event", label: "One-time Event" },
    { value: "recurring-program", label: "Recurring Program" },
    { value: "workshop-training", label: "Workshop / Training Session" },
    { value: "class-fitness-educational-hobby", label: "Class (Fitness / Educational / Hobby)" },
    { value: "networking-event", label: "Networking Event" },
    { value: "seasonal-activation", label: "Seasonal Activation / Holiday Event" },
  ],
  "vendor-bundle": [
    { value: "move-in-package", label: "Move-In Package (Furniture + IT + AV)" },
    { value: "pop-up-retail-marketing", label: "Pop-Up Retail Space + Marketing" },
    { value: "event-hall-catering-av", label: "Event Hall + Catering + AV" },
    { value: "amenity-service-package", label: "Amenity + Service Package" },
    { value: "space-vendor-service", label: "Space + Vendor Service" },
  ],
  other: [
    { value: "custom", label: "Custom" },
  ],
}

export default function OfferingDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const offeringId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string)

  const initial = useMemo(() => offerings.find(o => o.id === offeringId) || offerings[0], [offeringId])

  const normalizedType = useMemo(() => {
    switch (initial.type) {
      case 'resource':
        return 'service'
      case 'event':
      case 'class':
        return 'event-program'
      case 'membership':
        return 'amenity'
      case 'food-beverage':
        return 'service'
      default:
        return initial.type
    }
  }, [initial.type])

  const [formData, setFormData] = useState({
    title: initial.title,
    description: initial.description,
    type: normalizedType,
    subtype: "",
    vendor: initial.vendor,
    price: initial.price,
    comparePrice: "",
    costPerItem: "",
    status: "draft",
    isPhysicalProduct: false,
    trackQuantity: false,
    quantity: "",
    weight: "",
    tags: initial.tags,
    images: initial.images,
    // Resource/Service-specific fields
    unitLabel: "",
    capacityPerBooking: "",
    allowMultiplePerBooking: false,
    requireApproval: false,
    totalUnits: "",
    // Event-specific fields
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    timezone: "",
    allDay: false,
    recurrence: "none",
    registrationRequired: false,
    waitlistEnabled: false,
    ticketPrice: "",
    attendeeCapacity: "",
    locationType: "onsite",
    locationName: "",
    locationAddress: "",
    virtualUrl: "",
    hosts: [] as string[],
  })

  const [newTag, setNewTag] = useState("")
  const [newHost, setNewHost] = useState("")

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove))
  }

  const addHost = () => {
    if (newHost.trim() && !formData.hosts.includes(newHost.trim())) {
      handleInputChange('hosts', [...formData.hosts, newHost.trim()])
      setNewHost("")
    }
  }

  const removeHost = (hostToRemove: string) => {
    handleInputChange('hosts', formData.hosts.filter(h => h !== hostToRemove))
  }

  return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/experience/offerings">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Offerings
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{formData.title}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => router.push('/experience/offerings')}>Discard</Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Space/Resource-specific main cards */}
                {formData.type === 'space' || formData.type === 'resource' ? (
                  <>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                            <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                            <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="mt-1 min-h-[120px]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Resource configuration</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="unitLabel" className="text-sm font-medium">Units</Label>
                            <Input id="unitLabel" placeholder="e.g., kit, bundle, item" value={formData.unitLabel} onChange={(e) => handleInputChange('unitLabel', e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="capacityPerBooking" className="text-sm font-medium">Capacity per booking</Label>
                            <Input id="capacityPerBooking" type="number" placeholder="0" value={formData.capacityPerBooking} onChange={(e) => handleInputChange('capacityPerBooking', e.target.value)} className="mt-1" />
                          </div>
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch id="allow-multiple" checked={formData.allowMultiplePerBooking} onCheckedChange={(checked) => handleInputChange('allowMultiplePerBooking', checked)} />
                            <Label htmlFor="allow-multiple" className="text-sm">Allow multiple per booking</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="require-approval" checked={formData.requireApproval} onCheckedChange={(checked) => handleInputChange('requireApproval', checked)} />
                            <Label htmlFor="require-approval" className="text-sm">Require approval</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Inventory</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch id="track-quantity" checked={formData.trackQuantity} onCheckedChange={(checked) => handleInputChange('trackQuantity', checked)} />
                            <Label htmlFor="track-quantity" className="text-sm">Track quantity</Label>
                          </div>
                          {formData.trackQuantity && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="totalUnits" className="text-sm font-medium">Total units</Label>
                                <Input id="totalUnits" type="number" placeholder="0" value={formData.totalUnits} onChange={(e) => handleInputChange('totalUnits', e.target.value)} className="mt-1 max-w-xs" />
                              </div>
                              <div>
                                <Label htmlFor="quantity" className="text-sm font-medium">Quantity available</Label>
                                <Input id="quantity" type="number" placeholder="0" value={formData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} className="mt-1 max-w-xs" />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Pricing</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input id="price" placeholder="0.00" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} className="pl-8" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="comparePrice" className="text-sm font-medium">Compare-at price</Label>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input id="comparePrice" placeholder="0.00" value={formData.comparePrice} onChange={(e) => handleInputChange('comparePrice', e.target.value)} className="pl-8" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Media</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <div className="space-y-2">
                            <Button variant="outline" size="sm">Upload new</Button>
                            <Button variant="ghost" size="sm">Select existing</Button>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">Accepts images, videos, or 3D models</p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : formData.type === 'event-program' ? (
                  <>
                    {/* Overview */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                            <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                            <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="mt-1 min-h-[120px]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Schedule</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate" className="text-sm font-medium">Start date</Label>
                            <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => handleInputChange('startDate', e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="endDate" className="text-sm font-medium">End date</Label>
                            <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => handleInputChange('endDate', e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="startTime" className="text-sm font-medium">Start time</Label>
                            <Input id="startTime" type="time" value={formData.startTime} onChange={(e) => handleInputChange('startTime', e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="endTime" className="text-sm font-medium">End time</Label>
                            <Input id="endTime" type="time" value={formData.endTime} onChange={(e) => handleInputChange('endTime', e.target.value)} className="mt-1" />
                          </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="timezone" className="text-sm font-medium">Time zone</Label>
                            <Input id="timezone" placeholder="e.g., America/New_York" value={formData.timezone} onChange={(e) => handleInputChange('timezone', e.target.value)} className="mt-1" />
                          </div>
                          <div className="flex items-center space-x-2 mt-6 md:mt-8">
                            <Switch id="allDay" checked={formData.allDay} onCheckedChange={(checked) => handleInputChange('allDay', checked)} />
                            <Label htmlFor="allDay" className="text-sm">All day event</Label>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="recurrence" className="text-sm font-medium">Recurrence</Label>
                          <Select value={formData.recurrence} onValueChange={(value) => handleInputChange('recurrence', value)}>
                            <SelectTrigger id="recurrence" className="mt-1 max-w-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Does not repeat</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Registration & Capacity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Registration & capacity</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="attendeeCapacity" className="text-sm font-medium">Attendee capacity</Label>
                            <Input id="attendeeCapacity" type="number" placeholder="0" value={formData.attendeeCapacity} onChange={(e) => handleInputChange('attendeeCapacity', e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="ticketPrice" className="text-sm font-medium">Ticket price</Label>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input id="ticketPrice" placeholder="0.00" value={formData.ticketPrice} onChange={(e) => handleInputChange('ticketPrice', e.target.value)} className="pl-8" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="flex items-center space-x-2">
                            <Switch id="registrationRequired" checked={formData.registrationRequired} onCheckedChange={(checked) => handleInputChange('registrationRequired', checked)} />
                            <Label htmlFor="registrationRequired" className="text-sm">Require registration</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="waitlistEnabled" checked={formData.waitlistEnabled} onCheckedChange={(checked) => handleInputChange('waitlistEnabled', checked)} />
                            <Label htmlFor="waitlistEnabled" className="text-sm">Enable waitlist</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Location */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Location</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium">Type</Label>
                            <Select value={formData.locationType} onValueChange={(value) => handleInputChange('locationType', value)}>
                              <SelectTrigger className="mt-1">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="onsite">Onsite</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="locationName" className="text-sm font-medium">Location name</Label>
                            <Input id="locationName" placeholder="e.g., Event Hall A" value={formData.locationName} onChange={(e) => handleInputChange('locationName', e.target.value)} className="mt-1" />
                          </div>
                        </div>
                        {formData.locationType === 'onsite' ? (
                          <div className="mt-4">
                            <Label htmlFor="locationAddress" className="text-sm font-medium">Address</Label>
                            <Input id="locationAddress" placeholder="Street, city, state" value={formData.locationAddress} onChange={(e) => handleInputChange('locationAddress', e.target.value)} className="mt-1" />
                          </div>
                        ) : (
                          <div className="mt-4">
                            <Label htmlFor="virtualUrl" className="text-sm font-medium">Virtual meeting link</Label>
                            <Input id="virtualUrl" placeholder="https://..." value={formData.virtualUrl} onChange={(e) => handleInputChange('virtualUrl', e.target.value)} className="mt-1" />
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Hosts & Speakers */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Hosts & speakers</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        {formData.hosts.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {formData.hosts.map((host) => (
                              <Badge key={host} variant="secondary" className="text-xs">
                                {host}
                                <Button variant="ghost" size="sm" className="h-auto p-0 ml-2" onClick={() => removeHost(host)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <Input placeholder="Add host/speaker" value={newHost} onChange={(e) => setNewHost(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addHost()} className="flex-1" />
                          <Button type="button" variant="outline" size="sm" onClick={addHost}>+
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Media */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Media</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <div className="space-y-2">
                            <Button variant="outline" size="sm">Upload new</Button>
                            <Button variant="ghost" size="sm">Select existing</Button>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">Accepts images, videos, or 3D models</p>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    {/* Generic default (non-Resource) fallback keeps previous sections */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                            <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                            <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className="mt-1 min-h-[120px]" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Media</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <div className="space-y-2">
                            <Button variant="outline" size="sm">Upload new</Button>
                            <Button variant="ghost" size="sm">Select existing</Button>
                          </div>
                          <p className="text-sm text-gray-500 mt-2">Accepts images, videos, or 3D models</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Pricing</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="price" className="text-sm font-medium">Price</Label>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input id="price" placeholder="0.00" value={formData.price} onChange={(e) => handleInputChange('price', e.target.value)} className="pl-8" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="comparePrice" className="text-sm font-medium">Compare-at price</Label>
                            <div className="relative mt-1">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                              <Input id="comparePrice" placeholder="0.00" value={formData.comparePrice} onChange={(e) => handleInputChange('comparePrice', e.target.value)} className="pl-8" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Inventory</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 pt-0">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch id="track-quantity" checked={formData.trackQuantity} onCheckedChange={(checked) => handleInputChange('trackQuantity', checked)} />
                            <Label htmlFor="track-quantity" className="text-sm">Track quantity</Label>
                          </div>
                          {formData.trackQuantity && (
                            <div>
                              <Label htmlFor="quantity" className="text-sm font-medium">Quantity</Label>
                              <Input id="quantity" placeholder="0" value={formData.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} className="mt-1 max-w-xs" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Offering</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div>
                      <Label htmlFor="offering-type" className="text-sm font-medium">Offering type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => {
                          handleInputChange('type', value)
                          handleInputChange('subtype', '')
                        }}
                      >
                        <SelectTrigger id="offering-type" className="mt-1">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent>
                          {productTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="offering-subtype" className="text-sm font-medium">Subtype</Label>
                      <Select
                        value={formData.subtype}
                        onValueChange={(value) => handleInputChange('subtype', value)}
                      >
                        <SelectTrigger id="offering-subtype" className="mt-1">
                          <SelectValue placeholder="Select a subtype" />
                        </SelectTrigger>
                        <SelectContent>
                          {(subtypeOptions[formData.type] || []).map((st) => (
                            <SelectItem key={st.value} value={st.value}>{st.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">Offering organization <Info className="h-4 w-4 ml-2 text-gray-400" /></CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-4">
                    <div>
                      <Label htmlFor="vendor" className="text-sm font-medium">Vendor</Label>
                      <Input id="vendor" placeholder="Enter vendor name" value={formData.vendor} onChange={(e) => handleInputChange('vendor', e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Tags</Label>
                      <div className="mt-1">
                        {formData.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                                <Button variant="ghost" size="sm" className="h-auto p-0 ml-2" onClick={() => removeTag(tag)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <Input placeholder="Add tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTag()} className="flex-1" />
                          <Button type="button" variant="outline" size="sm" onClick={addTag}>+
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}


