/**
 * Reactions API Service
 * FOR-12: Handles HTTP requests for post reactions
 */

import { apiClient } from "@/shared/utils/axios";
import { API_ENDPOINTS } from "@/lib/constants";
import { extractResult } from "@/shared/api/responseAdapter";
import type { ApiResponse } from "@/features/auth/types/api.types";

export type ReactionType = "LIKE" | "LOVE" | "ANGRY" | "SAD" | "WOW" | "LAUGH";

export interface ReactionCount {
  LIKE: number;
  LOVE: number;
  ANGRY: number;
  SAD: number;
  WOW: number;
  LAUGH: number;
}

export interface UserReaction {
  postId: number;
  type: ReactionType;
  createdAt: string;
}

export interface PostReactionsResponse {
  counts: ReactionCount;
  userReaction: UserReaction | null;
}

/**
 * FOR-12: Fetch reactions for a post
 * GET /api/forum/posts/{postId}/reactions
 */
export const reactionsApi = {
  getPostReactions: async (postId: number) => {
    const res = await apiClient.get<ApiResponse<PostReactionsResponse>>(
      `${API_ENDPOINTS.FORUM.POSTS.GET_LIST}/${postId}/reactions`
    );
    return extractResult(res);
  },

  /**
   * FOR-12 AC2/AC3: Set reaction (add or update)
   * POST /api/forum/posts/{postId}/reactions
   */
  setPostReaction: async (postId: number, type: ReactionType) => {
    const res = await apiClient.post<ApiResponse<UserReaction>>(
      `${API_ENDPOINTS.FORUM.POSTS.GET_LIST}/${postId}/reactions`,
      { type }
    );
    return extractResult(res);
  },

  /**
   * FOR-12 AC4: Remove reaction
   * DELETE /api/forum/posts/{postId}/reactions
   */
  removePostReaction: async (postId: number) => {
    await apiClient.delete(
      `${API_ENDPOINTS.FORUM.POSTS.GET_LIST}/${postId}/reactions`
    );
  },
};
