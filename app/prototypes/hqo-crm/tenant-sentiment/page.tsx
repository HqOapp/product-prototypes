"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { InfoIcon, Search, ChevronDown, ArrowUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export default function IntelligencePage() {
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
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Tenant Sentiment</h1>
          <Badge variant="outline" className="bg-gray-200 text-gray-700 uppercase text-xs font-semibold">
            Beta
          </Badge>
        </div>

        <Button className="bg-blue-600 hover:bg-blue-700">Launch REX Assessment</Button>
      </div>

      {/* Main Navigation Tabs */}
      <div className="px-6 border-b">
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

      <div className="p-6 space-y-6">
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
                        stroke="#059669"
                        strokeWidth="3"
                        strokeDasharray={`${70.8}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="text-2xl font-bold">70.8%</div>
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
                        stroke="#059669"
                        strokeWidth="3"
                        strokeDasharray={`${62.4}, 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <div className="text-2xl font-bold">62.4%</div>
                      <div className="text-sm">Features</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View By Tabs */}
        <div className="flex space-x-2">
          <Button
            variant={viewBy === "building" ? "default" : "outline"}
            className={viewBy === "building" ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : ""}
            onClick={() => setViewBy("building")}
          >
            By building
          </Button>
          <Button
            variant={viewBy === "company" ? "default" : "outline"}
            className={viewBy === "company" ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : ""}
            onClick={() => setViewBy("company")}
          >
            By company
          </Button>
        </div>

        <h2 className="text-xl font-medium">Overview</h2>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by building" className="pl-10" />
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    Building and company
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    REX Score
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    Benchmark gap
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    Impact
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    Activities
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    Features
                    <ArrowUpDown className="ml-1 h-4 w-4" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {buildingsData.map((building, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-blue-50" : "bg-white"}>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex items-center">
                      {index > 0 && <ChevronDown className="mr-2 h-4 w-4" />}
                      <div>
                        <div className="font-medium">{building.name}</div>
                        {building.address && <div className="text-xs text-gray-500">{building.address}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{building.rexScore.toFixed(1)}</td>
                  <td className="px-4 py-3 text-sm">
                    {building.benchmarkGap === null ? (
                      "-"
                    ) : (
                      <span
                        className={
                          building.benchmarkGap > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"
                        }
                      >
                        {building.benchmarkGap > 0 ? "+" : ""}
                        {building.benchmarkGap.toFixed(1)}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">{building.impact.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm">{building.activities.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-sm">{building.features.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
