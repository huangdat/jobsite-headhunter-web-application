import { useCallback } from "react";
import type {
  CandidateFilterDateKey,
  CandidateFilterMultiKey,
  CandidateFilterNumberKey,
  CandidateFilterParams,
} from "../types";
import { createDefaultCandidateFilters } from "../types";

const toNullableNumber = (value: string) => {
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const useCandidateFilters = (
  filters: CandidateFilterParams,
  onFilterChange: (filters: CandidateFilterParams) => void
) => {
  const toggleMultiSelect = useCallback(
    (key: CandidateFilterMultiKey, value: string) => {
      const current = filters[key] as string[];
      const next = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      onFilterChange({ ...filters, [key]: next });
    },
    [filters, onFilterChange]
  );

  const updateNumberField = useCallback(
    (key: CandidateFilterNumberKey, value: string) => {
      onFilterChange({ ...filters, [key]: toNullableNumber(value) });
    },
    [filters, onFilterChange]
  );

  const updateDateField = useCallback(
    (key: CandidateFilterDateKey, value: string) => {
      onFilterChange({ ...filters, [key]: value || null });
    },
    [filters, onFilterChange]
  );

  const resetFilters = useCallback(() => {
    onFilterChange(createDefaultCandidateFilters());
  }, [onFilterChange]);

  return {
    toggleMultiSelect,
    updateNumberField,
    updateDateField,
    resetFilters,
  };
};