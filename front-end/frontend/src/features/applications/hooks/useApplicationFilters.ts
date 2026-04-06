import { useState, useCallback } from "react";
import type { ApplicationStatus, ApplicationFilterParams } from "../types";

interface UseApplicationFiltersOptions {
  onFilterChange?: (filters: ApplicationFilterParams) => void;
}

export const useApplicationFilters = (
  options: UseApplicationFiltersOptions = {}
) => {
  const { onFilterChange } = options;

  const [filters, setFilters] = useState<ApplicationFilterParams>({
    page: 0,
    size: 10,
    sortBy: "APPLIED_AT",
    direction: "DESC",
    status: undefined,
    keyword: "",
  });

  /**
   * Update status filter
   */
  const handleStatusChange = useCallback(
    (status: ApplicationStatus | undefined) => {
      const newFilters = { ...filters, status, page: 0 };
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, onFilterChange]
  );

  /**
   * Update search keyword
   */
  const handleKeywordChange = useCallback(
    (keyword: string) => {
      const newFilters = { ...filters, keyword, page: 0 };
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, onFilterChange]
  );

  /**
   * Update sort
   */
  const handleSortChange = useCallback(
    (
      sortBy: "APPLIED_AT" | "STATUS" | "SALARY_EXPECTATION",
      direction: "ASC" | "DESC"
    ) => {
      const newFilters = { ...filters, sortBy, direction };
      setFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    [filters, onFilterChange]
  );

  /**
   * Reset filters
   */
  const resetFilters = useCallback(() => {
    const defaultFilters: ApplicationFilterParams = {
      page: 0,
      size: 10,
      sortBy: "APPLIED_AT",
      direction: "DESC",
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  }, [onFilterChange]);

  return {
    filters,
    handleStatusChange,
    handleKeywordChange,
    handleSortChange,
    resetFilters,
  };
};
