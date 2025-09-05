"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { FilterBar } from "@/components/filter-bar"
import { MetricCard } from "@/components/metric-card"
import { LineChartComponent } from "@/components/line-chart"
import { DonutChart } from "@/components/donut-chart"
import { HeatmapChart } from "@/components/heatmap-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, FileText, MessageSquare, TrendingUp, TrendingDown } from "lucide-react"

export default function ProductAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data for charts
  const userActivityData = [
    { date: "Jan", active: 65, new: 23 },
    { date: "Feb", active: 59, new: 19 },
    { date: "Mar", active: 80, new: 32 },
    { date: "Apr", active: 81, new: 27 },
    { date: "May", active: 56, new: 15 },
    { date: "Jun", active: 55, new: 12 },
  ]

  const featureUsageData = [
    { name: "Visitor Management", value: 35, color: "#3b82f6" },
    { name: "Resource Booking", value: 25, color: "#10b981" },
    { name: "Work Orders", value: 20, color: "#f59e0b" },
    { name: "Content", value: 15, color: "#8b5cf6" },
    { name: "Other", value: 5, color: "#6b7280" },
  ]

  const generateHeatmapData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const hours = Array.from({ length: 24 }, (_, i) => i.toString())
    
    return days.map(day => 
      hours.map(hour => ({
        day,
        hour,
        value: Math.floor(Math.random() * 100)
      }))
    ).flat()
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">        
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Analytics</h1>
                <p className="text-gray-600">Track user engagement and feature adoption</p>
              </div>
              <FilterBar />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Active Users"
                value="8,549"
                change={12.5}
                changeLabel="from last month"
                icon={<Users className="h-4 w-4" />}
              />
              <MetricCard
                title="Daily Sessions"
                value="15,423"
                change={8.2}
                changeLabel="from last month"
                icon={<Calendar className="h-4 w-4" />}
              />
              <MetricCard
                title="Feature Adoption"
                value="67.8%"
                change={-2.1}
                changeLabel="from last month"
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <MetricCard
                title="User Satisfaction"
                value="4.6"
                change={0.3}
                changeLabel="from last month"
                icon={<MessageSquare className="h-4 w-4" />}
              />
            </div>

            {/* Tabs for different analytics views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>User Activity Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LineChartComponent
                        data={userActivityData}
                        lines={[
                          { dataKey: "active", name: "Active Users", color: "#3b82f6" },
                          { dataKey: "new", name: "New Users", color: "#10b981" }
                        ]}
                        xAxisDataKey="date"
                        height={300}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Feature Usage Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <DonutChart data={featureUsageData} height={300} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visitor Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-3xl font-bold">2,847</div>
                        <div className="text-sm text-green-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          +15.3% from last month
                        </div>
                        <div className="text-sm text-gray-600">Total visitors managed</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Resource Booking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-3xl font-bold">1,234</div>
                        <div className="text-sm text-green-600 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          +8.7% from last month
                        </div>
                        <div className="text-sm text-gray-600">Bookings completed</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Work Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-3xl font-bold">456</div>
                        <div className="text-sm text-red-600 flex items-center">
                          <TrendingDown className="h-4 w-4 mr-1" />
                          -3.2% from last month
                        </div>
                        <div className="text-sm text-gray-600">Orders submitted</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="engagement" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">4.2</div>
                        <div className="text-sm text-gray-600">Avg Session Duration (min)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">73%</div>
                        <div className="text-sm text-gray-600">Return User Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">2.8</div>
                        <div className="text-sm text-gray-600">Pages per Session</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="heatmap" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Heatmap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HeatmapChart 
                      data={generateHeatmapData()} 
                      title="Usage Activity by Day and Hour"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
} 