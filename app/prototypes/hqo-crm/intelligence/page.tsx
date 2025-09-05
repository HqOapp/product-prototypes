"use client"

import { useState, useRef, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MetricCard } from "@/components/metric-card"
import { LineChartComponent } from "@/components/line-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Building2, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  GripVertical,
  Copy,
  Settings,
  Sparkles,
  Target,
  PieChart,
  Activity,
  Check,
  X
} from "lucide-react"
import { useNavigation } from "@/lib/navigation-context"

// Types for dashboard views
interface DashboardView {
  id: string
  name: string
  type: 'executive' | 'regional' | 'property' | 'custom'
  icon: any
  description: string
  isDefault: boolean
  createdAt: Date
  lastModified: Date
}

// View templates for quick setup
const viewTemplates = [
  {
    id: 'executive',
    name: 'Senior Executive',
    type: 'executive' as const,
    icon: Target,
    description: 'High-level portfolio performance and strategic metrics',
    isDefault: true
  },
  {
    id: 'regional',
    name: 'Regional Executive',
    type: 'regional' as const,
    icon: MapPin,
    description: 'Regional performance comparison and market analysis',
    isDefault: true
  },
  {
    id: 'property',
    name: 'Property Manager',
    type: 'property' as const,
    icon: Building2,
    description: 'Operational metrics and day-to-day management insights',
    isDefault: true
  },
  {
    id: 'analytics',
    name: 'Analytics Deep Dive',
    type: 'custom' as const,
    icon: BarChart3,
    description: 'Advanced analytics and data visualization',
    isDefault: false
  },
  {
    id: 'financial',
    name: 'Financial Overview',
    type: 'custom' as const,
    icon: DollarSign,
    description: 'Revenue, expenses, and financial performance',
    isDefault: false
  },
  {
    id: 'tenant',
    name: 'Tenant Experience',
    type: 'custom' as const,
    icon: Users,
    description: 'Tenant satisfaction and engagement metrics',
    isDefault: false
  }
]

