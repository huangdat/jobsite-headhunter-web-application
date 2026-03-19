import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserClassification } from "../hooks/useUserClassification";
import { UserClassificationOverview } from "../components/UserClassificationOverview";
import { useUsersTranslation } from "@/shared/hooks";

/**
 * User Classification Page component.
 *
 * Displays users grouped by Role, Status, Company, or Created Month
 * with detailed statistics and interactive collapse/expand functionality.
 *
 * Acceptance Criteria Implementation:
 * AC1: Successful classification - Group By Role/Status/Company/Created Month with collapse/expand
 * AC2: Group statistics - Header displays count, %, Active/Inactive breakdown
 */
export const UserClassificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useUsersTranslation();
  const {
    groups,
    overviewStats,
    loading,
    error,
    groupBy,
    setGroupBy,
    toggleGroup,
    expandAll,
    collapseAll,
    refetch,
  } = useUserClassification();

  const handleViewDetails = useCallback(
    (userId: string) => {
      navigate(`/users/${userId}`);
    },
    [navigate]
  );

  const handleRetry = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <main className="flex-1 flex flex-col overflow-y-auto">
      {/* Content Area */}
      <div className="p-8 max-w-7xl mx-auto w-full">
        {/* Page Introduction */}
        <div className="flex justify-between items-center mb-6 mt-2">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {t("classification.pageTitle")}
            </h1>
            <p className="text-sm text-slate-500">
              {t("classification.description")}
            </p>
          </div>
        </div>

        {/* Classification Overview */}
        <UserClassificationOverview
          groups={groups}
          overviewStats={overviewStats}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          onToggleGroup={toggleGroup}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          onViewDetails={handleViewDetails}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      </div>
    </main>
  );
};
