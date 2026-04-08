import { apiClient } from "@/shared/utils/axios";
import type { PagedResponse, APIResponse } from "@/shared/types";

export interface ForumPostResp {
  id: number;
  title: string;
  content: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  categoryId: number;
  categoryName: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  reactionCount?: Record<string, number>;
}

export interface ForumComment {
  id: number;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface ForumPostDetailResp extends ForumPostResp {
  comments: ForumComment[];
}

export interface ForumCategory {
  id: number;
  name: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export const forumApi = {
  // Get all posts with pagination and filters
  searchPosts: async (
    page: number = 0,
    size: number = 6,
    keyword?: string,
    category?: number
  ) => {
    const response = await apiClient.get<
      APIResponse<PagedResponse<ForumPostResp>>
    >(`/api/forum/posts`, {
      params: {
        page,
        size,
        keyword,
        category,
      },
    });
    return response.data.result;
  },

  // Get featured posts
  getFeaturedPosts: async (limit: number = 4) => {
    const response = await apiClient.get<APIResponse<ForumPostResp[]>>(
      `/api/forum/posts/featured`,
      {
        params: { limit },
      }
    );
    return response.data.result;
  },

  // Get post detail
  getPostDetail: async (id: number) => {
    const response = await apiClient.get<APIResponse<ForumPostDetailResp>>(
      `/api/forum/posts/${id}`
    );
    return response.data.result;
  },

  // Toggle reaction on post
  toggleReaction: async (postId: number, reactionType: string) => {
    const response = await apiClient.post(`/api/forum/posts/reactions/toggle`, {
      postId,
      reactionType,
    });
    return response.data.result;
  },

  // Get categories
  getCategories: async () => {
    const response = await apiClient.get<
      APIResponse<PagedResponse<ForumCategory>>
    >(`/api/forum/categories/search`, {
      params: {
        page: 0,
        size: 100,
      },
    });
    // Extract content array from Page response
    return response.data.result.content || [];
  },
};
