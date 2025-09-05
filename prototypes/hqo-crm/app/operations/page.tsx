import { OperationsSidebar } from "@/components/operations/operations-sidebar"

export default function OperationsPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <OperationsSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumbs */}
        <div className="px-6 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">Operations</span>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Operations</h1>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Select an operations module from the sidebar to get started.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
