import { useState, useCallback, useEffect, useRef } from "react";
import type { UserTableRow } from "@/features/users/list/components/UserListTable";
import { usersApi } from "@/features/users/services/usersApi";
import { userMapper } from "@/features/users/utils/userMapper";
import { DEBOUNCE_DELAY } from "@/features/users/constants";
import { useUsersTranslation } from "@/shared/hooks";

export interface UseUserListReturn {
  users: UserTableRow[];
  loading: boolean;
  error: string | null;
  searchValue: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  sortBy: { field: string; direction: "asc" | "desc" }[];
  filters: {
    role?: string;
    status?: string;
    company?: string;
  };
  setSearchValue: (value: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setFilters: (filters: Record<string, string | undefined>) => void;
  setSortBy: (sort: { field: string; direction: "asc" | "desc" }[]) => void;
  clearFilters: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useUsers = (pageSize: number = 10): UseUserListReturn => {
  const { t } = useUsersTranslation();
  const [users, setUsers] = useState<UserTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [sortBy, setSortBy] = useState<
    { field: string; direction: "asc" | "desc" }[]
  >([]);
  const [filters, setFilters] = useState<{
    role?: string;
    status?: string;
  }>({});
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search (300ms)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1); // Reset to page 1 on search
    }, DEBOUNCE_DELAY.SEARCH);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue]);

  // Server-side fetch function (reusable)
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      // Build sort string from sortBy array
      // Format: "field1,asc;field2,desc"
      const sortString =
        sortBy.length > 0
          ? sortBy.map((s) => `${s.field},${s.direction}`).join(";")
          : undefined;

      // Call searchUsers with server-side params
      const res = await usersApi.searchUsers({
        page: currentPage,
        size: itemsPerPage,
        keyword: debouncedSearch || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
        sort: sortString,
      });

      // Map response items to table rows
      const mappedUsers = userMapper.toTableRows(res.items);

      // Update state with server response
      setUsers(mappedUsers);
      setTotalPages(res.totalPages);
      setTotalItems(res.total);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("common.failedToFetchUsers");
      setError(errorMessage);
      console.error("Error fetching users:", err);
      setUsers([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, debouncedSearch, filters, sortBy, t]);

  // Fetch whenever dependencies change (server-side)
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const clearFilters = useCallback(async () => {
    setSearchValue("");
    setFilters({});
    setCurrentPage(1);
  }, []);

  // Refetch with current filters
  const refetch = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    searchValue,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    sortBy,
    filters,
    setSearchValue,
    setCurrentPage,
    setItemsPerPage,
    setFilters,
    setSortBy,
    clearFilters,
    refetch,
  };
};
