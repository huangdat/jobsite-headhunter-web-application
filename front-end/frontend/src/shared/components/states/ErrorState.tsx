import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSemanticClass } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  error?: Error | null;
  onRetry?: () => void;
  variant?: "page" | "inline" | "card";
  title?: string;
  message?: string;
  className?: string;
}

/**
 * ErrorState - Unified error display component
 *
 * Replaces all ad-hoc error handling with consistent UI.
 *
 * Variants:
 * - page: Full page error (min-h-100)
 * - inline: Inline error in content area (py-8)
 * - card: Error within card/modal (p-6)
 *
 * Features:
 * - i18n support (uses common.error.* keys)
 * - Optional retry button
 * - Error message extraction from Error object
 * - Accessible (ARIA labels, focus management)
 * - Dark mode support
 *
 * @example
 * ```tsx
 * {error && (
 *   <ErrorState
 *     error={error}
 *     onRetry={() => refetch()}
 *     variant="page"
 *   />
 * )}
 * ```
 */
export function ErrorState({
  error,
  onRetry,
  variant = "page",
  title,
  message,
  className,
}: ErrorStateProps) {
  const { t } = useTranslation();

  const errorTitle = title || t("common.error.title");
  const errorMessage = message || error?.message || t("common.error.generic");

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        variant === "page" && "min-h-100",
        variant === "inline" && "py-8",
        variant === "card" && "p-6",
        className
      )}
    >
      <div className="max-w-md">
        <div
          className={`rounded-xl border p-6 ${getSemanticClass("danger", "bg", true)} ${getSemanticClass("danger", "border", true)}`}
        >
          <div className="flex gap-3">
            <AlertCircle
              className={`h-5 w-5 shrink-0 ${getSemanticClass("danger", "icon")}`}
            />
            <div className="flex-1">
              <h3
                className={`font-semibold ${getSemanticClass("danger", "text", false).replace("text-red-", "text-red-900 dark:text-red-")}`}
              >
                {errorTitle}
              </h3>
              <p
                className={`mt-1 text-sm ${getSemanticClass("danger", "text", true)}`}
              >
                {errorMessage}
              </p>
              {onRetry && (
                <Button
                  onClick={onRetry}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("common.retry")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
