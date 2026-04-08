/**
 * usePostManagement Hook
 * Manages post CRUD operations with React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  updatePostStatus,
  deletePost,
  uploadPostImage,
} from "../services/postApi";
import type {
  PostFilterParams,
  CreatePostRequest,
  UpdatePostRequest,
  UpdatePostStatusRequest,
} from "../types";

// Query key factory
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: PostFilterParams) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

/**
 * FOR-06: Fetch posts with search, filters, and pagination
 */
export const usePostsQuery = (params: PostFilterParams) => {
  return useQuery({
    queryKey: postKeys.list(params),
    queryFn: () => getPosts(params),
    staleTime: 1000 * 60 * 2, // 2 minutes (more dynamic than categories)
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Fetch single post by ID
 */
export const usePostQuery = (id: number | null) => {
  return useQuery({
    queryKey: postKeys.detail(id!),
    queryFn: () => getPostById(id!),
    enabled: id !== null,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 10,
  });
};

/**
 * FOR-06: Create new post
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => createPost(data),
    onSuccess: (newPost) => {
      // Invalidate list to refetch
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });
      // Also cache the detail
      queryClient.setQueryData(postKeys.detail(newPost.id), newPost);
    },
  });
};

/**
 * FOR-07: Update post
 */
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostRequest }) =>
      updatePost(id, data),
    onSuccess: (updatedPost) => {
      // Invalidate list
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });
      // Update cache
      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost);
    },
  });
};

/**
 * FOR-08: Update post status
 */
export const useUpdatePostStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostStatusRequest }) =>
      updatePostStatus(id, data),
    onSuccess: (updatedPost) => {
      // Invalidate list (status change affects sorting/filtering)
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });
      // Update cache
      queryClient.setQueryData(postKeys.detail(updatedPost.id), updatedPost);
    },
  });
};

/**
 * FOR-09: Delete post
 */
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePost(id),
    onSuccess: () => {
      // Invalidate list to refetch
      queryClient.invalidateQueries({
        queryKey: postKeys.lists(),
      });
    },
  });
};

/**
 * Upload featured image
 */
export const useUploadPostImageMutation = () => {
  return useMutation({
    mutationFn: (file: File) => uploadPostImage(file),
  });
};

/* Legacy export for backwards compatibility */
export function usePostManagement() {
  return {
    posts: [],
    isLoading: false,
    error: null,
    createPost: async () => {},
    updatePost: async () => {},
    deletePost: async () => {},
    updateStatus: async () => {},
  };
}
