import { TenantDetail } from "@/components/tenant-detail"

interface TenantPageProps {
  params: {
    id: string
  }
}

export default function TenantPage({ params }: TenantPageProps) {
  return <TenantDetail tenantId={params.id} />
}
