import React, { useState } from "react";
import {
  UserListHeader,
  UserListTable,
  UserListEmpty,
  UserListLoading,
  UserListPagination,
  FilterBadge,
} from "../components";
import { useUsers } from "../hooks/useUsers";

interface UserListPageProps {
  onAddNewUser?: () => void;
}

export const UserListPage: React.FC<UserListPageProps> = ({ onAddNewUser }) => {
  const {
    users,
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
  } = useUsers();

  const [showFilters, setShowFilters] = useState(false);

  const activeFilters = [
    filters.role && { label: "Role", value: filters.role },
    filters.status && { label: "Status", value: filters.status },
    filters.company && { label: "Company", value: filters.company },
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const handleRemoveFilter = (label: string) => {
    const filterKey = label.toLowerCase() as keyof typeof filters;
    setFilters({ ...filters, [filterKey]: undefined });
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Header */}
      <UserListHeader
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onFilterClick={() => setShowFilters(!showFilters)}
        onGroupByChange={(value) => {
          console.log("Group by:", value);
        }}
        onAddUserClick={onAddNewUser}
      />

      {/* Quick Filters Bar */}
      {activeFilters.length > 0 && (
        <div className="px-6 flex flex-wrap gap-2 items-center py-2 bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800">
          {activeFilters.map((filter) => (
            <FilterBadge
              key={`${filter.label}-${filter.value}`}
              label={filter.label}
              value={filter.value}
              onRemove={() => handleRemoveFilter(filter.label)}
            />
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-primary font-medium underline underline-offset-4 ml-2"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-auto px-6 pb-6 pt-6">
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
              onViewDetails={(userId) => {
                console.log("📋 View user details:", userId);
              }}
              onLockUser={(userId) => {
                console.log("🔒 Lock user action:", userId);
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
    </main>
  );
};

export default UserListPage;
