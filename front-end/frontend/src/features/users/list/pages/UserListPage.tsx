import React, { useState } from "react";
import {
  UserListHeader,
  UserListTable,
  UserListEmpty,
  UserListLoading,
  UserListPagination,
  FilterBadge,
} from "../components";
import { useUserList } from "../hooks/useUserList";

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
  } = useUserList();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);

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
                console.log("📋 Opening view details modal for user:", userId);
                setSelectedUserId(userId);
                setShowViewDetailsModal(true);
              }}
              onLockUser={(userId) => {
                console.log("🔒 Opening lock user modal for user:", userId);
                setSelectedUserId(userId);
                setShowLockModal(true);
              }}
              onDeleteUser={(userId) => {
                console.log("🗑️ Opening delete user modal for user:", userId);
                setSelectedUserId(userId);
                setShowDeleteModal(true);
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

      {/* Mock Modals */}
      {/* View Details Modal */}
      {showViewDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">User Details</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Viewing details for user ID: <strong>{selectedUserId}</strong>
            </p>
            <button
              onClick={() => {
                console.log("✅ Closing view details modal");
                setShowViewDetailsModal(false);
                setSelectedUserId(null);
              }}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Lock User Modal */}
      {showLockModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Lock User</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to lock user ID:{" "}
              <strong>{selectedUserId}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  console.log("📋 Canceled lock for user:", selectedUserId);
                  setShowLockModal(false);
                  setSelectedUserId(null);
                }}
                className="flex-1 bg-slate-200 text-slate-900 py-2 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("✅ Confirmed lock for user:", selectedUserId);
                  setShowLockModal(false);
                  setSelectedUserId(null);
                }}
                className="flex-1 bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition-colors"
              >
                Lock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-red-600 mb-4">Delete User</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to permanently delete user ID:{" "}
              <strong>{selectedUserId}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  console.log("📋 Canceled delete for user:", selectedUserId);
                  setShowDeleteModal(false);
                  setSelectedUserId(null);
                }}
                className="flex-1 bg-slate-200 text-slate-900 py-2 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("✅ Confirmed delete for user:", selectedUserId);
                  setShowDeleteModal(false);
                  setSelectedUserId(null);
                }}
                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserListPage;
