import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Card - Unified card component
 * 
 * Replaces all inconsistent card implementations:
 * - JobCard (rounded-2xl border p-6 hover:shadow-lg)
 * - ApplicationCard (rounded-xl bg-white p-4 shadow-sm)
 * - PostCard (border-b py-4)
 * - StatCard (rounded-lg bg-white p-6 shadow)
 * 
 * Variants:
 * - default: Border with subtle background
 * - elevated: Shadow with no border (floating effect)
 * - bordered: Thicker border for emphasis
 * 
 * Features:
 * - Consistent border-radius (rounded-xl)
 * - Configurable padding (sm: 16px, md: 24px, lg: 32px)
 * - Optional hover effect
 * - Full dark mode support
 * 
 * @example
 * ```tsx
 * <Card hover padding="md">
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 * </Card>
 * ```
 */
export function Card({ 
  children, 
  variant = 'default',
  hover = false,
  padding = 'md',
  className 
}: CardProps) {
  return (
    <div className={cn(
      "rounded-xl bg-white dark:bg-slate-800",
      // Variants
      variant === 'default' && "border border-slate-200 dark:border-slate-700",
      variant === 'elevated' && "shadow-lg",
      variant === 'bordered' && "border-2 border-slate-200 dark:border-slate-700",
      // Padding
      padding === 'sm' && "p-4",
      padding === 'md' && "p-6",
      padding === 'lg' && "p-8",
      // Hover effect
      hover && "transition-shadow duration-200 hover:shadow-lg",
      className
    )}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardHeader - Card header section with bottom margin
 */
export function CardHeader({ children, className }: CardHeaderProps) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardTitle - Consistent card title typography
 */
export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn(
      "text-lg font-semibold text-slate-900 dark:text-white",
      className
    )}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardDescription - Muted subtitle text for cards
 */
export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn(
      "text-sm text-slate-600 dark:text-slate-400",
      className
    )}>
      {children}
    </p>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardContent - Main content area of card
 */
export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn("text-slate-600 dark:text-slate-400", className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

/**
 * CardFooter - Footer section with actions/buttons
 */
export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn("mt-4 flex items-center gap-2", className)}>
      {children}
    </div>
  );
}
