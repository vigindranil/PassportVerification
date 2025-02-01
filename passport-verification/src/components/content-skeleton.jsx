import { Skeleton } from "@/components/ui/skeleton"

export function ContentSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-[250px]" />
      <Skeleton className="h-4 w-[350px]" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-[200px] w-full" />
    </div>
  )
}

