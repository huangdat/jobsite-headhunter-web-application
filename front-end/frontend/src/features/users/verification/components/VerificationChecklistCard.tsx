/**
 * VerificationChecklistCard
 * PROF-05: Business Verification Admin Module
 *
 * Displays verification checklist with progress tracking
 * - Items with checkmarks
 * - Progress bar
 * - Completion percentage
 * - Item descriptions and notes
 */

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import type { ChecklistItem } from "../types";

interface VerificationChecklistCardProps {
  items: ChecklistItem[];
  className?: string;
}

export const VerificationChecklistCard: React.FC<
  VerificationChecklistCardProps
> = ({ items, className = "" }) => {
  const { t } = useAppTranslation();

  const completedCount = items.filter((item) => item.isCompleted).length;
  const totalCount = items.length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white/50 p-6 backdrop-blur-sm ${className}`}
    >
      {/* Header with Progress */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
          {t("verification.cards.checklist.title")}
        </h3>

        {/* Progress Bar */}
        <div className="bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
          <div
            className="h-full bg-linear-to-r from-lime-500 to-lime-400 transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        {/* Progress Text */}
        <p className="text-sm text-slate-600">
          {completedCount}/{totalCount}{" "}
          {t("verification.cards.checklist.completed")} ({completionPercentage}
          %)
        </p>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("verification.cards.checklist.noItems")}
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              {/* Checkbox Icon */}
              <div className="mt-1 shrink-0">
                {item.isCompleted ? (
                  <CheckCircle2
                    className={`${getSemanticClass("success", "icon", true)}`}
                    size={20}
                  />
                ) : (
                  <Circle className="text-slate-300" size={20} />
                )}
              </div>

              {/* Item Details */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium text-sm ${
                    item.isCompleted
                      ? "line-through text-slate-500"
                      : "text-slate-900"
                  }`}
                >
                  {item.title}
                </p>

                {item.description && (
                  <p className="text-xs text-slate-600 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completion Summary */}
      {completionPercentage === 100 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div
            className={`flex items-center gap-2 text-sm ${getSemanticClass("success", "text", true)} ${getSemanticClass("success", "bg", true)} rounded-lg p-3 text-white`}
          >
            <CheckCircle2
              size={18}
              className={getSemanticClass("success", "icon", true)}
            />
            <span
              className={`font-medium ${getSemanticClass("success", "text", true)}`}
            >
              {t("verification.cards.checklist.allItemsComplete")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
