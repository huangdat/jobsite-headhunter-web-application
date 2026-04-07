/**
 * CategoryManagementPage
 * FOR-01 to FOR-05: Admin page for managing forum categories
 */

import { useTranslation } from "react-i18next";
import { CategoryList } from "../components/CategoryList";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";

export function CategoryManagementPage() {
  const { t } = useTranslation();

  return (
    <PageContainer variant="white">
      <PageHeader
        variant="default"
        title={t("forum.categories.title") || "Category Management"}
        description={
          t("forum.categories.description") ||
          "Configure and manage your discussion architecture. Use the high-priority tools to toggle visibility or refine content structures."
        }
      />

      {/* Category List */}
      <CategoryList />
    </PageContainer>
  );
}

