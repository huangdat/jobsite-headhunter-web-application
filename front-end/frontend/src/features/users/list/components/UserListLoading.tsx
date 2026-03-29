import React from "react";

export const UserListLoading: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                  User{" "}
                  <span className="material-symbols-outlined text-sm">
                    unfold_more
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                  Role{" "}
                  <span className="material-symbols-outlined text-sm">
                    unfold_more
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                  Status{" "}
                  <span className="material-symbols-outlined text-sm">
                    unfold_more
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                  Company{" "}
                  <span className="material-symbols-outlined text-sm">
                    unfold_more
                  </span>
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {[...Array(6)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                    <div className="flex flex-col gap-2">
                      <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-3 w-40 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-6 w-16 bg-slate-100 dark:bg-slate-800 rounded-full"></div>
                </td>
                <td className="px-6 py-5">
                  <div className="h-4 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="inline-block h-8 w-8 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Loading */}
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
