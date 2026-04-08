/**
 * Post API Service (Public Detail)
 * Handles HTTP requests for post detail page
 */

// import { apiClient } from "@/shared/utils/axios";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const postApi = {
  getPostById: async (_id: string) => {
    return { data: null };
  },

  getRelatedPosts: async (_id: string) => {
    return { data: [] };
  },

  incrementViews: async (_id: string) => {
    return { success: true };
  },
};
/* eslint-enable @typescript-eslint/no-unused-vars */
