import { cn } from '@/lib/utils';

interface PageSkeletonProps {
  variant?: 'grid' | 'list' | 'table';
  count?: number;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * PageSkeleton - Unified loading skeleton component
 * 
 * Replaces all custom skeleton implementations across pages.
 * Provides consistent loading states for:
 * - Grid layouts (JobListPage, ApplicationListPage)
 * - List layouts (PostListPage, NotificationList)
 * - Table layouts (AdminDashboard, UserList)
 * 
 * Features:
 * - Responsive column counts
 * - Smooth pulse animation
 * - Dark mode support
 * - Customizable item count
 * 
 * @example
 * ```tsx
 * {isLoading && <PageSkeleton variant="grid" columns={3} count={6} />}
 * ```
 */
export function PageSkeleton({ 
  variant = 'grid', 
  count = 6,
  columns = 3,
  className 
}: PageSkeletonProps) {
  if (variant === 'grid') {
    return (
      <div className={cn(
        "grid gap-6",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        className
      )}>
        {Array.from({ length: count }).map((_, i) => (
          <div 
            key={i} 
            className="h-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" 
          />
        ))}
      </div>
    );
  }
  
  if (variant === 'list') {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: count }).map((_, i) => (
          <div 
            key={i} 
            className="h-24 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" 
          />
        ))}
      </div>
    );
  }
  
  if (variant === 'table') {
    return (
      <div className={cn("space-y-3", className)}>
        {/* Table header skeleton */}
        <div className="h-12 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        {/* Table rows skeleton */}
        {Array.from({ length: count }).map((_, i) => (
          <div 
            key={i} 
            className="h-16 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-900" 
          />
        ))}
      </div>
    );
  }
  
  return null;
}
