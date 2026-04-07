/**
 * CVEmptyState Component
 * Displays empty state when no CVs have been uploaded
 */

import React from "react";
import { useCandidateTranslation } from "@/shared/hooks";
import { Button } from "@/components/ui/button";
import { getSemanticClass } from "@/lib/design-tokens";
import type { CVEmptyStateProps } from "../types";
import {
  SectionTitle,
  BodyText,
  Caption,
  MetaText,
} from "@/shared/components/typography/Typography";

export const CVEmptyState: React.FC<CVEmptyStateProps> = ({ onUpload }) => {
  const { t } = useCandidateTranslation();

  return (
    <div className="space-y-6">
      {/* Main Empty State Card */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-12 text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-primary-container rounded-2xl flex items-center justify-center">
            <span className={`material-symbols-outlined ${getSemanticClass("success", "text", true)} text-4xl fill`}>
              description
            </span>
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <SectionTitle>{t("cv.management.empty.headline")}</SectionTitle>
          <BodyText variant="muted" className="max-w-md mx-auto">
            {t("cv.management.empty.description")}
          </BodyText>
        </div>

        {/* CTA Button */}
        <Button onClick={onUpload} className="inline-flex items-center gap-2">
          <span className="material-symbols-outlined mr-2">upload</span>
          {t("cv.management.empty.button")}
        </Button>

        {/* Supported Formats Info */}
        <Caption>{t("cv.management.empty.supported")}</Caption>
      </div>

      {/* Bottom Info Section - 2 Columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Privacy Control */}
        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${getSemanticClass("success", "text", true)} text-lg fill`}>
              security
            </span>
            <MetaText as="span">
              {t("cv.management.bestPractices.privacyTitle")}
            </MetaText>
          </div>

          <BodyText variant="muted">{t("tips.privacyTip1")}</BodyText>

          <ul className="space-y-2">
            {([] as string[])?.map((item: string, index: number) => (
              <li key={index} className="flex gap-2">
                <span className={`${getSemanticClass("success", "text", false)} shrink-0 text-sm`}>→</span>
                <Caption>{item}</Caption>
              </li>
            ))}
          </ul>
        </div>

        {/* Best Practices */}
        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`material-symbols-outlined ${getSemanticClass("success", "text", true)} text-lg fill`}>
              verified_user
            </span>
            <MetaText as="span">
              {t("cv.management.bestPractices.practicesTitle")}
            </MetaText>
          </div>

          <ul className="space-y-2">
            <li className="flex gap-2">
              <span className={`${getSemanticClass("success", "text", true)} font-bold shrink-0 text-sm`}>
                •
              </span>
              <Caption>{t("tips.privacyTip2")}</Caption>
            </li>
            <li className="flex gap-2">
              <span className={`${getSemanticClass("success", "text", true)} font-bold shrink-0 text-sm`}>
                •
              </span>
              <Caption>{t("tips.privacyTip3")}</Caption>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CVEmptyState;
