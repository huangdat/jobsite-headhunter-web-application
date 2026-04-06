/**
 * Type definitions for Forum Categories
 * Maps backend response to frontend domain model
 */

/** Backend response from API */
export interface ForumCategoryDTO {
  id: number;
  name: string;
  slug: string;
  description?: string;
  active: boolean; // Backend uses boolean, not enum
  postCount: number; // Backend uses postCount, not postsCount
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

/** Frontend domain model (converted from DTO) */
export interface ForumCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  postsCount: number; // Normalized field name
  status: "ACTIVE" | "INACTIVE"; // Normalized to enum
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CategoryListResponse {
  data: ForumCategory[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string;
}

export interface CategoryFilterParams {
  keyword?: string; // Backend param name
  page: number; // 1-indexed from frontend, converted to 0-indexed for backend
  size: number;
}
