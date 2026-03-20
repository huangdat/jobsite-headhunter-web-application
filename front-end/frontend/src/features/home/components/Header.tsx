import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineHandshake } from "react-icons/md";
import { useAuth } from "@/features/auth/context/useAuth";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { Navbar } from "./Navbar";

export function Header() {
  const { t } = useAppTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user } = useAuth();
  const userInitial = useMemo(
    () => user?.username?.charAt(0).toUpperCase() || "U",
    [user?.username]
  );

  const handleLogout = async () => {
    await signOut();
    navigate("/home");
  };
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleBadgeClass = user?.role?.toLowerCase() === "candidate"
    ? "bg-sky-100 text-sky-700"
    : user?.role?.toLowerCase() === "headhunter"
    ? "bg-purple-100 text-purple-700"
    : user?.role?.toLowerCase() === "collaborator"
    ? "bg-green-100 text-green-700"
    : "";

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
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* LEFT SIDE (Logo + Nav) */}
        <div className="flex items-center gap-12">
          {/* LOGO */}
          <Link to="/home" className="flex items-center gap-2">
            <div className="bg-brand-primary p-1.5 rounded-lg">
              <MdOutlineHandshake className="text-black text-lg" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Job<span className="text-brand-primary">Site</span>
            </span>
          </Link>

          {/* NAV LINKS */}
          <Navbar />
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium hover:text-lime-800 transition"
              >
                {t("home.navigation.login")}
              </Link>
              <Link
                to="/select-role"
                className="bg-brand-primary text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-brand-hover transition"
              >
                {t("home.navigation.signUp")}
              </Link>
              <Link
                to="/register/headhunter"
                className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
              >
                {t("home.navigation.postJob")}
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-black font-semibold cursor-pointer hover:opacity-85 transition"
              >
                {userInitial}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+8px)] w-56 bg-white border border-border rounded-xl overflow-hidden z-50">
                  {/* Header */}
                  <div className="px-4 py-3 bg-slate-50 border-b border-border flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center text-black font-semibold text-sm shrink-0">
                      {userInitial}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {user?.username}
                      </p>
                      <span
                        className={`inline-block mt-1 text-[11px] px-2 py-0.5 rounded-full font-medium
                ${user?.role === "candidate" ? "bg-sky-100 text-sky-700" : ""}
                ${user?.role === "headhunter" ? "bg-purple-100 text-purple-700" : ""}
                ${user?.role === "collaborator" ? "bg-green-100 text-green-700" : ""}
              `}
                      >
                        {user?.role
                          ? user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)
                          : ""}
                      </span>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="py-1 border-b border-border">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      {t("home.navigation.profile")}
                    </button>
                    {user?.role?.toLowerCase() === "headhunter" ? (
                      <>
                        <button
                          onClick={() => { navigate("/jobs/my"); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          My jobs
                        </button>
                        <button
                          onClick={() => { navigate("/headhunter/applicants"); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          Applicants
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { navigate("/applications"); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          My Applications
                        </button>
                        <button
                          onClick={() => { navigate("/saved-jobs"); setDropdownOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                        >
                          Saved Jobs
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => {
                        navigate("/applications");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      {t("navigation.applications")}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/saved-jobs");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      {t("navigation.savedJobs")}
                    </button>
                  </div>

                  <div className="py-1 border-b border-border">
                    <button
                      onClick={() => {
                        navigate("/settings");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      {t("navigation.settings")}
                    </button>
                    <button
                      onClick={() => {
                        navigate("/notifications");
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                    >
                      {t("navigation.notifications")}
                    </button>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50 transition cursor-pointer"
                    >
                      {t("home.navigation.logout")}
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
