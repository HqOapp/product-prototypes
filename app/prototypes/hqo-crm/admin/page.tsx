"use client"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { ObjectConfig } from "@/components/admin/object-config"

export default function AdminPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-auto px-6 py-6">
          <ObjectConfig />
        </div>
      </div>
    </div>
  )
}
