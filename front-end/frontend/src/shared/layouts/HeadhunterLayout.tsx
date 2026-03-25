import { Outlet } from "react-router-dom";
import { Header } from "@/features/home/components/Header";
import HeadhunterSidebar from "@/features/headhunter/components/HeadhunterSidebar";

export function HeadhunterLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <HeadhunterSidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default HeadhunterLayout;

