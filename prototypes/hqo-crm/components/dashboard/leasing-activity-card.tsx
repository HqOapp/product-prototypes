"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, FileText, Square } from "lucide-react"
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"
import { mockBuildings, mockLeases } from "@/lib/mockData"
import { piedmontBuildings, piedmontLeases, piedmontLeasingActivity } from "@/lib/piedmontBuildings"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface FilterState {
  region: string
  building: string
}

interface LeasingActivityCardProps {
  filters: FilterState
}

export function LeasingActivityCard({ filters }: LeasingActivityCardProps) {
  const { currentMode } = useCustomerMode()

  // Get filtered activity data based on customer mode and filters
  const { filteredActivity } = useMemo(() => {
    let buildingsData: any[]
    let activityData: any[]

    // Apply customer mode filtering - Use real Piedmont data or mock data
    if (currentMode === "piedmont") {
      buildingsData = piedmontBuildings
      activityData = piedmontLeasingActivity
    } else {
      buildingsData = mockBuildings
      // Generate mock activity data from mock leases
      activityData = mockLeases.map((lease, index) => ({
        activity_id: `mock-activity-${index}`,
        building_id: lease.lease_id, // Use lease_id as proxy
        date: lease.execution_date,
        tenant_name: `Tenant ${index + 1}`,
        lease_value_annual: lease.base_rent_annual || 400000,
        square_feet: Math.floor((lease.base_rent_annual || 400000) / 35), // Estimate sq ft
        lease_type: lease.renewal_option ? "Renewal" : "New Lease",
        region: "Mock Region"
      }))
    }

    // Apply user filters
    if (filters.region !== "all") {
      if (currentMode === "piedmont") {
        // Filter by region directly for Piedmont data
        activityData = activityData.filter(a => a.region === filters.region)
      } else {
        // For mock data, filter by buildings in selected region
        buildingsData = buildingsData.filter(b => b.region === filters.region)
        const regionAssetTypes = buildingsData.map(b => b.asset_type)
        activityData = activityData.filter(a => {
          const lease = mockLeases.find(l => l.lease_id === a.building_id)
          return lease && regionAssetTypes.includes(lease.property_type)
        })
      }
    }

    if (filters.building !== "all") {
      if (currentMode === "piedmont") {
        // Filter by specific building for Piedmont data
        activityData = activityData.filter(a => a.building_id === filters.building)
      } else {
        // For mock data, filter by building's asset type
        const selectedBuilding = buildingsData.find(b => b.uuid === filters.building)
        if (selectedBuilding) {
          activityData = activityData.filter(a => {
            const lease = mockLeases.find(l => l.lease_id === a.building_id)
            return lease && lease.property_type === selectedBuilding.asset_type
          })
        }
      }
    }

    return {
      filteredActivity: activityData
    }
  }, [currentMode, filters])

  // Calculate lease activity data for charts
  const chartData = useMemo(() => {
    const currentDate = new Date()
    
    // Last 6 months data
    const monthlyData = []
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0)
      
      const monthActivity = filteredActivity.filter((activity: any) => {
        const activityDate = new Date(activity.date)
        return activityDate >= month && activityDate <= monthEnd
      })
      
      monthlyData.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        leases: monthActivity.length,
        value: monthActivity.reduce((sum: number, a: any) => sum + (a.lease_value_annual || 0), 0)
      })
    }

    // Last 30 days (weekly) data
    const weeklyData = []
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(currentDate.getTime() - ((i + 1) * 7 * 24 * 60 * 60 * 1000))
      const weekEnd = new Date(currentDate.getTime() - (i * 7 * 24 * 60 * 60 * 1000))
      
      const weekActivity = filteredActivity.filter((activity: any) => {
        const activityDate = new Date(activity.date)
        return activityDate >= weekStart && activityDate <= weekEnd
      })
      
      weeklyData.push({
        week: `Week ${4 - i}`,
        leases: weekActivity.length,
        value: weekActivity.reduce((sum: number, a: any) => sum + (a.lease_value_annual || 0), 0)
      })
    }

    return { monthlyData, weeklyData }
  }, [filteredActivity])

  // Calculate summary metrics
  const metrics = useMemo(() => {
    const totalLeases = filteredActivity.length
    const totalAnnualRent = filteredActivity.reduce((sum: number, a: any) => sum + (a.lease_value_annual || 0), 0)
    const averageLeaseValue = totalLeases > 0 ? totalAnnualRent / totalLeases : 0
    
    // Calculate square feet from activity data
    const totalSquareFeet = filteredActivity.reduce((sum: number, a: any) => sum + (a.square_feet || 0), 0)

    return {
      totalLeases,
      averageLeaseValue,
      totalSquareFeet
    }
  }, [filteredActivity])

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle>Leasing Activity</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{metrics.totalLeases}</div>
            <p className="text-sm text-blue-600">Total Leases Signed</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              ${(metrics.averageLeaseValue / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-green-600">Average Lease Size</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {(metrics.totalSquareFeet / 1000).toFixed(0)}K
            </div>
            <p className="text-sm text-purple-600">Total Sq Ft Leased</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Lease Volume by Month (Last 6 Months)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'leases' ? `${value} leases` : `$${(Number(value) / 1000).toFixed(0)}K`,
                    name === 'leases' ? 'Leases Signed' : 'Total Value'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="leases" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Lease Volume by Week (Last 30 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'leases' ? `${value} leases` : `$${(Number(value) / 1000).toFixed(0)}K`,
                    name === 'leases' ? 'Leases Signed' : 'Total Value'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="leases" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 