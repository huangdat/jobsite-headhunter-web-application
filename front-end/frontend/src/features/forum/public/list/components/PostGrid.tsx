/**
 * PostGrid Component
 * FOR-10 AC4/AC5: Display forum posts in grid layout
 * AC4: Empty state with message and retry button
 * AC5: Loading state with spinner and text
 */

import { MessageCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePostList } from "../hooks/usePostList";
import { Button } from "@/shared/ui-primitives/button";
import { useTranslation } from "react-i18next";
import { ErrorState } from "@/shared/common-blocks/states/ErrorState";
import {
  BodyText,
  MetaText,
  SubsectionTitle,
  SmallText,
  Caption,
} from "@/shared/common-blocks/typography/Typography";

export function PostGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { posts, isLoading, isEmpty, isError, error } = usePostList();

  // Error state
  if (isError) {
    return (
      <ErrorState
        error={error || undefined}
        onRetry={() => window.location.reload()}
        variant="inline"
        title={t("forum.list.errorTitle") || "Không thể tải tin tức"}
        message={
          error?.message ||
          t("forum.list.errorMessage") ||
          "Đã xảy ra lỗi khi tải tin tức. Vui lòng thử lại."
        }
      />
    );
  }

  // AC5: Show loading spinner
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-3" />
        <BodyText variant="muted">
          {t("forum.list.loading") || "Đang tải tin tức..."}
        </BodyText>
      </div>
    );
  }

  // AC4: Empty state
  if (isEmpty) {
    return (
      <div className="py-12 text-center">
        <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <BodyText variant="muted" className="mb-4">
          {t("forum.list.noResults") || "Không tìm thấy tin tức nào"}
        </BodyText>
        <Button
          onClick={() => window.location.reload()}
          variant="brand-primary"
        >
          {t("forum.list.retry") || "Thử lại"}
        </Button>
      </div>
    );
  }

  // Normal grid layout - 3 columns
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer border border-slate-200"
          onClick={() => navigate(`/forum-posts/${post.id}`)}
        >
          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative overflow-hidden h-48">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}

          {/* Card Content */}
          <div className="p-4">
            {/* Category Badge */}
            <MetaText as="span">{post.categoryName}</MetaText>

            {/* Title */}
            <SubsectionTitle className="mt-2 mb-2 line-clamp-2 hover:text-brand-primary">
              {post.title}
            </SubsectionTitle>

            {/* Description */}
            <p className="mb-4">
              <SmallText variant="muted" className="line-clamp-2">
                {post.description || post.content?.substring(0, 100)}
              </SmallText>
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between">
              <Caption>{new Date(post.createdAt).toLocaleDateString()}</Caption>
              <Caption>👁️ {post.viewCount || 0}</Caption>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

