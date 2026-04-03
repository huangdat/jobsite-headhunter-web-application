import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  variant?: 'default' | 'gradient' | 'bordered';
  className?: string;
}

/**
 * PageHeader - Unified page header component
 * 
 * Supports 3 variants:
 * - default: Simple header with title + description
 * - gradient: Emerald gradient hero section (JobListPage style)
 * - bordered: Bottom border separator (PostListPage style)
 * 
 * Features:
 * - Responsive layout (stacks on mobile, row on desktop)
 * - Action buttons placement
 * - Consistent typography
 * - Full dark mode support
 * 
 * @example
 * ```tsx
 * <PageHeader
 *   variant="gradient"
 *   title={t('jobs.list.title')}
 *   description={t('jobs.list.description')}
 *   actions={<Button>Create Job</Button>}
 * />
 * ```
 */
export function PageHeader({ 
  title, 
  description, 
  actions,
  variant = 'default',
  className 
}: PageHeaderProps) {
  return (
    <div className={cn(
      "mb-8",
      variant === 'gradient' && "rounded-2xl bg-linear-to-br from-emerald-500 to-slate-900 p-8 text-white shadow-lg md:p-10",
      variant === 'bordered' && "border-b border-slate-200 pb-6 dark:border-slate-700",
      className
    )}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className={cn(
            "text-3xl font-bold md:text-4xl",
            variant === 'gradient' ? "text-white" : "text-slate-900 dark:text-white"
          )}>
            {title}
          </h1>
          {description && (
            <p className={cn(
              "mt-2 text-base md:text-lg",
              variant === 'gradient' 
                ? "text-white/90" 
                : "text-slate-600 dark:text-slate-400"
            )}>
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 sm:shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
