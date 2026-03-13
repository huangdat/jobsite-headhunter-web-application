import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineHandshake } from "react-icons/md";
import { useAuth } from "@/features/auth/context/useAuth";

export function Navbar() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user } = useAuth();
  const userInitial = useMemo(
    () => user?.username?.charAt(0).toUpperCase() || "U",
    [user?.username],
  );

  const handleLogout = async () => {
    await signOut();
    navigate("/home");
  };

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
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#recommended"
              className="text-sm font-medium hover:text-lime-800 transition"
            >
              Recommended
            </a>

            <a
              href="#top-companies"
              className="text-sm font-medium hover:text-lime-800 transition"
            >
              Top Companies
            </a>

            <a
              href="#featured-jobs"
              className="text-sm font-medium hover:text-lime-800 transition"
            >
              Featured Jobs
            </a>
          </nav>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium hover:text-lime-800 transition"
              >
                Login
              </Link>

              <Link
                to="/select-role"
                className="bg-brand-primary text-black px-6 py-2 rounded-full text-sm font-semibold hover:bg-brand-hover transition"
              >
                Sign Up
              </Link>

              <Link
                to="/register/headhunter"
                className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition"
              >
                Post a Job
              </Link>
            </>
          ) : (
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-black font-semibold cursor-pointer">
                {userInitial}
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-40 bg-white border border-border rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
