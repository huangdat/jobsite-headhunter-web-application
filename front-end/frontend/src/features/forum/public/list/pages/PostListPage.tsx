/**
 * PostListPage
 * FOR-10: Public page displaying list of forum posts
 */

import { FeaturedSection } from "../components/FeaturedSection";
import { PostGrid } from "../components/PostGrid";
import { PostFilters } from "../components/PostFilters";
import { PostPagination } from "../components/PostPagination";
import { useTranslation } from "react-i18next";
import { PageContainer, PageHeader } from "@/shared/common-blocks/layout";

export function PostListPage() {
  const { t } = useTranslation();

  return (
    <PageContainer variant="white">
      <PageHeader
        variant="bordered"
        title={t("forum.list.title") || "Diễn Đàn Cập Nhật"}
        description={
          t("forum.list.subtitle") ||
          "Không bỏ lỡ cập nhật mới nhất trong cộng đồng"
        }
      />

      <FeaturedSection />
      <PostFilters />
      <PostGrid />
      <PostPagination />
    </PageContainer>
  );
}

