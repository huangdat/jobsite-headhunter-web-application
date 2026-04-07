/**
 * Post API Service
 * Handles HTTP requests for post management (FOR-06 to FOR-09)
 * Maps backend DTO to frontend domain model
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { extractResult } from "@/shared/api/responseAdapter";
import type { ApiResponse } from "@/features/auth/types/api.types";
import type {
  ForumPost,
  ForumPostDTO,
  PostListResponse,
  CreatePostRequest,
  UpdatePostRequest,
  UpdatePostStatusRequest,
  PostFilterParams,
} from "../types";

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
 * FOR-06: Fetch posts with pagination, search, and filters
 * GET /api/forum/posts?keyword={q}&categoryId={c}&page={p}&size={s}&status={st}
 */
export const getPosts = async (params: PostFilterParams) => {
  interface BackendListResponse {
    data: ForumPostDTO[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }

  const backendParams: Record<string, string | number> = {
    page: pageToBackendFormat(params.page),
    size: params.size,
  };

  if (params.keyword) backendParams.keyword = params.keyword;
  if (params.categoryId) backendParams.categoryId = params.categoryId;
  if (params.status) backendParams.status = params.status;

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
};

/**
 * FOR-06: Get single post by ID
 * GET /api/forum/posts/{id}
 */
export const getPostById = async (id: number) => {
  const res = await apiClient.get<ApiResponse<ForumPostDTO>>(
    `${API_ENDPOINTS.FORUM.POSTS.GET_LIST}/${id}`
  );
  return mapToFrontendPost(extractResult(res));
};

/**
 * FOR-06: Create new post
 * POST /api/forum/posts
 */
export const createPost = async (data: CreatePostRequest) => {
  const res = await apiClient.post<ApiResponse<ForumPostDTO>>(
    API_ENDPOINTS.FORUM.POSTS.CREATE,
    data
  );
  return mapToFrontendPost(extractResult(res));
};

/**
 * FOR-07: Update post (full update)
 * PUT /api/forum/posts/{id}
 */
export const updatePost = async (id: number, data: UpdatePostRequest) => {
  const res = await apiClient.put<ApiResponse<ForumPostDTO>>(
    `${API_ENDPOINTS.FORUM.POSTS.GET_LIST}/${id}`,
    data
  );
  return mapToFrontendPost(extractResult(res));
};

/**
 * FOR-08: Update post status only
 * PATCH /api/forum/posts/{id}/status
 */
export const updatePostStatus = async (
  id: number,
  data: UpdatePostStatusRequest
) => {
  const res = await apiClient.patch<ApiResponse<ForumPostDTO>>(
    `${API_ENDPOINTS.FORUM.POSTS.GET_LIST}/${id}/status`,
    data
  );
  return mapToFrontendPost(extractResult(res));
};

/**
 * FOR-09: Delete post
 * DELETE /api/forum/posts/{id}
 */
export const deletePost = async (id: number) => {
  await apiClient.delete(`${API_ENDPOINTS.FORUM.POSTS.GET_LIST}/${id}`);
};

/**
 * Upload featured image for post
 * POST /api/forum/upload-image
 */
export const uploadPostImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await apiClient.post<ApiResponse<{ url: string }>>(
    API_ENDPOINTS.FORUM.UPLOAD_IMAGE,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  const result = extractResult(res);
  return result.url;
};

/* Legacy export for backwards compatibility */
/* eslint-disable @typescript-eslint/no-unused-vars */
export const postApi = {
  getPosts: async () => {
    return { data: [] };
  },

  createPost: async (_data: unknown) => {
    return { data: _data };
  },

  deletePost: async (_id: number) => {
    return { success: true };
  },

  updateStatus: async (_id: number, _status: string) => {
    return { success: true };
  },
};
/* eslint-enable @typescript-eslint/no-unused-vars */
