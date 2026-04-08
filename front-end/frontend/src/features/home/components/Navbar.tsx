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
        className="text-sm font-medium hover:text-brand-primary transition"
      >
        {t("navigation.jobs")}
      </a>
      <a
        href="/forum-posts"
        className="text-sm font-medium hover:text-brand-primary transition"
      >
        {t("navigation.forum")}
      </a>
      <a
        href="/home#recommended"
        className="text-sm font-medium hover:text-brand-primary transition"
      >
        {t("navigation.recommended")}
      </a>

      <a
        href="/home#top-companies"
        className="text-sm font-medium hover:text-brand-primary transition"
      >
        {t("navigation.topCompanies")}
      </a>

      <a
        href="/home#featured-jobs"
        className="text-sm font-medium hover:text-brand-primary transition"
      >
        {t("navigation.featuredJobs")}
      </a>
    </nav>
  );
}
