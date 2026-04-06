/**
 * useReactions Hook
 * FOR-12: Manages post reactions
 * AC1: Check authentication before allowing reaction
 * AC2: First reaction adds emoji icon + count 0→1
 * AC3: Change reaction decreases old count, increases new count
 * AC4: Second click on same emoji removes it
 * AC5: useMemo + debounce prevents race conditions
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  reactionsApi,
  type ReactionType,
  type ReactionCount,
} from "../services/reactionsApi";
import { useAuth } from "@/features/auth/context/useAuth";

export function useReactions(postId: number) {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Local state to track pending mutations
  const [pendingReaction, setPendingReaction] = useState<ReactionType | null>(
    null
  );

  // Fetch all reactions for this post
  const { data: reactionData = { counts: {}, userReaction: null }, isLoading } =
    useQuery({
      queryKey: ["post-reactions", postId],
      queryFn: () => reactionsApi.getPostReactions(postId),
      enabled: !!postId,
      staleTime: 1 * 60 * 1000, // 1 minute
    });

  const reactionCounts: ReactionCount = {
    LIKE: 0,
    LOVE: 0,
    ANGRY: 0,
    SAD: 0,
    WOW: 0,
    LAUGH: 0,
    ...reactionData.counts,
  };

  const userCurrentReaction: ReactionType | null =
    pendingReaction || reactionData.userReaction?.type || null;

  // Mutation for setting/updating reaction
  const { mutate: performSetReaction, isPending: isSetPending } = useMutation({
    mutationFn: (type: ReactionType) =>
      reactionsApi.setPostReaction(postId, type),
    onSuccess: () => {
      setPendingReaction(null);
      // Refetch reactions after successful mutation
      queryClient.invalidateQueries({ queryKey: ["post-reactions", postId] });
    },
    onError: () => {
      setPendingReaction(null);
    },
  });

  // Mutation for removing reaction
  const { mutate: performRemoveReaction, isPending: isRemovePending } =
    useMutation({
      mutationFn: () => reactionsApi.removePostReaction(postId),
      onSuccess: () => {
        setPendingReaction(null);
        // Refetch reactions after successful mutation
        queryClient.invalidateQueries({ queryKey: ["post-reactions", postId] });
      },
      onError: () => {
        setPendingReaction(null);
      },
    });

  // AC5: Debounce to prevent race conditions (300ms wait)
  const debouncedSetReaction = useDebouncedCallback((type: ReactionType) => {
    performSetReaction(type);
  }, 300);

  // Main reaction handler
  const handleReaction = useCallback(
    (type: ReactionType) => {
      // AC1: Check authentication
      if (!isAuthenticated) {
        return { requiresLogin: true };
      }

      // AC4: If clicking same reaction, remove it
      if (userCurrentReaction === type) {
        setPendingReaction(null);
        performRemoveReaction();
        return { action: "removed", type };
      }

      // AC2/AC3: Add or update reaction (debounced)
      setPendingReaction(type);
      debouncedSetReaction(type);
      return { action: "set", type };
    },
    [
      userCurrentReaction,
      isAuthenticated,
      debouncedSetReaction,
      performRemoveReaction,
    ]
  );

  const getTotalReactions = useCallback(() => {
    return Object.values(reactionCounts).reduce((sum, count) => sum + count, 0);
  }, [reactionCounts]);

  return {
    // Counts
    reactionCounts,
    totalReactions: getTotalReactions(),

    // User state
    userCurrentReaction,
    isUserReacted: !!userCurrentReaction,

    // Loading
    isLoading,
    isPending: isSetPending || isRemovePending,

    // Handlers
    handleReaction,

    // Auth
    isAuthenticated,
  };
}
