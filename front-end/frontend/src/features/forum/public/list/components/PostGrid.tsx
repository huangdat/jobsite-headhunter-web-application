/**
 * PostGrid Component
 * FOR-10 AC4/AC5: Display forum posts in grid layout
 * AC4: Empty state with message and retry button
 * AC5: Loading state with spinner and text
 */

import { MessageCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePostList } from "../hooks/usePostList";
import { useTranslation } from "react-i18next";

export function PostGrid() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { posts, isLoading, isEmpty } = usePostList();

  // AC5: Show loading spinner
  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary mx-auto mb-3" />
        <p className="text-slate-600">
          {t("forum.list.loading") || "Đang tải tin tức..."}
        </p>
      </div>
    );
  }

  // AC4: Empty state
  if (isEmpty) {
    return (
      <div className="py-12 text-center">
        <MessageCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-lg text-slate-600 mb-4">
          {t("forum.list.noResults") || "Không tìm thấy tin tức nào"}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-brand-primary text-black rounded-lg hover:bg-brand-hover font-bold"
        >
          {t("forum.list.retry") || "Thử lại"}
        </button>
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
            <span className="text-xs font-medium text-brand-primary uppercase">
              {post.categoryName}
            </span>

            {/* Title */}
            <h3 className="font-semibold text-base mt-2 mb-2 line-clamp-2 hover:text-brand-primary">
              {post.title}
            </h3>

            {/* Description */}
            <p className="text-slate-600 text-sm line-clamp-2 mb-4">
              {post.description || post.content?.substring(0, 100)}
            </p>

            {/* Meta Info */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1">
                👁️ {post.viewCount || 0}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
