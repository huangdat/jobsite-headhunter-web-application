import React, { type ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui-primitives/button";
import { cn } from "@/lib/utils";
import { getSemanticClass } from "@/lib/design-tokens";

// Development mode detection - works in Vite and browser
const isDevelopment = !import.meta.env.PROD;

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Global error boundary for catching React component errors
 *
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 *
 * Features:
 * - Graceful error recovery with reset button
 * - Custom fallback UI support
 * - Dark mode support
 * - Development error details (in dev mode)
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (isDevelopment) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div
          className={cn(
            "flex items-center justify-center min-h-screen",
            "bg-linear-to-br from-slate-50 to-slate-100",
            "dark:from-slate-950 dark:to-slate-900"
          )}
        >
          <div
            className={cn(
              "max-w-md w-full mx-4",
              "rounded-xl border",
              "border-slate-200 dark:border-slate-700",
              "bg-white dark:bg-slate-800",
              "p-8 shadow-lg"
            )}
          >
            <div className="flex justify-center mb-4">
              <div
                className={cn(
                  "p-3 rounded-full",
                  getSemanticClass("danger", "bg", true)
                )}
              >
                <AlertCircle
                  className={cn(
                    "w-8 h-8",
                    getSemanticClass("danger", "icon", true)
                  )}
                />
              </div>
            </div>

            <h1
              className={cn(
                "text-lg font-semibold text-center mb-2",
                "text-slate-900 dark:text-slate-50"
              )}
            >
              Oops! Something went wrong
            </h1>

            <p
              className={cn(
                "text-sm text-center mb-4",
                "text-slate-600 dark:text-slate-400"
              )}
            >
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>

            {isDevelopment && (
              <div
                className={cn(
                  "p-3 rounded-lg mb-6",
                  "bg-slate-50 dark:bg-slate-900",
                  "border border-slate-200 dark:border-slate-700"
                )}
              >
                <p
                  className={cn(
                    "text-xs font-mono",
                    "text-slate-700 dark:text-slate-300",
                    "wrap-break-word"
                  )}
                >
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={this.handleReset}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={() => (window.location.href = "/")}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

