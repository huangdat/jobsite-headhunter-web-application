import React from 'react';

interface UserListEmptyProps {
  onClearFilters?: () => void;
}

export const UserListEmpty: React.FC<UserListEmptyProps> = ({ onClearFilters }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <div className="flex flex-col items-center justify-center min-h-[calc(400px)] p-12 text-center">
        <div className="size-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
          <span className="material-symbols-outlined text-4xl">search_off</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
          No results found
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm">
          We couldn't find any users matching your search criteria. Try adjusting your filters
          or search terms.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-6 px-4 py-2 text-primary font-bold text-sm hover:bg-primary/5 rounded-lg transition-colors"
        >
          Clear all filters
        </button>
      </div>
    </div>
  );
};
