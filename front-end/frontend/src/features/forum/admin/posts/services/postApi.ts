/**
 * Post API Service (Admin)
 * Handles HTTP requests for post management
 */

// import { apiClient } from "@/shared/utils/axios";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const postApi = {
  /**
   * Fetch all posts (admin)
   */
  getPosts: async () => {
    // TODO: Implement API call
    return { data: [] };
  },

  /**
   * Create new post
   */
  createPost: async (_data: unknown) => {
    // TODO: Implement API call
    return { data: _data };
  },

  /**
   * Update existing post
   */
  updatePost: async (_id: number, _data: unknown) => {
    // TODO: Implement API call
    return { data: _data };
  },

  /**
   * Delete post
   */
  deletePost: async (_id: number) => {
    // TODO: Implement API call
    return { success: true };
  },

  /**
   * Update post status
   */
  updateStatus: async (_id: number, _status: string) => {
    // TODO: Implement API call
    return { success: true };
  },
};
/* eslint-enable @typescript-eslint/no-unused-vars */
