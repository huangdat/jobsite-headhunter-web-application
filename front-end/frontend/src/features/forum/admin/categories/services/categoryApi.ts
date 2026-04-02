/**
 * Category API Service
 * Handles HTTP requests for category management
 */

// import { apiClient } from "@/shared/utils/axios";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const categoryApi = {
  /**
   * Fetch all categories
   */
  getCategories: async () => {
    // TODO: Implement API call
    return { data: [] };
  },

  /**
   * Create new category
   */
  createCategory: async (_data: unknown) => {
    // TODO: Implement API call
    return { data: _data };
  },

  /**
   * Update existing category
   */
  updateCategory: async (_id: number, _data: unknown) => {
    // TODO: Implement API call
    return { data: _data };
  },

  /**
   * Delete category
   */
  deleteCategory: async (_id: number) => {
    // TODO: Implement API call
    return { success: true };
  },

  /**
   * Toggle category status
   */
  toggleCategory: async (_id: number) => {
    // TODO: Implement API call
    return { success: true };
  },
};
/* eslint-enable @typescript-eslint/no-unused-vars */
