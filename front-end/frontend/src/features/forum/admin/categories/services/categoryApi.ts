/**
 * Category API Service
 * Handles HTTP requests for category management (FOR-01 to FOR-05)
 * Maps backend DTO to frontend domain model
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { extractResult } from "@/shared/api/responseAdapter";
import type { ApiResponse } from "@/features/auth/types/api.types";
import type {
  ForumCategory,
  ForumCategoryDTO,
  CategoryListResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CategoryFilterParams,
} from "../types";

/** Maps backend DTO to frontend model */
function mapToFrontendCategory(dto: ForumCategoryDTO): ForumCategory {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    description: dto.description,
    postsCount: dto.postCount, // Rename postCount -> postsCount
    status: dto.active ? "ACTIVE" : "INACTIVE", // Convert boolean to enum
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
 * FOR-01: Fetch categories with pagination and search
 * GET /api/forum/categories?keyword={q}&page={p}&size={s}
 */
export const getCategories = async (params: CategoryFilterParams) => {
  interface BackendListResponse {
    data: ForumCategoryDTO[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  }

  const backendParams = {
    keyword: params.keyword || "",
    page: pageToBackendFormat(params.page),
    size: params.size,
  };

  const res = await apiClient.get<ApiResponse<BackendListResponse>>(
    API_ENDPOINTS.FORUM.CATEGORIES.GET_LIST,
    { params: backendParams }
  );
  const backendData = extractResult(res);

  // Map backend response to frontend model
  return {
    data: backendData.data.map(mapToFrontendCategory),
    page: backendData.page + 1, // Convert 0-indexed back to 1-indexed
    size: backendData.size,
    totalElements: backendData.totalElements,
    totalPages: backendData.totalPages,
  } as CategoryListResponse;
};

/**
 * FOR-01: Get single category by ID
 * GET /api/forum/categories/{id}
 */
export const getCategoryById = async (id: number) => {
  const res = await apiClient.get<ApiResponse<ForumCategoryDTO>>(
    API_ENDPOINTS.FORUM.CATEGORIES.GET_BY_ID.replace("{id}", String(id))
  );
  return mapToFrontendCategory(extractResult(res));
};

/**
 * FOR-02: Create new category
 * POST /api/forum/categories
 * Note: Backend auto-generates slug from name, don't send it
 */
export const createCategory = async (data: CreateCategoryRequest) => {
  const res = await apiClient.post<ApiResponse<ForumCategoryDTO>>(
    API_ENDPOINTS.FORUM.CATEGORIES.CREATE,
    data
  );
  return mapToFrontendCategory(extractResult(res));
};

/**
 * FOR-03: Update category (name and description)
 * PATCH /api/forum/categories/{id}
 */
export const updateCategory = async (
  id: number,
  data: UpdateCategoryRequest
) => {
  const res = await apiClient.patch<ApiResponse<ForumCategoryDTO>>(
    API_ENDPOINTS.FORUM.CATEGORIES.UPDATE.replace("{id}", String(id)),
    data
  );
  return mapToFrontendCategory(extractResult(res));
};

/**
 * FOR-04: Toggle category status (Active/Inactive)
 * PATCH /api/forum/categories/{id}/toggle-status
 */
export const toggleCategoryStatus = async (id: number) => {
  const res = await apiClient.patch<ApiResponse<ForumCategoryDTO>>(
    API_ENDPOINTS.FORUM.CATEGORIES.TOGGLE_STATUS.replace("{id}", String(id))
  );
  return mapToFrontendCategory(extractResult(res));
};

/**
 * FOR-05: Delete category (soft delete)
 * DELETE /api/forum/categories/{id}
 */
export const deleteCategory = async (id: number) => {
  return await apiClient.delete<ApiResponse<void>>(
    API_ENDPOINTS.FORUM.CATEGORIES.DELETE.replace("{id}", String(id))
  );
};
