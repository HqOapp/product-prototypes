"use client"
import { Calendar } from "lucide-react"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { FilterDropdown } from "@/components/filter-tabs"
import { PageTabs } from "@/components/page-tabs"
import { ArrowLeftRightIcon as ArrowsLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Event = {
  id: string
  name: string
  date: string
  views: number
  rsvps: number
  attendees: number
  sentiment: "positive" | "neutral" | "negative"
}

export default function EventsPage() {
  // Sample data for events
  const events: Event[] = [
    {
      id: "1",
      name: "Rooftop Yoga",
      date: "2023-06-15",
      views: 450,
      rsvps: 120,
      attendees: 95,
      sentiment: "positive",
    },
    {
      id: "2",
      name: "Wine Tasting",
      date: "2023-06-22",
      views: 380,
      rsvps: 85,
      attendees: 72,
      sentiment: "positive",
    },
    {
      id: "3",
      name: "Networking Mixer",
      date: "2023-06-29",
      views: 520,
      rsvps: 150,
      attendees: 130,
      sentiment: "neutral",
    },
    {
      id: "4",
      name: "Art Exhibition",
      date: "2023-07-05",
      views: 320,
      rsvps: 70,
      attendees: 65,
      sentiment: "positive",
    },
    {
      id: "5",
      name: "Tech Talk",
      date: "2023-07-12",
      views: 280,
      rsvps: 60,
      attendees: 45,
      sentiment: "negative",
    },
    {
      id: "6",
      name: "Fitness Challenge",
      date: "2023-07-19",
      views: 410,
      rsvps: 95,
      attendees: 80,
      sentiment: "positive",
    },
  ]

  // Sample data for the line chart
  const lineChartData = [
    { month: "Jan", rsvps: 320, attendees: 280 },
    { month: "Feb", rsvps: 350, attendees: 300 },
    { month: "Mar", rsvps: 380, attendees: 320 },
    { month: "Apr", rsvps: 420, attendees: 350 },
    { month: "May", rsvps: 450, attendees: 380 },
    { month: "Jun", rsvps: 480, attendees: 410 },
  ]

  // Sample data for the heatmap
  const heatmapData = Array.from({ length: 7 * 12 }, (_, i) => {
    const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][Math.floor(i / 12)]
    const hour = `${(i % 12) + 8}:00`
    const value = Math.floor(Math.random() * 100)
    return { day, hour, value }
  })

  // Sample data for the funnel chart
  const funnelData = [
    { name: "Views", value: 2360, color: "#4f46e5" },
    { name: "RSVPs", value: 580, color: "#8b5cf6" },
    { name: "Attendees", value: 487, color: "#ec4899" },
  ]

  // Sample data for weekly breakdown
  const weeklyData = [
    { day: "Monday", value: 6.5 },
    { day: "Tuesday", value: 6.1 },
    { day: "Wednesday", value: 4.7 },
    { day: "Thursday", value: 5.3 },
    { day: "Friday", value: 7.2 },
    { day: "Saturday", value: 8.4 },
    { day: "Sunday", value: 4.6 },
  ]

  // Table columns
  const columns: ColumnDef<Event>[] = [
    {
      accessorKey: "name",
      header: "Event Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        return (
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            {date.toLocaleDateString()}
          </div>
        )
      },
    },
    {
      accessorKey: "views",
      header: "Views",
    },
    {
      accessorKey: "rsvps",
      header: "RSVPs",
    },
    {
      accessorKey: "attendees",
      header: "Attendees",
    },
    {
      accessorKey: "sentiment",
      header: "Sentiment",
      cell: ({ row }) => {
        const sentiment = row.getValue("sentiment") as string
        return (
          <Badge
            variant="outline"
            className={
              sentiment === "positive"
                ? "bg-green-50 text-green-700 border-green-200"
                : sentiment === "negative"
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-gray-50 text-gray-700 border-gray-200"
            }
          >
            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        )
      },
    },
  ]

  // Page tabs
  const pageTabs = [
    { label: "Overview", href: "/" },
    { label: "Work Orders", href: "/work-orders" },
    { label: "Visitor Management", href: "/visitor-management" },
    { label: "Resource Booking", href: "/resource-booking" },
    { label: "Content", href: "/content" },
    { label: "Surveys", href: "/surveys" },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-0">
        <h1 className="text-2xl font-bold">Events Analytics</h1>

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

      <div className="p-6">
        <div className="flex items-center justify-center h-[400px] border rounded-lg">
          <p className="text-muted-foreground">Events Analytics content will appear here</p>
        </div>
      </div>
    </div>
  )
}
