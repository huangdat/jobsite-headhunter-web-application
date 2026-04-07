/**
 * PostMetadata Component
 * FOR-11 AC4: Display post metadata (author, date, category, views)
 * AC4: Fallback data for missing fields
 */

import type { ForumPost } from "@/features/forum/admin/posts/types";
import { useTranslation } from "react-i18next";
import { Display, SmallText } from "@/shared/common-blocks/typography/Typography";

interface PostMetadataProps {
  post: ForumPost;
}

export function PostMetadata({ post }: PostMetadataProps) {
  const { t } = useTranslation();

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <SmallText variant="muted" className="mb-4 block">
        <a href="/" className="hover:text-brand-primary">
          {t("forum.breadcrumb.home") || "TRANG CHỦ"}
        </a>
        {" > "}
        <a href="/news" className="hover:text-brand-primary">
          {t("forum.breadcrumb.news") || "TIN TỨC"}
        </a>
        {" > "}
        <span className="text-slate-900 dark:text-slate-50">
          {post.categoryName || "Tin tức"}
        </span>
      </SmallText>

      {/* Title */}
      <Display className="mb-4">{post.title}</Display>

      {/* Metadata Row */}
      <div className="flex items-center gap-6">
        {/* Author */}
        <div className="flex items-center gap-2">
          <span className="text-lg">👤</span>
          <SmallText variant="muted">
            {post.createdByName || t("forum.default.author") || "Admin"}
          </SmallText>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <span className="text-lg">📅</span>
          <SmallText variant="muted">
            {new Date(post.createdAt).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </SmallText>
        </div>

        {/* View Count - AC4: Fallback to 0 */}
        <div className="flex items-center gap-2">
          <span className="text-lg">👁️</span>
          <SmallText variant="muted">
            {post.viewCount ?? 0} {t("forum.detail.views") || "lượt xem"}
          </SmallText>
        </div>

        {/* Category Badge */}
        <span className="bg-brand-primary/10 text-brand-primary px-3 py-1 rounded-full text-xs font-bold border border-brand-primary/20">
          {post.categoryName || t("forum.default.category") || "Tin tức"}
        </span>
      </div>
    </div>
  );
}

