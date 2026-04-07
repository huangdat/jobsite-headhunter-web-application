/**
 * PageLoader Component
 * Loading fallback for lazy-loaded route components
 * Provides smooth loading experience during code splitting
 */

import { Loader } from "lucide-react";
import { getSemanticClass } from "@/lib/design-tokens";

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader
          className={`w-12 h-12 ${getSemanticClass("info", "icon", true)} animate-spin`}
        />
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Compact loader for component-level lazy loading
 */
export function ComponentLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-2">
        <Loader
          className={`w-8 h-8 ${getSemanticClass("info", "icon", true)} animate-spin`}
        />
        <p className="text-gray-500 text-sm">Loading component...</p>
      </div>
    </div>
  );
}
