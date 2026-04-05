/**
 * VerificationListPage
 * PROF-05: Business Verification Admin Module - Page 1
 * URL: /admin/verifications
 *
 * Displays list of pending business verifications with KPIs and recent activity
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import { useVerifications, useVerificationFilters } from "../hooks";
import type { Verification } from "../types";
import {
  VerificationStatsCard,
  VerificationQueueCard,
  EmptyStateView,
} from "../components";
import { Search, Filter, AlertCircle } from "lucide-react";

export const VerificationListPage: React.FC = () => {
  const { t } = useAppTranslation();
  const navigate = useNavigate();

  // Fetch verifications with filters
  const { verifications, stats, isLoading, pagination, handlePageChange } =
    useVerifications(true);

  // Manage search and filter UI state
  const { searchTerm, setSearchTerm, toggleFilters } =
    useVerificationFilters(500);

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFilters}
          className="gap-2"
        >
          <Filter size={16} />
          {t("verification.pages.list.filter")}
        </Button>
      </div>

      {/* STATS CARD */}
      {stats && <VerificationStatsCard stats={stats} isLoading={isLoading} />}

      {/* VERIFICATIONS GRID */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : verifications.length === 0 ? (
        <EmptyStateView
          icon={AlertCircle}
          title={t("verification.pages.list.noResults")}
          description={t("verification.pages.list.noResultsDescription")}
        />
      ) : (
        <div className="space-y-4 mb-8">
          {verifications.map((verification: Verification) => (
            <VerificationQueueCard
              key={verification.id}
              verification={verification}
              onClick={() => handleCardClick(verification)}
            />
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
