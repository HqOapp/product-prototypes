"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { MetricCard } from "@/components/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle, Clock, BarChart3 } from "lucide-react"

export default function AssessmentsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">        
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessments</h1>
                <p className="text-gray-600">Manage building assessments and compliance reviews</p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Assessment
              </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Assessments"
                value="24"
                change={12.5}
                changeLabel="from last quarter"
                icon={<FileText className="h-4 w-4" />}
              />
              <MetricCard
                title="Completed"
                value="18"
                change={8.3}
                changeLabel="from last quarter"
                icon={<CheckCircle className="h-4 w-4" />}
              />
              <MetricCard
                title="In Progress"
                value="4"
                change={-2}
                changeLabel="from last month"
                icon={<Clock className="h-4 w-4" />}
              />
              <MetricCard
                title="Avg Score"
                value="4.3"
                change={0.2}
                changeLabel="from last quarter"
                icon={<BarChart3 className="h-4 w-4" />}
              />
            </div>

            {/* Content placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Assessment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Assessment management features will be implemented here.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 