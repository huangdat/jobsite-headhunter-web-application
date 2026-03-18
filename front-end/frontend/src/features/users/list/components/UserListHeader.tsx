import React from 'react';

interface UserListHeaderProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  onGroupByChange?: (value: string) => void;
  onAddUserClick?: () => void;
}

export const UserListHeader: React.FC<UserListHeaderProps> = ({
  searchValue = '',
  onSearchChange,
  onFilterClick,
  onGroupByChange,
  onAddUserClick,
}) => {
  return (
    <>
      {/* Top Header Bar */}
      <header className="h-16 border-b border-primary/10 bg-white dark:bg-background-dark px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">User Management</h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-400">
              notifications
            </span>
            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-background-dark"></span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-sm">help</span>
            <span className="text-sm font-medium">Documentation</span>
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
          <button
            onClick={onAddUserClick}
            className="bg-primary hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Add New User
          </button>
        </div>
      </header>

      {/* Search & Filter Controls */}
      <div className="p-6 space-y-4 shrink-0 bg-white dark:bg-background-dark">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-[calc(300px)]">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search by name, email, or username..."
                value={searchValue}
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <button
              onClick={onFilterClick}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <span className="material-symbols-outlined text-slate-500">filter_list</span>
              <span className="text-sm font-medium">Filters</span>
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <span>Group By:</span>
              <select
                onChange={(e) => onGroupByChange?.(e.target.value)}
                className="bg-white dark:bg-slate-900 border-none rounded-lg text-sm focus:ring-0 cursor-pointer"
                title="Group users by"
                aria-label="Group users by"
              >
                <option>None</option>
                <option>Role</option>
                <option>Status</option>
                <option>Company</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
