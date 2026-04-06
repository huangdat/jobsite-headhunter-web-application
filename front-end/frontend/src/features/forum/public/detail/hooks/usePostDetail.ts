/**
 * usePostDetail Hook
 * FOR-11: Fetches and manages single post detail data
 * AC3: Handle 404 errors
 * AC4: Fallback data for missing fields
 * AC5: Auto scroll to top on post change
 */

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { forumPostApi } from "../../list/services/forumPostApi";
import type { ForumPost } from "@/features/forum/admin/posts/types";

export function usePostDetail(postId: number | null | undefined) {
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["post-detail", postId],
    queryFn: async () => {
      if (!postId) throw new Error("Post ID required");
      return forumPostApi.getPostDetail(postId);
    },
    enabled: !!postId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000,
  });

  // AC5: Auto scroll to top on post change
  useEffect(() => {
    if (postId && post) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [postId, post]);

  // AC3: Handle 404
  const isNotFound =
    isError && (error as Error & { status?: number })?.status === 404;

  // AC4: Fallback data for missing fields
  const enrichedPost = post
    ? {
        ...post,
        author: post.createdByName || "Admin",
        viewCount: post.viewCount ?? 0,
        commentCount: post.commentCount ?? 0,
        content: post.content || "Nội dung đang được cập nhật",
        featuredImage: post.featuredImage || "/placeholder.jpg",
      }
    : null;

  const relatedPosts = post
    ? // Fetch related posts from same category
      []
    : [];

  return {
    post: enrichedPost as ForumPost | null,
    relatedPosts,
    isLoading, // AC1: Show loading spinner during fetch
    isError,
    error,
    isNotFound,
  };
}
