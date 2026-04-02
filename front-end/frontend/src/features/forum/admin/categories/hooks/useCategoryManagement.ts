/**
 * useCategoryManagement Hook
 * Manages category CRUD operations with React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory,
} from "../services/categoryApi";
import type {
  CategoryFilterParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types";

// Query key factory
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  list: (filters: CategoryFilterParams) =>
    [...categoryKeys.lists(), filters] as const,
  details: () => [...categoryKeys.all, "detail"] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};

/**
 * FOR-01: Fetch categories with search and pagination
 */
export const useCategoriesQuery = (params: CategoryFilterParams) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getCategories(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Fetch single category by ID
 */
export const useCategoryQuery = (id: number | null) => {
  return useQuery({
    queryKey: categoryKeys.detail(id!),
    queryFn: () => getCategoryById(id!),
    enabled: id !== null,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

/**
 * FOR-02: Create new category
 */
export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => createCategory(data),
    onSuccess: (newCategory) => {
      // Add to list (reset to page 1)
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
      // Also cache the detail
      queryClient.setQueryData(
        categoryKeys.detail(newCategory.id),
        newCategory
      );
    },
  });
};

/**
 * FOR-03: Update category
 */
export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      updateCategory(id, data),
    onSuccess: (updatedCategory) => {
      // Update detail cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      // Invalidate list for name changes
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
};

/**
 * FOR-04: Toggle category status (Active/Inactive)
 */
export const useToggleCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => toggleCategoryStatus(id),
    onSuccess: (updatedCategory) => {
      // Update both detail and list caches
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
};

/**
 * FOR-05: Delete category (soft delete)
 */
export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (_result, id) => {
      // Remove from detail cache
      queryClient.removeQueries({
        queryKey: categoryKeys.detail(id),
      });
      // Invalidate list to reload
      queryClient.invalidateQueries({
        queryKey: categoryKeys.lists(),
      });
    },
  });
};
