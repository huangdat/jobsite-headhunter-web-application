/**
 * CommissionProfilePage
 * PROF-04: Collaborator Commission
 * Main page for collaborative commission profile management
 */

import React from "react";
import { useCommissionTranslation } from "@/shared/hooks/useFeatureTranslation";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import {
  CommissionForm,
  CommissionStats,
  CommissionBenefits,
} from "../components";
import { useCommissionManagement } from "../hooks/useCommissionManagement";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import { PageSkeleton } from "@/shared/components/states";

/**
 * CommissionProfilePage Component
 * Displays commission profile with three main sections:
 * - Form (left: 8 columns): Personal and banking information
 * - Stats sidebar (right: 4 columns): Commission statistics
 * - Benefits section: Referral program benefits and FAQ
 */
export function CommissionProfilePage() {
  const { t: commissionT } = useCommissionTranslation();
  const { t: tCommon } = useAppTranslation();

  const { stats, requestPayout, loading } = useCommissionManagement();

  // Set page title
  React.useEffect(() => {
    document.title = `${commissionT("page.title")} - HeadHunt`;
  }, [commissionT]);

  if (loading) {
    return (
      <PageContainer variant="white">
        <PageSkeleton variant="grid" count={2} />
      </PageContainer>
    );
  }

  return (
    <PageContainer variant="white">
      <PageHeader
        variant="bordered"
        title={commissionT("page.title")}
        description={commissionT("page.subtitle")}
        breadcrumbs={[
          { label: tCommon("breadcrumb.home"), href: "/" },
          { label: commissionT("breadcrumb.commission") },
        ]}
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form Section (8 columns) */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-8">
              <CommissionForm />
            </div>
          </div>
        </div>

        {/* Sidebar Section (4 columns) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {commissionT("section.earnings")}
            </h2>
            <CommissionStats stats={stats} onRequestPayout={requestPayout} />
          </div>
        </div>
      </div>

      {/* Benefits Section - Full Width */}
      <div className="mt-12 bg-white dark:bg-gray-900 rounded-lg shadow p-8">
        <CommissionBenefits />
      </div>
    </PageContainer>
  );
}
