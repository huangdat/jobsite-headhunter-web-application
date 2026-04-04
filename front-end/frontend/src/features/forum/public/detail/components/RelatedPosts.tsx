/**
 * RelatedPosts Component
 * FOR-11: Display related posts based on category
 */

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { forumPostApi } from "../../list/services/forumPostApi";
import { useTranslation } from "react-i18next";
import type { ForumPost } from "@/features/forum/admin/posts/types";

interface RelatedPostsProps {
  categoryId: number;
  excludeId: number;
}

export function RelatedPosts({ categoryId, excludeId }: RelatedPostsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data: relatedPosts = [], isLoading } = useQuery({
    queryKey: ["related-posts", categoryId, excludeId],
    queryFn: () => forumPostApi.getRelatedPosts(categoryId, excludeId, 3),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading || relatedPosts.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        {t("forum.detail.relatedPosts") || "Bài viết liên quan"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post: ForumPost) => (
          <div
            key={post.id}
            className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer border border-slate-200"
            onClick={() => navigate(`/forum-posts/${post.id}`)}
          >
            {/* Featured Image */}
            {post.featuredImage && (
              <div className="relative overflow-hidden h-40">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
              </div>
            )}

            {/* Card Content */}
            <div className="p-4">
              {/* Category */}
              <span className="text-xs font-medium text-brand-primary uppercase">
                {post.categoryName}
              </span>

              {/* Title */}
              <h3 className="font-semibold text-base mt-2 mb-2 line-clamp-2 hover:text-brand-primary">
                {post.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                {post.description || post.content?.substring(0, 80)}
              </p>

              {/* Date */}
              <p className="text-xs text-slate-500">
                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
