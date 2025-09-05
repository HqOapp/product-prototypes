"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { MetricCard } from "@/components/metric-card"
import { LineChartComponent } from "@/components/line-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RenewalsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample renewal data
  const renewalTrends = [
    { month: "Jan", renewals: 85, risk: 15 },
    { month: "Feb", renewals: 88, risk: 12 },
    { month: "Mar", renewals: 82, risk: 18 },
    { month: "Apr", renewals: 90, risk: 10 },
    { month: "May", renewals: 87, risk: 13 },
    { month: "Jun", renewals: 92, risk: 8 },
  ]

  const upcomingRenewals = [
    {
      tenant: "Acme Corporation",
      building: "One Liberty Plaza",
      expiryDate: "2024-03-15",
      riskLevel: "low",
      probability: 95,
      value: "$2.4M"
    },
    {
      tenant: "Tech Innovations Inc",
      building: "Prestige Park Tower", 
      expiryDate: "2024-04-01",
      riskLevel: "medium",
      probability: 70,
      value: "$1.8M"
    },
    {
      tenant: "Global Services Ltd",
      building: "Commerce Center",
      expiryDate: "2024-04-20",
      riskLevel: "high",
      probability: 45,
      value: "$3.2M"
    },
    {
      tenant: "Creative Solutions",
      building: "Innovation Hub",
      expiryDate: "2024-05-10",
      riskLevel: "low",
      probability: 90,
      value: "$1.2M"
    }
  ]

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
      case "high":
        return <Badge className="bg-red-100 text-red-800">High Risk</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">        
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Renewals</h1>
              <p className="text-gray-600">Track lease renewals and predict tenant retention</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Renewal Rate"
                value="89.2%"
                change={3.4}
                changeLabel="from last quarter"
                icon={<TrendingUp className="h-4 w-4" />}
              />
              <MetricCard
                title="Upcoming Renewals"
                value="24"
                change={-2}
                changeLabel="from last month"
                icon={<Calendar className="h-4 w-4" />}
              />
              <MetricCard
                title="At Risk Tenants"
                value="6"
                change={-1}
                changeLabel="from last month"
                icon={<AlertTriangle className="h-4 w-4" />}
              />
              <MetricCard
                title="Total Value"
                value="$12.8M"
                change={8.7}
                changeLabel="from last quarter"
                icon={<TrendingUp className="h-4 w-4" />}
              />
            </div>

            {/* Tabs for different views */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Renewal Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <LineChartComponent
                        data={renewalTrends}
                        lines={[
                          { dataKey: "renewals", name: "Renewal Rate %", color: "#10b981" },
                          { dataKey: "risk", name: "At Risk %", color: "#ef4444" }
                        ]}
                        xAxisDataKey="month"
                        height={300}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Risk Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Low Risk</span>
                          </div>
                          <span className="font-medium">18 tenants</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span>Medium Risk</span>
                          </div>
                          <span className="font-medium">4 tenants</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span>High Risk</span>
                          </div>
                          <span className="font-medium">2 tenants</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="upcoming" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Upcoming Renewals</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            placeholder="Search tenants..."
                            className="pl-10 w-64"
                          />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {upcomingRenewals.map((renewal, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                {getRiskIcon(renewal.riskLevel)}
                                <div>
                                  <h4 className="font-medium">{renewal.tenant}</h4>
                                  <p className="text-sm text-gray-600">{renewal.building}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="text-sm font-medium">Expires: {renewal.expiryDate}</div>
                                <div className="text-sm text-gray-600">Value: {renewal.value}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">{renewal.probability}% likely</div>
                                {getRiskBadge(renewal.riskLevel)}
                              </div>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Average Lease Length</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">5.2 years</div>
                      <p className="text-sm text-gray-600 mt-2">Across all properties</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Early Renewals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">23%</div>
                      <p className="text-sm text-gray-600 mt-2">Renewed before expiry</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Avg Renewal Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">$42/sqft</div>
                      <p className="text-sm text-gray-600 mt-2">Per square foot</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Renewal Factors Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Tenant satisfaction score</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div className="w-3/4 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">75%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Market rate competitiveness</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div className="w-4/5 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">80%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Building amenities usage</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full">
                            <div className="w-3/5 h-2 bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">60%</span>
                        </div>
                      </div>
                    </div>
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