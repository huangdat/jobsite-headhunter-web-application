import { useAppTranslation } from "@/shared/hooks/useAppTranslation";

export function Footer() {
  const { t } = useAppTranslation();
  return (
    <footer className="text-center bg-slate-900 text-slate-400 py-6">
      <p className="text-xs text-slate-400">
        {t("home.footer.copyright").replace("{year}", new Date().getFullYear().toString())}
      </p>
    </footer>
  );
}
