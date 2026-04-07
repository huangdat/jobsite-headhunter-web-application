/**
 * ContactInfoCard
 * PROF-05: Business Verification Admin Module
 *
 * Displays contact information for business verification
 * - Address with map icon
 * - Contact person info
 * - Submission metadata
 */

import React from "react";
import { MapPin, User, Clock, Mail } from "lucide-react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import type { Business } from "../types";
import { getSemanticClass } from "@/lib/design-tokens";

interface ContactInfoCardProps {
  business: Business;
  submittedAt?: string;
  submittedBy?: string;
  className?: string;
}

export const ContactInfoCard: React.FC<ContactInfoCardProps> = ({
  business,
  submittedAt,
  submittedBy,
  className = "",
}) => {
  const { t } = useAppTranslation();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/40 p-6 backdrop-blur-sm ${className}`}
    >
      {/* Header */}
      <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-4">
        {t("verification.cards.contactInfo.title")}
      </h3>

      {/* Address Section */}
      <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <MapPin
            className="text-slate-400 dark:text-slate-500 shrink-0 mt-1"
            size={18}
          />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
              {t("verification.fields.hqLocation")}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {business.hq?.city}, {business.hq?.country}
            </p>
            {business.hq?.latitude && business.hq?.longitude && (
              <div className="mt-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3 text-xs text-slate-600 dark:text-slate-400">
                <p className="font-medium text-slate-700 dark:text-slate-300">
                  {t("verification.cards.contactInfo.coordinates")}
                </p>
                <p className="mt-1">
                  {business.hq.latitude.toFixed(4)},{" "}
                  {business.hq.longitude.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="space-y-4">
        {/* Email */}
        <div className="flex items-start gap-3">
          <Mail
            className="text-slate-400 dark:text-slate-500 shrink-0 mt-1"
            size={18}
          />
          <div className="flex-1">
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase">
              {t("verification.fields.email")}
            </p>
            <a
              href={`mailto:${business.email}`}
              className={`text-sm font-medium ${getSemanticClass("success", "text", true)} hover:underline`}
            >
              {business.email}
            </a>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <User
            className="text-slate-400 dark:text-slate-500 shrink-0 mt-1"
            size={18}
          />
          <div className="flex-1">
            <p className="text-xs text-slate-600 dark:text-slate-400 uppercase">
              {t("verification.fields.phone")}
            </p>
            <a
              href={`tel:${business.phone}`}
              className="text-sm font-medium text-slate-900 dark:text-slate-50"
            >
              {business.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Submission Info */}
      {(submittedAt || submittedBy) && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-600 uppercase mb-3">
            {t("verification.cards.contactInfo.submissionInfo")}
          </p>
          <div className="space-y-2">
            {submittedAt && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-slate-400" size={16} />
                <span className="text-slate-600">
                  {t("verification.cards.contactInfo.submittedDate")}
                  {": "}
                </span>
                <span className="font-medium">{formatDate(submittedAt)}</span>
              </div>
            )}
            {submittedBy && (
              <div className="flex items-center gap-2 text-sm">
                <User className="text-slate-400" size={16} />
                <span className="text-slate-600">
                  {t("verification.cards.contactInfo.submittedBy")}
                  {": "}
                </span>
                <span className="font-medium">{submittedBy}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
