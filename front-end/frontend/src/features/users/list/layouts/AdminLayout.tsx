import { useState, useEffect } from "react";
import { AdminHeader } from "../components/AdminHeader";
import { AdminSidebar } from "../components/AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("admin_sidebar_collapsed");
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    } else {
      setSidebarCollapsed(true);
    }
  }, []);

  const handleToggleSidebar = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("admin_sidebar_collapsed", JSON.stringify(newState));
  };

  const closeSidebar = () => {
    setSidebarCollapsed(true);
    localStorage.setItem("admin_sidebar_collapsed", JSON.stringify(true));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      <AdminHeader
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      <div className="flex-1 overflow-hidden relative">
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 top-16 cursor-pointer bg-black/20 z-30"
            onClick={closeSidebar}
          />
        )}

        <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-40">
          <AdminSidebar
            isCollapsed={sidebarCollapsed}
            onItemClick={closeSidebar}
          />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
};
