/**
 * Reactions API Service
 * FOR-12: Handles HTTP requests for post reactions
 */

// import { apiClient } from "@/shared/utils/axios";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const reactionsApi = {
  /**
   * Fetch reactions for a post
   */
  getReactions: async (_postId: string) => {
    // TODO: Implement API call
    return {
      data: {
        like: 0,
        love: 0,
        celebrate: 0,
      },
    };
  },

  /**
   * Add reaction to a post
   */
  addReaction: async (
    _postId: string,
    _type: "like" | "love" | "celebrate"
  ) => {
    // TODO: Implement API call
    return { success: true };
  },

  /**
   * Remove reaction from a post
   */
  removeReaction: async (_postId: string) => {
    // TODO: Implement API call
    return { success: true };
  },

  /**
   * Get user's reaction for a post
   */
  getUserReaction: async (_postId: string) => {
    // TODO: Implement API call
    return { data: null };
  },
};
/* eslint-enable @typescript-eslint/no-unused-vars */
