import React from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { PageContainer, PageHeader } from "@/shared/components/layout";
import { PageSkeleton } from "@/shared/components/states";
import { Breadcrumb } from "@/shared/components/navigation/Breadcrumb";
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
      {/* BREADCRUMBS */}
      <Breadcrumb
        items={[
          { label: t("breadcrumb.admin") || "Admin", href: "/admin" },
          { label: t("breadcrumb.verifications") || "Verifications" },
        ]}
        className="mb-6"
      />

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
      {isLoading && <PageSkeleton variant="list" count={3} />}

      {!isLoading && verifications.length === 0 && (
        <EmptyStateView
          icon={AlertCircle}
          title={t("verification.pages.list.noResults")}
          description={t("verification.pages.list.noResultsDescription")}
        />
      )}

      {!isLoading && verifications.length > 0 && (
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
