import { useAppTranslation } from "@/shared/hooks/useAppTranslation";

export function Navbar() {
  const { t } = useAppTranslation();

  return (
    <nav className="hidden md:flex items-center gap-8">
      <a
        href="#recommended"
        className="text-sm font-medium hover:text-lime-800 transition"
      >
        {t("home.navigation.recommended")}
      </a>

      <a
        href="#top-companies"
        className="text-sm font-medium hover:text-lime-800 transition"
      >
        {t("home.navigation.topCompanies")}
      </a>

      <a
        href="#featured-jobs"
        className="text-sm font-medium hover:text-lime-800 transition"
      >
        {t("home.navigation.featuredJobs")}
      </a>
    </nav>
  );
}
