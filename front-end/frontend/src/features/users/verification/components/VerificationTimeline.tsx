/**
 * VerificationTimeline
 * PROF-05: Business Verification Admin Module
 *
 * Composite component displaying full timeline of verification events
 * Uses TimelineEventItem for individual events
 */

import React from "react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { SectionCard } from "./SectionCard";
import { TimelineEventItem } from "./TimelineEventItem";
import type { TimelineEvent } from "../types";
import { Clock } from "lucide-react";

interface VerificationTimelineProps {
  events: TimelineEvent[];
  isLoading?: boolean;
  className?: string;
}

export const VerificationTimeline: React.FC<VerificationTimelineProps> = ({
  events,
  isLoading = false,
  className = "",
}) => {
  const { t } = useAppTranslation();

  return (
    <SectionCard
      title={t("verification.timeline.title")}
      icon={Clock}
      className={className}
      isLoading={isLoading}
    >
      <div className="space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("verification.timeline.noEvents")}
          </p>
        ) : (
          events.map((event, idx) => (
            <TimelineEventItem
              key={event.id}
              event={event}
              isLast={idx === events.length - 1}
            />
          ))
        )}
      </div>
    </SectionCard>
  );
};
