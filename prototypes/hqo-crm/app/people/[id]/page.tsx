import { PersonDetail } from "@/components/person-detail"

interface PersonPageProps {
  params: {
    id: string
  }
}

export default function PersonPage({ params }: PersonPageProps) {
  return <PersonDetail personId={params.id} />
} 