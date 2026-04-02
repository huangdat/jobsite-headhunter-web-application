/**
 * PostMetadata Component
 * FOR-11 AC4: Display post metadata (author, date, category, views)
 * AC4: Fallback data for missing fields
 */

import type { ForumPost } from "@/features/forum/admin/posts/types";
import { useTranslation } from "react-i18next";

interface PostMetadataProps {
  post: ForumPost;
}

export function PostMetadata({ post }: PostMetadataProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-600 mb-4">
        <a href="/" className="hover:text-emerald-600">
          {t("forum.breadcrumb.home") || "TRANG CHỦ"}
        </a>
        {" > "}
        <a href="/news" className="hover:text-emerald-600">
          {t("forum.breadcrumb.news") || "TIN TỨC"}
        </a>
        {" > "}
        <span className="text-slate-900">{post.categoryName || "Tin tức"}</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-slate-900 mb-4">{post.title}</h1>

      {/* Metadata Row */}
      <div className="flex items-center gap-6 text-sm text-slate-600">
        {/* Author */}
        <div className="flex items-center gap-2">
          <span className="text-lg">👤</span>
          <span>
            {post.createdByName || t("forum.default.author") || "Admin"}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <span>
            {new Date(post.createdAt).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* View Count - AC4: Fallback to 0 */}
        <div className="flex items-center gap-2">
          <span className="text-lg">👁️</span>
          <span>
            {post.viewCount ?? 0} {t("forum.detail.views") || "lượt xem"}
          </span>
        </div>

        {/* Category Badge */}
        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
          {post.categoryName || t("forum.default.category") || "Tin tức"}
        </span>
      </div>
    </div>
  );
}
