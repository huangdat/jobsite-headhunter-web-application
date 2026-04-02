/**
 * usePostList Hook
 * FOR-10: Manages forum post list fetching, filtering, and pagination
 * AC3: Reset to page 1 when filters change
 * AC6/AC7: Smart pagination with disabled states
 */

import { useQuery } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { forumPostApi } from "../services/forumPostApi";
import type { PostFilterParams } from "@/features/forum/admin/posts/types";

interface UsePostListOptions {
  initialCategory?: number;
  initialKeyword?: string;
}

export function usePostList(options: UsePostListOptions = {}) {
  // State management
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState(options.initialKeyword || "");
  const [categoryId, setCategoryId] = useState<number | undefined>(
    options.initialCategory
  );

  // Auto-reset to page 1 when filter changes (AC3)
  const handleFilterChange = useCallback(
    (newCategory?: number, newKeyword?: string) => {
      setCategoryId(newCategory);
      setKeyword(newKeyword || "");
      setPage(1); // AC3: Reset to page 1
    },
    []
  );

  // React Query for data fetching
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["forum-posts", { page, keyword, categoryId }],
    queryFn: async () => {
      const params: PostFilterParams = {
        page,
        size: 6, // 6 items per page (AC6)
        keyword: keyword || undefined,
        categoryId,
        status: "PUBLISHED",
      };
      return forumPostApi.searchPosts(params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Derived state
  const posts = response?.data || [];
  const totalPages = response?.totalPages || 0;
  const totalElements = response?.totalElements || 0;
  const hasData = posts.length > 0;
  const isEmpty = !isLoading && !hasData;
  const canGoNext = page < totalPages;
  const canGoPrev = page > 1;

  // Navigation functions
  const goToPage = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    if (canGoNext) {
      goToPage(page + 1);
    }
  }, [page, canGoNext, goToPage]);

  const prevPage = useCallback(() => {
    if (canGoPrev) {
      goToPage(page - 1);
    }
  }, [page, canGoPrev, goToPage]);

  return {
    // Data
    posts,
    page,
    totalPages,
    totalElements,

    // States
    isLoading, // AC5: Loading indicator
    isError,
    error,
    hasData,
    isEmpty, // AC4: Empty state

    // State setters
    setKeyword,
    setCategoryId,
    handleFilterChange,

    // Navigation
    goToPage,
    nextPage,
    prevPage,
    canGoNext, // AC7: Disable "next" button
    canGoPrev, // AC7: Disable "prev" button
  };
}
