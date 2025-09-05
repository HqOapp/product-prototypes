"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import {
  ArrowDown,
  ArrowUp,
  CalendarIcon,
  Filter,
  Info,
  X,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Users,
  Building,
  Download,
  ChevronDown,
} from "lucide-react"

// Mock data for tenant renewals
const tenants = [
  {
    tenantName: "Acme Corp",
    leaseEnd: "2025-08-31",
    renewalScore: 74,
    confidence: 87,
    metrics: {
      occupancyRate: "62%",
      occupancyChange: "-15%",
      visitorsPerMonth: 28,
      visitorDelta: "-15",
      appEngagement: "Medium",
      appEngagementDetail: "3 sessions/week avg",
      amenitiesUsage: "Low",
      amenitiesDetail: "8 bookings in last 90 days",
      serviceRequests: 12,
      resolutionAvgDays: 2.3,
      companyHealth: "Neutral",
      newsHeadline: "Announced hiring freeze",
      sentimentScore: -0.2,
    },
    summaryInsight:
      "Usage is softening and external indicators show moderate concern. Engagement is steady but weak amenities usage and negative sentiment are pulling score down.",
    recommendations: [
      "Low engagement detected—consider offering renewal incentives.",
      "Declining visitor trends—schedule check-in with office manager.",
    ],
  },
  {
    tenantName: "TechStart Inc",
    leaseEnd: "2025-10-15",
    renewalScore: 92,
    confidence: 94,
    metrics: {
      occupancyRate: "89%",
      occupancyChange: "+10%",
      visitorsPerMonth: 67,
      visitorDelta: "+15",
      appEngagement: "High",
      appEngagementDetail: "Daily usage",
      amenitiesUsage: "Strong",
      amenitiesDetail: "45 bookings last 90 days",
      serviceRequests: 4,
      resolutionAvgDays: 1.1,
      companyHealth: "Positive",
      newsHeadline: "Recent Series B raised",
      sentimentScore: 0.6,
    },
    summaryInsight: "Highly engaged, growth signals strong. No current risk indicators.",
    recommendations: [
      "Strong engagement—consider early renewal discussion.",
      "High amenity usage—offer expanded access in new lease.",
    ],
  },
  {
    tenantName: "Global Finance Partners",
    leaseEnd: "2025-09-22",
    renewalScore: 35,
    confidence: 82,
    metrics: {
      occupancyRate: "38%",
      occupancyChange: "-28%",
      visitorsPerMonth: 12,
      visitorDelta: "-28",
      appEngagement: "Low",
      appEngagementDetail: "1 session/week",
      amenitiesUsage: "Very Low",
      amenitiesDetail: "2 bookings in last 90 days",
      serviceRequests: 18,
      resolutionAvgDays: 3.7,
      companyHealth: "Negative",
      newsHeadline: "Office downsizing planned",
      sentimentScore: -0.8,
    },
    summaryInsight:
      "This tenant is disengaging. Workplace activity, external news, and helpdesk friction point to non-renewal. Immediate outreach recommended.",
    recommendations: [
      "High risk of non-renewal—prepare vacancy contingency plan.",
      "Consider offering flexible terms or reduced space.",
    ],
  },
  {
    tenantName: "Innovate Design Studio",
    leaseEnd: "2025-11-10",
    renewalScore: 68,
    confidence: 76,
    metrics: {
      occupancyRate: "55%",
      occupancyChange: "-8%",
      visitorsPerMonth: 32,
      visitorDelta: "-5",
      appEngagement: "Medium",
      appEngagementDetail: "3 sessions/week avg",
      amenitiesUsage: "Medium",
      amenitiesDetail: "15 bookings in last 90 days",
      serviceRequests: 8,
      resolutionAvgDays: 1.8,
      companyHealth: "Neutral",
      newsHeadline: "New project with major client",
      sentimentScore: 0.2,
    },
    summaryInsight:
      "Mixed signals with moderate engagement. Recent positive news may offset declining occupancy trends.",
    recommendations: [
      "Moderate renewal risk—schedule executive lunch to discuss needs.",
      "Consider workspace reconfiguration options in renewal offer.",
    ],
  },
  {
    tenantName: "Quantum Solutions",
    leaseEnd: "2026-01-05",
    renewalScore: 22,
    confidence: 91,
    metrics: {
      occupancyRate: "18%",
      occupancyChange: "-65%",
      visitorsPerMonth: 5,
      visitorDelta: "-40",
      appEngagement: "Very Low",
      appEngagementDetail: "<1 session/week",
      amenitiesUsage: "None",
      amenitiesDetail: "0 bookings in last 90 days",
      serviceRequests: 1,
      resolutionAvgDays: 4.2,
      companyHealth: "Negative",
      newsHeadline: "Major layoffs announced",
      sentimentScore: -0.8,
    },
    summaryInsight:
      "This tenant is actively disengaging. All metrics indicate high likelihood of non-renewal. Begin marketing the space.",
    recommendations: [
      "Prepare for vacancy—begin marketing the space.",
      "Consider offering significant concessions if retention is priority.",
    ],
  },
  {
    tenantName: "Evergreen Media",
    leaseEnd: "2025-12-30",
    renewalScore: 88,
    confidence: 89,
    metrics: {
      occupancyRate: "82%",
      occupancyChange: "+12%",
      visitorsPerMonth: 60,
      visitorDelta: "+15",
      appEngagement: "High",
      appEngagementDetail: "Daily usage",
      amenitiesUsage: "High",
      amenitiesDetail: "38 bookings in last 90 days",
      serviceRequests: 6,
      resolutionAvgDays: 1.2,
      companyHealth: "Positive",
      newsHeadline: "Expanding content production division",
      sentimentScore: 0.6,
    },
    summaryInsight:
      "Strong engagement across all metrics. Growth indicators and positive sentiment suggest high renewal likelihood.",
    recommendations: [
      "Strong renewal candidate—discuss expansion options.",
      "Consider premium amenities package in renewal offer.",
    ],
  },
]

