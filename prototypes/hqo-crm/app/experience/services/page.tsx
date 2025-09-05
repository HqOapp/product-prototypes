"use client"

import { useState } from "react"
// Sidebar is provided by app/experience/layout.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Plus, 
  Grid3X3, 
  List, 
  Star, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  TrendingUp
} from "lucide-react"

// Mock data for service categories
const serviceCategories = [
  {
    id: "wellness",
    name: "Health & Wellness",
    description: "Fitness, spa, and wellness services",
    icon: "🧘",
    color: "bg-purple-50 border-purple-200 text-purple-900",
    vendorCount: 12,
    activeServices: 8
  },
  {
    id: "convenience",
    name: "Convenience Services", 
    description: "Dry cleaning, grocery delivery, concierge",
    icon: "🛒",
    color: "bg-blue-50 border-blue-200 text-blue-900",
    vendorCount: 18,
    activeServices: 15
  },
  {
    id: "home",
    name: "Home & Maintenance",
    description: "Handyman, cleaning, repair services", 
    icon: "🔧",
    color: "bg-orange-50 border-orange-200 text-orange-900",
    vendorCount: 10,
    activeServices: 7
  },
  {
    id: "food",
    name: "Food & Dining",
    description: "Meal prep, catering, restaurant delivery",
    icon: "🍽️", 
    color: "bg-green-50 border-green-200 text-green-900",
    vendorCount: 15,
    activeServices: 12
  },
  {
    id: "transportation",
    name: "Transportation",
    description: "Car services, bike sharing, parking",
    icon: "🚗",
    color: "bg-indigo-50 border-indigo-200 text-indigo-900",
    vendorCount: 8,
    activeServices: 5
  },
  {
    id: "business",
    name: "Business Services",
    description: "Printing, IT support, office supplies",
    icon: "💼",
    color: "bg-gray-50 border-gray-200 text-gray-900",
    vendorCount: 14,
    activeServices: 9
  }
]

// Mock data for active services
const activeServices = [
  {
    id: "1",
    name: "CleanCo Dry Cleaning",
    category: "Convenience Services",
    vendor: "CleanCo",
    description: "Premium dry cleaning with pickup and delivery service",
    status: "active",
    tenantRating: 4.8,
    monthlyBookings: 156,
    revenue: 2340,
    lastBooking: "2 hours ago",
    image: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200",
    logo: "DC"
  },
  {
    id: "2", 
    name: "PetPals Pet Care",
    category: "Convenience Services",
    vendor: "PetPals",
    description: "Professional dog walking and pet sitting services",
    status: "active",
    tenantRating: 4.9,
    monthlyBookings: 89,
    revenue: 1780,
    lastBooking: "1 hour ago",
    image: "bg-gradient-to-br from-green-50 to-green-100 border-green-200",
    logo: "🐕"
  },
  {
    id: "3",
    name: "ZenSpa Massage Therapy", 
    category: "Health & Wellness",
    vendor: "ZenSpa",
    description: "In-home massage therapy and wellness treatments",
    status: "active",
    tenantRating: 4.7,
    monthlyBookings: 67,
    revenue: 3200,
    lastBooking: "3 hours ago",
    image: "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200",
    logo: "🧘"
  },
  {
    id: "4",
    name: "FitPro Personal Training",
    category: "Health & Wellness", 
    vendor: "FitPro",
    description: "Personal training sessions and fitness coaching",
    status: "pending",
    tenantRating: 4.6,
    monthlyBookings: 45,
    revenue: 2100,
    lastBooking: "1 day ago",
    image: "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200",
    logo: "💪"
  },
  {
    id: "5",
    name: "FreshCart Grocery Delivery",
    category: "Food & Dining",
    vendor: "FreshCart", 
    description: "Fresh grocery delivery from local markets",
    status: "active",
    tenantRating: 4.5,
    monthlyBookings: 203,
    revenue: 4560,
    lastBooking: "30 minutes ago",
    image: "bg-gradient-to-br from-red-50 to-red-100 border-red-200",
    logo: "🛒"
  }
]

