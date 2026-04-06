/**
 * AutomatedActionItem
 * PROF-05: Business Verification Admin Module
 *
 * Displays a single automated action with:
 * - Status icon (checkmark, spinner, error)
 * - Action type and status
 * - Timestamps
 * - Optional error details
 */

import React from "react";
import { CheckCircle, Circle, AlertCircle, Clock } from "lucide-react";
import type { AutomatedAction } from "../types";

interface AutomatedActionItemProps {
  action: AutomatedAction;
  showDetails?: boolean;
  className?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return {
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
      };
    case "FAILED":
      return { icon: AlertCircle, color: "text-red-600", bgColor: "bg-red-50" };
    default:
      return { icon: Circle, color: "text-amber-600", bgColor: "bg-amber-50" };
  }
};

export const AutomatedActionItem: React.FC<AutomatedActionItemProps> = ({
  action,
  showDetails = false,
  className = "",
}) => {
  const { icon: StatusIcon, color, bgColor } = getStatusIcon(action.status);

  return (
    <div
      className={`rounded-lg border border-slate-200 p-4 ${bgColor} ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <StatusIcon className={`${color} shrink-0 mt-0.5`} size={20} />

        {/* Action Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-slate-900 dark:text-slate-50">
              {action.type}
            </h4>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                action.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : action.status === "FAILED"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {action.status.toLowerCase()}
            </span>
          </div>

          {/* Timeline Info */}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>
                Initiated: {new Date(action.initiatedAt).toLocaleDateString()}
              </span>
            </div>
            {action.completedAt && (
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>
                  Completed: {new Date(action.completedAt).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-slate-300 space-y-1 text-xs">
              <p>
                <span className="text-slate-600">Type:</span>{" "}
                <span className="font-mono text-slate-700">{action.type}</span>
              </p>
              <p>
                <span className="text-slate-600">ID:</span>{" "}
                <span className="font-mono text-slate-700">{action.id}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
