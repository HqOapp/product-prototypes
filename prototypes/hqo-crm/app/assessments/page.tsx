"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowUpRight,
  Building2,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  LineChart,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { LineChartComponent } from "@/components/line-chart"

export default function PropertiesPage() {
  const [timeRange, setTimeRange] = useState("6m")
  const [filterView, setFilterView] = useState("all")

  // Sample data for portfolio metrics
  const portfolioMetrics = {
    overallScore: 82,
    totalProperties: 12,
    averageOccupancy: 87,
    tenantSatisfaction: 4.2,
    certifiedProperties: 8,
  }

  // Sample data for property list
  const properties = [
    {
      id: "1",
      name: "125 Lincoln",
      image: "/modern-office-building.png",
      location: "Boston, MA",
      score: 88,
      trend: "up",
      occupancy: 92,
      satisfaction: 4.5,
      certified: true,
    },
    {
      id: "2",
      name: "The Hive",
      image: "/contemporary-office-building.png",
      location: "New York, NY",
      score: 84,
      trend: "up",
      occupancy: 89,
      satisfaction: 4.3,
      certified: true,
    },
    {
      id: "3",
      name: "One Financial",
      image: "/financial-district-building.png",
      location: "Chicago, IL",
      score: 79,
      trend: "down",
      occupancy: 82,
      satisfaction: 3.9,
      certified: true,
    },
    {
      id: "4",
      name: "Penn Place",
      location: "Philadelphia, PA",
      score: 76,
      trend: "neutral",
      occupancy: 80,
      satisfaction: 3.8,
      certified: false,
    },
    {
      id: "5",
      name: "Westlake Tower",
      location: "Seattle, WA",
      score: 85,
      trend: "up",
      occupancy: 88,
      satisfaction: 4.4,
      certified: true,
    },
    {
      id: "6",
      name: "Embarcadero Center",
      location: "San Francisco, CA",
      score: 90,
      trend: "up",
      occupancy: 95,
      satisfaction: 4.7,
      certified: true,
    },
  ]

  // Sample data for trend chart
  const trendData = [
    { month: "Jan", portfolio: 78, benchmark: 75 },
    { month: "Feb", portfolio: 79, benchmark: 75 },
    { month: "Mar", portfolio: 80, benchmark: 76 },
    { month: "Apr", portfolio: 81, benchmark: 76 },
    { month: "May", portfolio: 82, benchmark: 77 },
    { month: "Jun", portfolio: 82, benchmark: 77 },
  ]

  // Sample data for attribute performance
  const attributeData = [
    { name: "Amenities & Spaces", score: 85, change: 3 },
    { name: "Experiences", score: 79, change: 2 },
    { name: "Systems", score: 83, change: 5 },
    { name: "Tenant Satisfaction", score: 81, change: -1 },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-[#f6f7f8]">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Assessments</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Calendar className="h-4 w-4" />
              Last 6 Months
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 overflow-auto bg-[#f6f7f8]">
        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Portfolio Score</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{portfolioMetrics.overallScore}</span>
                  <span className="text-sm text-muted-foreground ml-2">/100</span>
                </div>
                <div className="mt-2">
                  <Progress value={portfolioMetrics.overallScore} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Properties</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{portfolioMetrics.totalProperties}</span>
                </div>
                <div className="flex items-center mt-2 text-sm text-[#009971]">
                  <Badge className="bg-[#e7f6f3] text-[#007758] font-normal">
                    {portfolioMetrics.certifiedProperties} Certified
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Avg. Occupancy</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{portfolioMetrics.averageOccupancy}%</span>
                </div>
                <div className="flex items-center mt-2 text-sm text-[#009971]">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+2.5% YoY</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Tenant Satisfaction</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{portfolioMetrics.tenantSatisfaction}</span>
                  <span className="text-sm text-muted-foreground ml-2">/5</span>
                </div>
                <div className="flex items-center mt-2 text-sm text-[#009971]">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>+0.3 YoY</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Best Spaces Certified</span>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{portfolioMetrics.certifiedProperties}</span>
                  <span className="text-sm text-muted-foreground ml-2">/{portfolioMetrics.totalProperties}</span>
                </div>
                <div className="mt-2">
                  <Progress
                    value={(portfolioMetrics.certifiedProperties / portfolioMetrics.totalProperties) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trend Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Portfolio Performance Trend</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className={timeRange === "3m" ? "bg-[#ebf1ff] text-[#044aef]" : ""}
                    onClick={() => setTimeRange("3m")}
                  >
                    3M
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={timeRange === "6m" ? "bg-[#ebf1ff] text-[#044aef]" : ""}
                    onClick={() => setTimeRange("6m")}
                  >
                    6M
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={timeRange === "1y" ? "bg-[#ebf1ff] text-[#044aef]" : ""}
                    onClick={() => setTimeRange("1y")}
                  >
                    1Y
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={timeRange === "all" ? "bg-[#ebf1ff] text-[#044aef]" : ""}
                    onClick={() => setTimeRange("all")}
                  >
                    All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <LineChartComponent
                data={trendData}
                lines={[
                  { dataKey: "portfolio", name: "Your Portfolio", color: "#044aef", strokeWidth: 3 },
                  { dataKey: "benchmark", name: "Industry Benchmark", color: "#696e72", strokeDasharray: "5 5" },
                ]}
                xAxisDataKey="month"
                height={300}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Attribute Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {attributeData.map((attribute, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{attribute.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{attribute.score}</span>
                        <Badge
                          className={`${attribute.change >= 0 ? "bg-[#e7f6f3] text-[#007758]" : "bg-red-50 text-red-600"} font-normal`}
                        >
                          {attribute.change >= 0 ? "+" : ""}
                          {attribute.change}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={attribute.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Properties List */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Properties</h2>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search properties" className="pl-10" />
              </div>
              <Select defaultValue="score">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score">Sort by Score</SelectItem>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="location">Sort by Location</SelectItem>
                  <SelectItem value="occupancy">Sort by Occupancy</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                View
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Link href={`/properties/${property.id}`} key={property.id}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-0">
                    <div className="flex items-center p-4 border-b">
                      <Avatar className="h-12 w-12 rounded-md mr-4">
                        <AvatarImage
                          src={property.image || "/placeholder.svg?height=48&width=48&query=building"}
                          alt={property.name}
                        />
                        <AvatarFallback className="rounded-md bg-[#ebf1ff] text-[#044aef]">
                          <Building2 className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">{property.name}</h3>
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                      </div>
                      <div className="flex items-center">
                        {property.certified && <Badge className="bg-[#e7f6f3] text-[#007758] mr-2">Certified</Badge>}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 p-4">
                      <div className="flex flex-col items-center">
                        <div className="text-sm text-muted-foreground mb-1">Score</div>
                        <div className="flex items-center">
                          <span className="font-bold text-lg">{property.score}</span>
                          {property.trend === "up" && <ArrowUpRight className="h-4 w-4 text-[#007758] ml-1" />}
                          {property.trend === "down" && (
                            <ArrowUpRight className="h-4 w-4 text-red-500 ml-1 rotate-180" />
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-sm text-muted-foreground mb-1">Occupancy</div>
                        <div className="font-bold text-lg">{property.occupancy}%</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-sm text-muted-foreground mb-1">Satisfaction</div>
                        <div className="font-bold text-lg">{property.satisfaction}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Best Spaces Information */}
        <Card className="bg-[#ebf1ff] border-[#044aef]">
          <CardContent className="p-6">
            <div className="flex items-start">
              <div className="mr-4">
                <LineChart className="h-10 w-10 text-[#044aef]" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">About Best Spaces Certification</h3>
                <p className="text-muted-foreground mb-4">
                  The Best Space certification recognizes buildings that demonstrate exceptional performance across key
                  metrics including amenities, tenant experience, systems, and tenant alignment.
                </p>
                <Button variant="link" className="text-[#044aef] p-0">
                  Learn more about certification criteria
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