// Helper function to get color based on score
function getScoreColor(score: number) {
  if (score >= 76) return "text-green-600"
  if (score >= 40) return "text-amber-500"
  return "text-red-500"
}

// Helper function to get badge color based on score
function getScoreBadgeColor(score: number) {
  if (score >= 76) return "bg-green-100 text-green-800 border-0"
  if (score >= 40) return "bg-amber-100 text-amber-800 border-0"
  return "bg-red-100 text-red-800 border-0"
}

// Helper function to get risk label based on score
function getRiskLabel(score: number) {
  if (score >= 76) return "Likely to Renew"
  if (score >= 40) return "Moderate Risk"
  return "High Risk"
}

// Helper function to get risk emoji based on score
function getRiskEmoji(score: number) {
  if (score >= 76) return "🟢"
  if (score >= 40) return "🟡"
  return "🔴"
}

// Helper function to get icon based on trend
function getTrendIcon(change: string) {
  if (change.startsWith("+")) return <ArrowUp className="h-4 w-4 text-green-600" />
  if (change.startsWith("-")) return <ArrowDown className="h-4 w-4 text-red-600" />
  return null
}

// Helper function to get sentiment badge based on score
function getSentimentBadge(score: number) {
  if (score >= 0.3) return <Badge className="bg-green-100 text-green-800 border-0">🟩</Badge>
  if (score >= -0.3) return <Badge className="bg-gray-100 text-gray-800 border-0">⬜</Badge>
  return <Badge className="bg-red-100 text-red-800 border-0">🟥</Badge>
}

// Helper function to format date
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return format(date, "MMM d, yyyy")
}

// Helper function to get app usage badge color
function getAppUsageBadgeColor(usage: string) {
  if (usage === "High" || usage === "Strong") return "bg-green-100 text-green-700"
  if (usage === "Medium") return "bg-blue-100 text-blue-700"
  if (usage === "Low") return "bg-amber-100 text-amber-700"
  return "bg-red-100 text-red-700"
}

// Type for the selected tenant
type SelectedTenant = (typeof tenants)[0] | null

