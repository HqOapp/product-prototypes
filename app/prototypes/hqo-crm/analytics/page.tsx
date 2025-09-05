import { Sidebar } from "@/components/sidebar"

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center h-full py-24">
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className="text-muted-foreground text-lg">Analytics dashboard coming soon.</p>
      </div>
    </div>
  )
} 