import { Outlet } from "react-router-dom";
import { Header } from "@/features/home/components/Header";
import { Footer } from "@/features/home/components/Footer";
import { HeadhunterLayout } from "@/shared/layouts/HeadhunterLayout";
import { useAuth } from "@/features/auth/context/useAuth";

export function MainLayout() {
  const { user } = useAuth();

  if (user?.role?.toLowerCase() === "headhunter") {
    return <HeadhunterLayout />;
  }

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
