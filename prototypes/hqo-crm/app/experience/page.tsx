"use client"

// Sidebar is now provided by app/experience/layout.tsx

export default function ExperiencePage() {
  return (
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Experience Manager</h1>
              <p className="text-gray-600">Manage tenant engagement and building operations</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Experience Manager content will go here.</p>
            </div>
        </div>
      </div>
  )
}
