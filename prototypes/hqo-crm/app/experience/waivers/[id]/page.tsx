import { WaiverDetail } from "@/components/waiver-detail";

interface WaiverPageProps {
  params: {
    id: string;
  };
}

export default function WaiverPage({ params }: WaiverPageProps) {
  return <WaiverDetail waiverId={params.id} />;
}
