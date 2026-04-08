/**
 * BusinessDetailView
 * PROF-05: Business Verification Admin Module
 *
 * Container component for organizing and displaying all business-related details
 * Uses BusinessInfoCard for each section:
 * - Company Identity (name, tax ID, industry, year)
 * - Operations & Contact (website, email, phone, employee count, location)
 */

import React from "react";
import { Globe, Mail, Phone, Users, MapPin, Building2 } from "lucide-react";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { BusinessInfoCard, InfoRow } from "./BusinessInfoCard";
import type { Business } from "../types";

interface BusinessDetailViewProps {
  business: Business;
  className?: string;
}

export const BusinessDetailView: React.FC<BusinessDetailViewProps> = ({
  business,
  className = "",
}) => {
  const { t } = useAppTranslation();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Company Identity Card */}
      <BusinessInfoCard
        title={t("verification.cards.businessIdentity.title")}
        icon={Building2}
      >
        <InfoRow
          label={t("verification.fields.companyName")}
          value={business.companyName}
        />
        <InfoRow
          label={t("verification.fields.taxId")}
          value={business.taxId}
        />
        <InfoRow
          label={t("verification.fields.industry")}
          value={business.industry}
        />
        <InfoRow
          label={t("verification.fields.yearEstablished")}
          value={business.yearEstablished?.toString() || "-"}
        />
      </BusinessInfoCard>

      {/* Operations & Contact Card */}
      <BusinessInfoCard
        title={t("verification.cards.operationsContact.title")}
        icon={Globe}
      >
        <InfoRow
          icon={Globe}
          label={t("verification.fields.website")}
          value={
            <a
              href={business.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime-600 hover:underline"
            >
              {business.website}
            </a>
          }
        />
        <InfoRow
          icon={Mail}
          label={t("verification.fields.email")}
          value={business.email}
        />
        <InfoRow
          icon={Phone}
          label={t("verification.fields.phone")}
          value={business.phone}
        />
        <InfoRow
          icon={Users}
          label={t("verification.fields.employeeCount")}
          value={business.employeeCount?.toString() || "-"}
        />
        <InfoRow
          icon={MapPin}
          label={t("verification.fields.hqLocation")}
          value={
            <div className="text-right">
              <div>{business.hq?.city}</div>
              <div className="text-xs text-slate-500">
                {business.hq?.country}
              </div>
            </div>
          }
        />
      </BusinessInfoCard>
    </div>
  );
};
