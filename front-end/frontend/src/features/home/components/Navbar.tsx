import { useAppTranslation } from "@/shared/hooks/useAppTranslation";
import { useAuth } from "@/features/auth/context/useAuth";

export function Navbar() {
  const { t } = useAppTranslation();
  const { user } = useAuth();

  // hide public nav links for headhunters (case-insensitive)
  if (user?.role?.toLowerCase() === "headhunter") return null;

  return (
    <nav className="hidden md:flex items-center gap-8">
      <a
        href="/jobs"
        className="text-sm font-medium hover:text-emerald-600 transition"
      >
        {t("navigation.jobs")}
      </a>
      <a
        href="/forum-posts"
        className="text-sm font-medium hover:text-emerald-600 transition"
      >
        {t("navigation.forum")}
      </a>
      <a
        href="#recommended"
        className="text-sm font-medium hover:text-lime-800 transition"
      >
        {t("navigation.recommended")}
      </a>

      <a
        href="#top-companies"
        className="text-sm font-medium hover:text-lime-800 transition"
      >
        {t("navigation.topCompanies")}
      </a>

      <a
        href="#featured-jobs"
        className="text-sm font-medium hover:text-lime-800 transition"
      >
        {t("navigation.featuredJobs")}
      </a>
    </nav>
  );
}
