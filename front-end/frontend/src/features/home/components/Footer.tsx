import { useHomeTranslation } from "@/shared/hooks";

export function Footer() {
  const { t } = useHomeTranslation();
  return (
    <footer className="text-center bg-slate-900 text-slate-400 py-6">
      <p className="text-xs text-slate-400">
        {t("footer.copyright").replace(
          "{year}",
          new Date().getFullYear().toString()
        )}
      </p>
    </footer>
  );
}
