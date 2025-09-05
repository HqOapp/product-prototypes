"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, MoreHorizontal, Settings, ArrowUp, Download, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("amenities")

  // This would normally be fetched based on the ID
  const buildingData = {
    id: params.id,
    name: "125 Lincoln",
    address: "125 Lincoln St., Boston, MA 02021",
    status: "Super Rouge",
    score: 88,
    image: "/modern-office-building.png",
    certified: true,
    lastAssessment: "June 15, 2023",
  }

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="p-4 border-b">
        <Link href="/assessments" className="text-sm text-blue-600 flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Assessments
        </Link>
      </div>

      {/* Building Header */}
      <div className="p-6 flex flex-col md:flex-row gap-6 bg-white">
        <div className="relative w-40 h-40 rounded-md overflow-hidden">
          <Image
            src={buildingData.image || "/placeholder.svg"}
            alt={buildingData.name}
            width={160}
            height={160}
            className="object-cover"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{buildingData.name}</h1>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
                <Badge variant="outline" className="bg-gray-100">
                  Test
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Live
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1">{buildingData.address}</p>
              <p className="text-sm mt-1">{buildingData.status}</p>
              <div className="flex items-center mt-2">
                <Badge className="bg-[#e7f6f3] text-[#007758] mr-2">Best Spaces Certified</Badge>
                <span className="text-sm text-muted-foreground">Last assessment: {buildingData.lastAssessment}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                History
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b px-6 bg-white">
        <Tabs defaultValue="property" className="w-full">
          <TabsList className="w-full justify-start h-auto p-0 bg-transparent">
            <TabsTrigger
              value="overview"
              className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="property"
              className="py-3 px-4 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:bg-transparent"
            >
              Property Assessment
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="p-6 space-y-6 overflow-auto bg-[#f6f7f8]">
        {/* Assessment Overview */}
        <Card className="border rounded-md overflow-hidden">
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold mb-4">{buildingData.name} Property Assessment</h2>
              <p className="text-muted-foreground mb-2">
                Our team has analyzed your building's performance across four key pillars.
              </p>
              <p>
                Your overall score is <span className="font-bold">{buildingData.score}</span> out of 100, qualifying
                your building as a Best Space.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{buildingData.score}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Building Attributes */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Building attribute details</h2>
              <p className="text-sm text-muted-foreground">
                Comprehensive breakdown of property attributes with market comparison
              </p>
            </div>
            <Button variant="outline" size="sm">
              View scoring scale
            </Button>
          </div>

          {/* Attribute Tabs */}
          <Tabs defaultValue="amenities" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4 h-auto p-0 bg-transparent border rounded-md">
              <TabsTrigger
                value="amenities"
                className="py-3 px-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none border-r"
              >
                Amenities & spaces
              </TabsTrigger>
              <TabsTrigger
                value="experiences"
                className="py-3 px-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none border-r"
              >
                Experiences
              </TabsTrigger>
              <TabsTrigger
                value="systems"
                className="py-3 px-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none border-r"
              >
                Systems
              </TabsTrigger>
              <TabsTrigger
                value="tenant"
                className="py-3 px-4 rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none"
              >
                Tenant satisfaction
              </TabsTrigger>
            </TabsList>

            <TabsContent value="amenities" className="mt-6 border rounded-md p-6 bg-white">
              <div className="flex justify-between items-center mb-6">
                <ChevronLeft className="h-6 w-6 text-gray-400" />
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Meeting & collaboration spaces</h3>
                  <Badge className="bg-blue-50 text-blue-600 font-normal">
                    <ArrowUp className="h-3 w-3 mr-1" /> 15% above market average
                  </Badge>

                  <div className="mt-4 relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">90</span>
                    </div>
                  </div>

                  <div className="flex justify-center mt-4 space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6" />
              </div>

              {/* Amenity Categories */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="border rounded-md p-4 text-center">
                  <div className="text-lg font-bold mb-1">Meeting Spaces</div>
                  <div className="text-sm text-muted-foreground mb-2">4 types available</div>
                  <Progress value={90} className="h-2 mb-1" />
                  <div className="text-xs text-[#007758]">15% above average</div>
                </div>

                <div className="border rounded-md p-4 text-center">
                  <div className="text-lg font-bold mb-1">Work Spaces</div>
                  <div className="text-sm text-muted-foreground mb-2">3 types available</div>
                  <Progress value={85} className="h-2 mb-1" />
                  <div className="text-xs text-[#007758]">10% above average</div>
                </div>

                <div className="border rounded-md p-4 text-center">
                  <div className="text-lg font-bold mb-1">Amenities</div>
                  <div className="text-sm text-muted-foreground mb-2">8 types available</div>
                  <Progress value={92} className="h-2 mb-1" />
                  <div className="text-xs text-[#007758]">18% above average</div>
                </div>

                <div className="border rounded-md p-4 text-center">
                  <div className="text-lg font-bold mb-1">Technology</div>
                  <div className="text-sm text-muted-foreground mb-2">5 types available</div>
                  <Progress value={88} className="h-2 mb-1" />
                  <div className="text-xs text-[#007758]">12% above average</div>
                </div>
              </div>

              <div className="mt-8">
                <Button variant="outline" className="w-full">
                  View Detailed Breakdown
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="experiences" className="mt-6">
              <div className="flex items-center justify-center h-40 border rounded-md bg-white">
                <p className="text-muted-foreground">Experiences content will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="systems" className="mt-6">
              <div className="flex items-center justify-center h-40 border rounded-md bg-white">
                <p className="text-muted-foreground">Systems content will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="tenant" className="mt-6">
              <div className="flex items-center justify-center h-40 border rounded-md bg-white">
                <p className="text-muted-foreground">Tenant satisfaction content will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Historical Performance */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Historical Performance</h2>
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-8">
                <p>Historical assessment data will be displayed here</p>
                <p className="text-sm mt-2">This building has 3 previous assessments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What is Best Spaces */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">What is Best Spaces?</h2>
          <p className="text-muted-foreground mb-4">
            The Best Space certification recognizes buildings that demonstrate exceptional performance across key
            metrics including amenities, tenant experience, systems, and tenant alignment.
          </p>
          <Button variant="link" className="text-blue-600 p-0">
            Learn more
          </Button>
        </div>
      </div>
    </div>
  )
}
