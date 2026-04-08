import { Outlet } from "react-router-dom";
import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { HeadhunterLayout } from "@/shared/layouts/HeadhunterLayout";
import { AdminLayout } from "@/features/users/list/layouts/AdminLayout";
import { useAuth } from "@/features/auth/context/useAuth";

export function MainLayout() {
  const { user } = useAuth();

  // Admin users get admin layout
  if (user?.role?.toLowerCase().includes("admin")) {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }

  // Headhunter users get headhunter layout
  if (user?.role?.toLowerCase() === "headhunter") {
    return <HeadhunterLayout />;
  }

  // Everyone else gets standard layout
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
