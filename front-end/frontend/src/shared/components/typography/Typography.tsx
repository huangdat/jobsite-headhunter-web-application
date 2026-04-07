import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { getSemanticClass } from "@/lib/design-tokens";

interface DisplayProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Display - Hero/landing page headings
 *
 * Large display headings for maximum visual impact.
 * Sizes:
 * - sm: text-3xl, font-bold
 * - md: text-4xl → md:text-5xl, font-bold
 * - lg: text-5xl → md:text-6xl, font-bold
 */
export function Display({ children, size = "md", className }: DisplayProps) {
  return (
    <h1
      className={cn(
        "font-bold leading-tight text-slate-900 dark:text-white",
        size === "sm" && "text-3xl",
        size === "md" && "text-4xl md:text-5xl",
        size === "lg" && "text-5xl md:text-6xl",
        className
      )}
    >
      {children}
    </h1>
  );
}

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
    <h1
      className={cn(
        "text-3xl font-bold text-slate-900 dark:text-white md:text-4xl",
        className
      )}
    >
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
    <h2
      className={cn(
        "text-2xl font-semibold text-slate-800 dark:text-slate-100",
        className
      )}
    >
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
    <h3
      className={cn(
        "text-lg font-semibold text-slate-900 dark:text-white",
        className
      )}
    >
      {children}
    </h3>
  );
}

interface BodyTextProps {
  children: ReactNode;
  variant?: "normal" | "muted";
  className?: string;
}

/**
 * BodyText - Standard paragraph text
 *
 * Variants:
 * - normal: Regular text color (slate-700)
 * - muted: Secondary text color (slate-600)
 */
export function BodyText({
  children,
  variant = "normal",
  className,
}: BodyTextProps) {
  return (
    <p
      className={cn(
        "text-base",
        variant === "normal" && "text-slate-700 dark:text-slate-300",
        variant === "muted" && "text-slate-600 dark:text-slate-400",
        className
      )}
    >
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
    <label
      className={cn(
        "text-sm font-medium text-slate-700 dark:text-slate-300",
        className
      )}
    >
      {children}
      {required && (
        <span className={`ml-1 ${getSemanticClass("danger", "text", true)}`}>
          *
        </span>
      )}
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
    <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)}>
      {children}
    </p>
  );
}

interface MetaTextProps {
  children: ReactNode;
  as?: "span" | "p" | "div";
  className?: string;
}

/**
 * MetaText - Small metadata labels
 *
 * For category tags, timestamps, status labels.
 * Default styling: text-xs, uppercase, tracking-widest, muted color
 */
export function MetaText({ children, as = "p", className }: MetaTextProps) {
  const Component = as;
  return (
    <Component
      className={cn(
        "text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500",
        className
      )}
    >
      {children}
    </Component>
  );
}

interface CaptionProps {
  children: ReactNode;
  variant?: "default" | "error" | "success";
  className?: string;
}

/**
 * Caption - Small descriptive text
 *
 * For captions, small notes, helper text.
 * Variants:
 * - default: Muted text color
 * - error: Red text for errors
 * - success: Green text for success messages
 */
export function Caption({
  children,
  variant = "default",
  className,
}: CaptionProps) {
  return (
    <p
      className={cn(
        "text-xs",
        variant === "default" && "text-slate-500 dark:text-slate-400",
        variant === "error" && getSemanticClass("danger", "text", true),
        variant === "success" && "text-emerald-600 dark:text-emerald-400",
        className
      )}
    >
      {children}
    </p>
  );
}

interface SmallTextProps {
  children: ReactNode;
  variant?: "normal" | "muted";
  weight?: "normal" | "medium" | "semibold" | "bold";
  className?: string;
}

/**
 * SmallText - Small UI text
 *
 * For buttons, links, small UI elements.
 * Size: text-sm
 */
export function SmallText({
  children,
  variant = "normal",
  weight = "normal",
  className,
}: SmallTextProps) {
  return (
    <span
      className={cn(
        "text-sm",
        variant === "normal" && "text-slate-700 dark:text-slate-300",
        variant === "muted" && "text-slate-500 dark:text-slate-400",
        weight === "medium" && "font-medium",
        weight === "semibold" && "font-semibold",
        weight === "bold" && "font-bold",
        className
      )}
    >
      {children}
    </span>
  );
}
