/**
 * ForumAdminLayout
 * Layout wrapper for forum admin pages with sidebar navigation
 */

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/features/home/components/Header";
import { ForumAdminSidebar } from "@/features/forum/admin/components/ForumAdminSidebar";
import { useAuth } from "@/features/auth/context/useAuth";

export function ForumAdminLayout() {
  const { user, isAuthenticated } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  // Auto-open sidebar on first visit (Admin only)
  useEffect(() => {
    const initializeSidebar = () => {
      if (isAuthenticated && user?.id && user?.role === "ADMIN") {
        const autoOpenKey = `forum_admin_sidebar_opened_${user.id}`;
        const hasAutoOpened = sessionStorage.getItem(autoOpenKey);

        if (!hasAutoOpened) {
          setSidebarOpen(true);
          sessionStorage.setItem(autoOpenKey, "true");
        }
      }
    };

    initializeSidebar();
  }, [isAuthenticated, user?.id, user?.role]);

  // Close sidebar on logout
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem(`forum_admin_sidebar_opened_${user?.id}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(false);
    }
  }, [isAuthenticated, user?.id]);

  // Close sidebar if user is not admin
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSidebarOpen(false);
    }
  }, [user]);

  // Prevent body scroll when sidebar open
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
      {/* Header */}
      <header className="sticky top-0 z-60 w-full bg-white border-b border-slate-100">
        <Header onMenuClick={toggleSidebar} />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <aside
          className={`
            fixed top-16 left-0 z-50 h-[calc(100vh-64px)] w-72 bg-white shadow-2xl border-r border-slate-100
            transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:relative md:top-0 md:translate-x-0 md:shadow-none
          `}
        >
          <ForumAdminSidebar onItemClick={closeSidebar} />
        </aside>

        {/* Overlay on mobile when sidebar open */}
        {isSidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 top-16 z-40 bg-slate-900/30 transition-opacity duration-300 animate-in fade-in md:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default ForumAdminLayout;
