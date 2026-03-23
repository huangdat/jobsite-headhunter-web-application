import { Link } from "react-router-dom";
import { BiSolidBriefcase, BiSolidFileDoc, BiChart, BiCog, BiHeadphone } from "react-icons/bi";

export function HeadhunterSidebar() {
  const items = [
    { to: "/headhunter/jobs", label: "Tin tuyển dụng", icon: BiSolidBriefcase },
    { to: "/headhunter/cv", label: "Quản lý CV", icon: BiSolidFileDoc },
    { to: "/headhunter/reports", label: "Báo cáo tuyển dụng", icon: BiChart },
    { to: "/headhunter/services", label: "Dịch vụ của tôi", icon: BiSolidBriefcase },
    { to: "/headhunter/promotions", label: "Mã ưu đãi", icon: BiSolidBriefcase },
    { to: "/headhunter/orders", label: "Theo dõi đơn hàng", icon: BiSolidFileDoc },
    { to: "/headhunter/activity", label: "Lịch sử hoạt động", icon: BiChart },
    { to: "/settings", label: "Cài đặt tài khoản", icon: BiCog },
    { to: "/support", label: "Hộp thư hỗ trợ", icon: BiHeadphone },
  ];

  const IconComponent = (Icon: any) => <Icon className="w-5 h-5 text-slate-700" />;

  return (
    <aside className="w-72 bg-white text-black min-h-screen p-6 shadow-2xl">
      <div className="mb-6 pb-4">
        <div className="text-lg font-bold tracking-wide">Nhà tuyển dụng</div>
        <div className="text-xs text-slate-600 mt-1">Tài khoản: Headhunter</div>
        <div className="mt-4">
          <Link
            to="/headhunter/jobs/new"
            className="inline-block w-full text-center bg-[var(--brand-primary)] text-black py-2 rounded-lg font-semibold hover:bg-[var(--brand-hover)] transition-colors"
          >
            Đăng tin mới
          </Link>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-900 border border-transparent hover:border-l-4 hover:border-[var(--brand-primary)] hover:shadow-md transition-all duration-200"
          >
            {it.icon && IconComponent(it.icon)}
            <span>{it.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default HeadhunterSidebar;
