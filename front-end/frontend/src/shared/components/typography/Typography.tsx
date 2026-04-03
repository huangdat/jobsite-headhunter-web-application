import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageTitle - Main page heading (h1)
 * 
 * Replaces inconsistent h1 usage:
 * - JobListPage: text-4xl font-semibold
 * - PostListPage: text-4xl font-bold  
 * - AdminDashboard: text-3xl font-bold
 * - HomePage: text-5xl font-bold
 * 
 * Standard: text-3xl (mobile) → text-4xl (desktop), font-bold
 */
export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1 className={cn(
      "text-3xl font-bold text-slate-900 dark:text-white md:text-4xl",
      className
    )}>
      {children}
    </h1>
  );
}

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * SectionTitle - Section heading (h2)
 * 
 * For major sections within a page.
 * Standard: text-2xl, font-semibold
 */
export function SectionTitle({ children, className }: SectionTitleProps) {
  return (
    <h2 className={cn(
      "text-2xl font-semibold text-slate-800 dark:text-slate-100",
      className
    )}>
      {children}
    </h2>
  );
}

interface SubsectionTitleProps {
  children: ReactNode;
  className?: string;
}

/**
 * SubsectionTitle - Subsection heading (h3)
 * 
 * For minor sections / card titles.
 * Standard: text-lg, font-semibold
 */
export function SubsectionTitle({ children, className }: SubsectionTitleProps) {
  return (
    <h3 className={cn(
      "text-lg font-semibold text-slate-900 dark:text-white",
      className
    )}>
      {children}
    </h3>
  );
}

interface BodyTextProps {
  children: ReactNode;
  variant?: 'normal' | 'muted';
  className?: string;
}

/**
 * BodyText - Standard paragraph text
 * 
 * Variants:
 * - normal: Regular text color (slate-700)
 * - muted: Secondary text color (slate-600)
 */
export function BodyText({ children, variant = 'normal', className }: BodyTextProps) {
  return (
    <p className={cn(
      "text-base",
      variant === 'normal' && "text-slate-700 dark:text-slate-300",
      variant === 'muted' && "text-slate-600 dark:text-slate-400",
      className
    )}>
      {children}
    </p>
  );
}

interface LabelTextProps {
  children: ReactNode;
  required?: boolean;
  className?: string;
}

/**
 * LabelText - Form label text
 * 
 * Consistent styling for all form labels with optional required indicator.
 */
export function LabelText({ children, required, className }: LabelTextProps) {
  return (
    <label className={cn(
      "text-sm font-medium text-slate-700 dark:text-slate-300",
      className
    )}>
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

interface HelpTextProps {
  children: ReactNode;
  className?: string;
}

/**
 * HelpText - Helper text for forms / descriptions
 * 
 * Small muted text for hints, descriptions, validation messages.
 */
export function HelpText({ children, className }: HelpTextProps) {
  return (
    <p className={cn(
      "text-sm text-slate-500 dark:text-slate-400",
      className
    )}>
      {children}
    </p>
  );
}
