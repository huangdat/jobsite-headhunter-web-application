/**
 * useFeaturedPosts Hook
 * FOR-10 AC1/AC2: Manages featured posts section
 * AC1: Layout - main featured post (2 cols) + sidebar (3 cards, 1 col each)
 * AC2: Hide section if less than 4 posts; show partial if 1-3; hide if 0
 */

import { useQuery } from "@tanstack/react-query";
import { forumPostApi } from "../services/forumPostApi";

export function useFeaturedPosts() {
  const {
    data: posts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["featured-posts"],
    queryFn: () => forumPostApi.getFeaturedPosts(4),
    staleTime: 10 * 60 * 1000, // 10 minutes (less frequent than regular list)
    gcTime: 20 * 60 * 1000,
  });

  // AC1: Layout logic based on count
  const hasSufficientFeatured = posts.length >= 4;

  // AC2: Hide section if no featured posts
  const shouldShowFeatured = posts.length > 0;

  // Separate main featured post and sidebar posts
  const mainFeatured = posts[0] || null;
  const sidebarFeatured = posts.slice(1, 4); // max 3 sidebar items

  return {
    posts,
    mainFeatured,
    sidebarFeatured,
    hasSufficientFeatured,
    shouldShowFeatured, // If false, hide entire section
    isLoading,
    error,
    count: posts.length,
  };
}
