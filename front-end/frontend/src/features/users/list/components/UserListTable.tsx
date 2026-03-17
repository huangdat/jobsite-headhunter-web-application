import React from 'react';

export interface UserTableRow {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'Active' | 'Inactive';
  company: string;
  isLocked?: boolean;
}

interface UserListTableProps {
  users: UserTableRow[];
  onViewDetails?: (userId: string) => void;
  onLockUser?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
}

export const UserListTable: React.FC<UserListTableProps> = ({
  users,
  onViewDetails,
  onLockUser,
  onDeleteUser,
}) => {
  const handleLockClick = (userId: string, isLocked: boolean) => {
    if (isLocked) {
      // Unlock logic
    } else {
      onLockUser?.(userId);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[30%]">
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                USER <span className="material-symbols-outlined text-sm">unfold_more</span>
              </div>
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[15%]">
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                ROLE <span className="material-symbols-outlined text-sm">unfold_more</span>
              </div>
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[15%]">
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                STATUS <span className="material-symbols-outlined text-sm">unfold_more</span>
              </div>
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 w-[25%]">
              <div className="flex items-center gap-1 cursor-pointer hover:text-primary transition-colors">
                COMPANY <span className="material-symbols-outlined text-sm">unfold_more</span>
              </div>
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-[15%]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {users.map((user) => (
            <tr
              key={user.id}
              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
            >
              <td className={`px-6 py-4 ${user.isLocked ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3">
                  <div
                    className={`size-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all ${
                      user.isLocked
                        ? 'bg-slate-200 grayscale'
                        : 'bg-primary/10'
                    }`}
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="size-full object-cover"
                      />
                    ) : (
                      <div className="size-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <div
                  className={`flex items-center gap-1.5 text-xs font-bold ${
                    user.status === 'Active'
                      ? 'text-primary'
                      : 'text-slate-400'
                  }`}
                >
                  <span
                    className={`size-1.5 rounded-full ${
                      user.status === 'Active'
                        ? 'bg-primary'
                        : 'bg-slate-400'
                    }`}
                  ></span>
                  {user.status}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                {user.company}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onViewDetails?.(user.id)}
                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                    title="View Details"
                  >
                    <span className="material-symbols-outlined text-lg">visibility</span>
                  </button>
                  <button
                    onClick={() => handleLockClick(user.id, user.isLocked || false)}
                    className={`p-1.5 rounded-lg transition-all ${
                      user.isLocked
                        ? 'text-amber-500 bg-amber-50'
                        : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
                    }`}
                    title={user.isLocked ? 'Unlock Account' : 'Lock Account'}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {user.isLocked ? 'lock_open' : 'lock'}
                    </span>
                  </button>
                  <button
                    onClick={() => onDeleteUser?.(user.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete User"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
