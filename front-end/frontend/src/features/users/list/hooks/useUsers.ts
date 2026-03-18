import { useState, useCallback, useEffect, useRef } from "react";
import type { UserTableRow } from "../components/UserListTable";

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

// Mock data for development
const MOCK_USERS: UserTableRow[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    username: "sarah.jenkins",
    email: "sarah.j@techflow.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBVA08Kig8d0fYgZtyZyRIS7irUYiNhNBMxDa9hoZmIhsYn3hVzi4dObD5-AZ1H607i3nbKRgrTr4pwEacOTQhqPIYwnc4KiuSr4W3TOi8f0NCzeXSp4CgOqr_Yyum1N8XVu3HYsWJlhu_08TjVLsTR2XGkg18aRUNljfSOAoQSvVqtMZOSqykmBi-LNymzHanECMWhiwoaanK60-_OdAhTjVuGllvivOmO85kS81C7Okgp5VIoCrKeP758YKXS77WYzQAwYrySz1k",
    role: "Manager",
    status: "Active",
    company: "TechFlow Inc.",
  },
  {
    id: "2",
    name: "Marcus Thorne",
    username: "marcus.thorne",
    email: "m.thorne@lunar-creative.io",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAtXHH60Dpa0bCm5wao5re86rHNGP1onq_4orRsSy4V5MNBlKb_b-eVPpTlKCDTa6uMIXWifUwwBgBN8PMkfnKgOL5XUYjFWdsD_PuohvAXVz_Kz9stziL894A1Eu1CF_GI5gkVf36fzeRXDvD0ArVnhgf7eNZG9vMso_rihVvhFAR-ECoGGL1Y8qu-WHVBI1Eh07jssqPYXo7YUhzFV0Dsw73uhu5QJSd38Df-h0NkeXDQWtqsctNk23dm1RWrIbHZHx4vjYUBlX8",
    role: "Admin",
    status: "Active",
    company: "Lunar Creative",
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    username: "elena.rodriguez",
    email: "e.rodriguez@nexus.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4hXbjIzcuMKiMAtqdbJIiQhsolnt3ewfHaxgZHV7vBoqGdjyfrY9CYLizUa5TuridlM6PGG4J00Tq3jLMprXLJ5c5nb74nK1S__u4n5ewfWJQDaW_pJatUqqK-qXM7YPiZR30PmW-hslEMN-mozyE1IiS2aVNC5Yinh8kReaSXH5rlqcMfzpf0zXR4LkdAG3IA-gIPcIaf1fswJN-A5KFbx2I0J7PhrT2T4vEceYNdkvCwo9cYisqQqcdQhOp--oHW8oFqqctZCE",
    role: "Viewer",
    status: "Inactive",
    company: "Nexus Solutions",
    isLocked: true,
  },
  {
    id: "4",
    name: "David Chen",
    username: "david.chen",
    email: "d.chen@nexus.com",
    role: "Editor",
    status: "Active",
    company: "Nexus Solutions",
  },
  {
    id: "5",
    name: "Alice Wong",
    username: "alice.wong",
    email: "a.wong@techflow.com",
    role: "Admin",
    status: "Active",
    company: "TechFlow Inc.",
  },
];

export const useUsers = (pageSize: number = 10): UseUserListReturn => {
  const [users] = useState<UserTableRow[]>(MOCK_USERS);
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

  // Simulate initial data fetch
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
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
    setLoading(true);
    try {
      // In a real app, this would call an API
      // await fetchUsers();
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
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
