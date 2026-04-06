import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getDarkClasses } from "@/lib/theme-classes";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Breadcrumb Navigation Component
 * Displays breadcrumb trail with proper i18n support and dark mode
 *
 * @example
 * ```tsx
 * <Breadcrumb items={[
 *   { label: t('breadcrumb.jobs'), href: '/jobs' },
 *   { label: job.title }
 * ]} />
 * ```
 */
export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const { t } = useTranslation();

  return (
    <nav
      className={`flex items-center gap-2 text-sm ${getDarkClasses("text-slate-600", "text-slate-400")} ${className}`}
      aria-label={t("breadcrumb.navigation") || "Breadcrumb"}
    >
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {/* Link or Text */}
          {item.href ? (
            <Link
              to={item.href}
              className={`transition-colors ${getDarkClasses("hover:text-slate-900", "hover:text-slate-100")}`}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={getDarkClasses("text-slate-900", "text-slate-100")}
            >
              {item.label}
            </span>
          )}

          {/* Separator (except last item) */}
          {index < items.length - 1 && <ChevronRight className="w-4 h-4" />}
        </div>
      ))}
    </nav>
  );
}

export default Breadcrumb;
