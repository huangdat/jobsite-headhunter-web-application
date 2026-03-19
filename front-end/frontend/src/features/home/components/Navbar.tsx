import { useHomeTranslation } from "@/shared/hooks";

export function Navbar() {
  const { t } = useHomeTranslation();

  return (
    <nav className="hidden md:flex items-center gap-8">
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
