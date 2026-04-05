/**
 * Hook: useVerificationFilters
 * Manages verification list filtering and search state with debouncing
 * PROF-05: Business Verification Admin Module - Phase 6
 */

import { useState, useCallback, useRef, useEffect } from "react";

export interface UseVerificationFiltersReturn {
  searchTerm: string;
  showFilters: boolean;
  setSearchTerm: (term: string) => void;
  setShowFilters: (show: boolean) => void;
  toggleFilters: () => void;
  debouncedSearch: string;
  clearSearch: () => void;
  clearFilters: () => void;
}

/**
 * Hook to manage verification list filters with debounced search
 * @param debounceMs - Debounce delay in milliseconds (default: 500ms)
 */
export const useVerificationFilters = (
  debounceMs = 500
): UseVerificationFiltersReturn => {
  // Local state
  const [searchTerm, setSearchTermState] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Debounce timer reference
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Set search term with debouncing
   */
  const setSearchTerm = useCallback(
    (term: string) => {
      setSearchTermState(term);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new debounced timer
      debounceTimerRef.current = setTimeout(() => {
        setDebouncedSearch(term);
      }, debounceMs);
    },
    [debounceMs]
  );

  /**
   * Clear search term
   */
  const clearSearch = useCallback(() => {
    setSearchTermState("");
    setDebouncedSearch("");
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  /**
   * Toggle filter visibility
   */
  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  /**
   * Clear all filters and search
   */
  const clearFilters = useCallback(() => {
    clearSearch();
    setShowFilters(false);
  }, [clearSearch]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    searchTerm,
    debouncedSearch,
    showFilters,
    setSearchTerm,
    setShowFilters,
    toggleFilters,
    clearSearch,
    clearFilters,
  };
};
