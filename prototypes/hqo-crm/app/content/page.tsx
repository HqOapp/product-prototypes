import { FilterDropdown } from "@/components/filter-tabs"
import { PageTabs } from "@/components/page-tabs"
import { ArrowLeftRightIcon as ArrowsLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContentPage() {
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
        <h1 className="text-2xl font-bold">Content</h1>

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
        <Card>
          <CardHeader>
            <CardTitle>Content Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">This is a placeholder for the Content analytics page.</p>
            <p className="mt-4">
              This page would typically show analytics related to content engagement, including views, interactions, and
              popular content types.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