export default function IntelligencePage() {
  const { isNavigationHidden } = useNavigation()
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [timeRange, setTimeRange] = useState("6m")
  const [activeView, setActiveView] = useState("executive")
  const [isAddViewOpen, setIsAddViewOpen] = useState(false)
  const [editingViewId, setEditingViewId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)

  // Initialize with default views
  const [dashboardViews, setDashboardViews] = useState<DashboardView[]>([
    {
      id: 'executive',
      name: 'Senior Executive',
      type: 'executive',
      icon: Target,
      description: 'High-level portfolio performance and strategic metrics',
      isDefault: true,
      createdAt: new Date(),
      lastModified: new Date()
    },
    {
      id: 'regional',
      name: 'Regional Executive',
      type: 'regional',
      icon: MapPin,
      description: 'Regional performance comparison and market analysis',
      isDefault: true,
      createdAt: new Date(),
      lastModified: new Date()
    },
    {
      id: 'property',
      name: 'Property Manager',
      type: 'property',
      icon: Building2,
      description: 'Operational metrics and day-to-day management insights',
      isDefault: true,
      createdAt: new Date(),
      lastModified: new Date()
    }
  ])

  // Portfolio Performance Data
  const portfolioMetrics = {
    totalValue: "$847M",
    totalProperties: 89,
    avgOccupancy: 87.2,
    avgRent: "$42.50",
    renewalRate: 89.2,
    noi: "$156M",
    capRate: 6.8,
    totalSqFt: "12.4M"
  }

  // Regional Performance Data
  const regionalData = [
    {
      region: "Central",
      properties: 28,
      occupancy: 89.1,
      avgRent: 45.20,
      noi: 52.3,
      renewalRate: 91.5,
      markets: ["Dallas", "Minnesota"],
      trend: "up",
      change: 2.3
    },
    {
      region: "Southeast", 
      properties: 24,
      occupancy: 86.8,
      avgRent: 41.80,
      noi: 48.7,
      renewalRate: 88.9,
      markets: ["Atlanta", "Orlando"],
      trend: "up",
      change: 1.8
    },
    {
      region: "Northeast",
      properties: 37,
      occupancy: 85.9,
      avgRent: 41.10,
      noi: 54.9,
      renewalRate: 87.2,
      markets: ["NY", "Boston", "DC/NoVA"],
      trend: "down",
      change: -0.7
    }
  ]

  // Top/Bottom Performing Properties
  const topProperties = [
    { name: "Prestige Park Tower", location: "Dallas, TX", occupancy: 96.2, noi: 8.4, trend: "up" },
    { name: "Metro Center Plaza", location: "Atlanta, GA", occupancy: 94.8, noi: 7.9, trend: "up" },
    { name: "Liberty Square", location: "Boston, MA", occupancy: 93.1, noi: 7.2, trend: "up" }
  ]

  const bottomProperties = [
    { name: "Commerce Point", location: "Orlando, FL", occupancy: 72.3, noi: 3.1, trend: "down" },
    { name: "Gateway Center", location: "Minneapolis, MN", occupancy: 74.8, noi: 3.8, trend: "down" },
    { name: "Harbor View", location: "DC, VA", occupancy: 76.2, noi: 4.2, trend: "down" }
  ]

  // Key Alerts for Property Managers
  const keyAlerts = [
    { type: "renewal", message: "15 leases expiring in next 90 days", priority: "high", count: 15 },
    { type: "maintenance", message: "8 critical work orders pending", priority: "high", count: 8 },
    { type: "vacancy", message: "12 units vacant >60 days", priority: "medium", count: 12 },
    { type: "collections", message: "6 tenants with overdue rent", priority: "high", count: 6 }
  ]

  // Performance Trend Data
  const performanceTrend = [
    { month: "Jan", portfolio: 85.2, benchmark: 82.1, noi: 145.2 },
    { month: "Feb", portfolio: 86.1, benchmark: 82.4, noi: 147.8 },
    { month: "Mar", portfolio: 87.3, benchmark: 82.8, noi: 151.2 },
    { month: "Apr", portfolio: 87.8, benchmark: 83.2, noi: 153.6 },
    { month: "May", portfolio: 86.9, benchmark: 83.1, noi: 152.1 },
    { month: "Jun", portfolio: 87.2, benchmark: 83.5, noi: 156.0 }
  ]

  const getRegionalColor = (region: string) => {
    switch (region) {
      case "Central": return "bg-blue-100 text-blue-800"
      case "Southeast": return "bg-green-100 text-green-800"  
      case "Northeast": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-orange-100 text-orange-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // View management functions
  const handleAddView = (template: typeof viewTemplates[0]) => {
    const newView: DashboardView = {
      id: `view-${Date.now()}`,
      name: template.name,
      type: template.type,
      icon: template.icon,
      description: template.description,
      isDefault: false,
      createdAt: new Date(),
      lastModified: new Date()
    }
    setDashboardViews([...dashboardViews, newView])
    setActiveView(newView.id)
    setIsAddViewOpen(false)
  }

  const handleDeleteView = (viewId: string) => {
    const view = dashboardViews.find(v => v.id === viewId)
    if (view?.isDefault) return // Can't delete default views
    
    setDashboardViews(dashboardViews.filter(v => v.id !== viewId))
    if (activeView === viewId) {
      setActiveView(dashboardViews[0].id)
    }
  }

  const handleDuplicateView = (viewId: string) => {
    const view = dashboardViews.find(v => v.id === viewId)
    if (!view) return

    const duplicatedView: DashboardView = {
      ...view,
      id: `view-${Date.now()}`,
      name: `${view.name} (Copy)`,
      isDefault: false,
      createdAt: new Date(),
      lastModified: new Date()
    }
    setDashboardViews([...dashboardViews, duplicatedView])
  }

  const startEditingName = (viewId: string, currentName: string) => {
    setEditingViewId(viewId)
    setEditingName(currentName)
  }

  const saveEditingName = () => {
    if (editingViewId && editingName.trim()) {
      setDashboardViews(dashboardViews.map(view => 
        view.id === editingViewId 
          ? { ...view, name: editingName.trim(), lastModified: new Date() }
          : view
      ))
    }
    setEditingViewId(null)
    setEditingName("")
  }

  const cancelEditingName = () => {
    setEditingViewId(null)
    setEditingName("")
  }

  // Auto-focus and select text when editing starts
  useEffect(() => {
    if (editingViewId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingViewId])

  // Handle keyboard shortcuts for editing
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditingName()
    } else if (e.key === 'Escape') {
      cancelEditingName()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      
      <div className={`flex-1 flex flex-col overflow-hidden ${isNavigationHidden ? 'w-full' : ''}`}>        
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Intelligence Overview</h1>
                <p className="text-gray-600">Portfolio performance and property management insights</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  View Report
                </Button>
              </div>
            </div>

            {/* Custom Tabs with Management */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center space-x-1 -mb-px">
                  {dashboardViews.map((view) => (
                    <div key={view.id} className="group relative">
                      <button
                        onClick={() => setActiveView(view.id)}
                        className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors ${
                          activeView === view.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <view.icon className="h-4 w-4" />
                        {editingViewId === view.id ? (
                          <Input
                            ref={editInputRef}
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={saveEditingName}
                            onKeyDown={handleEditKeyDown}
                            className="h-6 px-1 py-0 text-sm border-0 bg-transparent focus:ring-1 focus:ring-blue-500 min-w-[120px]"
                          />
                        ) : (
                          <span>{view.name}</span>
                        )}
                        
                        {/* Tab Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                            >
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>View Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => startEditingName(view.id, view.name)}
                            >
                              <Edit2 className="h-4 w-4 mr-2" />
                              Rename view
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDuplicateView(view.id)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate view
                            </DropdownMenuItem>
                            {!view.isDefault && (
                              <DropdownMenuItem
                                onClick={() => handleDeleteView(view.id)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete view
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </button>
                    </div>
                  ))}
                  
                  {/* Add New View Button */}
                  <Dialog open={isAddViewOpen} onOpenChange={setIsAddViewOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center space-x-2 px-4 py-3 text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add view</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add New Dashboard View</DialogTitle>
                        <DialogDescription>
                          Choose a template to create a new dashboard view, or start with a blank view.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        {viewTemplates.map((template) => (
                          <div
                            key={template.id}
                            onClick={() => handleAddView(template)}
                            className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                          >
                            <div className="flex items-start space-x-3">
                              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                                <template.icon className="h-5 w-5 text-gray-600 group-hover:text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 group-hover:text-blue-900">
                                  {template.name}
                                </h4>
                                <p className="text-sm text-gray-500 mt-1">
                                  {template.description}
                                </p>
                                {template.isDefault && (
                                  <Badge variant="secondary" className="mt-2 text-xs">
                                    Default Template
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddViewOpen(false)}>
                          Cancel
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* View Content */}
              <div className="space-y-6">
                {/* Senior Executive View */}
                {activeView === 'executive' && (
                  <div className="space-y-6">
                    {/* Portfolio Overview Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <MetricCard
                        title="Total Portfolio Value"
                        value={portfolioMetrics.totalValue}
                        change={5.2}
                        changeLabel="YoY"
                        icon={<DollarSign className="h-4 w-4" />}
                      />
                      <MetricCard
                        title="Properties"
                        value={portfolioMetrics.totalProperties}
                        change={2.3}
                        changeLabel="from last quarter"
                        icon={<Building2 className="h-4 w-4" />}
                      />
                      <MetricCard
                        title="Avg Occupancy"
                        value={`${portfolioMetrics.avgOccupancy}%`}
                        change={1.8}
                        changeLabel="from last month"
                        icon={<TrendingUp className="h-4 w-4" />}
                      />
                      <MetricCard
                        title="NOI"
                        value={portfolioMetrics.noi}
                        change={7.4}
                        changeLabel="YoY"
                        icon={<BarChart3 className="h-4 w-4" />}
                      />
                    </div>

                    {/* Regional Performance Comparison */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Regional Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {regionalData.map((region) => (
                            <div key={region.region} className="space-y-4 p-4 border rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <Badge className={getRegionalColor(region.region)}>
                                    {region.region}
                                  </Badge>
                                  {region.trend === "up" ? (
                                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                                <span className={`text-sm font-medium ${region.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                                  {region.trend === "up" ? "+" : ""}{region.change}%
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm text-gray-500">Properties</div>
                                  <div className="text-lg font-semibold">{region.properties}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Occupancy</div>
                                  <div className="text-lg font-semibold">{region.occupancy}%</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">Avg Rent</div>
                                  <div className="text-lg font-semibold">${region.avgRent}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-500">NOI</div>
                                  <div className="text-lg font-semibold">${region.noi}M</div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="text-sm text-gray-500 mb-1">Markets</div>
                                <div className="text-sm">{region.markets.join(", ")}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Portfolio Performance Trend */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Portfolio Performance vs Benchmark</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <LineChartComponent
                          data={performanceTrend}
                          lines={[
                            { dataKey: "portfolio", name: "Your Portfolio", color: "#3b82f6", strokeWidth: 3 },
                            { dataKey: "benchmark", name: "Industry Benchmark", color: "#64748b", strokeDasharray: "5 5" }
                          ]}
                          xAxisDataKey="month"
                          height={300}
                        />
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Regional Executive View */}
                {activeView === 'regional' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Regional Performance Dashboard</h3>
                      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Regions</SelectItem>
                          <SelectItem value="central">Central Region</SelectItem>
                          <SelectItem value="southeast">Southeast Region</SelectItem>
                          <SelectItem value="northeast">Northeast Region</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Regional Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <MetricCard
                        title="Regional Properties"
                        value="28"
                        change={4.2}
                        changeLabel="from last quarter"
                        icon={<Building2 className="h-4 w-4" />}
                      />
                      <MetricCard
                        title="Occupancy Rate"
                        value="89.1%"
                        change={2.1}
                        changeLabel="from last month"
                        icon={<TrendingUp className="h-4 w-4" />}
                      />
                      <MetricCard
                        title="Avg Rent PSF"
                        value="$45.20"
                        change={3.8}
                        changeLabel="YoY"
                        icon={<DollarSign className="h-4 w-4" />}
                      />
                      <MetricCard
                        title="Renewal Rate"
                        value="91.5%"
                        change={1.2}
                        changeLabel="from last quarter"
                        icon={<CheckCircle className="h-4 w-4" />}
                      />
                    </div>

                    {/* Top and Bottom Performers */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-green-700">Top Performing Properties</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {topProperties.map((property, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                <div>
                                  <div className="font-medium">{property.name}</div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {property.location}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">Occupancy</div>
                                  <div className="font-semibold text-green-700">{property.occupancy}%</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-red-700">Properties Needing Attention</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {bottomProperties.map((property, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                <div>
                                  <div className="font-medium">{property.name}</div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {property.location}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm text-gray-500">Occupancy</div>
                                  <div className="font-semibold text-red-700">{property.occupancy}%</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Property Manager View */}
                {activeView === 'property' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Property Management Dashboard</h3>

                    {/* Operational Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <MetricCard
                        title="Active Leases"
                        value="1,247"
                        change={2.1}
                        changeLabel="from last month"
                        icon={<Users className="h-4 w-4" />}
                      />
                      <MetricCard
                        title="Pending Work Orders"
                        value="23"
                        change={-15.2}
                        changeLabel="from last week"
                        icon={<Clock className="h-4 w-4" />}
                      />
                      <MetricCard
                        title="Lease Renewals (90d)"
                        value="45"
                        change={8.3}
                        changeLabel="from last quarter"
                        icon={<CheckCircle className="h-4 w-4" />}
                      />
                      <MetricCard
                        title="Collections Rate"
                        value="96.8%"
                        change={0.5}
                        changeLabel="from last month"
                        icon={<DollarSign className="h-4 w-4" />}
                      />
                    </div>

                    {/* Key Alerts */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Key Alerts & Action Items</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {keyAlerts.map((alert, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <AlertTriangle className={`h-5 w-5 ${
                                  alert.priority === "high" ? "text-red-500" : 
                                  alert.priority === "medium" ? "text-orange-500" : "text-green-500"
                                }`} />
                                <div>
                                  <div className="font-medium">{alert.message}</div>
                                  <Badge className={getPriorityColor(alert.priority)} variant="secondary">
                                    {alert.priority.toUpperCase()}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-2xl font-bold text-gray-900">
                                {alert.count}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Tenant Satisfaction & Maintenance */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Tenant Satisfaction</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="text-center">
                              <div className="text-4xl font-bold text-green-600">4.2</div>
                              <div className="text-sm text-gray-500">Average Rating</div>
                            </div>
                            <Progress value={84} className="h-3" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="font-medium">Response Rate</div>
                                <div className="text-gray-500">78%</div>
                              </div>
                              <div>
                                <div className="font-medium">Surveys Completed</div>
                                <div className="text-gray-500">1,247</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Maintenance Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm text-gray-500">Avg Response Time</div>
                                <div className="text-2xl font-bold">2.4h</div>
                              </div>
                              <div>
                                <div className="text-sm text-gray-500">Completion Rate</div>
                                <div className="text-2xl font-bold">94%</div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Emergency</span>
                                <span className="font-medium">1.2h avg</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Urgent</span>
                                <span className="font-medium">4.8h avg</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Routine</span>
                                <span className="font-medium">24h avg</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Custom Views */}
                {!['executive', 'regional', 'property'].includes(activeView) && (
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Custom Dashboard View
                      </h3>
                      <p className="text-gray-500 mb-6">
                        This is a custom view. Configure your metrics and widgets here.
                      </p>
                      <Button>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure View
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 