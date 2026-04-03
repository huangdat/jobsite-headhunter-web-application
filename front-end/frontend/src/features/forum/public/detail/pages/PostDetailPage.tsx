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
import { useTranslation } from "react-i18next";
import { PageContainer } from "@/shared/components/layout";
import { PageSkeleton, ErrorState } from "@/shared/components/states";
import { FileQuestion } from "lucide-react";

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const postId = id ? parseInt(id, 10) : null;
  const { post, isLoading, isNotFound } = usePostDetail(postId);

  // AC3: Handle 404
  if (isNotFound) {
    return (
      <PageContainer variant="white" maxWidth="4xl">
        <ErrorState
          variant="page"
          icon={FileQuestion}
          title={t("forum.detail.notFound") || "Không tìm thấy bài viết"}
          message={
            t("forum.detail.notFoundMessage") ||
            "Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa."
          }
          onRetry={() => navigate("/forum-posts")}
          retryLabel={t("forum.actions.backToList") || "Quay lại danh sách"}
        />
      </PageContainer>
    );
  }

  // AC5: Show loading spinner
  if (isLoading) {
    return (
      <PageContainer variant="white" maxWidth="4xl">
        <PageSkeleton variant="grid" count={1} />
      </PageContainer>
    );
  }

  if (!post) return null;

  return (
    <PageContainer variant="white" maxWidth="4xl">
      <PostMetadata post={post} />

      <PostContent post={post} />

      {postId && <ReactionsBar postId={postId} />}

      <RelatedPosts categoryId={post.categoryId} excludeId={postId || 0} />
    </PageContainer>
  );
}
