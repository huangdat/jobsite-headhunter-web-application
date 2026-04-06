/**
 * Post API Service (Public Detail)
 * Handles HTTP requests for post detail page
 */

// import { apiClient } from "@/shared/utils/axios";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const postApi = {
  /**
   * Fetch single post by ID
   */
  getPostById: async (_id: string) => {
    // TODO: Implement API call
    return { data: null };
  },

  /**
   * Fetch related posts
   */
  getRelatedPosts: async (_id: string) => {
    // TODO: Implement API call
    return { data: [] };
  },

  /**
   * Increment view count
   */
  incrementViews: async (_id: string) => {
    // TODO: Implement API call
    return { success: true };
  },
};
/* eslint-enable @typescript-eslint/no-unused-vars */
