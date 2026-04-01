/**
 * PostStatusDropdown Component
 * FOR-08: Dropdown for changing post status
 */

import { useAppTranslation } from "@/shared/hooks/useAppTranslation";

export function PostStatusDropdown() {
  const { t } = useAppTranslation();

  return (
    <select aria-label={t("forum.admin.postStatus")}>
      <option value="DRAFT">{t("forum.status.draft")}</option>
      <option value="PUBLISHED">{t("forum.status.published")}</option>
      <option value="ARCHIVED">{t("forum.status.archived")}</option>
      {/* TODO: Implement status dropdown */}
    </select>
  );
}
