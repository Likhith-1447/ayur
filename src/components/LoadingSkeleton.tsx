import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'stat';
}

export const LoadingSkeleton = ({ className, variant = 'card' }: LoadingSkeletonProps) => {
  const baseClass = "skeleton animate-pulse rounded"
  
  const variants = {
    card: "h-32 w-full",
    text: "h-4 w-full",
    circle: "h-12 w-12 rounded-full",
    stat: "h-20 w-full"
  }

  return (
    <div className={cn(baseClass, variants[variant], className)} />
  )
}

export const DashboardSkeleton = () => (
  <div className="container mx-auto px-6 py-8 max-w-7xl space-y-8">
    {/* Welcome Section Skeleton */}
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-6 border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <LoadingSkeleton className="h-8 w-64" />
          <LoadingSkeleton className="h-4 w-96" />
        </div>
        <div className="space-y-2">
          <LoadingSkeleton className="h-6 w-24" />
          <LoadingSkeleton className="h-2 w-48" />
        </div>
      </div>
    </div>

    {/* Stats Grid Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card-shadow rounded-lg p-6 bg-card">
          <div className="text-center space-y-3">
            <LoadingSkeleton variant="circle" className="mx-auto" />
            <LoadingSkeleton className="h-8 w-16 mx-auto" />
            <LoadingSkeleton className="h-4 w-20 mx-auto" />
          </div>
        </div>
      ))}
    </div>

    {/* Prakriti Results Skeleton */}
    <div className="card-shadow rounded-lg p-6 bg-card">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <LoadingSkeleton variant="circle" className="h-6 w-6" />
          <LoadingSkeleton className="h-6 w-32" />
        </div>
        <LoadingSkeleton className="h-4 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-4 w-12" />
              </div>
              <LoadingSkeleton className="h-2 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Content Grid Skeleton */}
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="card-shadow rounded-lg p-6 bg-card">
          <LoadingSkeleton className="h-6 w-32 mb-4" />
          <LoadingSkeleton className="h-32 w-full" />
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="card-shadow rounded-lg p-6 bg-card">
          <LoadingSkeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 rounded-lg">
                <LoadingSkeleton variant="circle" className="h-10 w-10" />
                <div className="flex-1 space-y-2">
                  <LoadingSkeleton className="h-4 w-32" />
                  <LoadingSkeleton className="h-3 w-24" />
                </div>
                <LoadingSkeleton className="h-6 w-16" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const StatCardSkeleton = () => (
  <div className="card-shadow rounded-lg p-6 bg-card">
    <div className="text-center space-y-3">
      <LoadingSkeleton variant="circle" className="mx-auto" />
      <LoadingSkeleton className="h-8 w-16 mx-auto" />
      <LoadingSkeleton className="h-4 w-20 mx-auto" />
    </div>
  </div>
)