"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  DollarSign,
  FileText,
  MessageSquare,
  Settings,
  Plus,
  Download,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

interface TenantHealthTabProps {
  selectedBuildings: string[]
}

// Sample data for charts
const paymentHistoryData = [
  { month: "Jan", days: 0 },
  { month: "Feb", days: 0 },
  { month: "Mar", days: 0 },
  { month: "Apr", days: 5 },
  { month: "May", days: 0 },
  { month: "Jun", days: 0 },
  { month: "Jul", days: 3 },
  { month: "Aug", days: 0 },
  { month: "Sep", days: 0 },
  { month: "Oct", days: 0 },
  { month: "Nov", days: 0 },
  { month: "Dec", days: 0 },
]

const engagementData = [
  { month: "Jul", appLogins: 45, amenityBookings: 12, eventAttendance: 8 },
  { month: "Aug", appLogins: 52, amenityBookings: 15, eventAttendance: 10 },
  { month: "Sep", appLogins: 49, amenityBookings: 18, eventAttendance: 7 },
  { month: "Oct", appLogins: 63, amenityBookings: 22, eventAttendance: 12 },
  { month: "Nov", appLogins: 58, amenityBookings: 19, eventAttendance: 9 },
  { month: "Dec", appLogins: 48, amenityBookings: 14, eventAttendance: 6 },
]

const supportTicketsData = [
  { name: "HVAC", value: 8 },
  { name: "Janitorial", value: 5 },
  { name: "Security", value: 2 },
  { name: "Maintenance", value: 12 },
  { name: "IT", value: 7 },
]

const creditHistoryData = [
  { date: "Jan 2023", score: 78 },
  { date: "Apr 2023", score: 80 },
  { date: "Jul 2023", score: 82 },
  { date: "Oct 2023", score: 83 },
  { date: "Jan 2024", score: 85 },
]

const afterHoursData = [
  { month: "Jul", hours: 6 },
  { month: "Aug", hours: 8 },
  { month: "Sep", hours: 7 },
  { month: "Oct", hours: 10 },
  { month: "Nov", hours: 12 },
  { month: "Dec", hours: 8 },
]

