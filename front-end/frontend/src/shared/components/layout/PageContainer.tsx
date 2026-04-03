import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  variant?: 'default' | 'white' | 'transparent';
  maxWidth?: '4xl' | '5xl' | '6xl' | '7xl' | 'full';
  className?: string;
}

/**
 * PageContainer - Unified page wrapper component
 * 
 * Provides consistent:
 * - Background colors (light/dark mode)
 * - Max width constraints
 * - Responsive padding (px-4 on mobile, px-6 on tablet, px-8 on desktop)
 * - Vertical spacing (py-8)
 * 
 * @example
 * ```tsx
 * <PageContainer>
 *   <PageHeader title="Jobs" />
 *   <ContentSection>...</ContentSection>
 * </PageContainer>
 * ```
 */
export function PageContainer({ 
  children, 
  variant = 'default',
  maxWidth = '7xl',
  className 
}: PageContainerProps) {
  return (
    <div className={cn(
      "min-h-screen",
      variant === 'default' && "bg-slate-50 dark:bg-slate-950",
      variant === 'white' && "bg-white dark:bg-slate-900",
      variant === 'transparent' && "bg-transparent",
      className
    )}>
      <div className={cn(
        "mx-auto px-4 py-8 md:px-6 lg:px-8",
        maxWidth === '4xl' && "max-w-4xl",
        maxWidth === '5xl' && "max-w-5xl",
        maxWidth === '6xl' && "max-w-6xl",
        maxWidth === '7xl' && "max-w-7xl",
        maxWidth === 'full' && "max-w-full"
      )}>
        {children}
      </div>
    </div>
  );
}