export default function RenewalsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [minScore, setMinScore] = useState([0])
  const [sortBy, setSortBy] = useState("score-desc")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<SelectedTenant>(null)
  const [activeTab, setActiveTab] = useState("all")

  // Filter and sort tenants based on current filters
  const filteredTenants = tenants
    .filter((tenant) => {
      // Filter by minimum score
      if (minScore[0] > 0 && tenant.renewalScore < minScore[0]) {
        return false
      }

      // Filter by tab
      if (activeTab === "high-risk" && tenant.renewalScore >= 40) {
        return false
      }
      if (activeTab === "moderate-risk" && (tenant.renewalScore < 40 || tenant.renewalScore >= 76)) {
        return false
      }
      if (activeTab === "low-risk" && tenant.renewalScore < 76) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score-desc":
          return b.renewalScore - a.renewalScore
        case "score-asc":
          return a.renewalScore - b.renewalScore
        case "date-asc":
          return new Date(a.leaseEnd).getTime() - new Date(b.leaseEnd).getTime()
        case "date-desc":
          return new Date(b.leaseEnd).getTime() - new Date(a.leaseEnd).getTime()
        default:
          return 0
      }
    })

  // Function to open drawer with selected tenant
  const openDrawer = (tenant: (typeof tenants)[0]) => {
    setSelectedTenant(tenant)
    setDrawerOpen(true)
  }

  // Count tenants by risk level
  const highRiskCount = tenants.filter((t) => t.renewalScore < 40).length
  const moderateRiskCount = tenants.filter((t) => t.renewalScore >= 40 && t.renewalScore < 76).length
  const lowRiskCount = tenants.filter((t) => t.renewalScore >= 76).length

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">Tenant Renewal Predictor</h1>
          <Badge variant="outline" className="bg-blue-100 text-blue-700 uppercase text-xs font-semibold">
            Beta
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Filter Controls - Modern Version */}
      <div className="px-6 py-3 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 gap-1 text-sm">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>
                    {dateRange.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d, yyyy")}
                        </>
                      ) : (
                        format(dateRange.from, "MMM d, yyyy")
                      )
                    ) : (
                      <span>Lease Expiry Date</span>
                    )}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <div className="flex items-center gap-2 bg-background border rounded-md px-3 py-1.5">
              <span className="text-sm whitespace-nowrap">Min Score: {minScore[0]}</span>
              <Slider
                id="min-score"
                defaultValue={[0]}
                max={100}
                step={1}
                className="w-[100px]"
                onValueChange={setMinScore}
              />
            </div>

            <Select defaultValue={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 w-[180px] text-sm">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score-desc">Renewal Score (High-Low)</SelectItem>
                <SelectItem value="score-asc">Renewal Score (Low-High)</SelectItem>
                <SelectItem value="date-asc">Expiration Date (Earliest)</SelectItem>
                <SelectItem value="date-desc">Expiration Date (Latest)</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" className="h-9 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs for risk categories */}
      <div className="px-6 pt-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">All Tenants ({tenants.length})</TabsTrigger>
            <TabsTrigger value="high-risk" className="text-red-600">
              High Risk ({highRiskCount})
            </TabsTrigger>
            <TabsTrigger value="moderate-risk" className="text-amber-600">
              Moderate Risk ({moderateRiskCount})
            </TabsTrigger>
            <TabsTrigger value="low-risk" className="text-green-600">
              Likely to Renew ({lowRiskCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tenant Cards */}
      <div className="p-6 pt-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-auto">
        {filteredTenants.length > 0 ? (
          filteredTenants.map((tenant, index) => (
            <Card key={index} className="p-5 overflow-hidden transition-all hover:shadow-md">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium">{tenant.tenantName}</h3>
                <div className="text-right">
                  <span className={`text-4xl ${getScoreColor(tenant.renewalScore)}`}>{tenant.renewalScore}</span>
                </div>
              </div>

              <div className="flex justify-between items-start mt-1">
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  <span>Lease Ends: {format(new Date(tenant.leaseEnd), "MMM d yyyy").replace(",", "")}</span>
                </div>
                <div className="text-right">
                  <div className="text-gray-500 text-sm">{tenant.confidence}% confidence</div>
                </div>
              </div>

              <div className="mt-3">
                <Badge className={`${getScoreBadgeColor(tenant.renewalScore)} px-3 py-0.5 text-xs rounded-full`}>
                  {getRiskLabel(tenant.renewalScore)}
                </Badge>
              </div>

              <button
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline mt-4 text-sm"
                onClick={() => openDrawer(tenant)}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>Score Breakdown</span>
              </button>

              <div className="mt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Users className="h-3.5 w-3.5" />
                    <span>Badge activity rate:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{tenant.metrics.occupancyRate}</span>
                    <span className="flex items-center gap-0.5 text-xs text-gray-500">
                      {getTrendIcon(tenant.metrics.occupancyChange)}
                      <span>{tenant.metrics.occupancyChange}</span>
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Building className="h-3.5 w-3.5" />
                    <span>App Usage:</span>
                  </div>
                  <Badge
                    className={`${getAppUsageBadgeColor(tenant.metrics.appEngagement)} border-0 text-xs py-0 px-2 h-5`}
                  >
                    {tenant.metrics.appEngagement}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Filter className="h-12 w-12 mb-4 opacity-20" />
            <h3 className="text-lg font-medium mb-1">No matching tenants</h3>
            <p className="max-w-sm">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>

      {/* Right-hand Drawer for Score Breakdown */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="max-w-[600px] mx-auto">
          <div className="mx-auto w-full max-w-lg">
            <DrawerHeader className="px-6 pb-2">
              <div className="flex items-center justify-between">
                <DrawerTitle className="text-xl font-semibold">{selectedTenant?.tenantName}</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDrawerOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
              <DrawerDescription className="flex items-center gap-1">
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>Lease Ends: {selectedTenant ? formatDate(selectedTenant.leaseEnd).replace(",", "") : ""}</span>
              </DrawerDescription>
            </DrawerHeader>

            {selectedTenant && (
              <div className="px-6 py-2 overflow-auto">
                {/* Add Action Items Card for High and Moderate Risk Tenants */}
                {selectedTenant.renewalScore < 76 && (
                  <div className="mb-6 border rounded-lg overflow-hidden">
                    <div className="bg-amber-50 px-4 py-3 border-b">
                      <h3 className="font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        {selectedTenant.renewalScore < 40 ? "High Risk Action Items" : "Moderate Risk Action Items"}
                      </h3>
                    </div>
                    <div className="p-4 space-y-3 bg-white">
                      <div className="flex items-start gap-2">
                        <input type="checkbox" id="action-1" className="mt-1" />
                        <label htmlFor="action-1" className="text-sm cursor-pointer hover:text-blue-600">
                          Invite Tenant to Upcoming Engagement Event
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <input type="checkbox" id="action-2" className="mt-1" />
                        <label htmlFor="action-2" className="text-sm cursor-pointer hover:text-blue-600">
                          Create Private Event for At-Risk Tenants
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <input type="checkbox" id="action-3" className="mt-1" />
                        <label htmlFor="action-3" className="text-sm cursor-pointer hover:text-blue-600">
                          Schedule Satisfaction Survey on Resolved Issues
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <input type="checkbox" id="action-4" className="mt-1" />
                        <label htmlFor="action-4" className="text-sm cursor-pointer hover:text-blue-600">
                          Add Free Amenity Credits for Tenant
                        </label>
                      </div>
                      <div className="flex items-start gap-2">
                        <input type="checkbox" id="action-5" className="mt-1" />
                        <label htmlFor="action-5" className="text-sm cursor-pointer hover:text-blue-600">
                          Send Custom Message to Tenant Team
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6 bg-muted/30 p-4 rounded-lg">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Renewal Score</div>
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-medium ${getScoreColor(selectedTenant.renewalScore)}`}>
                        {selectedTenant.renewalScore}
                      </span>
                      <Badge className={`${getScoreBadgeColor(selectedTenant.renewalScore)} px-3 py-1`}>
                        {getRiskEmoji(selectedTenant.renewalScore)} {getRiskLabel(selectedTenant.renewalScore)}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                    <div className="text-2xl">{selectedTenant.confidence}%</div>
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-3">Breakdown</h3>

                <div className="rounded-md overflow-hidden mb-6 border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[30%]">Metric</TableHead>
                        <TableHead className="w-[30%]">Value</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Badge activity rate</TableCell>
                        <TableCell>{selectedTenant.metrics.occupancyRate}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          {getTrendIcon(selectedTenant.metrics.occupancyChange)}
                          <span>{selectedTenant.metrics.occupancyChange} from 6-mo avg</span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Visitors/mo</TableCell>
                        <TableCell>{selectedTenant.metrics.visitorsPerMonth}</TableCell>
                        <TableCell className="flex items-center gap-1">
                          {getTrendIcon(selectedTenant.metrics.visitorDelta)}
                          <span>
                            from avg of{" "}
                            {Number.parseInt(selectedTenant.metrics.visitorsPerMonth.toString()) -
                              Number.parseInt(selectedTenant.metrics.visitorDelta)}
                          </span>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">App Engagement</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              selectedTenant.metrics.appEngagement === "High"
                                ? "bg-green-50 text-green-700"
                                : selectedTenant.metrics.appEngagement === "Medium"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-gray-50 text-gray-700"
                            }
                          >
                            {selectedTenant.metrics.appEngagement}
                          </Badge>
                        </TableCell>
                        <TableCell>{selectedTenant.metrics.appEngagementDetail}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Amenities Usage</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              selectedTenant.metrics.amenitiesUsage === "High" ||
                              selectedTenant.metrics.amenitiesUsage === "Strong"
                                ? "bg-green-50 text-green-700"
                                : selectedTenant.metrics.amenitiesUsage === "Medium"
                                  ? "bg-blue-50 text-blue-700"
                                  : selectedTenant.metrics.amenitiesUsage === "Low"
                                    ? "bg-yellow-50 text-yellow-700"
                                    : "bg-red-50 text-red-700"
                            }
                          >
                            {selectedTenant.metrics.amenitiesUsage}
                          </Badge>
                        </TableCell>
                        <TableCell>{selectedTenant.metrics.amenitiesDetail}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Service Requests</TableCell>
                        <TableCell>{selectedTenant.metrics.serviceRequests} in 3 months</TableCell>
                        <TableCell>Avg resolution: {selectedTenant.metrics.resolutionAvgDays} days</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Company Health</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              selectedTenant.metrics.companyHealth === "Positive"
                                ? "bg-green-50 text-green-700"
                                : selectedTenant.metrics.companyHealth === "Neutral"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-red-50 text-red-700"
                            }
                          >
                            {selectedTenant.metrics.companyHealth}
                          </Badge>
                        </TableCell>
                        <TableCell>"{selectedTenant.metrics.newsHeadline}"</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sentiment Score</TableCell>
                        <TableCell className="flex items-center gap-1">
                          <span
                            className={
                              selectedTenant.metrics.sentimentScore > 0.3
                                ? "text-green-600"
                                : selectedTenant.metrics.sentimentScore > -0.3
                                  ? "text-blue-600"
                                  : "text-red-600"
                            }
                          >
                            {selectedTenant.metrics.sentimentScore.toFixed(1)}
                          </span>
                          {getSentimentBadge(selectedTenant.metrics.sentimentScore)}
                        </TableCell>
                        <TableCell>Headline: "{selectedTenant.metrics.newsHeadline}"</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Summary Insight</h3>
                  <div className="bg-muted/20 p-4 rounded-md">
                    <div className="flex items-start gap-2">
                      {selectedTenant.renewalScore >= 76 ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : selectedTenant.renewalScore < 40 ? (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      ) : (
                        <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                      )}
                      <p>{selectedTenant.summaryInsight}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {selectedTenant.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 bg-muted/10 p-3 rounded-md">
                        {selectedTenant.renewalScore < 40 ? (
                          <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        ) : selectedTenant.renewalScore >= 76 ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        ) : (
                          <Info className="h-4 w-4 text-amber-500 mt-0.5" />
                        )}
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <DrawerFooter className="px-6">
              <div className="flex gap-3">
                <Button onClick={() => setDrawerOpen(false)}>Close</Button>
                <Button variant="outline">Schedule Meeting</Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
