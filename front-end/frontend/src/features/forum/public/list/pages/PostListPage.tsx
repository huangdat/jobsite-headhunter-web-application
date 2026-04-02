/**
 * PostListPage
 * FOR-10: Public page displaying list of forum posts
 */

import { FeaturedSection } from "../components/FeaturedSection";
import { PostGrid } from "../components/PostGrid";
import { PostFilters } from "../components/PostFilters";
import { PostPagination } from "../components/PostPagination";
import { useTranslation } from "react-i18next";

export function PostListPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-8">
          <h1 className="text-4xl font-bold text-slate-900">
            {t("forum.list.title") || "Diễn Đàn Cập Nhật"}
          </h1>
          <p className="text-slate-600 mt-2">
            {t("forum.list.subtitle") ||
              "Không bỏ lỡ cập nhật mới nhất trong cộng đồng"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <FeaturedSection />
        <PostFilters />
        <PostGrid />
        <PostPagination />
      </div>
    </div>
  );
}
