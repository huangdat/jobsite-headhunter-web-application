import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserListHeader,
  UserListTable,
  UserListEmpty,
  UserListLoading,
  UserListPagination,
} from "@/features/users/list/components";
import { UserFilters } from "@/features/users/components/common/UserFilters";
import { useUsers } from "@/features/users/list/hooks/useUsers";
import { PageContainer } from "@/shared/components/layout";

interface UserListPageProps {
  onAddNewUser?: () => void;
}

export const UserListPage: React.FC<UserListPageProps> = ({ onAddNewUser }) => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  const {
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
  } = useUsers();

  const handleSort = (field: string, shiftKey?: boolean) => {
    let newSort = [...sortBy];

    if (shiftKey) {
      // Multi-sort (Shift+Click)
      const existingSort = newSort.findIndex((s) => s.field === field);
      if (existingSort >= 0) {
        // Toggle direction if already sorting by this field
        // eslint-disable-next-line security/detect-object-injection
        newSort[existingSort].direction =
          // eslint-disable-next-line security/detect-object-injection
          newSort[existingSort].direction === "asc" ? "desc" : "asc";
      } else {
        // Add new sort criteria
        newSort.push({ field, direction: "asc" });
      }
    } else {
      // Single sort (regular click)
      const existingSort = newSort.find((s) => s.field === field);
      if (existingSort) {
        // Toggle direction if already sorting by this field
        newSort = [
          {
            field,
            direction: existingSort.direction === "asc" ? "desc" : "asc",
          },
        ];
      } else {
        // Reset and sort by this field
        newSort = [{ field, direction: "asc" }];
      }
    }

    setSortBy(newSort);
  };

  const activeFilters = [
    filters.role && { type: "role" as const, value: filters.role },
    filters.status && { type: "status" as const, value: filters.status },
  ].filter(Boolean) as Array<{
    type: "role" | "status";
    value: string;
  }>;

  const handleRemoveFilter = (filterType: "role" | "status") => {
    setFilters({ ...filters, [filterType]: undefined });
  };

  return (
    <PageContainer variant="default" maxWidth="7xl">
      {/* Header with inline filters */}
      <UserListHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFilterClick={() => setShowFilters(!showFilters)}
        onGroupByChange={(value) => {
          // TODO: Implement group by feature
          console.debug("Group by:", value);
        }}
        onAddUserClick={onAddNewUser}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearFilters={clearFilters}
        filterPanel={
          showFilters && (
            <>
              {/* Backdrop overlay */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowFilters(false)}
              />

              {/* Filter dropdown */}
              <div
                ref={filterRef}
                className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-background-dark 
                            border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl z-50 
                            max-h-125 overflow-y-auto"
              >
                <div className="p-4">
                  <UserFilters
                    filters={filters}
                    onApply={(newFilters) => {
                      setFilters(newFilters);
                      setCurrentPage(1);
                      setShowFilters(false);
                    }}
                    onClear={() => {
                      clearFilters();
                      setShowFilters(false);
                    }}
                  />
                </div>
              </div>
            </>
          )
        }
      />

      {/* Content Area */}
      <div className="mt-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <UserListLoading />
        ) : users.length === 0 ? (
          <UserListEmpty onClearFilters={clearFilters} />
        ) : (
          <>
            <UserListTable
              users={users}
              isLoading={loading}
              sortBy={sortBy}
              onSort={handleSort}
              onViewDetails={(userId) => {
                navigate(`/admin/users/${userId}`);
              }}
              onLockUser={(userId) => {
                console.log("🔒 Lock user action:", userId);
              }}
              onUnlockUser={(userId) => {
                console.log("🔓 Unlock user action:", userId);
              }}
              onDeleteUser={(userId) => {
                console.log("🗑️ Delete user action:", userId);
              }}
            />
            <UserListPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </>
        )}
      </div>
    </PageContainer>
  );
};

export default UserListPage;
