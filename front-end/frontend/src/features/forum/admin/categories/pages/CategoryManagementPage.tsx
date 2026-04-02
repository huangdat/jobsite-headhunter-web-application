/**
 * CategoryManagementPage
 * FOR-01 to FOR-05: Admin page for managing forum categories
 */

import { useTranslation } from "react-i18next";
import { CategoryList } from "../components/CategoryList";

export function CategoryManagementPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-Bold">
          {t("forum.categories.title") || "Category Management"}
        </h1>
        <p className="text-slate-600 mt-2">
          {t("forum.categories.description") ||
            "Configure and manage your discussion architecture. Use the high-priority tools to toggle visibility or refine content structures."}
        </p>
      </div>

      {/* Category List */}
      <CategoryList />
    </div>
  );
}
