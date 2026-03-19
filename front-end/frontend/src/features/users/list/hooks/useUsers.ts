import { useState, useCallback, useEffect, useRef } from "react";
import type { UserTableRow } from "../components/UserListTable";
import { usersApi } from "../../services/usersApi";
import { userMapper } from "../../utils/userMapper";

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
  setFilters: (filters: any) => void;
  setSortBy: (sort: { field: string; direction: "asc" | "desc" }[]) => void;
  clearFilters: () => void;
  refetch: () => Promise<void>;
}

export const useUsers = (pageSize: number = 10): UseUserListReturn => {
  const [users, setUsers] = useState<UserTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [sortBy, setSortBy] = useState<
    { field: string; direction: "asc" | "desc" }[]
  >([]);
  const [filters, setFilters] = useState<{
    role?: string;
    status?: string;
    company?: string;
  }>({});
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch users from API on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await usersApi.getUsers();
        const mappedUsers = userMapper.toTableRows(data);
        setUsers(mappedUsers);
        setError(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch users";
        setError(errorMessage);
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Debounce search (300ms)
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setCurrentPage(1); // Reset to page 1 on search
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchValue]);

  // Filter, search, and sort logic
  const filteredUsers = users
    .filter((user) => {
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch =
        !debouncedSearch ||
        [user.name, user.email, user.username].some((field) =>
          field.toLowerCase().includes(searchLower)
        );

      const matchesRole = !filters.role || user.role === filters.role;
      const matchesStatus = !filters.status || user.status === filters.status;
      const matchesCompany =
        !filters.company || user.company === filters.company;

      return matchesSearch && matchesRole && matchesStatus && matchesCompany;
    })
    .sort((a, b) => {
      // Apply multiple sort criteria
      for (const sort of sortBy) {
        const aVal = (a as any)[sort.field];
        const bVal = (b as any)[sort.field];

        if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const totalItems = filteredUsers.length;

  // Get paginated items
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = useCallback(() => {
    setSearchValue("");
    setFilters({});
    setCurrentPage(1);
  }, []);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await usersApi.getUsers();
      const mappedUsers = userMapper.toTableRows(data);
      setUsers(mappedUsers);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(errorMessage);
      console.error("Error refetching users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users: paginatedUsers,
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
