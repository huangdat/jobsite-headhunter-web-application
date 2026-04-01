/**
 * CommissionProfilePage
 * PROF-04: Collaborator Commission
 * Main page for collaborative commission profile management
 */

import React from "react";
import { useCommissionTranslation, useCommonTranslation } from "@/shared/hooks";
import {
  CommissionForm,
  CommissionStats,
  CommissionBenefits,
} from "../components";
import { useCommissionManagement } from "../hooks/useCommissionManagement";

/**
 * CommissionProfilePage Component
 * Displays commission profile with three main sections:
 * - Form (left: 8 columns): Personal and banking information
 * - Stats sidebar (right: 4 columns): Commission statistics
 * - Benefits section: Referral program benefits and FAQ
 */
export function CommissionProfilePage() {
  const { t: commissionT } = useCommissionTranslation();
  const { t: tCommon } = useCommonTranslation();

  const { stats, requestPayout, loading } = useCommissionManagement();

  // Set page title
  React.useEffect(() => {
    document.title = `${commissionT("page.title")} - HeadHunt`;
  }, [commissionT]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{tCommon("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm mb-4">
            <a href="/" className="text-slate-600 hover:text-slate-900">
              {tCommon("breadcrumb.home")}
            </a>
            <span className="text-slate-400">/</span>
            <span className="text-slate-900">
              {commissionT("breadcrumb.commission")}
            </span>
          </nav>

          {/* Page Title */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <span className="material-symbols-outlined text-emerald-600">
                trending_up
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {commissionT("page.title")}
              </h1>
              <p className="text-slate-600 mt-1">
                {commissionT("page.subtitle")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <CommissionBenefits />
        </div>
      </div>
    </div>
  );
}
