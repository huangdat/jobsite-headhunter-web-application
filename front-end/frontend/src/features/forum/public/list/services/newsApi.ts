/**
 * News API Service
 * Handles HTTP requests for public news listing
 */

// import { apiClient } from "@/shared/utils/axios";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const newsApi = {
  /**
   * Fetch published news posts
   */
  getNews: async (_params?: {
    page?: number;
    category?: string;
    search?: string;
  }) => {
    // TODO: Implement API call
    return { data: [], total: 0 };
  },

  /**
   * Fetch featured posts
   */
  getFeaturedPosts: async () => {
    // TODO: Implement API call
    return { data: [] };
  },

  /**
   * Fetch categories for filtering
   */
  getCategories: async () => {
    // TODO: Implement API call
    return { data: [] };
  },
};
/* eslint-enable @typescript-eslint/no-unused-vars */
