import { Badge } from "@/components/ui/badge"

interface ProductBadgeProps {
  product: string
}

export function ProductBadge({ product }: ProductBadgeProps) {
  // Use shortened display names for some products to keep badges compact
  const displayName = product === "Content Management System (CMS)" ? "CMS" : product

  return (
    <Badge variant="outline" className="bg-white text-[#696E72] font-normal text-xs py-1 whitespace-nowrap">
      {displayName}
    </Badge>
  )
}
