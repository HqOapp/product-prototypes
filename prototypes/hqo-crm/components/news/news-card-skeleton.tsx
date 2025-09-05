import { Skeleton } from "@/components/ui/skeleton"

export function NewsCardSkeleton() {
  return (
    <div className="rounded-md border bg-card overflow-hidden">
      <div className="p-3 space-y-2">
        <div className="flex justify-between items-start gap-2">
          {/* Always show image skeleton */}
          <Skeleton className="w-[80px] h-[60px] rounded-md flex-shrink-0" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="flex gap-1">
            <Skeleton className="h-4 w-10 rounded-full" />
            <Skeleton className="h-4 w-10 rounded-full" />
          </div>
        </div>
      </div>

      <div className="border-t px-1 py-1 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-1">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>

        <div className="flex items-center">
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </div>
    </div>
  )
}
