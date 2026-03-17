import { useState, useCallback } from 'react';
import type { UserTableRow } from '../components/UserListTable';

export interface UseUserListReturn {
  users: UserTableRow[];
  loading: boolean;
  error: string | null;
  searchValue: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  filters: {
    role?: string;
    status?: string;
    company?: string;
  };
  setSearchValue: (value: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setFilters: (filters: any) => void;
  clearFilters: () => void;
  refetch: () => Promise<void>;
}

// Mock data for development
const MOCK_USERS: UserTableRow[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@techflow.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVA08Kig8d0fYgZtyZyRIS7irUYiNhNBMxDa9hoZmIhsYn3hVzi4dObD5-AZ1H607i3nbKRgrTr4pwEacOTQhqPIYwnc4KiuSr4W3TOi8f0NCzeXSp4CgOqr_Yyum1N8XVu3HYsWJlhu_08TjVLsTR2XGkg18aRUNljfSOAoQSvVqtMZOSqykmBi-LNymzHanECMWhiwoaanK60-_OdAhTjVuGllvivOmO85kS81C7Okgp5VIoCrKeP758YKXS77WYzQAwYrySz1k',
    role: 'Manager',
    status: 'Active',
    company: 'TechFlow Inc.',
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    email: 'm.thorne@lunar-creative.io',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtXHH60Dpa0bCm5wao5re86rHNGP1onq_4orRsSy4V5MNBlKb_b-eVPpTlKCDTa6uMIXWifUwwBgBN8PMkfnKgOL5XUYjFWdsD_PuohvAXVz_Kz9stziL894A1Eu1CF_GI5gkVf36fzeRXDvD0ArVnhgf7eNZG9vMso_rihVvhFAR-ECoGGL1Y8qu-WHVBI1Eh07jssqPYXo7YUhzFV0Dsw73uhu5QJSd38Df-h0NkeXDQWtqsctNk23dm1RWrIbHZHx4vjYUBlX8',
    role: 'Admin',
    status: 'Active',
    company: 'Lunar Creative',
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'e.rodriguez@nexus.com',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4hXbjIzcuMKiMAtqdbJIiQhsolnt3ewfHaxgZHV7vBoqGdjyfrY9CYLizUa5TuridlM6PGG4J00Tq3jLMprXLJ5c5nb74nK1S__u4n5ewfWJQDaW_pJatUqqK-qXM7YPiZR30PmW-hslEMN-mozyE1IiS2aVNC5Yinh8kReaSXH5rlqcMfzpf0zXR4LkdAG3IA-gIPcIaf1fswJN-A5KFbx2I0J7PhrT2T4vEceYNdkvCwo9cYisqQqcdQhOp--oHW8oFqqctZCE',
    role: 'Viewer',
    status: 'Inactive',
    company: 'Nexus Solutions',
    isLocked: true,
  },
  {
    id: '4',
    name: 'David Chen',
    email: 'd.chen@nexus.com',
    role: 'Editor',
    status: 'Active',
    company: 'Nexus Solutions',
  },
  {
    id: '5',
    name: 'Alice Wong',
    email: 'a.wong@techflow.com',
    role: 'Admin',
    status: 'Active',
    company: 'TechFlow Inc.',
  },
];

export const useUserList = (pageSize: number = 25): UseUserListReturn => {
  const [users] = useState<UserTableRow[]>(MOCK_USERS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);
  const [filters, setFilters] = useState<{
    role?: string;
    status?: string;
    company?: string;
  }>({});

  // Filter and search logic
  const filteredUsers = users.filter((user) => {
    const searchLower = searchValue.toLowerCase();
    const matchesSearch = !searchValue || [
      user.name,
      user.email,
    ].some((field) => field.toLowerCase().includes(searchLower));

    const matchesRole = !filters.role || user.role === filters.role;
    const matchesStatus = !filters.status || user.status === filters.status;
    const matchesCompany = !filters.company || user.company === filters.company;

    return matchesSearch && matchesRole && matchesStatus && matchesCompany;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const totalItems = filteredUsers.length;

  // Get paginated items
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = useCallback(() => {
    setSearchValue('');
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
      setError(err instanceof Error ? err.message : 'Unknown error');
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
    filters,
    setSearchValue,
    setCurrentPage,
    setItemsPerPage,
    setFilters,
    clearFilters,
    refetch,
  };
};
