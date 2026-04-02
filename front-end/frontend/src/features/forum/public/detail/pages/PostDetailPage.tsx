/**
 * PostDetailPage
 * FOR-11 + FOR-12: Public page displaying single post with reactions
 */

import { useParams, useNavigate } from "react-router-dom";
import { usePostDetail } from "../hooks/usePostDetail";
import { PostContent } from "../components/PostContent";
import { PostMetadata } from "../components/PostMetadata";
import { ReactionsBar } from "../components/ReactionsBar";
import { RelatedPosts } from "../components/RelatedPosts";
import { Loader2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const postId = id ? parseInt(id, 10) : null;
  const { post, isLoading, isNotFound } = usePostDetail(postId);

  // AC3: Handle 404
  if (isNotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {t("forum.detail.notFound") || "Không tìm thấy bài viết"}
          </h1>
          <p className="text-slate-600 mb-6">
            {t("forum.detail.notFoundMessage") ||
              "Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa."}
          </p>
          <button
            onClick={() => navigate("/forum-posts")}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            {t("forum.actions.backToList") || "Quay lại danh sách"}
          </button>
        </div>
      </div>
    );
  }

  // AC5: Show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-3" />
          <p className="text-slate-600">
            {t("forum.detail.loading") || "Đang tải bài viết..."}
          </p>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <PostMetadata post={post} />

        <PostContent post={post} />

        {postId && <ReactionsBar postId={postId} />}

        <RelatedPosts categoryId={post.categoryId} excludeId={postId || 0} />
      </div>
    </div>
  );
}
