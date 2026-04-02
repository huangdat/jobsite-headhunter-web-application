/**
 * Type definitions for Forum Posts
 * Maps backend response to frontend domain model
 */

import type { ForumCategory } from "@/features/forum/admin/categories/types";

/** Backend response from API */
export interface ForumPostDTO {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  content: string;
  featuredImage?: string;
  categoryId: number;
  categoryName?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"; // Backend uses enum
  viewCount: number;
  commentCount: number;
  createdBy?: number;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/** Frontend domain model (converted from DTO) */
export interface ForumPost {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  content: string;
  featuredImage?: string;
  categoryId: number;
  categoryName?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  viewCount: number;
  commentCount: number;
  createdBy?: number;
  createdByName?: string;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface PostListResponse {
  data: ForumPost[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CreatePostRequest {
  title: string;
  description?: string;
  content: string;
  featuredImage?: string;
  categoryId: number;
  status?: "DRAFT" | "PUBLISHED"; // Default DRAFT
}

export interface UpdatePostRequest {
  title: string;
  description?: string;
  content: string;
  featuredImage?: string;
  categoryId: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface UpdatePostStatusRequest {
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface PostFilterParams {
  keyword?: string;
  categoryId?: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  page: number;
  size: number;
}

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export const POST_STATUS_COLORS: Record<
  PostStatus,
  { bg: string; text: string; icon: string }
> = {
  DRAFT: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    icon: "🔸",
  },
  PUBLISHED: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: "✓",
  },
  ARCHIVED: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    icon: "📦",
  },
};

// Re-export ForumCategory from categories for convenience
export type { ForumCategory };
