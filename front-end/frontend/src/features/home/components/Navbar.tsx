import { Link } from "react-router-dom";
import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { useAuth } from "@/features/auth/context/useAuth";

export function Navbar() {
  const { t } = useAppTranslation();
  const { user } = useAuth();

  if (user?.role?.toLowerCase() === "headhunter") return null;

  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link
        to="/jobs"
        className="text-sm font-medium hover:text-lime-500 transition-colors"
      >
        {t("navigation.jobs")}
      </Link>

      <Link
        to="/forum-posts"
        className="text-sm font-medium hover:text-lime-500 transition-colors"
      >
        {t("navigation.forum")}
      </Link>

      <a
        href="#recommended"
        className="text-sm font-medium hover:text-lime-500 transition-colors"
      >
        {t("navigation.recommended")}
      </a>

      <a
        href="#top-companies"
        className="text-sm font-medium hover:text-lime-500 transition-colors"
      >
        {t("navigation.topCompanies")}
      </a>

      <a
        href="#featured-jobs"
        className="text-sm font-medium hover:text-lime-500 transition-colors"
      >
        {t("navigation.featuredJobs")}
      </a>
    </nav>
  );
}
