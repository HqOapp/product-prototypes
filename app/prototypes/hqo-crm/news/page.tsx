"use client"
import { NewsDashboard } from "@/components/news/news-dashboard"

export default function NewsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-6 pb-4">
        <h1 className="text-2xl font-bold">News Dashboard</h1>
      </div>

      <div className="flex-1 overflow-hidden">
        <NewsDashboard />
      </div>
    </div>
  )
}
