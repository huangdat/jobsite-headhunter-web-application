/**
 * VerificationListPage
 * PROF-05: Business Verification Admin Module - Page 1
 * URL: /admin/verifications
 *
 * Displays list of pending business verifications with KPIs and recent activity
 */

import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import { useVerifications } from "../hooks";
import type { Verification } from "../types";
import { Search, Filter, AlertCircle, Calendar } from "lucide-react";

export const VerificationListPage: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Fetch verifications with filters
  const { verifications, stats, isLoading, pagination, handlePageChange } =
    useVerifications(true);

  /**
   * Handle search - debounced filter
   */
  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value);
    // TODO: Implement search filtering in Phase 3
  }, []);

  /**
   * Handle verification card click - navigate to detail
   */
  const handleCardClick = (verification: Verification) => {
    navigate(`/admin/verifications/${verification.id}`);
  };

  return (
    <PageContainer variant="default" maxWidth="6xl">
      {/* HEADER */}
      <PageHeader
        variant="default"
        title={t("verification.pages.list.title")}
        description={t("verification.pages.list.subtitle")}
      />

      {/* SEARCH & FILTER BAR */}
      <div className="flex gap-2 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <Input
            placeholder={t("verification.pages.list.search")}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter size={16} />
          {t("verification.pages.list.filter")}
        </Button>
      </div>

      {/* STATS CARD */}
      {stats && (
        <div className="bg-slate-900 text-white rounded-xl p-6 mb-8 grid grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-slate-400 mb-1">
              {t("verification.cards.stats.pending")}
            </div>
            <div className="text-3xl font-bold">{stats.currentPending}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">
              {t("verification.cards.stats.approved")}
            </div>
            <div className="text-3xl font-bold">{stats.totalApproved}</div>
          </div>
          <div>
            <div className="text-sm text-slate-400 mb-1">
              {t("verification.cards.stats.completionRate")}
            </div>
            <div className="text-3xl font-bold">{stats.approvalRate}%</div>
          </div>
        </div>
      )}

      {/* VERIFICATIONS GRID */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : verifications.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl text-slate-400">
          <AlertCircle className="mx-auto mb-4 opacity-20" size={40} />
          <p className="text-lg">{t("verification.pages.list.noResults")}</p>
          <p className="text-sm mt-2">
            {t("verification.pages.list.noResultsDescription")}
          </p>
        </div>
      ) : (
        <div className="space-y-4 mb-8">
          {verifications.map((verification: Verification) => (
            <div
              key={verification.id}
              onClick={() => handleCardClick(verification)}
              className="group p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">
                    {verification.business.companyName}
                  </h3>
                  <div className="text-sm text-slate-600 mt-1 space-y-1">
                    <p>
                      {t("verification.fields.taxId")}:{" "}
                      {verification.business.taxId}
                    </p>
                    <p className="flex items-center gap-2 mt-2">
                      <Calendar size={14} />
                      {t("verification.cards.queueItem.submitted")}{" "}
                      {new Date(verification.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      verification.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {t(
                      verification.status === "PENDING"
                        ? "verification.status.pending"
                        : "verification.status.approved"
                    )}
                  </div>
                  <div className="text-sm text-slate-600 mt-2">
                    {verification.complianceScore}%{" "}
                    {t("verification.fields.complianceScore")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION (if needed) */}
      {!isLoading && verifications.length > 0 && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={pagination.page === i ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(i)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
