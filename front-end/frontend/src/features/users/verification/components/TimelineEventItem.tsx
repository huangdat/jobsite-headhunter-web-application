/**
 * TimelineEventItem
 * PROF-05: Business Verification Admin Module
 *
 * Displays a single timeline event with:
 * - Dot indicator
 * - Connection line
 * - Event type, timestamp, actor
 * - Description
 */

import React from "react";
import type { TimelineEvent } from "../types";

interface TimelineEventItemProps {
  event: TimelineEvent;
  isLast?: boolean;
  dotColor?: string;
}

export const TimelineEventItem: React.FC<TimelineEventItemProps> = ({
  event,
  isLast = false,
  dotColor = "bg-green-600",
}) => {
  return (
    <div className="relative pb-4">
      {/* Connection Line */}
      {!isLast && (
        <div className="absolute left-2 top-6 bottom-0 w-0.5 bg-slate-200" />
      )}

      {/* Event Content */}
      <div className="flex gap-4">
        {/* Dot Indicator */}
        <div className={`w-5 h-5 rounded-full ${dotColor} shrink-0 mt-1`} />

        {/* Event Details */}
        <div className="flex-1">
          <p className="font-semibold text-sm text-slate-900 dark:text-slate-50">
            {event.eventType}
          </p>
          <p className="text-xs text-slate-600 mt-1">
            {new Date(event.timestamp).toLocaleString()}
            {event.actor && ` - ${event.actor}`}
          </p>
          {event.description && (
            <p className="text-sm text-slate-700 mt-1">{event.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};
