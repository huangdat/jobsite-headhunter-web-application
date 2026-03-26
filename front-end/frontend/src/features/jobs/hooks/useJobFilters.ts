/**
 * Custom hook for managing job filters state
 * Handles synchronized state for all filter types
 */

import { useEffect, useRef, useState } from "react";
import type { JobFilterParams, WorkingType, RankLevel } from "../types";
import { EXPERIENCE_PRESETS, SALARY_PRESETS, MILLION } from "../utils";

interface UseJobFiltersReturn {
  keyword: string;
  experienceValue: string;
  salaryPreset: string;
  customSalaryMin: string;
  customSalaryMax: string;
  handleKeywordChange: (value: string) => void;
  handleExperienceChange: (value: string) => void;
  handleSalaryPresetChange: (value: string) => void;
  handleCustomSalaryApply: () => void;
  handleWorkingTypeChange: (type: string) => void;
  handleRankLevelChange: (rank: string) => void;
  handleReset: () => void;
  setKeyword: (value: string) => void;
  setExperienceValue: (value: string) => void;
  setSalaryPreset: (value: string) => void;
  setCustomSalaryMin: (value: string) => void;
  setCustomSalaryMax: (value: string) => void;
}

export const useJobFilters = (
  filters: JobFilterParams,
  onFilterChange: (filters: JobFilterParams) => void,
  pageSize: number = 12
): UseJobFiltersReturn => {
  const [keyword, setKeyword] = useState(filters.keyword ?? "");
  const [experienceValue, setExperienceValue] = useState("ALL");
  const [salaryPreset, setSalaryPreset] = useState("ALL");
  const [customSalaryMin, setCustomSalaryMin] = useState("");
  const [customSalaryMax, setCustomSalaryMax] = useState("");
  const typingTimeoutRef = useRef<number | null>(null);

  // Sync keyword from filters
  useEffect(() => {
    const nextKeyword = filters.keyword ?? "";
    if (nextKeyword !== keyword) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setKeyword(nextKeyword);
    }
  }, [filters.keyword, keyword]);

  // Sync experience from filters
  useEffect(() => {
    const currentMin =
      typeof filters.experienceMin === "number"
        ? filters.experienceMin
        : undefined;
    const currentMax =
      typeof filters.experienceMax === "number"
        ? filters.experienceMax
        : undefined;

    if (currentMin === undefined && currentMax === undefined) {
      if (experienceValue !== "ALL") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExperienceValue("ALL");
      }
      return;
    }

    const match = EXPERIENCE_PRESETS.find(
      (option) => option.min === currentMin && option.max === currentMax
    );
    if (match && experienceValue !== match.value) {
      setExperienceValue(match.value);
    }
  }, [filters.experienceMin, filters.experienceMax, experienceValue]);

  // Sync salary from filters
  useEffect(() => {
    if (filters.negotiable) {
      if (salaryPreset !== "NEGOTIABLE") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSalaryPreset("NEGOTIABLE");
      }
      if (customSalaryMin || customSalaryMax) {
        setCustomSalaryMin("");
        setCustomSalaryMax("");
      }
      return;
    }

    const currentMin =
      typeof filters.salaryMin === "number" ? filters.salaryMin : undefined;
    const currentMax =
      typeof filters.salaryMax === "number" ? filters.salaryMax : undefined;

    if (currentMin === undefined && currentMax === undefined) {
      if (salaryPreset !== "ALL") {
        setSalaryPreset("ALL");
      }
      if (customSalaryMin || customSalaryMax) {
        setCustomSalaryMin("");
        setCustomSalaryMax("");
      }
      return;
    }

    const match = SALARY_PRESETS.find(
      (option) =>
        !option.negotiable &&
        option.min === currentMin &&
        option.max === currentMax
    );

    if (match) {
      if (salaryPreset !== match.value) {
        setSalaryPreset(match.value);
      }
      if (customSalaryMin || customSalaryMax) {
        setCustomSalaryMin("");
        setCustomSalaryMax("");
      }
      return;
    }

    setSalaryPreset("CUSTOM");
    setCustomSalaryMin(currentMin ? String(currentMin / MILLION) : "");
    setCustomSalaryMax(currentMax ? String(currentMax / MILLION) : "");
  }, [
    filters.salaryMin,
    filters.salaryMax,
    filters.negotiable,
    salaryPreset,
    customSalaryMin,
    customSalaryMax,
  ]);

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = window.setTimeout(() => {
      onFilterChange({ ...filters, keyword: value || undefined, page: 1 });
    }, 400);
  };

  const handleExperienceChange = (value: string) => {
    setExperienceValue(value);
    const selected = EXPERIENCE_PRESETS.find(
      (option) => option.value === value
    );
    onFilterChange({
      ...filters,
      experienceMin: selected?.min,
      experienceMax: selected?.max,
      page: 1,
    });
  };

  const handleSalaryPresetChange = (value: string) => {
    setSalaryPreset(value);
    setCustomSalaryMin("");
    setCustomSalaryMax("");
    const selected = SALARY_PRESETS.find((option) => option.value === value);
    onFilterChange({
      ...filters,
      salaryMin: selected?.min,
      salaryMax: selected?.max,
      negotiable: selected?.negotiable ?? undefined,
      page: 1,
    });
  };

  const handleCustomSalaryApply = () => {
    if (!customSalaryMin && !customSalaryMax) {
      handleSalaryPresetChange("ALL");
      return;
    }

    const minValue = customSalaryMin
      ? Number(customSalaryMin) * MILLION
      : undefined;
    const maxValue = customSalaryMax
      ? Number(customSalaryMax) * MILLION
      : undefined;

    if ((minValue ?? 0) > (maxValue ?? Infinity)) {
      return;
    }

    setSalaryPreset("CUSTOM");
    onFilterChange({
      ...filters,
      salaryMin: minValue,
      salaryMax: maxValue,
      negotiable: undefined,
      page: 1,
    });
  };

  const handleWorkingTypeChange = (type: string) => {
    onFilterChange({
      ...filters,
      workingType: type === "" ? undefined : (type as WorkingType),
      page: 1,
    });
  };

  const handleRankLevelChange = (rank: string) => {
    onFilterChange({
      ...filters,
      rankLevel: rank === "" ? undefined : (rank as RankLevel),
      page: 1,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setExperienceValue("ALL");
    setSalaryPreset("ALL");
    setCustomSalaryMin("");
    setCustomSalaryMax("");
    onFilterChange({
      page: 1,
      size: pageSize,
    });
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    keyword,
    experienceValue,
    salaryPreset,
    customSalaryMin,
    customSalaryMax,
    handleKeywordChange,
    handleExperienceChange,
    handleSalaryPresetChange,
    handleCustomSalaryApply,
    handleWorkingTypeChange,
    handleRankLevelChange,
    handleReset,
    setKeyword,
    setExperienceValue,
    setSalaryPreset,
    setCustomSalaryMin,
    setCustomSalaryMax,
  };
};
