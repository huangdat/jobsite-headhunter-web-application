/**
 * AutomatedActionsList
 * PROF-05: Business Verification Admin Module
 *
 * Composite component displaying list of automated actions
 * Uses AutomatedActionItem for individual actions
 */

import React from "react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { SectionCard } from "./SectionCard";
import { AutomatedActionItem } from "./AutomatedActionItem";
import type { AutomatedAction } from "../types";
import { Zap } from "lucide-react";

interface AutomatedActionsListProps {
  actions: AutomatedAction[];
  isLoading?: boolean;
  showDetails?: boolean;
  className?: string;
}

export const AutomatedActionsList: React.FC<AutomatedActionsListProps> = ({
  actions,
  isLoading = false,
  showDetails = false,
  className = "",
}) => {
  const { t } = useAppTranslation();

  return (
    <SectionCard
      title={t("verification.cards.approvalDetails.automatedActions")}
      icon={Zap}
      className={className}
      isLoading={isLoading}
    >
      <div className="space-y-3">
        {actions.length === 0 ? (
          <p className="text-sm text-slate-500">
            {t("verification.automation.noActions")}
          </p>
        ) : (
          actions.map((action) => (
            <AutomatedActionItem
              key={action.id}
              action={action}
              showDetails={showDetails}
            />
          ))
        )}
      </div>
    </SectionCard>
  );
};
