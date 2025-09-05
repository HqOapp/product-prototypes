"use client"

import { useState } from "react"
import { FilterDropdown } from "@/components/filter-tabs"
import { PageTabs } from "@/components/page-tabs"
import {
  ArrowLeftRightIcon as ArrowsLeftRight,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HeatmapChart } from "@/components/heatmap-chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Define LineChartComponent
const LineChartComponent = ({ data, lines, xAxisDataKey, height }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xAxisDataKey} />
      <YAxis />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Legend />
      {lines.map((line, index) => (
        <Line key={index} type="monotone" dataKey={line.dataKey} name={line.name} stroke={line.color} strokeWidth={2} />
      ))}
    </LineChart>
  </ResponsiveContainer>
)

// Define DonutChart component
const DonutChart = ({ data, height }) => (
  <div className="h-full flex items-center justify-center">
    <ChartContainer
      config={{
        value: {
          color: "hsl(var(--chart-1))",
        },
      }}
    >
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  </div>
)

export default function ProductAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("30d")

  // Sample data for charts
  const userActivityData = [
    { date: "Jan", active: 65, new: 23 },
    { date: "Feb", active: 59, new: 19 },
    { date: "Mar", active: 80, new: 32 },
    { date: "Apr", active: 81, new: 27 },
    { date: "May", active: 56, new: 15 },
    { date: "Jun", active: 55, new: 12 },
    { date: "Jul", active: 60, new: 18 },
    { date: "Aug", active: 70, new: 26 },
    { date: "Sep", active: 74, new: 28 },
    { date: "Oct", active: 78, new: 30 },
    { date: "Nov", active: 85, new: 35 },
    { date: "Dec", active: 90, new: 40 },
  ]

  const workOrdersData = [
    { date: "Jan", resolved: 120, created: 130 },
    { date: "Feb", resolved: 132, created: 125 },
    { date: "Mar", resolved: 95, created: 110 },
    { date: "Apr", resolved: 105, created: 100 },
    { date: "May", resolved: 115, created: 120 },
    { date: "Jun", resolved: 135, created: 130 },
    { date: "Jul", resolved: 125, created: 140 },
    { date: "Aug", resolved: 145, created: 150 },
    { date: "Sep", resolved: 160, created: 155 },
    { date: "Oct", resolved: 170, created: 165 },
    { date: "Nov", resolved: 180, created: 175 },
    { date: "Dec", resolved: 190, created: 185 },
  ]

  const visitorData = [
    { date: "Jan", visitors: 1200 },
    { date: "Feb", visitors: 1300 },
    { date: "Mar", visitors: 1400 },
    { date: "Apr", visitors: 1800 },
    { date: "May", visitors: 2000 },
    { date: "Jun", visitors: 2200 },
    { date: "Jul", visitors: 1900 },
    { date: "Aug", visitors: 2100 },
    { date: "Sep", visitors: 2300 },
    { date: "Oct", visitors: 2500 },
    { date: "Nov", visitors: 2700 },
    { date: "Dec", visitors: 3000 },
  ]

  const resourceBookingData = [
    { date: "Jan", conference: 250, desk: 420, parking: 180 },
    { date: "Feb", conference: 280, desk: 450, parking: 190 },
    { date: "Mar", conference: 300, desk: 470, parking: 200 },
    { date: "Apr", conference: 320, desk: 500, parking: 220 },
    { date: "May", conference: 340, desk: 520, parking: 230 },
    { date: "Jun", conference: 360, desk: 550, parking: 250 },
    { date: "Jul", conference: 380, desk: 580, parking: 270 },
    { date: "Aug", conference: 400, desk: 600, parking: 290 },
    { date: "Sep", conference: 420, desk: 620, parking: 310 },
    { date: "Oct", conference: 440, desk: 650, parking: 330 },
    { date: "Nov", conference: 460, desk: 680, parking: 350 },
    { date: "Dec", conference: 480, desk: 700, parking: 370 },
  ]

  const contentEngagementData = [
    { date: "Jan", views: 5000, interactions: 1200 },
    { date: "Feb", views: 5500, interactions: 1300 },
    { date: "Mar", views: 6000, interactions: 1400 },
    { date: "Apr", views: 6500, interactions: 1500 },
    { date: "May", views: 7000, interactions: 1600 },
    { date: "Jun", views: 7500, interactions: 1700 },
    { date: "Jul", views: 8000, interactions: 1800 },
    { date: "Aug", views: 8500, interactions: 1900 },
    { date: "Sep", views: 9000, interactions: 2000 },
    { date: "Oct", views: 9500, interactions: 2100 },
    { date: "Nov", views: 10000, interactions: 2200 },
    { date: "Dec", views: 10500, interactions: 2300 },
  ]

  const surveyResponseData = [
    { date: "Jan", responses: 320, satisfaction: 4.2 },
    { date: "Feb", responses: 350, satisfaction: 4.3 },
    { date: "Mar", responses: 370, satisfaction: 4.1 },
    { date: "Apr", responses: 390, satisfaction: 4.4 },
    { date: "May", responses: 410, satisfaction: 4.5 },
    { date: "Jun", responses: 430, satisfaction: 4.6 },
    { date: "Jul", responses: 450, satisfaction: 4.7 },
    { date: "Aug", responses: 470, satisfaction: 4.5 },
    { date: "Sep", responses: 490, satisfaction: 4.4 },
    { date: "Oct", responses: 510, satisfaction: 4.6 },
    { date: "Nov", responses: 530, satisfaction: 4.7 },
    { date: "Dec", responses: 550, satisfaction: 4.8 },
  ]

  const workOrderCategoryData = [
    { name: "HVAC", value: 35, color: "#3b82f6" },
    { name: "Electrical", value: 25, color: "#10b981" },
    { name: "Plumbing", value: 20, color: "#f59e0b" },
    { name: "Cleaning", value: 15, color: "#8b5cf6" },
    { name: "Other", value: 5, color: "#6b7280" },
  ]

  const visitorTypeData = [
    { name: "Employees", value: 45, color: "#3b82f6" },
    { name: "Clients", value: 30, color: "#10b981" },
    { name: "Vendors", value: 15, color: "#f59e0b" },
    { name: "Interviews", value: 10, color: "#8b5cf6" },
  ]

  const resourceTypeData = [
    { name: "Conference Rooms", value: 40, color: "#3b82f6" },
    { name: "Desks", value: 35, color: "#10b981" },
    { name: "Parking", value: 25, color: "#f59e0b" },
  ]

  const contentTypeData = [
    { name: "News", value: 30, color: "#3b82f6" },
    { name: "Events", value: 25, color: "#10b981" },
    { name: "Announcements", value: 20, color: "#f59e0b" },
    { name: "Resources", value: 15, color: "#8b5cf6" },
    { name: "Policies", value: 10, color: "#6b7280" },
  ]

  const surveyTypeData = [
    { name: "Satisfaction", value: 40, color: "#3b82f6" },
    { name: "Feedback", value: 30, color: "#10b981" },
    { name: "Pulse", value: 20, color: "#f59e0b" },
    { name: "Event", value: 10, color: "#8b5cf6" },
  ]

  // Sample heatmap data
  const generateHeatmapData = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    const hours = Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)
    const data = []

    days.forEach((day) => {
      hours.forEach((hour) => {
        // Generate random value between 1 and 100
        const value = Math.floor(Math.random() * 100) + 1
        data.push({ day, hour, value })
      })
    })

    return data
  }

  const workOrderHeatmapData = generateHeatmapData()
  const visitorHeatmapData = generateHeatmapData()
  const resourceBookingHeatmapData = generateHeatmapData()

  // Define tabs for the PageTabs component
  const tabs = [
    { label: "Overview", href: "#overview" },
    { label: "Work Orders", href: "#work-orders" },
    { label: "Visitor Management", href: "#visitor-management" },
    { label: "Resource Booking", href: "#resource-booking" },
    { label: "Content", href: "#content" },
    { label: "Surveys", href: "#surveys" },
  ]

  // Handle tab change
  const handleTabChange = (href: string) => {
    setActiveTab(href.replace("#", ""))
  }

  // Tab content components
  const TabContent = {
    overview: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Users className="h-4 w-4 mr-2 text-blue-500" />
                Active Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">74</div>
                  <div className="text-sm text-muted-foreground">Total active users</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-green-500" />
                Work Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Open work orders</div>
                </div>
                <div className="flex items-center text-red-500 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -3%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                Resource Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">423</div>
                  <div className="text-sm text-muted-foreground">Monthly bookings</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Active and new users over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    active: {
                      label: "Active Users",
                      color: "hsl(var(--chart-1))",
                    },
                    new: {
                      label: "New Users",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userActivityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="active"
                        stroke="var(--color-active)"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                      <Line type="monotone" dataKey="new" stroke="var(--color-new)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Work Order Trends</CardTitle>
              <CardDescription>Created vs. resolved work orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    created: {
                      label: "Created",
                      color: "hsl(var(--chart-3))",
                    },
                    resolved: {
                      label: "Resolved",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={workOrdersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="created" stroke="var(--color-created)" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Work Order Categories</CardTitle>
              <CardDescription>Distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                <ChartContainer
                  config={{
                    value: {
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workOrderCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {workOrderCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visitor Types</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                <ChartContainer
                  config={{
                    value: {
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={visitorTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {visitorTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resource Bookings</CardTitle>
              <CardDescription>Distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                <ChartContainer
                  config={{
                    value: {
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {resourceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
    "work-orders": (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">1,245</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Open Work Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">156</div>
                  <div className="text-sm text-muted-foreground">Currently open</div>
                </div>
                <div className="flex items-center text-red-500 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -3%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Avg. Resolution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">3.2 days</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Satisfaction Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">92%</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +2%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Work Order Trends</CardTitle>
              <CardDescription>Created vs. resolved work orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ChartContainer
                  config={{
                    created: {
                      label: "Created",
                      color: "hsl(var(--chart-3))",
                    },
                    resolved: {
                      label: "Resolved",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={workOrdersData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="created" stroke="var(--color-created)" strokeWidth={2} />
                      <Line type="monotone" dataKey="resolved" stroke="var(--color-resolved)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Work Order Categories</CardTitle>
              <CardDescription>Distribution by type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                <ChartContainer
                  config={{
                    value: {
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={workOrderCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {workOrderCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Work Order Submission Heatmap</CardTitle>
            <CardDescription>Submission frequency by day and hour</CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapChart data={workOrderHeatmapData} title="Work Order Submission Frequency" colorScale="blue" />
          </CardContent>
        </Card>
      </div>
    ),
    "visitor-management": (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">3,245</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Avg. Visit Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">2.5 hrs</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Check-in Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">45 sec</div>
                  <div className="text-sm text-muted-foreground">Average</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -12%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Pre-registered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">78%</div>
                  <div className="text-sm text-muted-foreground">Of all visitors</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Visitor Trends</CardTitle>
              <CardDescription>Monthly visitor count</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={visitorData}
                lines={[{ dataKey: "visitors", name: "Visitors", color: "#8b5cf6" }]}
                xAxisDataKey="date"
                height={300}
              />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Visitor Types</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                <ChartContainer
                  config={{
                    value: {
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={visitorTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {visitorTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Visitor Check-in Heatmap</CardTitle>
            <CardDescription>Check-in frequency by day and hour</CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapChart data={visitorHeatmapData} title="Visitor Check-in Frequency" colorScale="purple" />
          </CardContent>
        </Card>
      </div>
    ),
    "resource-booking": (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">1,876</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Utilization Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">72%</div>
                  <div className="text-sm text-muted-foreground">Average</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Avg. Booking Duration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">1.8 hrs</div>
                  <div className="text-sm text-muted-foreground">Per booking</div>
                </div>
                <div className="flex items-center text-red-500 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -3%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">No-show Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">8%</div>
                  <div className="text-sm text-muted-foreground">Of all bookings</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -2%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Booking Trends</CardTitle>
              <CardDescription>Bookings by resource type</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={resourceBookingData}
                lines={[
                  { dataKey: "conference", name: "Conference Rooms", color: "#3b82f6" },
                  { dataKey: "desk", name: "Desks", color: "#10b981" },
                  { dataKey: "parking", name: "Parking", color: "#f59e0b" },
                ]}
                xAxisDataKey="date"
                height={300}
              />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Resource Types</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] flex items-center justify-center">
                <ChartContainer
                  config={{
                    value: {
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        innerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {resourceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resource Booking Heatmap</CardTitle>
            <CardDescription>Booking frequency by day and hour</CardDescription>
          </CardHeader>
          <CardContent>
            <HeatmapChart data={resourceBookingHeatmapData} title="Resource Booking Frequency" colorScale="green" />
          </CardContent>
        </Card>
      </div>
    ),
    content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">24,567</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Engagement Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">23%</div>
                  <div className="text-sm text-muted-foreground">Avg. interaction</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Avg. Time on Page</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">2:45</div>
                  <div className="text-sm text-muted-foreground">Minutes:seconds</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +8%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Content Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">42</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="flex items-center text-red-500 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -3%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Content Engagement</CardTitle>
              <CardDescription>Views and interactions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={contentEngagementData}
                lines={[
                  { dataKey: "views", name: "Views", color: "#3b82f6" },
                  { dataKey: "interactions", name: "Interactions", color: "#f59e0b" },
                ]}
                xAxisDataKey="date"
                height={300}
              />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Content Types</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart data={contentTypeData} height={300} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Content</CardTitle>
            <CardDescription>Content with highest engagement rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Company Announcement: New Office Opening", views: 1245, engagement: "32%" },
                { title: "Employee Spotlight: Marketing Team", views: 987, engagement: "28%" },
                { title: "New Benefits Program Launch", views: 876, engagement: "25%" },
                { title: "Quarterly Town Hall Recording", views: 765, engagement: "22%" },
                { title: "Holiday Schedule 2023", views: 654, engagement: "20%" },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-sm text-muted-foreground">{item.views} views</div>
                    </div>
                  </div>
                  <div className="text-sm font-medium text-green-600">{item.engagement}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    ),
    surveys: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Total Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">4,567</div>
                  <div className="text-sm text-muted-foreground">Last 30 days</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +15%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Response Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">68%</div>
                  <div className="text-sm text-muted-foreground">Average</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +5%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Satisfaction Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">4.6/5</div>
                  <div className="text-sm text-muted-foreground">Average rating</div>
                </div>
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +0.2
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Active Surveys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Currently active</div>
                </div>
                <div className="flex items-center text-red-500 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  -2
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Survey Responses</CardTitle>
              <CardDescription>Monthly response volume</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={surveyResponseData}
                lines={[{ dataKey: "responses", name: "Responses", color: "#8b5cf6" }]}
                xAxisDataKey="date"
                height={300}
              />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Satisfaction Trend</CardTitle>
              <CardDescription>Average satisfaction score over time</CardDescription>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={surveyResponseData}
                lines={[{ dataKey: "satisfaction", name: "Satisfaction", color: "#10b981" }]}
                xAxisDataKey="date"
                height={300}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Survey Types</CardTitle>
              <CardDescription>Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart data={surveyTypeData} height={300} />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Top Survey Comments</CardTitle>
              <CardDescription>Recent feedback highlights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { comment: "The new booking system is much easier to use.", sentiment: "Positive" },
                  { comment: "Would like more frequent cleaning of common areas.", sentiment: "Neutral" },
                  { comment: "Love the new coffee machines in the break rooms!", sentiment: "Positive" },
                  { comment: "The HVAC system is too cold in the east wing.", sentiment: "Negative" },
                  { comment: "Visitor check-in process is very efficient.", sentiment: "Positive" },
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 border-b pb-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        item.sentiment === "Positive"
                          ? "bg-green-100 text-green-600"
                          : item.sentiment === "Negative"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium">{item.comment}</div>
                      <div
                        className={`text-sm ${
                          item.sentiment === "Positive"
                            ? "text-green-600"
                            : item.sentiment === "Negative"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {item.sentiment} sentiment
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-0">
        <h1 className="text-2xl font-bold">Product Analytics</h1>

        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <FilterDropdown label="Buildings" />
            <FilterDropdown label="Tenants" />
          </div>

          <Button variant="outline" className="gap-2">
            <ArrowsLeftRight className="h-4 w-4" />
            Benchmark
          </Button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="px-6">
        <PageTabs tabs={tabs} className="bg-transparent" onTabClick={(href) => handleTabChange(href)} />
      </div>

      <div className="p-6 overflow-auto">{TabContent[activeTab as keyof typeof TabContent]}</div>
    </div>
  )
}
