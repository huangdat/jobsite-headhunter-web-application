/**
 * Forum Post API Service (Public)
 * Handles HTTP requests for public forum post listing and featured posts
 * FOR-10 & FOR-11
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { extractResult } from "@/shared/api/responseAdapter";
import type { ApiResponse } from "@/features/auth/types/api.types";
import type {
  ForumPost,
  ForumPostDTO,
  PostListResponse,
  PostFilterParams,
} from "@/features/forum/admin/posts/types";

/** Maps backend DTO to frontend model */
function mapToFrontendPost(dto: ForumPostDTO): ForumPost {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    description: dto.description,
    content: dto.content,
    featuredImage: dto.featuredImage,
    categoryId: dto.categoryId,
    categoryName: dto.categoryName,
    status: dto.status,
    viewCount: dto.viewCount || 0,
    commentCount: dto.commentCount || 0,
    createdBy: dto.createdBy,
    createdByName: dto.createdByName,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    deletedAt: dto.deletedAt,
  };
}

/** Converts 1-indexed frontend page to 0-indexed backend page */
function pageToBackendFormat(page: number): number {
  return Math.max(0, page - 1);
}

/**
 * FOR-10: Fetch published forum posts with search and filters
 * GET /api/forum/posts?keyword={q}&categoryId={c}&page={p}&size={s}&status=PUBLISHED
 */
export const forumPostApi = {
  searchPosts: async (params: PostFilterParams) => {
    interface BackendListResponse {
      data: ForumPostDTO[];
      page: number;
      size: number;
      totalElements: number;
      totalPages: number;
    }

    const backendParams: Record<string, string | number> = {
      page: pageToBackendFormat(params.page),
      size: params.size || 6,
      status: "PUBLISHED", // Only get published posts for public view
    };

    if (params.keyword) backendParams.keyword = params.keyword;
    if (params.categoryId) backendParams.categoryId = params.categoryId;

    const res = await apiClient.get<ApiResponse<BackendListResponse>>(
      API_ENDPOINTS.FORUM.POSTS.GET_LIST,
      { params: backendParams }
    );
    const backendData = extractResult(res);

    // Map backend response to frontend model
    return {
      data: backendData.data.map(mapToFrontendPost),
      page: backendData.page + 1, // Convert 0-indexed back to 1-indexed
      size: backendData.size,
      totalElements: backendData.totalElements,
      totalPages: backendData.totalPages,
    } as PostListResponse;
  },

  /**
   * Fetch featured posts (first 4 published posts)
   * GET /api/forum/posts?page=0&size=4&status=PUBLISHED&sort=createdAt,desc
   */
  getFeaturedPosts: async (limit: number = 4) => {
    interface BackendListResponse {
      data: ForumPostDTO[];
      page: number;
      size: number;
      totalElements: number;
      totalPages: number;
    }

    const res = await apiClient.get<ApiResponse<BackendListResponse>>(
      API_ENDPOINTS.FORUM.POSTS.GET_LIST,
      {
        params: {
          page: 0,
          size: limit,
          status: "PUBLISHED",
        },
      }
    );
    const backendData = extractResult(res);

    return backendData.data.map(mapToFrontendPost);
  },

  /**
   * FOR-11: Get single post detail
   * GET /api/forum/posts/{id}
   */
  getPostDetail: async (id: number) => {
    const res = await apiClient.get<ApiResponse<ForumPostDTO>>(
      `${API_ENDPOINTS.FORUM.POSTS.GET_LIST}/${id}`
    );
    return mapToFrontendPost(extractResult(res));
  },

  /**
   * Get related posts for sidebar
   * GET /api/forum/posts?categoryId={c}&page=0&size=3&status=PUBLISHED&excludeId={id}
   */
  getRelatedPosts: async (
    categoryId: number,
    excludeId: number,
    limit: number = 3
  ) => {
    interface BackendListResponse {
      data: ForumPostDTO[];
      page: number;
      size: number;
      totalElements: number;
      totalPages: number;
    }

    const res = await apiClient.get<ApiResponse<BackendListResponse>>(
      API_ENDPOINTS.FORUM.POSTS.GET_LIST,
      {
        params: {
          categoryId,
          page: 0,
          size: limit,
          status: "PUBLISHED",
          excludeId, // Backend should support excluding current post
        },
      }
    );
    const backendData = extractResult(res);

    return backendData.data.map(mapToFrontendPost);
  },
};