const healthScoreData = [
  { month: "Jan", score: 75 },
  { month: "Feb", score: 78 },
  { month: "Mar", score: 76 },
  { month: "Apr", score: 80 },
  { month: "May", score: 79 },
  { month: "Jun", score: 82 },
  { month: "Jul", score: 80 },
  { month: "Aug", score: 83 },
  { month: "Sep", score: 81 },
  { month: "Oct", score: 84 },
  { month: "Nov", score: 83 },
  { month: "Dec", score: 85 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

export function TenantHealthTab({ selectedBuildings }: TenantHealthTabProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [timeframe, setTimeframe] = useState("12m")
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  const [weights, setWeights] = useState({
    financial: 40,
    compliance: 30,
    engagement: 30,
  })
  const [moduleSettings, setModuleSettings] = useState({
    overallHealthScore: true,
    healthScoreTrends: true,
    keyRiskIndicators: true,
    financialSummary: true,
    paymentHistory: true,
    complianceStatus: true,
    engagementMetrics: true,
    supportTickets: true,
    creditHistory: true,
    afterHoursUsage: true,
  })

  const handleWeightChange = (category: string, value: number[]) => {
    setWeights({
      ...weights,
      [category]: value[0],
    })
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          
          <p className="text-gray-500">Comprehensive health monitoring for EcoVolt Energy Solutions</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setIsConfigModalOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configure health score
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overall Health Score */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-normal">Overall Health Score</CardTitle>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center">
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        <div className="text-4xl font-bold text-green-600">85</div>
                      </div>
                      <div className="text-sm text-gray-500 mt-2">out of 100</div>
                    </div>

                    <div className="flex-1 ml-8">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 text-blue-500 mr-1" />
                              <span className="text-sm font-medium">Financial Health</span>
                            </div>
                            <span className="text-sm font-medium">90/100</span>
                          </div>
                          <Progress value={90} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-purple-500 mr-1" />
                              <span className="text-sm font-medium">Compliance</span>
                            </div>
                            <span className="text-sm font-medium">85/100</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 text-orange-500 mr-1" />
                              <span className="text-sm font-medium">Engagement</span>
                            </div>
                            <span className="text-sm font-medium">78/100</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-sm text-green-600">+5 points since last quarter</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Improved payment history and increased app engagement have positively impacted the score.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Score Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-normal">Health Score Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={healthScoreData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#10b981"
                          fillOpacity={1}
                          fill="url(#colorScore)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Key Risk Indicators */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-normal">Key Risk Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-medium">Strong Financial Position</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Recent Series B funding ($50M) indicates financial stability and growth potential.
                      </p>
                    </div>

                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                        <span className="font-medium">Insurance Certificate Expiring</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        General liability insurance certificate expires in 45 days. Renewal reminder sent.
                      </p>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium">Increasing Space Utilization</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Badge swipe data shows 22% increase in office utilization over the past quarter.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - 1/3 width */}
            <div className="space-y-6">
              {/* Financial Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-normal">
                    
                    Financial Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Credit Rating</span>
                      <Badge className="bg-green-100 text-green-800">A-</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Credit Risk Score</span>
                      <span className="font-medium">85/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Payment Status</span>
                      <Badge className="bg-green-100 text-green-800">Current</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Days Past Due (Avg)</span>
                      <span className="font-medium">0.7 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Outstanding Balance</span>
                      <span className="font-medium">$0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Security Deposit Coverage</span>
                      <span className="font-medium">1.8 months</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-normal">
                    
                    Compliance Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Insurance Compliance</span>
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm">Compliant</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">COI Expiration</span>
                      <span className="text-sm">Jul 15, 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Late Payments (12mo)</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Lease Violations</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Sublease Activity</span>
                      <span className="font-medium">None</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-normal">
                    
                    Engagement Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Amenity Usage Rate</span>
                      <span className="font-medium">42%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">App Logins (Monthly)</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-1">58</span>
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Support Tickets (90d)</span>
                      <span className="font-medium">34</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Event Participation</span>
                      <span className="font-medium">9 events</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Satisfaction Score</span>
                      <Badge className="bg-green-100 text-green-800">4.7/5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>


        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Credit & Financial Status */}
            <Card>
              <CardHeader>
                <CardTitle>Credit & Financial Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Credit Rating</span>
                      <div className="font-medium">A- (Experian Business)</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Credit Risk Score</span>
                      <div className="font-medium">85/100</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Annual Revenue</span>
                      <div className="font-medium">$25M - $50M</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Profitability</span>
                      <div className="font-medium">Yes (8-12% margin)</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Updated</span>
                      <div className="font-medium">Jan 15, 2024</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Data Source</span>
                      <div className="font-medium">Experian Business</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Credit History</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={creditHistoryData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="date" />
                          <YAxis domain={[70, 90]} />
                          <Tooltip />
                          <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Current Status</span>
                      <div className="font-medium">
                        <Badge className="bg-green-100 text-green-800">Current</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Outstanding Balance</span>
                      <div className="font-medium">$0</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Days Past Due (Avg)</span>
                      <div className="font-medium">0.7 days</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Late Payments (12mo)</span>
                      <div className="font-medium">2 of 12</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Security Deposit</span>
                      <div className="font-medium">$75,000</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Deposit Coverage</span>
                      <div className="font-medium">1.8 months</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">12-Month Payment History</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={paymentHistoryData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Bar dataKey="days" name="Days Late" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Risk Assessment */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">Strong Financial Position</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Recent Series B funding ($50M) indicates financial stability and growth potential.
                    </p>
                  </div>

                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">Consistent Payment History</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Only 2 late payments in the past 12 months, both less than 5 days late.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Growth Trajectory</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Company has grown from 120 to 157 employees in the past year, indicating positive business
                      momentum.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Industry Outlook</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Renewable energy sector showing strong growth trends with favorable regulatory environment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Consider Expansion Opportunity</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on financial strength and growth trajectory, tenant may be a good candidate for expansion
                      space. Consider proactive outreach about additional space.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Early Renewal Discussion</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Financial stability suggests tenant is a good long-term prospect. Consider initiating renewal
                      discussions early to secure longer term.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Security Deposit Review</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Given strong payment history and financial position, consider reviewing security deposit
                      requirements at renewal.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Insurance & Documentation */}
            <Card>
              <CardHeader>
                <CardTitle>Insurance & Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Insurance Status</span>
                      <div className="font-medium">
                        <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">COI Expiration</span>
                      <div className="font-medium">Jul 15, 2024</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">General Liability</span>
                      <div className="font-medium">$2M per occurrence</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Property Insurance</span>
                      <div className="font-medium">Full replacement value</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Workers' Comp</span>
                      <div className="font-medium">Statutory limits</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Last Verified</span>
                      <div className="font-medium">Jan 10, 2024</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Insurance Documents</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Certificate of Insurance - 2024.pdf</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">Additional Insured Endorsement.pdf</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lease Compliance */}
            <Card>
              <CardHeader>
                <CardTitle>Lease Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Lease Violations</span>
                      <div className="font-medium">0</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Notices Issued</span>
                      <div className="font-medium">0</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Late Payments (12mo)</span>
                      <div className="font-medium">2 of 12</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Sublease Activity</span>
                      <div className="font-medium">None</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Permitted Use</span>
                      <div className="font-medium">Compliant</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Signage</span>
                      <div className="font-medium">Compliant</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Compliance History</h4>
                    <div className="space-y-2">
                      <div className="p-2 border-l-4 border-yellow-500 bg-yellow-50">
                        <div className="text-sm font-medium">Late Rent Payment</div>
                        <div className="text-xs text-gray-600">April 2023 - 5 days late</div>
                      </div>
                      <div className="p-2 border-l-4 border-yellow-500 bg-yellow-50">
                        <div className="text-sm font-medium">Late Rent Payment</div>
                        <div className="text-xs text-gray-600">July 2023 - 3 days late</div>
                      </div>
                      <div className="p-2 border-l-4 border-green-500 bg-green-50">
                        <div className="text-sm font-medium">Insurance Certificate Updated</div>
                        <div className="text-xs text-gray-600">July 2023</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Building Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Building Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">After-Hours HVAC</span>
                      <div className="font-medium">8.5 hrs/month (avg)</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Weekend Access</span>
                      <div className="font-medium">2.3 days/month (avg)</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Parking Usage</span>
                      <div className="font-medium">38 of 45 spaces</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Conference Room Usage</span>
                      <div className="font-medium">22 hrs/month (avg)</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Monthly After-Hours Usage</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={afterHoursData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="hours" name="Hours" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="font-medium">Insurance Renewal Reminder</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Send insurance renewal reminder 60 days before July 15, 2024 expiration date.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Annual Compliance Review</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Schedule annual compliance review for Q1 2024 to ensure all lease terms are being met.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">After-Hours HVAC Analysis</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Review increasing after-hours HVAC usage pattern to ensure proper billing and system capacity.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* App & Amenity Usage */}
            <Card>
              <CardHeader>
                <CardTitle>App & Amenity Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Amenity Usage Rate</span>
                      <div className="font-medium">42% of employees</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">App Logins (Monthly)</span>
                      <div className="font-medium">58 (avg)</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Most Used Amenity</span>
                      <div className="font-medium">Conference Rooms</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Least Used Amenity</span>
                      <div className="font-medium">Fitness Center</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Active App Users</span>
                      <div className="font-medium">89 of 157 employees</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Usage Trend</span>
                      <div className="font-medium flex items-center">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        Increasing
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">6-Month Engagement Trends</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagementData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="appLogins"
                            name="App Logins"
                            stroke="#3b82f6"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="amenityBookings"
                            name="Amenity Bookings"
                            stroke="#10b981"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="eventAttendance"
                            name="Event Attendance"
                            stroke="#f59e0b"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support & Service Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Support & Service Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Total Tickets (90d)</span>
                      <div className="font-medium">34</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Avg Resolution Time</span>
                      <div className="font-medium">1.8 days</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Satisfaction Rating</span>
                      <div className="font-medium">4.7/5.0</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Ticket Trend</span>
                      <div className="font-medium flex items-center">
                        <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                        Decreasing
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Support Ticket Categories</h4>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={supportTicketsData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {supportTicketsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Participation */}
            <Card>
              <CardHeader>
                <CardTitle>Event Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Events Attended (12mo)</span>
                      <div className="font-medium">9 events</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Avg Attendance Rate</span>
                      <div className="font-medium">22% of employees</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Most Popular Event</span>
                      <div className="font-medium">Holiday Party</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Least Popular Event</span>
                      <div className="font-medium">Wellness Workshop</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Recent Event Participation</h4>
                    <div className="space-y-2">
                      <div className="p-2 border rounded flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Holiday Party</div>
                          <div className="text-xs text-gray-500">Dec 15, 2023</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">High Attendance</Badge>
                      </div>
                      <div className="p-2 border rounded flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Networking Mixer</div>
                          <div className="text-xs text-gray-500">Nov 8, 2023</div>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Medium Attendance</Badge>
                      </div>
                      <div className="p-2 border rounded flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">Sustainability Workshop</div>
                          <div className="text-xs text-gray-500">Oct 22, 2023</div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">High Attendance</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Engagement Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Fitness Center Promotion</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Target promotional campaign to increase fitness center usage, which is currently the least used
                      amenity.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">App Adoption Campaign</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Run campaign to increase app adoption beyond current 57% of employees to improve engagement.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="font-medium">Targeted Event Planning</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Focus on sustainability and networking events which have shown higher attendance rates.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="font-medium">Engagement Recognition</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Recognize tenant's above-average engagement with building amenities and events in quarterly
                      newsletter.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Health Score Configuration Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="max-w-6xl w-[90vw] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Configure Tenant Health Score</span>
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <Tabs defaultValue="weights" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="weights">Score Weights</TabsTrigger>
                <TabsTrigger value="modules">Modules & Cards</TabsTrigger>
                <TabsTrigger value="variables">Custom Variables</TabsTrigger>
              </TabsList>

              {/* Score Weights Tab */}
              <TabsContent value="weights" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Health Score Calculation Weights</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Adjust how much each category contributes to the overall health score. Total must equal 100%.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium">Financial Health</Label>
                          <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {weights.financial}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Payment history, credit score, financial stability indicators
                        </p>
                        <Slider
                          value={[weights.financial]}
                          max={100}
                          step={5}
                          onValueChange={(value) => handleWeightChange("financial", value)}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium">Compliance</Label>
                          <span className="text-sm font-medium bg-purple-100 text-purple-700 px-2 py-1 rounded">
                            {weights.compliance}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Insurance compliance, lease adherence, regulatory requirements
                        </p>
                        <Slider
                          value={[weights.compliance]}
                          max={100}
                          step={5}
                          onValueChange={(value) => handleWeightChange("compliance", value)}
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-base font-medium">Engagement</Label>
                          <span className="text-sm font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded">
                            {weights.engagement}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          App usage, amenity bookings, event participation, support interactions
                        </p>
                        <Slider
                          value={[weights.engagement]}
                          max={100}
                          step={5}
                          onValueChange={(value) => handleWeightChange("engagement", value)}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-medium mb-4">Smart Templates</h4>
                      <div className="space-y-3">
                        <Card className="cursor-pointer hover:border-blue-500 transition-colors">
                          <CardContent className="p-4">
                            <div className="font-medium mb-1">Risk of Non-Renewal</div>
                            <p className="text-sm text-gray-500 mb-2">
                              Financial: 50%, Compliance: 30%, Engagement: 20%
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              Apply Template
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:border-blue-500 transition-colors">
                          <CardContent className="p-4">
                            <div className="font-medium mb-1">High Growth Potential</div>
                            <p className="text-sm text-gray-500 mb-2">
                              Financial: 60%, Compliance: 20%, Engagement: 20%
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              Apply Template
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:border-blue-500 transition-colors">
                          <CardContent className="p-4">
                            <div className="font-medium mb-1">Compliance Scorecard</div>
                            <p className="text-sm text-gray-500 mb-2">
                              Financial: 25%, Compliance: 60%, Engagement: 15%
                            </p>
                            <Button variant="outline" size="sm" className="w-full">
                              Apply Template
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Modules & Cards Tab */}
              <TabsContent value="modules" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Dashboard Modules & Cards</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Control which modules and cards are visible on the tenant health dashboard.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-medium mb-4">Core Modules</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Overall Health Score</div>
                            <p className="text-sm text-gray-500">Main health score display with breakdown</p>
                          </div>
                          <Switch 
                            checked={moduleSettings.overallHealthScore}
                            onCheckedChange={(checked) => 
                              setModuleSettings({...moduleSettings, overallHealthScore: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Health Score Trends</div>
                            <p className="text-sm text-gray-500">Historical trend chart</p>
                          </div>
                          <Switch 
                            checked={moduleSettings.healthScoreTrends}
                            onCheckedChange={(checked) => 
                              setModuleSettings({...moduleSettings, healthScoreTrends: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Key Risk Indicators</div>
                            <p className="text-sm text-gray-500">Risk alerts and warnings</p>
                          </div>
                          <Switch 
                            checked={moduleSettings.keyRiskIndicators}
                            onCheckedChange={(checked) => 
                              setModuleSettings({...moduleSettings, keyRiskIndicators: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Financial Summary</div>
                            <p className="text-sm text-gray-500">Credit rating and financial metrics</p>
                          </div>
                          <Switch 
                            checked={moduleSettings.financialSummary}
                            onCheckedChange={(checked) => 
                              setModuleSettings({...moduleSettings, financialSummary: checked})
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-4">Detailed Cards</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Payment History</div>
                            <p className="text-sm text-gray-500">Payment timeline and late payment tracking</p>
                          </div>
                          <Switch 
                            checked={moduleSettings.paymentHistory}
                            onCheckedChange={(checked) => 
                              setModuleSettings({...moduleSettings, paymentHistory: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Compliance Status</div>
                            <p className="text-sm text-gray-500">Insurance and regulatory compliance</p>
                          </div>
                          <Switch 
                            checked={moduleSettings.complianceStatus}
                            onCheckedChange={(checked) => 
                              setModuleSettings({...moduleSettings, complianceStatus: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Engagement Metrics</div>
                            <p className="text-sm text-gray-500">App usage and amenity booking data</p>
                          </div>
                          <Switch 
                            checked={moduleSettings.engagementMetrics}
                            onCheckedChange={(checked) => 
                              setModuleSettings({...moduleSettings, engagementMetrics: checked})
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <div className="font-medium">Support Tickets</div>
                            <p className="text-sm text-gray-500">Service request history and patterns</p>
                          </div>
                          <Switch 
                            checked={moduleSettings.supportTickets}
                            onCheckedChange={(checked) => 
                              setModuleSettings({...moduleSettings, supportTickets: checked})
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Custom Variables Tab */}
              <TabsContent value="variables" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Custom Health Variables</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Create custom rules and thresholds that automatically flag tenants based on specific criteria.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">Late Payment Risk Flag</div>
                        <Switch defaultChecked />
                      </div>
                                             <p className="text-sm text-gray-500 mb-3">
                         Automatically flag tenants as "Payment Risk" if they have more than 2 late payments in 6 months
                       </p>
                       <div className="flex items-center space-x-4 text-sm">
                         <Badge variant="outline">Late Payments &gt; 2</Badge>
                         <Badge variant="outline">Time Period: 6 months</Badge>
                         <Badge variant="outline">Flag: Payment Risk</Badge>
                       </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">High Engagement Tenant</div>
                        <Switch defaultChecked />
                      </div>
                                             <p className="text-sm text-gray-500 mb-3">
                         Flag tenants as "Highly Engaged" if app usage is above 50% and event attendance is above 3 per quarter
                       </p>
                       <div className="flex items-center space-x-4 text-sm">
                         <Badge variant="outline">App Usage &gt; 50%</Badge>
                         <Badge variant="outline">Events &gt; 3/quarter</Badge>
                         <Badge variant="outline">Flag: Highly Engaged</Badge>
                       </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">Insurance Expiration Alert</div>
                        <Switch defaultChecked />
                      </div>
                                             <p className="text-sm text-gray-500 mb-3">
                         Create alert when insurance certificates expire within 60 days
                       </p>
                       <div className="flex items-center space-x-4 text-sm">
                         <Badge variant="outline">Insurance Expires &lt; 60 days</Badge>
                         <Badge variant="outline">Alert: Insurance Renewal</Badge>
                       </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">Space Utilization Concern</div>
                        <Switch />
                      </div>
                                             <p className="text-sm text-gray-500 mb-3">
                         Flag tenants with declining space utilization (below 40% for 2+ months)
                       </p>
                       <div className="flex items-center space-x-4 text-sm">
                         <Badge variant="outline">Utilization &lt; 40%</Badge>
                         <Badge variant="outline">Duration: 2+ months</Badge>
                         <Badge variant="outline">Flag: Low Utilization</Badge>
                       </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add custom variable
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex justify-end space-x-3 px-6 py-4 border-t bg-white">
            <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsConfigModalOpen(false)}>
              Save configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
