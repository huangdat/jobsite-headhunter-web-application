import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/features/home/components/Header";
import HeadhunterSidebar from "@/features/headhunter/components/HeadhunterSidebar";
import { useAuth } from "@/features/auth/context/useAuth";

export function HeadhunterLayout() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Mặc định ban đầu là đóng
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    if (
      isAuthenticated &&
      user?.id &&
      user?.role?.toUpperCase().includes("HEADHUNTER")
    ) {
      const autoOpenKey = `hh_sidebar_opened_${user.id}`;
      const hasAutoOpened = sessionStorage.getItem(autoOpenKey);

      if (!hasAutoOpened) {
        setSidebarOpen(true);
        sessionStorage.setItem(autoOpenKey, "true");
        sessionStorage.removeItem("sidebar_auto_opened");
        sessionStorage.removeItem("sidebar_session_opened");
      }
    }
  }, [isAuthenticated, user?.id, user?.role]);

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.clear();
      closeSidebar();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user && !user.role?.toUpperCase().includes("HEADHUNTER")) {
      closeSidebar();
    }
  }, [user]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 relative">
      <header className="sticky top-0 z-[60] w-full bg-white border-b border-slate-100">
        <Header onMenuClick={toggleSidebar} />
      </header>

      <div className="flex flex-1 relative">
        {/* SIDEBAR */}
        <aside
          className={`
            fixed top-16 left-0 z-50 h-[calc(100vh-64px)] w-72 bg-white shadow-2xl border-r border-slate-100
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <HeadhunterSidebar onItemClick={closeSidebar} />
        </aside>

        {isSidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 top-16 z-40 bg-slate-900/30 transition-opacity duration-300 animate-in fade-in cursor-pointer"
          />
        )}

        {/* MAIN CONTENT */}
        <main className="flex-1 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default HeadhunterLayout;
