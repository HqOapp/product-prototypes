"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { NewsDashboard } from "@/components/news/news-dashboard"

export default function NewsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">        
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">News Dashboard</h1>
              <p className="text-gray-600">Stay informed with relevant news about your tenants, industry, and assets</p>
            </div>

            <div className="flex-1 overflow-hidden">
              <NewsDashboard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 