import { BuildingDetail } from "@/components/buildings/building-detail"

interface BuildingPageProps {
  params: {
    id: string
  }
}

export default function BuildingPage({ params }: BuildingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <BuildingDetail buildingId={params.id} />
    </div>
  )
}
