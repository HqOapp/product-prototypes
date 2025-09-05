"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Smartphone, CreditCard, Users, TrendingUp } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ActivityTabProps {
  selectedBuildings: string[]
}

const activityData = [
  { date: "2024-01-01", accessSwipes: 45, visitorsRegistered: 3, resourcesBooked: 8 },
  { date: "2024-01-02", accessSwipes: 52, visitorsRegistered: 1, resourcesBooked: 12 },
  { date: "2024-01-03", accessSwipes: 38, visitorsRegistered: 5, resourcesBooked: 6 },
  { date: "2024-01-04", accessSwipes: 61, visitorsRegistered: 2, resourcesBooked: 15 },
  { date: "2024-01-05", accessSwipes: 43, visitorsRegistered: 4, resourcesBooked: 9 },
  { date: "2024-01-06", accessSwipes: 29, visitorsRegistered: 1, resourcesBooked: 4 },
  { date: "2024-01-07", accessSwipes: 18, visitorsRegistered: 0, resourcesBooked: 2 },
]

export function ActivityTab({ selectedBuildings }: ActivityTabProps) {
  const [selectedActivity, setSelectedActivity] = useState("accessSwipes")
  const [dateRange, setDateRange] = useState<any>(null)

  const activityOptions = [
    { value: "accessSwipes", label: "Access Swipes", color: "#3b82f6" },
    { value: "visitorsRegistered", label: "Visitors Registered", color: "#10b981" },
    { value: "resourcesBooked", label: "Resources Booked", color: "#f59e0b" },
  ]

  const currentActivity = activityOptions.find((opt) => opt.value === selectedActivity)

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Activity Analytics - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Summary with Controls */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-normal">Activity Analytics</CardTitle>
                <div className="flex items-center space-x-4">
                  <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {activityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value, name) => [value, currentActivity?.label]}
                    />
                    <Line
                      type="monotone"
                      dataKey={selectedActivity}
                      stroke={currentActivity?.color}
                      strokeWidth={3}
                      dot={{ fill: currentActivity?.color, strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-500">Total Access Swipes</div>
                  <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs last month
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <div className="text-sm text-gray-500">Visitors Registered</div>
                  <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8% vs last month
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">156</div>
                  <div className="text-sm text-gray-500">Resources Booked</div>
                  <div className="text-xs text-red-600 flex items-center justify-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
                    -3% vs last month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Recent Activity Feed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-700">AM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Alex Morgan</span>
                      <Badge variant="secondary" className="text-xs">
                        CEO
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Used access card at Main Entrance</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />2 minutes ago
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Cobblestone Collaborative
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-700">JL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Jordan Lee</span>
                      <Badge variant="secondary" className="text-xs">
                        CFO
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Booked Conference Room A for 2:00 PM</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        15 minutes ago
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Today
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-purple-100 text-purple-700">TK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Taylor Kim</span>
                      <Badge variant="secondary" className="text-xs">
                        Operations
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Submitted service request for HVAC maintenance</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />1 hour ago
                      </span>
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        Floor 9
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-orange-100 text-orange-700">SM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Sarah Martinez</span>
                      <Badge variant="secondary" className="text-xs">
                        Engineering
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">Logged into HqO mobile app</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />2 hours ago
                      </span>
                      <span className="flex items-center">
                        <Smartphone className="h-3 w-3 mr-1" />
                        Mobile App
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Summary Sidebar - 1/3 width */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Activity Summary (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                    <span className="text-sm">Access Card Uses</span>
                  </div>
                  <span className="font-medium">1,247</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2 text-green-600" />
                    <span className="text-sm">App Logins</span>
                  </div>
                  <span className="font-medium">89</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                    <span className="text-sm">Amenity Bookings</span>
                  </div>
                  <span className="font-medium">156</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-orange-600" />
                    <span className="text-sm">Visitor Invitations</span>
                  </div>
                  <span className="font-medium">23</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Peak Usage Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Morning (8-10 AM)</span>
                  <Badge className="bg-green-100 text-green-800">High</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lunch (12-1 PM)</span>
                  <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Evening (5-6 PM)</span>
                  <Badge className="bg-green-100 text-green-800">High</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Weekend</span>
                  <Badge variant="secondary">Low</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Most Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-blue-100 text-blue-700">AM</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Alex Morgan</span>
                  </div>
                  <span className="text-xs font-medium">247</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-green-100 text-green-700">JL</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Jordan Lee</span>
                  </div>
                  <span className="text-xs font-medium">189</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-purple-100 text-purple-700">TK</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Taylor Kim</span>
                  </div>
                  <span className="text-xs font-medium">156</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-normal">Building Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cobblestone Collaborative</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">892</div>
                    <div className="text-xs text-gray-500">72% of activity</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Metro Tower</span>
                  <div className="text-right">
                    <div className="text-sm font-medium">355</div>
                    <div className="text-xs text-gray-500">28% of activity</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
