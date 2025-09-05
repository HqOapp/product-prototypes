"use client"

import { useState } from "react"
import { FilterDropdown } from "@/components/filter-tabs"
import { PageTabs } from "@/components/page-tabs"
import { ArrowLeftRightIcon as ArrowsLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart2, Lightbulb, FileText, Zap, MoreVertical } from "lucide-react"
import { cn } from "@/lib/utils"

export default function WorkOrdersPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Page tabs
  const pageTabs = [
    { label: "Overview", href: "/" },
    { label: "Work Orders", href: "/work-orders" },
    { label: "Visitor Management", href: "/visitor-management" },
    { label: "Resource Booking", href: "/resource-booking" },
    { label: "Content", href: "/content" },
    { label: "Surveys", href: "/surveys" },
  ]

  // Categories for filtering
  const categories = [
    { id: "all", label: "All" },
    { id: "trend", label: "Trends" },
    { id: "recommendation", label: "Recommendations" },
    { id: "task", label: "Tasks" },
    { id: "automation", label: "Automations" },
  ]

  // Card data - work orders specific
  const cards = [
    {
      id: 1,
      category: "trend",
      title: "Avg. WO Resolution Time",
      highlight: "5.6 days vs. 3.5 day target",
      highlightColor: "bg-blue-50 text-blue-700",
      description: "Resolution times are trending up. Consider reviewing technician availability or vendor SLAs.",
      icon: <BarChart2 className="h-4 w-4 text-blue-600" />,
    },
    {
      id: 2,
      category: "trend",
      title: "Preventive vs. Reactive Ratio",
      highlight: "78% of WOs are reactive",
      highlightColor: "bg-blue-50 text-blue-700",
      description:
        "High reactive volume suggests missed preventive maintenance. Shifting more tasks to scheduled work can reduce unplanned issues.",
      icon: <BarChart2 className="h-4 w-4 text-blue-600" />,
    },
    {
      id: 3,
      category: "trend",
      title: "Top WO Category: Elevators",
      highlight: "Recurring issues in 3 buildings",
      highlightColor: "bg-blue-50 text-blue-700",
      description:
        "Elevator-related requests are the most frequent. This may indicate underlying system issues or deferred CapEx.",
      icon: <BarChart2 className="h-4 w-4 text-blue-600" />,
    },
    {
      id: 4,
      category: "recommendation",
      title: "Enable Predictive Maintenance",
      highlight: "90% failure-triggered WOs",
      highlightColor: "bg-purple-50 text-purple-700",
      description: "Shifting to scheduled inspections and tracking can reduce costly reactive repairs.",
      icon: <Lightbulb className="h-4 w-4 text-purple-600" />,
      action: { label: "Enable Monitoring", onClick: () => console.log("Enable monitoring clicked") },
    },
    {
      id: 5,
      category: "recommendation",
      title: "Bundle PM Vendor Contracts",
      highlight: "Estimated 15% cost reduction",
      highlightColor: "bg-purple-50 text-purple-700",
      description:
        "Consolidating vendor contracts across properties could reduce spend and improve service consistency.",
      icon: <Lightbulb className="h-4 w-4 text-purple-600" />,
      action: { label: "Start Consolidation", onClick: () => console.log("Start consolidation clicked") },
    },
    {
      id: 6,
      category: "recommendation",
      title: "Raise NTE for Electrical Repairs",
      highlight: "Avg WO cost is 25% above cap",
      highlightColor: "bg-purple-50 text-purple-700",
      description: "AI recommends updating NTE thresholds to better reflect current market rates and avoid delays.",
      icon: <Lightbulb className="h-4 w-4 text-purple-600" />,
      action: { label: "Update Limits", onClick: () => console.log("Update limits clicked") },
    },
    {
      id: 7,
      category: "task",
      title: "Approve $48K HVAC",
      highlight: "Repair costs exceed 60% of unit value",
      highlightColor: "bg-gray-100 text-gray-700",
      description: "Recommend moving this into Q3 CapEx to prevent continued downtime and avoidable expense.",
      icon: <FileText className="h-4 w-4 text-gray-600" />,
      action: { label: "Review and Approve", onClick: () => console.log("Review and approve clicked") },
    },
    {
      id: 8,
      category: "task",
      title: "Overdue WOs",
      highlight: "11 WOs open more than 7 days",
      highlightColor: "bg-gray-100 text-gray-700",
      description: "4 are marked high-priority. Recommend follow-up with property team to ensure resolution.",
      icon: <FileText className="h-4 w-4 text-gray-600" />,
      action: { label: "View WO Backlog", onClick: () => console.log("View WO backlog clicked") },
    },
    {
      id: 9,
      category: "task",
      title: "Vendor SLA Misses",
      highlight: "Apex missed 6 SLAs this month",
      highlightColor: "bg-gray-100 text-gray-700",
      description: "Performance slipping. Consider initiating review or starting a new RFP.",
      icon: <FileText className="h-4 w-4 text-gray-600" />,
      action: { label: "Review Vendor", onClick: () => console.log("Review vendor clicked") },
    },
    {
      id: 10,
      category: "automation",
      title: "WOs Auto-Routed",
      highlight: "Plumbing tasks assigned to John S.",
      highlightColor: "bg-amber-50 text-amber-700",
      description: "Based on past performance, tasks should be automatically routed to top-performing techs.",
      icon: <Zap className="h-4 w-4 text-amber-600" />,
      action: { label: "Set up automation", onClick: () => console.log("Set up automation clicked") },
    },
    {
      id: 11,
      category: "automation",
      title: "NTE Limits Auto-Adjusted",
      highlight: "Reduced overages last month",
      highlightColor: "bg-amber-50 text-amber-700",
      description: "Dynamically set appropriate cost thresholds per work order type to avoid overspending.",
      icon: <Zap className="h-4 w-4 text-amber-600" />,
      action: { label: "Set up automation", onClick: () => console.log("Set up automation clicked") },
    },
    {
      id: 12,
      category: "automation",
      title: "Recurring Issue Flagged",
      highlight: "Repeat WO auto-created for Building B",
      highlightColor: "bg-amber-50 text-amber-700",
      description: "Similar issues were logged previously. Automate similar work orders.",
      icon: <Zap className="h-4 w-4 text-amber-600" />,
      action: { label: "Set up automation", onClick: () => console.log("Set up automation clicked") },
    },
  ]

  // Filter cards based on selected category
  const filteredCards = selectedCategory === "all" ? cards : cards.filter((card) => card.category === selectedCategory)

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "trend":
        return "Trend"
      case "recommendation":
        return "Recommendation"
      case "task":
        return "Task"
      case "automation":
        return "Automation"
      default:
        return "Trend"
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-0">
        <h1 className="text-2xl font-bold">Work Orders</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FilterDropdown label="Buildings" />
            <FilterDropdown label="Tenants" />
            <FilterDropdown label="Industries" />
          </div>

          <Button variant="outline" className="gap-2">
            <ArrowsLeftRight className="h-4 w-4" />
            Benchmark
          </Button>
        </div>
      </div>

      <PageTabs tabs={pageTabs} className="px-6 mt-6" />

      <div className="p-6 space-y-6">
        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={cn("rounded-full", selectedCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : "")}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCards.map((card) => (
            <Card key={card.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-4 space-y-3">
                  {/* Card Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {card.icon}
                      <span className="text-sm text-gray-500">{getCategoryLabel(card.category)}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-medium text-lg">{card.title}</h3>

                  {/* Highlight */}
                  {card.highlight && (
                    <div className={cn("text-sm py-1 px-2 rounded-md inline-block", card.highlightColor)}>
                      {card.highlight}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-gray-600">{card.description}</p>

                  {/* Action Button */}
                  {card.action && (
                    <div className="pt-2">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-center text-sm h-9",
                          card.category === "recommendation"
                            ? "text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-700"
                            : card.category === "automation"
                              ? "text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700"
                              : card.category === "task"
                                ? "text-gray-700 bg-gray-50 hover:bg-gray-100"
                                : "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700",
                        )}
                        onClick={card.action.onClick}
                      >
                        {card.action.label}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
