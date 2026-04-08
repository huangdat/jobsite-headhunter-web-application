import { useState } from "react";
import { MdOutlineHandshake } from "react-icons/md";
import { HiMenu } from "react-icons/hi";
import { Link } from "react-router-dom";
import { Button } from "@/shared/ui-primitives/button";
import { useAppTranslation } from "@/shared/hooks";
import { useAuth } from "@/features/auth/context/useAuth";

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
}) => {
  const { t } = useAppTranslation();
  const { user, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
  };

  const userInitial = user?.username?.charAt(0).toUpperCase() || "A";

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 dark:border-slate-700 h-16 flex items-center">
      <div className="w-full px-4 md:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Menu Button - Toggle Sidebar */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-slate-600 cursor-pointer hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            title={sidebarCollapsed ? "Expand menu" : "Collapse menu"}
          >
            <HiMenu className="text-2xl" />
          </Button>

          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-brand-primary p-1.5 rounded-lg">
              <MdOutlineHandshake className="text-black text-lg" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Job<span className="text-brand-primary">Site</span>
            </span>
          </Link>
        </div>

        {/* Right: User Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-10 h-10 rounded-full cursor-pointer bg-brand-primary text-black hover:bg-brand-primary/90 font-semibold text-sm"
          >
            {userInitial}
          </Button>

          {dropdownOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
              <div className="p-2">
                <Link
                  to="/admin/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  {t("navigation.dashboard") || "Admin Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 cursor-pointer py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                >
                  {t("navigation.logout") || "Logout"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
