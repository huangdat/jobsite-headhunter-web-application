import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ContentSectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * ContentSection - Semantic section wrapper for page content areas
 *
 * Use this to separate logical sections on a page with consistent spacing.
 *
 * Features:
 * - Optional section title & description
 * - Configurable bottom margin (sm: 24px, md: 32px, lg: 48px)
 * - Semantic HTML <section> tag
 * - Consistent typography
 *
 * @example
 * ```tsx
 * <ContentSection
 *   title="Recent Jobs"
 *   description="Latest job postings"
 *   spacing="lg"
 * >
 *   <JobGrid jobs={jobs} />
 * </ContentSection>
 * ```
 */
export function ContentSection({
  children,
  title,
  description,
  spacing = "md",
  className,
}: ContentSectionProps) {
  return (
    <section
      className={cn(
        spacing === "sm" && "mb-6",
        spacing === "md" && "mb-8",
        spacing === "lg" && "mb-12",
        className
      )}
    >
      {(title || description) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
