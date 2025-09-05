"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InfoIcon, Search, ChevronDown, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TenantSentimentPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [viewBy, setViewBy] = useState("building")

  // Sample data for the table
  const buildingsData = [
    {
      name: "REX Index benchmark",
      address: "",
      rexScore: 64.4,
      benchmarkGap: null,
      impact: 64.0,
      activities: 70.1,
      features: 55.4,
    },
    {
      name: "Prestige Park Tower",
      address: "245 5th Ave, New York, NY 10016, USA",
      rexScore: 76.6,
      benchmarkGap: 12.2,
      impact: 87.4,
      activities: 79.7,
      features: 73.8,
    },
    {
      name: "Cobblestone Collaborative",
      address: "162 E Berkeley St, Boston, MA 02118, USA",
      rexScore: 62.8,
      benchmarkGap: -1.6,
      impact: 62.1,
      activities: 64.7,
      features: 56.6,
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">        
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">Tenant Sentiment</h1>
                <Badge variant="outline" className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
                  Beta
                </Badge>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">Launch REX Assessment</Button>
            </div>

            {/* Main Navigation Tabs */}
            <div className="border-b">
              <div className="flex space-x-8">
                {["overview", "impact", "activities", "features"].map((tab) => (
                  <button
                    key={tab}
                    className={cn(
                      "py-4 text-sm font-medium transition-colors relative",
                      activeTab === tab
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Overview Header with Filters */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-medium">Overview</h2>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Button variant="outline" className="w-40 justify-between">
                    Buildings
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="relative">
                  <Button variant="outline" className="w-40 justify-between">
                    Companies
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <div className="relative">
                  <Button variant="outline" className="w-40 justify-between">
                    Industries
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </div>
                <Button variant="outline" className="gap-2">
                  <span>Benchmark: REX Index</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-600"
                  >
                    <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </Button>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* REX Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle>REX Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    REX Score is the quality of employee experience. It is comprised of three core experiences: Workplace
                    Impact, Activities, and Features.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-end justify-between">
                      <div className="text-5xl font-bold">67.8</div>
                      <div className="text-sm text-muted-foreground">64.4</div>
                    </div>
                    <div className="h-4 w-full rounded-full bg-gray-100">
                      <div
                        className="h-4 rounded-full bg-emerald-600"
                        style={{
                          width: "64.4%",
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="text-lg font-medium">15.1% Response rate</div>
                    <p className="text-sm text-muted-foreground">1,398 of 9,278 employees</p>
                  </div>
                </CardContent>
              </Card>

              {/* Performance by Component Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance by component</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    {/* Impact Circle */}
                    <div className="text-center">
                      <div className="relative inline-block w-32 h-32">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#059669"
                            strokeWidth="3"
                            strokeDasharray={`${71.6}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                          <div className="text-2xl font-bold">71.6%</div>
                          <div className="text-sm">Impact</div>
                        </div>
                      </div>
                    </div>

                    {/* Activities Circle */}
                    <div className="text-center">
                      <div className="relative inline-block w-32 h-32">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="3"
                            strokeDasharray={`${68.3}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                          <div className="text-2xl font-bold">68.3%</div>
                          <div className="text-sm">Activities</div>
                        </div>
                      </div>
                    </div>

                    {/* Features Circle */}
                    <div className="text-center">
                      <div className="relative inline-block w-32 h-32">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#F59E0B"
                            strokeWidth="3"
                            strokeDasharray={`${58.9}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                          <div className="text-2xl font-bold">58.9%</div>
                          <div className="text-sm">Features</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Buildings Performance Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Buildings Performance</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search buildings..."
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">
                          <Button variant="ghost" className="h-auto p-0 font-medium">
                            Building
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">
                          <Button variant="ghost" className="h-auto p-0 font-medium">
                            REX Score
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">
                          <Button variant="ghost" className="h-auto p-0 font-medium">
                            Benchmark Gap
                            <ArrowUpDown className="ml-1 h-4 w-4" />
                          </Button>
                        </th>
                        <th className="text-left py-3 px-4">Impact</th>
                        <th className="text-left py-3 px-4">Activities</th>
                        <th className="text-left py-3 px-4">Features</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buildingsData.map((building, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{building.name}</div>
                              {building.address && (
                                <div className="text-sm text-gray-500">{building.address}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium">{building.rexScore}</span>
                          </td>
                          <td className="py-3 px-4">
                            {building.benchmarkGap !== null ? (
                              <span className={cn(
                                "font-medium",
                                building.benchmarkGap > 0 ? "text-green-600" : "text-red-600"
                              )}>
                                {building.benchmarkGap > 0 ? "+" : ""}{building.benchmarkGap}
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="py-3 px-4">{building.impact}</td>
                          <td className="py-3 px-4">{building.activities}</td>
                          <td className="py-3 px-4">{building.features}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 