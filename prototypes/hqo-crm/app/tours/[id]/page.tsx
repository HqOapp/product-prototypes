import { notFound } from "next/navigation"

interface TourPageProps {
  params: {
    id: string
  }
}

export default function TourPage({ params }: TourPageProps) {
  // TODO: Implement individual tour detail page
  // For now, return a simple page
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 overflow-auto">
        <div className="px-6 py-6 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tour Details</h1>
            <p className="text-gray-600">Tour ID: {params.id}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-gray-500">Tour detail page is under construction. This will show detailed information about tour {params.id}.</p>
          </div>
        </div>
      </div>
    </div>
  )
}