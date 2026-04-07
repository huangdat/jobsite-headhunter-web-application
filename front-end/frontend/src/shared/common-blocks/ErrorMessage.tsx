import { useTranslation } from "react-i18next";

export function ErrorMessage() {
  const { t } = useTranslation();
  return <>{t("errors.editorFailedToLoad")}</>;
}
