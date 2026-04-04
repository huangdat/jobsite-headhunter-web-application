import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineHandshake } from "react-icons/md";
import { HiMenu } from "react-icons/hi"; // Thêm icon Menu
import { useAuth } from "@/features/auth/context/useAuth";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Navbar } from "./Navbar";

// Thêm Interface cho Props
interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user } = useAuth();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userInitial = useMemo(
    () => user?.username?.charAt(0).toUpperCase() || "U",
    [user?.username]
  );

  const normalizedRole = user?.role
    ? user.role.replace(/^roles\./i, "").toLowerCase()
    : "";

  const isHeadhunter = normalizedRole === "headhunter";

  const handleLogout = async () => {
    await signOut();
    navigate("/home");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isHeadhunter && (
            <button
              aria-label={t("navigation.openMenu") || "Open menu"}
              onClick={onMenuClick}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-2xl text-slate-700 cursor-pointer"
            >
              <HiMenu />
            </button>
          )}

          {/* LOGO */}
          <Link to="/home" className="flex items-center gap-2">
            <div className="bg-brand-primary p-1.5 rounded-lg">
              <MdOutlineHandshake className="text-black text-lg" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Job<span className="text-brand-primary">Site</span>
            </span>
          </Link>

          <div className="ml-8 hidden lg:block">
            <Navbar />
          </div>
        </div>

        {/* RIGHT SIDE: Auth Buttons / User Dropdown */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium hover:text-emerald-600 transition"
              >
                {t("navigation.login")}
              </Link>
              <Link
                to="/select-role"
                className="bg-brand-primary text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-brand-hover transition"
              >
                {t("navigation.signUp")}
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-black font-semibold cursor-pointer hover:opacity-85 transition"
              >
                {userInitial}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-border rounded-xl shadow-xl overflow-hidden z-50">
                  {/* User Profile Info */}
                  <div className="px-4 py-3 bg-slate-50 border-b border-border flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-black font-semibold text-sm">
                      {userInitial}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {user?.username}
                      </p>
                      <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 uppercase">
                        {normalizedRole}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        if (isHeadhunter) {
                          navigate("/headhunter/business");
                        } else if (normalizedRole === "collaborator") {
                          navigate("/collaborator/commission");
                        } else if (normalizedRole === "admin") {
                          navigate("/admin/dashboard");
                        } else {
                          navigate("/candidate/profile");
                        }
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      {t("navigation.profile")}
                    </button>

                    {isHeadhunter ? (
                      <button
                        onClick={() => {
                          navigate("/headhunter/jobs");
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                      >
                        {t("headhunter.approveApplications")}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            navigate("my-applications");
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                        >
                          {t("navigation.applications")}
                        </button>
                        <button
                          onClick={() => {
                            navigate("/saved-jobs");
                            setDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                        >
                          {t("navigation.savedJobs")}
                        </button>
                      </>
                    )}

                    <div className="border-t border-border my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition"
                    >
                      {t("navigation.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