// Mock data for marketplace vendors
const marketplaceVendors = [
  {
    id: "v1",
    name: "AutoShine Mobile Detailing",
    category: "Transportation",
    description: "Professional mobile car detailing and maintenance", 
    rating: 4.8,
    reviewCount: 124,
    priceRange: "$$",
    responseTime: "2 hours",
    image: "bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200",
    logo: "🚗",
    tags: ["Mobile", "Eco-friendly", "Insurance"]
  },
  {
    id: "v2",
    name: "MealPrep+ Healthy Meals",
    category: "Food & Dining",
    description: "Nutritious meal preparation and delivery service",
    rating: 4.6,
    reviewCount: 89,
    priceRange: "$$$",
    responseTime: "1 day",
    image: "bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200",
    logo: "🍱",
    tags: ["Organic", "Dietary Options", "Weekly Plans"]
  },
  {
    id: "v3",
    name: "FixIt Pro Handyman",
    category: "Home & Maintenance",
    description: "Professional home repair and maintenance services",
    rating: 4.9,
    reviewCount: 156,
    priceRange: "$$",
    responseTime: "4 hours",
    image: "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200",
    logo: "🔧",
    tags: ["Licensed", "Emergency", "Warranty"]
  }
]

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("active")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [viewMode, setViewMode] = useState("grid")

  const filteredActiveServices = activeServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredMarketplaceVendors = marketplaceVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         vendor.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || vendor.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Services</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your tenant service marketplace and active offerings</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add service
                </Button>
              </div>
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2 this month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">560</div>
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15% vs last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$13,980</div>
                  <div className="text-xs text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +22% vs last month
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center">
                    4.7
                    <Star className="h-4 w-4 text-yellow-400 ml-1 fill-current" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Based on 1,234 reviews
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Service Categories */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Service Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {serviceCategories.map((category) => (
                    <div
                      key={category.id}
                      className={`p-4 rounded-lg border-2 hover:shadow-md transition-all cursor-pointer ${category.color}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-2xl">{category.icon}</div>
                        <Badge variant="outline" className="text-xs">
                          {category.activeServices} active
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                      <p className="text-xs opacity-75 mb-3">{category.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span>{category.vendorCount} vendors</span>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          View all
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="active">Active Services</TabsTrigger>
                  <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search services..."
                      className="pl-9 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <TabsContent value="active" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredActiveServices.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-lg ${service.image} flex items-center justify-center text-lg font-bold border`}>
                            {service.logo}
                          </div>
                          <Badge 
                            variant={service.status === "active" ? "default" : "secondary"}
                            className={service.status === "active" ? "bg-green-100 text-green-800" : ""}
                          >
                            <div className="flex items-center">
                              {service.status === "active" ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <AlertCircle className="h-3 w-3 mr-1" />
                              )}
                              • {service.status}
                            </div>
                          </Badge>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                            <span className="font-medium">{service.tenantRating}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {service.lastBooking}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Monthly bookings</span>
                            <div className="font-semibold">{service.monthlyBookings}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Revenue</span>
                            <div className="font-semibold">${service.revenue}</div>
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Settings className="h-3 w-3 mr-1" />
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="marketplace" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMarketplaceVendors.map((vendor) => (
                    <Card key={vendor.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-lg ${vendor.image} flex items-center justify-center text-lg font-bold border`}>
                            {vendor.logo}
                          </div>
                          <Badge variant="outline">{vendor.priceRange}</Badge>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{vendor.name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{vendor.description}</p>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                            <span className="font-medium">{vendor.rating}</span>
                            <span className="text-muted-foreground ml-1">({vendor.reviewCount})</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {vendor.responseTime}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {vendor.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View Details
                          </Button>
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                            Add Service
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
  )
}
