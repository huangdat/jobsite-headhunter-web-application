import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserClassification } from "@/features/users/classification/hooks/useUserClassification";
import { UserClassificationOverview } from "@/features/users/classification/components/UserClassificationOverview";
import { useUsersTranslation } from "@/shared/hooks";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";

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
      navigate(`/admin/users/${userId}`);
    },
    [navigate]
  );

  const handleRetry = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return (
    <PageContainer variant="default" maxWidth="7xl">
      <PageHeader
        variant="default"
        title={t("classification.pageTitle")}
        description={t("classification.description")}
      />

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
    </PageContainer>
  );
};

