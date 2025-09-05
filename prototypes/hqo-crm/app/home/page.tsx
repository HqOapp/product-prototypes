import { FilterDropdown } from "@/components/filter-tabs"
import { PageTabs } from "@/components/page-tabs"
import { ArrowLeftRightIcon as ArrowsLeftRight, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MetricCardNew } from "@/components/metric-card-new"

export default function HomePage() {
  // Page tabs for consistency with other pages
  const pageTabs = [
    { label: "Overview", href: "/home" },
    { label: "Dashboard", href: "/home/dashboard" },
    { label: "Activity", href: "/home/activity" },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-0">
        <h1 className="text-2xl font-bold">Home</h1>

                  <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FilterDropdown label="Buildings" />

              </div>
              <div className="flex items-center gap-2">
                <FilterDropdown label="Tenants" />
                <FilterDropdown label="Industries" />
              </div>
              <Button variant="outline" className="gap-2">
                <ArrowsLeftRight className="h-4 w-4" />
                Benchmark
              </Button>
            </div>
        </div>
      </div>

      <PageTabs tabs={pageTabs} className="px-6 mt-6" />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricCardNew title="Today's traffic report" viewLink="/traffic">
            <div>
              <div className="mb-4">
                <div className="text-4xl font-bold">761</div>
                <div className="text-sm text-muted-foreground">Total badge-ins</div>
              </div>
              <div className="h-32 bg-blue-50 rounded-md flex items-end p-2">
                {/* Placeholder for chart */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-4 bg-blue-400 mx-0.5 rounded-t"
                    style={{ height: `${Math.random() * 100}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </MetricCardNew>

          <MetricCardNew title="Today's summary" viewLink="/summary">
            <div>
              <div className="flex border-b mb-4">
                <div className="pb-2 px-4 border-b-2 border-primary font-medium text-sm">Visitors</div>
                <div className="pb-2 px-4 text-muted-foreground text-sm">Bookings</div>
              </div>

              <div className="flex justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold">9</div>
                  <div className="text-sm text-muted-foreground">Total visits</div>
                </div>

                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-600 font-medium mx-auto">
                      3
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Checked-in</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-red-100 text-red-600 font-medium mx-auto">
                      0
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Checked-out</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600 font-medium mx-auto">
                      6
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Expected</div>
                  </div>
                </div>
              </div>

              <div className="h-2 w-full bg-gray-100 rounded-full mb-4">
                <div className="h-2 bg-green-500 rounded-l-full" style={{ width: "33%" }}></div>
                <div className="h-2 bg-purple-500 rounded-r-full" style={{ width: "67%", marginTop: "-0.5rem" }}></div>
              </div>

              <div className="flex items-center text-sm text-green-600">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span className="font-medium">350%</span>
                <span className="text-muted-foreground ml-1">higher activity than previous Wednesdays</span>
              </div>
            </div>
          </MetricCardNew>
        </div>
      </div>
    </div>
  )
}
