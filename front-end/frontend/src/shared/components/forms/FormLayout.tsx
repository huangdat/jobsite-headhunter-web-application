import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface FormLayoutProps {
  children: ReactNode;
  columns?: 1 | 2 | 3;
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * FormLayout - Responsive grid layout for forms
 * 
 * Replaces inconsistent form layouts:
 * - JobCreatePage: multi-column grid with gap-6
 * - ApplicationForm: single column with gap-4
 * - ProfileEditPage: mixed grid layouts
 * 
 * Features:
 * - Responsive column counts (stacks on mobile)
 * - Consistent spacing scale
 * - Easy to read form structure
 * 
 * @example
 * ```tsx
 * <FormLayout columns={2} spacing="md">
 *   <FormField name="firstName" />
 *   <FormField name="lastName" />
 *   <FormField name="email" className="col-span-2" />
 * </FormLayout>
 * ```
 */
export function FormLayout({ 
  children, 
  columns = 1,
  spacing = 'md',
  className 
}: FormLayoutProps) {
  return (
    <div className={cn(
      "grid",
      // Columns
      columns === 1 && "grid-cols-1",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      // Spacing
      spacing === 'sm' && "gap-4",
      spacing === 'md' && "gap-6",
      spacing === 'lg' && "gap-8",
      className
    )}>
      {children}
    </div>
  );
}

interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * FormSection - Logical grouping of form fields
 * 
 * Use to separate different sections of a large form:
 * - Basic Information
 * - Contact Details
 * - Preferences
 * 
 * Features:
 * - Optional section title & description
 * - Border separator for visual hierarchy
 * - Consistent spacing
 * 
 * @example
 * ```tsx
 * <FormSection 
 *   title="Basic Information"
 *   description="Tell us about yourself"
 * >
 *   <FormLayout columns={2}>
 *     <FormField name="firstName" />
 *     <FormField name="lastName" />
 *   </FormLayout>
 * </FormSection>
 * ```
 */
export function FormSection({ 
  title, 
  description, 
  children,
  className 
}: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="border-b border-slate-200 pb-3 dark:border-slate-700">
          {title && (
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
